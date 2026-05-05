import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-alerte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alerte.component.html',
  styleUrl: './alerte.component.scss'
})
export class AlerteComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public imageService: ImageService
  ) {
    this.form = this.fb.group({
      patientId: [''],
      typeAlerte: [''],
      niveau: [''],
      message: [''],
      dateAlerte: [''],
      statut: ['']
    });
  }

  submit() {
    console.log(this.form.value);
  }
}

