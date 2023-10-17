import { Component, OnInit , Input} from '@angular/core';
import { Category} from 'src/app/services/category.service';
import { ProductFilterService } from 'src/app/services/product-filter.service';


@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent {

  @Input() category?: Category;
  @Input() depth: number = 0;
  public expandedCategories: { [key: string]: boolean } = {};


  constructor(private productFilterService:ProductFilterService){
  
  }

  ngOnInit(){
    if(!this.category){
    this.productFilterService.getFilteredProducts().subscribe((category)=>
    this.category = category)}

  }

 

  logAccordionToggle(category: any): void {
    console.log('Accordion toggled for category:', category);
}

onShown() {
  console.log('Collapse was shown');
}

onHidden() {
  console.log('Collapse was hidden');
}




}
