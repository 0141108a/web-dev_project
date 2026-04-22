import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="nav-wrap">
      <div class="container nav">
        <a routerLink="/dashboard" class="brand">Questify</a>
        <nav>
          <a routerLink="/login">Login</a>
          <a routerLink="/register">Register</a>
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/profile">Profile</a>
          @if (loggedIn()) {
            <button class="logout" (click)="logout()">Logout</button>
          }
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .nav-wrap { background: #17182b; padding: 14px 0; border-bottom: 1px solid #2a2d4d; }
    .nav { display: flex; justify-content: space-between; align-items: center; }
    .brand { color: #fff; font-size: 24px; font-weight: 700; text-decoration: none; }
    nav { display: flex; gap: 14px; align-items: center; }
    a { color: #dcdcff; text-decoration: none; }
    .logout { border: 0; background: #ef4444; color: white; padding: 8px 12px; border-radius: 10px; }
  `]
})
export class NavbarComponent {
  private authService = inject(AuthService);
  loggedIn = computed(() => this.authService.isLoggedIn());

  logout(): void {
    this.authService.logout();
  }
}
