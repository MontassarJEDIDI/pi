import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_BASE } from '../tokens/api-base.token';
import { RiskService } from './risk.service';

describe('RiskService', () => {
  let service: RiskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: API_BASE, useValue: '' }]
    });
    service = TestBed.inject(RiskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call getRiskScore', () => {
    service.getRiskScore(1).subscribe();
    const req = httpMock.expectOne('/api/risk/score/1');
    expect(req.request.method).toBe('GET');
    req.flush({ userId: 1, score: 10, riskLevel: 'FAIBLE', actionRecommandee: '', calculatedAt: '', scoreHistory: [] });
  });

  it('should call getRiskHistory', () => {
    service.getRiskHistory(1).subscribe();
    const req = httpMock.expectOne('/api/risk/history/1');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should call updateBehavior', () => {
    service.updateBehavior({ userId: 1, joursSansConnexion: 1, bilansEnRetard: 0, rappelsIgnores: 0, rendezVousAnnules: 0, medicamentsNonConfirmes: 0 }).subscribe();
    const req = httpMock.expectOne('/api/risk/behavior');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call getHighRiskPatients', () => {
    service.getHighRiskPatients().subscribe();
    const req = httpMock.expectOne('/api/risk/high-risk-patients');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should call simulateBehavior', () => {
    service.simulateBehavior(1).subscribe();
    const req = httpMock.expectOne('/api/risk/simulate/1');
    expect(req.request.method).toBe('POST');
    req.flush({ userId: 1, score: 90, riskLevel: 'ÉLEVÉ', actionRecommandee: '', calculatedAt: '', scoreHistory: [] });
  });
});

