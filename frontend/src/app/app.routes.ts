import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SocialPageComponent } from './pages/social-page/social-page.component';
import { LeaderboardPageComponent } from './pages/leaderboard-page/leaderboard-page.component';
import { WeeklyPageComponent } from './pages/weekly-page/weekly-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard] },
  { path: 'profile/:id', component: ProfilePageComponent, canActivate: [authGuard] },
  { path: 'social', component: SocialPageComponent, canActivate: [authGuard] },
  { path: 'leaderboard', component: LeaderboardPageComponent, canActivate: [authGuard] },
  { path: 'weekly', component: WeeklyPageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' },
];
