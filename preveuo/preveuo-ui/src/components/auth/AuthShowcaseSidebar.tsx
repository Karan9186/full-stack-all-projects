import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthShowcaseSidebarProps {
  mode?: 'login' | 'register';
}

export const AuthShowcaseSidebar: React.FC<AuthShowcaseSidebarProps> = ({ mode = 'login' }) => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-[#0f0f1a] text-white p-12 flex-col justify-between relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#5B5CE2]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#5B5CE2]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Top Tagline */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[12px] font-semibold text-[#8B8DF9] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Product Stories</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
          {mode === 'login'
            ? 'Deliver compelling walkthroughs that convert.'
            : 'Turn product curiosity into customer conversion.'}
        </h2>
        <p className="text-sm text-gray-400 mt-2 max-w-md">
          {mode === 'login'
            ? 'Join over 2,400+ modern software teams using Preveuo to showcase their value without scheduling a call.'
            : 'Preveuo equips your team to capture workflows, customize interactive tours, and track viewer intent in real time.'}
        </p>
      </div>

      {/* Showcase Demo Simulation Card */}
      <div className="relative z-10 my-8">
        <div className="bg-[#181826] border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              <span className="text-[11px] font-mono text-gray-400 ml-2">
                preview.preveuo.com/acme/sales-tour
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Live Demo
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span className="font-semibold">Step 2 of 5: Feature Highlight</span>
              <span className="text-gray-400">Completion: 76%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#5B5CE2] rounded-full w-3/4" />
            </div>

            <div className="bg-[#212136] rounded-xl p-4 border border-white/5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#5B5CE2] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Automated Lead Gate</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  18 leads captured today directly synced to HubSpot CRM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
        <div>
          <span className="block text-xl font-extrabold text-white">4.2x</span>
          <span>Higher Engagement</span>
        </div>
        <div>
          <span className="block text-xl font-extrabold text-white">+38%</span>
          <span>Demo Conversion</span>
        </div>
        <div>
          <span className="block text-xl font-extrabold text-white">SOC 2</span>
          <span>Type II Certified</span>
        </div>
      </div>
    </div>
  );
};
