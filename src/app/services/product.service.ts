import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

// =========================================================
// Interfaces
// =========================================================

// ---- Products ----
export interface Product {
  id: number;
  barcode: string;
  productReference: string;
  goldWeight: number;
  purity: string;
  basePriceFormula: string;
  productBoxBarcode: string;
}

export interface CreateProductRequest {
  barcode: string;
  productReference: string;
}

export interface ProductPrice {
  productReference: number;
  liveGoldPrice: number;
  calculatedPrice: number;
}

export interface ProductsResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Product[];
  number: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
  empty: boolean;
}

// ---- Transactions ----
export interface Transaction {
  id: number;
  customerId: number;
  productReference: string;
  machineCode: string;
  status: string;
  lockedPrice: number;
  selectedLanguage: string;
  phoneNumber: string;
}

export interface CreateTransactionRequest {
  machineCode: string;
}

export interface UpdateTransactionItemRequest {
  lockedPrice: number;
  productReference: string;
}

// ---- Product Boxes ----
export interface ProductBox {
  barcode: string;
  productReference: string;
  portId: number;
  machineCode: string;
}

export interface CreateProductBoxRequest {
  barcode: string;
  portId: number;
  productReference: string;
}

// ---- Ports ----
export interface Port {
  id: number;
  machineCode: string;
  portNumber: number;
  boxes: ProductBox[];
}

export interface CreatePortRequest {
  machineCode: string;
  portNumber: number;
}

// ---- Payments ----
export interface Payment {
  id: number;
  orderId: number;
  processorRef: string;
  status: string;
  confirmedAt: string;
}

export interface PaymentWebhookRequest {
  orderId: number;
  processorRef: string;
  status: string;
}

export interface Order {
  id: number;
  transactionId: number;
  amount: number;
  lockedPrice: number;
  currency: string;
  status: string;
}

export interface CreateOrderRequest {
  lockedPrice: number;
  transactionId: number;
  currency: string;
}

// ---- Inventory ----
export interface DispenseAckRequest {
  barcode: string;
  transactionId: number;
}

export interface DispenseAckResponse {
  barcode: string;
  transactionId: number;
  status: string;
}

// ---- Customers ----
export interface Customer {
  id: number;
  phoneNumber: string;
  nationalId: string;
  fullName: string;
  dateOfBirth: string;
  address: string;
  idVerified: boolean;
  kycStatus: string;
}

export interface OcrResultRequest {
  dateOfBirth: string;
  fullName: string;
  nationalId: string;
  address: string;
  rawPayload: string;
}

export interface OcrResultResponse {
  customerId: number;
  kycStatus: string;
  message: string;
}

export interface MergeProfileRequest {
  phoneNumber: string;
  nationalId: string;
  fullName: string;
  dateOfBirth: string;
  address: string;
}

// ---- Pricing ----
export interface GoldPriceEntry {
  askPrice: number;
  bidPrice: number;
  spread: number;
  isUp: boolean;
  plpercentage: number;
  plamount: number;
}

export interface PricingSnapshot {
  timestamp: string;
  goldPrices: {
    coinPrice: GoldPriceEntry;
    ouncePrice: GoldPriceEntry;
    '21K': GoldPriceEntry;
    '24K': GoldPriceEntry;
    '18K': GoldPriceEntry;
  };
  productPrices: string;
  fresh: boolean;
  lastUpdatedAt: string;
  lastEventId: string;
}



// =========================================================
// Service
// =========================================================

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient);
  private config = inject(ConfigService);

  private readonly apiUrl = `${this.config.baseUrl}/goldera/public/products`;

  private baseUrl = 'http://172.16.0.155:9099/secure/vending';

  // =========================================================
  // Products
  // =========================================================

  /** POST /products/create */
  createProduct(product: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products/create`, product);
  }

  /** GET /products */
  getProducts(
    page: number = 0,
    size: number = 10,
    keyword?: string,
    barcode?: string,
    productReference?: string,
    name?: string,
    purity?: string,
    basePriceFormula?: string,
    productBoxBarcode?: string,
    sort?: string
  ): Observable<ProductsResponse> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (keyword) params = params.set('keyword', keyword);
    if (barcode) params = params.set('barcode', barcode);
    if (productReference) params = params.set('productReference', productReference);
    if (name) params = params.set('name', name);
    if (purity) params = params.set('purity', purity);
    if (basePriceFormula) params = params.set('basePriceFormula', basePriceFormula);
    if (productBoxBarcode) params = params.set('productBoxBarcode', productBoxBarcode);
    if (sort) params = params.set('sort', sort);

    return this.http.get<ProductsResponse>(`${this.baseUrl}/products`, { params });
  }

  /** GET /products/:productReference */
  getProduct(productReference: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${productReference}`);
  }

  /** PUT /products/:barcode */
  updateProduct(barcode: string, product: CreateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/products/${barcode}`, product);
  }

  /** DELETE /products/:barcode */
  deleteProduct(barcode: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${barcode}`);
  }

  /** POST /products/price/references */
  getProductPrices(productReferences: number[]): Observable<ProductPrice[]> {
    return this.http.post<ProductPrice[]>(`${this.baseUrl}/products/price/references`, productReferences);
  }

  // =========================================================
  // Transactions
  // =========================================================

  /** POST /transactions */
  createTransaction(body: CreateTransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/transactions`, body);
  }

  /** POST /transactions/:id/complete */
  completeTransaction(id: number): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/transactions/${id}/complete`, {});
  }

  /** PATCH /transactions/:id/phone */
  updateTransactionPhone(id: number, phoneNumber: string): Observable<Transaction> {
    return this.http.patch<Transaction>(`${this.baseUrl}/transactions/${id}/phone`, { phoneNumber });
  }

  /** PATCH /transactions/:id/language */
  updateTransactionLanguage(id: number, language: string): Observable<Transaction> {
    return this.http.patch<Transaction>(`${this.baseUrl}/transactions/${id}/language`, { language });
  }

  /** PATCH /transactions/:id/item */
  updateTransactionItem(id: number, body: UpdateTransactionItemRequest): Observable<Transaction> {
    return this.http.patch<Transaction>(`${this.baseUrl}/transactions/${id}/item`, body);
  }

  // =========================================================
  // Product Boxes
  // =========================================================

  /** POST /product-boxes */
  createProductBox(body: CreateProductBoxRequest): Observable<ProductBox> {
    return this.http.post<ProductBox>(`${this.baseUrl}/product-boxes`, body);
  }

  // =========================================================
  // Ports
  // =========================================================

  /** GET /ports */
  getPorts(): Observable<Port[]> {
    return this.http.get<Port[]>(`${this.baseUrl}/ports`);
  }

  /** POST /ports */
  createPort(body: CreatePortRequest): Observable<Port> {
    return this.http.post<Port>(`${this.baseUrl}/ports`, body);
  }

  




  getProductsRefrence(
    page: number = 0,
    size: number = 12,
  ) {
    return this.http.get(`${this.apiUrl}/search`, {
      params: {
        page,
        size,
      }
    });
  }

}
