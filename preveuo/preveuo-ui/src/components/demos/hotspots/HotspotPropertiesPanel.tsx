'use client';

import React from 'react';
import {
  IDemoElement,
  HotspotConfig,
  IDemoStep,
  IDemoScene,
  HotspotType,
  HotspotTextAlign,
  HotspotBorderRadius,
  HotspotWidth,
  HotspotActionType,
  IDemoChapter,
  PointerAnimationSettings,
} from '@/types/demo';
import {
  Input,
  Textarea,
  Select,
  SegmentedControl,
  Switch,
  ColorField,
  Button,
} from '@/components/ui';
import {
  SlidersHorizontal,
  Trash2,
  X,
  Save,
  Radio,
  MessageSquareText,
  Square,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { PointerStyleSelector } from './PointerStyleSelector';
import { PointerMiniPreview } from './PointerMiniPreview';
import { PRIMARY_COLOR, THEME_COLORS } from '@/lib/constants/theme';

interface HotspotPropertiesPanelProps {
  element: IDemoElement;
  steps: IDemoStep[];
  scenes: IDemoScene[];
  chapters?: IDemoChapter[];
  onUpdate: (updates: Partial<IDemoElement>) => void;
  onDelete: () => void;
  onClose: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const HotspotPropertiesPanel: React.FC<HotspotPropertiesPanelProps> = ({
  element,
  steps = [],
  scenes = [],
  chapters = [],
  onUpdate,
  onDelete,
  onClose,
  onSave,
  isSaving = false,
}) => {
  const config: HotspotConfig = element.hotspotConfig || {
    type: 'pointer',
    content: {
      text: element.content || 'Add some hotspot text here.',
      textAlign: 'left',
    },
    appearance: {
      background: element.style?.backgroundColor || PRIMARY_COLOR,
      textColor: element.style?.color || THEME_COLORS.white,
      backdrop: false,
      borderRadius: 'rounded',
      width: 'medium',
      animation: 'ping',
      pointerStyle: 'beacon',
    },
    visibility: 'always',
    navigation: {
      showNext: true,
      nextButton: {
        enabled: true,
        text: 'Next',
        background: PRIMARY_COLOR,
        textColor: 'white',
        action: 'nextStep',
      },
      backButton: {
        enabled: false,
        text: 'Skip',
        background: 'white',
        textColor: THEME_COLORS.textBody,
        action: 'previousStep',
      },
    },
  };

  const updateConfig = (patch: Partial<HotspotConfig>) => {
    const updatedConfig: HotspotConfig = {
      ...config,
      ...patch,
    };
    onUpdate({
      hotspotConfig: updatedConfig,
      content: updatedConfig.content.text,
      style: {
        ...element.style,
        backgroundColor: updatedConfig.appearance.background,
        color: updatedConfig.appearance.textColor,
      },
    });
  };

  const updateContent = (contentPatch: Partial<HotspotConfig['content']>) => {
    updateConfig({
      content: { ...config.content, ...contentPatch },
    });
  };

  const updateAppearance = (appearancePatch: Partial<HotspotConfig['appearance']>) => {
    updateConfig({
      appearance: { ...config.appearance, ...appearancePatch },
    });
  };

  const updateNavigation = (navPatch: Partial<HotspotConfig['navigation']>) => {
    updateConfig({
      navigation: { ...config.navigation, ...navPatch },
    });
  };

  const updateArea = (areaPatch: Partial<NonNullable<HotspotConfig['area']>>) => {
    updateConfig({
      area: { ...(config.area || {}), ...areaPatch },
    });
  };

  const activeToolType: HotspotType = config.type || 'pointer';

  const effectivePointerColor =
    config.appearance.pointerColor ||
    (config.appearance.background &&
    !['#0f0f1a', '#121214', '#000000', '#1f2937', '#111827'].includes(
      config.appearance.background.toLowerCase()
    )
      ? config.appearance.background
      : PRIMARY_COLOR);

  return (
    <aside className="w-[360px] border-l border-border-default bg-white flex flex-col shrink-0 h-full overflow-hidden select-none">
      {/* Header */}
      <div className="h-14 px-5 border-b border-border-light flex items-center justify-between shrink-0 bg-canvas">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-purple" />
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-heading">
            Hotspot Settings
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted hover:text-heading hover:bg-white transition-colors cursor-pointer"
          title="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Scrollable Inspector Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-6">
        {/* =========================================================================
            TOOL TYPE SWITCHER (Supademo 3 styles: Pointer, Callout, Area)
            ========================================================================= */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
              Hotspot Style
            </span>
            <span className="text-[10px] text-muted">
              {activeToolType === 'pointer'
                ? 'Pinpoint Marker'
                : activeToolType === 'callout'
                ? 'Floating Card'
                : 'Area Highlight'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {/* 1. Pointer (Pinpoint) Button */}
            <button
              type="button"
              onClick={() => {
                if (activeToolType === 'area') {
                  const areaW = element.position?.width || 32;
                  const areaH = element.position?.height || 22;
                  const newX = Math.max(1, Math.min(99, element.position.x + areaW / 2));
                  const newY = Math.max(1, Math.min(99, element.position.y + areaH / 2));
                  onUpdate({
                    position: {
                      ...element.position,
                      x: Math.round(newX * 10) / 10,
                      y: Math.round(newY * 10) / 10,
                    },
                    hotspotConfig: {
                      ...config,
                      type: 'pointer',
                    },
                  });
                } else {
                  updateConfig({ type: 'pointer' });
                }
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeToolType === 'pointer'
                  ? 'bg-white text-heading font-bold shadow-xs border border-slate-200 ring-1 ring-brand-purple/20'
                  : 'text-body hover:text-heading hover:bg-white/70'
              }`}
            >
              <Radio className={`w-4 h-4 mb-1 ${activeToolType === 'pointer' ? 'text-brand-purple' : 'text-slate-500'}`} />
              <span className="text-[11px] font-semibold">Pointer</span>
              <span className="text-[9px] text-muted">Pinpoint</span>
            </button>

            {/* 2. Callout Button */}
            <button
              type="button"
              onClick={() => {
                if (activeToolType === 'area') {
                  const areaW = element.position?.width || 32;
                  const areaH = element.position?.height || 22;
                  const newX = Math.max(1, Math.min(99, element.position.x + areaW / 2));
                  const newY = Math.max(1, Math.min(99, element.position.y + areaH / 2));
                  onUpdate({
                    position: {
                      ...element.position,
                      x: Math.round(newX * 10) / 10,
                      y: Math.round(newY * 10) / 10,
                    },
                    hotspotConfig: {
                      ...config,
                      type: 'callout',
                    },
                  });
                } else {
                  updateConfig({ type: 'callout' });
                }
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeToolType === 'callout'
                  ? 'bg-white text-heading font-bold shadow-xs border border-slate-200 ring-1 ring-brand-purple/20'
                  : 'text-body hover:text-heading hover:bg-white/70'
              }`}
            >
              <MessageSquareText className={`w-4 h-4 mb-1 ${activeToolType === 'callout' ? 'text-brand-purple' : 'text-slate-500'}`} />
              <span className="text-[11px] font-semibold">Callout</span>
              <span className="text-[9px] text-muted">Floating</span>
            </button>

            {/* 3. Area Button */}
            <button
              type="button"
              onClick={() => {
                if (activeToolType !== 'area') {
                  const areaW = element.position?.width || 32;
                  const areaH = element.position?.height || 22;
                  const newX = Math.max(1, Math.min(99 - areaW, element.position.x - areaW / 2));
                  const newY = Math.max(1, Math.min(99 - areaH, element.position.y - areaH / 2));
                  onUpdate({
                    position: {
                      ...element.position,
                      x: Math.round(newX * 10) / 10,
                      y: Math.round(newY * 10) / 10,
                      width: areaW,
                      height: areaH,
                    },
                    hotspotConfig: {
                      ...config,
                      type: 'area',
                      area: config.area || {
                        fillColor: config.appearance.background || PRIMARY_COLOR,
                        fillOpacity: 0.14,
                        borderColor: config.appearance.background || PRIMARY_COLOR,
                        borderWidth: 2,
                        borderStyle: 'solid',
                        borderRadius: 12,
                      },
                    },
                  });
                }
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeToolType === 'area'
                  ? 'bg-white text-heading font-bold shadow-xs border border-slate-200 ring-1 ring-brand-purple/20'
                  : 'text-body hover:text-heading hover:bg-white/70'
              }`}
            >
              <Square className={`w-4 h-4 mb-1 ${activeToolType === 'area' ? 'text-brand-purple' : 'text-slate-500'}`} />
              <span className="text-[11px] font-semibold">Area</span>
              <span className="text-[9px] text-muted">Region</span>
            </button>
          </div>
        </section>

        {/* =========================================================================
            TOOL-SPECIFIC CONTROLS
            ========================================================================= */}

        {/* 1. POINTER SPECIFIC: Pin Appearance & Coordinates */}
        {activeToolType === 'pointer' && (
          <>
            {/* Visual Pointer Style */}
            <section className="space-y-3.5 pt-3 border-t border-border-light">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
                Pointer Appearance
              </span>

              <PointerStyleSelector
                value={config.appearance.pointerStyle || 'beacon'}
                onChange={(val) => updateAppearance({ pointerStyle: val })}
              />

              <PointerMiniPreview
                style={config.appearance.pointerStyle || 'beacon'}
                color={effectivePointerColor}
                size={config.appearance.pointerAnimation?.size || 'md'}
                animationSettings={config.appearance.pointerAnimation}
                onAnimationChange={(animUpdates: Partial<PointerAnimationSettings>) => {
                  updateAppearance({
                    pointerAnimation: {
                      ...(config.appearance.pointerAnimation || {}),
                      ...animUpdates,
                    },
                  });
                }}
              />

              <ColorField
                label="Pointer Accent Color"
                value={effectivePointerColor}
                onChange={(color) => updateAppearance({ pointerColor: color })}
                presetColors={['#5B5CE2', '#6366F1', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6', '#FFFFFF']}
              />
            </section>
          </>
        )}

        {/* 2. AREA SPECIFIC: Region Geometry & Border Styling */}
        {activeToolType === 'area' && (
          <>
            <section className="space-y-3.5 pt-3 border-t border-border-light">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
                Region Highlight Geometry
              </span>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  step="0.5"
                  min={5}
                  max={100}
                  label="Width (%)"
                  value={Math.round((element.position.width || 30) * 10) / 10}
                  onChange={(e) => {
                    const parsed = parseFloat(e.target.value);
                    if (!isNaN(parsed)) {
                      onUpdate({
                        position: { ...element.position, width: Math.max(5, Math.min(100, parsed)) },
                      });
                    }
                  }}
                />
                <Input
                  type="number"
                  step="0.5"
                  min={5}
                  max={100}
                  label="Height (%)"
                  value={Math.round((element.position.height || 20) * 10) / 10}
                  onChange={(e) => {
                    const parsed = parseFloat(e.target.value);
                    if (!isNaN(parsed)) {
                      onUpdate({
                        position: { ...element.position, height: Math.max(5, Math.min(100, parsed)) },
                      });
                    }
                  }}
                />
              </div>

              <ColorField
                label="Highlight & Border Color"
                value={config.area?.borderColor || config.appearance.background || PRIMARY_COLOR}
                onChange={(color) => {
                  updateAppearance({ background: color });
                  updateArea({ borderColor: color, fillColor: color });
                }}
                presetColors={['#5B5CE2', '#6366F1', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6']}
              />

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
                  Fill Tint Opacity
                </label>
                <SegmentedControl
                  value={String(config.area?.fillOpacity ?? 0.14)}
                  onChange={(val) => updateArea({ fillOpacity: parseFloat(val) })}
                  options={[
                    { value: '0.08', label: 'Subtle' },
                    { value: '0.14', label: 'Medium' },
                    { value: '0.25', label: 'Solid' },
                  ]}
                />
              </div>
            </section>
          </>
        )}

        {/* =========================================================================
            TOOLTIP CARD CONTENT (Visible across ALL 3 tools: Pointer, Callout, Area)
            ========================================================================= */}
        <section className="space-y-3.5 pt-3 border-t border-border-light">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
            Tooltip Text & Content
          </span>

          <Input
            label="Title / Main Text"
            value={
              config.content.title !== undefined
                ? config.content.title
                : config.content.text?.includes('\n')
                ? config.content.text.split('\n')[0]
                : config.content.text || ''
            }
            placeholder="Add some hotspot text here."
            onChange={(e) => {
              const newTitle = e.target.value;
              const currentDesc = config.content.description || '';
              updateContent({
                title: newTitle,
                text: currentDesc ? `${newTitle}\n${currentDesc}` : newTitle,
              });
            }}
          />

          <Textarea
            label="Description (Optional)"
            rows={2}
            placeholder="Additional guidance for viewers..."
            value={
              config.content.description !== undefined
                ? config.content.description
                : config.content.text?.includes('\n')
                ? config.content.text.split('\n').slice(1).join('\n')
                : ''
            }
            onChange={(e) => {
              const newDesc = e.target.value;
              const currentTitle = config.content.title || config.content.text || '';
              updateContent({
                description: newDesc,
                text: `${currentTitle}\n${newDesc}`,
              });
            }}
          />

          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
              Text Alignment
            </label>
            <SegmentedControl
              value={config.content.textAlign || 'left'}
              onChange={(val) => updateContent({ textAlign: val as HotspotTextAlign })}
              options={[
                { value: 'left', label: 'Left', icon: <AlignLeft className="w-3.5 h-3.5" /> },
                { value: 'center', label: 'Center', icon: <AlignCenter className="w-3.5 h-3.5" /> },
                { value: 'right', label: 'Right', icon: <AlignRight className="w-3.5 h-3.5" /> },
              ]}
            />
          </div>
        </section>

        {/* =========================================================================
            TOOLTIP CARD APPEARANCE (Visible across ALL 3 tools)
            ========================================================================= */}
        <section className="space-y-3.5 pt-3 border-t border-border-light">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
            Tooltip Appearance
          </span>

          <ColorField
            label="Card Background Color"
            value={config.appearance.background || PRIMARY_COLOR}
            onChange={(color) => updateAppearance({ background: color })}
            presetColors={['#5B5CE2', '#0f0f1a', '#1e293b', '#4338ca', '#047857', '#be123c', '#ffffff']}
          />

          <ColorField
            label="Text Color"
            value={config.appearance.textColor || '#ffffff'}
            onChange={(color) => updateAppearance({ textColor: color })}
            presetColors={['#ffffff', '#0f0f1a', '#e2e8f0', '#f8fafc']}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
                Card Width
              </label>
              <SegmentedControl
                value={
                  config.appearance.customWidth === 200
                    ? 'small'
                    : config.appearance.customWidth === 320
                    ? 'large'
                    : config.appearance.customWidth === 244
                    ? 'medium'
                    : config.appearance.customWidth
                    ? 'custom'
                    : config.appearance.width || 'medium'
                }
                onChange={(val) =>
                  updateAppearance({
                    width: val === 'custom' ? 'medium' : (val as HotspotWidth),
                    customWidth: val === 'small' ? 200 : val === 'large' ? 320 : val === 'custom' ? config.appearance.customWidth : 244,
                  })
                }
                options={[
                  { value: 'small', label: '200px' },
                  { value: 'medium', label: '244px' },
                  { value: 'large', label: '320px' },
                  ...(config.appearance.customWidth && ![200, 244, 320].includes(config.appearance.customWidth)
                    ? [{ value: 'custom', label: `${config.appearance.customWidth}px` }]
                    : []),
                ]}
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
                Card Height
              </label>
              <SegmentedControl
                value={config.appearance.customHeight ? 'custom' : 'auto'}
                onChange={(val) =>
                  updateAppearance({
                    customHeight: val === 'auto' ? undefined : config.appearance.customHeight || 140,
                  })
                }
                options={[
                  { value: 'auto', label: 'Auto (Fit)' },
                  { value: 'custom', label: config.appearance.customHeight ? `${config.appearance.customHeight}px` : 'Fixed (140px)' },
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
              Border Radius
            </label>
            <SegmentedControl
              value={config.appearance.borderRadius || 'rounded'}
              onChange={(val) => updateAppearance({ borderRadius: val as HotspotBorderRadius })}
              options={[
                { value: 'square', label: 'Square' },
                { value: 'rounded', label: 'Rounded' },
                { value: 'pill', label: 'Pill' },
              ]}
            />
          </div>

          <Switch
            label="Backdrop Dimming"
            description="Darken scene to spotlight this hotspot"
            checked={config.appearance.backdrop}
            onChange={(checked) => updateAppearance({ backdrop: checked })}
          />
        </section>

        {/* =========================================================================
            NAVIGATION & ACTION
            ========================================================================= */}
        <section className="space-y-3.5 pt-3 border-t border-border-light">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
            Navigation Actions
          </span>

          <Switch
            label="Show Next Button"
            description="Render the forward arrow button inside the card"
            checked={config.navigation.showNext}
            onChange={(checked) => updateNavigation({ showNext: checked })}
          />

          <Select
            label="Next Button Action"
            value={config.navigation.nextButton?.action || 'nextStep'}
            onChange={(e) =>
              updateNavigation({
                nextButton: {
                  enabled: true,
                  text: 'Next',
                  background: PRIMARY_COLOR,
                  textColor: 'white',
                  action: e.target.value as HotspotActionType,
                  target: config.navigation.nextButton?.target,
                },
              })
            }
            options={[
              { value: 'nextStep', label: 'Go to Next Step' },
              { value: 'goToStep', label: 'Go to Specific Step...' },
              { value: 'goToScene', label: 'Go to Specific Scene...' },
              { value: 'goToChapter', label: 'Go to Specific Chapter...' },
              { value: 'externalUrl', label: 'Open External URL...' },
            ]}
          />

          {config.navigation.nextButton?.action === 'goToStep' && (
            <Select
              label="Target Step"
              value={config.navigation.nextButton?.target || ''}
              onChange={(e) =>
                updateNavigation({
                  nextButton: {
                    ...config.navigation.nextButton!,
                    target: e.target.value,
                  },
                })
              }
              options={steps.map((st, i) => ({
                value: st.id || st._id || '',
                label: `Step ${i + 1}: ${st.title || 'Untitled'}`,
              }))}
            />
          )}

          {config.navigation.nextButton?.action === 'goToScene' && (
            <Select
              label="Target Scene"
              value={config.navigation.nextButton?.target || ''}
              onChange={(e) =>
                updateNavigation({
                  nextButton: {
                    ...config.navigation.nextButton!,
                    target: e.target.value,
                  },
                })
              }
              options={scenes.map((sc, i) => ({
                value: sc.id || sc._id || '',
                label: `Scene ${i + 1}: ${sc.name || 'Untitled'}`,
              }))}
            />
          )}

          {config.navigation.nextButton?.action === 'goToChapter' && (
            <Select
              label="Target Chapter"
              value={config.navigation.nextButton?.target || ''}
              onChange={(e) =>
                updateNavigation({
                  nextButton: {
                    ...config.navigation.nextButton!,
                    target: e.target.value,
                  },
                })
              }
              options={chapters.map((ch, i) => ({
                value: ch.id || ch._id || '',
                label: `Chapter ${i + 1}: ${ch.title || 'Untitled'}`,
              }))}
            />
          )}

          {config.navigation.nextButton?.action === 'externalUrl' && (
            <Input
              label="Target URL"
              value={config.navigation.nextButton?.target || ''}
              placeholder="https://example.com"
              onChange={(e) =>
                updateNavigation({
                  nextButton: {
                    ...config.navigation.nextButton!,
                    target: e.target.value,
                  },
                })
              }
            />
          )}

          <Switch
            label="Show Skip / Back Button"
            description="Optional secondary action on the card"
            checked={config.navigation.backButton?.enabled ?? false}
            onChange={(checked) =>
              updateNavigation({
                backButton: {
                  enabled: checked,
                  text: 'Skip',
                  background: 'white',
                  textColor: THEME_COLORS.textBody,
                  action: 'previousStep',
                },
              })
            }
          />
        </section>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border-light bg-canvas flex items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save
          </Button>
        </div>
      </div>
    </aside>
  );
};
