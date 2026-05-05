import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly STORAGE_KEY = 'pedia_nephro_user';
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Restaurer l'utilisateur depuis le localStorage au démarrage
    const savedUser = this.getStorageItem(this.STORAGE_KEY);
    if (savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch (e) {
        console.error('Erreur lors de la restauration de l\'utilisateur', e);
      }
    }
  }

  /**
   * Connexion de l'utilisateur
   * @param email Email de l'utilisateur
   * @param password Mot de passe
   * @param userType Type d'utilisateur ('admin' pour ADMIN/DOCTOR, 'patient' pour PATIENT)
   * @returns Observable<boolean> true si connexion réussie
   */
  login(email: string, password: string, userType: 'admin' | 'patient'): Observable<boolean> {
    // TODO: Remplacer par un appel API réel
    // Pour l'instant, simulation avec des identifiants de test
    
    // Simulation d'un délai réseau
    return of(this.simulateLogin(email, password, userType)).pipe(
      delay(500),
      tap(success => {
        if (success) {
          const [localPart, domain] = email.split('@');

          let role: User['role'];
          let id = '1';

          if (userType === 'admin') {
            role = email.includes('admin') ? 'ADMIN' : 'DOCTOR';
          } else {
            role = 'PATIENT';

            // Pour les patients, on dérive un id numérique
            const numericFromName = localPart?.match(/\d+$/)?.[0];
            if (numericFromName) {
              id = numericFromName;
            } else {
              // Si pas de chiffre, on génère un ID basé sur le hash du nom pour éviter les collisions
              // (Simulation d'un ID unique par utilisateur)
              id = Math.abs(email.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)).toString();
            }
          }

          const user: User = {
            id,
            email,
            role,
            name: localPart || email
          };

          this.setCurrentUser(user);
        }
      })
    );
  }

  /**
   * Simulation de connexion (à remplacer par un appel API réel)
   */
  private simulateLogin(email: string, password: string, userType: 'admin' | 'patient'): boolean {
    // Identifiants de test pour la démo
    if (userType === 'admin') {
      // Admin: admin@pedianephro.com / admin123
      // Doctor: doctor@pedianephro.com / doctor123
      return (email === 'admin@pedianephro.com' && password === 'admin123') ||
             (email === 'doctor@pedianephro.com' && password === 'doctor123') ||
             (email.includes('admin') || email.includes('doctor'));
    } else {
      // Patients: E-mail = nomutilisateur@pedianephro.com
      //           Mot de passe = nomutilisateur123
      const match = email.match(/^([a-zA-Z0-9._-]+)@pedianephro\.com$/);
      if (!match) {
        return false;
      }

      const username = match[1];
      const expectedPassword = `${username}123`;
      return password === expectedPassword;
    }
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    this.removeStorageItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
    // Note: La réinitialisation des permissions sera gérée par le composant qui utilise le service
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Obtient le rôle de l'utilisateur actuel
   */
  getCurrentUserRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  /**
   * Obtient l'utilisateur actuel
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  /**
   * Vérifie si l'utilisateur a l'un des rôles spécifiés
   */
  hasAnyRole(roles: string[]): boolean {
    const currentRole = this.currentUserSubject.value?.role;
    return currentRole ? roles.includes(currentRole) : false;
  }

  /**
   * Définit l'utilisateur actuel et le sauvegarde
   */
  private setCurrentUser(user: User): void {
    this.setStorageItem(this.STORAGE_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getStorageItem(key: string): string | null {
    if (!this.isBrowser) {
      return null;
    }

    return localStorage.getItem(key);
  }

  private setStorageItem(key: string, value: string): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(key, value);
  }

  private removeStorageItem(key: string): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.removeItem(key);
  }
}
