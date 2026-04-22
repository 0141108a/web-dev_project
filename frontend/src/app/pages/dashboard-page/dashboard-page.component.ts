import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestService } from '../../services/quest.service';
import { Category, Quest } from '../../interfaces/quest.interface';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="container page grid layout">
      <section class="card">
        <h2>Add Category</h2>
        <div class="form-row">
          <input [(ngModel)]="categoryName" placeholder="Category name">
          <input [(ngModel)]="categoryColor" placeholder="Color">
          <button class="btn btn-secondary" (click)="createCategory()">Add Category</button>
        </div>
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
          <button class="btn btn-primary" (click)="createQuest()">Add Quest</button>
        </div>
        @if (errorMessage) {
          <p class="error">{{ errorMessage }}</p>
        }
      </section>

      <section class="card">
        <h2>Active Quests</h2>
        <div class="quests">
          @for (quest of activeQuests; track quest.id) {
            <article class="quest-item">
              <div>
                <h3>{{ quest.title }}</h3>
                <p>{{ quest.description }}</p>
                <small>{{ quest.difficulty }} • {{ quest.category_name || 'No category' }} • {{ quest.xp_reward }} XP</small>
              </div>
              <div class="actions">
                <button class="btn btn-secondary" (click)="completeQuest(quest.id)">Complete</button>
                <button class="btn" (click)="deleteQuest(quest.id)">Delete</button>
              </div>
            </article>
          } @empty {
            <p>No active quests yet.</p>
          }
        </div>
      </section>

      <section class="card">
        <h2>Completed Quests</h2>
        <div class="quests">
          @for (quest of completedQuests; track quest.id) {
            <article class="quest-item done">
              <div>
                <h3>{{ quest.title }}</h3>
                <small>{{ quest.xp_reward }} XP earned</small>
              </div>
            </article>
          } @empty {
            <p>No completed quests yet.</p>
          }
        </div>
      </section>
    </main>
  `,
  styles: [`
    .page { padding: 32px 0; }
    .layout { grid-template-columns: 1fr; }
    .form-grid, .form-row { display: grid; gap: 12px; }
    .form-grid { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
    .form-row { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); align-items: center; }
    input, select { padding: 12px; border-radius: 10px; border: 1px solid #3a3c5d; background: #111322; color: #fff; }
    .quests { display: grid; gap: 12px; }
    .quest-item { display: flex; justify-content: space-between; gap: 16px; padding: 14px; border-radius: 12px; background: #141628; }
    .done { border: 1px solid #22c55e; }
    .actions { display: flex; gap: 8px; align-items: center; }
    .error { color: #fca5a5; }
  `]
})
export class DashboardPageComponent implements OnInit {
  categoryName = '';
  categoryColor = 'purple';
  title = '';
  description = '';
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  deadline = '';
  selectedCategoryId: number | null = null;
  errorMessage = '';

  categories: Category[] = [];
  activeQuests: Quest[] = [];
  completedQuests: Quest[] = [];

  private questService = inject(QuestService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.questService.getCategories().subscribe({
      next: categories => this.categories = categories,
    });

    this.questService.getQuests().subscribe({
      next: quests => {
        this.activeQuests = quests.filter(quest => quest.status === 'pending');
        this.completedQuests = quests.filter(quest => quest.status === 'completed');
      },
      error: error => this.errorMessage = error.error?.message || 'Failed to load quests.',
    });
  }

  createCategory(): void {
    this.questService.addCategory({ name: this.categoryName, color: this.categoryColor }).subscribe({
      next: () => {
        this.categoryName = '';
        this.categoryColor = 'purple';
        this.loadData();
      },
      error: error => this.errorMessage = error.error?.message || 'Failed to create category.',
    });
  }

  createQuest(): void {
    this.questService.addQuest({
      title: this.title,
      description: this.description,
      difficulty: this.difficulty,
      deadline: this.deadline || null,
      category: this.selectedCategoryId,
    }).subscribe({
      next: () => {
        this.title = '';
        this.description = '';
        this.difficulty = 'easy';
        this.deadline = '';
        this.selectedCategoryId = null;
        this.loadData();
      },
      error: error => this.errorMessage = error.error?.message || 'Failed to create quest.',
    });
  }

  completeQuest(id: number): void {
    this.questService.completeQuest(id).subscribe({ next: () => this.loadData() });
  }

  deleteQuest(id: number): void {
    this.questService.deleteQuest(id).subscribe({ next: () => this.loadData() });
  }
}
