import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-upsell-block',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './upsell-block.component.html',
    styleUrls: ['./upsell-block.component.scss']
})
export class UpsellBlockComponent {
    @Input() title: string = 'Fonctionnalité Premium';
    @Input() description: string = 'Mettez à niveau votre abonnement pour débloquer cet avantage exclusif.';
    @Input() requiredPlan: string = 'Premium';
    @Input() requiredPrefix: string = 'Requis :';
    @Input() requiredPlanPrefix: string = 'Abonnement';
    @Input() ctaLabel: string = 'Mettre à niveau';

    private router = inject(Router);

    goToUpgrade() {
        this.router.navigate(['/patient/abonnement']);
    }
}
