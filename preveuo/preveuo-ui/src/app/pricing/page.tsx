'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTASection from '@/components/landing/CTASection';
import { BillingCycle } from '@/types/pricing';
import { PRICING_PLANS, PRICING_FAQS } from '@/lib/pricingData';
import {
  PricingHero,
  PricingCard,
  PricingFaq,
} from '@/components/pricing';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');

  return (
    <div className="min-h-screen bg-white text-[#0f0f1a] flex flex-col font-sans selection:bg-[#5B5CE2] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <PricingHero
          billingCycle={billingCycle}
          onBillingChange={setBillingCycle}
        />

        {/* Pricing Cards Grid */}
        <section className="max-w-[1140px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {PRICING_PLANS.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
              />
            ))}
          </div>
        </section>

        {/* FAQs */}
        <PricingFaq faqs={PRICING_FAQS} />

        {/* CTA */}
        <div className="mt-28">
          <CTASection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
