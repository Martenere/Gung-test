import { Component } from '@angular/core';
import { ViewToggleService } from 'src/app/services/view-toggle.service';

@Component({
  selector: 'app-sort-header',
  templateUrl: './sort-header.component.html',
  styleUrls: ['./sort-header.component.css']
})
export class SortHeaderComponent {
  constructor(private viewToggleService: ViewToggleService) {}

  toggleView(view: 'sort' | 'category', sortProperty?: 'stock' | 'volume'): void {
    this.viewToggleService.toggleView(view, sortProperty);
  }
}