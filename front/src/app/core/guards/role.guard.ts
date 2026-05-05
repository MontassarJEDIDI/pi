import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    // Vérifier si l'utilisateur est authentifié
    if (!authService.isAuthenticated()) {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    
    // Vérifier si l'utilisateur a le rôle requis
    const userRole = authService.getCurrentUserRole();
    
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }
    
    // Redirection si accès refusé selon le rôle de l'utilisateur
    console.warn('Accès refusé: Rôle insuffisant');
    const currentRole = authService.getCurrentUserRole();
    
    if (currentRole === 'PATIENT') {
      return router.createUrlTree(['/patient/dashboard']);
    } else if (currentRole === 'ADMIN' || currentRole === 'DOCTOR') {
      return router.createUrlTree(['/admin/subscriptions']);
    }
    
    return router.createUrlTree(['/']);
  };
};
