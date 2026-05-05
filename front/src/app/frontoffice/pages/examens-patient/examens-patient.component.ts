import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

interface Examen {
  date: string;
  type: string;
  resultat: string;
  valeur: string;
  unite: string;
  statut: 'normal' | 'anormal';
}

@Component({
  selector: 'app-examens-patient',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule],
  templateUrl: './examens-patient.component.html',
  styleUrl: './examens-patient.component.scss'
})
export class ExamensPatientComponent {
  displayedColumns: string[] = ['date', 'type', 'valeur', 'unite', 'statut'];
  
  examens: Examen[] = [
    {
      date: '2026-02-10',
      type: 'Créatinine',
      resultat: 'Normal',
      valeur: '0.8',
      unite: 'mg/dL',
      statut: 'normal'
    },
    {
      date: '2026-02-10',
      type: 'Urée',
      resultat: 'Normal',
      valeur: '35',
      unite: 'mg/dL',
      statut: 'normal'
    },
    {
      date: '2026-01-15',
      type: 'Protéinurie',
      resultat: 'Élevée',
      valeur: '150',
      unite: 'mg/24h',
      statut: 'anormal'
    }
  ];
}
