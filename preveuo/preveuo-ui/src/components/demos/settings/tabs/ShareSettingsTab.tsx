'use client';

import React from 'react';
import { DemoSettings, DemoShareSettings } from '@/types/demo';
import { Share2, Users, MessageSquare, Bell, Maximize, Copy } from 'lucide-react';

interface ShareSettingsTabProps {
  settings: DemoSettings;
  onChange: (updates: Partial<DemoSettings>) => void;
}

export const ShareSettingsTab: React.FC<ShareSettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const share: DemoShareSettings = settings.share || {
    fullWidthPage: false,
    allowDuplication: true,
    showAuthor: true,
    showDescriptionsAndSteps: true,
    enableComments: true,
    emailOnComment: true,
  };

  const handleUpdate = (patch: Partial<DemoShareSettings>) => {
    onChange({
      share: {
        ...share,
        ...patch,
      },
    });
  };

  return (
    <div className="space-y-6 text-heading animate-fade-in max-w-2xl">
      <div>
        <h3 className="text-base font-extrabold text-heading">Share Settings</h3>
        <p className="text-xs text-body mt-0.5">
          Configure how your interactive walkthrough behaves on public share links and embeds.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        {/* 1. Full Width Share Page */}
        <div className="flex items-start justify-between pb-4 border-b border-border-light">
          <div>
            <h4 className="text-sm font-bold text-heading">Full Width Share Page</h4>
            <p className="text-xs text-body mt-0.5">
              Display HTML demo content in full screen to emulate the real product’s experience.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={share.fullWidthPage ?? false}
              onChange={(e) => handleUpdate({ fullWidthPage: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* 2. Allow Others to Duplicate */}
        <div className="flex items-start justify-between pb-4 border-b border-border-light">
          <div>
            <h4 className="text-sm font-bold text-heading">Allow Others to Duplicate</h4>
            <p className="text-xs text-body mt-0.5">
              Allow any viewer with an account to duplicate this demo.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={share.allowDuplication !== false}
              onChange={(e) => handleUpdate({ allowDuplication: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* 3. Show Author on Share Page */}
        <div className="flex items-start justify-between pb-4 border-b border-border-light">
          <div>
            <h4 className="text-sm font-bold text-heading">Show Author on Share Page</h4>
            <p className="text-xs text-body mt-0.5">
              Display the author under the demo.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={share.showAuthor !== false}
              onChange={(e) => handleUpdate({ showAuthor: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* 4. Descriptions and Steps on Share Page */}
        <div className="flex items-start justify-between pb-4 border-b border-border-light">
          <div>
            <h4 className="text-sm font-bold text-heading">Descriptions and Steps on Share Page</h4>
            <p className="text-xs text-body mt-0.5">
              Display step-by-step text descriptions under the demo.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={share.showDescriptionsAndSteps !== false}
              onChange={(e) => handleUpdate({ showDescriptionsAndSteps: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* 5. External Comments */}
        <div className="flex items-start justify-between pb-4 border-b border-border-light">
          <div>
            <h4 className="text-sm font-bold text-heading">External Comments</h4>
            <p className="text-xs text-body mt-0.5">
              Allow viewers to leave comments on your demo.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={share.enableComments !== false}
              onChange={(e) => handleUpdate({ enableComments: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* 6. Email notifications for comments and replies */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Email notifications for comments and replies</h4>
            <p className="text-xs text-body mt-0.5">
              Receive email notifications when someone comments or replies on this demo.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={share.emailOnComment !== false}
              onChange={(e) => handleUpdate({ emailOnComment: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>
      </div>
    </div>
  );
};
