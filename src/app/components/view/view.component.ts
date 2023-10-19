import { Component } from '@angular/core';
import { ViewToggleService } from 'src/app/services/view-toggle.service';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {

  viewMode: 'sort' | 'category' = 'sort';
  sortProperty: 'stock' | 'volume' = 'stock';

  constructor(private viewToggleService: ViewToggleService) {}

  ngOnInit(): void {
    this.viewToggleService.viewMode$.subscribe((view: 'sort' | 'category') => this.viewMode = view);
    this.viewToggleService.sortProperty$.subscribe((sortProperty: 'stock' | 'volume') => this.sortProperty = sortProperty);
  }
}
