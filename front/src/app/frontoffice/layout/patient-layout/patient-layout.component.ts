import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SubscriptionPermissionService } from '../../../core/services/subscription-permission.service';
import { AuthService } from '../../../core/services/auth.service';
import { SubscriptionPermission } from '../../../core/models/subscription-permission.model';
import { NotificationBellComponent } from '../../../shared/components/notification-bell/notification-bell.component';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatBadgeModule,
    NotificationBellComponent
  ],
  templateUrl: './patient-layout.component.html',
  styleUrls: ['./patient-layout.component.scss']
})
export class PatientLayoutComponent implements OnInit {

  readonly permissionService = inject(SubscriptionPermissionService);
  private authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);

  // Utilisation des Signals pour gérer l'état responsive
  isHandset = signal(false);
  collapsed = signal(false);
  hasActiveSubscription = signal(false);
  userName = signal('Patient');
  isAuthenticated = signal(false);

  private readonly buildMenuItem = (item: {
    label: string;
    icon: string;
    route: string;
    requiresSub: boolean;
    requiredPermission?: SubscriptionPermission;
  }) => item;

  // Menu de navigation pour le patient
  menuItems = [
    this.buildMenuItem({ label: 'Tableau de bord', icon: 'dashboard', route: '/patient/dashboard', requiresSub: false }),
    this.buildMenuItem({ label: 'Conseil Intelligent', icon: 'smart_toy', route: '/patient/recommandation', requiresSub: false }),
    this.buildMenuItem({ label: 'Mon Engagement', icon: 'trending_up', route: '/patient/engagement', requiresSub: false }),
    this.buildMenuItem({ label: 'Ajustement de plan', icon: 'tune', route: '/patient/adjustment', requiresSub: true }),
    this.buildMenuItem({ label: 'Mon abonnement', icon: 'card_membership', route: '/patient/mon-abonnement', requiresSub: false }),
  ];

  primaryMenuItems = [
    this.buildMenuItem({ label: 'Accueil', icon: 'home', route: '/patient/dashboard', requiresSub: false }),
    this.buildMenuItem({ label: 'Conseil IA', icon: 'smart_toy', route: '/patient/recommandation', requiresSub: false }),
    this.buildMenuItem({ label: 'Engagement', icon: 'trending_up', route: '/patient/engagement', requiresSub: false }),
    this.buildMenuItem({ label: 'Ajustement', icon: 'tune', route: '/patient/adjustment', requiresSub: true }),
    this.buildMenuItem({ label: 'Abonnement', icon: 'card_membership', route: '/patient/abonnement', requiresSub: false })
  ];

  ngOnInit() {
    // Vérifier l'abonnement au chargement et lors des mises à jour
    this.permissionService.subscription$.subscribe(sub => {
      this.hasActiveSubscription.set(this.permissionService.hasActiveSubscription());
    });

    // Charger initialement
    this.permissionService.loadUserSubscription().subscribe();

    // Récupérer le nom de l'utilisateur
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated.set(!!user);
      if (user) {
        this.userName.set(user.name || user.email);
      } else {
        this.userName.set('Invité');
      }
    });

    // Observer les changements de taille d'écran
    this.breakpointObserver.observe(Breakpoints.Handset)
      .subscribe(result => {
        this.isHandset.set(result.matches);
        if (result.matches) {
          this.collapsed.set(false);
        }
      });
  }

  toggleCollapse() {
    this.collapsed.update(v => !v);
  }

  logout() {
    this.authService.logout();
    this.permissionService.reset();
    window.location.href = '/login';
  }
}
