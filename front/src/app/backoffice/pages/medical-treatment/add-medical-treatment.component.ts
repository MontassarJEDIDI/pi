import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-add-medical-treatment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-medical-treatment.component.html',
  styleUrl: './add-medical-treatment.component.scss'
})
export class AddMedicalTreatmentComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public imageService: ImageService
  ) {
    this.form = this.fb.group({
      patientName: [''],
      doctorName: [''],
      medication: [''],
      treatment: [''],
      prescription: ['']
    });
  }

  submit() {
    console.log(this.form.value);
  }
}

