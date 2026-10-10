'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { WORKSPACE_TEAM_ACTIVITY } from '@/lib/workspaceDashboardData';

export const WorkspaceTeamActivity: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#0f0f1a]">
          Team activity
        </h3>
        <p className="text-[12px] text-[#6b7280] font-normal mt-0.5">
          Latest from your workspace
        </p>
      </div>

      <div className="space-y-4">
        {WORKSPACE_TEAM_ACTIVITY.map((act) => (
          <div key={act.id} className="flex items-start gap-3 text-xs leading-normal">
            <div className="w-8 h-8 rounded-full bg-[#5B5CE2]/10 text-[#5B5CE2] flex items-center justify-center font-bold text-[11px] shrink-0">
              {act.avatarInitials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[#0f0f1a]">
                <span className="font-semibold">{act.user}</span>{' '}
                <span className="text-[#6b7280] font-normal">{act.action}</span>{' '}
                <span className="font-medium text-[#5B5CE2]">{act.demoName}</span>
              </p>
              <span className="text-[11px] text-[#9ca3af] font-normal mt-0.5 block">
                {act.timeAgo}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
