import api from './api';

export type PromotionDiscountType = 'fixed' | 'percentage';

export type PromotionPackageLink = {
  id: string;
  promotionId: string;
  packageId: string;
};

export type Promotion = {
  id: string;
  code: string;
  title: string;
  description?: string;
  badgeText?: string;
  discountType: PromotionDiscountType;
  discountValue: string; // Decimal string from backend
  maxDiscountAmount?: string;
  minOrderAmount: string;
  currency: string;
  maxRedemptions?: number;
  maxRedemptionsPerUser?: number;
  startsAt: string;
  endsAt?: string;
  packageLinks?: PromotionPackageLink[];
};

export const promotionService = {
  async getPromotions(activeOnly: boolean = true): Promise<Promotion[]> {
    const response = await api.get<Promotion[]>('/content/promotions', {
      params: { active: activeOnly },
    });
    return response.data;
  },

  calculateDiscount(price: number, promotion: Promotion): number {
    const discountValue = parseFloat(promotion.discountValue);
    const minOrder = parseFloat(promotion.minOrderAmount);

    if (price < minOrder) {
      return 0;
    }

    let discountAmount = 0;

    if (promotion.discountType === 'fixed') {
      discountAmount = discountValue;
    } else {
      // Percentage
      discountAmount = price * (discountValue / 100);
    }

    // Apply max discount cap if exists
    if (promotion.maxDiscountAmount) {
      const maxDiscount = parseFloat(promotion.maxDiscountAmount);
      if (discountAmount > maxDiscount) {
        discountAmount = maxDiscount;
      }
    }

    // Ensure we don't discount more than the price
    return Math.min(discountAmount, price);
  },
};
