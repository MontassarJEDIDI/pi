import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfirmRenewalRequest, RenewalProposalResponse } from '../models/renewal-proposal.model';
import { Subscription } from '../../backoffice/features/subscriptions/models/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class RenewalService {
  private http = inject(HttpClient);

  getProposal(subscriptionId: number): Observable<RenewalProposalResponse> {
    return this.http.get<RenewalProposalResponse>(`/api/subscriptions/${subscriptionId}/renewal-proposal`);
  }

  confirm(subscriptionId: number, body: ConfirmRenewalRequest): Observable<Subscription> {
    return this.http.post<Subscription>(`/api/subscriptions/${subscriptionId}/confirm-renewal`, body);
  }
}

