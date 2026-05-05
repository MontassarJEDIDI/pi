export interface PromoCodeResponse {
  id?: number;
  code?: string;
  discountPercent?: number;
  maxUses?: number;
  currentUses?: number;
  expiryDate?: string;
  active?: boolean;
  createdAt?: string;
  valid?: boolean;
  message?: string;
}

export interface PromoCodeRequest {
  code: string;
  discountPercent: number;
  maxUses: number;
  expiryDate: string;
  active?: boolean;
}

export interface ApplyPromoRequest {
  code: string;
  price: number;
}

export interface ApplyPromoResponse {
  valid: boolean;
  code: string;
  discountPercent?: number;
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  message: string;
}

