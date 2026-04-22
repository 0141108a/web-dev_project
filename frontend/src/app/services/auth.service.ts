import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthResponse, LeaderboardUser, ProfileResponse, WeeklyQuestResponse } from '../interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://127.0.0.1:8000/api/auth';
  readonly isLoggedIn = signal<boolean>(!!localStorage.getItem('access_token'));

  constructor(private http: HttpClient, private router: Router) {}

  register(payload: { username: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/`, payload).pipe(tap(response => this.storeTokens(response)));
  }

  login(payload: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, payload).pipe(tap(response => this.storeTokens(response)));
  }

  logout(): void {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      this.http.post(`${this.apiUrl}/logout/`, { refresh }).subscribe({ next: () => {}, error: () => {} });
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<ProfileResponse> { return this.http.get<ProfileResponse>(`${this.apiUrl}/profile/`); }
  getUsers(): Observable<ProfileResponse[]> { return this.http.get<ProfileResponse[]>(`${this.apiUrl}/users/`); }
  getUserProfile(userId: number): Observable<ProfileResponse> { return this.http.get<ProfileResponse>(`${this.apiUrl}/users/${userId}/`); }
  getLeaderboard(): Observable<LeaderboardUser[]> { return this.http.get<LeaderboardUser[]>(`${this.apiUrl}/leaderboard/`); }
  getWeeklyQuests(): Observable<WeeklyQuestResponse> { return this.http.get<WeeklyQuestResponse>(`${this.apiUrl}/weekly/`); }
  getAccessToken(): string | null { return localStorage.getItem('access_token'); }

  private storeTokens(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    this.isLoggedIn.set(true);
  }
}
