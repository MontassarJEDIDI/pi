import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SubscriptionPermissionService } from '../services/subscription-permission.service';
import { SubscriptionPermission } from '../models/subscription-permission.model';
import { Subscription } from '../../backoffice/features/subscriptions/models/subscription.model';

@Component({
  selector: 'app-subscription-status',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <mat-card *ngIf="subscription" class="subscription-card">
      <mat-card-header>
        <div class="subscription-header">
          <mat-icon [style.color]="getPlanColor()">{{ getPlanIcon() }}</mat-icon>
          <div>
            <mat-card-title>Abonnement {{ planName }}</mat-card-title>
            <mat-card-subtitle>
              Expire le {{ subscription.endDate | date:'dd/MM/yyyy' }}
            </mat-card-subtitle>
          </div>
        </div>
      </mat-card-header>
      <mat-card-content>
        <div class="permissions-list">
          <h4>Fonctionnalités incluses :</h4>
          <div class="permission-chips">
            <mat-chip *ngFor="let perm of permissions" [color]="'primary'" selected>
              {{ getPermissionLabel(perm) }}
            </mat-chip>
          </div>
        </div>
      </mat-card-content>
      <mat-card-actions *ngIf="isExpiringSoon()">
        <button mat-raised-button color="primary" routerLink="/patient/abonnement">
          Renouveler l'abonnement
        </button>
      </mat-card-actions>
    </mat-card>

    <mat-card *ngIf="!subscription" class="subscription-card no-subscription">
      <mat-card-content>
        <div class="no-subscription-content">
          <mat-icon color="warn">warning</mat-icon>
          <h3>Aucun abonnement actif</h3>
          <p>Vous devez souscrire à un abonnement pour accéder aux fonctionnalités.</p>
          <button mat-raised-button color="primary" routerLink="/patient/abonnement">
            Choisir un abonnement
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .subscription-card {
      margin: 16px;
    }
    
    .subscription-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .permissions-list {
      margin-top: 16px;
    }
    
    .permission-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }
    
    .no-subscription-content {
      text-align: center;
      padding: 24px;
    }
    
    .no-subscription-content mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
  `]
})
export class SubscriptionStatusComponent implements OnInit {
  private permissionService = inject(SubscriptionPermissionService);

  subscription: Subscription | null = null;
  planName: string = '';
  permissions: SubscriptionPermission[] = [];

  ngOnInit(): void {
    this.loadSubscription();
  }

  loadSubscription(): void {
    this.permissionService.loadUserSubscription().subscribe(sub => {
      this.subscription = sub;
      this.planName = this.permissionService.getCurrentPlanName();
      this.permissions = this.permissionService.getPermissions();
    });
  }

  getPlanColor(): string {
    switch (this.planName) {
      case 'Basique': return '#4CAF50';
      case 'Premium': return '#2196F3';
      case 'Pro': return '#FF9800';
      default: return '#757575';
    }
  }

  getPlanIcon(): string {
    switch (this.planName) {
      case 'Basique': return 'check_circle';
      case 'Premium': return 'star';
      case 'Pro': return 'diamond';
      default: return 'card_membership';
    }
  }

  getPermissionLabel(permission: SubscriptionPermission): string {
    const labels: Partial<Record<SubscriptionPermission, string>> = {
      [SubscriptionPermission.DOSSIER_MEDICAL_PREVIEW]: 'Dossier médical (aperçu)',
      [SubscriptionPermission.DOSSIER_MEDICAL_FULL]: 'Dossier médical (accès complet)',
      [SubscriptionPermission.CONSULTATIONS_PREVIEW]: 'Consultations (aperçu)',
      [SubscriptionPermission.CONSULTATIONS_FULL]: 'Consultations (accès complet)',
      [SubscriptionPermission.EVENTS_READ]: 'Événements (lecture)',
      [SubscriptionPermission.EVENTS_INTERACT]: 'Événements (inscription & rappels)',
      [SubscriptionPermission.FORUM_READ]: 'Forum (lecture)',
      [SubscriptionPermission.FORUM_POST]: 'Forum (publication)',
      [SubscriptionPermission.PILIER1_LIGHT]: 'Pilier 1 (résultat simple)',
      [SubscriptionPermission.PILIER1_FULL]: 'Pilier 1 (comparaison complète)',
      [SubscriptionPermission.PILIER2_SCORE]: 'Pilier 2 (score)',
      [SubscriptionPermission.PILIER2_FULL]: 'Pilier 2 (historique & conseils)',
      [SubscriptionPermission.PILIER3_ACCESS]: 'Pilier 3 (ajustement dynamique)',
      [SubscriptionPermission.CONSULTATIONS_LIMITED]: 'Consultations limitées',
      [SubscriptionPermission.CONSULTATIONS_UNLIMITED]: 'Consultations illimitées',
      [SubscriptionPermission.TELECONSULTATION]: 'Téléconsultation',
      [SubscriptionPermission.MEDICAL_RECORD_BASIC]: 'Dossier médical (basique)',
      [SubscriptionPermission.MEDICAL_RECORD_FULL]: 'Dossier médical (complet)',
      [SubscriptionPermission.APPOINTMENT_REMINDERS]: 'Rappels de rendez-vous',
      [SubscriptionPermission.SUPPORT_EMAIL]: 'Support email',
      [SubscriptionPermission.SUPPORT_PRIORITY]: 'Support prioritaire',
      [SubscriptionPermission.SUPPORT_PHONE]: 'Support téléphonique',
      [SubscriptionPermission.FORUMS_ACCESS]: 'Forums médicaux',
      [SubscriptionPermission.REPORTS_BASIC]: 'Rapports de base',
      [SubscriptionPermission.REPORTS_DETAILED]: 'Rapports détaillés',
      [SubscriptionPermission.STATISTICS_ADVANCED]: 'Statistiques avancées',
      [SubscriptionPermission.EXAMENS_BASIC]: 'Examens de base',
      [SubscriptionPermission.EXAMENS_ADVANCED]: 'Analyses avancées',
      [SubscriptionPermission.FOLLOW_UP_PERSONALIZED]: 'Suivi personnalisé',
      [SubscriptionPermission.WEBINARS_ACCESS]: 'Webinaires exclusifs',
      [SubscriptionPermission.PATIENTS_LIMITED]: 'Jusqu\'à 50 patients',
      [SubscriptionPermission.PATIENTS_UNLIMITED]: 'Patients illimités',
      [SubscriptionPermission.VIDEO_LIBRARY_ACCESS]: 'Vidéos éducatives pour les parents (Pro)',
      [SubscriptionPermission.EVENTS_ACCESS]: 'Événements et webinaires',
    };
    return labels[permission] || permission;
  }

  isExpiringSoon(): boolean {
    if (!this.subscription?.endDate) return false;
    const endDate = new Date(this.subscription.endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  }
}
