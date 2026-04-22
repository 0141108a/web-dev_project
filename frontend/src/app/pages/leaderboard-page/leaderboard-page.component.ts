import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LeaderboardUser } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-leaderboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="container page">
      <section class="card glossy">
        <p class="eyebrow">🏆 Leaderboard</p>
        <h1>Top XP Players</h1>
        <p class="muted">Auto-refreshes every 20 seconds.</p>
      </section>
      <section class="podium">
        @for (user of topThree; track user.id) {
          <article class="podium-card" [class.first]="user.rank === 1">
            <div class="rank">#{{ user.rank }}</div>
            <h3>{{ user.username }}</h3>
            <p>{{ user.xp }} XP • Level {{ user.level }}</p>
          </article>
        }
      </section>
      <section class="card">
        <h2>Full Ranking</h2>
        <div class="ranking-table">
          <div class="row head"><span>Rank</span><span>User</span><span>Level</span><span>XP</span><span>Completed</span><span></span></div>
          @for (user of users; track user.id) {
            <div class="row">
              <span>#{{ user.rank }}</span><span>{{ user.username }}</span><span>{{ user.level }}</span><span>{{ user.xp }}</span><span>{{ user.completed_quests }}</span><a [routerLink]="['/profile', user.id]">Open</a>
            </div>
          }
        </div>
      </section>
    </main>
  `,
  styles: [`.page{padding:28px 0 48px;display:grid;gap:18px}.eyebrow{color:#ffd166;font-weight:700;text-transform:uppercase;letter-spacing:.12em}.podium{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}.podium-card{border-radius:24px;padding:22px;background:linear-gradient(135deg,rgba(124,58,237,.25),rgba(8,145,178,.18));border:1px solid rgba(255,255,255,.08)}.podium-card.first{background:linear-gradient(135deg,rgba(250,204,21,.28),rgba(249,115,22,.22))}.rank{font-size:28px;font-weight:800;margin-bottom:10px}.ranking-table{display:grid;gap:8px}.row{display:grid;grid-template-columns:.8fr 2fr .8fr .9fr 1fr .7fr;gap:10px;align-items:center;padding:14px 16px;border-radius:16px;background:rgba(255,255,255,.04)}.head{color:#9ca7d8;font-size:13px;text-transform:uppercase;letter-spacing:.08em;background:transparent}a{color:#9fb0ff;text-decoration:none;font-weight:700}@media (max-width:720px){.row{grid-template-columns:repeat(2,1fr)}.head{display:none}}`]
})
export class LeaderboardPageComponent implements OnInit, OnDestroy {
  users: LeaderboardUser[] = [];
  topThree: LeaderboardUser[] = [];
  private authService = inject(AuthService);
  private subscription?: Subscription;
  ngOnInit(): void { this.load(); this.subscription = interval(20000).subscribe(() => this.load()); }
  ngOnDestroy(): void { this.subscription?.unsubscribe(); }
  load(): void { this.authService.getLeaderboard().subscribe({ next: data => { this.users = data; this.topThree = data.slice(0, 3); } }); }
}
