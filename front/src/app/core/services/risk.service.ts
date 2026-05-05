import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../tokens/api-base.token';

export interface RiskScoreHistoryDto {
  score: number;
  riskLevel: string;
  calculatedAt: string;
}

export interface RiskScoreResponse {
  userId: number;
  score: number;
  riskLevel: string;
  actionRecommandee: string;
  calculatedAt: string;
  scoreHistory: RiskScoreHistoryDto[];
}

export interface HighRiskPatientDto {
  userId: number;
  userEmail: string;
  userFullName: string;
  score: number;
  riskLevel: string;
  actionRecommandee: string;
}

export interface UserBehaviorRequest {
  userId: number;
  joursSansConnexion: number;
  bilansEnRetard: number;
  rappelsIgnores: number;
  rendezVousAnnules: number;
  medicamentsNonConfirmes: number;
}

@Injectable({
  providedIn: 'root'
})
export class RiskService {
  private http = inject(HttpClient);
  private apiUrl: string;

  constructor(@Inject(API_BASE) apiBase: string) {
    this.apiUrl = `${apiBase}/api/risk`;
  }

  /**
   * Calcule et retourne le score de risque actuel pour un utilisateur
   */
  getRiskScore(userId: number): Observable<RiskScoreResponse> {
    return this.http.get<RiskScoreResponse>(`${this.apiUrl}/score/${userId}`);
  }

  /**
   * Retourne les 30 derniers points d'historique de risque
   */
  getRiskHistory(userId: number): Observable<RiskScoreHistoryDto[]> {
    return this.http.get<RiskScoreHistoryDto[]>(`${this.apiUrl}/history/${userId}`);
  }

  /**
   * Met à jour manuellement le comportement utilisateur
   */
  updateBehavior(request: UserBehaviorRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/behavior`, request);
  }

  /**
   * Liste des patients présentant un risque ÉLEVÉ
   */
  getHighRiskPatients(): Observable<HighRiskPatientDto[]> {
    return this.http.get<HighRiskPatientDto[]>(`${this.apiUrl}/high-risk-patients`);
  }

  /**
   * Simule un comportement réaliste et retourne le nouveau score (Démo)
   */
  simulateBehavior(userId: number): Observable<RiskScoreResponse> {
    return this.http.post<RiskScoreResponse>(`${this.apiUrl}/simulate/${userId}`, {});
  }
}
