import { CommonModule } from '@angular/common';

import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  ToastModule
} from 'primeng/toast';

import {
  MessageService
} from 'primeng/api';

import { TranslationService } from '../../../services/translate.service';


@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ToastModule
  ],

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private fb = inject(FormBuilder);

  private router = inject(Router);

  private messageService =
    inject(MessageService);

  // Translation
  public translation =
    inject(TranslationService);


  // =========================
  // Show / Hide Password
  // =========================

  showPassword = signal(false);


  // =========================
  // Loading
  // =========================

  submitting = signal(false);


  // =========================
  // Login Form
  // =========================

  loginForm = this.fb.nonNullable.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]

  });


  // =========================
  // Toggle Language
  // =========================

  toggleLanguage(): void {

   this.translation.toggleLang();

  }


  // =========================
  // Submit Login
  // =========================

  onSubmit(): void {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.submitting.set(true);

    const loginData =
      this.loginForm.getRawValue();

    console.log(
      'Login Data:',
      loginData
    );


    setTimeout(() => {

      console.log(
        'Login Successful'
      );

      this.submitting.set(false);


      this.messageService.add({

        severity: 'success',

        summary:
          this.translation.translate(
            'MESSAGES.SUCCESS'
          ),

        detail:
          this.translation.translate(
            'MESSAGES.LOGIN_SUCCESS'
          ),

        life: 3000

      });


      this.router.navigate([
        '/dashboard'
      ]);

    }, 1500);

  }


  // =========================
  // Toggle Password
  // =========================

  togglePassword(): void {

    this.showPassword.update(
      value => !value
    );

  }


  // =========================
  // Email Error
  // =========================

  get emailError(): string {

    const email =
      this.loginForm.controls.email;


    if (email.hasError('required')) {

      return this.translation.translate(
        'LOGIN.EMAIL_REQUIRED'
      );

    }


    if (email.hasError('email')) {

      return this.translation.translate(
        'LOGIN.EMAIL_INVALID'
      );

    }


    return '';

  }


  // =========================
  // Password Error
  // =========================

  get passwordError(): string {

    const password =
      this.loginForm.controls.password;


    if (password.hasError('required')) {

      return this.translation.translate(
        'LOGIN.PASSWORD_REQUIRED'
      );

    }


    if (password.hasError('minlength')) {

      return this.translation.translate(
        'LOGIN.PASSWORD_MIN_LENGTH'
      );

    }


    return '';

  }

}