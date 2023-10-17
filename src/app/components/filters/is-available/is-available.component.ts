import { Component } from '@angular/core';
import { ProductFilterService } from 'src/app/services/product-filter.service';

@Component({
  selector: 'app-is-available',
  templateUrl: './is-available.component.html',
  styleUrls: ['./is-available.component.css']
})
export class IsAvailableComponent {
  isAvailable: boolean = false;

  constructor(private productFilterService: ProductFilterService) {}

  applyFilter(){
    this.productFilterService.setCriteriaAvailable(this.isAvailable)
  }

}
