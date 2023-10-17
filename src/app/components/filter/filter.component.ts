
import { Component } from '@angular/core';
import { ProductFilterService } from 'src/app/services/product-filter.service';



@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']})
export class FilterComponent {

  minPrice: number = 0;

  constructor(private productFilterService: ProductFilterService) {}

  applyFilter(){
    this.productFilterService.setCriteriaMinPrice(this.minPrice)
  }

}
