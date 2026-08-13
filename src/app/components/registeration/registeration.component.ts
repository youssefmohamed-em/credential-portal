import { Component, computed, inject, OnInit, signal } from '@angular/core';

import {
  HeaderComponent,
  HeaderButton
} from "../shared/header/header.component";

import { TranslationService } from '../../services/translate.service';

import {
  MachinesService,
  Machine
} from '../../services/machines.service';
import { SharedTableAction, SharedTableColumn, SharedTableComponent } from '../shared/shared-table/shared-table.component';




@Component({
  selector: 'app-registeration',

  imports: [
    HeaderComponent,
    SharedTableComponent
  ],

  templateUrl: './registeration.component.html',
  styleUrl: './registeration.component.css'
})
export class RegisterationComponent implements OnInit {

  public translation = inject(TranslationService);

  private machinesService = inject(MachinesService);


  machines = signal<Machine[]>([]);

  loading = signal(false);


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
      filterable: true,
      filterType: 'select',

      filterOptions: [
        {
          value: 'ACTIVE',
          label: 'Active'
        },
        {
          value: 'INACTIVE',
          label: 'Inactive'
        }
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

    console.log('Add machine');

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

}