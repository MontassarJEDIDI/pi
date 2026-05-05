import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { SubscriptionPermissionService } from './subscription-permission.service';
import { AuthService, User } from './auth.service';
import { SubscriptionService } from '../../backoffice/features/subscriptions/services/subscription.service';
import { SubscriptionPermission } from '../models/subscription-permission.model';

class AuthServiceStub {
  private subject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.subject.asObservable();
  private user: User | null = null;

  setUser(u: User | null) {
    this.user = u;
    this.subject.next(u);
  }

  getCurrentUser(): User | null {
    return this.user;
  }
}

describe('SubscriptionPermissionService', () => {
  let service: SubscriptionPermissionService;
  let auth: AuthServiceStub;
  let subscriptionService: { getAllSubscriptions: () => any };

  beforeEach(() => {
    subscriptionService = { getAllSubscriptions: () => of([] as any) };

    TestBed.configureTestingModule({
      providers: [
        SubscriptionPermissionService,
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: SubscriptionService, useValue: subscriptionService }
      ]
    });

    service = TestBed.inject(SubscriptionPermissionService);
    auth = TestBed.inject(AuthService) as any;
  });

  it('should return null when no user', async () => {
    auth.setUser(null);
    subscriptionService.getAllSubscriptions = () => of([] as any);

    const res = await firstValueFrom(service.loadUserSubscription());
    expect(res).toBeNull();
    expect(service.hasActiveSubscription()).toBe(false);
  });

  it('should select latest ACTIVE subscription by endDate', async () => {
    auth.setUser({ id: '90', email: 'a@b.com', role: 'PATIENT' });
    subscriptionService.getAllSubscriptions = () => of([
      { id: 1, userId: 90, status: 'ACTIVE', endDate: '2026-04-10', plan: { name: 'Basique' } },
      { id: 2, userId: 90, status: 'ACTIVE', endDate: '2026-05-10', plan: { name: 'Premium' } },
      { id: 3, userId: 90, status: 'EXPIRED', endDate: '2026-06-10', plan: { name: 'Pro' } },
    ] as any);

    const res = await firstValueFrom(service.loadUserSubscription());
    expect(res?.id).toBe(2);
    expect(service.hasActiveSubscription()).toBe(true);
    expect(service.getCurrentPlanName()).toBe('Premium');
    expect(service.hasPermission(SubscriptionPermission.PILIER2_FULL)).toBe(true);
  });
});
