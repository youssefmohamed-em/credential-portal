import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {


  readonly baseUrl="http://172.16.0.155:9099";
  readonly apiUrl ="http://172.16.0.155:9099/secure/vending";

}
