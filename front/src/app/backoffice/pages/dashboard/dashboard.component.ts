import { Component } from '@angular/core';
import { ImageService } from '../../../core/services/image.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

type ImageKey = 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n';

interface DashboardCard {
  title: string;
  route: string;
  image: ImageKey;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(public imageService: ImageService) {}

  // Configuration des cartes avec leurs routes et images
  cards: DashboardCard[] = [
    { title: 'Patient', route: '/admin/patient', image: 'a2', description: 'Gestion des patients' },
    { title: 'Dossier Médical', route: '/admin/dossier-medical', image: 'a3', description: 'Dossiers médicaux' },
    { title: 'Consultations', route: '/admin/consultations', image: 'a4', description: 'Gestion des consultations' },
    { title: 'Forums', route: '/admin/forums', image: 'a5', description: 'Espace de discussion' },
    { title: 'Abonnements', route: '/admin/subscriptions', image: 'c', description: 'Gestion des abonnements' },
    { title: 'Utilisateur', route: '/admin/utilisateur', image: 'k', description: 'Gestion des utilisateurs' }
  ];
}

