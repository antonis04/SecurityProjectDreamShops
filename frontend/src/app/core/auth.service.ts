import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE } from './api';
import { ApiResponse, JwtResponse } from './models';

interface JwtPayload {
  sub: string;
  id: number;
  roles: string[];
  exp: number;
}

const TOKEN_KEY = 'ds_token';
const USERID_KEY = 'ds_userId';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly userId = signal<number | null>(
    localStorage.getItem(USERID_KEY) ? Number(localStorage.getItem(USERID_KEY)) : null,
  );

  readonly isLoggedIn = computed(() => !!this.token() && !this.isExpired());
  readonly roles = computed(() => this.decode()?.roles ?? []);
  readonly isAdmin = computed(() => this.roles().includes('ROLE_ADMIN'));
  readonly email = computed(() => this.decode()?.sub ?? null);

  login(email: string, password: string): Observable<ApiResponse<JwtResponse>> {
    return this.http
      .post<ApiResponse<JwtResponse>>(`${API_BASE}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          this.token.set(res.data.token);
          this.userId.set(res.data.id);
          localStorage.setItem(TOKEN_KEY, res.data.token);
          localStorage.setItem(USERID_KEY, String(res.data.id));
        }),
      );
  }

  register(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${API_BASE}/users/add`, payload);
  }

  logout(): void {
    this.token.set(null);
    this.userId.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERID_KEY);
  }

  private decode(): JwtPayload | null {
    const t = this.token();
    if (!t) return null;
    try {
      const payload = t.split('.')[1];
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
      return null;
    }
  }

  private isExpired(): boolean {
    const p = this.decode();
    return !p ? true : p.exp * 1000 < Date.now();
  }
}
