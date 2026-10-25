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
    <div className="space-y-6 text-heading animate-fade-in max-w-2xl">
      <div>
        <h3 className="text-base font-extrabold text-heading">Accessibility</h3>
        <p className="text-xs text-body mt-0.5">
          Configure screen reader captions, keyboard navigation, and assisted controls.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        {/* 1. Show CC Button */}
        <div className="flex items-start justify-between pb-4 border-b border-border-light">
          <div>
            <h4 className="text-sm font-bold text-heading">Show CC Button</h4>
            <p className="text-xs text-body mt-0.5">
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
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* 2. Show caption controls at top */}
        <div className="flex items-start justify-between pb-4 border-b border-border-light">
          <div>
            <h4 className="text-sm font-bold text-heading">Show caption controls at top</h4>
            <p className="text-xs text-body mt-0.5">
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
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* 3. Disable keyboard navigation */}
        <div className="flex items-start justify-between pb-4 border-b border-border-light">
          <div>
            <h4 className="text-sm font-bold text-heading">Disable keyboard navigation</h4>
            <p className="text-xs text-body mt-0.5">
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
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>
      </div>
    </div>
  );
};
