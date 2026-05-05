import { Routes } from '@angular/router';
import { MainLayoutComponent } from './backoffice/layout/main-layout/main-layout.component';
import { PatientLayoutComponent } from './frontoffice/layout/patient-layout/patient-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./frontoffice/pages/login/login-page.component').then(m => m.LoginPageComponent)
  },

  {
    path: 'patient',
    component: PatientLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./frontoffice/pages/dashboard-patient/dashboard-patient.component').then(m => m.DashboardPatientComponent)
      },

      {
        path: 'abonnement',
        loadComponent: () => import('./frontoffice/pages/abonnement-patient/abonnement-patient.component').then(m => m.AbonnementPatientComponent)
      },
      {
        path: 'mon-abonnement',
        loadComponent: () => import('./frontoffice/pages/my-subscription/my-subscription.component').then(m => m.MySubscriptionComponent)
      },
      {
        path: 'recommandation',
        loadComponent: () => import('./frontoffice/pages/subscription-recommendation/subscription-recommendation.component').then(m => m.SubscriptionRecommendationComponent)
      },
      {
        path: 'engagement',
        loadComponent: () => import('./frontoffice/pages/engagement-risk/engagement-risk.component').then(m => m.EngagementRiskComponent)
      },
      {
        path: 'adjustment',
        loadComponent: () => import('./frontoffice/pages/adjustment/adjustment.component').then(m => m.AdjustmentComponent)
      },
      {
        path: 'renewal',
        loadComponent: () => import('./frontoffice/pages/renewal/renewal.component').then(m => m.RenewalComponent)
      },
    ]
  },

  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'subscriptions', pathMatch: 'full' },
      {
        path: 'subscriptions',
        loadChildren: () => import('./backoffice/features/subscriptions/subscriptions.routes').then(m => m.SUBSCRIPTION_ROUTES),
        canActivate: [roleGuard(['ADMIN'])]
      },
      {
        path: 'promo',
        loadComponent: () => import('./backoffice/features/promo/pages/promo-admin/promo-admin.component').then(m => m.PromoAdminComponent),
        canActivate: [roleGuard(['ADMIN'])]
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
