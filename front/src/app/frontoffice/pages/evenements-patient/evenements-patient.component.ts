import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SubscriptionPermissionService } from '../../../core/services/subscription-permission.service';
import { SubscriptionPermission } from '../../../core/models/subscription-permission.model';
import { UpsellBlockComponent } from '../../../shared/components/upsell-block/upsell-block.component';

@Component({
    selector: 'app-evenements-patient',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, UpsellBlockComponent],
    templateUrl: './evenements-patient.component.html',
    styleUrl: './evenements-patient.component.scss'
})
export class EvenementsPatientComponent {
    permissionService = inject(SubscriptionPermissionService);
    Permission = SubscriptionPermission;

    // Données factices pour l'affichage
    upcomingEvents = [
        {
            title: 'Conférence : La santé rénale chez l\'enfant',
            date: '15 Avril 2026',
            time: '14:00 - 15:30',
            type: 'Webinaire',
            speaker: 'Dr. Martin Dupont',
            description: 'Découvrez les meilleures pratiques pour préserver la santé rénale de vos enfants au quotidien.'
        },
        {
            title: 'Atelier nutrition : Cuissons pauvres en sel',
            date: '22 Avril 2026',
            time: '10:00 - 12:00',
            type: 'Atelier Pratique',
            speaker: 'Sophie Leroy (Diététicienne)',
            description: 'Atelier interactif pour apprendre à cuisiner sainement sans sacrifier le goût.'
        }
    ];
}
