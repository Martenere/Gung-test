import { Component } from '@angular/core';
import { ProductFilterService } from 'src/app/services/product-filter.service';

@Component({
  selector: 'app-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.css']
})
export class RangeComponent {
  rangeValue: number = 0;

  constructor(private productFilterService: ProductFilterService) {}

  applyFilter(){
    this.productFilterService.setCriteriaMinPrice(this.rangeValue)
  }

}
