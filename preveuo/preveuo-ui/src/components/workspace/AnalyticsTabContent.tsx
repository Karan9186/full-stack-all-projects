'use client';

import React from 'react';
import { Card } from '@/components/ui';
import {
  Download,
  Clock,
  ChevronDown,
  ArrowUp,
  Search,
} from 'lucide-react';
import {
  WORKSPACE_ANALYTICS_KPIS,
  WORKSPACE_FUNNEL_ITEMS,
} from '@/lib/workspaceDashboardData';

export const AnalyticsTabContent: React.FC = () => {
  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-[#0f0f1a]">
            Analytics
          </h2>
          <p className="text-[14px] text-[#6b7280] mt-0.5">
            Understand what resonates and where viewers convert.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#e5e7eb] text-[#0f0f1a] shadow-2xs hover:border-[#d1d5db] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#6b7280]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#e5e7eb] text-[#0f0f1a] shadow-2xs hover:border-[#d1d5db] transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#6b7280]" />
            <span>Last 30 days</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
          </button>
        </div>
      </div>

      {/* 6 KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
        {WORKSPACE_ANALYTICS_KPIS.map((kpi, idx) => (
          <Card key={idx} className="p-4">
            <span className="text-[12px] font-medium text-[#6b7280] block mb-2">
              {kpi.label}
            </span>
            <div className="text-[22px] font-extrabold text-[#0f0f1a] tracking-tight leading-none mb-2">
              {kpi.value}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
              <span>{kpi.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Middle Row: Engagement Chart (Left) + Viewer Funnel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Engagement over time (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-6 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[16px] font-bold text-[#0f0f1a]">
                  Engagement over time
                </h3>
                <p className="text-[12.5px] text-[#6b7280] mt-0.5">
                  Views, interactions, and completions
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#fafafc] border border-[#e5e7eb] text-[#0f0f1a]"
              >
                <span>Daily</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
              </button>
            </div>

            {/* SVG Chart with percentage gridlines */}
            <div className="relative w-full h-64">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10.5px] font-mono text-[#9ca3af]">
                <div className="flex items-center w-full">
                  <span className="w-10">100%</span>
                  <div className="flex-1 border-b border-[#f0f0f4]" />
                </div>
                <div className="flex items-center w-full">
                  <span className="w-10">75%</span>
                  <div className="flex-1 border-b border-[#f0f0f4]" />
                </div>
                <div className="flex items-center w-full">
                  <span className="w-10">50%</span>
                  <div className="flex-1 border-b border-[#f0f0f4]" />
                </div>
                <div className="flex items-center w-full">
                  <span className="w-10">25%</span>
                  <div className="flex-1 border-b border-[#f0f0f4]" />
                </div>
                <div className="flex items-center w-full">
                  <span className="w-10">0</span>
                  <div className="flex-1 border-b border-[#f0f0f4]" />
                </div>
              </div>

              <div className="absolute inset-0 pl-10">
                <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  {/* Dashed gray line */}
                  <path
                    d="M 0 170 C 60 160, 120 160, 180 150 C 240 140, 300 130, 360 115 C 420 100, 460 90, 500 88"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                  {/* Purple solid line */}
                  <path
                    d="M 0 155 C 60 135, 120 140, 180 120 C 240 100, 300 105, 360 85 C 420 70, 460 72, 500 70"
                    fill="none"
                    stroke="#5B5CE2"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Viewer funnel (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="p-6 h-full flex flex-col justify-between">
            <div className="mb-5">
              <h3 className="text-[16px] font-bold text-[#0f0f1a]">
                Viewer funnel
              </h3>
              <p className="text-[12.5px] text-[#6b7280] mt-0.5">
                From first view to conversion
              </p>
            </div>

            <div className="space-y-4">
              {WORKSPACE_FUNNEL_ITEMS.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0f0f1a]">
                      {item.label} <span className="font-normal text-[#9ca3af] ml-1">{item.percent}%</span>
                    </span>
                    <span className="font-mono text-[#0f0f1a] font-bold">
                      {item.count}
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#f0f0f4] overflow-hidden">
                    <div
                      className="h-full bg-[#5B5CE2] rounded-full transition-all duration-300"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Row: Demo performance with search input */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#0f0f1a]">
              Demo performance
            </h3>
            <p className="text-[12.5px] text-[#6b7280] mt-0.5">
              Compare engagement across published demos
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Search demos..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs bg-white border border-[#e5e7eb] text-[#0f0f1a] placeholder-[#9ca3af] focus:outline-none focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/15"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
