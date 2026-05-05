import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import {
  SubscriptionService,
  RecommendationResponse,
  RecommendationRequest,
  ConseilMedical
} from '../../../backoffice/features/subscriptions/services/subscription.service';
import { AuthService } from '../../../core/services/auth.service';
import { SubscriptionPermissionService } from '../../../core/services/subscription-permission.service';
import { SubscriptionPermission } from '../../../core/models/subscription-permission.model';

@Component({
  selector: 'app-subscription-recommendation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule
  ],
  templateUrl: './subscription-recommendation.component.html',
  styleUrls: ['./subscription-recommendation.component.scss']
})
export class SubscriptionRecommendationComponent {
  private fb = inject(FormBuilder);
  private subscriptionService = inject(SubscriptionService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private permissionService = inject(SubscriptionPermissionService);

  recommendationForm: FormGroup;
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  saveMessage = signal<string | null>(null);
  recommendation = signal<RecommendationResponse | null>(null);
  lastRequest = signal<RecommendationRequest | null>(null);
  canSeeComparison = signal(false);

  constructor() {
    this.permissionService.loadUserSubscription().subscribe(() => {
      this.canSeeComparison.set(this.permissionService.hasPermission(SubscriptionPermission.PILIER1_FULL));
    });

    this.recommendationForm = this.fb.group({
      ageEnfant: ['', [Validators.required, Validators.min(1), Validators.max(18)]],
      moisDepuisGreffe: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
      aEuEpisodeRejet: [0, [Validators.required]],
      nombreHospitalisationsAn: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      prendImmunosuppresseurs: [1, [Validators.required]],
      nombreMedicamentsQuotidiens: ['', [Validators.required, Validators.min(1), Validators.max(15)]],
      presenceComplicationActive: [0, [Validators.required]]
    });
  }

  private buildRequest(): RecommendationRequest | null {
    const user = this.authService.getCurrentUser();
    const userId = user ? Number(user.id) : NaN;
    if (!Number.isFinite(userId)) {
      this.errorMessage.set('Utilisateur non authentifié. Veuillez vous reconnecter.');
      return null;
    }

    const v = this.recommendationForm.value;
    return {
      userId,
      ageEnfant: Number(v.ageEnfant),
      moisDepuisGreffe: Number(v.moisDepuisGreffe),
      aEuEpisodeRejet: Number(v.aEuEpisodeRejet),
      nombreHospitalisationsAn: Number(v.nombreHospitalisationsAn),
      prendImmunosuppresseurs: Number(v.prendImmunosuppresseurs),
      nombreMedicamentsQuotidiens: Number(v.nombreMedicamentsQuotidiens),
      presenceComplicationActive: Number(v.presenceComplicationActive)
    };
  }

  getRecommendation() {
    if (this.recommendationForm.invalid || this.isLoading() || this.isSaving()) {
      this.recommendationForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.saveMessage.set(null);
    this.recommendation.set(null);

    const request = this.buildRequest();
    if (!request) return;

    this.isLoading.set(true);

    this.subscriptionService.saveProfileAndRecommend(request).subscribe({
      next: (res) => {
        this.lastRequest.set(request);
        this.recommendation.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Une erreur est survenue lors du calcul de la recommandation.';
        this.errorMessage.set(msg);
        this.isLoading.set(false);
      }
    });
  }

  saveProfile() {
    if (this.recommendationForm.invalid || this.isLoading() || this.isSaving()) {
      this.recommendationForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.saveMessage.set(null);

    const request = this.buildRequest();
    if (!request) return;

    this.isSaving.set(true);

    this.subscriptionService.saveProfileAndRecommend(request).subscribe({
      next: (res) => {
        this.lastRequest.set(request);
        this.recommendation.set(res);
        this.saveMessage.set('Profil médical enregistré.');
        this.isSaving.set(false);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Une erreur est survenue lors de l\'enregistrement du profil.';
        this.errorMessage.set(msg);
        this.isSaving.set(false);
      }
    });
  }

  getScoreColor(score: number): string {
    if (score > 80) return '#4caf50';
    if (score > 50) return '#ff9800';
    return '#f44336';
  }

  getUrgenceTone(urgence: string): 'critical' | 'high' | 'medium' | 'normal' {
    const u = (urgence || '').toUpperCase();
    if (u === 'CRITIQUE') return 'critical';
    if (u === 'HAUTE') return 'high';
    if (u === 'MOYENNE') return 'medium';
    return 'normal';
  }

  trackConseil(_index: number, item: ConseilMedical) {
    return `${item.categorie}-${item.urgence}-${item.conseil}`;
  }

  navigateToSubscribe() {
    const res = this.recommendation();
    if (!res) return;

    // Mapping du planId (backend) vers l'ID UI utilisé dans AbonnementPatientComponent
    // 1 -> basic, 2 -> premium, 3 -> pro
    const planMapping: Record<number, string> = {
      1: 'basic',
      2: 'premium',
      3: 'pro'
    };

    const planId = planMapping[res.planId] || 'premium';

    // Navigation vers la page d'abonnement avec l'état du plan
    this.router.navigate(['/patient/abonnement'], { 
      queryParams: { plan: planId } 
    });
  }

  viewAllPlans() {
    this.router.navigate(['/patient/abonnement']);
  }
}
