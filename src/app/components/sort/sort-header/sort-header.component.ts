import { Component } from '@angular/core';
import { ViewToggleService } from 'src/app/services/view-toggle.service';

@Component({
  selector: 'app-sort-header',
  templateUrl: './sort-header.component.html',
  styleUrls: ['./sort-header.component.css']
})
export class SortHeaderComponent {
  constructor(private viewToggleService: ViewToggleService) {}
  selectedView: 'sort' | 'category' = 'sort';  // Default to 'category'
selectedSortProperty: 'stock' | 'volume' | null = 'stock';  // Default to null

toggleView(view: 'sort' | 'category', sortProperty?: 'stock' | 'volume'): void {
  this.selectedView = view;
  this.selectedSortProperty = sortProperty || null;
  this.viewToggleService.toggleView(view, sortProperty);
}


  // Inside your component class



}