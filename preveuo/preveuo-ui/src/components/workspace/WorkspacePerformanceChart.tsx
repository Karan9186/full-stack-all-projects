'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { ChevronDown } from 'lucide-react';

export const WorkspacePerformanceChart: React.FC = () => {
  return (
    <Card className="p-6 flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#0f0f1a]">
            Demo performance
          </h3>
          <p className="text-[12px] text-[#6b7280] font-normal mt-0.5">
            Views and unique viewers over time
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-3 text-xs font-normal">
            <span className="flex items-center gap-1.5 text-[#0f0f1a]">
              <span className="w-2 h-2 rounded-full bg-[#5B5CE2]" />
              Views
            </span>
            <span className="flex items-center gap-1.5 text-[#6b7280]">
              <span className="w-2 h-2 rounded-full bg-[#9ca3af]" />
              Unique viewers
            </span>
          </div>

          {/* Period selector */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-[#e5e7eb] text-[#0f0f1a] hover:border-[#d1d5db] transition-colors cursor-pointer"
          >
            <span>Last 30 days</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
          </button>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full h-64 sm:h-72">
        {/* Y Axis Gridlines and labels */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[11px] font-mono text-[#9ca3af]">
          <div className="flex items-center w-full">
            <span className="w-8">3k</span>
            <div className="flex-1 border-b border-[#f0f0f4]" />
          </div>
          <div className="flex items-center w-full">
            <span className="w-8">2k</span>
            <div className="flex-1 border-b border-[#f0f0f4]" />
          </div>
          <div className="flex items-center w-full">
            <span className="w-8">1k</span>
            <div className="flex-1 border-b border-[#f0f0f4]" />
          </div>
          <div className="flex items-center w-full">
            <span className="w-8">0</span>
            <div className="flex-1 border-b border-[#f0f0f4]" />
          </div>
        </div>

        {/* Chart Curves */}
        <div className="absolute inset-0 pl-8 pb-6">
          <svg
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B5CE2" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#5B5CE2" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient Area under purple line */}
            <path
              d="M 0 170 C 60 160, 100 150, 150 150 C 200 150, 240 110, 300 110 C 360 110, 400 90, 450 85 C 500 80, 550 40, 600 45 L 600 200 L 0 200 Z"
              fill="url(#purpleGradient)"
            />

            {/* Gray Dashed Curve (Unique Viewers) */}
            <path
              d="M 0 185 C 60 180, 100 170, 150 170 C 200 170, 240 140, 300 140 C 360 140, 400 120, 450 125 C 500 120, 550 80, 600 85"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />

            {/* Solid Purple Curve (Views) */}
            <path
              d="M 0 170 C 60 160, 100 150, 150 150 C 200 150, 240 110, 300 110 C 360 110, 400 90, 450 85 C 500 80, 550 40, 600 45"
              fill="none"
              stroke="#5B5CE2"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[11px] font-mono text-[#9ca3af] pt-2">
          <span>May 1</span>
          <span>May 6</span>
          <span>May 11</span>
          <span>May 16</span>
          <span>May 21</span>
        </div>
      </div>
    </Card>
  );
};
