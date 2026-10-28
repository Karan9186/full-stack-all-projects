'use client';

import React from 'react';
import {
  IDemoElement,
  HotspotConfig,
  IDemoStep,
  IDemoScene,
  HotspotType,
  HotspotPointerStyle,
  HotspotTextAlign,
  HotspotBorderRadius,
  HotspotWidth,
  HotspotAnimation,
  HotspotVisibility,
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
  MousePointer,
  HelpCircle,
  Square,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Radio,
  Pointer,
  Target,
  Hash,
} from 'lucide-react';
import { PointerStyleSelector } from './PointerStyleSelector';
import { PointerMiniPreview } from './PointerMiniPreview';
import { PRIMARY_COLOR, THEME_COLORS, PRESET_HOTSPOT_COLORS, PRESET_TEXT_COLORS } from '@/lib/constants/theme';

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
    },
    visibility: 'always',
    navigation: {
      showNext: true,
      nextButton: {
        enabled: true,
        text: 'Continue',
        background: THEME_COLORS.white,
        textColor: PRIMARY_COLOR,
        action: 'nextStep',
      },
      backButton: {
        enabled: false,
        text: 'Back',
        background: THEME_COLORS.white,
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

  const isArea = config.type === 'area';

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

      {/* Grouped Properties List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-6">
        {/* 1. CONTENT SECTION */}
        <section className="space-y-3.5">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
            Content
          </span>

          <Input
            label="Badge Label (Optional)"
            placeholder="e.g. STEP 2 OF 12"
            value={config.content.badge || ''}
            onChange={(e) => updateContent({ badge: e.target.value })}
          />

          <Input
            label="Headline / Title"
            placeholder="e.g. Everything, at a glance"
            value={
              config.content.title !== undefined
                ? config.content.title
                : config.content.text?.includes('\n')
                ? config.content.text.split('\n')[0]
                : config.content.text || ''
            }
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
            label="Description"
            rows={3}
            placeholder="e.g. See the metrics that matter and spot changes before they become blockers."
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
            <label className="block text-[12.5px] font-medium text-gray-700 mb-1.5">
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

        {/* 2. APPEARANCE SECTION */}
        <section className="space-y-4 pt-4 border-t border-border-light">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
            Appearance
          </span>

          <div>
            <label className="block text-[12.5px] font-medium text-gray-700 mb-1.5">
              Hotspot Style
            </label>
            <SegmentedControl
              value={config.type}
              onChange={(val) => updateConfig({ type: val as HotspotType })}
              options={[
                { value: 'pointer', label: 'Pointer', icon: <MousePointer className="w-3.5 h-3.5" /> },
                { value: 'callout', label: 'Callout', icon: <HelpCircle className="w-3.5 h-3.5" /> },
                { value: 'area', label: 'Area', icon: <Square className="w-3.5 h-3.5" /> },
              ]}
            />
          </div>

          {config.type === 'pointer' && (
            <div className="space-y-3.5">
              <PointerStyleSelector
                value={config.appearance.pointerStyle || 'ripple'}
                onChange={(val) => updateAppearance({ pointerStyle: val })}
              />

              <PointerMiniPreview
                style={config.appearance.pointerStyle || 'ripple'}
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
            </div>
          )}

          <ColorField
            label="Tooltip Background Color"
            value={config.appearance.background || THEME_COLORS.bgDark}
            onChange={(color) => updateAppearance({ background: color })}
            presetColors={PRESET_HOTSPOT_COLORS as unknown as string[]}
          />

          <ColorField
            label="Text Color"
            value={config.appearance.textColor || THEME_COLORS.white}
            onChange={(color) => updateAppearance({ textColor: color })}
            presetColors={PRESET_TEXT_COLORS as unknown as string[]}
          />

          <Switch
            label="Backdrop Dimming"
            description="Darken scene to highlight this hotspot"
            checked={config.appearance.backdrop}
            onChange={(checked) => updateAppearance({ backdrop: checked })}
          />

          <div>
            <label className="block text-[12.5px] font-medium text-gray-700 mb-1.5">
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

          <div>
            <label className="block text-[12.5px] font-medium text-gray-700 mb-1.5">
              Animation
            </label>
            <SegmentedControl
              value={config.appearance.animation || 'ping'}
              onChange={(val) => updateAppearance({ animation: val as HotspotAnimation })}
              options={[
                { value: 'none', label: 'None' },
                { value: 'ping', label: 'Ping' },
                { value: 'pulse', label: 'Pulse' },
                { value: 'bounce', label: 'Bounce' },
              ]}
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-gray-700 mb-1.5">
              Visibility
            </label>
            <Select
              value={config.visibility || 'always'}
              onChange={(e) => updateConfig({ visibility: e.target.value as HotspotVisibility })}
              options={[
                { value: 'always', label: 'Always Visible' },
                { value: 'onHover', label: 'Show On Hover' },
                { value: 'onClick', label: 'Show On Click' },
                { value: 'afterDelay', label: 'Show After Delay (2s)' },
              ]}
            />
          </div>

          {!isArea && (
            <div>
              <label className="block text-[12.5px] font-medium text-gray-700 mb-1.5">
                Callout Width
              </label>
              <SegmentedControl
                value={config.appearance.width || 'medium'}
                onChange={(val) => updateAppearance({ width: val as HotspotWidth })}
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
              />
            </div>
          )}
        </section>

        {/* 3. POSITION & ANCHOR SECTION */}
        <section className="space-y-3.5 pt-4 border-t border-border-light">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
              Position & Anchor
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple text-[10.5px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
              Anchor Point
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              step="0.5"
              min={0}
              max={100}
              label="Anchor X (%)"
              value={Math.round(element.position.x * 10) / 10}
              onChange={(e) => {
                const parsed = parseFloat(e.target.value);
                if (!isNaN(parsed)) {
                  const clamped = Math.max(0, Math.min(100, Math.round(parsed * 10) / 10));
                  onUpdate({
                    position: { ...element.position, x: clamped },
                  });
                }
              }}
              helperText="0% left → 100% right"
            />
            <Input
              type="number"
              step="0.5"
              min={0}
              max={100}
              label="Anchor Y (%)"
              value={Math.round(element.position.y * 10) / 10}
              onChange={(e) => {
                const parsed = parseFloat(e.target.value);
                if (!isNaN(parsed)) {
                  const clamped = Math.max(0, Math.min(100, Math.round(parsed * 10) / 10));
                  onUpdate({
                    position: { ...element.position, y: clamped },
                  });
                }
              }}
              helperText="0% top → 100% bottom"
            />
          </div>

          {/* Anchor Interpretation Info */}
          <div className="p-2.5 bg-light rounded-xl border border-border-default flex items-center justify-between text-xs text-body">
            <span className="font-medium">Anchor Interpretation</span>
            <span className="font-bold text-heading bg-white px-2 py-0.5 rounded border border-border-default shadow-2xs">
              {isArea ? 'Top-Left Origin' : '● Center Anchor'}
            </span>
          </div>

          {isArea && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Input
                type="number"
                min={5}
                max={100}
                label="Width (%)"
                value={element.position.width || 30}
                onChange={(e) =>
                  onUpdate({
                    position: {
                      ...element.position,
                      width: Math.max(5, Math.min(100, Number(e.target.value))),
                    },
                  })
                }
              />
              <Input
                type="number"
                min={5}
                max={100}
                label="Height (%)"
                value={element.position.height || 20}
                onChange={(e) =>
                  onUpdate({
                    position: {
                      ...element.position,
                      height: Math.max(5, Math.min(100, Number(e.target.value))),
                    },
                  })
                }
              />
            </div>
          )}
        </section>

        {/* 4. NAVIGATION SECTION */}
        <section className="space-y-4 pt-4 border-t border-border-light">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
            Navigation Buttons
          </span>

          {/* Show Next Toggle */}
          <Switch
            label="Show Next Button"
            checked={config.navigation.showNext}
            onChange={(checked) => updateNavigation({ showNext: checked })}
          />

          {/* Next Button Config */}
          {config.navigation.showNext && (
            <div className="p-3.5 bg-canvas rounded-2xl border border-border-default space-y-3">
              <span className="text-xs font-medium text-heading block">
                Next Button Settings
              </span>

              <Input
                label="Button Text"
                value={config.navigation.nextButton?.text || 'Continue'}
                onChange={(e) =>
                  updateNavigation({
                    nextButton: {
                      ...config.navigation.nextButton,
                      enabled: true,
                      background: config.navigation.nextButton?.background || THEME_COLORS.white,
                      textColor: config.navigation.nextButton?.textColor || PRIMARY_COLOR,
                      text: e.target.value,
                      action: config.navigation.nextButton?.action || 'nextStep',
                    },
                  })
                }
              />

              <div className="grid grid-cols-2 gap-2">
                <ColorField
                  label="Button Bg"
                  value={config.navigation.nextButton?.background || THEME_COLORS.white}
                  onChange={(color) =>
                    updateNavigation({
                      nextButton: {
                        ...config.navigation.nextButton!,
                        background: color,
                      },
                    })
                  }
                  presetColors={[THEME_COLORS.white, PRIMARY_COLOR, THEME_COLORS.bgDark]}
                />
                <ColorField
                  label="Button Text"
                  value={config.navigation.nextButton?.textColor || PRIMARY_COLOR}
                  onChange={(color) =>
                    updateNavigation({
                      nextButton: {
                        ...config.navigation.nextButton!,
                        textColor: color,
                      },
                    })
                  }
                  presetColors={[PRIMARY_COLOR, THEME_COLORS.white, THEME_COLORS.bgDark]}
                />
              </div>

              <Select
                label="Button Action"
                value={config.navigation.nextButton?.action || 'nextStep'}
                onChange={(e) =>
                  updateNavigation({
                    nextButton: {
                      ...config.navigation.nextButton!,
                      action: e.target.value as HotspotActionType,
                    },
                  })
                }
                options={[
                  { value: 'nextStep', label: 'Next Step' },
                  { value: 'goToStep', label: 'Go to Step...' },
                  { value: 'goToChapter', label: 'Go to Chapter...' },
                  { value: 'goToScene', label: 'Go to Scene...' },
                  { value: 'externalUrl', label: 'External URL...' },
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
                    label: `Chapter ${i + 1}: ${ch.title}`,
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
                    label: `Scene ${i + 1}: ${sc.name}`,
                  }))}
                />
              )}

              {config.navigation.nextButton?.action === 'externalUrl' && (
                <Input
                  label="Target External URL"
                  value={config.navigation.nextButton?.target || ''}
                  onChange={(e) =>
                    updateNavigation({
                      nextButton: {
                        ...config.navigation.nextButton!,
                        target: e.target.value,
                      },
                    })
                  }
                  placeholder="https://example.com"
                />
              )}
            </div>
          )}

          {/* Back Button Config */}
          <div className="p-3.5 bg-canvas rounded-2xl border border-border-default space-y-3">
            <Switch
              label="Display Back Button"
              checked={config.navigation.backButton?.enabled ?? false}
              onChange={(checked) =>
                updateNavigation({
                  backButton: {
                    ...config.navigation.backButton,
                    enabled: checked,
                    text: config.navigation.backButton?.text || 'Back',
                    background: config.navigation.backButton?.background || THEME_COLORS.white,
                    textColor: config.navigation.backButton?.textColor || THEME_COLORS.textBody,
                    action: config.navigation.backButton?.action || 'previousStep',
                  },
                })
              }
            />

            {config.navigation.backButton?.enabled && (
              <>
                <Input
                  label="Back Button Text"
                  value={config.navigation.backButton?.text || 'Back'}
                  onChange={(e) =>
                    updateNavigation({
                      backButton: {
                        ...config.navigation.backButton!,
                        text: e.target.value,
                      },
                    })
                  }
                />

                <Select
                  label="Back Button Action"
                  value={config.navigation.backButton?.action || 'previousStep'}
                  onChange={(e) =>
                    updateNavigation({
                      backButton: {
                        ...config.navigation.backButton!,
                        action: e.target.value as HotspotActionType,
                      },
                    })
                  }
                  options={[
                    { value: 'previousStep', label: 'Previous Step' },
                    { value: 'goToStep', label: 'Go to Step...' },
                    { value: 'goToChapter', label: 'Go to Chapter...' },
                    { value: 'goToScene', label: 'Go to Scene...' },
                    { value: 'externalUrl', label: 'External URL...' },
                  ]}
                />

                {config.navigation.backButton?.action === 'goToChapter' && (
                  <Select
                    label="Target Chapter"
                    value={config.navigation.backButton?.target || ''}
                    onChange={(e) =>
                      updateNavigation({
                        backButton: {
                          ...config.navigation.backButton!,
                          target: e.target.value,
                        },
                      })
                    }
                    options={chapters.map((ch, i) => ({
                      value: ch.id || ch._id || '',
                      label: `Chapter ${i + 1}: ${ch.title}`,
                    }))}
                  />
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {/* Footer Action Buttons */}
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
