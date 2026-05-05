import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

interface Prescription {
  id: number;
  date: string;
  medecin: string;
  medicaments: string[];
  duree: string;
  statut: 'active' | 'terminee';
}

@Component({
  selector: 'app-prescriptions-patient',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './prescriptions-patient.component.html',
  styleUrl: './prescriptions-patient.component.scss'
})
export class PrescriptionsPatientComponent {
  prescriptions: Prescription[] = [
    {
      id: 1,
      date: '2026-02-15',
      medecin: 'Dr. Martin',
      medicaments: ['Enalapril 5mg', 'Furosémide 20mg'],
      duree: '30 jours',
      statut: 'active'
    },
    {
      id: 2,
      date: '2026-01-10',
      medecin: 'Dr. Martin',
      medicaments: ['Calcium 500mg'],
      duree: '60 jours',
      statut: 'terminee'
    }
  ];
}
