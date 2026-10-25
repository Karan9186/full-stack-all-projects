'use client';

import React, { useState } from 'react';
import { DemoSettings, DemoSeoSettings } from '@/types/demo';
import { Globe, Image as ImageIcon, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

interface SeoSettingsTabProps {
  settings: DemoSettings;
  onChange: (updates: Partial<DemoSettings>) => void;
}

export const SeoSettingsTab: React.FC<SeoSettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const seo: DemoSeoSettings = settings.seo || {
    metaTitle: 'New Demo',
    metaDescription: 'Click through a step-by-step, interactive demo walkthrough, powered by Preveuo.',
    metaImageUrl: '',
    showDescriptionOnSharePage: true,
    showAuthorOnDemoPage: true,
    allowSearchEngineIndexing: true,
    customDomain: '',
    isDomainVerified: false,
  };

  const [domainInput, setDomainInput] = useState(seo.customDomain || '');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleUpdate = (patch: Partial<DemoSeoSettings>) => {
    onChange({
      seo: {
        ...seo,
        ...patch,
      },
    });
  };

  const handleConnectDomain = () => {
    if (!domainInput) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      handleUpdate({
        customDomain: domainInput,
        isDomainVerified: true,
      });
    }, 800);
  };

  return (
    <div className="space-y-6 text-heading animate-fade-in max-w-2xl">
      <div>
        <h3 className="text-base font-extrabold text-heading">SEO Settings</h3>
        <p className="text-xs text-body mt-0.5">
          Optimize search engine indexing, social media Open Graph cards, and custom domains.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        {/* 1. Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Title</label>
          <input
            type="text"
            value={seo.metaTitle || 'New Demo'}
            onChange={(e) => handleUpdate({ metaTitle: e.target.value })}
            placeholder="New Demo"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-border-input bg-white text-heading focus:outline-none focus:border-brand-purple font-semibold"
          />
        </div>

        {/* 2. Meta Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Meta Description</label>
          <textarea
            rows={3}
            value={seo.metaDescription || ''}
            onChange={(e) => handleUpdate({ metaDescription: e.target.value })}
            placeholder="Click through a step-by-step, interactive demo walkthrough, powered by Preveuo."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-border-input bg-white text-heading focus:outline-none focus:border-brand-purple leading-relaxed resize-none"
          />
        </div>

        {/* 3. Meta Image Upload */}
        <div className="space-y-2 p-4 rounded-2xl bg-canvas border border-border-default">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700">Meta Image</label>
            <span className="text-[10px] text-muted">Recommended: 1200 x 630px, up to 5MB</span>
          </div>

          <p className="text-[11px] text-body">
            Upload a custom image that will be shown when your demo is shared on social media (LinkedIn, Twitter, Slack).
          </p>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="text"
              value={seo.metaImageUrl || ''}
              onChange={(e) => handleUpdate({ metaImageUrl: e.target.value })}
              placeholder="https://example.com/social-og.jpg"
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-border-input bg-white font-mono"
            />
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-xl bg-white border border-border-input hover:border-brand-purple text-xs font-semibold text-heading flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-brand-purple" />
              <span>Upload Custom Image</span>
            </button>
          </div>
          <div className="text-[10px] text-muted">PNG, JPG, SVG, GIF</div>
        </div>

        {/* 4. Display Toggles */}
        <div className="space-y-3 pt-2 border-t border-border-light">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xs font-bold text-heading">Show description and steps on share page</h4>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={seo.showDescriptionOnSharePage !== false}
                onChange={(e) => handleUpdate({ showDescriptionOnSharePage: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
            </label>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xs font-bold text-heading">Show author in demo page</h4>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={seo.showAuthorOnDemoPage !== false}
                onChange={(e) => handleUpdate({ showAuthorOnDemoPage: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
            </label>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xs font-bold text-heading">Allow search engines to index your demo</h4>
              <p className="text-[11px] text-body">
                If disabled, a `noindex` tag is added to prevent indexing by Google and Bing.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={seo.allowSearchEngineIndexing !== false}
                onChange={(e) => handleUpdate({ allowSearchEngineIndexing: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
            </label>
          </div>
        </div>

        {/* 5. Custom Domain Section */}
        <div className="p-4 rounded-2xl bg-canvas border border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-purple" />
              <h4 className="text-xs font-bold text-heading">Custom domain</h4>
            </div>
            {seo.isDomainVerified && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                <span>Connected</span>
              </span>
            )}
          </div>

          <p className="text-[11px] text-body leading-relaxed">
            Maintain brand identity by using your own domain when sharing a walkthrough with your customers.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="https://demo.yourcompany.com"
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-border-input bg-white text-heading font-mono focus:outline-none focus:border-brand-purple"
            />
            <button
              type="button"
              onClick={handleConnectDomain}
              disabled={isVerifying || !domainInput}
              className="px-4 py-1.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover disabled:opacity-50 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
            >
              {isVerifying ? 'Verifying...' : 'Connect domain'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
