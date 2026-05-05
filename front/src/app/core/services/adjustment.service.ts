import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../tokens/api-base.token';
import { AdjustmentProposalResponse, AdjustmentType } from '../models/adjustment-proposal.model';

@Injectable({
  providedIn: 'root'
})
export class AdjustmentService {
  private http = inject(HttpClient);
  private apiUrl: string;

  constructor(@Inject(API_BASE) apiBase: string) {
    this.apiUrl = `${apiBase}/api/adjustment`;
  }

  checkAdjustment(userId: number): Observable<AdjustmentProposalResponse> {
    return this.http.get<AdjustmentProposalResponse>(`${this.apiUrl}/check/${userId}`);
  }

  simulateAdjustment(userId: number, scenario: AdjustmentType): Observable<AdjustmentProposalResponse> {
    return this.http.get<AdjustmentProposalResponse>(`${this.apiUrl}/simulate/${userId}`, {
      params: { scenario }
    });
  }
}

