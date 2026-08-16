import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';




export interface FinanceReport {
  paidOrders: number;
  totalPaidAmount: number;
  generatedAt: string;
}

export interface ComplianceReport {
  verifiedCustomers: number;
  rejectedCustomers: number;
  manualReviewCustomers: number;
  generatedAt: string;
}
@Injectable({
  providedIn: 'root'
})
export class ReportsService {
private http = inject(HttpClient);
private config = inject(ConfigService);


 getFinanceReport() {
    return this.http.get<FinanceReport>(
      `${this.config.apiUrl}/reports/finance`
    );
  }

  getComplianceReport() {
    return this.http.get<ComplianceReport>(
      `${this.config.apiUrl}/reports/compliance`
    );
  }

}
