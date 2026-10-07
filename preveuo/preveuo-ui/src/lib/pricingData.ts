import { PricingPlan, FaqItem } from '@/types/pricing';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for testing and personal side projects.',
    priceMonthly: 0,
    priceYearly: 0,
    ctaText: 'Start free',
    ctaVariant: 'secondary',
    features: [
      'Up to 3 interactive demos',
      'Standard screen capture',
      'Public sharing links',
      'Preveuo watermark included',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams creating regular product stories.',
    priceMonthly: 36,
    priceYearly: 29,
    popular: true,
    badge: 'MOST POPULAR',
    ctaText: 'Start 14-day trial',
    ctaVariant: 'primary',
    features: [
      'Unlimited interactive demos',
      'Remove Preveuo branding',
      'Custom domains & branding',
      'Lead-capture gate forms',
      'Full viewer analytics',
      'Export to MP4 & GIF',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Advanced governance, security, and dedicated support.',
    priceMonthly: 99,
    priceYearly: 79,
    perSeat: true,
    ctaText: 'Talk to sales',
    ctaVariant: 'secondary',
    features: [
      'Everything in Pro, plus:',
      'SSO & SAML authentication',
      'HubSpot & Salesforce sync',
      'Role-based permissions (RBAC)',
      'Dedicated Customer Success Manager',
      'Custom MSA & SLA support',
    ],
  },
];

export const PRICING_FAQS: FaqItem[] = [
  {
    q: 'Can I try Preveuo before paying?',
    a: 'Yes. The Free plan lets you build and publish up to three demos. Paid plans include a 14-day trial with no credit card required.',
  },
  {
    q: 'What counts as a monthly view?',
    a: 'A monthly view is counted each time a unique viewer starts or interacts with an interactive demo walkthrough.',
  },
  {
    q: 'Can I change plans at any time?',
    a: 'Yes. You can upgrade, downgrade, or cancel your subscription at any time from your workspace settings with prorated billing.',
  },
  {
    q: 'Do you offer discounts for startups?',
    a: 'Yes. We offer special discounted pricing for early-stage startups and non-profit organizations. Reach out to our team to learn more.',
  },
  {
    q: 'Is my product data secure?',
    a: 'Yes. Preveuo is SOC 2 Type II compliant and offers enterprise-grade encryption both in transit and at rest.',
  },
];
