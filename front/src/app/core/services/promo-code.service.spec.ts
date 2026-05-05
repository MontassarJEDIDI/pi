import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PromoCodeService } from './promo-code.service';

describe('PromoCodeService', () => {
  let service: PromoCodeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PromoCodeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call create', () => {
    service.create({ code: 'PEDIA2026', discountPercent: 30, maxUses: 100, expiryDate: '2026-12-31', active: true }).subscribe();

    const req = httpMock.expectOne('/api/promo/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.code).toBe('PEDIA2026');
    req.flush({ valid: true });
  });

  it('should call validate', () => {
    service.validate('PEDIA2026').subscribe();

    const req = httpMock.expectOne('/api/promo/validate/PEDIA2026');
    expect(req.request.method).toBe('GET');
    req.flush({ valid: true, discountPercent: 30 });
  });

  it('should call apply', () => {
    service.apply({ code: 'PEDIA2026', price: 239 }).subscribe();

    const req = httpMock.expectOne('/api/promo/apply');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.price).toBe(239);
    req.flush({ valid: true, discountedPrice: 167.3, savings: 71.7, originalPrice: 239, message: 'Code valide' });
  });

  it('should call getAll', () => {
    service.getAll().subscribe();

    const req = httpMock.expectOne('/api/promo/all');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should call deactivate', () => {
    service.deactivate(1).subscribe();

    const req = httpMock.expectOne('/api/promo/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});

