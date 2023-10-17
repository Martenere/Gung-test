import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryService, Category } from './category.service'; 
import { ProductService, Product } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductFilterService {

  //defaultFilter before userInput
  private _currentCriteria: FilterCriteria = {
    isAvailable: false,
    minPrice: 0,
    name: '',
    id: '',
    volumeMin: 0,
    volumeMax: 0
  };

  set currentCriteria (criteria: FilterCriteria){
    this._currentCriteria = criteria;
    
    console.log(this._currentCriteria)

    let categories = this.dbInitialCategories!;

    this.filteredCategories$

    this.applyFilterToRoot(categories);
    
    console.log(this.filteredCategoriesSubject.getValue())



   
  }

  get currentCriteria(): FilterCriteria {
    return this._currentCriteria;
}


  // Rename this to be clearer about its intent
  private  dbInitialCategories?: Category;
  private filteredCategoriesSubject = new BehaviorSubject <Category | null> (null);
  public filteredCategories$ = this.filteredCategoriesSubject.asObservable()


  constructor(private categoryService: CategoryService, private productService:ProductService) {
    // Initialize your dbInitialCategories source by subscribing to getCategories
    this.categoryService.getCategories().subscribe(category => this.dbInitialCategories = category);
  }


  applyFilterToRoot(category :Category): Category | void {
        let categoryReturn: Category ={ id:category.id, name:category.name, children: []}

          if(category.id.startsWith("s")){

            category.children.forEach(child => {
              console.log(child)
              if(child){categoryReturn.children.push(child)}
              
              
              }
            )
            return categoryReturn
          }
          if(!category.id.startsWith("s")){

            if(this.productMatchesCriteria(category)){
              
              return category

            }
            
          }
          
  }
  ;

  productMatchesCriteria(category:Category): boolean{
    let product: Product = this.productService.getProduct(category.id)

    product.extra.['AGA'].LGA

    return false
  }

  getFilteredCategories(): Observable<Category> {
    
    if (!this.filteredCategoriesSubject.getValue()){
      return this.categoryService.getCategories();
    }
    // @ts-ignore
    return this.filteredCategories$;
  } 




  setCriteriaAvailable(isAvailable: boolean) {
    console.log("update Available: " + isAvailable);

    let _criteria: FilterCriteria = this.currentCriteria
    _criteria.isAvailable = isAvailable;

    this.currentCriteria= _criteria;
    
  }

  setCriteriaMinPrice(minPrice: number) {
    console.log("update criteria: " + minPrice);
    // If you want to update the minPrice property only, you can do:
    this.currentCriteria.minPrice = minPrice;

  }
}



interface FilterCriteria {
  name: string;
  minPrice: number;
  isAvailable: boolean;
  id: string;
  volumeMin: number;
  volumeMax: number;
  category?: String[];

  // Add more filtering criteria as needed
}
