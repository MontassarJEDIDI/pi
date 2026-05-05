import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

interface Consultation {
  id: number;
  date: string;
  medecin: string;
  motif: string;
  diagnostic: string;
  statut: 'terminee' | 'planifiee';
}

@Component({
  selector: 'app-consultations-patient',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './consultations-patient.component.html',
  styleUrl: './consultations-patient.component.scss'
})
export class ConsultationsPatientComponent {
  // Données de consultation (à remplacer par un appel API)
  consultations: Consultation[] = [
    {
      id: 1,
      date: '2026-02-15',
      medecin: 'Dr. Martin',
      motif: 'Suivi rénal',
      diagnostic: 'État stable, poursuivre le traitement',
      statut: 'terminee'
    },
    {
      id: 2,
      date: '2026-03-01',
      medecin: 'Dr. Martin',
      motif: 'Contrôle biologique',
      diagnostic: '',
      statut: 'planifiee'
    }
  ];
}
