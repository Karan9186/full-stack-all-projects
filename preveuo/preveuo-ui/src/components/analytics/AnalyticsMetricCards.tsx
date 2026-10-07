import React from 'react';
import { EngagementMetricCard } from '@/types/analytics';
import { Card } from '@/components/ui';
import { BarChart3, Users, Clock, CheckCircle2 } from 'lucide-react';

interface AnalyticsMetricCardsProps {
  metrics: EngagementMetricCard[];
}

export const AnalyticsMetricCards: React.FC<AnalyticsMetricCardsProps> = ({ metrics }) => {
  const icons = [
    <BarChart3 key="1" className="w-5 h-5 text-[#5B5CE2]" />,
    <Users key="2" className="w-5 h-5 text-[#5B5CE2]" />,
    <Clock key="3" className="w-5 h-5 text-[#5B5CE2]" />,
    <CheckCircle2 key="4" className="w-5 h-5 text-emerald-500" />,
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      {metrics.map((item, idx) => (
        <Card key={idx} className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              {item.label}
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#5B5CE2]/10 flex items-center justify-center">
              {icons[idx]}
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0f0f1a] tracking-tight">
              {item.value}
            </span>
            {item.changePercent && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {item.changePercent}
              </span>
            )}
          </div>
          {item.subtext && (
            <p className="text-[12px] text-[#9ca3af]">{item.subtext}</p>
          )}
        </Card>
      ))}
    </div>
  );
};
