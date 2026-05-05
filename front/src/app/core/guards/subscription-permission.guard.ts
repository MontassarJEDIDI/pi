import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SubscriptionPermissionService } from '../services/subscription-permission.service';
import { SubscriptionPermission } from '../models/subscription-permission.model';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * Guard pour vérifier les permissions d'abonnement
 * Utilisation: canActivate: [subscriptionPermissionGuard([SubscriptionPermission.CONSULTATIONS_UNLIMITED])]
 */
export const subscriptionPermissionGuard = (
  requiredPermissions: SubscriptionPermission[]
): CanActivateFn => {
  return (route, state) => {
    const permissionService = inject(SubscriptionPermissionService);
    const router = inject(Router);

    return permissionService.loadUserSubscription().pipe(
      map(() => {
        if (!permissionService.hasActiveSubscription()) {
          return router.createUrlTree(['/patient/abonnement'], {
            queryParams: { returnUrl: state.url, reason: 'no_subscription' }
          });
        }

        const hasPermission = permissionService.hasAnyPermission(requiredPermissions);
        if (!hasPermission) {
          const planName = permissionService.getCurrentPlanName();
          return router.createUrlTree(['/patient/dashboard'], {
            queryParams: { 
              returnUrl: state.url, 
              reason: 'insufficient_permissions',
              plan: planName
            }
          });
        }

        return true;
      }),
      catchError(() => of(router.createUrlTree(['/patient/abonnement'])))
    );
  };
};

export const activeSubscriptionGuard: CanActivateFn = (route, state) => {
  const permissionService = inject(SubscriptionPermissionService);
  const router = inject(Router);

  return permissionService.loadUserSubscription().pipe(
    map(() => {
      if (!permissionService.hasActiveSubscription()) {
        return router.createUrlTree(['/patient/abonnement'], {
          queryParams: { returnUrl: state.url, reason: 'no_subscription' }
        });
      }
      return true;
    }),
    catchError(() => of(router.createUrlTree(['/patient/abonnement'])))
  );
};

/**
 * Guard intelligent pour la route /patient :
 * - Si l'utilisateur n'a PAS d'abonnement actif  -> redirige vers /patient/abonnement
 * - Si l'utilisateur a un abonnement actif      -> redirige vers /patient/dashboard
 *
 * Pour les autres routes enfants (/patient/xxx), il laisse passer sans redirection.
 */
export const patientDefaultRedirectGuard: CanActivateFn = (route, state) => {
  const permissionService = inject(SubscriptionPermissionService);
  const router = inject(Router);

  // Ne déclencher la logique que lorsqu'on vise exactement /patient (sans enfant)
  if (state.url === '/patient' || state.url === '/patient/') {
    return permissionService.loadUserSubscription().pipe(
      map(() => {
        if (permissionService.hasActiveSubscription()) {
          return router.createUrlTree(['/patient/dashboard']);
        }
        return router.createUrlTree(['/patient/abonnement']);
      }),
      catchError(() => of(router.createUrlTree(['/patient/abonnement'])))
    );
  }

  // Pour toutes les autres routes (/patient/xxx), ne rien faire de spécial
  return true;
};
