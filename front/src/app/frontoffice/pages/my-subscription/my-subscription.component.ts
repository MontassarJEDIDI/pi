import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from '../../../backoffice/features/subscriptions/models/subscription.model';
import { SubscriptionService } from '../../../backoffice/features/subscriptions/services/subscription.service';
import { SubscriptionPermissionService } from '../../../core/services/subscription-permission.service';

@Component({
  selector: 'app-my-subscription',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './my-subscription.component.html',
  styleUrls: ['./my-subscription.component.scss']
})
export class MySubscriptionComponent implements OnInit {
  private permissionService = inject(SubscriptionPermissionService);
  private subscriptionService = inject(SubscriptionService);
  private router = inject(Router);

  loading = signal(true);
  autoRenewLoading = signal(false);
  subscription = signal<Subscription | null>(null);

  planName = computed(() => {
    const sub = this.subscription();
    const plan = sub?.plan as any;
    return plan?.name || '—';
  });

  planPrice = computed(() => {
    const sub = this.subscription();
    const plan = sub?.plan as any;
    const v = Number(plan?.price || 0);
    return Number.isFinite(v) ? v : 0;
  });

  status = computed(() => this.subscription()?.status || '—');

  startDate = computed(() => this.subscription()?.startDate || null);
  endDate = computed(() => this.subscription()?.endDate || null);

  daysRemaining = computed(() => {
    const end = this.endDate();
    if (!end) return null;
    const endDate = new Date(end);
    if (Number.isNaN(endDate.getTime())) return null;
    const today = new Date();
    const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  });

  ngOnInit(): void {
    this.permissionService.loadUserSubscription().subscribe({
      next: (sub) => {
        this.subscription.set(sub);
        this.loading.set(false);
      },
      error: () => {
        this.subscription.set(null);
        this.loading.set(false);
      }
    });
  }

  statusLabel(): string {
    const s = (this.subscription()?.status || '').toUpperCase();
    if (s === 'ACTIVE') return 'Actif';
    if (s === 'SUSPENDED') return 'Suspendu';
    if (s === 'EXPIRED') return 'Expiré';
    if (s === 'CANCELLED') return 'Annulé';
    return '—';
  }

  statusTone(): 'success' | 'warning' | 'danger' | 'neutral' {
    const s = (this.subscription()?.status || '').toUpperCase();
    if (s === 'ACTIVE') return 'success';
    if (s === 'SUSPENDED') return 'warning';
    if (s === 'EXPIRED' || s === 'CANCELLED') return 'danger';
    return 'neutral';
  }

  goToOffers(): void {
    this.router.navigate(['/patient/abonnement']);
  }

  toggleAutoRenew(): void {
    const sub = this.subscription();
    if (!sub || !sub.id) return;
    this.autoRenewLoading.set(true);
    const nextValue = !Boolean(sub.autoRenew);
    this.subscriptionService.updateAutoRenew(Number(sub.id), nextValue).subscribe({
      next: (updated) => {
        this.subscription.set(updated);
        this.permissionService.loadUserSubscription().subscribe();
        this.autoRenewLoading.set(false);
      },
      error: () => {
        this.autoRenewLoading.set(false);
      }
    });
  }
}
