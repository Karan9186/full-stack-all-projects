import React from 'react';
import { ChevronRight } from 'lucide-react';

const features = [
  {
    icon: (
      // Cursor/pointer icon
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M5 3l14 9-7 1-3 7z"/>
      </svg>
    ),
    iconBg: 'bg-[#eeecff]',
    iconColor: 'text-[#5B5CE2]',
    title: 'Create without friction',
    description: (
      <>
        Capture any workflow, then polish every detail with a{' '}
        <span className="text-[#5B5CE2]">visual editor built for speed.</span>
      </>
    ),
    href: '/how-it-works',
  },
  {
    icon: (
      // Users/personalize icon
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="9" cy="7" r="3"/>
        <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
        <path d="M21 21v-2a4 4 0 00-3-3.85"/>
      </svg>
    ),
    iconBg: 'bg-[#ecfdf5]',
    iconColor: 'text-[#059669]',
    title: 'Personalize at scale',
    description: (
      <>
        Make every demo feel one-to-one with{' '}
        <span className="text-[#5B5CE2]">dynamic content</span>, account branding, and audience rules.
      </>
    ),
    href: '/how-it-works',
  },
  {
    icon: (
      // Bar chart icon
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </svg>
    ),
    iconBg: 'bg-[#fff7ed]',
    iconColor: 'text-[#ea580c]',
    title: 'Learn what converts',
    description: (
      <>
        See where viewers engage, where they leave, and{' '}
        <span className="text-[#5B5CE2]">which stories create qualified pipeline.</span>
      </>
    ),
    href: '/analytics',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white border-t border-[#f0f0f4]">
      <div className="max-w-[1000px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#5B5CE2] mb-4">
            One Platform. Every Product Story.
          </p>
          <h2 className="text-[42px] sm:text-[52px] font-extrabold tracking-[-0.03em] text-[#0f0f1a] leading-tight mb-4">
            Show, don't just tell.
          </h2>
          <p className="text-[17px] text-[#6b7280] max-w-[500px] mx-auto leading-relaxed">
            From the first touch to customer success, Preveuo makes your product the most persuasive{' '}
            <span className="text-[#5B5CE2]">part of every conversation.</span>
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="border border-[#e5e7eb] rounded-2xl p-6 hover:border-[#5B5CE2]/30 hover:shadow-[0_4px_24px_rgba(91,92,226,0.08)] transition-all duration-200 group flex flex-col gap-4"
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl ${f.iconBg} ${f.iconColor} flex items-center justify-center`}>
                {f.icon}
              </div>

              {/* Title */}
              <h3 className="text-[15px] font-bold text-[#0f0f1a]">
                {f.title}
              </h3>

              {/* Description */}
              <p className="text-[13.5px] text-[#6b7280] leading-relaxed flex-1">
                {f.description}
              </p>

              {/* Learn more */}
              <a
                href={f.href}
                className="flex items-center gap-1 text-[13px] font-semibold text-[#5B5CE2] hover:gap-2 transition-all duration-150"
              >
                Learn more
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
