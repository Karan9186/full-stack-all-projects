'use client';

import React from 'react';
import { DemoSettings } from '@/types/demo';
import { Info, AlertCircle, Clock, Sliders, Check } from 'lucide-react';

interface AutoplaySettingsTabProps {
  settings: DemoSettings;
  onChange: (updates: Partial<DemoSettings>) => void;
}

export const AutoplaySettingsTab: React.FC<AutoplaySettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const isAutoplay = settings.autoplay ?? false;
  const timingMode = settings.autoplayMode || 'uniform';
  const stepDuration = settings.autoplayDelay ?? 2000;
  const transitionDelay = settings.transitionDelayMs ?? 500;
  const isLoop = settings.loop ?? settings.autoplayLoop ?? false;

  return (
    <div className="space-y-6 text-[#0f0f1a] animate-fade-in">
      {/* 1. Main Autoplay Toggle Header (matches Image 2) */}
      <div className="flex items-start justify-between pb-4 border-b border-[#f0f0f4]">
        <div>
          <h3 className="text-base font-extrabold text-[#0f0f1a]">Autoplay</h3>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Automatically play content without user interaction.
          </p>
        </div>

        {/* Custom iOS/Modern Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isAutoplay}
            onChange={(e) => onChange({ autoplay: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#e5e7eb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5B5CE2]" />
        </label>
      </div>

      {/* 2. Timing Mode Switcher: Uniform vs Custom per slide */}
      <div className={`space-y-5 transition-opacity duration-200 ${isAutoplay ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <div className="inline-flex p-1 bg-[#f0f0f4] rounded-2xl border border-[#e5e7eb] w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onChange({ autoplayMode: 'uniform' })}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timingMode === 'uniform'
                ? 'bg-white text-[#0f0f1a] shadow-xs'
                : 'text-[#6b7280] hover:text-[#0f0f1a]'
            }`}
          >
            Uniform across slides
          </button>
          <button
            type="button"
            onClick={() => onChange({ autoplayMode: 'custom' })}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timingMode === 'custom'
                ? 'bg-white text-[#0f0f1a] shadow-xs'
                : 'text-[#6b7280] hover:text-[#0f0f1a]'
            }`}
          >
            Custom per slide
          </button>
        </div>

        {/* 3. Inputs: Step Duration & Transition Delay */}
        {timingMode === 'uniform' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Step Duration (ms) */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#374151]">
                <span>Step Duration (ms)</span>
                <span title="Dwell time each slide stays in view before progressing">
                  <Info className="w-3.5 h-3.5 text-[#9ca3af]" />
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="500"
                  max="30000"
                  step="100"
                  value={stepDuration}
                  onChange={(e) =>
                    onChange({
                      autoplayDelay: Math.max(500, parseInt(e.target.value, 10) || 2000),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d1d5db] bg-white text-xs font-semibold text-[#0f0f1a] focus:outline-none focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/20 transition-all"
                  placeholder="2000"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#9ca3af] font-mono">
                  ms
                </span>
              </div>
            </div>

            {/* Transition Delay (ms) */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#374151]">
                <span>Transition Delay (ms)</span>
                <span title="Delay between zoom animation finish and slide advance">
                  <Info className="w-3.5 h-3.5 text-[#9ca3af]" />
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="5000"
                  step="50"
                  value={transitionDelay}
                  onChange={(e) =>
                    onChange({
                      transitionDelayMs: Math.max(0, parseInt(e.target.value, 10) || 500),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d1d5db] bg-white text-xs font-semibold text-[#0f0f1a] focus:outline-none focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/20 transition-all"
                  placeholder="500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#9ca3af] font-mono">
                  ms
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#f8f8fc] border border-[#e5e7eb] space-y-1.5">
            <div className="text-xs font-bold text-[#0f0f1a] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#5B5CE2]" />
              <span>Per-Slide Individual Timing Active</span>
            </div>
            <p className="text-[11px] text-[#6b7280] leading-relaxed">
              In this mode, each slide uses its own custom duration configured in the slide's Animation properties.
              Slides without an override will default to {stepDuration}ms.
            </p>
          </div>
        )}

        {/* 4. Loop Content Toggle Switch */}
        <div className="flex items-start justify-between pt-2">
          <div>
            <h4 className="text-xs font-bold text-[#0f0f1a]">Loop content</h4>
            <p className="text-[11px] text-[#6b7280] mt-0.5">
              Repeat in a loop with continuous playback.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isLoop}
              onChange={(e) =>
                onChange({ loop: e.target.checked, autoplayLoop: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-[#e5e7eb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#5B5CE2]" />
          </label>
        </div>

        {/* 5. Warning Notice Banner (matches Image 2 exactly) */}
        <div className="p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5] text-[#9A3412] flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-[#EA580C] shrink-0" />
          <p className="text-xs font-medium leading-snug">
            If a voiceover is present, the longer of the step or voiceover duration is used.
          </p>
        </div>
      </div>
    </div>
  );
};
