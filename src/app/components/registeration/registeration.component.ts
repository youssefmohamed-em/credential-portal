import { Component, computed, inject, OnInit, signal } from '@angular/core';

import {
  HeaderComponent,
  HeaderButton
} from "../shared/header/header.component";

import { TranslationService } from '../../services/translate.service';

import {
  MachinesService,
  Machine,
  CreateMachineRequest
} from '../../services/machines.service';
import { SharedTableAction, SharedTableColumn, SharedTableComponent } from '../shared/shared-table/shared-table.component';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';


@Component({
  selector: 'app-registeration',

  imports: [
    HeaderComponent,
    SharedTableComponent,
    Toast
  ],

  templateUrl: './registeration.component.html',
  styleUrl: './registeration.component.css'
})
export class RegisterationComponent implements OnInit {

  public translation = inject(TranslationService);

  private machinesService = inject(MachinesService);
  private messageService = inject(MessageService);

  machines = signal<Machine[]>([]);

  loading = signal(false);
  showCreateModal = signal(false);
  formError = signal<string | null>(null);
  totalElements = computed(() => this.machines().length);

pageSize = signal(10);

currentPage = signal(0);


  // =========================
  // Table Columns
  // =========================

  tableColumns: SharedTableColumn[] = [

    {
      key: 'id',
      label: 'ID',
      sortable: true
    },

{
  key: 'status',
  label: 'STATUS',
  sortable: true,
  type: 'badge', // 👈 أضفنا نوع العمود badge
  badgeConfig: (status: string) => {
    const isOnline = status?.toUpperCase() === 'ONLINE';
    return {
      label: status,
      // primeNG Tag severity: 'success' للون الأخضر، و 'secondary' للون الرمادي
      color: isOnline ? 'success' : 'secondary' 
    };
  },
  filterable: true,
  filterType: 'select',
  filterOptions: [
    { value: 'ONLINE', label: 'Online' },
    { value: 'OFFLINE', label: 'Offline' }
  ]
},

    {
      key: 'location',
      label: 'LOCATION',
      sortable: true,
      filterable: true,
      filterType: 'text'
    },

    {
      key: 'registeredAt',
      label: 'REGISTERED_AT',
      sortable: true,
      type: 'date'
    }

  ];


  // =========================
  // Table Actions
  // =========================

  tableActions: SharedTableAction[] = [

    {
      icon: 'pi pi-pencil',
      label: 'Edit',
      color: 'primary',

      handler: (machine: Machine) => {
        this.editMachine(machine);
      }
    },

    {
      icon: 'pi pi-trash',
      label: 'Delete',
      color: 'danger',

      handler: (machine: Machine) => {
        this.deleteMachine(machine);
      }
    }

  ];


  // =========================
  // Header
  // =========================

  headerButtons = computed<HeaderButton[]>(() => [

    {
      label: this.translation.translate('MACHINES.ADD'),
      icon: 'pi-plus',
      action: () => this.addMachine()
    },

    {
      label: this.translation.translate('COMMON.REFRESH'),
      icon: 'pi-refresh',
      action: () => this.getMachines()
    }

  ]);


  // =========================
  // Lifecycle
  // =========================

  ngOnInit(): void {
    this.getMachines();
  }


  // =========================
  // API
  // =========================

  getMachines(): void {

    this.loading.set(true);

    this.machinesService.getMachines().subscribe({

      next: (response) => {

        this.machines.set(response);

        this.loading.set(false);

      },

      error: (error) => {

        console.error(
          'Failed to get machines:',
          error
        );

        this.loading.set(false);

      }

    });

  }


  // =========================
  // Actions
  // =========================

  addMachine(): void {
    this.formError.set(null);
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.formError.set(null);
  }


  saveMachine(code: string, location: string): void {

    const trimmedCode = code.trim();
    const trimmedLocation = location.trim();

    if (!trimmedCode || !trimmedLocation) {
      this.formError.set('Machine code and location are required');
      return;
    }

    this.formError.set(null);
    this.loading.set(true);

    const request: CreateMachineRequest = {
      code: trimmedCode,
      location: trimmedLocation
    };

    this.machinesService.createMachine(request).subscribe({

      next: () => {

        this.loading.set(false);

        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Machine Created Successfully ."
        })
        this.closeCreateModal();
        this.getMachines();

      },

      error: (error) => {

        console.error(error);

        this.loading.set(false);
        this.formError.set('Failed to create machine. Please try again.');

        const message =
          error?.error?.message ??
          'Failed to create machine.';

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message
        });
      }

    });

  }

  editMachine(machine: Machine): void {

    console.log('Edit machine:', machine);

  }


  deleteMachine(machine: Machine): void {

    console.log('Delete machine:', machine);

  }


  toggleLanguage(): void {

    this.translation.toggleLang();

  }
  onPageChange(page: number) {
  this.currentPage.set(page);
}

onPageSizeChange(size: number) {
  this.pageSize.set(size);
}

}