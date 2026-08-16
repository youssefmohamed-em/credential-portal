import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslationService } from '../../services/translate.service';
import { MessageService } from 'primeng/api';
import { ComplianceReport, FinanceReport, ReportsService } from '../../services/reports.service';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  imports: [   DatePipe,
    DecimalPipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit{

  public translation = inject(TranslationService);
  private messageService = inject(MessageService);
 private reportsService = inject(ReportsService);
  financeReport = signal<FinanceReport | null>(null);

  complianceReport = signal<ComplianceReport | null>(null);
  financeLoading = signal(false);
  complianceLoading = signal(false);

  loading = signal(false);

    ngOnInit(): void {
    this.loadFinanceReport();
    this.loadComplianceReport();
  }

  loadFinanceReport(): void {

    this.financeLoading.set(true);

    this.reportsService.getFinanceReport().subscribe({
      next: (response) => {

        this.financeReport.set(response);

        this.financeLoading.set(false);
      },

      error: (error) => {

        console.error('Finance report error:', error);

        this.financeLoading.set(false);

        this.messageService.add({
          severity: 'error',
          summary: 'Finance Report',
          detail: 'Failed to load finance report'
        });
      }
    });
  }

    loadComplianceReport(): void {

    this.complianceLoading.set(true);

    this.reportsService.getComplianceReport().subscribe({
      next: (response) => {

        this.complianceReport.set(response);

        this.complianceLoading.set(false);
      },

      error: (error) => {

        console.error('Compliance report error:', error);

        this.complianceLoading.set(false);

        this.messageService.add({
          severity: 'error',
          summary: 'Compliance Report',
          detail: 'Failed to load compliance report'
        });
      }
    });
  }

}
