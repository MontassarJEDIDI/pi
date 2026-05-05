import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SubscriptionService } from '../../services/subscription.service';
import { SubscriptionPlan } from '../../models/subscription.model';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss']
})
export class SubscriptionPlansComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  
  plans: SubscriptionPlan[] = [];

  ngOnInit() {
    this.subscriptionService.getAllPlans().subscribe(plans => {
      this.plans = plans;
    });
  }

  subscribe(plan: SubscriptionPlan) {
    // Logic to subscribe
    console.log('Subscribing to:', plan);
    // Here we would typically open a dialog or redirect to payment
  }
}
