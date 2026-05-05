import { Routes } from '@angular/router';
import { SubscriptionListComponent } from './pages/subscription-list/subscription-list.component';

export const SUBSCRIPTION_ROUTES: Routes = [
  {
    path: '',
    component: SubscriptionListComponent
  },
  {
    path: 'plans',
    loadComponent: () => import('./pages/subscription-plans/subscription-plans.component').then(m => m.SubscriptionPlansComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/subscription-form/subscription-form.component').then(m => m.SubscriptionFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/subscription-detail/subscription-detail.component').then(m => m.SubscriptionDetailComponent)
  }
];
