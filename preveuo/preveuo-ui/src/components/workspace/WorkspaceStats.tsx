import React from 'react';
import { Card } from '@/components/ui';
import { Layers, Eye, CheckCircle2, Users } from 'lucide-react';

export const WorkspaceStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      <Card className="p-5">
        <div className="flex items-center justify-between text-body text-xs font-medium mb-2">
          <span>Total Tours</span>
          <Layers className="w-4 h-4 text-brand-purple" />
        </div>
        <div className="text-2xl font-bold text-heading">12</div>
        <div className="text-[11px] text-emerald-600 font-semibold mt-1">
          4 published live
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between text-body text-xs font-medium mb-2">
          <span>Total Views</span>
          <Eye className="w-4 h-4 text-brand-purple" />
        </div>
        <div className="text-2xl font-bold text-heading">48,920</div>
        <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
          +24.8% vs last mo
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between text-body text-xs font-medium mb-2">
          <span>Avg. Completion</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-2xl font-bold text-heading">81.4%</div>
        <div className="text-[11px] text-muted mt-1">High conversion threshold</div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between text-body text-xs font-medium mb-2">
          <span>Leads Captured</span>
          <Users className="w-4 h-4 text-brand-purple" />
        </div>
        <div className="text-2xl font-bold text-heading">892</div>
        <div className="text-[11px] text-emerald-600 font-semibold mt-1">Synced to HubSpot</div>
      </Card>
    </div>
  );
};
