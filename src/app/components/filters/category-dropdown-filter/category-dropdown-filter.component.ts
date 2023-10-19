import { Component } from '@angular/core';
import { ProductFilterService } from 'src/app/services/product-filter.service';



@Component({
  selector: 'app-category-dropdown-filter',
  templateUrl: './category-dropdown-filter.component.html',
  styleUrls: ['./category-dropdown-filter.component.css']
})
export class CategoryDropdownFilterComponent {

  selectedCategories: string[]=[];

  categories = [
      { id: '1', name: 'Category 1', selected: false },
      { id: '2', name: 'Category 2', selected: false },
      //example categories, overwritten in constructor
    ];


  constructor(private productFilterService:ProductFilterService){
    let retrivedCategories = productFilterService.extractAllCategories()

    this.categories =[]
    retrivedCategories.forEach(category => {
      let id = this.categories.length +1;
      this.categories.push({id: id.toString(), name: category, selected:false}); })  
      

  }
  onCategoryChange(category: { selected: any; name: string; }) {
    if (category.selected) {
      this.selectedCategories.push(category.name);
    } else {
      const index = this.selectedCategories.indexOf(category.name);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }

    this.productFilterService.setCriteriaCategories(this.selectedCategories)
  console.log(this.selectedCategories)
  }
}
