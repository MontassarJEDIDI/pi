import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '../../models/subscription.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-subscription-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="detail-container" *ngIf="subscription; else loading">
      <section class="detail-hero">
        <div class="hero-copy">
          <button mat-icon-button routerLink=".." aria-label="Retour">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <span class="hero-kicker">Abonnement #{{subscription.id}}</span>
            <h1>Détail de la souscription</h1>
            <p>Vue complète du patient, du plan et des actions d'administration.</p>
          </div>
        </div>

        <div class="hero-status">
          <span [ngClass]="'status-chip status-chip-large ' + getStatusClass(subscription.status)">
            {{ getStatusLabel(subscription.status) }}
          </span>
          <span *ngIf="getDaysUntilEnd(subscription) !== null" class="days-info">
            {{ getDaysUntilEnd(subscription) }} jours restants
          </span>
        </div>
      </section>

      <div class="detail-metrics">
        <div class="metric-box">
          <span class="metric-label">Plan</span>
          <strong>{{getPlanName(subscription)}}</strong>
        </div>
        <div class="metric-box">
          <span class="metric-label">Paiement</span>
          <strong>{{subscription.paymentMethod || 'N/A'}}</strong>
        </div>
        <div class="metric-box">
          <span class="metric-label">Renouvellement auto</span>
          <strong>{{subscription.autoRenew ? 'Oui' : 'Non'}}</strong>
        </div>
      </div>

      <mat-card class="detail-card">
        <mat-card-header>
          <mat-card-title>{{subscription.userFullName}}</mat-card-title>
          <mat-card-subtitle>
            {{getPlanName(subscription)}} • {{ subscription.startDate | date }} → {{subscription.endDate | date}}
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Date de début:</span>
              <span class="value">{{subscription.startDate | date}}</span>
            </div>
            <div class="info-item">
              <span class="label">Date de fin:</span>
              <span class="value">{{subscription.endDate | date}}</span>
            </div>
            <div class="info-item">
              <span class="label">Renouvellement auto:</span>
              <span class="value">{{subscription.autoRenew ? 'Oui' : 'Non'}}</span>
            </div>
            <div class="info-item">
              <span class="label">Paiement:</span>
              <span class="value">{{subscription.paymentMethod || 'N/A'}}</span>
            </div>
          </div>
          
          <mat-divider></mat-divider>
        </mat-card-content>
        <mat-card-actions align="end">
          <button 
            mat-button 
            color="warn" 
            (click)="onCancel()" 
            [disabled]="subscription.status === 'CANCELLED'">
            Résilier
          </button>

          <button 
            mat-button 
            (click)="onToggleSuspend()" 
            *ngIf="subscription.status === 'ACTIVE' || subscription.status === 'SUSPENDED'">
            {{ subscription.status === 'SUSPENDED' ? 'Reprendre' : 'Suspendre' }}
          </button>

          <button 
            mat-raised-button 
            color="primary" 
            (click)="onRenew()" 
            [disabled]="!canRenew(subscription)">
            Renouveler
          </button>
        </mat-card-actions>
      </mat-card>
    </div>

    <ng-template #loading>
      <div class="loading">Chargement...</div>
    </ng-template>
  `,
  styles: [`
    .detail-container { padding: 8px 0 24px; max-width: 980px; margin: 0 auto; display: grid; gap: 20px; }
    .detail-hero {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      padding: 28px;
      border-radius: 24px;
      background: linear-gradient(135deg, #0c1222 0%, #163355 100%);
      color: white;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
    }
    .hero-copy { display: flex; align-items: flex-start; gap: 14px; }
    .hero-copy h1 { margin: 6px 0 6px; font-size: 2rem; font-weight: 800; }
    .hero-copy p { margin: 0; color: rgba(255, 255, 255, 0.72); }
    .hero-kicker {
      display: inline-flex;
      padding: 6px 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      color: #7dd3fc;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .hero-status { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
    .detail-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
    .metric-box {
      padding: 18px 20px;
      border-radius: 20px;
      background: white;
      border: 1px solid #dbe7f3;
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
    }
    .metric-label { display: block; font-size: 0.78rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .metric-box strong { display: block; margin-top: 8px; color: #1e293b; font-size: 1.05rem; }
    .detail-card { border-radius: 24px; border: 1px solid #dbe7f3; }
    .info-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin: 20px 0; }
    .info-item { display: flex; flex-direction: column; gap: 6px; padding: 16px; border-radius: 16px; background: #f8fbff; border: 1px solid #e4edf7; }
    .label { font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { font-size: 16px; font-weight: 700; color: #1e293b; }
    mat-divider { margin: 20px 0; }
    .features-block h3 { margin: 0 0 14px; font-size: 1.05rem; color: #1e293b; }
    ul { margin: 0; padding-left: 18px; color: #475569; display: grid; gap: 8px; }
    .loading { text-align: center; padding: 50px; color: #64748b; }
    .status-chip {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .status-active { background: #e8f5e9; color: #2e7d32; }
    .status-expired { background: rgba(148, 163, 184, 0.18); color: #475569; }
    .status-cancelled { background: rgba(239, 68, 68, 0.14); color: #b91c1c; }
    .status-suspended { background: rgba(245, 158, 11, 0.14); color: #b45309; }
    .status-chip-large { padding: 8px 14px; font-size: 0.8rem; font-weight: 800; }
    .days-info {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.74);
    }
    @media (max-width: 768px) {
      .detail-hero { flex-direction: column; }
      .hero-status { align-items: flex-start; }
      .detail-metrics, .info-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SubscriptionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subscriptionService = inject(SubscriptionService);
  
  subscription?: Subscription;

  /** Accès type-safe au nom du plan (plan peut être un objet complet ou seulement { id }). */
  getPlanName(sub: Subscription): string {
    const p = sub.plan;
    return p && 'name' in p ? (p as SubscriptionPlan).name : '—';
  }

  /** Accès type-safe aux fonctionnalités du plan. */
  getPlanFeatures(sub: Subscription): string[] {
    const p = sub.plan;
    return p && 'features' in p && Array.isArray((p as SubscriptionPlan).features)
      ? (p as SubscriptionPlan).features
      : [];
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        const navState = this.router.getCurrentNavigation()?.extras?.state as any;
        const stateSub = navState?.subscription as Subscription | undefined;
        const historySub = (history.state?.subscription as Subscription | undefined);
        const initial = stateSub || historySub;
        if (initial && Number((initial as any).id) === id) {
          this.subscription = initial;
        }

        return this.subscriptionService.getSubscriptionById(id);
      })
    ).subscribe(sub => {
      this.subscription = sub;
    });
  }

  getStatusLabel(status?: SubscriptionStatus): string {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'EXPIRED': return 'Expiré';
      case 'CANCELLED': return 'Annulé';
      case 'SUSPENDED': return 'Suspendu';
      default: return 'Inconnu';
    }
  }

  getStatusClass(status?: SubscriptionStatus): string {
    switch (status) {
      case 'ACTIVE': return 'status-active';
      case 'EXPIRED': return 'status-expired';
      case 'CANCELLED': return 'status-cancelled';
      case 'SUSPENDED': return 'status-suspended';
      default: return '';
    }
  }

  getDaysUntilEnd(sub: Subscription): number | null {
    if (!sub.endDate) return null;
    const end = new Date(sub.endDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  canRenew(sub: Subscription): boolean {
    if (!sub.endDate || !sub.status) return false;
    const days = this.getDaysUntilEnd(sub);
    // On autorise le renouvellement si expiré ou s'il reste <= 30 jours
    return sub.status === 'EXPIRED' || (typeof days === 'number' && days <= 30);
  }

  onCancel(): void {
    if (!this.subscription?.id) return;
    if (!confirm('Confirmer la résiliation de cet abonnement ?')) return;
    this.subscriptionService.updateSubscription(this.subscription.id, {
      status: 'CANCELLED',
      autoRenew: false
    }).subscribe(sub => {
      this.subscription = sub;
      alert('Abonnement résilié.');
    });
  }

  onToggleSuspend(): void {
    if (!this.subscription?.id || !this.subscription.status) return;
    if (this.subscription.status === 'SUSPENDED') {
      this.subscriptionService.resumeSubscription(this.subscription.id).subscribe(sub => {
        this.subscription = sub;
        alert('Abonnement repris.');
      });
      return;
    }

    this.subscriptionService.suspendSubscription(this.subscription.id).subscribe(sub => {
      this.subscription = sub;
      alert('Abonnement suspendu.');
    });
  }

  onRenew(): void {
    if (!this.subscription?.id) return;
    const sub = this.subscription;
    const today = new Date();
    const currentEnd = sub.endDate ? new Date(sub.endDate) : today;

    // Point de départ du renouvellement : fin actuelle si future, sinon aujourd'hui
    const startBase = currentEnd > today ? currentEnd : today;

    const plan = sub.plan as SubscriptionPlan;
    const months = plan?.durationMonths || 1;
    const newStart = new Date(startBase);
    const newEnd = new Date(newStart);
    newEnd.setMonth(newEnd.getMonth() + months);

    this.subscriptionService.updateSubscription(sub.id!, {
      startDate: newStart.toISOString(),
      endDate: newEnd.toISOString(),
      status: 'ACTIVE'
    }).subscribe(updated => {
      this.subscription = updated;
      alert('Abonnement renouvelé.');
    });
  }
}
