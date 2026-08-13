
export interface HeaderButton {
  label: string;
  icon?: string;
  type?: 'button' | 'submit';
  action?: () => void;
}
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() title='';
  @Input () description ='';
  @Input() icon = '';
   @Input() buttons: HeaderButton[] = [];

}
