import { Component, OnInit , Input} from '@angular/core';
import { Category} from 'src/app/services/category.service';
import { ProductFilterService } from 'src/app/services/product-filter.service';


@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent {

  @Input() category: Category |boolean = false;
  @Input() depth: number = 0;
  
  public accordionState: { [key: string]: boolean } = {};



  constructor(private productFilterService:ProductFilterService){

    
  
  }

  ngOnInit(){
    if(!this.category){
    this.productFilterService.filteredCategories$.subscribe((category)=>
    this.category = category!)}


  }

 

  logAccordionToggle(category: any): void {
    console.log('Accordion toggled for category:', category);
    this.accordionState[category] = !this.accordionState[category];
}

getAccordionState(categoryId: string): boolean {
  // Check if the state has been set, if not initialize to true (open)
  if (this.accordionState[categoryId] === undefined) {
    this.accordionState[categoryId] = true;
  }
  return this.accordionState[categoryId];
}

onShown() {
  console.log('Collapse was shown');
}

onHidden() {
  console.log('Collapse was hidden');
}




}
