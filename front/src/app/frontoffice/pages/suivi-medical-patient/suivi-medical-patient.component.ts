import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SubscriptionPermissionService } from '../../../core/services/subscription-permission.service';
import { SubscriptionPermission } from '../../../core/models/subscription-permission.model';
import { UpsellBlockComponent } from '../../../shared/components/upsell-block/upsell-block.component';

@Component({
  selector: 'app-suivi-medical-patient',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, UpsellBlockComponent],
  templateUrl: './suivi-medical-patient.component.html',
  styleUrl: './suivi-medical-patient.component.scss'
})
export class SuiviMedicalPatientComponent {
  permissionService = inject(SubscriptionPermissionService);
  Permission = SubscriptionPermission;

  // Données de suivi (à remplacer par un appel API)
  suiviData = {
    derniereConsultation: '2026-02-15',
    prochaineConsultation: '2026-03-01',
    evolution: 'Stable',
    recommandations: 'Continuer le traitement prescrit et respecter le régime alimentaire'
  };
}
