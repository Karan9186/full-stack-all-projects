'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';

interface AutoplayLivePreviewWidgetProps {
  stepDurationMs: number;
  transitionDelayMs: number;
  isAutoplayEnabled: boolean;
  isLoopEnabled: boolean;
}

export const AutoplayLivePreviewWidget: React.FC<AutoplayLivePreviewWidgetProps> = ({
  stepDurationMs,
  transitionDelayMs,
  isAutoplayEnabled,
  isLoopEnabled,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const totalSlides = 3;

  useEffect(() => {
    // Reset to beginning whenever any timing or autoplay setting changes
    setActiveSlide(0);
    setProgress(0);

    if (!isAutoplayEnabled) {
      return;
    }

    const duration = Math.max(500, stepDurationMs);
    const transition = Math.max(100, transitionDelayMs);
    const totalCycle = duration + transition;

    let startTime = performance.now();
    let animationFrameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const stepProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(stepProgress);

      if (elapsed >= totalCycle) {
        startTime = performance.now();
        setActiveSlide((prev) => {
          if (prev >= totalSlides - 1) {
            // Live preview always cycles smoothly to continuously showcase timing
            return 0;
          }
          return prev + 1;
        });
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [stepDurationMs, transitionDelayMs, isAutoplayEnabled, isLoopEnabled, totalSlides]);

  return (
    <div className="w-full h-full min-h-[360px] rounded-3xl bg-gradient-to-br from-[#ECECFE] via-[#E4E4FC] to-[#DCDCFA] p-4 sm:p-6 flex flex-col justify-between border border-[#5B5CE2]/20 shadow-inner relative overflow-hidden select-none">
      {/* Top Tag & Live Status */}
      <div className="flex items-center justify-between mb-3 text-xs z-10">
        <div className="flex items-center gap-1.5 font-bold text-[#5B5CE2]">
          {isAutoplayEnabled ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#5B5CE2] animate-ping" />
              <span>Interactive Live Preview ({stepDurationMs}ms)</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-[#9ca3af]" />
              <span className="text-[#6b7280]">Autoplay Paused</span>
            </>
          )}
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/80 text-[#5B5CE2] shadow-2xs">
          Slide {activeSlide + 1} of {totalSlides}
        </span>
      </div>

      {/* Mini Mockup Window (matches Image 2 dashboard mockup) */}
      <div className="w-full bg-white rounded-2xl shadow-xl border border-white/60 overflow-hidden flex flex-col relative">
        {/* Mockup macOS Header Bar */}
        <div className="h-6 bg-[#1a1a24] px-3 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
          <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
          <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
          <div className="flex-1 text-center text-[9px] font-mono text-white/40 truncate">
            preveuo-demo.app
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-3.5 space-y-3 bg-[#fafafa]">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-extrabold text-[#0f0f1a]">Your Dashboard</div>
              <div className="text-[9px] text-[#6b7280]">Real-time engagement metrics</div>
            </div>
            <div className="w-5 h-5 rounded-full bg-[#5B5CE2]/20 border border-[#5B5CE2]/40 text-[#5B5CE2] text-[9px] font-bold flex items-center justify-center">
              P
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-white border border-[#e5e7eb] shadow-2xs">
              <div className="text-[8px] font-bold uppercase tracking-wider text-[#9ca3af]">
                Moon Fever
              </div>
              <div className="text-xs font-extrabold text-[#0f0f1a] mt-0.5">$486</div>
              <div className="flex -space-x-1 mt-1">
                <span className="w-3.5 h-3.5 rounded-full bg-indigo-200 border border-white" />
                <span className="w-3.5 h-3.5 rounded-full bg-pink-200 border border-white" />
              </div>
            </div>

            <div className="p-2 rounded-xl bg-white border border-[#e5e7eb] shadow-2xs">
              <div className="text-[8px] font-bold uppercase tracking-wider text-[#9ca3af]">
                Space Frontier
              </div>
              <div className="text-xs font-extrabold text-[#0f0f1a] mt-0.5">$87</div>
              <div className="flex -space-x-1 mt-1">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-200 border border-white" />
                <span className="w-3.5 h-3.5 rounded-full bg-amber-200 border border-white" />
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="p-2.5 rounded-xl bg-white border border-[#e5e7eb] relative">
            <div className="flex items-end justify-between h-14 gap-1 px-1 pt-1">
              {[45, 75, 60, 95, 80, 50, 85, 40, 70, 90, 65, 80].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                  <div
                    className="w-full rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${val}%`,
                      backgroundColor:
                        idx % 3 === 0 ? '#5B5CE2' : idx % 3 === 1 ? '#10b981' : '#f59e0b',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Pulsing Hotspot Callout (as in Image 2) */}
            <div className="absolute top-2 right-4 flex items-center gap-1.5 animate-bounce">
              <div className="w-4 h-4 rounded-full border-2 border-red-500 bg-red-100 flex items-center justify-center animate-ping">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              </div>
              <div className="px-2 py-0.5 rounded-lg bg-red-500 text-white text-[9.5px] font-bold shadow-md flex items-center gap-1 whitespace-nowrap">
                <span>Highlight benefit two</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Progress Bar indicating dwell countdown */}
        <div className="h-1 bg-[#e5e7eb] w-full">
          <div
            className="h-full bg-[#5B5CE2] transition-all duration-75"
            style={{ width: `${isAutoplayEnabled ? progress : 0}%` }}
          />
        </div>
      </div>

      {/* Timing Readout Pill */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-[#4a4bd4] font-medium z-10">
        <span>Cycle: {((stepDurationMs + transitionDelayMs) / 1000).toFixed(1)}s per slide</span>
        <span className="font-mono">{isLoopEnabled ? 'Looping enabled' : 'Play once'}</span>
      </div>
    </div>
  );
};
