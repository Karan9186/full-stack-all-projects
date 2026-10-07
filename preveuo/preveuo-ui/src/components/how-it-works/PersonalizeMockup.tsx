import React from 'react';

export const PersonalizeMockup: React.FC = () => {
  return (
    <div className="bg-[#f8f8fc] rounded-3xl p-6 sm:p-10 border border-[#f0f0f4] flex items-center justify-center relative">
      <div className="w-full bg-white rounded-2xl border border-[#e5e7eb] shadow-xl p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0f0f4] mb-5">
          <span className="text-[12px] font-bold text-[#0f0f1a] uppercase tracking-wider">
            VARIABLE TOKENS
          </span>
          <span className="text-[11px] font-mono text-[#5B5CE2] bg-[#5B5CE2]/10 px-2 py-0.5 rounded-full">
            Auto-populated
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-xl border border-[#e5e7eb] bg-[#fafafc] flex items-center justify-between">
            <span className="text-[12px] font-mono text-[#6b7280]">{'{{company_name}}'}</span>
            <span className="text-[12px] font-semibold text-[#0f0f1a]">Acme Corp</span>
          </div>
          <div className="p-3 rounded-xl border border-[#e5e7eb] bg-[#fafafc] flex items-center justify-between">
            <span className="text-[12px] font-mono text-[#6b7280]">{'{{prospect_name}}'}</span>
            <span className="text-[12px] font-semibold text-[#0f0f1a]">Sarah Jenkins</span>
          </div>
          <div className="p-3 rounded-xl border border-[#e5e7eb] bg-[#fafafc] flex items-center justify-between">
            <span className="text-[12px] font-mono text-[#6b7280]">{'{{logo_url}}'}</span>
            <span className="text-[12px] font-semibold text-[#5B5CE2]">Custom Logo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
