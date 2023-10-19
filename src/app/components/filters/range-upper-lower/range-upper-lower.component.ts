import { Component } from '@angular/core';
import { ProductFilterService } from 'src/app/services/product-filter.service';


@Component({
  selector: 'app-range-upper-lower',
  templateUrl: './range-upper-lower.component.html',
  styleUrls: ['./range-upper-lower.component.css']
})

export class RangeUpperLowerComponent {
  lowerValue: number = 0;
  upperValue: number = 10;

  constructor(private productFilterService: ProductFilterService){}

  onInputChange(event: any, which: string) {
    const value = +event.target.value;  // Convert string to number

    if (which === 'lower') {
      if (value >= this.upperValue) {
        // If the new lower value is greater or equal to the upper value,
        // set the lower value to the upper value minus a step (e.g., 1)
        this.lowerValue = this.upperValue - 0.1;
        // Optionally, adjust the upper value as well
        this.upperValue = this.lowerValue + .2;  // E.g., increase by a step of 2
      } else {
        // Otherwise, simply update the lower value
        this.lowerValue = value;
      }
    } else {
      if (value <= this.lowerValue) {
        // If the new upper value is less or equal to the lower value,
        // set the upper value to the lower value plus a step (e.g., 1)
        this.upperValue = this.lowerValue + .1;
        // Optionally, adjust the lower value as well
        this.lowerValue = this.upperValue - .2;  // E.g., decrease by a step of 2
      } else {
        // Otherwise, simply update the upper value
        this.upperValue = value;
      }
    }
    this.lowerValue = parseFloat(this.lowerValue.toFixed(1))
    this.upperValue = parseFloat(this.upperValue.toFixed(1))
    this.applyFilter()

  }
applyFilter(){
  this.productFilterService.setCriteriaVolume(this.lowerValue, this.upperValue)
}


}

