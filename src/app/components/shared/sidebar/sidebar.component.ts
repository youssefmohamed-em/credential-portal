import { Component, inject, input, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslationService } from '../../../services/translate.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  // جاي من الأب (Layout/Dashboard)
  isOpen = input(false);
  isCollapsed = input(false);

  // طالع للأب
  closeSidebar = output<void>();
  toggleCollapsed = output<void>();

  private router = inject(Router);
  private authService = inject(AuthService);
  public translation = inject(TranslationService);

  toggleLanguage() {
    this.translation.toggleLang();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
