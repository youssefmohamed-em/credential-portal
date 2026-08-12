import { Component } from '@angular/core';
import { HeaderButton, HeaderComponent } from "../shared/header/header.component";

@Component({
  selector: 'app-products',
  imports: [HeaderComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
 headerButton: HeaderButton = {
    label: 'Add Product',
    icon: 'pi-plus',
    action: () => this.addProduct()
  };

   addProduct() {
    console.log('Add Product');
  }
}
