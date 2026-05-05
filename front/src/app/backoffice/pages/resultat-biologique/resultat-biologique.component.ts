import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-resultat-biologique',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resultat-biologique.component.html',
  styleUrl: './resultat-biologique.component.scss'
})
export class ResultatBiologiqueComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public imageService: ImageService
  ) {
    this.form = this.fb.group({
      examenId: [''],
      valeurCalculee: [''],
      interpretation: ['']
    });
  }

  submit() {
    console.log(this.form.value);
  }
}

