import { Component, Input } from '@angular/core';
import { Category } from 'src/app/services/category.service';
import { ProductService, Product } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent {

  @Input() categoryItem!: Category;
  productItem?: Product

  constructor(private productService: ProductService){}

  ngOnInit(){
  if (!this.categoryItem) {
    throw new Error('categoryItem is required');
  }

  this.productService.getProduct(this.categoryItem.id).subscribe((product) => this.productItem = product)

}


get price(): number | undefined {
  const priceStr = this.productItem?.extra?.['AGA']?.PRI;
  return priceStr ? parseFloat(priceStr.trim()) : undefined;
}

get stock(): string | undefined {
  const stockStr = this.productItem?.extra?.['AGA']?.LGA;
  return (parseFloat(stockStr.trim()) >  0 ) ? 'Available' : 'Not in Stock';
}

get stockValue(): string | undefined {
  const stockStr = this.productItem?.extra?.['AGA']?.LGA;
  return stockStr;
}

get volume(): number | undefined {
  const volumeStr = this.productItem?.extra?.['AGA']?.VOL;
  return volumeStr ? parseFloat(volumeStr.trim()) : undefined;
}

}
