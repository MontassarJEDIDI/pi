import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-indicateur-clinique',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './indicateur-clinique.component.html',
  styleUrl: './indicateur-clinique.component.scss'
})
export class IndicateurCliniqueComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public imageService: ImageService
  ) {
    this.form = this.fb.group({
      patientId: [''],
      typeIndicateur: [''],
      valeur: [''],
      periode: [''],
      dateCalcul: ['']
    });
  }

  submit() {
    console.log(this.form.value);
  }
}

