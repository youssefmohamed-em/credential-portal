import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HeaderButton, HeaderComponent } from "../shared/header/header.component";
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translate.service';
import { Toast } from "primeng/toast";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-products',
  imports: [HeaderComponent, CommonModule, Toast],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  showOpenModal = signal(false);
  selectedProduct = signal<any | null>(null);
  private productService = inject(ProductService);
  public translation = inject(TranslationService);
   private messageService =  inject(MessageService);
  products: any[] = [];

 headerButtons  = computed<HeaderButton[]> ( ()=>[
    {
    label: this.translation.translate('PRODUCTS.ADD'),
    icon: 'pi-plus',
    action: () => this.addProduct()
  },
  {
    label: this.translation.translate('COMMON.REFRESH'),
    icon: 'pi-refresh',
    action: () => this.getProducts()
  }
 ])

  ngOnInit(): void {
    this.getProducts();
  }

    addProduct(): void {

    this.selectedProduct.set(null);
    this.showOpenModal.set(true);
  }

   openProductModal(product: any): void {
    this.selectedProduct.set(product);
    this.showOpenModal.set(true);
  }

  closeModal() {
    this.showOpenModal.set(false);
    this.selectedProduct.set(null);
  }

  onProductSaved() {
    this.closeModal();
    this.getProducts(); // يحدث القائمة بعد الإضافة
  }

  getProducts() {
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res.items;
      },
    error: (error) => {
  this.messageService.add({
    severity: 'error',
    summary: this.translation.translate('MESSAGES.ERROR'),
    detail:
      error?.error?.message ||
      error?.error?.error ||
      `Error ${error?.status}`,
    life: 4000
  });

  console.log(error);
}
    });
  }

  toggleLanguage() {
    this.translation.toggleLang();
  }
}
