import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should login patient with correct pattern and password', async () => {
    vi.useFakeTimers();
    const p = firstValueFrom(service.login('patient.test@pedianephro.com', 'patient.test123', 'patient'));
    vi.advanceTimersByTime(500);
    const result = await p;
    vi.useRealTimers();

    expect(result).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.getCurrentUserRole()).toBe('PATIENT');
    expect(service.getCurrentUser()?.email).toBe('patient.test@pedianephro.com');
  });

  it('should derive numeric id when email ends with digits', async () => {
    vi.useFakeTimers();
    const p = firstValueFrom(service.login('patient90@pedianephro.com', 'patient90123', 'patient'));
    vi.advanceTimersByTime(500);
    await p;
    vi.useRealTimers();

    expect(service.getCurrentUser()?.id).toBe('90');
  });

  it('should login admin user', async () => {
    vi.useFakeTimers();
    const p = firstValueFrom(service.login('admin@pedianephro.com', 'admin123', 'admin'));
    vi.advanceTimersByTime(500);
    await p;
    vi.useRealTimers();

    expect(service.getCurrentUserRole()).toBe('ADMIN');
  });

  it('should logout and clear current user', () => {
    (service as any).currentUserSubject.next({ id: '1', email: 'x@pedianephro.com', role: 'PATIENT' });
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
  });
});
