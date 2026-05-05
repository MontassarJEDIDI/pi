import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SubscriptionPermissionService } from '../../../core/services/subscription-permission.service';
import { SubscriptionPermission } from '../../../core/models/subscription-permission.model';
import { UpsellBlockComponent } from '../../../shared/components/upsell-block/upsell-block.component';

@Component({
  selector: 'app-forums-patient',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, UpsellBlockComponent],
  templateUrl: './forums-patient.component.html',
  styleUrl: './forums-patient.component.scss'
})
export class ForumsPatientComponent {
  permissionService = inject(SubscriptionPermissionService);

  // Expose l'enum pour le template HTML
  Permission = SubscriptionPermission;
}
