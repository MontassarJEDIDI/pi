import { Inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Subscription, SubscriptionPlan } from '../models/subscription.model';
import { API_BASE } from '../../../../core/tokens/api-base.token';

export interface AdminCreateSubscriptionRequest {
  userId: number;
  planId: number;
  startDate: string;
  paymentMethod: string;
}

export interface RecommendationRequest {
  userId: number;
  ageEnfant: number;
  moisDepuisGreffe: number;
  aEuEpisodeRejet: number;
  nombreHospitalisationsAn: number;
  prendImmunosuppresseurs: number;
  nombreMedicamentsQuotidiens: number;
  presenceComplicationActive: number;
  comorbidites?: number;
  frequenceSuivi?: number;
}

export interface ConseilMedical {
  categorie: string;
  conseil: string;
  urgence: 'CRITIQUE' | 'HAUTE' | 'MOYENNE' | 'NORMALE' | string;
}

export interface RecommendationResponse {
  planId: number;
  planName: string;
  planPrice: number;
  confidenceScore: number;
  justification: string;
  allPlansRanked: { planId: number; planName: string; score: number }[];
  conseilsMedicaux?: ConseilMedical[];
  alertesMedicales?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl: string;
  private apiBase: string;

  // Signal pour l'état global
  activeSubscriptionsCount = signal(0);

  constructor(private http: HttpClient, @Inject(API_BASE) apiBase: string) {
    this.apiBase = apiBase;
    this.apiUrl = `${apiBase}/api/subscriptions`;
    this.refreshSignals();
  }

  // ... (existing methods)

  /**
   * Obtient une recommandation intelligente basée sur le profil médical
   */
  getRecommendation(data: RecommendationRequest): Observable<RecommendationResponse> {
    return this.http.post<RecommendationResponse>(`${this.apiBase}/api/recommendations/suggest`, data);
  }

  /**
   * Sauvegarde le profil médical et obtient une recommandation
   */
  saveProfileAndRecommend(data: RecommendationRequest): Observable<RecommendationResponse> {
    return this.http.post<RecommendationResponse>(`${this.apiBase}/api/recommendations/save-profile`, data);
  }

  getAllSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.apiUrl).pipe(
      tap(subs => this.updateSignal(subs))
    );
  }

  getAllPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.apiUrl}/plans`);
  }

  getSubscriptionById(id: number): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/${id}`);
  }

  createAdminSubscription(payload: AdminCreateSubscriptionRequest): Observable<Subscription> {
    return this.http.post<Subscription>(this.apiUrl, payload).pipe(
      tap(() => this.refreshSignals())
    );
  }

  /**
   * Création d'un abonnement côté client (après paiement).
   * Utilise le DTO `SubscriptionCreateRequest` côté backend.
   */
  createClientSubscription(payload: {
    planId: number;
    userId: number;
    userEmail: string;
    userFullName?: string;
    durationMonths: number; // Durée choisie par le patient (1, 3, 6 ou 12 mois)
    autoRenew?: boolean;
    paymentMethod?: string;
    promoCode?: string;
  }): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.apiUrl}/client`, payload).pipe(
      tap(() => this.refreshSignals())
    );
  }

  updateSubscription(id: number, updates: Partial<Subscription>): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(() => this.refreshSignals())
    );
  }

  suspendSubscription(id: number): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.apiUrl}/${id}/suspend`, {}).pipe(
      tap(() => this.refreshSignals())
    );
  }

  resumeSubscription(id: number): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.apiUrl}/${id}/resume`, {}).pipe(
      tap(() => this.refreshSignals())
    );
  }

  updateAutoRenew(id: number, autoRenew: boolean): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.apiUrl}/${id}/auto-renew`, { autoRenew }).pipe(
      tap(() => this.refreshSignals())
    );
  }

  deleteSubscription(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshSignals())
    );
  }

  /**
   * Déclenche l'envoi d'un mail de rappel pour un abonnement spécifique.
   */
  triggerReminder(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/trigger-reminder`, {});
  }

  private refreshSignals() {
    this.http.get<Subscription[]>(this.apiUrl).subscribe(subs => {
      this.updateSignal(subs);
    });
  }

  private updateSignal(subs: Subscription[]) {
    this.activeSubscriptionsCount.set(subs.filter(s => s.status === 'ACTIVE').length);
  }
}
