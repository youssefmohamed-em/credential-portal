import { Component, computed, inject, OnInit, signal } from '@angular/core';

import {
  HeaderComponent,
  HeaderButton
} from "../shared/header/header.component";

import { TranslationService } from '../../services/translate.service';

import {
  MachinesService,
  Machine,
  CreateMachineRequest,
  MachineCommandType
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
  selectedMachine = signal<Machine | null>(null);

  showToggleModal = signal(false);

  pageSize = signal(10);

  currentPage = signal(0);

  showCommandModal = signal(false);

selectedCommandMachine = signal<Machine | null>(null);

selectedCommand = signal<MachineCommandType | null>(null);


commandOptions: {
  value: MachineCommandType;
  label: string;
  icon: string;
}[] = [
  {
    value: 'RESTART',
    label: 'Restart Machine',
    icon: 'pi pi-refresh'
  },
  {
    value: 'FORCE_OFFLINE',
    label: 'Force Offline',
    icon: 'pi pi-power-off'
  },
  {
    value: 'REQUEST_DIAGNOSTICS',
    label: 'Request Diagnostics',
    icon: 'pi pi-wrench'
  },
  {
    value: 'DISPENSE_TEST',
    label: 'Dispense Test',
    icon: 'pi pi-play'
  }
];
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
      icon: 'pi pi-sync',
      label: 'Toggle Status',
      color: 'warning',
      handler: (machine: Machine) => {
        this.openToggleModal(machine);
      }
    },
    {
         icon: 'pi pi-send',
    label: 'Send Command',
    color: 'info',
    handler: (machine: Machine) => {
      this.openCommandModal(machine);
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
      this.formError.set(
        this.translation.translate('MACHINES.CREATE.REQUIRED')
      );
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
          severity: 'success',
          summary: this.translation.translate('COMMON.SUCCESS'),
          detail: this.translation.translate('MACHINES.CREATE.SUCCESS')
        });
        this.closeCreateModal();
        this.getMachines();

      },

      error: (error) => {

        console.error(error);

        this.loading.set(false);
   this.formError.set(
  this.translation.translate('MACHINES.CREATE.FAILED')
);

    const message =
  error?.error?.message ??
  this.translation.translate('MACHINES.CREATE.FAILED');

        this.messageService.add({
          severity: 'error',
         summary: this.translation.translate('COMMON.ERROR'), 
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

  openToggleModal(machine: Machine): void {

    this.selectedMachine.set(machine);

    this.showToggleModal.set(true);

  }

  closeToggleModal(): void {

    this.showToggleModal.set(false);

    this.selectedMachine.set(null);

  }

  confirmToggleStatus(): void {

    const machine = this.selectedMachine();

    if (!machine) return;

    const newStatus =
      machine.status === 'ONLINE'
        ? 'OFFLINE'
        : 'ONLINE';

    this.loading.set(true);

    this.machinesService
      .updateMachineStatus(machine.id, newStatus)
      .subscribe({

        next: () => {

          this.loading.set(false);

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Machine status updated successfully.'
          });

          this.closeToggleModal();

          this.getMachines();

        },

        error: (err) => {

          console.error(err);

          this.loading.set(false);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update machine status.'
          });

        }

      });

  }

sendSelectedCommand(): void {
  const machine = this.selectedCommandMachine();
  const command = this.selectedCommand();

  if (!machine || !command) {
    return;
  }

  this.loading.set(true);

  this.machinesService
    .sendCommand(machine.id, command)
    .subscribe({
      next: () => {
        this.loading.set(false);

        this.messageService.add({
          severity: 'success',
          summary: this.translation.translate('COMMON.SUCCESS'),
          detail: `Command ${command} sent successfully.`
        });

        this.closeCommandModal();
      },

      error: (error) => {
        console.error('Failed to send machine command:', error);

        this.loading.set(false);

        this.messageService.add({
          severity: 'error',
          summary: this.translation.translate('COMMON.ERROR'),
          detail: 'Failed to send command.'
        });
      }
    });
}

openCommandModal(machine: Machine): void {
  this.selectedCommandMachine.set(machine);
  this.selectedCommand.set(null);
  this.showCommandModal.set(true);
}

closeCommandModal(): void {
  this.showCommandModal.set(false);
  this.selectedCommandMachine.set(null);
  this.selectedCommand.set(null);
}


selectCommand(command: MachineCommandType): void {
  this.selectedCommand.set(command);
}
}