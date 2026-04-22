import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { QuestService } from '../../services/quest.service';
import { AuthService } from '../../services/auth.service';
import { Category, Quest } from '../../interfaces/quest.interface';
import { ProfileResponse, WeeklyQuestResponse } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="container page">
      <section class="hero-grid">
        <article class="card glossy hero-main">
          <p class="eyebrow">🎖 Extra Features</p>
          <h1>Questify Dashboard</h1>
          <p class="muted">Modern quest tracker with social profiles, weekly missions, leaderboard, badges and live XP progress.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" routerLink="/weekly">Open weekly quests</a>
            <a class="btn btn-secondary" routerLink="/leaderboard">See leaderboard</a>
          </div>
        </article>
        <article class="card stat-card"><span>Level</span><strong>{{ profile?.level || 1 }}</strong></article>
        <article class="card stat-card"><span>Total XP</span><strong>{{ profile?.xp || 0 }}</strong></article>
        <article class="card stat-card"><span>Completed</span><strong>{{ profile?.completed_quests || 0 }}</strong></article>
      </section>

      <section class="grid two-cols">
        <article class="card">
          <h2>Create Category</h2>
          <div class="form-row">
            <input [(ngModel)]="categoryName" placeholder="Category name">
            <input [(ngModel)]="categoryColor" placeholder="Color">
            <button class="btn btn-secondary" (click)="createCategory()">Add</button>
          </div>
        </article>
        <article class="card">
          <h2>Achievements</h2>
          <div class="badges">
            @for (badge of profile?.badges ?? []; track badge) {
              <span class="badge">{{ badge }}</span>
            } @empty {
              <p class="muted">Complete quests to unlock badges.</p>
            }
          </div>
        </article>
      </section>

      <section class="card">
        <h2>Add Quest</h2>
        <div class="form-grid">
          <input [(ngModel)]="title" placeholder="Quest title">
          <input [(ngModel)]="description" placeholder="Description">
          <select [(ngModel)]="difficulty">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <input [(ngModel)]="deadline" type="date">
          <select [(ngModel)]="selectedCategoryId">
            <option [ngValue]="null">No category</option>
            @for (category of categories; track category.id) {
              <option [ngValue]="category.id">{{ category.name }}</option>
            }
          </select>
          <button class="btn btn-primary" (click)="createQuest()">Create quest</button>
        </div>
        @if (errorMessage) { <p class="error">{{ errorMessage }}</p> }
      </section>

      <section class="grid two-cols">
        <article class="card">
          <h2>📅 Weekly Progress</h2>
          @for (item of weekly?.items ?? []; track item.id) {
            <div class="mini-progress">
              <div><strong>{{ item.title }}</strong><p class="muted">{{ item.progress }}/{{ item.goal }} • +{{ item.xp_reward }} XP</p></div>
              <div class="mini-bar"><div class="mini-fill" [style.width.%]="item.progress / item.goal * 100"></div></div>
            </div>
          }
        </article>
        <article class="card">
          <h2>Statistics</h2>
          <div class="stats-grid">
            <div class="stat-box"><span>Total quests</span><strong>{{ profile?.total_quests || 0 }}</strong></div>
            <div class="stat-box"><span>Completed quests</span><strong>{{ profile?.completed_quests || 0 }}</strong></div>
            <div class="stat-box"><span>Active quests</span><strong>{{ activeQuests.length }}</strong></div>
            <div class="stat-box"><span>Categories</span><strong>{{ categories.length }}</strong></div>
          </div>
        </article>
      </section>

      <section class="grid two-cols">
        <article class="card">
          <h2>Active Quests</h2>
          <div class="quests">
            @for (quest of activeQuests; track quest.id) {
              <article class="quest-item">
                <div><h3>{{ quest.title }}</h3><p>{{ quest.description }}</p><small>{{ quest.difficulty }} • {{ quest.category_name || 'No category' }} • {{ quest.xp_reward }} XP</small></div>
                <div class="actions"><button class="btn btn-secondary" (click)="completeQuest(quest.id)">Complete</button><button class="btn btn-danger" (click)="deleteQuest(quest.id)">Delete</button></div>
              </article>
            } @empty { <p class="muted">No active quests yet.</p> }
          </div>
        </article>
        <article class="card">
          <h2>Completed Quests</h2>
          <div class="quests">
            @for (quest of completedQuests; track quest.id) {
              <article class="quest-item done"><div><h3>{{ quest.title }}</h3><small>{{ quest.xp_reward }} XP earned</small></div></article>
            } @empty { <p class="muted">No completed quests yet.</p> }
          </div>
        </article>
      </section>
    </main>
  `,
  styles: [`.page{padding:28px 0 48px;display:grid;gap:18px}.hero-grid{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:16px}.hero-main{min-height:210px;display:grid;align-content:center}.eyebrow{color:#9fb0ff;font-weight:700;text-transform:uppercase;letter-spacing:.12em}.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px}.stat-card{display:grid;align-content:center;min-height:210px}.stat-card span{color:#aeb6e4}.stat-card strong{font-size:48px;margin-top:6px}.two-cols{grid-template-columns:repeat(2,1fr)}.form-grid,.form-row{display:grid;gap:12px}.form-grid{grid-template-columns:repeat(auto-fit,minmax(170px,1fr))}.form-row{grid-template-columns:repeat(auto-fit,minmax(160px,1fr))}input,select{padding:13px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:#0f1630;color:#fff}.badges{display:flex;flex-wrap:wrap;gap:10px}.badge{padding:10px 14px;border-radius:999px;background:linear-gradient(135deg,rgba(139,92,246,.25),rgba(6,182,212,.22));border:1px solid rgba(255,255,255,.08)}.mini-progress{display:grid;gap:10px;margin-bottom:14px}.mini-bar{height:10px;border-radius:999px;background:#141b33;overflow:hidden}.mini-fill{height:100%;background:linear-gradient(90deg,#22c55e,#06b6d4)}.stats-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.stat-box{background:#11182f;border-radius:18px;padding:16px}.stat-box span{display:block;color:#aeb6e4;margin-bottom:8px}.stat-box strong{font-size:30px}.quests{display:grid;gap:12px}.quest-item{display:flex;justify-content:space-between;gap:16px;padding:16px;border-radius:18px;background:#10172d;border:1px solid rgba(255,255,255,.05)}.quest-item h3,.quest-item p{margin:0 0 6px}.done{border:1px solid rgba(34,197,94,.35)}.actions{display:flex;gap:8px;align-items:center}.error{color:#fca5a5}@media (max-width:980px){.hero-grid,.two-cols{grid-template-columns:1fr}}`]
})
export class DashboardPageComponent implements OnInit {
  categoryName = '';
  categoryColor = 'violet';
  title = '';
  description = '';
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  deadline = '';
  selectedCategoryId: number | null = null;
  errorMessage = '';
  categories: Category[] = [];
  activeQuests: Quest[] = [];
  completedQuests: Quest[] = [];
  profile?: ProfileResponse;
  weekly?: WeeklyQuestResponse;
  private questService = inject(QuestService);
  private authService = inject(AuthService);
  ngOnInit(): void { this.loadData(); }
  loadData(): void {
    this.authService.getProfile().subscribe({ next: p => { this.profile = p; this.weekly = p.weekly; } });
    this.questService.getCategories().subscribe({ next: categories => this.categories = categories });
    this.questService.getQuests().subscribe({ next: quests => { this.activeQuests = quests.filter(q => q.status === 'pending'); this.completedQuests = quests.filter(q => q.status === 'completed'); }, error: error => this.errorMessage = error.error?.message || 'Failed to load quests.' });
  }
  createCategory(): void { this.questService.addCategory({ name: this.categoryName, color: this.categoryColor }).subscribe({ next: () => { this.categoryName = ''; this.categoryColor = 'violet'; this.loadData(); }, error: error => this.errorMessage = error.error?.message || 'Failed to create category.' }); }
  createQuest(): void { this.questService.addQuest({ title: this.title, description: this.description, difficulty: this.difficulty, deadline: this.deadline || null, category: this.selectedCategoryId }).subscribe({ next: () => { this.title = ''; this.description = ''; this.difficulty = 'easy'; this.deadline = ''; this.selectedCategoryId = null; this.loadData(); }, error: error => this.errorMessage = error.error?.message || 'Failed to create quest.' }); }
  completeQuest(id: number): void { this.questService.completeQuest(id).subscribe({ next: () => this.loadData() }); }
  deleteQuest(id: number): void { this.questService.deleteQuest(id).subscribe({ next: () => this.loadData() }); }
}
