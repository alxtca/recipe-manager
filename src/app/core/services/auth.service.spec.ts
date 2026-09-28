import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { DEMO_USERS } from '../data/constants';

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('[authentication-2] starts logged out when nothing is persisted', () => {
    const service = TestBed.inject(AuthService);
    expect(service.currentUser()).toBeNull();
  });

  it('[authentication-1] logs in and persists the current user', () => {
    const service = TestBed.inject(AuthService);
    service.login(DEMO_USERS[0]);

    expect(service.currentUser()).toEqual(DEMO_USERS[0]);
    expect(JSON.parse(localStorage.getItem('rm-current-user')!)).toEqual(DEMO_USERS[0]);
  });

  it('[authentication-1] logs out and clears persisted user', () => {
    const service = TestBed.inject(AuthService);
    service.login(DEMO_USERS[0]);
    service.logout();

    expect(service.currentUser()).toBeNull();
    expect(localStorage.getItem('rm-current-user')).toBeNull();
  });

  it('[authentication-1] restores the logged-in user from localStorage on init', () => {
    localStorage.setItem('rm-current-user', JSON.stringify(DEMO_USERS[1]));
    const service = TestBed.inject(AuthService);

    expect(service.currentUser()).toEqual(DEMO_USERS[1]);
  });
});
