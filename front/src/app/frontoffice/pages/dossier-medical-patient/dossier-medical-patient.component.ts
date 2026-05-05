import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dossier-medical-patient',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dossier-medical-patient.component.html',
  styleUrl: './dossier-medical-patient.component.scss'
})
export class DossierMedicalPatientComponent {
  // Données du patient (à remplacer par un appel API)
  patientData = {
    nom: 'Dupont',
    prenom: 'Jean',
    dateNaissance: '2010-05-15',
    antecedents: 'Aucun antécédent notable',
    allergies: 'Aucune allergie connue',
    pathologiesChroniques: 'Insuffisance rénale chronique',
    groupeSanguin: 'O+',
    poids: '35 kg',
    taille: '145 cm'
  };
}
