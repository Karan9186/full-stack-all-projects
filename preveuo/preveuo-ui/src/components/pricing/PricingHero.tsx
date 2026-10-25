import React from 'react';
import { BillingCycle } from '@/types/pricing';

interface PricingHeroProps {
  billingCycle: BillingCycle;
  onBillingChange: (cycle: BillingCycle) => void;
}

export const PricingHero: React.FC<PricingHeroProps> = ({
  billingCycle,
  onBillingChange,
}) => {
  return (
    <section className="pt-16 pb-12 px-6 text-center">
      <div className="max-w-[850px] mx-auto">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand-purple mb-4">
          SIMPLE, SCALABLE PRICING
        </p>
        <h1 className="text-[44px] sm:text-[58px] font-extrabold tracking-[-0.035em] text-heading leading-[1.08] mb-5">
          Start free. Grow when<br />
          your stories do.
        </h1>
        <p className="text-[15px] sm:text-[17px] text-body leading-relaxed max-w-[620px] mx-auto mb-10">
          No hidden fees, no confusing add-ons. Every plan includes everything you need to create a product experience worth sharing.
        </p>

        {/* Monthly / Yearly Switcher */}
        <div className="inline-flex items-center p-1 rounded-xl bg-border-light border border-border-default">
          <button
            type="button"
            onClick={() => onBillingChange('monthly')}
            className={`
              px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150 cursor-pointer
              ${
                billingCycle === 'monthly'
                  ? 'bg-white text-heading shadow-xs'
                  : 'text-body hover:text-heading'
              }
            `}
          >
            Monthly billing
          </button>
          <button
            type="button"
            onClick={() => onBillingChange('yearly')}
            className={`
              px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer
              ${
                billingCycle === 'yearly'
                  ? 'bg-white text-heading shadow-xs'
                  : 'text-body hover:text-heading'
              }
            `}
          >
            <span>Annual billing</span>
            <span className="text-[11px] font-bold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
