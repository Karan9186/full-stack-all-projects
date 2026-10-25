'use client';

import React from 'react';
import { DemoSettings, DemoBrandingSettings } from '@/types/demo';
import { ExternalLink, Upload, Palette } from 'lucide-react';
import { PRIMARY_COLOR, THEME_COLORS } from '@/lib/constants/theme';

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
    ctaButtonBgColor: PRIMARY_COLOR,
    ctaButtonTextColor: THEME_COLORS.white,
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
    <div className="space-y-6 text-heading animate-fade-in max-w-2xl">
      {/* 1. Watermark CTA */}
      <div className="space-y-3 pb-5 border-b border-border-light">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-heading">Watermark CTA</h4>
            <p className="text-xs text-body mt-0.5">
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
            <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {branding.watermarkEnabled !== false && (
          <div className="p-3.5 rounded-2xl bg-light border border-border-default space-y-3">
            {/* Workspace default checkbox */}
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={branding.useWorkspaceDefault !== false}
                onChange={(e) => handleUpdateBranding({ useWorkspaceDefault: e.target.checked })}
                className="w-4 h-4 accent-brand-purple rounded"
              />
              <span>Workspace default: Use the watermark CTA configured at workspace level</span>
            </label>

            {!branding.useWorkspaceDefault && (
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-body uppercase tracking-wider">
                  Custom Watermark Text
                </label>
                <input
                  type="text"
                  value={branding.watermarkText || 'Created on Preveuo'}
                  onChange={(e) => handleUpdateBranding({ watermarkText: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-border-input bg-white text-heading focus:outline-none focus:border-brand-purple"
                  placeholder="Created on Preveuo"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Share Page Logo */}
      <div className="space-y-3 pb-5 border-b border-border-light">
        <div>
          <h4 className="text-sm font-bold text-heading">Share Page Logo</h4>
          <p className="text-xs text-body mt-0.5">
            Display your organization logo at the top of the standalone demo share page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={branding.sharePageLogoUrl || ''}
            onChange={(e) => handleUpdateBranding({ sharePageLogoUrl: e.target.value })}
            placeholder="https://example.com/logo.png"
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-border-input bg-white text-heading focus:outline-none focus:border-brand-purple"
          />
          <button
            type="button"
            className="px-3.5 py-2 rounded-xl bg-white border border-border-input hover:border-brand-purple text-xs font-semibold text-heading flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-brand-purple" />
            <span>Upload Logo</span>
          </button>
        </div>
      </div>

      {/* 3. Share Page Button */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-heading">Share Page Button</h4>
          <p className="text-xs text-body mt-0.5">
            Call to action button displayed next to your demo to convert viewers into leads.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-body">Button Text</label>
            <input
              type="text"
              value={branding.ctaButtonText || 'Create Preveuo'}
              onChange={(e) => handleUpdateBranding({ ctaButtonText: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-border-input bg-white text-heading focus:outline-none focus:border-brand-purple"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-body">Link</label>
            <input
              type="text"
              value={branding.ctaButtonUrl || 'https://preveuo.com'}
              onChange={(e) => handleUpdateBranding({ ctaButtonUrl: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-border-input bg-white text-heading focus:outline-none focus:border-brand-purple"
            />
          </div>
        </div>

        {/* Colors Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-body">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.ctaButtonBgColor || PRIMARY_COLOR}
                onChange={(e) => handleUpdateBranding({ ctaButtonBgColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border border-border-default p-0.5"
              />
              <input
                type="text"
                value={branding.ctaButtonBgColor || PRIMARY_COLOR}
                onChange={(e) => handleUpdateBranding({ ctaButtonBgColor: e.target.value })}
                className="flex-1 px-2.5 py-1 text-xs rounded-xl border border-border-input font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-body">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.ctaButtonTextColor || THEME_COLORS.white}
                onChange={(e) => handleUpdateBranding({ ctaButtonTextColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border border-border-default p-0.5"
              />
              <input
                type="text"
                value={branding.ctaButtonTextColor || THEME_COLORS.white}
                onChange={(e) => handleUpdateBranding({ ctaButtonTextColor: e.target.value })}
                className="flex-1 px-2.5 py-1 text-xs rounded-xl border border-border-input font-mono"
              />
            </div>
          </div>
        </div>

        {/* Live CTA Button Preview Card */}
        <div className="p-4 rounded-2xl bg-canvas border border-border-default flex items-center justify-between">
          <div className="text-xs text-body">
            <span>Preview CTA Button</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={branding.ctaButtonUrl || ''}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-transform hover:scale-105"
              style={{
                backgroundColor: branding.ctaButtonBgColor || PRIMARY_COLOR,
                color: branding.ctaButtonTextColor || THEME_COLORS.white,
              }}
            >
              {branding.ctaButtonText || 'Create Preveuo'}
            </a>
            <span className="text-[11px] text-brand-purple hover:underline flex items-center gap-1 cursor-pointer">
              <span>Preview</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
