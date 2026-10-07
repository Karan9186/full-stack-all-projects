import React from 'react';

export const CaptureMockup: React.FC = () => {
  return (
    <div className="bg-[#f8f8fc] rounded-3xl p-6 sm:p-10 border border-[#f0f0f4] flex items-center justify-center relative">
      <div className="w-full bg-white rounded-2xl border border-[#e5e7eb] shadow-xl overflow-hidden relative">
        {/* Address bar */}
        <div className="flex items-center justify-center px-4 py-2.5 bg-[#fbfbfd] border-b border-[#f0f0f4] relative">
          <div className="flex items-center gap-1.5 absolute left-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f87171]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]/60" />
          </div>
          <div className="text-[11px] text-[#9ca3af] bg-[#f0f0f5] px-4 py-1 rounded-full flex items-center gap-1.5 font-mono">
            app.preveuo.com/demos/q3-product-overview
          </div>
        </div>

        {/* App interface */}
        <div className="flex min-h-[260px]">
          {/* Left Icon Rail */}
          <div className="w-12 border-r border-[#f0f0f4] bg-[#fafafc] flex flex-col items-center py-4 gap-4 shrink-0">
            <div className="w-6 h-6 rounded-[6px] bg-[#5B5CE2] flex items-center justify-center text-white mb-2">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="7" width="10" height="8" rx="1.5" fill="white" />
                <path d="M5 7V5a3 3 0 016 0v2" stroke="white" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <div className="text-[#9ca3af]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div className="w-7 h-7 rounded-lg bg-[#eeecff] text-[#5B5CE2] flex items-center justify-center">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
            </div>
            <div className="text-[#9ca3af]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
            </div>
          </div>

          {/* Main Area */}
          <div className="flex-1 p-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0f0f4] mb-4">
              <span className="text-[12px] font-bold text-[#0f0f1a] uppercase tracking-wider">
                DEMOS
              </span>
              <div className="flex items-center gap-2">
                <div className="h-7 w-28 bg-[#f5f5f9] rounded-lg border border-[#e5e7eb] hidden sm:block" />
                <div className="h-7 px-3 rounded-lg bg-[#5B5CE2] text-white text-[11px] font-semibold flex items-center gap-1">
                  <span>+</span> New
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-[#e5e7eb] bg-[#fafafc] flex flex-col gap-2">
                <div className="h-16 rounded-lg bg-white border border-[#f0f0f4] flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-[#eeecff] text-[#5B5CE2] flex items-center justify-center">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                </div>
                <div className="h-3 w-20 bg-[#e5e7eb] rounded" />
                <div className="h-2 w-12 bg-[#f0f0f4] rounded" />
              </div>
              <div className="p-3 rounded-xl border border-[#e5e7eb] bg-[#fafafc] flex flex-col gap-2">
                <div className="h-16 rounded-lg bg-white border border-[#f0f0f4] flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-[#eeecff] text-[#5B5CE2] flex items-center justify-center">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                </div>
                <div className="h-3 w-24 bg-[#e5e7eb] rounded" />
                <div className="h-2 w-14 bg-[#f0f0f4] rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Capture Overlay Badge */}
        <div className="absolute top-12 right-6 bg-[#0f0f1a] text-white text-[11.5px] font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Recording step 3 of 6</span>
        </div>
      </div>
    </div>
  );
};
