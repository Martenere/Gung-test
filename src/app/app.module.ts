import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductViewComponent } from './components/main/product-view/product-view.component';
import { ProductItemComponent } from './components/main/product-item/product-item.component';
import { ViewComponent } from './components/view/view.component';
import { FilterComponent } from './components/filter/filter.component';
import { IsAvailableComponent } from './components/filters/is-available/is-available.component';


@NgModule({
  declarations: [
    FilterComponent,
    AppComponent,
    ProductViewComponent,
    ProductItemComponent,
    ViewComponent,
    IsAvailableComponent
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
