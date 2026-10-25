import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const steps = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: 'Capture naturally',
    desc: (
      <>Record any browser workflow with our <span className="text-brand-purple">lightweight extension.</span></>
    ),
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Let AI do the groundwork',
    desc: (
      <>Generate chapters, tooltips, narration, and <span className="text-brand-purple">polished copy.</span></>
    ),
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
      </svg>
    ),
    title: 'Publish everywhere',
    desc: 'Share a link, embed on your site, or add demos to campaigns.',
  },
];

export default function HowItWorksSplit() {
  return (
    <section className="py-20 bg-white border-t border-border-light">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: text */}
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand-purple mb-4">
              Built for Momentum
            </p>
            <h2 className="text-[36px] sm:text-[44px] font-extrabold tracking-[-0.03em] text-heading leading-[1.12] mb-5">
              From screen capture<br className="hidden sm:block" /> to<br />
              story in minutes.
            </h2>
            <p className="text-[15px] text-body leading-relaxed mb-8 max-w-[420px]">
              Record your product once. Preveuo automatically detects key moments,
              writes <span className="text-brand-purple">helpful copy</span>, and{' '}
              <span className="text-brand-purple">turns your workflow</span> into an experience ready
              to share.
            </p>

            <div className="flex flex-col gap-5 mb-10">
              {steps.map((s, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg border border-border-default flex items-center justify-center text-gray-700 shrink-0 mt-0.5">
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-heading mb-0.5">{s.title}</div>
                    <div className="text-[13px] text-body">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border-input text-[14px] font-semibold text-heading hover:border-brand-purple hover:text-brand-purple transition-all duration-150"
            >
              See how Preveuo works
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Studio editor mockup */}
          <div className="rounded-2xl border border-border-default overflow-hidden shadow-[0_8px_40px_rgba(91,92,226,0.10)]">
            {/* Editor top bar */}
            <div className="border-b border-border-light bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[11px] font-semibold text-gray-700 ml-2">Q3 Product Overview</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted">Preview</span>
                <button className="px-3 py-1 bg-brand-purple text-white text-[11px] font-semibold rounded-md">
                  Publish
                </button>
              </div>
            </div>

            {/* 3-column editor */}
            <div className="flex" style={{ height: 380 }}>
              {/* Step thumbnails */}
              <div className="w-[72px] border-r border-border-light bg-gray-50 flex flex-col gap-2 p-2 overflow-y-auto shrink-0">
                {[0,1,2,3].map((i) => (
                  <div
                    key={i}
                    className={`h-[52px] rounded-lg border overflow-hidden ${
                      i === 1
                        ? 'border-brand-purple ring-1 ring-brand-purple/30'
                        : 'border-border-default'
                    }`}
                  >
                    <div
                      className="w-full h-full"
                      style={{
                        background: [
                          'linear-gradient(135deg,rgb(30,27,75) 0%,rgb(49,46,129) 100%)',
                          'linear-gradient(135deg,rgb(49,46,129) 0%,var(--color-brand-purple) 100%)',
                          'linear-gradient(135deg,rgb(254,243,199) 0%,rgb(253,230,138) 100%)',
                          'linear-gradient(135deg,rgb(209,250,229) 0%,rgb(167,243,208) 100%)',
                        ][i],
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Main canvas */}
              <div className="flex-1 bg-gray-50 relative overflow-hidden p-4">
                <div className="w-full h-full bg-gradient-to-br from-indigo-950 to-indigo-900 rounded-xl relative flex items-center justify-center">
                  {/* Inner content blocks */}
                  <div className="absolute inset-x-8 top-5 bottom-5 flex gap-3">
                    <div className="w-[45%] bg-gray-900/90 rounded-lg" />
                    <div className="flex-1 flex flex-col gap-2 pt-2">
                      <div className="h-3 bg-indigo-100/40 rounded" />
                      <div className="h-3 bg-indigo-100/30 rounded w-4/5" />
                      <div className="h-3 bg-indigo-100/20 rounded" />
                      <div className="h-3 bg-indigo-100/30 rounded w-3/5" />
                    </div>
                  </div>

                  {/* Tooltip beacon popup */}
                  <div className="absolute bottom-10 right-8 bg-dark rounded-xl p-3 max-w-[160px] shadow-2xl">
                    <div className="text-[9px] text-muted mb-1">Step 2 of 8</div>
                    <div className="text-[11px] font-bold text-white mb-1.5">Your complete command center</div>
                    <div className="text-[9px] text-muted mb-2.5">Keep every team and workflow moving in one place.</div>
                    <button className="w-full py-1.5 bg-brand-purple rounded-lg text-[9px] font-bold text-white">Next →</button>
                    {/* Hotspot dot */}
                    <div className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-brand-purple ring-4 ring-brand-purple/25 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right panel */}
              <div className="w-[140px] border-l border-border-light bg-white p-3 shrink-0">
                <div className="text-[10px] font-bold text-gray-700 mb-3">Hotspot</div>
                <div className="mb-3">
                  <div className="text-[9px] text-muted uppercase tracking-wider mb-1">Trigger</div>
                  <div className="border border-border-default rounded-md px-2 py-1.5 text-[10px] text-gray-700 bg-gray-50">On click_</div>
                </div>
                <div className="mb-3">
                  <div className="text-[9px] text-muted uppercase tracking-wider mb-1">Action</div>
                  <div className="border border-border-default rounded-md px-2 py-1.5 text-[10px] text-gray-700 bg-gray-50">Next step_</div>
                </div>
                <div>
                  <div className="text-[9px] text-muted uppercase tracking-wider mb-1">Appearance</div>
                  <div className="h-1.5 bg-brand-purple rounded-full w-full" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
