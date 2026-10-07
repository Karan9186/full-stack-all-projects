import React from 'react';

interface WalkthroughStepProps {
  stepNumber: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  mockup: React.ReactNode;
  reversed?: boolean;
}

export const WalkthroughStep: React.FC<WalkthroughStepProps> = ({
  stepNumber,
  icon,
  title,
  description,
  tags,
  mockup,
  reversed = false,
}) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      {/* Text column */}
      <div className={`lg:col-span-5 ${reversed ? 'lg:order-2' : ''}`}>
        <div className="text-[13px] font-semibold text-[#9ca3af] mb-3 tracking-wider font-mono">
          {stepNumber}
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#eeecff] flex items-center justify-center mb-6">
          {icon}
        </div>
        <h2 className="text-[36px] sm:text-[42px] font-extrabold tracking-[-0.03em] text-[#0f0f1a] leading-tight mb-4">
          {title}
        </h2>
        <p className="text-[15px] sm:text-[16px] text-[#6b7280] leading-relaxed mb-8 max-w-[420px]">
          {description}
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
          {tags.map((tag, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[13.5px] text-[#4b5563]">
              <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 16 16" fill="none">
                <path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mockup column */}
      <div className={`lg:col-span-7 ${reversed ? 'lg:order-1' : ''}`}>
        {mockup}
      </div>
    </section>
  );
};
