import React from 'react';
import Link from 'next/link';
import { PricingPlan, BillingCycle } from '@/types/pricing';
import { Button, Badge } from '@/components/ui';

interface PricingCardProps {
  plan: PricingPlan;
  billingCycle: BillingCycle;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, billingCycle }) => {
  const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

  return (
    <div
      className={`
        rounded-3xl p-8 sm:p-9 flex flex-col justify-between transition-all duration-200 relative
        ${
          plan.popular
            ? 'bg-brand-purple text-white shadow-xl shadow-brand-purple/20 ring-2 ring-brand-purple -translate-y-2'
            : 'bg-white border border-border-default text-heading hover:border-border-input shadow-xs'
        }
      `}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-[12px] font-bold uppercase tracking-wider ${
              plan.popular ? 'text-white/80' : 'text-brand-purple'
            }`}
          >
            {plan.name}
          </span>
          {plan.badge && (
            <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white text-brand-purple shadow-xs">
              {plan.badge}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-[44px] sm:text-[50px] font-extrabold tracking-tight">
            ${price}
          </span>
          <span
            className={`text-[13.5px] font-medium ${
              plan.popular ? 'text-white/80' : 'text-muted'
            }`}
          >
            {plan.perSeat ? '/user /month' : '/month'}
          </span>
        </div>

        <p
          className={`text-[13.5px] leading-relaxed mb-8 ${
            plan.popular ? 'text-white/90' : 'text-body'
          }`}
        >
          {plan.description}
        </p>

        {/* CTA Button */}
        <div className="mb-8">
          <Link href={plan.id === 'enterprise' ? '/contact' : '/register'} className="w-full block">
            {plan.popular ? (
              <button
                type="button"
                className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-light text-brand-purple font-bold text-[14.5px] shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
              >
                {plan.ctaText}
              </button>
            ) : (
              <Button
                variant={plan.ctaVariant}
                size="lg"
                fullWidth
              >
                {plan.ctaText}
              </Button>
            )}
          </Link>
        </div>

        {/* Features divider */}
        <div
          className={`border-t pt-7 mb-4 ${
            plan.popular ? 'border-white/20' : 'border-border-light'
          }`}
        >
          <span
            className={`text-[11.5px] font-bold uppercase tracking-wider block mb-4 ${
              plan.popular ? 'text-white/80' : 'text-muted'
            }`}
          >
            Features included:
          </span>
          <ul className="space-y-3">
            {plan.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-[13.5px]">
                <svg
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    plan.popular ? 'text-white' : 'text-emerald-500'
                  }`}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M13.333 4L6 11.333 2.667 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className={plan.popular ? 'text-white/95' : 'text-gray-600'}>
                  {feat}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
