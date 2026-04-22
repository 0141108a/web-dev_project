import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="container page">
      <section class="card auth-card">
        <h1>Register</h1>
        <p>Create your account and start collecting XP.</p>
        <form (ngSubmit)="submit()" class="form">
          <input [(ngModel)]="username" name="username" placeholder="Username" required>
          <input [(ngModel)]="email" name="email" type="email" placeholder="Email" required>
          <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required>
          <input [(ngModel)]="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm password" required>
          <button class="btn btn-primary" type="submit">Register</button>
        </form>
        @if (errorMessage) {
          <p class="error">{{ errorMessage }}</p>
        }
        <a routerLink="/login">Already have an account? Login</a>
      </section>
    </main>
  `,
  styles: [`
    .page { padding: 40px 0; }
    .auth-card { max-width: 420px; margin: 0 auto; }
    .form { display: grid; gap: 12px; margin: 20px 0; }
    input { padding: 12px; border-radius: 10px; border: 1px solid #3a3c5d; background: #111322; color: #fff; }
    .error { color: #fca5a5; }
  `]
})
export class RegisterPageComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  submit(): void {
    this.errorMessage = '';
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: error => {
        this.errorMessage = error.error?.message || 'Registration failed.';
      },
    });
  }
}
