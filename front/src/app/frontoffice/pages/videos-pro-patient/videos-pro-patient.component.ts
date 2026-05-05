import { Component, OnInit, inject, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SafeUrlPipe } from '../../../core/pipes/safe-url.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { SubscriptionPermissionService } from '../../../core/services/subscription-permission.service';
import { SubscriptionPermission } from '../../../core/models/subscription-permission.model';
import { UpsellBlockComponent } from '../../../shared/components/upsell-block/upsell-block.component';

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  description: string;
  module: string;
  thumbnail: string;
  videoUrl: string;
}

@Component({
  selector: 'app-videos-pro-patient',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SafeUrlPipe,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatChipsModule,
    UpsellBlockComponent
  ],
  templateUrl: './videos-pro-patient.component.html',
  styleUrl: './videos-pro-patient.component.scss'
})
export class VideosProPatientComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  permissionService = inject(SubscriptionPermissionService);
  Permission = SubscriptionPermission;
  private authSub?: Subscription;
  private readonly isBrowser: boolean;

  progressValue: number = 0;
  currentLevel: string = 'Débutant';
  seenIds: Set<string> = new Set();

  videos: VideoItem[] = [
    {
      id: 'm1-v1',
      module: 'Pédagogie Enfant',
      title: 'Lili La Vessie et le cerveau',
      duration: '4:47',
      description: 'Comment le cerveau et la vessie communiquent.',
      thumbnail: 'https://img.youtube.com/vi/tGZxX518e5g/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/tGZxX518e5g'
    },
    {
      id: 'm1-v2',
      module: 'Pédagogie Enfant',
      title: 'Le voyage de l\'eau dans mon corps',
      duration: '3:15',
      description: 'Le chemin de l\'eau, des reins jusqu\'à la vessie.',
      thumbnail: 'https://img.youtube.com/vi/1epIxN2xxGI/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/1epIxN2xxGI'
    },
    {
      id: 'm2-v1',
      module: 'Guide Parents',
      title: 'Alimentation et Reins',
      duration: '5:42',
      description: 'Conseils diététiques pour protéger la fonction rénale.',
      thumbnail: 'https://img.youtube.com/vi/juJRTGrr8jg/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/juJRTGrr8jg'
    },
    {
      id: 'm2-v2',
      module: 'Guide Parents',
      title: 'Donner un médicament liquide',
      duration: '2:15',
      description: 'Astuces pour administrer les traitements liquides.',
      thumbnail: 'https://img.youtube.com/vi/7j9Pyhg8PTg/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/7j9Pyhg8PTg'
    },
    {
      id: 'm3-v1',
      module: 'Les Examens',
      title: 'Tout sur l\'échographie rénale',
      duration: '3:10',
      description: 'Démonstration du déroulement d\'une échographie.',
      thumbnail: 'https://img.youtube.com/vi/kqw4JrMuBM8/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/kqw4JrMuBM8'
    }
  ];

  private get storageKey(): string {
    const user = this.authService.getCurrentUser();
    const id = user ? user.email : 'guest';
    return `progression_${id.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  ngOnInit(): void {
    this.initSeen();
    this.authSub = this.authService.currentUser$.subscribe(() => {
      this.initSeen();
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  private initSeen(): void {
    const key = this.storageKey;
    const stored = this.isBrowser ? localStorage.getItem(key) : null;

    if (stored) {
      try {
        const ids = JSON.parse(stored);
        this.seenIds = new Set<string>(Array.isArray(ids) ? ids : []);
      } catch {
        this.seenIds = new Set<string>();
      }
    } else {
      this.seenIds = new Set<string>();
    }
    this.updateProgression();
  }

  private updateProgression(): void {
    const total = this.videos.length;
    if (total === 0) {
      this.progressValue = 0;
      this.currentLevel = 'Débutant';
      return;
    }

    this.progressValue = Math.round((this.seenIds.size / total) * 100);

    const seen = this.seenIds.size;
    if (seen === 0) this.currentLevel = 'Débutant';
    else if (seen < 3) this.currentLevel = 'Apprenti';
    else if (seen < 5) this.currentLevel = 'Expert';
    else this.currentLevel = 'Maître';
  }

  isSeen(video: VideoItem): boolean {
    return this.seenIds.has(video.id);
  }

  selectedModule: string = 'Tous les modules';

  get filteredVideos(): VideoItem[] {
    if (this.selectedModule === 'Tous les modules') {
      return this.videos;
    }
    return this.videos.filter(v => v.module === this.selectedModule);
  }

  selectModule(module: string): void {
    this.selectedModule = module;
  }

  selectedVideo: VideoItem | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  openVideo(video: VideoItem): void {
    this.selectedVideo = video;
  }

  completeVideo(): void {
    if (this.selectedVideo) {
      this.markAsSeen(this.selectedVideo);
      this.closeVideo();
    }
  }

  closeVideo(): void {
    this.selectedVideo = null;
  }

  private markAsSeen(video: VideoItem): void {
    if (!this.seenIds.has(video.id)) {
      const nextSet = new Set(this.seenIds);
      nextSet.add(video.id);
      this.seenIds = nextSet;

      if (this.isBrowser) {
        localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.seenIds)));
      }
      this.updateProgression();
    }
  }
}


