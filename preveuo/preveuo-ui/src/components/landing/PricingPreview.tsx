'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export default function PricingPreview() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      description: 'Ideal for early-stage founders and small teams creating their first interactive demos.',
      priceMonthly: 29,
      priceAnnual: 19,
      badge: null,
      highlight: false,
      features: [
        'Up to 3 Active Interactive Demos',
        'Unlimited Viewers & Dwell Analytics',
        'Standard AI Smart Hotspots',
        'Preveuo Watermark Badge',
        'Standard Email Support'
      ],
      ctaText: 'Start 14-Day Free Trial',
      ctaHref: '/register?plan=starter'
    },
    {
      name: 'Growth',
      description: 'The complete growth engine for scaling product & revenue teams closing deals faster.',
      priceMonthly: 89,
      priceAnnual: 69,
      badge: 'Most Popular',
      highlight: true,
      features: [
        'Unlimited Interactive Demos',
        'Custom Branding & White-Labeling',
        'Lead Capture Forms & CRM Sync',
        'Virtual Camera Pan & Focus Zoom',
        'Step Drop-off & Heatmap Funnels',
        'Password-Protected Secret Demos',
        'Priority 24/7 Slack Support'
      ],
      ctaText: 'Start Free Trial',
      ctaHref: '/register?plan=growth'
    },
    {
      name: 'Enterprise',
      description: 'Custom governance, custom contracts, dedicated account managers, and SSO security.',
      priceMonthly: 249,
      priceAnnual: 199,
      badge: 'Full Scale',
      highlight: false,
      features: [
        'Everything in Growth',
        'Unlimited Team Seats & Workspaces',
        'Custom SSO & SAML Authentication',
        'Custom Subdomain (demo.yourbrand.com)',
        'Custom CSS & Bespoke Font Upload',
        'Dedicated Customer Success Partner',
        'Enterprise SLA & SOC2 Compliance'
      ],
      ctaText: 'Contact Enterprise Sales',
      ctaHref: '/pricing#enterprise'
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#090D16] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Simple, Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Invest in higher demo conversions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8">
            Start free for 14 days. No credit card required. Upgrade or cancel anytime.
          </p>

          {/* Billing Switch */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                !annual
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                annual
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-bold">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const price = annual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={idx}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.highlight
                    ? 'bg-slate-900 dark:bg-slate-900 text-white border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 md:-translate-y-2'
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-[11px] font-bold text-white shadow-md uppercase tracking-wider">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className={`text-xs leading-relaxed mb-6 ${plan.highlight ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold tracking-tight">${price}</span>
                    <span className={`text-xs ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                      / month {annual && '(billed yearly)'}
                    </span>
                  </div>

                  <div className="space-y-3.5 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? 'text-indigo-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
                        <span className={plan.highlight ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={plan.ctaHref}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-2 ${
                    plan.highlight
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
