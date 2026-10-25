import React from 'react';

export const BranchingMockup: React.FC = () => {
  return (
    <div className="bg-light rounded-3xl p-6 sm:p-10 border border-border-light flex items-center justify-center relative">
      <div className="w-full bg-white rounded-2xl border border-border-default shadow-xl p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-border-light mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-purple" />
            <span className="text-[13px] font-bold text-heading">FLOW BUILDER</span>
          </div>
          <span className="text-[11.5px] font-medium text-muted">3 Branches configured</span>
        </div>

        {/* Tree Flow Visual */}
        <div className="flex flex-col items-center gap-4 py-2">
          {/* Root node */}
          <div className="px-4 py-2.5 rounded-xl bg-brand-purple text-white text-[12.5px] font-bold shadow-sm">
            Step 1: Role Selection
          </div>

          <div className="w-0.5 h-6 bg-border-input" />

          {/* Child nodes */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="p-3 rounded-xl border border-brand-purple/40 bg-brand-purple/5 text-center flex flex-col items-center">
              <span className="text-[12px] font-bold text-brand-purple">Enterprise</span>
              <span className="text-[10px] text-body mt-0.5">5 Steps</span>
            </div>
            <div className="p-3 rounded-xl border border-border-default bg-white text-center flex flex-col items-center">
              <span className="text-[12px] font-bold text-heading">Mid-Market</span>
              <span className="text-[10px] text-body mt-0.5">4 Steps</span>
            </div>
            <div className="p-3 rounded-xl border border-border-default bg-white text-center flex flex-col items-center">
              <span className="text-[12px] font-bold text-heading">Startup</span>
              <span className="text-[10px] text-body mt-0.5">3 Steps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
