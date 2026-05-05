import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RiskService, RiskScoreResponse, RiskScoreHistoryDto } from '../../../core/services/risk.service';
import { AuthService } from '../../../core/services/auth.service';
import { SubscriptionPermissionService } from '../../../core/services/subscription-permission.service';
import { SubscriptionPermission } from '../../../core/models/subscription-permission.model';

@Component({
  selector: 'app-engagement-risk',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTableModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './engagement-risk.component.html',
  styleUrls: ['./engagement-risk.component.scss']
})
export class EngagementRiskComponent implements OnInit {
  private riskService = inject(RiskService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private permissionService = inject(SubscriptionPermissionService);

  riskData = signal<RiskScoreResponse | null>(null);
  isLoading = signal(false);
  isSimulating = signal(false);
  canSeeDetails = signal(false);

  displayedColumns: string[] = ['date', 'score', 'level'];

  ngOnInit() {
    this.permissionService.loadUserSubscription().subscribe(() => {
      this.canSeeDetails.set(this.permissionService.hasPermission(SubscriptionPermission.PILIER2_FULL));
      this.loadRiskData();
    });
  }

  loadRiskData() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.isLoading.set(true);
    this.riskService.getRiskScore(Number(user.id)).subscribe({
      next: (data) => {
        this.riskData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement risque:', err);
        this.isLoading.set(false);
        this.snackBar.open('Erreur lors du chargement des données de risque', 'Fermer', { duration: 3000 });
      }
    });
  }

  simulateNewData() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.isSimulating.set(true);
    this.riskService.simulateBehavior(Number(user.id)).subscribe({
      next: (data) => {
        this.riskData.set(data);
        this.isSimulating.set(false);
        this.snackBar.open('Nouvelle simulation de comportement générée !', 'Super', { duration: 3000 });
      },
      error: (err) => {
        console.error('Erreur simulation:', err);
        this.isSimulating.set(false);
        this.snackBar.open('Erreur lors de la simulation', 'Fermer', { duration: 3000 });
      }
    });
  }

  getRiskColor(level: string): string {
    switch (level) {
      case 'FAIBLE': return '#4caf50';
      case 'MOYEN': return '#ff9800';
      case 'ÉLEVÉ': return '#f44336';
      default: return '#9e9e9e';
    }
  }

  getRiskIcon(level: string): string {
    switch (level) {
      case 'FAIBLE': return 'check_circle';
      case 'MOYEN': return 'warning';
      case 'ÉLEVÉ': return 'report_problem';
      default: return 'help';
    }
  }
}
