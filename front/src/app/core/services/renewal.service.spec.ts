import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RenewalService } from './renewal.service';

describe('RenewalService', () => {
  let service: RenewalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(RenewalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call getProposal', () => {
    service.getProposal(2).subscribe();
    const req = httpMock.expectOne('/api/subscriptions/2/renewal-proposal');
    expect(req.request.method).toBe('GET');
    req.flush({ subscriptionId: 2, userId: 1, currentEndDate: '2026-04-15', autoRenew: true, proposal: {} });
  });

  it('should call confirm', () => {
    service.confirm(2, { acceptSuggestion: true }).subscribe();
    const req = httpMock.expectOne('/api/subscriptions/2/confirm-renewal');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.acceptSuggestion).toBe(true);
    req.flush({ id: 99 });
  });
});
