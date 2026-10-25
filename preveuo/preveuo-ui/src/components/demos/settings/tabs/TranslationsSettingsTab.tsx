'use client';

import React, { useState } from 'react';
import { DemoSettings, DemoTranslationsSettings } from '@/types/demo';
import { Languages, Globe2, Sparkles, Check, ExternalLink } from 'lucide-react';

interface TranslationsSettingsTabProps {
  settings: DemoSettings;
  onChange: (updates: Partial<DemoSettings>) => void;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English (Original)', active: true },
  { code: 'es', name: 'Spanish (Español)', active: false },
  { code: 'fr', name: 'French (Français)', active: false },
  { code: 'de', name: 'German (Deutsch)', active: false },
  { code: 'ja', name: 'Japanese (日本語)', active: false },
  { code: 'pt', name: 'Portuguese (Português)', active: false },
];

export const TranslationsSettingsTab: React.FC<TranslationsSettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const translations: DemoTranslationsSettings = settings.translations || {
    autoDetectBrowserLanguage: true,
    defaultLocale: 'en',
    availableLocales: ['en'],
  };

  const [showHubDrawer, setShowHubDrawer] = useState(false);
  const [selectedLangs, setSelectedLangs] = useState<string[]>(
    translations.availableLocales || ['en']
  );

  const handleUpdate = (patch: Partial<DemoTranslationsSettings>) => {
    onChange({
      translations: {
        ...translations,
        ...patch,
      },
    });
  };

  const toggleLanguage = (code: string) => {
    let next: string[];
    if (selectedLangs.includes(code)) {
      if (code === 'en') return; // English is primary
      next = selectedLangs.filter((c) => c !== code);
    } else {
      next = [...selectedLangs, code];
    }
    setSelectedLangs(next);
    handleUpdate({ availableLocales: next });
  };

  return (
    <div className="space-y-6 text-heading animate-fade-in max-w-2xl">
      {/* 1. Header & Auto Browser Detect */}
      <div className="flex items-start justify-between pb-5 border-b border-border-light">
        <div>
          <h4 className="text-sm font-bold text-heading">Set Default Based on Browser</h4>
          <p className="text-xs text-body mt-0.5 leading-relaxed">
            Automatically display matching translations based on the viewer's default browser language settings.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={translations.autoDetectBrowserLanguage !== false}
            onChange={(e) => handleUpdate({ autoDetectBrowserLanguage: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple" />
        </label>
      </div>

      {/* 2. Helpful Tip Card */}
      <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-indigo-700 text-xs flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong>Tip:</strong> Add your desired translations via the Translations Hub to ensure accurate language detection for international visitors.
        </p>
      </div>

      {/* 3. Translations Hub Card */}
      <div className="p-5 rounded-2xl bg-canvas border border-border-default space-y-3">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-brand-purple" />
          <h4 className="text-sm font-bold text-heading">Translations Hub</h4>
        </div>
        <p className="text-xs text-body leading-relaxed">
          Let viewers toggle between multiple languages seamlessly, all from a single demo link or embed.
        </p>

        <button
          type="button"
          onClick={() => setShowHubDrawer(!showHubDrawer)}
          className="px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:shadow-md"
        >
          <Languages className="w-3.5 h-3.5" />
          <span>{showHubDrawer ? 'Hide Translations Hub' : 'Open Translations Hub'}</span>
        </button>

        {showHubDrawer && (
          <div className="pt-3 border-t border-border-default space-y-2 animate-in fade-in duration-150">
            <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              Enable Languages for this Walkthrough:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = selectedLangs.includes(lang.code);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => toggleLanguage(lang.code)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-brand-purple bg-brand-purple/10 text-brand-purple'
                        : 'border-border-default bg-white text-gray-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{lang.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-purple" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
