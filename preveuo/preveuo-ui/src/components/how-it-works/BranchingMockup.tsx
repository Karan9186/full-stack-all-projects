import React from 'react';

export const BranchingMockup: React.FC = () => {
  return (
    <div className="bg-[#f8f8fc] rounded-3xl p-6 sm:p-10 border border-[#f0f0f4] flex items-center justify-center relative">
      <div className="w-full bg-white rounded-2xl border border-[#e5e7eb] shadow-xl p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0f0f4] mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#5B5CE2]" />
            <span className="text-[13px] font-bold text-[#0f0f1a]">FLOW BUILDER</span>
          </div>
          <span className="text-[11.5px] font-medium text-[#9ca3af]">3 Branches configured</span>
        </div>

        {/* Tree Flow Visual */}
        <div className="flex flex-col items-center gap-4 py-2">
          {/* Root node */}
          <div className="px-4 py-2.5 rounded-xl bg-[#5B5CE2] text-white text-[12.5px] font-bold shadow-sm">
            Step 1: Role Selection
          </div>

          <div className="w-0.5 h-6 bg-[#d1d5db]" />

          {/* Child nodes */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="p-3 rounded-xl border border-[#5B5CE2]/40 bg-[#5B5CE2]/5 text-center flex flex-col items-center">
              <span className="text-[12px] font-bold text-[#5B5CE2]">Enterprise</span>
              <span className="text-[10px] text-[#6b7280] mt-0.5">5 Steps</span>
            </div>
            <div className="p-3 rounded-xl border border-[#e5e7eb] bg-white text-center flex flex-col items-center">
              <span className="text-[12px] font-bold text-[#0f0f1a]">Mid-Market</span>
              <span className="text-[10px] text-[#6b7280] mt-0.5">4 Steps</span>
            </div>
            <div className="p-3 rounded-xl border border-[#e5e7eb] bg-white text-center flex flex-col items-center">
              <span className="text-[12px] font-bold text-[#0f0f1a]">Startup</span>
              <span className="text-[10px] text-[#6b7280] mt-0.5">3 Steps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
