import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ProfileResponse } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="container page">
      <section class="card profile" *ngIf="profile">
        <h1>{{ profile.username }}</h1>
        <p>{{ profile.email }}</p>
        <div class="stats">
          <div class="stat"><span>Level</span><strong>{{ profile.level }}</strong></div>
          <div class="stat"><span>XP</span><strong>{{ profile.xp }}</strong></div>
          <div class="stat"><span>Total quests</span><strong>{{ profile.total_quests }}</strong></div>
          <div class="stat"><span>Completed</span><strong>{{ profile.completed_quests }}</strong></div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .page { padding: 40px 0; }
    .profile { max-width: 700px; margin: 0 auto; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-top: 20px; }
    .stat { background: #141628; padding: 16px; border-radius: 12px; }
    .stat span { display: block; color: #b9bce0; margin-bottom: 8px; }
  `]
})
export class ProfilePageComponent implements OnInit {
  profile?: ProfileResponse;
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: data => this.profile = data,
    });
  }
}
