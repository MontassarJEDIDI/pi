export type NotificationType = 'INFO' | 'WARNING' | 'DANGER' | 'SUCCESS' | string;

export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  readStatus: boolean;
  createdAt: string;
}

