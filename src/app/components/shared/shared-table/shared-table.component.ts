import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  imports: [CommonModule, FormsModule],
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

  getBadgeClasses(color: string): string {
    const map: { [key: string]: string } = {
      primary: 'bg-blue-100 text-blue-700 ring-blue-600/20',
      success: 'bg-green-100 text-green-700 ring-green-600/20',
      danger: 'bg-red-100 text-red-700 ring-red-600/20',
      warning: 'bg-amber-100 text-amber-700 ring-amber-600/20',
      info: 'bg-sky-100 text-sky-700 ring-sky-600/20',
      secondary: 'bg-gray-100 text-gray-700 ring-gray-600/20',
    };
    return map[color] || map['secondary'];
  }

  getActionClasses(color?: string): string {
    const map: { [key: string]: string } = {
      primary: 'text-blue-600 hover:bg-blue-50',
      success: 'text-green-600 hover:bg-green-50',
      danger: 'text-red-600 hover:bg-red-50',
      warning: 'text-amber-600 hover:bg-amber-50',
      info: 'text-sky-600 hover:bg-sky-50',
      secondary: 'text-gray-600 hover:bg-gray-50',
    };
    return map[color || 'secondary'] || map['secondary'];
  }

  visibleActions(row: any): SharedTableAction[] {
    return this.actions.filter((a) => !a.condition || a.condition(row));
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
    return this.columns.length + (this.actions.length ? 1 : 0);
  }
}