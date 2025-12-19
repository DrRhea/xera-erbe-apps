import { PromotionDiscountType } from '../services/promotionService';

export const formatDiscount = (
  type: PromotionDiscountType,
  value: number | string
): { text: string; suffix?: string } => {
  const numValue = Number(value);

  if (type === 'percentage') {
    return {
      text: `${Math.round(numValue)}%`,
      suffix: 'off',
    };
  }

  // Fixed amount
  if (numValue >= 1000) {
    const inK = numValue / 1000;
    // Check if it's a whole number or close enough
    if (Math.abs(inK % 1) < 0.1) {
      return { text: `${Math.round(inK)}rb` };
    } else {
      // e.g. 1500 -> 1.5rb
      // Remove trailing zeros
      return { text: `${parseFloat(inK.toFixed(1))}rb` };
    }
  }

  return { text: `${numValue}` };
};
