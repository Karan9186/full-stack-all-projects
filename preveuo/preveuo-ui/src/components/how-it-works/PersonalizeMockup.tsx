import React from 'react';

export const PersonalizeMockup: React.FC = () => {
  return (
    <div className="bg-light rounded-3xl p-6 sm:p-10 border border-border-light flex items-center justify-center relative">
      <div className="w-full bg-white rounded-2xl border border-border-default shadow-xl p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-border-light mb-5">
          <span className="text-[12px] font-bold text-heading uppercase tracking-wider">
            VARIABLE TOKENS
          </span>
          <span className="text-[11px] font-mono text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full">
            Auto-populated
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-xl border border-border-default bg-canvas flex items-center justify-between">
            <span className="text-[12px] font-mono text-body">{'{{company_name}}'}</span>
            <span className="text-[12px] font-semibold text-heading">Acme Corp</span>
          </div>
          <div className="p-3 rounded-xl border border-border-default bg-canvas flex items-center justify-between">
            <span className="text-[12px] font-mono text-body">{'{{prospect_name}}'}</span>
            <span className="text-[12px] font-semibold text-heading">Sarah Jenkins</span>
          </div>
          <div className="p-3 rounded-xl border border-border-default bg-canvas flex items-center justify-between">
            <span className="text-[12px] font-mono text-body">{'{{logo_url}}'}</span>
            <span className="text-[12px] font-semibold text-brand-purple">Custom Logo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
