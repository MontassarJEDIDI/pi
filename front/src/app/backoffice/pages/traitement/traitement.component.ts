import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-traitement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './traitement.component.html',
  styleUrl: './traitement.component.scss'
})
export class TraitementComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public imageService: ImageService
  ) {
    this.form = this.fb.group({
      prescriptionId: [''],
      nomMedicament: [''],
      dosage: [''],
      frequence: [''],
      dateDebut: [''],
      dateFin: [''],
      statut: ['']
    });
  }

  submit() {
    console.log(this.form.value);
  }
}

