'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Preveuo capture my product walkthrough?',
      a: 'Preveuo offers both an instant Chrome Extension auto-recorder and a Figma / screenshot upload import. As you click through your web application, Preveuo automatically captures high-resolution states, detects clicked buttons, and creates interactive steps with smart beacon anchors.'
    },
    {
      q: 'Do I need engineering help or code changes to use Preveuo?',
      a: 'Zero code required. Marketing, product marketing, customer success, and sales reps can build, customize, and share interactive product demos in under 5 minutes without touching any production code.'
    },
    {
      q: 'How does Preveuo differ from standard video recording tools like Loom?',
      a: 'Video recordings are passive, non-interactive, and often ignored. Preveuo creates interactive experiences where prospects actively click, type, and explore real features. This active engagement delivers 3x higher retention and 48% higher conversion rates.'
    },
    {
      q: 'Can I embed Preveuo demos in my website, docs, or outbound emails?',
      a: 'Yes! Preveuo provides ultra-lightweight responsive iframe snippets, Notion embeds, HubSpot email GIF previews, and hosted standalone links with custom domains.'
    },
    {
      q: 'Can I capture visitor emails and sync them to our CRM?',
      a: 'Yes. You can insert lead capture forms at any step of the demo (e.g. before the final reveal or at the start). All captured contacts sync automatically to HubSpot, Salesforce, or via Webhooks.'
    },
    {
      q: 'Is my data and screenshots secure with Preveuo?',
      a: 'Security is paramount. Preveuo provides SOC2 Type II compliance, encryption in transit and at rest, and password-protected private demo links with domain restriction controls.'
    }
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50/50 dark:bg-dark border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Everything you need to know about getting started with Preveuo interactive demos.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white text-base hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
