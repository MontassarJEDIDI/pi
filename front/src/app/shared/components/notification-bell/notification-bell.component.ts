import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationItem } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [
    CommonModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss']
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  unreadCount = signal(0);
  loading = signal(false);
  notifications = signal<NotificationItem[]>([]);

  private poller?: any;
  private sub = new Subscription();

  lastFive = computed(() => this.notifications().slice(0, 5));

  ngOnInit(): void {
    this.refreshUnreadCount();
    this.poller = setInterval(() => this.refreshUnreadCount(), 15000);
  }

  ngOnDestroy(): void {
    if (this.poller) {
      clearInterval(this.poller);
    }
    this.sub.unsubscribe();
  }

  openMenu(): void {
    this.loadLatest();
  }

  loadLatest(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.loading.set(true);
    const userId = Number(user.id);
    this.sub.add(
      this.notificationService.getAll(userId).subscribe({
        next: (items) => {
          this.notifications.set(items || []);
          this.loading.set(false);
          this.refreshUnreadCount();
        },
        error: () => {
          this.loading.set(false);
        }
      })
    );
  }

  markAllAsRead(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    const userId = Number(user.id);
    this.sub.add(
      this.notificationService.markAllAsRead(userId).subscribe({
        next: () => {
          const updated = this.notifications().map(n => ({ ...n, readStatus: true }));
          this.notifications.set(updated);
          this.unreadCount.set(0);
        },
        error: () => {}
      })
    );
  }

  markAsRead(item: NotificationItem): void {
    if (!item || item.readStatus) return;
    this.sub.add(
      this.notificationService.markAsRead(item.id).subscribe({
        next: () => {
          const updated = this.notifications().map(n => n.id === item.id ? { ...n, readStatus: true } : n);
          this.notifications.set(updated);
          this.refreshUnreadCount();
        },
        error: () => {}
      })
    );
  }

  badgeHidden(): boolean {
    return this.unreadCount() <= 0;
  }

  tone(type: string | null | undefined): 'info' | 'warning' | 'danger' | 'success' {
    const t = String(type || '').toUpperCase();
    if (t === 'DANGER') return 'danger';
    if (t === 'WARNING') return 'warning';
    if (t === 'SUCCESS') return 'success';
    return 'info';
  }

  formatCreatedAt(value: string | null | undefined): string {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';

    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `${diffMin} min`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} h`;

    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}`;
  }

  private refreshUnreadCount(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    const userId = Number(user.id);
    this.sub.add(
      this.notificationService.getUnreadCount(userId).subscribe({
        next: (count) => {
          const v = Number(count || 0);
          this.unreadCount.set(Number.isFinite(v) ? v : 0);
        },
        error: () => {}
      })
    );
  }
}
