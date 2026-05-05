import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-dossier-medical',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './dossier-medical.component.html',
  styleUrl: './dossier-medical.component.scss'
})
export class DossierMedicalComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public imageService: ImageService
  ) {
    this.form = this.fb.group({
      patientId: [''],
      antecedents: [''],
      allergies: [''],
      pathologiesChroniques: ['']
    });
  }

  submit() {
    console.log(this.form.value);
  }
}

