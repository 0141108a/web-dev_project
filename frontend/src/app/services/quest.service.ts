import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Quest } from '../interfaces/quest.interface';

@Injectable({ providedIn: 'root' })
export class QuestService {
  private readonly apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/`);
  }

  addCategory(payload: { name: string; color: string }): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories/`, payload);
  }

  getQuests(): Observable<Quest[]> {
    return this.http.get<Quest[]>(`${this.apiUrl}/quests/`);
  }

  addQuest(payload: Partial<Quest>): Observable<Quest> {
    return this.http.post<Quest>(`${this.apiUrl}/quests/`, payload);
  }

  updateQuest(id: number, payload: Partial<Quest>): Observable<Quest> {
    return this.http.put<Quest>(`${this.apiUrl}/quests/${id}/`, payload);
  }

  deleteQuest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/quests/${id}/`);
  }

  completeQuest(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/quests/${id}/complete/`, {});
  }
}
