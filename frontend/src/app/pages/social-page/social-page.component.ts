import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileResponse } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-social-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="container page">
      <section class="hero card glossy">
        <div>
          <p class="eyebrow">👥 Social System</p>
          <h1>Players Community</h1>
          <p class="muted">Browse all users, compare progress, and open any public profile.</p>
        </div>
        <div class="hero-pill">{{ users.length }} users</div>
      </section>

      <section class="card">
        <h2>All Users</h2>
        <div class="user-grid">
          @for (user of users; track user.id) {
            <article class="user-card">
              <div class="avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
              <div class="meta">
                <h3>{{ user.username }}</h3>
                <p>{{ user.email }}</p>
              </div>
              <div class="chips">
                <span>Lv. {{ user.level }}</span>
                <span>{{ user.xp }} XP</span>
                <span>{{ user.completed_quests }} completed</span>
              </div>
              <a class="btn btn-primary" [routerLink]="['/profile', user.id]">View profile</a>
            </article>
          } @empty {
            <p class="muted">No users found.</p>
          }
        </div>
      </section>
    </main>
  `,
  styles: [`.page{padding:28px 0 48px;display:grid;gap:18px}.hero{display:flex;justify-content:space-between;align-items:center;gap:16px}.hero-pill{padding:14px 18px;border-radius:20px;background:rgba(255,255,255,.08);font-weight:800}.eyebrow{color:#9fb0ff;font-weight:700;text-transform:uppercase;letter-spacing:.12em}.user-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}.user-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:22px;padding:18px;display:grid;gap:14px}.avatar{width:58px;height:58px;border-radius:50%;display:grid;place-items:center;font-size:24px;font-weight:800;background:linear-gradient(135deg,#7c3aed,#06b6d4)}.meta h3,.meta p{margin:0}.meta p{color:#b9c0ea}.chips{display:flex;gap:8px;flex-wrap:wrap}.chips span{padding:8px 10px;border-radius:999px;background:#171d36;color:#dde4ff;font-size:13px}`]
})
export class SocialPageComponent implements OnInit {
  users: ProfileResponse[] = [];
  private authService = inject(AuthService);
  ngOnInit(): void { this.authService.getUsers().subscribe({ next: data => this.users = data }); }
}
