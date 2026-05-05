import { Component, computed, signal } from '@angular/core';
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

@Component({
  selector: 'app-main-layout',
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
    MatBadgeModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  
  // Utilisation des Signals pour gérer l'état responsive
  isHandset = signal(false);
  collapsed = signal(false);

  // Menu de navigation configurable
  menuItems = [
    { label: 'Abonnements', icon: 'card_membership', route: '/admin/subscriptions' },
    { label: 'Codes promo', icon: 'sell', route: '/admin/promo' },
  ];

  constructor(private breakpointObserver: BreakpointObserver) {
    // Observer les changements de taille d'écran
    this.breakpointObserver.observe(Breakpoints.Handset)
      .subscribe(result => {
        this.isHandset.set(result.matches);
        if (result.matches) {
          this.collapsed.set(false); // Toujours ouvert en mobile quand on clique sur le menu (drawer mode)
        }
      });
  }

  toggleSidenav() {
    this.collapsed.update(v => !v);
  }
}
