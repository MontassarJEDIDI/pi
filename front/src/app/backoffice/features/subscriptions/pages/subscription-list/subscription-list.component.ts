import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SubscriptionService } from '../../services/subscription.service';
import { Subscription, SubscriptionPlan } from '../../models/subscription.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-subscription-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatCardModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent implements OnInit {
  // Colonnes visibles dans le tableau admin
  // (Nom utilisateur, Type d'abonnement, Date d'expiration, Statut)
  displayedColumns: string[] = ['userFullName', 'plan', 'endDate', 'status', 'actions'];
  dataSource: MatTableDataSource<Subscription>;

  // Statistiques calculées
  totalCount: number = 0;
  activeCount: number = 0;
  expiringSoonCount: number = 0;
  inactiveCount: number = 0;
  activeRevenue: number = 0;
  loading = false;
  errorMessage = '';

  private _paginator: MatPaginator | null = null;
  private _sort: MatSort | null = null;

  @ViewChild(MatPaginator)
  set paginator(p: MatPaginator) {
    this._paginator = p;
    this.dataSource.paginator = p;
  }

  @ViewChild(MatSort)
  set sort(s: MatSort) {
    this._sort = s;
    this.dataSource.sort = s;
  }

  constructor(public subscriptionService: SubscriptionService) {
    this.dataSource = new MatTableDataSource();

    this.dataSource.filterPredicate = (data, filter) => {
      const normalizedFilter = filter.trim().toLowerCase();
      const status = this.getStatusLabel(data.status);
      const planName = this.getPlanName(data);
      const payment = data.paymentMethod || '';

      const haystack = [
        data.userFullName,
        data.userEmail,
        planName,
        status,
        payment
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedFilter);
    };

    this.dataSource.sortingDataAccessor = (row: Subscription, columnId: string): string | number => {
      if (columnId === 'userFullName') return (row.userFullName || '').toLowerCase();
      if (columnId === 'plan') return this.getPlanName(row).toLowerCase();
      if (columnId === 'endDate') return row.endDate ? new Date(row.endDate).getTime() : 0;
      if (columnId === 'status') return this.getStatusLabel(row.status).toLowerCase();
      const v = (row as any)?.[columnId];
      return typeof v === 'string' ? v.toLowerCase() : (v ?? '');
    };
  }

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.loading = true;
    this.errorMessage = '';

    this.subscriptionService.getAllSubscriptions().subscribe({
      next: (data) => {
        this.totalCount = data.length;
        this.activeCount = data.filter(sub => sub.status === 'ACTIVE').length;
        this.inactiveCount = data.filter(sub => sub.status && sub.status !== 'ACTIVE').length;
        this.activeRevenue = data
          .filter(sub => sub.status === 'ACTIVE')
          .reduce((total, sub) => total + this.getPlanPrice(sub), 0);
        
        // Expire dans moins de 30 jours
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        this.expiringSoonCount = data.filter(sub => 
          sub.status === 'ACTIVE' && sub.endDate && new Date(sub.endDate) <= thirtyDaysFromNow
        ).length;

        this.dataSource.data = data;
        if (this._paginator) {
          this.dataSource.paginator = this._paginator;
        }
        if (this._sort) {
          this.dataSource.sort = this._sort;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des abonnements:', err);
        this.errorMessage = 'Impossible de charger les abonnements. Vérifiez que le microservice fonctionne correctement.';
        this.dataSource.data = [];
        this.loading = false;
      }
    });
  }

  viewDetails(row: Subscription) {
    // Logique pour voir les détails si nécessaire
    console.log('Détails de l\'abonnement:', row);
  }

  isExpiringSoon(row: Subscription): boolean {
    if (!row.endDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return new Date(row.endDate) <= thirtyDaysFromNow;
  }



  deleteSubscription(id?: number) {
    if (!id) return;
    if(confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
      this.subscriptionService.deleteSubscription(id).subscribe(() => {
        this.loadSubscriptions();
      });
    }
  }

  suspendSubscription(id?: number) {
    if (!id) return;
    this.subscriptionService.suspendSubscription(id).subscribe({
      next: () => this.loadSubscriptions(),
      error: () => {
        this.errorMessage = 'Impossible de suspendre cet abonnement.';
      }
    });
  }

  resumeSubscription(id?: number) {
    if (!id) return;
    this.subscriptionService.resumeSubscription(id).subscribe({
      next: () => this.loadSubscriptions(),
      error: () => {
        this.errorMessage = 'Impossible de reprendre cet abonnement.';
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPlanName(row: Subscription): string {
    const p = row.plan;
    if (!p || !('name' in p)) {
      return '—';
    }

    const name = (p as SubscriptionPlan).name;
    // Normaliser les noms de plans en français pour l'admin
    // Les plans sont maintenant : Basique, Premium, Pro
    switch (name.toLowerCase()) {
      case 'basique':
      case 'basic':
      case 'essential':
        return 'Basique';
      case 'premium':
        return 'Premium';
      case 'pro':
      case 'professional':
      case 'customized':
        return 'Pro';
      default:
        return name;
    }
  }

  getPlanPrice(row: Subscription): number {
    const plan = row.plan;
    return plan && 'price' in plan ? Number((plan as SubscriptionPlan).price) || 0 : 0;
  }

  getStatusLabel(status?: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'Actif';
      case 'EXPIRED':
        return 'Expiré';
      case 'CANCELLED':
        return 'Annulé';
      case 'SUSPENDED':
        return 'Suspendu';
      default:
        return 'Inconnu';
    }
  }

  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'EXPIRED':
        return 'neutral';
      case 'CANCELLED':
        return 'danger';
      case 'SUSPENDED':
        return 'warning';
      default:
        return 'info';
    }
  }
}
