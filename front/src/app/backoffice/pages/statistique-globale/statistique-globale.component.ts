import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-statistique-globale',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './statistique-globale.component.html',
  styleUrl: './statistique-globale.component.scss'
})
export class StatistiqueGlobaleComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public imageService: ImageService
  ) {
    this.form = this.fb.group({
      nom: [''],
      valeur: [''],
      dateCalcul: ['']
    });
  }

  submit() {
    console.log(this.form.value);
  }
}

