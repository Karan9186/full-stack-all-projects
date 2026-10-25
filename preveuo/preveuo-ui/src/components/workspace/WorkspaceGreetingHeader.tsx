'use client';

import React from 'react';
import { Clock, ChevronDown } from 'lucide-react';

export const WorkspaceGreetingHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-[24px] sm:text-[28px] font-bold tracking-[-0.025em] text-heading">
          Good morning, Karan
        </h2>
        <p className="text-[13.5px] sm:text-[14px] text-body font-normal mt-0.5">
          Here&apos;s how your demos are performing this month.
        </p>
      </div>

      {/* Date Range Picker Pill */}
      <button
        type="button"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white border border-border-default text-heading shadow-2xs hover:border-border-input transition-colors self-start sm:self-auto cursor-pointer"
      >
        <Clock className="w-3.5 h-3.5 text-body" />
        <span>May 1 – May 21, 2025</span>
        <ChevronDown className="w-3.5 h-3.5 text-muted" />
      </button>
    </div>
  );
};
