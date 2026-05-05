import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call getAll', () => {
    service.getAll(90).subscribe();
    const req = httpMock.expectOne('/api/notifications/90');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should call getUnreadCount', () => {
    service.getUnreadCount(90).subscribe();
    const req = httpMock.expectOne('/api/notifications/90/unread-count');
    expect(req.request.method).toBe('GET');
    req.flush(2);
  });

  it('should call markAsRead', () => {
    service.markAsRead(10).subscribe();
    const req = httpMock.expectOne('/api/notifications/10/read');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should call markAllAsRead', () => {
    service.markAllAsRead(90).subscribe();
    const req = httpMock.expectOne('/api/notifications/90/read-all');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});

