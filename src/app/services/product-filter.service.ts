import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, filter, mergeMap, defaultIfEmpty ,tap} from 'rxjs/operators';
import { CategoryService, Category } from './category.service'; 
import { ProductService, Product } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductFilterService {

  //defaultFilter before userInput, make subject in order to make filter update reactive to update filter
  private _currentCriteria  = new BehaviorSubject<FilterCriteria>( {
    isAvailable: false,
    minPrice: null,
    name: null,
    id: null,
    volumeMin: null,
    volumeMax: null,
    categories: null

  });

  private currentCriteria$ = this._currentCriteria.asObservable();

  set currentCriteria (criteria: FilterCriteria){
    
    this._currentCriteria.next(criteria)
   
  }


  
  
  private  dbInitialCategories?: Category;
  private _cachedProducts = new BehaviorSubject<Product[]>([]);
  cachedProducts$ = this._cachedProducts.asObservable();


  //Filtered Categories updates whenever a change is made to filterCriteria
  public filteredCategories$: Observable <Category | boolean > = this._currentCriteria.pipe( 
    //SwitchMap aborts processes whenever a change is made to criteria, retrives the product Data whenever a new filter should be applied
    switchMap(criteria => this.categoryService.getCategories()),
    //Flattens the recursive applyFilter which produces Observables, into a single stream
    mergeMap(rootCategory => this.applyFilter(this.dbInitialCategories!, 0)),
     //flatten the observables
    
    //Filter out empty categories Redundant
    filter(category => !!category), // filter out the undefined values
)


  


  constructor(private categoryService: CategoryService, private productService:ProductService) {
    
    //dbInitialCategories is continiously updated with regards to the product databaseState
    this.categoryService.getCategories().subscribe(category => this.dbInitialCategories = category);

    //DEBUG
    this.filteredCategories$.subscribe(filteredCategory => {
       //console.log('Category based on criteria:', filteredCategory);
  });

  }


  private applyFilter(category :Category, depth:number): Observable<Category | boolean> {
  
    
    
     // If it's a category...
    if (category.id.startsWith("s")) { // If it's a category...
      //console.log(this.extractAllCategories(category))
      if(depth != 0 && !this.categoryMatchesCriteria(category)){return of().pipe(defaultIfEmpty(false))}

      
      const childrenObservables: Observable<Category | boolean>[] = category.children.map(child => this.applyFilter(child, depth+1));
      let children = forkJoin(childrenObservables).pipe(
          map(filteredChildren => {
                  // Create a  subCategory with filtered children
                  const subCategory = {
                      ...category,
                      children: filteredChildren.filter(child => child !== false) as Category[] // Removing any null or undefined child categories
                  };

                  // If the  subCategory has any valid children left after filtering, return it.
                  // This ensures categories that have subcategories or products get returned.
                  if (subCategory.children.length > 0) {
                    return subCategory;
                }
                if (subCategory.children.length == 0) {
                  return false;
              }
                  // If the category does not have valid children but matches the criteria, return it.
                  if (this.categoryMatchesCriteria(subCategory)) {
                      return subCategory;
                  }

                  // If the category does not match the criteria and has no valid children, return null.
                  return false ;
              }),
          //filter(cat => !!cat),
          defaultIfEmpty(false)
          
      );

      return children.pipe( defaultIfEmpty(false))
    }
     else 
     { // If it's a product...
    return this.applyFilterProduct(category).pipe(defaultIfEmpty(false));
  }
  }





  private applyFilterProduct(category: Category): Observable<Category | boolean> {
     // Check if the product is already cached
     const cachedProduct = this._cachedProducts.getValue().find(product => product.id === category.id);
    
    if (cachedProduct) {      
        // If the product is found in cache, check if it matches the criteria and return the category
        if (this.productMatchesCriteria(cachedProduct)) {
            return of(category);
        } else {
            return of().pipe(defaultIfEmpty(false));
        }
    } else {
        // If the product is not found in cache, make a request to the server
        return this.productService.getProduct(category.id).pipe(
            switchMap(product => {
                // Store the retrieved product in the cache
                const updatedCache = [...this._cachedProducts.getValue(), product];
                this._cachedProducts.next(updatedCache);

                // Check if the product matches the criteria and return the category
                if (this.productMatchesCriteria(product)) {
                    return of(category);
                } else {
                    return of().pipe(defaultIfEmpty(false));
                }
            })
        );
    }
}



extractAllCategories(category?: Category): string[] {
  if(!category){category=this.dbInitialCategories!}
  if (!category.id.startsWith("s")) { return []; }

  let categoryList: string[] = [category.name];

  if (category.children.length > 0) {
    category.children.forEach(child => {
      categoryList = categoryList.concat(this.extractAllCategories(child));
    });
  }

  return categoryList;
}

private categoryMatchesCriteria(category: Category): boolean {
  
  const criteria = this._currentCriteria.getValue();

  if(!criteria.categories){return true}
  
  // Extract all category names from the given category hierarchy
  const categories = this.extractAllCategories(category);
  
  // Check if any of the extracted categories are in the criteria categories
  const isAnyCategoryMatching = categories.some(catName => criteria.categories!.includes(catName));
  
  return isAnyCategoryMatching;
}

  

  private productMatchesCriteria(product: Product): boolean {

    const criteria = this._currentCriteria.getValue();

    // Check name
    if (criteria.name) {
        if (!product.name.toLowerCase().includes(criteria.name.toLowerCase())) {
            return false;
        }
    }

    // Check minPrice
    if (criteria.minPrice) {

        const productPrice = product.extra?.['AGA'].PRI

        if (productPrice < criteria.minPrice) {
            return false;
        }
    }

    // Check availability
    if (criteria.isAvailable) {

        const productAvailable = product.extra?.['AGA']?.LGA > 0;
        
        if (productAvailable !== criteria.isAvailable) {
            return false;
        }
    }

    // Check id
    if (criteria.id) {
      if (!product.id.toLowerCase().includes(criteria.id.toLowerCase())) {
        return false;
    }
    }

    // Check volumeMin
    if (criteria.volumeMin) {
        if (product.extra?.['AGA']?.VOL < criteria.volumeMin) {
            return false;
        }
    }

    // Check volumeMax
    if (criteria.volumeMax) {
        if (product.extra?.['AGA']?.VOL > criteria.volumeMax) {
            return false;
        }
    }

    // If all checks passed, the product matches the criteria
    return true;
}




private updateCriteria<K extends keyof FilterCriteria>(key: K, value: FilterCriteria[K]): void {
  let currentCriteria: FilterCriteria = this._currentCriteria.getValue();
  this._currentCriteria.next({ ...currentCriteria, [key]: value });
}

setCriteriaAvailable(isAvailable: boolean): void {
  this.updateCriteria('isAvailable', isAvailable);
}

setCriteriaMinPrice(minPrice: number): void {
  this.updateCriteria('minPrice', minPrice);
}

setCriteriaVolume(volumeMin: number, volumeMax: number): void {
  this.updateCriteria('volumeMin', volumeMin);
  this.updateCriteria('volumeMax', volumeMax);
}

setCriteriaId(id: string): void {
  this.updateCriteria('id', id);
}

setCriteriaName(name: string): void {
  this.updateCriteria('name', name);
}

setCriteriaCategories(categories: string[]): void {
  this.updateCriteria('categories', categories.length ? categories : null);
}



}



interface FilterCriteria {
  name: string | null;
  minPrice: number | null;
  isAvailable: boolean | null;
  id: string | null;
  volumeMin: number | null;
  volumeMax: number  | null;
  categories: String[]|null;

  // Add more filtering criteria as needed
}
