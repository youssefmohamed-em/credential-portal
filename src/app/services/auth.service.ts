import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ConfigService } from './config.service';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  lastLoginAt: string;
}

export interface LoginRequest {
  username:string,
  password:string,
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  session_state: string;
  scope: string;
}
export interface ForgotPasswordRequest {
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = signal<User | null>(null);
  private http =  inject(HttpClient);
  private config =inject(ConfigService);

  private readonly authUrl = 
  `${this.config.baseUrl}/auth`


  login(credentials:LoginRequest){
    return this.http.post<LoginResponse>(
      `${this.authUrl}/login`,
      credentials
    )
  }

saveLogin(response: LoginResponse) {
  localStorage.setItem('token', response.access_token);
  localStorage.setItem('refreshToken', response.refresh_token);
}

logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  this.user.set(null);
}

loadUSer(){
  const user =localStorage.getItem('user');
  if(user){
    this.user.set(JSON.parse(user))
  }
}

  forgotPassword(data: ForgotPasswordRequest) {
    return this.http.post(
      `${this.config.baseUrl}/public/auth/forget-password`,
      data
    );
  }
}
