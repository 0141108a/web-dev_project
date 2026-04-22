import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileResponse } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="container page">
      @if (profile) {
        <section class="card profile glossy">
          <div class="top"><div><p class="eyebrow">👤 Profile</p><h1>{{ profile.username }}</h1><p class="muted">{{ profile.email }}</p></div><div class="level-chip">Level {{ profile.level }}</div></div>
          <div class="stats">
            <div class="stat"><span>XP</span><strong>{{ profile.xp }}</strong></div>
            <div class="stat"><span>Total quests</span><strong>{{ profile.total_quests }}</strong></div>
            <div class="stat"><span>Completed</span><strong>{{ profile.completed_quests }}</strong></div>
            <div class="stat"><span>Badges</span><strong>{{ profile.badges.length }}</strong></div>
          </div>
          <div class="badge-row">
            @for (badge of profile.badges; track badge) { <span class="badge">{{ badge }}</span> } @empty { <span class="muted">No badges yet.</span> }
          </div>
          @if (profile.weekly) {
            <div class="weekly-box"><h2>Weekly Quest Progress</h2>
              @for (item of profile.weekly.items; track item.id) {
                <div class="weekly-item"><div class="line"><strong>{{ item.title }}</strong><span>+{{ item.xp_reward }} XP</span></div><div class="bar"><div class="fill" [style.width.%]="item.progress / item.goal * 100"></div></div></div>
              }
            </div>
          }
        </section>
      }
    </main>
  `,
  styles: [`.page{padding:28px 0 48px}.profile{max-width:920px;margin:0 auto;display:grid;gap:20px}.top{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.eyebrow{color:#9fb0ff;font-weight:700;text-transform:uppercase;letter-spacing:.12em}.level-chip{padding:14px 18px;border-radius:999px;background:rgba(255,255,255,.08);font-weight:800}.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px}.stat{background:#11182f;padding:18px;border-radius:18px}.stat span{display:block;color:#b9bce0;margin-bottom:8px}.stat strong{font-size:34px}.badge-row{display:flex;gap:10px;flex-wrap:wrap}.badge{padding:10px 14px;border-radius:999px;background:linear-gradient(135deg,rgba(139,92,246,.25),rgba(6,182,212,.22));border:1px solid rgba(255,255,255,.08)}.weekly-box{background:#11182f;border-radius:20px;padding:18px}.weekly-item{display:grid;gap:10px;margin-bottom:14px}.line{display:flex;justify-content:space-between;gap:10px}.bar{height:10px;background:#1c2748;border-radius:999px;overflow:hidden}.fill{height:100%;background:linear-gradient(90deg,#06b6d4,#8b5cf6)}`]
})
export class ProfilePageComponent implements OnInit {
  profile?: ProfileResponse;
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.authService.getUserProfile(Number(id)).subscribe({ next: data => this.profile = data });
      else this.authService.getProfile().subscribe({ next: data => this.profile = data });
    });
  }
}
