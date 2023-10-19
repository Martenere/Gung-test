import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryViewComponent } from './components/main/category-view/category-view.component';
import { ProductItemComponent } from './components/main/product-item/product-item.component';
import { ViewComponent } from './components/view/view.component';
import { FilterComponent } from './components/filter/filter.component';
import { IsAvailableComponent } from './components/filters/is-available/is-available.component';
import { RangeComponent } from './components/filters/range/range.component';
import { RangeUpperLowerComponent } from './components/filters/range-upper-lower/range-upper-lower.component';
import { TextEntryFieldComponent } from './components/filters/text-entry-field/text-entry-field.component';
import { CategoryDropdownFilterComponent } from './components/filters/category-dropdown-filter/category-dropdown-filter.component';
import { SortHeaderComponent } from './components/sort/sort-header/sort-header.component';
import { SortViewComponent } from './components/main/sort-view/sort-view.component';


@NgModule({
  declarations: [
    FilterComponent,
    AppComponent,
    CategoryViewComponent,
    ProductItemComponent,
    ViewComponent,
    IsAvailableComponent,
    RangeComponent,
    RangeUpperLowerComponent,
    TextEntryFieldComponent,
    CategoryDropdownFilterComponent,
    SortHeaderComponent,
    SortViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
