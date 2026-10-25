import React from 'react';

export default function TestimonialSection() {
  return (
    <section className="bg-dark py-20 px-6">
      <div className="max-w-[740px] mx-auto text-center">
        {/* Chat bubble icon */}
        <div className="flex justify-center mb-8">
          <div className="w-11 h-11 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-brand-purple">
              <rect x="1" y="1" width="34" height="34" rx="6" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M10 14h16M10 19h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M10 27l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Quote */}
        <blockquote className="text-[22px] sm:text-[26px] font-medium text-white leading-[1.5] tracking-[-0.01em] mb-10">
          "Preveuo changed how our buyers experience the product. They arrive at
          the first call already understanding the value—and our team can focus on
          the conversation that matters."
        </blockquote>

        {/* Author */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center shrink-0">
            <span className="text-[12px] font-bold text-brand-purple">NS</span>
          </div>
          <div className="text-left">
            <div className="text-[14px] font-bold text-white">Nina Shah</div>
            <div className="text-[12px] text-muted">VP of Growth, Northstar</div>
          </div>
        </div>
      </div>
    </section>
  );
}
