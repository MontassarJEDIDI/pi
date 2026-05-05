import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-greffe-renale',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './greffe-renale.component.html',
  styleUrl: './greffe-renale.component.scss'
})
export class GreffeRenaleComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public imageService: ImageService
  ) {
    this.form = this.fb.group({
      patientId: [''],
      dateGreffe: [''],
      typeGreffe: [''],
      donneur: [''],
      statut: ['']
    });
  }

  submit() {
    console.log(this.form.value);
  }
}

