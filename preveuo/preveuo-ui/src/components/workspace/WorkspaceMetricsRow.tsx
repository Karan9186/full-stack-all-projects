'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { MoreHorizontal, ArrowUp } from 'lucide-react';
import { WORKSPACE_DASHBOARD_METRICS } from '@/lib/workspaceDashboardData';

export const WorkspaceMetricsRow: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {WORKSPACE_DASHBOARD_METRICS.map((metric) => (
        <Card key={metric.id} className="p-5 flex flex-col justify-between">
          <div>
            {/* Top row */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-[#6b7280]">
                {metric.label}
              </span>
              <button
                type="button"
                className="text-[#9ca3af] hover:text-[#0f0f1a] p-1 rounded-md"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Value */}
            <div className="text-[28px] sm:text-[32px] font-extrabold text-[#0f0f1a] tracking-tight leading-none mb-3">
              {metric.value}
            </div>
          </div>

          {/* Bottom row: trend + sparkline */}
          <div className="flex items-end justify-between pt-1">
            <div className="flex items-center gap-1 text-[12px] font-semibold text-emerald-600">
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
              <span>{metric.change}</span>
            </div>

            {/* SVG Sparkline */}
            <div className="w-20 h-7">
              <svg viewBox="0 0 80 28" fill="none" className="w-full h-full overflow-visible">
                <path
                  d="M0 22 Q 10 18, 20 20 T 40 14 T 60 10 T 80 4"
                  fill="none"
                  stroke="#5B5CE2"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
