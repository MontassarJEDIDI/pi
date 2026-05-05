import { Component } from '@angular/core';
import { ImageService } from '../../../core/services/image.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-analysis.component.html',
  styleUrl: './exam-analysis.component.scss'
})
export class ExamAnalysisComponent {
  constructor(public imageService: ImageService) {}
}

