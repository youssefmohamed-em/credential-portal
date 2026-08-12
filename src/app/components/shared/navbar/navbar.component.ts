import { Component, inject } from '@angular/core';
import { TranslationService } from '../../../services/translate.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  translation = inject(TranslationService);

  toggleLanguage() {
    this.translation.toggleLang();
  }
}
