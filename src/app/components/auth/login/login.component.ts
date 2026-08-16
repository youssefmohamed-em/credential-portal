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

import {
  AuthService,
  LoginRequest
} from '../../../services/auth.service';


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

  // =========================
  // Services
  // =========================

  private fb = inject(FormBuilder);

  private router = inject(Router);

  private messageService =
    inject(MessageService);

  private authService =
    inject(AuthService);

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

    // Validate form
    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }


    // Start loading
    this.submitting.set(true);


    // Get form values
    const formData =
      this.loginForm.getRawValue();


    // =========================
    // Prepare API Request
    // =========================

    const loginData: LoginRequest = {

      username: formData.email,

      password: formData.password

    };


    console.log(
      'Login Data:',
      loginData
    );


    // =========================
    // Call API
    // =========================

    this.authService
      .login(loginData)
      .subscribe({

        // =========================
        // Success
        // =========================

        next: (response) => {

         
this.authService.saveLogin(response); 

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


          // Navigate Dashboard after a small delay to ensure state is updated
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 500);

        },


        // =========================
        // Error
        // =========================

        error: (error) => {

          console.error(
            'Login Error:',
            error
          );


          this.submitting.set(false);


          this.messageService.add({

            severity: 'error',

            summary:
              this.translation.translate(
                'MESSAGES.ERROR'
              ),

            detail:
              error?.error?.message ||
              'Invalid email or password',

            life: 4000

          });

        }

      });

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