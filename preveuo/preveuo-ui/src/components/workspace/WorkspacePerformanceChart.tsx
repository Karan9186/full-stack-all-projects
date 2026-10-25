import { PRIMARY_COLOR } from '@/lib/constants/theme';
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
          <h3 className="text-[15px] sm:text-[16px] font-semibold text-heading">
            Demo performance
          </h3>
          <p className="text-[12px] text-body font-normal mt-0.5">
            Views and unique viewers over time
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-3 text-xs font-normal">
            <span className="flex items-center gap-1.5 text-heading">
              <span className="w-2 h-2 rounded-full bg-brand-purple" />
              Views
            </span>
            <span className="flex items-center gap-1.5 text-body">
              <span className="w-2 h-2 rounded-full bg-muted" />
              Unique viewers
            </span>
          </div>

          {/* Period selector */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-border-default text-heading hover:border-border-input transition-colors cursor-pointer"
          >
            <span>Last 30 days</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted" />
          </button>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full h-64 sm:h-72">
        {/* Y Axis Gridlines and labels */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[11px] font-mono text-muted">
          <div className="flex items-center w-full">
            <span className="w-8">3k</span>
            <div className="flex-1 border-b border-border-light" />
          </div>
          <div className="flex items-center w-full">
            <span className="w-8">2k</span>
            <div className="flex-1 border-b border-border-light" />
          </div>
          <div className="flex items-center w-full">
            <span className="w-8">1k</span>
            <div className="flex-1 border-b border-border-light" />
          </div>
          <div className="flex items-center w-full">
            <span className="w-8">0</span>
            <div className="flex-1 border-b border-border-light" />
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
                <stop offset="0%" stopColor={PRIMARY_COLOR} stopOpacity="0.25" />
                <stop offset="100%" stopColor={PRIMARY_COLOR} stopOpacity="0.0" />
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
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />

            {/* Solid Purple Curve (Views) */}
            <path
              d="M 0 170 C 60 160, 100 150, 150 150 C 200 150, 240 110, 300 110 C 360 110, 400 90, 450 85 C 500 80, 550 40, 600 45"
              fill="none"
              stroke={PRIMARY_COLOR}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[11px] font-mono text-muted pt-2">
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
