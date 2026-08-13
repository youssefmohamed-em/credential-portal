// dashboard.component.ts
import { Component, signal } from '@angular/core';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent, NavbarComponent, RouterOutlet], // ضيف RouterOutlet لو مش موجود
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  isSidebarOpen = signal(false);
  isSidebarCollapsed = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  toggleCollapsed() {
    this.isSidebarCollapsed.update(v => !v);
  }
}