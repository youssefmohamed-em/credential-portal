import { CommonModule,DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
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


   cellColor?:
    | 'primary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'secondary'
    | ((row: any) => 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary' | undefined);

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
    DatePipe,
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
  menuPosition: { top: number; left: number } = { top: 0, left: 0 };

  // ---- filter panel / global search state (UI-only, additive) ----
  showFilterPanel = false;


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


toggleMenu(event: MouseEvent, row: any): void {
  event.stopPropagation();

  if (this.openedRow === row) {
    this.closeMenu();
    return;
  }

  const button = event.currentTarget as HTMLElement;
  const rect = button.getBoundingClientRect();
  const menuWidth = 176; // matches w-44
  const viewportWidth = window.innerWidth;

  // keep the menu inside the viewport regardless of RTL/LTR
  let left = rect.right - menuWidth;
  if (left < 8) left = rect.left;
  if (left + menuWidth > viewportWidth - 8) left = viewportWidth - menuWidth - 8;

  this.menuPosition = { top: rect.bottom + 4, left };
  this.openedRow = row;
}


closeMenu(): void {
  this.openedRow = null;
}

getBadgeClasses(color: string): string {
  switch (color) {
    case 'success':
      return `
        !bg-green-100
        !text-green-700
        dark:!bg-green-900/30
        dark:!text-green-400
      `;

    case 'secondary':
      return `
        !bg-gray-100
        !text-gray-700
        dark:!bg-gray-800
        dark:!text-gray-400
      `;

    case 'warning':
      return `
        !bg-yellow-100
        !text-yellow-700
        dark:!bg-yellow-900/30
        dark:!text-yellow-400
      `;

    case 'danger':
      return `
        !bg-red-100
        !text-red-700
        dark:!bg-red-900/30
        dark:!text-red-400
      `;

    case 'info':
      return `
        !bg-blue-100
        !text-blue-700
        dark:!bg-blue-900/30
        dark:!text-blue-400
      `;

    default:
      return `
        !bg-gray-100
        !text-gray-700
        dark:!bg-gray-800
        dark:!text-gray-400
      `;
  }
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

  // ---- global search (additive: reuses the existing filterValues/filterChange contract) ----
  onGlobalSearch(value: string): void {
    this.filterValues = { ...this.filterValues, _search: value };
    this.filterChange.emit(this.filterValues);
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  clearFilters(): void {
    this.filterValues = {};
    this.showFilterPanel = false;
    this.filterChange.emit(this.filterValues);
  }

  get activeFilterCount(): number {
    return Object.keys(this.filterValues).filter((key) => {
      const val = this.filterValues[key];
      return val !== undefined && val !== null && val !== '';
    }).length;
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


@HostListener('window:scroll', ['$event'])
@HostListener('window:resize')
onScrollOrResize(_event?: Event): void {
  this.closeMenu();
}
}