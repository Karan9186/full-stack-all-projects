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
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#5B5CE2] mb-3">
          QUESTIONS & ANSWERS
        </p>
        <h2 className="text-[32px] sm:text-[38px] font-extrabold tracking-tight text-[#0f0f1a]">
          Frequently asked questions
        </h2>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-[#e5e7eb] rounded-2xl bg-white overflow-hidden shadow-2xs transition-all duration-150"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-[15px] sm:text-[16px] text-[#0f0f1a] hover:text-[#5B5CE2] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-[#9ca3af] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#5B5CE2]' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-[14px] text-[#6b7280] leading-relaxed border-t border-[#f0f0f4] pt-3">
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
