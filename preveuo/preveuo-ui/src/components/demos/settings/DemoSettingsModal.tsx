'use client';

import React, { useState } from 'react';
import { DemoSettings } from '@/types/demo';
import {
  Monitor,
  Sparkles,
  Layers,
  PlayCircle,
  Music,
  Eye,
  Languages,
  Share2,
  Search,
  HelpCircle,
  X,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AutoplaySettingsTab } from './AutoplaySettingsTab';
import { AutoplayLivePreviewWidget } from './AutoplayLivePreviewWidget';
import { DemoAppearanceTab } from './tabs/DemoAppearanceTab';
import { HotspotsAppearanceTab } from './tabs/HotspotsAppearanceTab';
import { BrandingSettingsTab } from './tabs/BrandingSettingsTab';
import { BackgroundMusicTab } from './tabs/BackgroundMusicTab';
import { AccessibilitySettingsTab } from './tabs/AccessibilitySettingsTab';
import { TranslationsSettingsTab } from './tabs/TranslationsSettingsTab';
import { ShareSettingsTab } from './tabs/ShareSettingsTab';
import { SeoSettingsTab } from './tabs/SeoSettingsTab';

export type SettingsModalTab =
  | 'demo'
  | 'hotspots'
  | 'branding'
  | 'autoplay'
  | 'backgroundMusic'
  | 'accessibility'
  | 'translations'
  | 'share'
  | 'seo';

interface DemoSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DemoSettings;
  onSave: (updated: Partial<DemoSettings>) => void;
  initialTab?: SettingsModalTab;
}

export const DemoSettingsModal: React.FC<DemoSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  initialTab = 'autoplay',
}) => {
  const [activeTab, setActiveTab] = useState<SettingsModalTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSettings, setCurrentSettings] = useState<DemoSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const prevIsOpenRef = React.useRef(false);

  // Sync strictly when modal transitions from closed to open
  React.useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setCurrentSettings(settings || {});
      setActiveTab(initialTab);
      setHasChanges(false);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, settings, initialTab]);

  const handleUpdate = (patch: Partial<DemoSettings>) => {
    setCurrentSettings((prev) => ({ ...prev, ...patch }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(currentSettings);
      setHasChanges(false);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const sidebarGroups = [
    {
      group: 'Appearance',
      items: [
        { id: 'demo', label: 'Demo', icon: Monitor },
        { id: 'hotspots', label: 'Hotspots', icon: Sparkles },
        { id: 'branding', label: 'Branding', icon: Layers },
      ],
    },
    {
      group: 'Playback',
      items: [
        { id: 'autoplay', label: 'Autoplay', icon: PlayCircle },
        { id: 'backgroundMusic', label: 'Background Music', icon: Music },
      ],
    },
    {
      group: 'Audience',
      items: [
        { id: 'accessibility', label: 'Accessibility', icon: Eye },
        { id: 'translations', label: 'Translations', icon: Languages },
      ],
    },
    {
      group: 'Sharing',
      items: [
        { id: 'share', label: 'Share', icon: Share2 },
        { id: 'seo', label: 'SEO', icon: Search },
      ],
    },
  ];

  const filteredGroups = React.useMemo(() => {
    if (!searchQuery.trim()) return sidebarGroups;
    const query = searchQuery.toLowerCase();
    return sidebarGroups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (item) =>
            item.label.toLowerCase().includes(query) ||
            g.group.toLowerCase().includes(query)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-border-default flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header (matches Supademo) */}
        <div className="h-16 px-6 border-b border-border-light flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-heading">Settings</h2>
            <button
              type="button"
              className="text-gray-400 hover:text-brand-purple p-1 rounded-lg transition-colors cursor-pointer"
              title="Settings Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar on Right Header */}
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search settings..."
                className="w-48 pl-9 pr-3 py-1.5 rounded-xl border border-border-default text-xs text-heading placeholder-gray-400 focus:outline-none focus:border-brand-purple transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Sidebar + Right Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Sidebar */}
          <aside className="w-48 sm:w-56 border-r border-border-light bg-canvas p-4 flex flex-col gap-5 shrink-0 overflow-y-auto">
            {filteredGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted px-2 mb-1.5">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id as SettingsModalTab)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-heading shadow-xs border border-border-default'
                          : 'text-body hover:text-heading hover:bg-light'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-brand-purple' : 'text-muted'
                        }`}
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </aside>

          {/* Right Main Content Column */}
          <main className="flex-1 p-6 overflow-y-auto bg-white">
            {/* 1. Appearance: Demo */}
            {activeTab === 'demo' && (
              <DemoAppearanceTab
                settings={currentSettings}
                onChange={handleUpdate}
              />
            )}

            {/* 2. Appearance: Hotspots */}
            {activeTab === 'hotspots' && (
              <HotspotsAppearanceTab
                settings={currentSettings}
                onChange={handleUpdate}
              />
            )}

            {/* 3. Appearance: Branding */}
            {activeTab === 'branding' && (
              <BrandingSettingsTab
                settings={currentSettings}
                onChange={handleUpdate}
              />
            )}

            {/* 4. Playback: Autoplay */}
            {activeTab === 'autoplay' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7">
                  <AutoplaySettingsTab
                    settings={currentSettings}
                    onChange={handleUpdate}
                  />
                </div>
                <div className="lg:col-span-5">
                  <AutoplayLivePreviewWidget
                    stepDurationMs={currentSettings.autoplayDelay ?? 2000}
                    transitionDelayMs={currentSettings.transitionDelayMs ?? 500}
                    isAutoplayEnabled={currentSettings.autoplay ?? false}
                    isLoopEnabled={currentSettings.loop ?? currentSettings.autoplayLoop ?? false}
                  />
                </div>
              </div>
            )}

            {/* 5. Playback: Background Music */}
            {activeTab === 'backgroundMusic' && (
              <BackgroundMusicTab
                settings={currentSettings}
                onChange={handleUpdate}
              />
            )}

            {/* 6. Audience: Accessibility */}
            {activeTab === 'accessibility' && (
              <AccessibilitySettingsTab
                settings={currentSettings}
                onChange={handleUpdate}
              />
            )}

            {/* 7. Audience: Translations */}
            {activeTab === 'translations' && (
              <TranslationsSettingsTab
                settings={currentSettings}
                onChange={handleUpdate}
              />
            )}

            {/* 8. Sharing: Share */}
            {activeTab === 'share' && (
              <ShareSettingsTab
                settings={currentSettings}
                onChange={handleUpdate}
              />
            )}

            {/* 9. Sharing: SEO */}
            {activeTab === 'seo' && (
              <SeoSettingsTab
                settings={currentSettings}
                onChange={handleUpdate}
              />
            )}
          </main>
        </div>

        {/* Modal Footer (matches Supademo: [Save] [Close]) */}
        <div className="h-16 px-6 border-t border-border-light flex items-center justify-end gap-3 shrink-0 bg-white">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
          >
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
