import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-utilisateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './utilisateur.component.html',
  styleUrl: './utilisateur.component.scss'
})
export class UtilisateurComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public imageService: ImageService
  ) {
    this.form = this.fb.group({
      username: [''],
      password: [''],
      email: [''],
      actif: [true]
    });
  }

  submit() {
    console.log(this.form.value);
  }
}

