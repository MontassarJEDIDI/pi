import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RenewalService } from '../../../core/services/renewal.service';
import { RenewalProposalResponse } from '../../../core/models/renewal-proposal.model';

@Component({
  selector: 'app-renewal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './renewal.component.html',
  styleUrls: ['./renewal.component.scss']
})
export class RenewalComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private renewalService = inject(RenewalService);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  saving = signal(false);
  proposal = signal<RenewalProposalResponse | null>(null);
  error = signal('');

  adjustment = computed(() => this.proposal()?.proposal || null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.queryParamMap.get('subscriptionId');
    const subscriptionId = Number(idParam || 0);
    if (!subscriptionId) {
      this.loading.set(false);
      this.error.set('Aucune proposition de renouvellement n’a été trouvée.');
      return;
    }

    this.renewalService.getProposal(subscriptionId).subscribe({
      next: (res) => {
        this.proposal.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Impossible de charger la proposition.');
      }
    });
  }

  acceptSuggestion(): void {
    this.confirm(true);
  }

  keepCurrentPlan(): void {
    this.confirm(false);
  }

  private confirm(acceptSuggestion: boolean): void {
    const p = this.proposal();
    if (!p) return;
    this.saving.set(true);
    this.renewalService.confirm(p.subscriptionId, { acceptSuggestion }).subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open('Renouvellement confirmé.', 'Fermer', { duration: 2500 });
        this.router.navigate(['/patient/mon-abonnement']);
      },
      error: (err) => {
        this.saving.set(false);
        this.snackBar.open(err?.error?.message || 'Échec du renouvellement.', 'Fermer', { duration: 3000 });
      }
    });
  }

  formatDelta(diff: number): string {
    const v = Number(diff || 0);
    const sign = v > 0 ? '+' : '';
    return `${sign}${Math.round(v)} DT/mois`;
  }

  confidencePercent(value: number): number {
    const v = Number(value || 0);
    const percent = v <= 1 ? v * 100 : v;
    const clamped = Math.max(0, Math.min(100, percent));
    return Math.round(clamped);
  }
}

