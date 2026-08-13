import { Component, inject, input, output } from '@angular/core';
import { TranslationService } from '../../../services/translate.service';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
isSidebarOpen = input(false);
  toggleSidebar = output<void>();
  translation = inject(TranslationService);
  public themeservice = inject(ThemeService);
  authService = inject(AuthService);
  toggleLanguage() {
    this.translation.toggleLang();
  }
  user = this.authService.user;

}
