import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';

export interface Machine {
  id: number;
  status: string;
  location: string;
  registeredAt: string;
}

export interface CreateMachineRequest {
  location: string;
  code: string;
}

export interface CreateMachineResponse {
  machineId: number;
  apiKey: string;
  status: string;
}

export type MachineStatus = 'ONLINE' | 'OFFLINE';

export type MachineCommandType =
  | 'RESTART'
  | 'FORCE_OFFLINE'
  | 'REQUEST_DIAGNOSTICS'
  | 'DISPENSE_TEST';

@Injectable({
  providedIn: 'root'
})
export class MachinesService {

  private http = inject(HttpClient);
  private config = inject(ConfigService);

  private readonly endpoint =
    `${this.config.baseUrl}/secure/tms/machines`;

  // =========================
  // GET MACHINES
  // =========================

  getMachines(
    status?: MachineStatus,
    location?: string
  ) {

    let params = new HttpParams();

    if (status) {
      params = params.set('status', status);
    }

    if (location?.trim()) {
      params = params.set('location', location.trim());
    }

    return this.http.get<Machine[]>(
      this.endpoint,
      { params }
    );
  }

  // =========================
  // CREATE
  // =========================

  createMachine(data: CreateMachineRequest) {
    return this.http.post<CreateMachineResponse>(
      this.endpoint,
      data
    );
  }

  // =========================
  // UPDATE STATUS
  // =========================

  updateMachineStatus(
    id: number,
    status: MachineStatus
  ) {
    return this.http.patch<Machine>(
      `${this.endpoint}/${id}/status`,
      { status }
    );
  }

  // =========================
  // SEND COMMAND
  // =========================

  sendCommand(
    machineId: number,
    commandType: MachineCommandType
  ) {
    return this.http.post<void>(
      `${this.endpoint}/${machineId}/commands`,
      { commandType }
    );
  }
}