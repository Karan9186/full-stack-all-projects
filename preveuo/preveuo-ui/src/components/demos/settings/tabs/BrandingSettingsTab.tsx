'use client';

import React from 'react';
import { DemoSettings, DemoBrandingSettings } from '@/types/demo';
import { ExternalLink, Upload, Palette } from 'lucide-react';

interface BrandingSettingsTabProps {
  settings: DemoSettings;
  onChange: (updates: Partial<DemoSettings>) => void;
}

export const BrandingSettingsTab: React.FC<BrandingSettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const branding: DemoBrandingSettings = settings.branding || {
    watermarkEnabled: true,
    watermarkText: 'Created on Preveuo',
    useWorkspaceDefault: true,
    ctaButtonText: 'Create Preveuo',
    ctaButtonUrl: 'https://preveuo.com',
    ctaButtonBgColor: '#5B5CE2',
    ctaButtonTextColor: '#ffffff',
  };

  const handleUpdateBranding = (patch: Partial<DemoBrandingSettings>) => {
    onChange({
      branding: {
        ...branding,
        ...patch,
      },
    });
  };

  return (
    <div className="space-y-6 text-[#0f0f1a] animate-fade-in max-w-2xl">
      {/* 1. Watermark CTA */}
      <div className="space-y-3 pb-5 border-b border-[#f0f0f4]">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#0f0f1a]">Watermark CTA</h4>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Display watermark badge on published demos and embeds.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={branding.watermarkEnabled !== false}
              onChange={(e) => handleUpdateBranding({ watermarkEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-[#e5e7eb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#5B5CE2]" />
          </label>
        </div>

        {branding.watermarkEnabled !== false && (
          <div className="p-3.5 rounded-2xl bg-[#f8f8fc] border border-[#e5e7eb] space-y-3">
            {/* Workspace default checkbox */}
            <label className="flex items-center gap-2 text-xs font-semibold text-[#374151] cursor-pointer">
              <input
                type="checkbox"
                checked={branding.useWorkspaceDefault !== false}
                onChange={(e) => handleUpdateBranding({ useWorkspaceDefault: e.target.checked })}
                className="w-4 h-4 accent-[#5B5CE2] rounded"
              />
              <span>Workspace default: Use the watermark CTA configured at workspace level</span>
            </label>

            {!branding.useWorkspaceDefault && (
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
                  Custom Watermark Text
                </label>
                <input
                  type="text"
                  value={branding.watermarkText || 'Created on Preveuo'}
                  onChange={(e) => handleUpdateBranding({ watermarkText: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#d1d5db] bg-white text-[#0f0f1a] focus:outline-none focus:border-[#5B5CE2]"
                  placeholder="Created on Preveuo"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Share Page Logo */}
      <div className="space-y-3 pb-5 border-b border-[#f0f0f4]">
        <div>
          <h4 className="text-sm font-bold text-[#0f0f1a]">Share Page Logo</h4>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Display your organization logo at the top of the standalone demo share page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={branding.sharePageLogoUrl || ''}
            onChange={(e) => handleUpdateBranding({ sharePageLogoUrl: e.target.value })}
            placeholder="https://example.com/logo.png"
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#d1d5db] bg-white text-[#0f0f1a] focus:outline-none focus:border-[#5B5CE2]"
          />
          <button
            type="button"
            className="px-3.5 py-2 rounded-xl bg-white border border-[#d1d5db] hover:border-[#5B5CE2] text-xs font-semibold text-[#0f0f1a] flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-[#5B5CE2]" />
            <span>Upload Logo</span>
          </button>
        </div>
      </div>

      {/* 3. Share Page Button */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-[#0f0f1a]">Share Page Button</h4>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Call to action button displayed next to your demo to convert viewers into leads.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#6b7280]">Button Text</label>
            <input
              type="text"
              value={branding.ctaButtonText || 'Create Preveuo'}
              onChange={(e) => handleUpdateBranding({ ctaButtonText: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#d1d5db] bg-white text-[#0f0f1a] focus:outline-none focus:border-[#5B5CE2]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#6b7280]">Link</label>
            <input
              type="text"
              value={branding.ctaButtonUrl || 'https://preveuo.com'}
              onChange={(e) => handleUpdateBranding({ ctaButtonUrl: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#d1d5db] bg-white text-[#0f0f1a] focus:outline-none focus:border-[#5B5CE2]"
            />
          </div>
        </div>

        {/* Colors Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#6b7280]">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.ctaButtonBgColor || '#5B5CE2'}
                onChange={(e) => handleUpdateBranding({ ctaButtonBgColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border border-[#e5e7eb] p-0.5"
              />
              <input
                type="text"
                value={branding.ctaButtonBgColor || '#5B5CE2'}
                onChange={(e) => handleUpdateBranding({ ctaButtonBgColor: e.target.value })}
                className="flex-1 px-2.5 py-1 text-xs rounded-xl border border-[#d1d5db] font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#6b7280]">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.ctaButtonTextColor || '#ffffff'}
                onChange={(e) => handleUpdateBranding({ ctaButtonTextColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border border-[#e5e7eb] p-0.5"
              />
              <input
                type="text"
                value={branding.ctaButtonTextColor || '#ffffff'}
                onChange={(e) => handleUpdateBranding({ ctaButtonTextColor: e.target.value })}
                className="flex-1 px-2.5 py-1 text-xs rounded-xl border border-[#d1d5db] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Live CTA Button Preview Card */}
        <div className="p-4 rounded-2xl bg-[#fafafc] border border-[#e5e7eb] flex items-center justify-between">
          <div className="text-xs text-[#6b7280]">
            <span>Preview CTA Button</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={branding.ctaButtonUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-transform hover:scale-105"
              style={{
                backgroundColor: branding.ctaButtonBgColor || '#5B5CE2',
                color: branding.ctaButtonTextColor || '#ffffff',
              }}
            >
              {branding.ctaButtonText || 'Create Preveuo'}
            </a>
            <span className="text-[11px] text-[#5B5CE2] hover:underline flex items-center gap-1 cursor-pointer">
              <span>Preview</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
