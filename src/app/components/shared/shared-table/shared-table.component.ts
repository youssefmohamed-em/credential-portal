import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { Tooltip } from "primeng/tooltip";
import { TranslationService } from '../../../services/translate.service';
export interface SharedTableColumn {
  key: string;
  label: string;

  sortable?: boolean;
  filterable?: boolean;

  filterType?: 'text' | 'select' | 'date';

  filterOptions?: {
    value: any;
    label: string;
  }[];

  width?: string;

  align?: 'left' | 'center' | 'right';

  type?:
    | 'text'
    | 'number'
    | 'date'
    | 'badge'
    | 'actions'
    | 'custom';

  format?: string;

  value?: (row: any) => any;

  badgeConfig?: (value: any) => {
    label: string;
    color: string;
  };

  customRender?: (row: any) => string;
}
export interface SharedTableAction {
  icon: string;
  label: string;

  color?:
    | 'primary'
    | 'success'
    | 'danger'
    | 'secondary'
    | 'warning'
    | 'info';

  condition?: (row: any) => boolean;

  handler: (row: any) => void;
}

@Component({
  selector: 'app-shared-table',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule,
    ButtonModule,
    TagModule,
    PaginatorModule,
    ToastModule,
    RippleModule, Tooltip],
  templateUrl: './shared-table.component.html',
  styleUrl: './shared-table.component.css',
})
export class SharedTableComponent {
  @Input() columns: SharedTableColumn[] = [];

  @Input() data: any[] = [];


  @Input() actions: SharedTableAction[] = [];

  @Input() loading = false;

  @Input() emptyMessage = 'No data available';

  @Input() showPagination = true;

  @Input() pageSize = 10;

  @Input() currentPage = 0;

  @Input() totalElements = 0;

@Input() menuActions: SharedTableAction[] = [];

  @Output()
  pageChange = new EventEmitter<number>();

  @Output()
  pageSizeChange = new EventEmitter<number>();

  @Output()
  sortChange = new EventEmitter<{
    key: string;
    direction: 'asc' | 'desc';
  }>();

  @Output()
  filterChange = new EventEmitter<{ [key: string]: any }>();

  // ---- internal state ----
  sortKey: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  filterValues: { [key: string]: any } = {};

  pageSizeOptions = [10, 25, 50, 100];
  openedRow: any = null;


  public translation = inject(TranslationService);


  // ---- generic cell helpers ----
  getCellValue(row: any, column: SharedTableColumn): any {
    return column.value ? column.value(row) : row[column.key];
  }

  getBadge(row: any, column: SharedTableColumn) {
    const value = this.getCellValue(row, column);
    return column.badgeConfig
      ? column.badgeConfig(value)
      : { label: value, color: 'secondary' };
  }

  getCustomHtml(row: any, column: SharedTableColumn): string {
    return column.customRender ? column.customRender(row) : '';
  }

  getAlignClass(column: SharedTableColumn): string {
    switch (column.align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  }


toggleMenu(row: any) {
  this.openedRow = this.openedRow === row ? null : row;
}
getBadgeClasses(color: string): string {
  const map: { [key: string]: string } = {
    danger: 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400',       // unqualified
    warning: 'bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400', // negotiation
    success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400', // qualified
    info: 'bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400',        // new
    primary: 'bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400', // renewal
    secondary: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  };
  return map[color] || map['secondary'];
}

getActionClasses(color?: string): string {
  const map: { [key: string]: string } = {
    primary: '!text-blue-600 hover:!bg-blue-50 dark:!text-blue-400 dark:hover:!bg-blue-950/40',
    danger: '!text-red-500 hover:!bg-red-50 dark:!text-red-400 dark:hover:!bg-red-950/40',
    warning: '!text-amber-600 hover:!bg-amber-50 dark:!text-amber-400 dark:hover:!bg-amber-950/40',
    success: '!text-emerald-600 hover:!bg-emerald-50 dark:!text-emerald-400 dark:hover:!bg-emerald-950/40',
    secondary: '!text-gray-500 hover:!bg-gray-100 dark:!text-gray-400 dark:hover:!bg-slate-800',
  };
  return map[color || 'secondary'] || map['secondary'];
}

 visibleActions(row: any): SharedTableAction[] {
  return this.menuActions.filter(
    (a) => !a.condition || a.condition(row)
  );
}

  // ---- sorting ----
  onSort(column: SharedTableColumn): void {
    if (!column.sortable) return;

    if (this.sortKey === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = column.key;
      this.sortDirection = 'asc';
    }

    this.sortChange.emit({ key: this.sortKey, direction: this.sortDirection });
  }

  // ---- filtering ----
  onFilterInput(column: SharedTableColumn, value: any): void {
    this.filterValues = { ...this.filterValues, [column.key]: value };
    this.filterChange.emit(this.filterValues);
  }

  get hasFilterableColumns(): boolean {
    return this.columns.some((c) => c.filterable);
  }

  // ---- pagination ----
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalElements / this.pageSize));
  }

  get pages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const start = Math.max(0, current - delta);
    const end = Math.min(total - 1, current + delta);
    const result: number[] = [];
    for (let i = start; i <= end; i++) result.push(i);
    return result;
  }

  get startItem(): number {
    return this.totalElements === 0 ? 0 : this.currentPage * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.totalElements, (this.currentPage + 1) * this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 0 || page > this.totalPages - 1 || page === this.currentPage) return;
    this.currentPage = page;
    this.pageChange.emit(page);
  }

  onPageSizeSelect(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.pageSizeChange.emit(size);
  }

  // ---- misc ----
  trackByFn(index: number, row: any): any {
    return row?.id ?? index;
  }

get colSpan(): number {
  return this.columns.length + (this.menuActions.length ? 1 : 0);
}



}