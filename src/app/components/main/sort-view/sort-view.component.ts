import { Component,Input,OnInit} from '@angular/core';

import { ProductFilterService } from 'src/app/services/product-filter.service';
import { Product } from 'src/app/services/product.service';
import { Category } from 'src/app/services/category.service';
import { finalize,tap} from 'rxjs';
import { ViewToggleService } from 'src/app/services/view-toggle.service';


@Component({
  selector: 'app-sort-view',
  templateUrl: './sort-view.component.html',
  styleUrls: ['./sort-view.component.css']
})
export class SortViewComponent {
  sortProperty? : "stock" | "volume"
  categories?: Category | boolean
  products: Category[] = [];

  productData$?: Product[];

  constructor(private productFilterService: ProductFilterService, private viewToggleService:ViewToggleService){}

  ngOnInit(){
    this.viewToggleService.sortProperty$.subscribe(sortProperty => {this.sortProperty = sortProperty,this.sortProducts()})

    this.productFilterService.filteredCategories$.pipe(
      tap(value => console.log("test", value))
    ).subscribe(categories => {
      this.products = [];
      this.categories = categories;
      this.extractProductsCheck(categories);
      
    });

    this.productFilterService.cachedProducts$.subscribe(products =>
      this.productData$ = products);
      this.sortProducts()
  }

  sortProducts() {


    console.log('Before Sorting:', this.products);
    // Ensure there are products to sort
    if (this.products && this.products.length > 0 && this.productData$ && this.productData$.length > 0) {
      // Create a map of product data for easy lookup by id
      const productDataMap = new Map<string, Product>(this.productData$.map(product => [product.id, product]));
      
      // Sort the products array in place
      this.products = [...this.products.sort((a, b) => {
        // Retrieve the corresponding Product data for each Category
        const productDataA = productDataMap.get(a.id);
        const productDataB = productDataMap.get(b.id);
        
        // Ensure the product data was found for both categories
        if (!productDataA || !productDataB) {
          console.error('Missing product data for category', a.id, b.id);
          return 0; // Return 0 to indicate no difference (i.e., don't change order)
        }
        
        let sortValueA: number | undefined;
        let sortValueB: number | undefined;
        
        // Determine the property to sort by
        switch(this.sortProperty) {
          case 'stock':
            // Utilize the stockValue retrieval logic
            sortValueA = parseFloat(productDataA.extra?.['AGA']?.LGA?.trim() || '0');
            sortValueB = parseFloat(productDataB.extra?.['AGA']?.LGA?.trim() || '0');
            console.log(sortValueA, sortValueB)
            break;
          case 'volume':
            // Utilize the volume retrieval logic
            sortValueA = parseFloat(productDataA.extra?.['AGA']?.VOL?.trim() || '0');
            sortValueB = parseFloat(productDataB.extra?.['AGA']?.VOL?.trim() || '0');
            break;
          default:
            console.error('Unknown sort property:', this.sortProperty);
            return 0; // Return 0 to indicate no difference (i.e., don't change order)
        }
        
        // Perform the actual comparison, ensuring values are defined, else returning 0 (no change)
        if (sortValueA !== undefined && sortValueB !== undefined) {
          if (sortValueA > sortValueB) {
            return -1;  // Return 1 to indicate a should come after b
          } else if (sortValueA < sortValueB) {
            return 1;  // Return -1 to indicate a should come before b
          }
        }
        return 0;  // Return 0 to indicate no difference (i.e., don't change order)
      })];
    } else {
      console.warn('No products to sort or no product data available');
    }
    console.log('After Sorting:', this.products);
  };




private  extractProductsCheck(category:Category|boolean){
  console.log("extractCheck", category)
  if (this.categories && typeof this.categories !== 'boolean') {
    this.extractProducts(this.categories);
  }
  console.log("extractFinish",this.products)
}


private extractProducts(category:Category){
  console.log(category)
  if(category.id.startsWith("s") && category.children.length>0){ 

  category.children.forEach(category => this.extractProducts(category))

  }

  if(!category.id.startsWith("s")){
    this.products.push(category)
  }

}





}
