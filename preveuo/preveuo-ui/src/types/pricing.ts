/**
 * Pricing & Subscription Domain Types
 * Preveuo 2.0
 */

export type BillingCycle = 'monthly' | 'yearly';

export interface PricingFeature {
  name: string;
  included: boolean;
  tooltip?: string;
}

export interface PricingPlan {
  id: 'free' | 'pro' | 'growth' | 'enterprise';
  name: string;
  badge?: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  perSeat?: boolean;
  ctaText: string;
  ctaVariant: 'primary' | 'secondary' | 'outline';
  popular?: boolean;
  features: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}
