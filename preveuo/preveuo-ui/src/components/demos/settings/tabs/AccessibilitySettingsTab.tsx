'use client';

import React from 'react';
import { DemoSettings, DemoAccessibilitySettings } from '@/types/demo';
import { Eye, Keyboard, Subtitles } from 'lucide-react';

interface AccessibilitySettingsTabProps {
  settings: DemoSettings;
  onChange: (updates: Partial<DemoSettings>) => void;
}

export const AccessibilitySettingsTab: React.FC<AccessibilitySettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const accessibility: DemoAccessibilitySettings = settings.accessibility || {
    showCcButton: false,
    captionControlsAtTop: false,
    disableKeyboardNavigation: false,
  };

  const handleUpdate = (patch: Partial<DemoAccessibilitySettings>) => {
    onChange({
      accessibility: {
        ...accessibility,
        ...patch,
      },
    });
  };

  return (
    <div className="space-y-6 text-[#0f0f1a] animate-fade-in max-w-2xl">
      <div>
        <h3 className="text-base font-extrabold text-[#0f0f1a]">Accessibility</h3>
        <p className="text-xs text-[#6b7280] mt-0.5">
          Configure screen reader captions, keyboard navigation, and assisted controls.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        {/* 1. Show CC Button */}
        <div className="flex items-start justify-between pb-4 border-b border-[#f0f0f4]">
          <div>
            <h4 className="text-sm font-bold text-[#0f0f1a]">Show CC Button</h4>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Display a button on the demo to allow users to see the captions.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={accessibility.showCcButton ?? false}
              onChange={(e) => handleUpdate({ showCcButton: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-[#e5e7eb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#5B5CE2]" />
          </label>
        </div>

        {/* 2. Show caption controls at top */}
        <div className="flex items-start justify-between pb-4 border-b border-[#f0f0f4]">
          <div>
            <h4 className="text-sm font-bold text-[#0f0f1a]">Show caption controls at top</h4>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Move the caption controls to the top-right of the demo, if video play bar is turned off.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={accessibility.captionControlsAtTop ?? false}
              onChange={(e) => handleUpdate({ captionControlsAtTop: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-[#e5e7eb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#5B5CE2]" />
          </label>
        </div>

        {/* 3. Disable keyboard navigation */}
        <div className="flex items-start justify-between pb-4 border-b border-[#f0f0f4]">
          <div>
            <h4 className="text-sm font-bold text-[#0f0f1a]">Disable keyboard navigation</h4>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Prevent viewers from using left and right arrow keys to move between demo steps.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={accessibility.disableKeyboardNavigation ?? false}
              onChange={(e) => handleUpdate({ disableKeyboardNavigation: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-[#e5e7eb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#5B5CE2]" />
          </label>
        </div>
      </div>
    </div>
  );
};
