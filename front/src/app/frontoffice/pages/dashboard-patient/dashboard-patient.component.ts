import { Component, OnInit, inject, signal } from '@angular/core';
import { SubscriptionPermissionService } from '../../../core/services/subscription-permission.service';
import { Subscription, SubscriptionPlan } from '../../../backoffice/features/subscriptions/models/subscription.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SubscriptionService } from '../../../backoffice/features/subscriptions/services/subscription.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RiskScoreResponse, RiskService } from '../../../core/services/risk.service';
import { AdjustmentProposalResponse } from '../../../core/models/adjustment-proposal.model';
import { AdjustmentService } from '../../../core/services/adjustment.service';
import { SubscriptionPermission } from '../../../core/models/subscription-permission.model';

@Component({
  selector: 'app-dashboard-patient',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './dashboard-patient.component.html',
  styleUrl: './dashboard-patient.component.scss'
})
export class DashboardPatientComponent implements OnInit {
  public permissionService = inject(SubscriptionPermissionService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);
  private subscriptionService = inject(SubscriptionService);
  private riskService = inject(RiskService);
  private adjustmentService = inject(AdjustmentService);
  
  userName = signal('Patient');
  isHandset = signal(false);

  isLoading = signal(true);
  subscription = signal<Subscription | null>(null);

  isExpiringSoon = signal(false);
  expiryDate = signal<string | null>(null);
  daysRemaining = signal(0);

  risk = signal<RiskScoreResponse | null>(null);
  riskLoading = signal(false);

  adjustment = signal<AdjustmentProposalResponse | null>(null);
  adjustmentLoading = signal(false);
  adjustmentError = signal('');

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName.set(user.name || user.email);
    }

    this.breakpointObserver.observe(Breakpoints.Handset)
      .subscribe(result => {
        this.isHandset.set(result.matches);
      });

    this.permissionService.loadUserSubscription().subscribe({
      next: (sub) => {
        this.subscription.set(sub);
        this.isLoading.set(false);

        this.refreshExpiryState(sub);
        this.loadRisk();
        this.loadAdjustment();
      },
      error: (err) => {
        this.subscription.set(null);
        this.isLoading.set(false);
        this.loadRisk();
      }
    });
  }

  private refreshExpiryState(sub: Subscription | null): void {
    if (!sub?.endDate) {
      this.expiryDate.set(null);
      this.daysRemaining.set(0);
      this.isExpiringSoon.set(false);
      return;
    }

    this.expiryDate.set(sub.endDate);
    const endDate = new Date(sub.endDate);
    const today = new Date();
    const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    this.daysRemaining.set(Math.max(0, diffDays));
    this.isExpiringSoon.set(diffDays <= 7 && diffDays > 0);

    if (this.isExpiringSoon() && sub.id) {
      this.subscriptionService.triggerReminder(sub.id).subscribe();
    }
  }

  getPlanName(): string {
    const sub = this.subscription();
    if (!sub?.plan || !('name' in sub.plan)) return '—';
    return (sub.plan as SubscriptionPlan).name;
  }

  getPlanPrice(): number {
    const sub = this.subscription();
    if (!sub?.plan || !('price' in sub.plan)) return 0;
    return Number((sub.plan as SubscriptionPlan).price) || 0;
  }

  loadRisk(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.riskLoading.set(true);
    this.riskService.getRiskScore(Number(user.id)).subscribe({
      next: data => {
        this.risk.set(data);
        this.riskLoading.set(false);
      },
      error: () => {
        this.risk.set(null);
        this.riskLoading.set(false);
      }
    });
  }

  loadAdjustment(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (!this.permissionService.hasActiveSubscription()) {
      this.adjustment.set(null);
      this.adjustmentError.set('');
      return;
    }

    this.adjustmentLoading.set(true);
    this.adjustmentError.set('');
    this.adjustmentService.checkAdjustment(Number(user.id)).subscribe({
      next: data => {
        this.adjustment.set(data);
        this.adjustmentLoading.set(false);
      },
      error: err => {
        this.adjustment.set(null);
        this.adjustmentLoading.set(false);
        this.adjustmentError.set(err?.error?.message || '');
      }
    });
  }

  getRiskPercent(): number {
    const r = this.risk();
    if (!r) return 0;
    const clamped = Math.max(0, Math.min(100, Number(r.score) || 0));
    return Math.round(clamped);
  }

  getRiskLabel(): string {
    const r = this.risk();
    return r?.riskLevel || '—';
  }

  goToSubscribe(): void {
    this.router.navigate(['/patient/abonnement']);
  }

  canAccessPilier3(): boolean {
    return this.permissionService.hasActiveSubscription();
  }

  getAdjustmentConfidencePercent(a: AdjustmentProposalResponse): number {
    const v = Number(a?.confidenceScore || 0);
    const percent = v <= 1 ? v * 100 : v;
    const clamped = Math.max(0, Math.min(100, percent));
    return Math.round(clamped);
  }

  canAccessPilier2Details(): boolean {
    return this.permissionService.hasPermission(SubscriptionPermission.PILIER2_FULL);
  }

  canAccessPilier1Comparison(): boolean {
    return this.permissionService.hasPermission(SubscriptionPermission.PILIER1_FULL);
  }

  canAccessDossier(): boolean {
    return this.permissionService.hasPermission(SubscriptionPermission.DOSSIER_MEDICAL_FULL);
  }

  canAccessConsultations(): boolean {
    return this.permissionService.hasPermission(SubscriptionPermission.CONSULTATIONS_FULL);
  }

  canInteractEvents(): boolean {
    return this.permissionService.hasPermission(SubscriptionPermission.EVENTS_INTERACT);
  }

  canPostForum(): boolean {
    return this.permissionService.hasPermission(SubscriptionPermission.FORUM_POST);
  }
}
