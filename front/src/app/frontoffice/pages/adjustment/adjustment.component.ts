import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdjustmentProposalResponse, AdjustmentType } from '../../../core/models/adjustment-proposal.model';
import { AdjustmentService } from '../../../core/services/adjustment.service';
import { AuthService } from '../../../core/services/auth.service';
import { SubscriptionPermissionService } from '../../../core/services/subscription-permission.service';

@Component({
  selector: 'app-adjustment',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './adjustment.component.html',
  styleUrls: ['./adjustment.component.scss']
})
export class AdjustmentComponent implements OnInit {
  private adjustmentService = inject(AdjustmentService);
  private authService = inject(AuthService);
  private permissionService = inject(SubscriptionPermissionService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  data = signal<AdjustmentProposalResponse | null>(null);
  loading = signal(false);
  simulating = signal(false);
  errorMessage = signal('');
  unlocked = signal(false);
  currentPlan = signal('');

  ngOnInit(): void {
    this.permissionService.loadUserSubscription().subscribe(() => {
      this.currentPlan.set(this.permissionService.getCurrentPlanName());
      this.unlocked.set(this.permissionService.hasActiveSubscription());
      if (this.unlocked()) {
        this.loadRealResult();
      }
    });
  }

  loadRealResult(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage.set('Vous devez vous connecter pour consulter l\'ajustement.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.adjustmentService.checkAdjustment(Number(user.id)).subscribe({
      next: res => {
        this.data.set(res);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        const msg = err?.error?.message || err?.message || 'Erreur lors du chargement.';
        this.errorMessage.set(msg);
        this.snackBar.open('Erreur lors du chargement de l\'ajustement', 'Fermer', { duration: 3000 });
      }
    });
  }

  simulate(scenario: AdjustmentType): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.simulating.set(true);
    this.errorMessage.set('');
    this.adjustmentService.simulateAdjustment(Number(user.id), scenario).subscribe({
      next: res => {
        this.data.set(res);
        this.simulating.set(false);
      },
      error: err => {
        this.simulating.set(false);
        this.errorMessage.set(err?.error?.message || err?.message || 'Erreur lors de la simulation.');
        this.snackBar.open('Erreur lors de la simulation', 'Fermer', { duration: 3000 });
      }
    });
  }

  getCardClass(type?: AdjustmentType): string {
    if (!type) return 'card-neutral';
    if (type === 'OPTIMAL') return 'card-success';
    if (type === 'DESCENTE') return 'card-success';
    return 'card-warning';
  }

  getIcon(type?: AdjustmentType): string {
    if (!type) return 'help';
    if (type === 'OPTIMAL') return 'check_circle';
    if (type === 'DESCENTE') return 'south';
    return 'north';
  }

  formatDelta(data: AdjustmentProposalResponse): string {
    const diff = Number(data.difference || 0);
    const abs = Math.abs(diff);
    const sign = diff > 0 ? '+' : diff < 0 ? '-' : '';
    return `${sign}${abs.toFixed(0)} DT/mois`;
  }

  confidencePercent(data: AdjustmentProposalResponse): number {
    const v = Number(data.confidenceScore || 0);
    const percent = v <= 1 ? v * 100 : v;
    const clamped = Math.max(0, Math.min(100, percent));
    return Math.round(clamped);
  }

  displayJustification(justification: string): string {
    const raw = (justification || '').trim();
    const cleaned = raw
      .replace(/Aucun profil patient n'est disponible\.[\s\S]*?personnalisée\./i, '')
      .replace(/\s+/g, ' ')
      .trim();

    return cleaned || 'Analyse basée sur votre abonnement actuel.';
  }

  goToSubscribe(): void {
    this.router.navigate(['/patient/abonnement']);
  }
}
