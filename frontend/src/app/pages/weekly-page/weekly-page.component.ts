import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { WeeklyQuestResponse } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-weekly-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="container page">
      <section class="card glossy">
        <p class="eyebrow">📅 Weekly Quests</p>
        <h1>Weekly Challenge Board</h1>
        @if (weekly) {
          <p class="muted">{{ weekly.week_start }} — {{ weekly.week_end }} • Auto-updates every 15 seconds</p>
        }
      </section>
      <section class="weekly-grid">
        @for (item of weekly?.items ?? []; track item.id) {
          <article class="card weekly-card">
            <div class="top-line"><h2>{{ item.title }}</h2><span class="reward">+{{ item.xp_reward }} XP</span></div>
            <p class="muted">{{ item.description }}</p>
            <div class="progress-shell"><div class="progress-fill" [style.width.%]="item.progress / item.goal * 100"></div></div>
            <div class="bottom-line"><strong>{{ item.progress }}/{{ item.goal }}</strong><span [class.done]="item.completed">{{ item.completed ? 'Completed' : 'In progress' }}</span></div>
          </article>
        }
      </section>
    </main>
  `,
  styles: [`.page{padding:28px 0 48px;display:grid;gap:18px}.weekly-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}.eyebrow{color:#7dd3fc;font-weight:700;text-transform:uppercase;letter-spacing:.12em}.weekly-card{display:grid;gap:14px}.top-line,.bottom-line{display:flex;justify-content:space-between;gap:10px;align-items:center}.reward{padding:8px 12px;border-radius:999px;background:rgba(125,211,252,.12);color:#a5f3fc;font-weight:800}.progress-shell{height:14px;border-radius:999px;background:#141b33;overflow:hidden}.progress-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#06b6d4,#8b5cf6)}.done{color:#86efac;font-weight:700}`]
})
export class WeeklyPageComponent implements OnInit, OnDestroy {
  weekly?: WeeklyQuestResponse;
  private authService = inject(AuthService);
  private subscription?: Subscription;
  ngOnInit(): void { this.load(); this.subscription = interval(15000).subscribe(() => this.load()); }
  ngOnDestroy(): void { this.subscription?.unsubscribe(); }
  load(): void { this.authService.getWeeklyQuests().subscribe({ next: data => this.weekly = data }); }
}
