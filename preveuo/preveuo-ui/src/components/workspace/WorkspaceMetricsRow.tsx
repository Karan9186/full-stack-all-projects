import { PRIMARY_COLOR } from '@/lib/constants/theme';
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
              <span className="text-[13px] font-medium text-body">
                {metric.label}
              </span>
              <button
                type="button"
                className="text-muted hover:text-heading p-1 rounded-md"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Value */}
            <div className="text-[28px] sm:text-[32px] font-bold text-heading tracking-tight leading-none mb-3">
              {metric.value}
            </div>
          </div>

          {/* Bottom row: trend + sparkline */}
          <div className="flex items-end justify-between pt-1">
            <div className="flex items-center gap-1 text-[11.5px] font-medium text-emerald-600">
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
              <span>{metric.change}</span>
            </div>

            {/* SVG Sparkline */}
            <div className="w-20 h-7">
              <svg viewBox="0 0 80 28" fill="none" className="w-full h-full overflow-visible">
                <path
                  d={
                    metric.id === 'm1'
                      ? "M0 22 Q 15 22, 25 18 T 45 19 T 65 10 T 80 8"
                      : metric.id === 'm2'
                      ? "M0 24 Q 15 23, 25 18 T 45 20 T 65 14 T 80 9"
                      : metric.id === 'm3'
                      ? "M0 22 Q 15 22, 25 18 T 45 20 T 65 15 T 80 11"
                      : "M0 24 Q 15 24, 25 21 T 45 21 T 65 16 T 80 13"
                  }
                  fill="none"
                  stroke={PRIMARY_COLOR}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
