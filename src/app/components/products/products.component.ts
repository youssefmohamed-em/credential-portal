import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  HeaderButton,
  HeaderComponent
} from '../shared/header/header.component';

import {
  Product,
  ProductPrice,
  ProductsService
} from '../../services/product.service';

import { TranslationService } from '../../services/translate.service';

import { Toast } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import {
  SharedTableAction,
  SharedTableColumn,
  SharedTableComponent
} from '../shared/shared-table/shared-table.component';
import { ConfirmDialog } from 'primeng/confirmdialog';

interface CatalogProduct {
  id?: number | string;
  productReference: string;
  barcode?: string;
  nameEn?: string;
  nameAr?: string;
  category?: { nameEn?: string; nameAr?: string };
  productType?: { nameEn?: string; nameAr?: string };
  purity?: string;
  weightValue?: number | null;
  weightUnit?: string;
}

interface ProductReferenceOption {
  value: string;
  nameEn: string;
  nameAr: string;
  categoryNameEn: string;
  categoryNameAr: string;
  purity: string;
  weightValue: number | null;
  weightUnit: string;
}

@Component({
  selector: 'app-products',
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule,
    Toast,
    SharedTableComponent,
    ConfirmDialog
  ],
  providers: [ConfirmationService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  private productService = inject(ProductsService);
  public translation = inject(TranslationService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  showOpenModal = signal(false);
  selectedProduct = signal<CatalogProduct | null>(null);
  saving = signal(false);

  // Form state for the Add/Edit modal
  formBarcode = signal('');
  formProductReference = signal('');
  productReferences = signal<ProductReferenceOption[]>([]);
  productReferencesLoading = signal(false);
  productPrices = signal<Record<string, ProductPrice>>({});

  products: CatalogProduct[] = [];
  loading = signal(false);
  totalElements = signal(0);
  pageSize = signal(10);
  currentPage = signal(0);

  tableColumns: SharedTableColumn[] = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'name', label: 'PRODUCTS.NAME', value: (product: CatalogProduct) => this.getProductName(product) },
    { key: 'category', label: 'PRODUCTS.CATEGORY', value: (product: CatalogProduct) => this.getProductCategory(product) },
    { key: 'productType', label: 'PRODUCTS.TYPE', value: (product: CatalogProduct) => this.getProductType(product) },
    { key: 'purity', label: 'PRODUCTS.PURITY' },
    { key: 'weight', label: 'PRODUCTS.WEIGHT', value: (product: CatalogProduct) => this.getProductWeight(product) },
    { key: 'liveGoldPrice', label: 'PRODUCTS.LIVE_GOLD_PRICE', value: (product: CatalogProduct) => this.getLiveGoldPrice(product) },
    { key: 'calculatedPrice', label: 'PRODUCTS.CALCULATED_PRICE', value: (product: CatalogProduct) => this.getCalculatedPrice(product) }
  ];

  tableActions: SharedTableAction[] = [
    {
      icon: 'pi pi-pencil',
      label: 'PRODUCTS.EDIT',
      color: 'warning',
      handler: (product: CatalogProduct) => this.openProductModal(product)
    },
    {
      icon: 'pi pi-trash',
      label: 'PRODUCTS.DELETE',
      color: 'danger',
      handler: (product: CatalogProduct) => this.deleteProduct(product)
    }
  ];

  headerButtons = computed<HeaderButton[]>(() => [
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
  ]);

  ngOnInit(): void {
    this.getProducts();
  }

  // =========================
  // Get Products (now sourced from getProductsRefrence)
  // =========================

  getProducts(): void {
    this.loading.set(true);

    this.productService.getProductsRefrence(this.currentPage(), this.pageSize()).subscribe({
      next: (response: unknown) => {
        const result = response as {
          items?: unknown[];
          content?: unknown[];
          data?: { content?: unknown[] } | unknown[];
          totalElements?: number;
          number?: number;
          page?: number;
        };
        const items = (result.items ?? result.content ??
          (Array.isArray(result.data) ? result.data : result.data?.content) ?? []) as CatalogProduct[];

        this.products = items;
        this.totalElements.set(result.totalElements ?? items.length);
        this.currentPage.set(result.page ?? result.number ?? this.currentPage());
        this.loading.set(false);
        this.getProductPrices(items);
      },
      error: (error) => {
        this.products = [];
        this.loading.set(false);

        this.messageService.add({
          severity: 'error',
          summary: this.translation.translate('MESSAGES.ERROR'),
          detail:
            error?.error?.message ||
            error?.error?.error ||
            `Error ${error?.status}`,
          life: 4000
        });

        console.error('Get products error:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.getProducts();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
    this.getProducts();
  }

  // NOTE: getProductsRefrence doesn't currently accept a `sort` param.
  // Add one to the service if server-side sorting is needed; for now this
  // just re-fetches the current page (no-op sort).
  onSortChange(_sort: { key: string; direction: 'asc' | 'desc' }): void {
    this.getProducts();
  }

  getProductPrices(products: CatalogProduct[]): void {
    const productReferences = products
      .map((product) => Number(product.id ?? product.productReference))
      .filter((reference) => Number.isFinite(reference));

    if (!productReferences.length) {
      this.productPrices.set({});
      return;
    }

    this.productService.getProductPrices(productReferences).subscribe({
      next: (prices) => {
        this.productPrices.set(
          prices.reduce<Record<string, ProductPrice>>((priceMap, price) => {
            priceMap[String(price.productReference)] = price;
            return priceMap;
          }, {})
        );
      },
      error: (error) => {
        this.productPrices.set({});
        console.error('Get product prices error:', error);
      }
    });
  }

  // =========================
  // Display helpers
  // =========================

  getProductName(product: CatalogProduct): string {
    return this.translation.lang() === 'ar'
      ? product.nameAr || product.nameEn || '-'
      : product.nameEn || product.nameAr || '-';
  }

  getProductCategory(product: CatalogProduct): string {
    return this.translation.lang() === 'ar'
      ? product.category?.nameAr || product.category?.nameEn || '-'
      : product.category?.nameEn || product.category?.nameAr || '-';
  }

  getProductType(product: CatalogProduct): string {
    return this.translation.lang() === 'ar'
      ? product.productType?.nameAr || product.productType?.nameEn || '-'
      : product.productType?.nameEn || product.productType?.nameAr || '-';
  }

  getProductWeight(product: CatalogProduct): string {
    return product.weightValue == null ? '-' : `${product.weightValue} ${product.weightUnit ?? ''}`.trim();
  }

  getLiveGoldPrice(product: CatalogProduct): number | string {
    return this.productPrices()[String(product.id ?? product.productReference)]?.liveGoldPrice ?? '-';
  }

  getCalculatedPrice(product: CatalogProduct): number | string {
    return this.productPrices()[String(product.id ?? product.productReference)]?.calculatedPrice ?? '-';
  }

  // =========================
  // Add Product
  // =========================

  addProduct(): void {
    this.selectedProduct.set(null);
    this.formBarcode.set('');
    this.formProductReference.set('');
    this.loadProductReferences();
    this.showOpenModal.set(true);
  }

  // =========================
  // Open Product Modal (Edit)
  // =========================

  openProductModal(product: CatalogProduct): void {
    this.selectedProduct.set(product);
    const selectedReference = String(product.productReference ?? '');
    const selectedBarcode = String(product.barcode ?? '');

    this.formBarcode.set(selectedBarcode);
    this.formProductReference.set(selectedReference);

    this.loadProductReferences();
    this.showOpenModal.set(true);
  }

  // =========================
  // Close Modal
  // =========================

  closeModal(): void {
    this.showOpenModal.set(false);
    this.selectedProduct.set(null);
    this.formBarcode.set('');
    this.formProductReference.set('');
  }

  // =========================
  // Load catalog options for the card picker inside the modal
  // =========================

  private loadProductReferences(): void {
    this.productReferencesLoading.set(true);

    this.productService.getProductsRefrence(0, 12).subscribe({
      next: (response: unknown) => {
        const result = response as {
          items?: unknown[];
          content?: unknown[];
          data?: { content?: unknown[] } | unknown[];
        };
        const items = result.items ?? result.content ??
          (Array.isArray(result.data) ? result.data : result.data?.content) ?? [];

        const mappedReferences = items.map((item: any) => {
          const value = String(
            item.productReference ?? item.reference ?? item.code ?? item.id ?? ''
          );
          return {
            value,
            nameEn: item.nameEn ?? item.name ?? item.productName ?? item.title ?? value,
            nameAr: item.nameAr ?? '',
            categoryNameEn: item.category?.nameEn ?? '',
            categoryNameAr: item.category?.nameAr ?? '',
            purity: item.purity ?? '',
            weightValue: item.weightValue ?? null,
            weightUnit: item.weightUnit ?? ''
          };
        }).filter((item) => item.value);

        this.productReferences.set(mappedReferences);

        if (this.selectedProduct()) {
          const currentReference = String(this.selectedProduct()?.productReference ?? '');
          const matchedReference = mappedReferences.find(
            (ref) => ref.value === currentReference
          );

          if (matchedReference) {
            this.formProductReference.set(matchedReference.value);
          } else if (currentReference) {
            this.formProductReference.set(currentReference);
          }
        }

        this.productReferencesLoading.set(false);
      },
      error: (error) => {
        this.productReferences.set([]);
        this.productReferencesLoading.set(false);
        console.error('Get product references error:', error);
      }
    });
  }

  selectProductReference(product: ProductReferenceOption): void {
    this.formProductReference.set(product.value);
  }

  // =========================
  // Save Product (Create or Update)
  // =========================

  saveProduct(): void {

    if (!this.formBarcode().trim() || !this.formProductReference().trim()) {

      this.messageService.add({
        severity: 'warn',
        summary: this.translation.translate('MESSAGES.WARNING'),
        detail: this.translation.translate('MESSAGES.FILL_REQUIRED_FIELDS'),
        life: 3000
      });

      return;
    }

    this.saving.set(true);

    const payload = {
      barcode: this.formBarcode().trim(),
      productReference: this.formProductReference().trim()
    };

    const current = this.selectedProduct();

    // NOTE: update still requires a barcode identifier. If editing a catalog
    // item that has no barcode, this falls back to create instead.
    const request$ = current?.barcode
      ? this.productService.updateProduct(current.barcode, payload)
      : this.productService.createProduct(payload);

    request$.subscribe({

      next: () => {

        this.messageService.add({
          severity: 'success',
          summary: this.translation.translate('MESSAGES.SUCCESS'),
          detail: this.translation.translate(
            current?.barcode ? 'PRODUCTS.UPDATED' : 'PRODUCTS.CREATED'
          ),
          life: 3000
        });

        this.saving.set(false);
        this.onProductSaved();
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

        this.saving.set(false);
        console.error('Save product error:', error);
      }

    });
  }

  // =========================
  // Delete Product
  // =========================

  deleteProduct(product: CatalogProduct): void {

    if (!product.barcode) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translation.translate('MESSAGES.WARNING'),
        detail: this.translation.translate('PRODUCTS.NO_BARCODE_TO_DELETE'),
        life: 3000
      });
      return;
    }

    this.confirmationService.confirm({
      message: this.translation.translate('PRODUCTS.DELETE_CONFIRM'),
      header: this.translation.translate('PRODUCTS.DELETE'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.productService.deleteProduct(product.barcode!).subscribe({

          next: () => {

            this.messageService.add({
              severity: 'success',
              summary: this.translation.translate('MESSAGES.SUCCESS'),
              detail: this.translation.translate('PRODUCTS.DELETED'),
              life: 3000
            });

            this.getProducts();
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

            console.error('Delete product error:', error);
          }

        });
      }
    });
  }

  // =========================
  // Product Saved
  // =========================

  onProductSaved(): void {
    this.closeModal();
    this.getProducts();
  }

  // =========================
  // Language
  // =========================

  toggleLanguage(): void {
    this.translation.toggleLang();
  }
}
