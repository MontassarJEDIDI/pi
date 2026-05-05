import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-examen-biologique',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './examen-biologique.component.html',
  styleUrl: './examen-biologique.component.scss'
})
export class ExamenBiologiqueComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public imageService: ImageService
  ) {
    this.form = this.fb.group({
      patientId: [''],
      typeExamen: [''],
      valeur: [''],
      unite: [''],
      dateExamen: ['']
    });
  }

  submit() {
    console.log(this.form.value);
  }
}

