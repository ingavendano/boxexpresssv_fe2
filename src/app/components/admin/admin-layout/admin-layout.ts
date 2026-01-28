import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  isSidebarOpen = signal(false);

  userInitials = computed(() => {
    const name = this.authService.currentUser()?.fullName || '';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  });

  isAdmin = computed(() => this.authService.currentUser()?.role === 'ROLE_ADMIN');
  isClient = computed(() => this.authService.currentUser()?.role === 'ROLE_CLIENTE');

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
