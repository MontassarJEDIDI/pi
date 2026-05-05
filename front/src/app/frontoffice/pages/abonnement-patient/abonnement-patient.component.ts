import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SubscriptionService } from '../../../backoffice/features/subscriptions/services/subscription.service';
import { AuthService, User } from '../../../core/services/auth.service';
import { SubscriptionPermissionService } from '../../../core/services/subscription-permission.service';
import { PromoCodeService } from '../../../core/services/promo-code.service';

export interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  tagline: string;
  highlights: string[];
  monthlyPrice: number;
  color: string;
  icon: string;
  recommended?: boolean;
}

export type DurationType = 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel';

export interface DurationOption {
  type: DurationType;
  months: number;
  discount: number; // Pourcentage de réduction
}

@Component({
  selector: 'app-abonnement-patient',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatRadioModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './abonnement-patient.component.html',
  styleUrl: './abonnement-patient.component.scss'
})
export class AbonnementPatientComponent implements OnInit {
  // Plans d'abonnement
  plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basique',
      displayName: 'Essentiel',
      tagline: 'Accès de base + aperçu des modules cliniques',
      highlights: [
        'Conseil intelligent (résultat simple)',
        'Engagement : score global',
        'Dossier médical / consultations : aperçu (teaser)',
        'Forum & événements : lecture'
      ],
      monthlyPrice: 102.0,
      color: '#4CAF50',
      icon: 'check_circle'
    },
    {
      id: 'premium',
      name: 'Premium',
      displayName: 'Suivi+',
      tagline: 'Suivi complet + comparaisons et historique',
      highlights: [
        'Dossier médical & consultations : accès complet',
        'Conseil intelligent : justification + ranking',
        'Engagement : historique + conseils',
        'Forum : publication + événements interactifs'
      ],
      monthlyPrice: 239.0,
      color: '#2196F3',
      icon: 'star',
      recommended: true
    },
    {
      id: 'pro',
      name: 'Pro',
      displayName: 'Optimisation IA',
      tagline: 'Ajustement dynamique + simulations',
      highlights: [
        'Pilier 3 : ajustement dynamique + simulateur',
        'IA renforcée : recommandations proactives',
        'Engagement : plan d’actions (priorisation)',
        'Accès complet + expérience premium'
      ],
      monthlyPrice: 435.0,
      color: '#FF9800',
      icon: 'diamond'
    }
  ];

  // Options de durée
  durations: DurationOption[] = [
    { type: 'mensuel', months: 1, discount: 0 },
    { type: 'trimestriel', months: 3, discount: 5 },
    { type: 'semestriel', months: 6, discount: 10 },
    { type: 'annuel', months: 12, discount: 20 }
  ];

  selectedPlan: SubscriptionPlan | null = null;
  selectedDuration: DurationOption | null = null;
  currentStep: number = 0;
  isProcessing: boolean = false;
  cardType: string = 'unknown';
  isFlipped: boolean = false;

  // Formulaire de paiement
  paymentForm: FormGroup;

  // Mapping simple entre les IDs de plans UI et les IDs backend
  // Basique=1, Premium=2, Pro=3
  private readonly planIdMapping: Record<string, number> = {
    basic: 1,    // Basique
    premium: 2,  // Premium
    pro: 3       // Pro
  };

  private permissionService = inject(SubscriptionPermissionService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);

  isRenewal = false;
  currentEndDate: string | null = null;

  promoStatus: 'idle' | 'checking' | 'valid' | 'invalid' = 'idle';
  promoPercent = 0;
  promoCode = '';
  promoMessage = '';
  private promoTimer?: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private promoService: PromoCodeService
  ) {
    // Vérifier si c'est un renouvellement
    this.permissionService.loadUserSubscription().subscribe(sub => {
      if (sub && sub.status === 'ACTIVE' && sub.endDate) {
        this.isRenewal = true;
        this.currentEndDate = sub.endDate;
      }
    });

    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(19), Validators.maxLength(19)]],
      cardHolder: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZÀ-ÿ ]*$')]],
      expiryMonth: ['', [Validators.required]],
      expiryYear: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      promoCode: ['']
    });
  }

  ngOnInit(): void {
    // Écouter les paramètres de requête pour une pré-sélection
    this.route.queryParams.subscribe(params => {
      const planId = params['plan'];
      if (planId) {
        const plan = this.plans.find(p => p.id === planId);
        if (plan) {
          this.selectPlan(plan);
        }
      }
    });
  }

  // Navigation
  goBack(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  selectPlan(plan: SubscriptionPlan): void {
    this.selectedPlan = plan;
    this.currentStep = 1;
  }

  selectDuration(duration: DurationOption): void {
    this.selectedDuration = duration;
    this.currentStep = 2;
  }

  // Calculs
  private calculateBasePrice(): number {
    if (!this.selectedPlan || !this.selectedDuration) return 0;
    const basePrice = this.selectedPlan.monthlyPrice * this.selectedDuration.months;
    const discount = basePrice * (this.selectedDuration.discount / 100);
    return basePrice - discount;
  }

  calculatePrice(): number {
    const base = this.calculateBasePrice();
    if (this.promoStatus === 'valid' && this.promoPercent > 0) {
      return base - (base * (this.promoPercent / 100));
    }
    return base;
  }

  getFormattedPrice(): string {
    return this.calculatePrice().toFixed(3) + ' DT';
  }

  getBasePrice(): number {
    return this.calculateBasePrice();
  }

  getMonthlyEquivalent(): string {
    if (!this.selectedPlan || !this.selectedDuration) return '';
    const total = this.calculatePrice();
    const monthly = total / this.selectedDuration.months;
    return monthly.toFixed(3) + ' DT/mois';
  }

  getPromoSavings(): number {
    const base = this.calculateBasePrice();
    if (this.promoStatus !== 'valid' || this.promoPercent <= 0) return 0;
    return base * (this.promoPercent / 100);
  }

  onPromoCodeInput(value: string): void {
    const code = String(value || '').trim().toUpperCase();
    this.promoCode = code;

    if (this.promoTimer) {
      clearTimeout(this.promoTimer);
    }

    if (!code) {
      this.promoStatus = 'idle';
      this.promoPercent = 0;
      this.promoMessage = '';
      return;
    }

    this.promoStatus = 'checking';
    this.promoMessage = 'Vérification...';

    this.promoTimer = setTimeout(() => {
      this.promoService.validate(code).subscribe({
        next: (res) => {
          const valid = Boolean(res?.valid);
          if (valid) {
            this.promoStatus = 'valid';
            this.promoPercent = Number(res.discountPercent || 0);
            this.promoMessage = `Code valide ! Réduction de ${this.promoPercent}%`;
          } else {
            this.promoStatus = 'invalid';
            this.promoPercent = 0;
            this.promoMessage = res?.message || 'Code promo invalide';
          }
        },
        error: () => {
          this.promoStatus = 'invalid';
          this.promoPercent = 0;
          this.promoMessage = 'Impossible de valider le code pour le moment.';
        }
      });
    }, 450);
  }

  // Formatage et détection de carte
  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    this.detectCardType(value);
    
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    
    // Mettre à jour le champ sans bloquer l'événement pour que la vue se rafraîchisse
    this.paymentForm.get('cardNumber')?.setValue(formattedValue);
  }

  // Getters pour l'affichage de la carte (Plus robuste pour Angular)
  get displayCardNumber(): string {
    return this.paymentForm.get('cardNumber')?.value || '•••• •••• •••• ••••';
  }

  get displayCardHolder(): string {
    const val = this.paymentForm.get('cardHolder')?.value;
    return val ? val.toUpperCase() : 'NOM DU TITULAIRE';
  }

  get displayExpiry(): string {
    const month = this.paymentForm.get('expiryMonth')?.value || 'MM';
    const year = this.paymentForm.get('expiryYear')?.value;
    const shortYear = year ? year.toString().slice(-2) : 'AA';
    return `${month}/${shortYear}`;
  }

  get displayCvv(): string {
    return this.paymentForm.get('cvv')?.value || '•••';
  }

  detectCardType(number: string): void {
    if (number.startsWith('4')) {
      this.cardType = 'visa';
    } else if (number.match(/^5[1-5]/)) {
      this.cardType = 'mastercard';
    } else if (number.startsWith('34') || number.startsWith('37')) {
      this.cardType = 'amex';
    } else {
      this.cardType = 'unknown';
    }
  }

  getCardTypeIcon(): string {
    const icons: { [key: string]: string } = {
      'visa': 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/visa.png',
      'mastercard': 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/mastercard.png',
      'amex': 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/amex.png'
    };
    return icons[this.cardType] || '';
  }

  // Helpers pour le formulaire
  getMonths(): number[] {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }

  getYears(): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear + i);
  }

  // Prévisualisation de la carte
  getCardNumberSegments(): string[] {
    const value = (this.paymentForm.get('cardNumber')?.value || '').replace(/\s/g, '');
    const segments = [];
    for (let i = 0; i < 4; i++) {
      segments.push(value.substr(i * 4, 4));
    }
    return segments;
  }

  getCardHolderPreview(): string {
    return (this.paymentForm.get('cardHolder')?.value || 'NOM DU TITULAIRE').toUpperCase();
  }

  getExpiryMonthPreview(): string {
    const month = this.paymentForm.get('expiryMonth')?.value;
    return month ? month.toString().padStart(2, '0') : 'MM';
  }

  getExpiryYearPreview(): string {
    const year = this.paymentForm.get('expiryYear')?.value;
    return year ? year.toString().substr(-2) : 'YY';
  }

  getCvvPreview(): string {
    const cvv = this.paymentForm.get('cvv')?.value || '';
    return '•'.repeat(cvv.length) || '•••';
  }

  // Gestion des focus/blur
  onCardNumberFocus() {
    this.isFlipped = false;
  }
  onCardHolderFocus() {
    this.isFlipped = false;
  }
  onExpiryChange() {
    this.isFlipped = false;
  }
  onCvvFocus() {
    this.isFlipped = true;
  }
  onCvvBlur() {
    this.isFlipped = false;
  }

  // UI Helpers
  getPlanGradient(color: string): string {
    const gradients: { [key: string]: string } = {
      '#4CAF50': 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
      '#2196F3': 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
      '#FF9800': 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)'
    };
    return gradients[color] || color;
  }

  getPlanIconBg(color: string): string {
    return `${color}1A`; // 10% opacity
  }

  // Soumission
  onSubmitPayment(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    if (!this.selectedPlan || !this.selectedDuration) {
      alert('Veuillez sélectionner un plan et une durée.');
      return;
    }

    const currentUser: User | null = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'PATIENT') {
      alert('Vous devez être connecté en tant que patient pour souscrire un abonnement.');
      return;
    }

    this.isProcessing = true;

    // Simulation d'un délai de traitement
    setTimeout(() => {
      const backendPlanId = this.planIdMapping[this.selectedPlan!.id];
      const payload = {
        planId: backendPlanId,
        userId: Number(currentUser.id),
        userEmail: currentUser.email,
        userFullName: this.paymentForm.get('cardHolder')?.value,
        durationMonths: this.selectedDuration!.months,
        autoRenew: true,
        paymentMethod: 'CARD',
        promoCode: this.promoStatus === 'valid' && this.promoCode ? this.promoCode : undefined
      };

      this.subscriptionService.createClientSubscription(payload).subscribe({
        next: () => {
          // Recharger l'abonnement pour mettre à jour le layout et les permissions
          this.permissionService.loadUserSubscription().subscribe(() => {
            this.isProcessing = false;
            this.snackBar.open('Paiement réussi ! Un mail de confirmation a été envoyé à jedidimontassar90@gmail.com', 'OK', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/patient/dashboard']);
          });
        },
        error: (error) => {
          this.isProcessing = false;
          // L'intercepteur gère déjà l'affichage du message d'erreur via SnackBar
          console.error('Erreur lors de la souscription:', error);
        }
      });
    }, 2000);
  }
}
