import { Injectable, inject } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { SubscriptionPermission, SUBSCRIPTION_PERMISSIONS } from '../models/subscription-permission.model';
import { SubscriptionService } from '../../backoffice/features/subscriptions/services/subscription.service';
import { AuthService } from './auth.service';
import { Subscription } from '../../backoffice/features/subscriptions/models/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPermissionService {
  private subscriptionService = inject(SubscriptionService);
  private authService = inject(AuthService);
  
  private currentSubscription: Subscription | null = null;
  private userPermissions: SubscriptionPermission[] = [];
  
  private subscriptionSubject = new BehaviorSubject<Subscription | null>(null);
  public subscription$ = this.subscriptionSubject.asObservable();

  constructor() {
    // Écouter les changements d'utilisateur pour réinitialiser les permissions
    this.authService.currentUser$.subscribe(user => {
      // Toujours réinitialiser lors d'un changement d'utilisateur (login ou logout)
      this.reset();
    });
  }

  /**
   * Charge l'abonnement actif de l'utilisateur connecté
   */
  loadUserSubscription(): Observable<Subscription | null> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.reset();
      return of(null);
    }

    // Réinitialiser avant de charger pour éviter les flashs d'anciennes données
    this.currentSubscription = null;
    this.userPermissions = [];

    // Vérifier que le service de subscription est disponible
    if (!this.subscriptionService) {
      console.warn('SubscriptionService non disponible');
      return of(null);
    }

    return this.subscriptionService.getAllSubscriptions().pipe(
      map(subscriptions => {
        const userId = Number(currentUser.id);
        const activeSubs = subscriptions
          .filter(sub => {
            const subUserId = typeof sub.userId === 'string' ? Number(sub.userId) : sub.userId;
            return subUserId === userId && sub.status === 'ACTIVE';
          })
          .sort((a, b) => {
            const aEnd = a.endDate ? new Date(a.endDate).getTime() : 0;
            const bEnd = b.endDate ? new Date(b.endDate).getTime() : 0;
            if (aEnd !== bEnd) return bEnd - aEnd;
            const aId = Number((a as any).id || 0);
            const bId = Number((b as any).id || 0);
            return bId - aId;
          });

        const userSub = activeSubs.length ? activeSubs[0] : null;
        
        if (userSub) {
          this.currentSubscription = userSub;
          this.updatePermissions(userSub);
        } else {
          this.currentSubscription = null;
          this.userPermissions = [];
        }
        
        this.subscriptionSubject.next(this.currentSubscription);
        return this.currentSubscription;
      }),

      catchError((error) => {
        // Ne pas afficher d'erreur si c'est juste qu'il n'y a pas d'abonnement
        // C'est normal pour un nouvel utilisateur
        if (error.status !== 404 && error.status !== 0) {
          console.error('Erreur lors du chargement de l\'abonnement:', error);
        }
        this.currentSubscription = null;
        this.userPermissions = [];
        this.subscriptionSubject.next(null);
        return of(null);
      })
    );
  }

  /**
   * Met à jour les permissions selon le plan d'abonnement
   */
  private updatePermissions(subscription: Subscription): void {
    const planName = this.getPlanName(subscription);
    this.userPermissions = SUBSCRIPTION_PERMISSIONS[planName] || [];
  }

  /**
   * Récupère le nom du plan depuis l'abonnement
   */
  private getPlanName(subscription: Subscription): string {
    const plan = subscription.plan;
    if (!plan || typeof plan !== 'object') {
      return '';
    }
    
    // Si le plan a une propriété 'name'
    if ('name' in plan && typeof plan.name === 'string') {
      const rawName = plan.name.trim();
      const lower = rawName.toLowerCase();

      // Normaliser les noms de plans pour correspondre aux clés de SUBSCRIPTION_PERMISSIONS
      if (['basique', 'basic', 'essential'].includes(lower)) {
        return 'Basique';
      }
      if (lower === 'premium') {
        return 'Premium';
      }
      if (['pro', 'professional', 'customized'].includes(lower)) {
        return 'Pro';
      }

      // Par défaut, renvoyer le nom brut
      return rawName;
    }
    
    return '';
  }

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   */
  hasPermission(permission: SubscriptionPermission): boolean {
    return this.userPermissions.includes(permission);
  }

  /**
   * Vérifie si l'utilisateur a au moins une des permissions spécifiées
   */
  hasAnyPermission(permissions: SubscriptionPermission[]): boolean {
    return permissions.some(perm => this.userPermissions.includes(perm));
  }

  /**
   * Vérifie si l'utilisateur a toutes les permissions spécifiées
   */
  hasAllPermissions(permissions: SubscriptionPermission[]): boolean {
    return permissions.every(perm => this.userPermissions.includes(perm));
  }

  /**
   * Obtient toutes les permissions de l'utilisateur
   */
  getPermissions(): SubscriptionPermission[] {
    return [...this.userPermissions];
  }

  /**
   * Obtient l'abonnement actuel de l'utilisateur
   */
  getCurrentSubscription(): Subscription | null {
    return this.currentSubscription;
  }

  /**
   * Vérifie si l'utilisateur a un abonnement actif
   */
  hasActiveSubscription(): boolean {
    return this.currentSubscription !== null && this.currentSubscription.status === 'ACTIVE';
  }

  /**
   * Obtient le nom du plan d'abonnement actuel
   */
  getCurrentPlanName(): string {
    if (!this.currentSubscription) {
      return '';
    }
    return this.getPlanName(this.currentSubscription);
  }

  /**
   * Vérifie si l'utilisateur a un plan spécifique
   */
  hasPlan(planName: string): boolean {
    return this.getCurrentPlanName() === planName;
  }

  /**
   * Réinitialise les permissions (utile lors de la déconnexion)
   */
  reset(): void {
    this.currentSubscription = null;
    this.userPermissions = [];
    this.subscriptionSubject.next(null);
  }
}
