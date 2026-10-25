import React from 'react';
import { FunnelStepMetric } from '@/types/analytics';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';

interface FunnelDropoffSectionProps {
  steps: FunnelStepMetric[];
}

export const FunnelDropoffSection: React.FC<FunnelDropoffSectionProps> = ({ steps }) => {
  const maxViews = steps[0]?.views || 1;

  return (
    <Card className="mb-10">
      <CardHeader>
        <CardTitle>Interactive Step Drop-off Funnel</CardTitle>
        <CardDescription>
          Identify friction points where viewers drop off during your walkthrough.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6 pt-2">
          {steps.map((st) => {
            const widthPercent = Math.round((st.views / maxViews) * 100);
            return (
              <div key={st.step} className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-heading">{st.title}</span>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-mono text-body">
                      {st.views.toLocaleString()} views ({widthPercent}%)
                    </span>
                    {st.dropoffPercentage > 0 && (
                      <span className="text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-full">
                        -{st.dropoffPercentage}% drop
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full h-3 bg-border-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-purple rounded-full transition-all duration-500"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
