'use client';

import React from 'react';
import { DemoSettings, HotspotTransparency } from '@/types/demo';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HotspotsAppearanceTabProps {
  settings: DemoSettings;
  onChange: (updates: Partial<DemoSettings>) => void;
}

const TRANSPARENCY_OPTIONS: HotspotTransparency[] = ['50%', '60%', '70%', '80%', '90%', '100%'];

export const HotspotsAppearanceTab: React.FC<HotspotsAppearanceTabProps> = ({
  settings,
  onChange,
}) => {
  const showAnnotationsByDefault = settings.showAnnotationsByDefault !== false;
  const showNextButton = settings.showNextButton !== false;
  const showStepCount = settings.showStepCount !== false;
  const transparency = settings.hotspotTransparency || '100%';
  const mobileHotspotView = settings.mobileHotspotView !== false;
  const showHotspotAnimation = settings.showHotspotAnimation !== false;

  const opacityValue = parseInt(transparency, 10) / 100;

  return (
    <div className="space-y-6 text-heading animate-fade-in max-w-2xl">
      {/* 1. Hotspot Interaction Toggles */}
      <div className="space-y-4 pb-5 border-b border-border-light">
        {/* Show text annotations by default */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Show text annotations by default</h4>
            <p className="text-xs text-body mt-0.5">
              If disabled, text annotations are shown only when the user hovers over the hotspot.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showAnnotationsByDefault}
              onChange={(e) => onChange({ showAnnotationsByDefault: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* Next button */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Next button</h4>
            <p className="text-xs text-body mt-0.5">
              If enabled, the Next → button will be shown under the hotspot text.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showNextButton}
              onChange={(e) => onChange({ showNextButton: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* Show step count */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Show step count</h4>
            <p className="text-xs text-body mt-0.5">
              If enabled, the current and total step counts will be shown under the hotspot text.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showStepCount}
              onChange={(e) => onChange({ showStepCount: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>
      </div>

      {/* 2. Hotspot Transparency */}
      <div className="space-y-3 pb-5 border-b border-border-light">
        <div>
          <h4 className="text-sm font-bold text-heading">Hotspot transparency</h4>
          <p className="text-xs text-body mt-0.5">
            Adjust the background opacity of hotspot callout cards.
          </p>
        </div>

        {/* Transparency Pills */}
        <div className="grid grid-cols-6 gap-1 p-1 bg-border-light rounded-2xl border border-border-default">
          {TRANSPARENCY_OPTIONS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onChange({ hotspotTransparency: val })}
              className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                transparency === val
                  ? 'bg-white text-brand-purple shadow-xs'
                  : 'text-body hover:text-heading'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Mobile View & Animation */}
      <div className="space-y-4 pb-5 border-b border-border-light">
        {/* Mobile hotspot view */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Mobile hotspot view</h4>
            <p className="text-xs text-body mt-0.5">
              If enabled, hotspots will be shown in a mobile-friendly view.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={mobileHotspotView}
              onChange={(e) => onChange({ mobileHotspotView: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* Show hotspot animation */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Show hotspot animation</h4>
            <p className="text-xs text-body mt-0.5">
              If disabled, hotspot animations (ping, pulse) will not be shown.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showHotspotAnimation}
              onChange={(e) => onChange({ showHotspotAnimation: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>
      </div>

      {/* 4. Live Hotspot Preview Mockup Card */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Hotspot Appearance Live Preview
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-dark to-zinc-900 flex items-center justify-center relative overflow-hidden shadow-inner min-h-[180px]">
          {/* Beacon Target Dot */}
          <div className="absolute top-6 flex items-center justify-center">
            <div className={`w-6 h-6 rounded-full bg-brand-purple/30 flex items-center justify-center ${showHotspotAnimation ? 'animate-ping' : ''}`}>
              <div className="w-3 h-3 rounded-full bg-brand-purple" />
            </div>
          </div>

          {/* Sample Hotspot Callout Card */}
          <div
            className="w-full max-w-sm rounded-2xl bg-brand-purple text-white p-4 shadow-2xl transition-all duration-200 mt-4"
            style={{ opacity: opacityValue }}
          >
            {showStepCount && (
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">
                Step 1 of 3
              </div>
            )}
            <p className="text-sm font-semibold leading-relaxed">
              This is an example hotspot.
            </p>

            {showNextButton && (
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/20">
                <span className="text-xs text-white/80">Skip</span>
                <button
                  type="button"
                  className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
