// shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ViewToggleService {

  
  private viewModeSubject = new BehaviorSubject<'sort' | 'category'>('sort');
  private sortPropertySubject = new BehaviorSubject<'stock' | 'volume'>('stock');

  viewMode$ = this.viewModeSubject.asObservable();
  sortProperty$ = this.sortPropertySubject.asObservable();

  toggleView(view: 'sort' | 'category', sortProperty?: 'stock' | 'volume'): void {
    this.viewModeSubject.next(view);
    if (sortProperty) {
      
      this.sortPropertySubject.next(sortProperty);
    }
  }
}