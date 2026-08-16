import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  // لا تضيف التوكن على تسجيل الدخول
  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (token && isTokenExpired(token)) {
    authService.logout();
    router.navigate(['/login'], { replaceUrl: true });
    return throwError(() => new Error('Session expired. Please sign in again.'));
  }

  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        // حذف البيانات
        authService.logout();

        // تحويل إلى صفحة Login
        router.navigate(['/login'], { replaceUrl: true });
      }

      return throwError(() => error);
    })
  );
};

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}
