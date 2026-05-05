import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionPermissionService } from '../services/subscription-permission.service';
import { SubscriptionPermission } from '../models/subscription-permission.model';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

/**
 * Directive structurelle pour afficher/masquer des éléments selon les permissions d'abonnement
 * 
 * Usage:
 * <div *hasPermission="SubscriptionPermission.CONSULTATIONS_UNLIMITED">
 *   Contenu visible uniquement avec la permission
 * </div>
 * 
 * <div *hasAnyPermission="[SubscriptionPermission.FORUMS_ACCESS, SubscriptionPermission.WEBINARS_ACCESS]">
 *   Contenu visible avec au moins une des permissions
 * </div>
 */
@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private permissionService = inject(SubscriptionPermissionService);
  private authService = inject(AuthService);
  
  private subscription?: Subscription;
  private requiredPermissions: SubscriptionPermission[] = [];
  private requireAll = false;

  @Input() set hasPermission(permission: SubscriptionPermission | SubscriptionPermission[]) {
    this.requiredPermissions = Array.isArray(permission) ? permission : [permission];
    this.updateView();
  }

  @Input() set hasAnyPermission(permissions: SubscriptionPermission[]) {
    this.requiredPermissions = permissions;
    this.requireAll = false;
    this.updateView();
  }

  @Input() set hasAllPermissions(permissions: SubscriptionPermission[]) {
    this.requiredPermissions = permissions;
    this.requireAll = true;
    this.updateView();
  }

  ngOnInit(): void {
    // Ne charger l'abonnement que si l'utilisateur est connecté
    // Cela évite les erreurs sur la page de login
    if (this.authService.isAuthenticated() && this.requiredPermissions.length > 0) {
      // Charger l'abonnement seulement si nécessaire
      this.permissionService.loadUserSubscription().subscribe({
        next: () => this.updateView(),
        error: () => {
          // Ignorer les erreurs silencieusement
          this.updateView();
        }
      });
    } else {
      // Mettre à jour la vue avec l'état actuel (masquer si pas connecté)
      this.updateView();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateView(): void {
    if (this.requiredPermissions.length === 0) {
      this.viewContainer.clear();
      return;
    }

    let hasAccess = false;

    if (this.requireAll) {
      hasAccess = this.permissionService.hasAllPermissions(this.requiredPermissions);
    } else {
      hasAccess = this.permissionService.hasAnyPermission(this.requiredPermissions);
    }

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
