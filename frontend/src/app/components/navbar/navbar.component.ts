import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="nav-wrap">
      <div class="container nav">
        <a routerLink="/dashboard" class="brand">Questify</a>
        <nav>
          @if (!loggedIn()) {
            <a routerLink="/login" routerLinkActive="active">Login</a>
            <a routerLink="/register" routerLinkActive="active">Register</a>
          }
          @if (loggedIn()) {
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <a routerLink="/social" routerLinkActive="active">Social</a>
            <a routerLink="/leaderboard" routerLinkActive="active">Leaderboard</a>
            <a routerLink="/weekly" routerLinkActive="active">Weekly</a>
            <a routerLink="/profile" routerLinkActive="active">Profile</a>
            <button class="logout" (click)="logout()">Logout</button>
          }
        </nav>
      </div>
    </header>
  `,
  styles: [`.nav-wrap{position:sticky;top:0;z-index:20;backdrop-filter:blur(18px);background:rgba(7,10,23,.86);border-bottom:1px solid rgba(255,255,255,.08)}.nav{display:flex;justify-content:space-between;align-items:center;min-height:74px;gap:18px}.brand{color:#fff;font-size:26px;font-weight:800;letter-spacing:-.02em;text-decoration:none}nav{display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:flex-end}a{color:#cfd6ff;text-decoration:none;padding:10px 14px;border-radius:999px;transition:.2s ease}a:hover,.active{background:rgba(255,255,255,.08);color:#fff}.logout{border:0;background:linear-gradient(135deg,#f43f5e,#fb7185);color:#fff;padding:10px 16px;border-radius:999px;font-weight:700}`]
})
export class NavbarComponent {
  private authService = inject(AuthService);
  loggedIn = computed(() => this.authService.isLoggedIn());
  logout(): void { this.authService.logout(); }
}
