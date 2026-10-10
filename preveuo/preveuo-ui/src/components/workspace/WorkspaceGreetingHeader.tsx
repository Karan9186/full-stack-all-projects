'use client';

import React from 'react';
import { Clock, ChevronDown } from 'lucide-react';

export const WorkspaceGreetingHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-[24px] sm:text-[28px] font-bold tracking-[-0.025em] text-[#0f0f1a]">
          Good morning, Karan
        </h2>
        <p className="text-[13.5px] sm:text-[14px] text-[#6b7280] font-normal mt-0.5">
          Here&apos;s how your demos are performing this month.
        </p>
      </div>

      {/* Date Range Picker Pill */}
      <button
        type="button"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white border border-[#e5e7eb] text-[#0f0f1a] shadow-2xs hover:border-[#d1d5db] transition-colors self-start sm:self-auto cursor-pointer"
      >
        <Clock className="w-3.5 h-3.5 text-[#6b7280]" />
        <span>May 1 – May 21, 2025</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
      </button>
    </div>
  );
};
