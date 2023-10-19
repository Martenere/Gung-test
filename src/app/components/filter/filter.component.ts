
import { Component } from '@angular/core';
import { ProductFilterService } from 'src/app/services/product-filter.service';



@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']})
export class FilterComponent {
  
  
  sections: { [key: string]: boolean } = {
    idFilter: false,
    nameFilter: false,
    range: false,
    isAvailable: false,
    rangeUpperLower: false,
    categoryDropdownFilter: false
  };

  toggleSection(section: string) {
    this.sections[section] = !this.sections[section];
  }

constructor(private productFilterService:ProductFilterService){
  this.setCriteriaFilterId = this.setCriteriaFilterId.bind(this);
  
  this.setCriteriaFilterName = this.setCriteriaFilterName.bind(this);
};



setCriteriaFilterId(id: string): void {
  this.productFilterService.setCriteriaId(id);    
}

setCriteriaFilterName(name: string): void {
  this.productFilterService.setCriteriaName(name);    
}

}
