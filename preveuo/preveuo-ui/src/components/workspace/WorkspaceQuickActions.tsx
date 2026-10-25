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
        return <Video className="w-5 h-5 text-brand-purple" />;
      case 'upload':
        return <Upload className="w-5 h-5 text-brand-purple" />;
      case 'ai':
        return <Sparkles className="w-5 h-5 text-brand-purple" />;
      case 'template':
        return <LayoutTemplate className="w-5 h-5 text-brand-purple" />;
      default:
        return <Video className="w-5 h-5 text-brand-purple" />;
    }
  };

  return (
    <Card className="p-6 flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-[15px] sm:text-[16px] font-semibold text-heading">
          Quick actions
        </h3>
        <p className="text-[12px] text-body font-normal mt-0.5">
          Start creating in seconds
        </p>
      </div>

      <div className="space-y-2.5">
        {WORKSPACE_QUICK_ACTIONS.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="flex items-center justify-between p-3 rounded-xl border border-border-default hover:border-brand-purple/40 hover:bg-canvas transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-brand-purple/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {getIcon(action.iconName)}
              </div>
              <div className="min-w-0">
                <h4 className="text-[13.5px] font-semibold text-heading truncate group-hover:text-brand-purple transition-colors">
                  {action.title}
                </h4>
                <p className="text-[11.5px] font-normal text-body truncate mt-0.5">
                  {action.description}
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-muted group-hover:text-brand-purple group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </Link>
        ))}
      </div>
    </Card>
  );
};
