import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isOpen = signal(false);
  isCollapsed= signal(false);
  private router = inject(Router)

toggleSidebar() {
    this.isOpen.update((value) => !value);
  }  

  closeSidebar() {
    this.isOpen.set(false);
  }
  toggleCollapsed(){
    this.isCollapsed.update(value =>!value)
  }
logout() {
  // مثال: امسح التوكن ووديه على صفحة اللوجين
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
}
}
