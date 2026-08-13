import { HttpClient } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root'
})
export class MachinesService {

  private http = inject(HttpClient);
  private config = inject(ConfigService);

  private readonly endpoint = `${this.config.baseUrl}/secure/tms/machines`;

  getMachines() {
    return this.http.get<Machine[]>(this.endpoint);
  }

  createMachine(data: CreateMachineRequest) {
    return this.http.post<CreateMachineResponse>(
      this.endpoint,
      data
    );
  }
}