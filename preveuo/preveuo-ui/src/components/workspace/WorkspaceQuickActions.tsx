'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';
import { Video, Upload, Sparkles, LayoutTemplate, ChevronRight } from 'lucide-react';
import { WORKSPACE_QUICK_ACTIONS } from '@/lib/workspaceDashboardData';

export const WorkspaceQuickActions: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'record':
        return <Video className="w-5 h-5 text-[#5B5CE2]" />;
      case 'upload':
        return <Upload className="w-5 h-5 text-[#5B5CE2]" />;
      case 'ai':
        return <Sparkles className="w-5 h-5 text-[#5B5CE2]" />;
      case 'template':
        return <LayoutTemplate className="w-5 h-5 text-[#5B5CE2]" />;
      default:
        return <Video className="w-5 h-5 text-[#5B5CE2]" />;
    }
  };

  return (
    <Card className="p-6 flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#0f0f1a]">
          Quick actions
        </h3>
        <p className="text-[12px] text-[#6b7280] font-normal mt-0.5">
          Start creating in seconds
        </p>
      </div>

      <div className="space-y-2.5">
        {WORKSPACE_QUICK_ACTIONS.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="flex items-center justify-between p-3 rounded-xl border border-[#e5e7eb] hover:border-[#5B5CE2]/40 hover:bg-[#fafafc] transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#5B5CE2]/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {getIcon(action.iconName)}
              </div>
              <div className="min-w-0">
                <h4 className="text-[13.5px] font-semibold text-[#0f0f1a] truncate group-hover:text-[#5B5CE2] transition-colors">
                  {action.title}
                </h4>
                <p className="text-[11.5px] font-normal text-[#6b7280] truncate mt-0.5">
                  {action.description}
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-[#9ca3af] group-hover:text-[#5B5CE2] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </Link>
        ))}
      </div>
    </Card>
  );
};
