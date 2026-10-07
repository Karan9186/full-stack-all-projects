import React from 'react';

export const AnalyticsMockup: React.FC = () => {
  return (
    <div className="bg-[#f8f8fc] rounded-3xl p-6 sm:p-10 border border-[#f0f0f4] flex items-center justify-center relative">
      <div className="w-full bg-white rounded-2xl border border-[#e5e7eb] shadow-xl p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0f0f4] mb-5">
          <span className="text-[12px] font-bold text-[#0f0f1a] uppercase tracking-wider">
            CONVERSION FUNNEL
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            +38% vs baseline
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[11.5px] font-semibold text-[#0f0f1a] mb-1">
              <span>Step 1: Introduction</span>
              <span>100% (2,840 views)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#f0f0f4] overflow-hidden">
              <div className="h-full bg-[#5B5CE2] rounded-full w-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11.5px] font-semibold text-[#0f0f1a] mb-1">
              <span>Step 2: Core Feature</span>
              <span>84% (2,385 views)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#f0f0f4] overflow-hidden">
              <div className="h-full bg-[#5B5CE2] rounded-full w-[84%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11.5px] font-semibold text-[#0f0f1a] mb-1">
              <span>Step 3: CTA Conversion</span>
              <span>68% (1,931 conversions)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#f0f0f4] overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[68%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
