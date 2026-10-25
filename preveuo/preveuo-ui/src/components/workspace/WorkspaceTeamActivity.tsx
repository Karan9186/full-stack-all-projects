'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { WORKSPACE_TEAM_ACTIVITY } from '@/lib/workspaceDashboardData';

export const WorkspaceTeamActivity: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="text-[15px] sm:text-[16px] font-semibold text-heading">
          Team activity
        </h3>
        <p className="text-[12px] text-body font-normal mt-0.5">
          Latest from your workspace
        </p>
      </div>

      <div className="space-y-4">
        {WORKSPACE_TEAM_ACTIVITY.map((act) => (
          <div key={act.id} className="flex items-start gap-3 text-xs leading-normal">
            <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-[11px] shrink-0">
              {act.avatarInitials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-heading">
                <span className="font-semibold">{act.user}</span>{' '}
                <span className="text-body font-normal">{act.action}</span>{' '}
                <span className="font-medium text-brand-purple">{act.demoName}</span>
              </p>
              <span className="text-[11px] text-muted font-normal mt-0.5 block">
                {act.timeAgo}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
