import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="container page">
      <section class="card auth-card glossy">
        <p class="eyebrow">Welcome back</p>
        <h1>Login</h1>
        <p class="muted">Enter your username and password to continue your quest.</p>
        <form (ngSubmit)="submit()" class="form">
          <input [(ngModel)]="username" name="username" placeholder="Username" required>
          <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required>
          <button class="btn btn-primary" type="submit">Login</button>
        </form>
        @if (errorMessage) { <p class="error">{{ errorMessage }}</p> }
        <a routerLink="/register">No account yet? Register</a>
      </section>
    </main>
  `,
  styles: [`.page{padding:48px 0}.auth-card{max-width:460px;margin:0 auto}.eyebrow{color:#9fb0ff;font-weight:700;text-transform:uppercase;letter-spacing:.12em}.form{display:grid;gap:12px;margin:20px 0}input{padding:14px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:#0f1630;color:#fff}.error{color:#fca5a5}`]
})
export class LoginPageComponent {
  username = '';
  password = '';
  errorMessage = '';
  private authService = inject(AuthService);
  private router = inject(Router);
  submit(): void {
    this.errorMessage = '';
    this.authService.login({ username: this.username, password: this.password }).subscribe({ next: () => this.router.navigate(['/dashboard']), error: error => this.errorMessage = error.error?.non_field_errors?.[0] || error.error?.message || 'Invalid username or password.' });
  }
}
