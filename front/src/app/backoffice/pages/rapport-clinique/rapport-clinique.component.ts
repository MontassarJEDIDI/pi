import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-rapport-clinique',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rapport-clinique.component.html',
  styleUrl: './rapport-clinique.component.scss'
})
export class RapportCliniqueComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public imageService: ImageService
  ) {
    this.form = this.fb.group({
      patientId: [''],
      periode: [''],
      resume: [''],
      dateGeneration: ['']
    });
  }

  submit() {
    console.log(this.form.value);
  }
}

