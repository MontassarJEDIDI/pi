export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'SUSPENDED';

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  durationMonths: number;
  features: string[];
  description?: string;
  recommended?: boolean;
  colorTheme?: string;
}

export interface Subscription {
  id?: number;
  userId?: number;
  userFullName?: string;
  userEmail?: string;
  plan: SubscriptionPlan | { id: number };
  startDate?: string;
  endDate?: string;
  status?: SubscriptionStatus;
  suspendedAt?: string | null;
  autoRenew: boolean;
  paymentMethod?: string;
}
