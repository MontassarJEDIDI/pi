import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PromoCodeService } from '../../../../../core/services/promo-code.service';
import { PromoCodeResponse } from '../../../../../core/models/promo-code.model';

@Component({
  selector: 'app-promo-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule
  ],
  templateUrl: './promo-admin.component.html',
  styleUrls: ['./promo-admin.component.scss']
})
export class PromoAdminComponent {
  private fb = inject(FormBuilder);
  private promoService = inject(PromoCodeService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['code', 'discount', 'uses', 'expiry', 'status', 'actions'];
  dataSource = new MatTableDataSource<PromoCodeResponse>([]);
  loading = false;

  form = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(50)]],
    discountPercent: [30, [Validators.required, Validators.min(0), Validators.max(100)]],
    maxUses: [100, [Validators.required, Validators.min(1)]],
    expiryDate: ['', [Validators.required]]
  });

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

  constructor() {
    this.dataSource.sortingDataAccessor = (row: PromoCodeResponse, col: string): string | number => {
      if (col === 'code') return String(row.code || '').toLowerCase();
      if (col === 'discount') return Number(row.discountPercent || 0);
      if (col === 'uses') return Number(row.currentUses || 0);
      if (col === 'expiry') return row.expiryDate ? new Date(row.expiryDate).getTime() : 0;
      if (col === 'status') return row.active ? 1 : 0;
      return '';
    };
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.promoService.getAll().subscribe({
      next: (items: PromoCodeResponse[]) => {
        this.dataSource.data = items || [];
        if (this._paginator) this.dataSource.paginator = this._paginator;
        if (this._sort) this.dataSource.sort = this._sort;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Impossible de charger les codes promo.', 'Fermer', { duration: 3000 });
      }
    });
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    this.promoService.create({
      code: String(v.code || ''),
      discountPercent: Number(v.discountPercent || 0),
      maxUses: Number(v.maxUses || 1),
      expiryDate: String(v.expiryDate || ''),
      active: true
    }).subscribe({
      next: () => {
        this.snackBar.open('Code promo créé.', 'OK', { duration: 2500 });
        this.form.patchValue({ code: '' });
        this.loadAll();
      },
      error: (err: any) => {
        this.snackBar.open(err?.error?.message || 'Création impossible.', 'Fermer', { duration: 3500 });
      }
    });
  }

  deactivate(row: PromoCodeResponse): void {
    if (!row?.id) return;
    this.promoService.deactivate(Number(row.id)).subscribe({
      next: () => {
        this.snackBar.open('Code désactivé.', 'OK', { duration: 2500 });
        this.loadAll();
      },
      error: () => {
        this.snackBar.open('Désactivation impossible.', 'Fermer', { duration: 3000 });
      }
    });
  }

  statusLabel(row: PromoCodeResponse): string {
    if (!row.active) return 'Désactivé';
    if (row.expiryDate && new Date(row.expiryDate).getTime() < new Date().setHours(0, 0, 0, 0)) return 'Expiré';
    if ((row.currentUses || 0) >= (row.maxUses || 0)) return 'Quota atteint';
    return 'Actif';
  }
}
