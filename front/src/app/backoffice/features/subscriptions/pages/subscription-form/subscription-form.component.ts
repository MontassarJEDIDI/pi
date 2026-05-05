import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { SubscriptionService } from '../../services/subscription.service';
import { SubscriptionPlan } from '../../models/subscription.model';

const PAYMENT_METHOD_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'carte', label: 'Carte' },
  { value: 'virement', label: 'Virement' }
];

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.scss']
})
export class SubscriptionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private subscriptionService = inject(SubscriptionService);

  form!: FormGroup;
  plans: SubscriptionPlan[] = [];
  paymentMethodOptions = PAYMENT_METHOD_OPTIONS;
  loading = false;
  errorMessage = '';
  plansLoading = true;
  plansError = '';
  /** true après une tentative de soumission (pour afficher toutes les erreurs) */
  formSubmitted = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: [null as number | null, [Validators.required, Validators.min(1)]],
      planId: [null as number | null, Validators.required],
      startDate: [null, Validators.required],
      paymentMethod: ['', Validators.required]
    });

    this.subscriptionService.getAllPlans().subscribe({
      next: plans => {
        this.plans = plans ?? [];
        this.plansLoading = false;
        this.plansError = '';
      },
      error: () => {
        this.plansLoading = false;
        this.plansError = 'Impossible de charger les plans. Vérifiez que le backend est démarré (port 8081 ou 8080).';
      }
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    this.loading = true;

    const v = this.form.value;
    const payload = {
      userId: Number(v.userId),
      planId: Number(v.planId),
      startDate: this.toIsoDate(v.startDate),
      paymentMethod: v.paymentMethod
    };

    this.subscriptionService.createAdminSubscription(payload).subscribe({
      next: () => this.router.navigate(['/admin/subscriptions']),
      error: err => {
        this.loading = false;
        this.errorMessage = err?.error?.message || err?.message || 'Erreur lors de la création.';
      },
      complete: () => (this.loading = false)
    });
  }

  private toIsoDate(d: Date): string {
    return new Date(d).toISOString().split('T')[0];
  }

  /** Retourne le message d'erreur à afficher pour un champ (contrôle de saisie professionnel) */
  getFieldError(controlName: string): string {
    const c = this.form.get(controlName);
    if (!c?.errors) return '';
    if (!c.touched && !this.formSubmitted) return '';
    const e = c.errors;
    if (e['required']) return 'Champ obligatoire.';
    if (e['min']) return `La valeur minimale est ${e['min'].min}.`;
    if (e['maxlength']) return `Maximum ${e['maxlength'].requiredLength} caractères.`;
    return '';
  }

  /** Indique si un champ a une erreur à afficher */
  hasFieldError(controlName: string): boolean {
    return this.getFieldError(controlName).length > 0;
  }
}
