import { Component } from '@angular/core';
import { ImageService } from '../../../core/services/image.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medical-follow-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medical-follow-up.component.html',
  styleUrl: './medical-follow-up.component.scss'
})
export class MedicalFollowUpComponent {
  constructor(public imageService: ImageService) {}
}

