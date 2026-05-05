import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  // On peut ajouter ici la logique pour injecter un Token d'auth si besoin
  // const authService = inject(AuthService);
  // const token = authService.getToken();
  // if (token) {
  //   req = req.clone({
  //     setHeaders: { Authorization: `Bearer ${token}` }
  //   });
  // }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur inattendue est survenue';

      if (error.error instanceof ErrorEvent) {
        // Erreur côté client
        errorMessage = error.error.message;
      } else {
        // Erreur côté serveur (Backend)
        // On récupère le message structuré de notre GlobalExceptionHandler
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Erreur ${error.status}: ${error.statusText}`;
        }

        // Gestion spécifique des codes d'erreur
        if (error.status === 401) {
          router.navigate(['/login']);
          errorMessage = 'Session expirée, veuillez vous reconnecter';
        } else if (error.status === 403) {
          errorMessage = 'Vous n\'avez pas les permissions nécessaires';
        } else if (error.status === 409) {
          // Cas de l'abonnement déjà actif par exemple
          errorMessage = error.error.message || 'Conflit détecté';
        }
      }

      // Notification visuelle moderne au lieu de alert()
      snackBar.open(errorMessage, 'Fermer', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });

      return throwError(() => error);
    })
  );
};
