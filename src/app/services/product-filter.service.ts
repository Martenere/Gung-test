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
 set currentCriteria (criteria: FilterCriteria){ 
    this._currentCriteria.next(criteria)  
  }
  //Not used, but could be used to update filter components if multiple components can adjust the same filter
  private currentCriteria$ = this._currentCriteria.asObservable();


  private  dbInitialCategories?: Category;
  private _cachedProducts = new BehaviorSubject<Product[]>([]);
  cachedProducts$ = this._cachedProducts.asObservable();


  //Filtered Categories updates whenever a change is made to filterCriteria
  //SwitchMap aborts processes whenever a change is made to criteria, retrives the product Data whenever a new filter should be applied
  //Flattens the recursive applyFilter which produces Observables, into a single stream
  //Filter out empty categories Redundant
  public filteredCategories$: Observable <Category | boolean > = this._currentCriteria.pipe( 
    switchMap(criteria => this.categoryService.getCategories()),
    mergeMap(rootCategory => this.applyFilter(this.dbInitialCategories!, 0)),     //flatten the observables
    filter(category => !!category), // filter out the undefined values
)


  


  constructor(private categoryService: CategoryService, private productService:ProductService) {
    
    //dbInitialCategories is continiously updated with regards to the product databaseState
    //if categoryService implements a update categories function, the filter will be kept up to date
    this.categoryService.getCategories().subscribe(category => this.dbInitialCategories = category);

    //DEBUG
    this.filteredCategories$.subscribe(filteredCategory => {
       //console.log('Category based on criteria:', filteredCategory);
  });

  }


  private applyFilter(category: Category, depth: number): Observable<Category | boolean> {
    //Recursively filter the category tree, fetching categoies and products that match criteria
    //Only gathers Observables, in order to be able to fetch product data if it has not been cached/retrieved previously
    //NOTE: Observable doesnt emit any value if all products are filtered out currently
    // Check if the current item is a category
    if (category.id.startsWith("s")) {

        // Skip root category and filter out non-matching subcategories
        if (depth != 0 && !this.categoryMatchesCriteria(category)) {
            return of().pipe(defaultIfEmpty(false));
        }

        // Generate observables for child items (be it categories or products)
        const childrenObservables: Observable<Category | boolean>[] = category.children.map(child => this.applyFilter(child, depth + 1));
        
        // Combine results from all child observables
        //forkjoin joins all children observables, and emits a list of values when they all complete
        let children = forkJoin(childrenObservables).pipe(
            map(filteredChildren => {
                // Reconstruct category with filtered children
                const subCategory = {
                    ...category,
                    children: filteredChildren.filter(child => child !== false) as Category[]
                };

                // If there are valid child categories or products, return the category
                if (subCategory.children.length > 0) {
                    return subCategory;
                }

                // If the category matches the filter criteria, return it
                if (this.categoryMatchesCriteria(subCategory)) {
                    return subCategory;
                }

                // If not, return false to filter it out
                return false;
            }),
            defaultIfEmpty(false)
        );

        return children.pipe(defaultIfEmpty(false));
        
    } else {
        // If the current item is a product, apply the product filter
        return this.applyFilterProduct(category).pipe(defaultIfEmpty(false));
    }
}






  private applyFilterProduct(category: Category): Observable<Category | boolean> {

    //Search cache for product data, if it doesnt exist, fetch it
    //filter out product with productMatchesCriteria()
    const cachedProducts = this._cachedProducts.getValue();
    const cachedProduct = cachedProducts.find(product => product.id === category.id);
    
    if (cachedProduct) {      
        return this.productMatchesCriteria(cachedProduct) ? of(category) : of(false);
    } else {

        //if the data for the products isnt cached, get it from productService
        return this.productService.getProduct(category.id).pipe(
            tap(product => {
                // Store the retrieved product in the cache when retrieved
                this._cachedProducts.next([...cachedProducts, product]);
            }),
            switchMap(product => {
                return this.productMatchesCriteria(product) ? of(category) : of(false);
            })
        );
    }
}



extractAllCategories(category?: Category): string[] {
  //Recursively exract all category and subcategory names into a single string List
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



//Criteria updater and setters of each criteria
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
