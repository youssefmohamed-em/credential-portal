import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);
  private config = inject(ConfigService);

  private readonly apiUrl = `${this.config.baseUrl}/goldera/public/products`;

  getProducts(
    page: number = 0,
    size: number = 12,
    hasCashback: boolean = true
  ) {
    return this.http.get(`${this.apiUrl}/price-search`, {
      params: {
        page,
        size,
        hasCashback
      }
    });
  }
}