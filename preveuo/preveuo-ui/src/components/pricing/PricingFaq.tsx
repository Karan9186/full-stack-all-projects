import React, { useState } from 'react';
import { FaqItem } from '@/types/pricing';
import { ChevronDown } from 'lucide-react';

interface PricingFaqProps {
  faqs: FaqItem[];
}

export const PricingFaq: React.FC<PricingFaqProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="mt-28 max-w-[800px] mx-auto px-6">
      <div className="text-center mb-12">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand-purple mb-3">
          QUESTIONS & ANSWERS
        </p>
        <h2 className="text-[32px] sm:text-[38px] font-extrabold tracking-tight text-heading">
          Frequently asked questions
        </h2>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-border-default rounded-2xl bg-white overflow-hidden shadow-2xs transition-all duration-150"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-[15px] sm:text-[16px] text-heading hover:text-brand-purple transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-muted transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-brand-purple' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-[14px] text-body leading-relaxed border-t border-border-light pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
