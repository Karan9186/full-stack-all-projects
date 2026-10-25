import React from 'react';
import { Button, Badge } from '@/components/ui';
import { TimeRangeOption } from '@/types/analytics';
import { Calendar, Download, Share2 } from 'lucide-react';

interface AnalyticsHeaderProps {
  timeRange: TimeRangeOption;
  onTimeRangeChange: (range: TimeRangeOption) => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  timeRange,
  onTimeRangeChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border-default">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="purple" size="sm" dot>
            Performance Insights
          </Badge>
          <span className="text-xs text-muted font-mono">Live Sync</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-heading">
          Walkthrough Funnel Analytics
        </h1>
        <p className="text-sm text-body mt-1">
          Analyze engagement dwell time, step drop-off points, and pipeline conversion.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as TimeRangeOption)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-border-input text-heading shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/15"
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
            <option value="All Time">All Time</option>
          </select>
        </div>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Export CSV
        </Button>
      </div>
    </div>
  );
};
