import { PatientService } from './patient.service';

describe('PatientService', () => {
  it('should be created', () => {
    const service = new PatientService();
    expect(service).toBeTruthy();
  });
});

