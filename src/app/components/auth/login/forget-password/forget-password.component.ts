import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslationService } from '../../../../services/translate.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-forget-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  form: FormGroup;
   private messageService = inject(MessageService);

  private authService =inject(AuthService);

  public translation = inject(TranslationService);
 
  loading = signal(false);
  submitted = signal(false);
  errorMessage = signal<string | null>(null);
 
  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
    });
  }
 
  get username() {
    return this.form.get('username');
  }
 
  get usernameInvalid(): boolean {
    const control = this.username;
    return !!control && control.invalid && (control.dirty || control.touched);
  }
 
  onSubmit(): void {
    this.errorMessage.set(null);
 
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
 
    this.loading.set(true);
 
    // TODO: استبدل هذا بالنداء الفعلي لخدمة إرسال رابط إعادة تعيين كلمة المرور
    // مثال:
    // this.authService.sendResetLink(this.email?.value).subscribe({
    //   next: () => { this.loading.set(false); this.submitted.set(true); },
    //   error: (err) => { this.loading.set(false); this.errorMessage.set('حدث خطأ، حاول مرة أخرى'); }
    // });
 
    setTimeout(() => {
      this.loading.set(false);
      this.submitted.set(true);
    }, 1200);
  }
 
  goToLogin(): void {
    this.router.navigate(['/login']);
  }


}
