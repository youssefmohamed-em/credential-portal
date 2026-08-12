// src/app/core/services/translation.service.ts
import { Injectable, signal, effect, computed, LOCALE_ID } from '@angular/core';

export type Lang = 'en' | 'ar';
export type Dir = 'ltr' | 'rtl';

type Dict = Record<Lang, Record<string, string>>;

@Injectable({ providedIn: 'root' })
export class TranslationService {
      private readonly STORAGE_LANG = 'lang';
      private readonly STORAGE_DIR = 'dir';

      private initialLang = (localStorage.getItem(this.STORAGE_LANG) as Lang) || 'en';
      private initialDir: Dir =
            (localStorage.getItem(this.STORAGE_DIR) as Dir) ||
            (this.initialLang === 'ar' ? 'rtl' : 'ltr');

      lang = signal<Lang>(this.initialLang);
      dir = signal<Dir>(this.initialDir);

      private dict: Dict = {
           en:{
              // Login
      'LOGIN.SIGN_IN': 'Sign In',
      'LOGIN.WELCOME': 'Welcome Back',
      'LOGIN.WELCOME_MESSAGE':
        'Please sign in to access your account',

      'LOGIN.EMAIL': 'Email Address',
      'LOGIN.EMAIL_PLACEHOLDER':
        'name@example.com',

      'LOGIN.PASSWORD': 'Password',
      'LOGIN.PASSWORD_PLACEHOLDER':
        '••••••••',

      'LOGIN.FORGOT_PASSWORD':
        'Forgot your password?',

      'LOGIN.SIGNING_IN':
        'Signing in...',

      'LOGIN.LOGIN_BUTTON':
        'Sign In',

      'LOGIN.EMAIL_REQUIRED':
        'Email is required',

      'LOGIN.EMAIL_INVALID':
        'Invalid email address',

      'LOGIN.PASSWORD_REQUIRED':
        'Password is required',

      'LOGIN.PASSWORD_MIN_LENGTH':
        'Password must be at least 6 characters',

      // Language
      'LANGUAGE.CHANGE':
        'Change language',

      // Messages
      'MESSAGES.SUCCESS':
        'Success',

      'MESSAGES.LOGIN_SUCCESS':
        'Login successful',

      'MESSAGES.ERROR':
        'Error',

      // Footer
      'FOOTER.COPYRIGHT':
        '© 2026 Gold Era. All Rights Reserved.'
           },

            ar:{

      // Login
      'LOGIN.SIGN_IN':
        'تسجيل الدخول',

      'LOGIN.WELCOME':
        'مرحباً بك مجدداً',

      'LOGIN.WELCOME_MESSAGE':
        'الرجاء تسجيل الدخول للوصول إلى حسابك',

      'LOGIN.EMAIL':
        'البريد الإلكتروني',

      'LOGIN.EMAIL_PLACEHOLDER':
        'name@example.com',

      'LOGIN.PASSWORD':
        'كلمة المرور',

      'LOGIN.PASSWORD_PLACEHOLDER':
        '••••••••',

      'LOGIN.FORGOT_PASSWORD':
        'نسيت كلمة المرور؟',

      'LOGIN.SIGNING_IN':
        'جاري تسجيل الدخول...',

      'LOGIN.LOGIN_BUTTON':
        'تسجيل الدخول',

      'LOGIN.EMAIL_REQUIRED':
        'البريد الإلكتروني مطلوب',

      'LOGIN.EMAIL_INVALID':
        'البريد الإلكتروني غير صحيح',

      'LOGIN.PASSWORD_REQUIRED':
        'كلمة المرور مطلوبة',

      'LOGIN.PASSWORD_MIN_LENGTH':
        'كلمة المرور يجب أن تكون 6 أحرف على الأقل',

      // Language
      'LANGUAGE.CHANGE':
        'تغيير اللغة',

      // Messages
      'MESSAGES.SUCCESS':
        'نجاح',

      'MESSAGES.LOGIN_SUCCESS':
        'تم تسجيل الدخول بنجاح',

      'MESSAGES.ERROR':
        'خطأ',

      // Footer
      'FOOTER.COPYRIGHT':
        '© 2026 Gold Era. جميع الحقوق محفوظة.'
            }
      };

      t = (key: string) => computed(() => this.dict[this.lang()]?.[key] ?? key);

      translate(key: string): string {
            return this.dict[this.lang()]?.[key] ?? key;
      }

      constructor() {
            effect(() => {
                  const d = this.dir();
                  const l = this.lang();
                  document.documentElement.setAttribute('dir', d);
                  document.documentElement.setAttribute('lang', l);
                  document.body.classList.toggle('rtl', d === 'rtl');
                  localStorage.setItem(this.STORAGE_DIR, d);
                  localStorage.setItem(this.STORAGE_LANG, l);
            });
      }

      setLang(lang: Lang) {
            this.lang.set(lang);
            this.dir.set(lang === 'ar' ? 'rtl' : 'ltr');
      }

      setDir(dir: Dir) {
            this.dir.set(dir);
      }

      toggleLang() {
            this.setLang(this.lang() === 'en' ? 'ar' : 'en');
      }

      toggleDir() {
            this.dir.set(this.dir() === 'ltr' ? 'rtl' : 'ltr');
      }
}
