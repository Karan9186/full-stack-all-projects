'use client';

import React from 'react';
import { DemoSettings } from '@/types/demo';
import { Type, ExternalLink, Sparkles, Monitor, Play } from 'lucide-react';

interface DemoAppearanceTabProps {
  settings: DemoSettings;
  onChange: (updates: Partial<DemoSettings>) => void;
}

export const DemoAppearanceTab: React.FC<DemoAppearanceTabProps> = ({
  settings,
  onChange,
}) => {
  const showBrowserBar = settings.showBrowserBar !== false;
  const browserBarStyle = settings.browserBarStyle || 'light';
  const browserBarTitle = settings.browserBarTitle ?? 'Your demo';
  const showVideoPlayBar = settings.showVideoPlayBar ?? false;
  const progressBar = settings.progressBar !== false;
  const replayOnLastStep = settings.replayOnLastStep !== false;
  const allowFullscreen = settings.allowFullscreen !== false;
  const fontFamily = settings.fontFamily || 'Inter';
  const showBorder = settings.showBorder ?? true;
  const openInNewTab = settings.openInNewTab !== false;

  return (
    <div className="space-y-6 text-heading animate-fade-in max-w-2xl">
      {/* 1. Browser Bar Section */}
      <div className="space-y-3 pb-5 border-b border-border-light">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Browser Bar</h4>
            <p className="text-xs text-body mt-0.5">
              If enabled, a browser bar is shown at the top of the demo.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showBrowserBar}
              onChange={(e) => onChange({ showBrowserBar: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {showBrowserBar && (
          <div className="p-3.5 rounded-2xl bg-light border border-border-default space-y-3 animate-in fade-in duration-150">
            {/* Light vs Dark Style */}
            <div className="inline-flex p-1 bg-border-default/70 rounded-xl">
              <button
                type="button"
                onClick={() => onChange({ browserBarStyle: 'light' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  browserBarStyle === 'light'
                    ? 'bg-white text-heading shadow-xs'
                    : 'text-body hover:text-heading'
                }`}
              >
                Light Browser Bar
              </button>
              <button
                type="button"
                onClick={() => onChange({ browserBarStyle: 'dark' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  browserBarStyle === 'dark'
                    ? 'bg-dark text-white shadow-xs'
                    : 'text-body hover:text-heading'
                }`}
              >
                Dark Browser Bar
              </button>
            </div>

            {/* Title Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-body uppercase tracking-wider">
                Browser Bar Title
              </label>
              <input
                type="text"
                value={browserBarTitle}
                onChange={(e) => onChange({ browserBarTitle: e.target.value })}
                placeholder="Your demo"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-border-input bg-white text-heading focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Playback Bar Controls */}
      <div className="space-y-4 pb-5 border-b border-border-light">
        {/* Video play bar */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Video play bar</h4>
            <p className="text-xs text-body mt-0.5">
              If enabled, a video-styled play bar is displayed at the bottom of the demo.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showVideoPlayBar}
              onChange={(e) => onChange({ showVideoPlayBar: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* Progress Bar */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Progress Bar</h4>
            <p className="text-xs text-body mt-0.5">
              If enabled, a progress bar is displayed at the bottom of the demo.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={progressBar}
              onChange={(e) => onChange({ progressBar: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* Replay on last step */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Replay on last step</h4>
            <p className="text-xs text-body mt-0.5">
              If enabled, a replay button is shown on the last step, letting viewers restart the demo from the beginning.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={replayOnLastStep}
              onChange={(e) => onChange({ replayOnLastStep: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* Fullscreen */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Fullscreen</h4>
            <p className="text-xs text-body mt-0.5">
              If enabled, a fullscreen button is shown in the player controls, letting viewers expand the demo to fill their screen.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={allowFullscreen}
              onChange={(e) => onChange({ allowFullscreen: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>
      </div>

      {/* 3. Typography & Live Hotspot Preview */}
      <div className="space-y-3 pb-5 border-b border-border-light">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Font</h4>
            <p className="text-xs text-body mt-0.5">
              Customize the font used across walkthrough hotspots and callouts.
            </p>
          </div>
        </div>

        <select
          value={fontFamily}
          onChange={(e) => onChange({ fontFamily: e.target.value })}
          className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-border-input bg-white text-heading focus:outline-none focus:border-brand-purple"
        >
          <option value="Inter">Default (Inter)</option>
          <option value="Roboto">Roboto</option>
          <option value="Poppins">Poppins</option>
          <option value="Outfit">Outfit</option>
          <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
          <option value="Playfair Display">Playfair Display (Serif)</option>
        </select>

        {/* Live Example Hotspot Card */}
        <div
          className="p-4 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 shadow-xs"
          style={{ fontFamily }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-purple animate-pulse" />
            <span className="text-[11px] font-bold text-brand-purple uppercase tracking-wider">
              Hotspot Live Font Preview
            </span>
          </div>
          <p className="text-sm font-medium text-heading leading-relaxed">
            This is an example hotspot. Try out the settings to create your hotspot.
          </p>
        </div>
      </div>

      {/* 4. Border & Open in New Tab */}
      <div className="space-y-4">
        {/* Border around the demo */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Border around the demo</h4>
            <p className="text-xs text-body mt-0.5">
              If enabled, a 1px border will be shown around the demo.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showBorder}
              onChange={(e) => onChange({ showBorder: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* Option to open in new tab */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Option to open in new tab</h4>
            <p className="text-xs text-body mt-0.5">
              If enabled, an icon is displayed on embeds, allowing users to view the demo on a larger window.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => onChange({ openInNewTab: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>
      </div>
    </div>
  );
};
