import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-hospitalisation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hospitalisation.component.html',
  styleUrl: './hospitalisation.component.scss'
})
export class HospitalisationComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public imageService: ImageService
  ) {
    this.form = this.fb.group({
      patientId: [''],
      dateEntree: [''],
      dateSortie: [''],
      motif: [''],
      statut: ['']
    });
  }

  submit() {
    console.log(this.form.value);
  }
}

