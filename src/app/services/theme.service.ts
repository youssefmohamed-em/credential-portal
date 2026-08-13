import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    const html = document.documentElement;

    html.classList.toggle('dark');

    const isDark = html.classList.contains('dark');

    localStorage.setItem(
      'theme',
      isDark ? 'dark' : 'light'
    );
  }

  loadTheme(): void {
    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  isDark(): boolean {
    return document.documentElement.classList.contains('dark');
  }
}