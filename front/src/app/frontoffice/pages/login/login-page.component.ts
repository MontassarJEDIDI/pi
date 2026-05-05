import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  loginForm: FormGroup;
  selectedUserType: 'admin' | 'patient' | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  selectUserType(type: 'admin' | 'patient'): void {
    this.selectedUserType = type;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid || !this.selectedUserType) {
      this.errorMessage = 'Veuillez remplir tous les champs et sélectionner un type d\'utilisateur';
      return;
    }

    const { email, password } = this.loginForm.value;

    // Appel au service d'authentification
    this.authService.login(email, password, this.selectedUserType).subscribe({
      next: (success) => {
        if (success) {
          const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'];
          if (this.selectedUserType === 'admin') {
            this.router.navigateByUrl(returnUrl || '/admin/subscriptions');
          } else {
            this.router.navigateByUrl(returnUrl || '/patient/dashboard');
          }
        } else {
          this.errorMessage = 'Identifiants incorrects';
        }
      },
      error: () => {
        this.errorMessage = 'Une erreur est survenue lors de la connexion';
      }
    });
  }

  goBack(): void {
    this.selectedUserType = null;
    this.loginForm.reset();
    this.errorMessage = '';
  }
}
