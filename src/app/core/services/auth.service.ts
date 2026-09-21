import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { DEMO_USERS } from '../data/constants';

const STORAGE_KEY = 'rm-current-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly users: User[] = DEMO_USERS;
  readonly currentUser = signal<User | null>(this.loadUser());

  login(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
