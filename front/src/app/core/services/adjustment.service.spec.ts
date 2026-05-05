import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_BASE } from '../tokens/api-base.token';
import { AdjustmentService } from './adjustment.service';

describe('AdjustmentService', () => {
  let service: AdjustmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: API_BASE, useValue: '' }]
    });
    service = TestBed.inject(AdjustmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call checkAdjustment', () => {
    service.checkAdjustment(1).subscribe();
    const req = httpMock.expectOne('/api/adjustment/check/1');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call simulateAdjustment with scenario param', () => {
    service.simulateAdjustment(1, 'OPTIMAL').subscribe();
    const req = httpMock.expectOne(r => r.url === '/api/adjustment/simulate/1' && r.params.get('scenario') === 'OPTIMAL');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});

