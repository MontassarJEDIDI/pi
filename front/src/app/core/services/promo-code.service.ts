import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplyPromoRequest, ApplyPromoResponse, PromoCodeRequest, PromoCodeResponse } from '../models/promo-code.model';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeService {
  private http = inject(HttpClient);

  create(body: PromoCodeRequest): Observable<PromoCodeResponse> {
    return this.http.post<PromoCodeResponse>('/api/promo/create', body);
  }

  validate(code: string): Observable<PromoCodeResponse> {
    const encoded = encodeURIComponent(code || '');
    return this.http.get<PromoCodeResponse>(`/api/promo/validate/${encoded}`);
  }

  apply(body: ApplyPromoRequest): Observable<ApplyPromoResponse> {
    return this.http.post<ApplyPromoResponse>('/api/promo/apply', body);
  }

  getAll(): Observable<PromoCodeResponse[]> {
    return this.http.get<PromoCodeResponse[]>('/api/promo/all');
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`/api/promo/${id}`);
  }
}

