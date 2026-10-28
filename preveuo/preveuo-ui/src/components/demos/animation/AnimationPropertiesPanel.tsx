'use client';

import React, { useState } from 'react';
import {
  IDemoStep,
  IDemoElement,
  DemoSettings,
  ZoomPanConfig,
  ZoomPanAnimationType,
  ZoomPanEasing,
  ZoomPanEndBehavior,
} from '@/types/demo';
import {
  DEFAULT_ZOOM_PAN_CONFIG,
  ZOOM_LEVEL_PRESETS,
  EASING_OPTIONS,
  ANIMATION_TYPES,
  END_BEHAVIORS,
} from '@/lib/utils/cameraTransform';
import {
  Play,
  RotateCcw,
  Trash2,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Link as LinkIcon,
  Clock,
  Sparkles,
  Sliders,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';

interface AnimationPropertiesPanelProps {
  currentStep?: IDemoStep;
  demoSettings: DemoSettings;
  stepElements: IDemoElement[];
  activeSection?: 'zoomPan' | 'autoplay';
  onSectionChange?: (section: 'zoomPan' | 'autoplay') => void;
  onUpdateStep: (updates: Partial<IDemoStep>) => void;
  onUpdateDemoSettings: (settings: Partial<DemoSettings>) => void;
  onPreviewAnimation?: () => void;
  onResetCamera?: () => void;
  isPreviewing?: boolean;
}

export const AnimationPropertiesPanel: React.FC<AnimationPropertiesPanelProps> = ({
  currentStep,
  demoSettings,
  stepElements,
  activeSection,
  onSectionChange,
  onUpdateStep,
  onUpdateDemoSettings,
  onPreviewAnimation,
  onResetCamera,
  isPreviewing = false,
}) => {
  // Top-level section switcher: 'zoomPan' | 'autoplay' (controlled or internal)
  const [internalSection, setInternalSection] = useState<'zoomPan' | 'autoplay'>('zoomPan');
  const section = activeSection !== undefined ? activeSection : internalSection;
  const setSection = (nextSec: 'zoomPan' | 'autoplay') => {
    setInternalSection(nextSec);
    onSectionChange?.(nextSec);
  };
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Active step's zoomPan config or fallback default
  const zoomConfig: ZoomPanConfig = currentStep?.zoomPan || {
    ...DEFAULT_ZOOM_PAN_CONFIG,
    enabled: false,
  };

  const isLinkedHotspotMissing = Boolean(
    zoomConfig.linkedHotspotId &&
      !stepElements.some(
        (el) => el.id === zoomConfig.linkedHotspotId || (el as any)._id === zoomConfig.linkedHotspotId
      )
  );

  const handleUpdateZoomPan = (updates: Partial<ZoomPanConfig>) => {
    const updated: ZoomPanConfig = {
      ...zoomConfig,
      ...updates,
    };
    onUpdateStep({
      zoomPan: updated,
    });
  };

  const handleToggleZoomPan = (enabled: boolean) => {
    handleUpdateZoomPan({ enabled });
  };

  const handleRemoveZoomPan = () => {
    onUpdateStep({
      zoomPan: {
        ...DEFAULT_ZOOM_PAN_CONFIG,
        enabled: false,
      },
    });
    onResetCamera?.();
  };

  const handleLinkHotspot = (hotspotId: string) => {
    if (!hotspotId) {
      handleUpdateZoomPan({ linkedHotspotId: null });
      return;
    }
    const found = stepElements.find((el) => el.id === hotspotId || (el as any)._id === hotspotId);
    if (found) {
      handleUpdateZoomPan({
        linkedHotspotId: hotspotId,
        focusRegion: {
          x: Math.round(Math.max(0, Math.min(100 - (zoomConfig.focusRegion?.width || 60), found.position.x - (zoomConfig.focusRegion?.width || 60) / 2)) * 10) / 10,
          y: Math.round(Math.max(0, Math.min(100 - (zoomConfig.focusRegion?.height || 50), found.position.y - (zoomConfig.focusRegion?.height || 50) / 2)) * 10) / 10,
          width: zoomConfig.focusRegion?.width || 60,
          height: zoomConfig.focusRegion?.height || 50,
        },
        focusPoint: {
          x: Math.round(found.position.x * 10) / 10,
          y: Math.round(found.position.y * 10) / 10,
        },
      });
    }
  };

  const hotspotsInStep = stepElements.filter(
    (el) => el.type === 'hotspot' || Boolean(el.hotspotConfig)
  );

  return (
    <div className="space-y-5 animate-fade-in text-heading">
      {/* 1. Header & Segmented Tab Switcher */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-sm font-bold text-heading">Animation Settings</h3>
          </div>
          {zoomConfig.enabled && section === 'zoomPan' && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
              Active
            </span>
          )}
        </div>

        {/* Section Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-border-light rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSection('zoomPan')}
            className={`py-1.5 rounded-lg transition-all cursor-pointer ${
              section === 'zoomPan'
                ? 'bg-white text-brand-purple shadow-xs'
                : 'text-body hover:text-heading'
            }`}
          >
            Zoom & Pan
          </button>
          <button
            type="button"
            onClick={() => setSection('autoplay')}
            className={`py-1.5 rounded-lg transition-all cursor-pointer ${
              section === 'autoplay'
                ? 'bg-white text-brand-purple shadow-xs'
                : 'text-body hover:text-heading'
            }`}
          >
            Autoplay
          </button>
        </div>
      </div>

      {/* Target Step Context Card */}
      <div className="flex items-center justify-between p-2.5 bg-light rounded-xl border border-border-default">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-brand-purple">
            Target Step
          </div>
          <div className="text-xs font-bold text-heading truncate">
            {currentStep?.title || 'Walkthrough Step'}
          </div>
        </div>
        <div className="text-[10px] font-semibold text-body bg-white px-2 py-0.5 rounded-lg border border-border-default shrink-0">
          Step {((currentStep?.order ?? 0) + 1)}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. SECTION: ZOOM & PAN                                     */}
      {/* ========================================================= */}
      {section === 'zoomPan' && (
        <div className="space-y-4">
          {/* Enable Toggle Card */}
          <div
            onClick={() => handleToggleZoomPan(!zoomConfig.enabled)}
            className="p-3.5 bg-light hover:bg-brand-purple/10 rounded-2xl border border-border-default cursor-pointer transition-colors"
          >
            <Checkbox
              id="enable-zoom-pan"
              label={<span className="text-xs font-bold text-heading">Enable Zoom & Pan</span>}
              description="Cinematic camera focus smoothly magnifying onto key product elements."
              checked={zoomConfig.enabled}
              onChange={(e) => {
                e.stopPropagation();
                handleToggleZoomPan(e.target.checked);
              }}
            />
          </div>

          {zoomConfig.enabled && (
            <>
              {/* Animation Type */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-heading">Animation Type</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {ANIMATION_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => handleUpdateZoomPan({ animationType: t.value })}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        zoomConfig.animationType === t.value
                          ? 'border-brand-purple bg-brand-purple/5 text-brand-purple font-bold shadow-xs'
                          : 'border-border-default bg-white text-gray-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-[11.5px] font-semibold leading-tight">{t.label}</div>
                      <div className="text-[10px] text-body mt-0.5 leading-snug">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom Level Presets & Slider */}
              <div className="space-y-2 p-3 bg-canvas rounded-2xl border border-border-default">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-semibold text-heading">Target Zoom Level</label>
                  <span className="text-xs font-mono font-bold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-md">
                    {(zoomConfig.zoomLevel || 1.5).toFixed(2)}×
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-1.5">
                  {ZOOM_LEVEL_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => handleUpdateZoomPan({ zoomLevel: p.value })}
                      className={`flex-1 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                        Math.abs((zoomConfig.zoomLevel || 1.5) - p.value) < 0.04
                          ? 'bg-brand-purple text-white shadow-xs'
                          : 'bg-white text-gray-600 border border-border-default hover:border-brand-purple'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.05"
                  value={zoomConfig.zoomLevel || 1.5}
                  onChange={(e) => handleUpdateZoomPan({ zoomLevel: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-border-default rounded-lg appearance-none cursor-pointer accent-brand-purple"
                />
              </div>

              {/* Canvas Focus Point & Hotspot Link */}
              <div className="space-y-2.5 p-3 bg-canvas rounded-2xl border border-border-default">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-heading">
                    <Crosshair className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Camera Focus Point</span>
                  </div>
                  <span className="text-[11px] font-mono text-body">
                    X: {zoomConfig.focusPoint.x}% Y: {zoomConfig.focusPoint.y}%
                  </span>
                </div>

                {/* Missing Linked Hotspot Warning Banner */}
                {isLinkedHotspotMissing && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col gap-1.5 animate-fade-in">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Linked Hotspot Missing</span>
                    </div>
                    <p className="text-[11px] text-amber-700 leading-snug">
                      The linked hotspot was deleted. Camera will use the coordinates ({zoomConfig.focusPoint.x}%, {zoomConfig.focusPoint.y}%) or you can unlink to pick a new focal target.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleUpdateZoomPan({ linkedHotspotId: null })}
                      className="self-start px-2 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-[11px] font-semibold text-amber-800 transition-colors cursor-pointer shadow-2xs"
                    >
                      Reset Link to Custom Point
                    </button>
                  </div>
                )}

                {/* Link to existing hotspot */}
                {hotspotsInStep.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-body flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-brand-purple" />
                      <span>Link Focal Target to Hotspot</span>
                    </label>
                    <select
                      value={zoomConfig.linkedHotspotId || ''}
                      onChange={(e) => handleLinkHotspot(e.target.value)}
                      className="w-full text-xs py-1.5 px-2.5 rounded-xl border border-border-default bg-white text-heading focus:outline-none focus:border-brand-purple"
                    >
                      <option value="">Custom Point (Drag on Canvas)</option>
                      {hotspotsInStep.map((h, i) => (
                        <option key={h.id || (h as any)._id} value={h.id || (h as any)._id}>
                          {h.name || `Hotspot ${i + 1}`} ({h.position.x}%, {h.position.y}%)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Center Focus (50%, 50%) Quick Action */}
                <div className="flex items-center justify-between pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      const boxW = zoomConfig.focusRegion?.width || 60;
                      const boxH = zoomConfig.focusRegion?.height || 50;
                      handleUpdateZoomPan({
                        linkedHotspotId: null,
                        focusPoint: { x: 50, y: 50 },
                        focusRegion: {
                          x: Math.round(Math.max(0, 50 - boxW / 2) * 10) / 10,
                          y: Math.round(Math.max(0, 50 - boxH / 2) * 10) / 10,
                          width: boxW,
                          height: boxH,
                        },
                      });
                    }}
                    className="text-[11px] font-semibold text-brand-purple hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>Center Focus (50%, 50%)</span>
                  </button>
                </div>

                {/* Numeric Coordinate Fine-tuning */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted">X Position (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={zoomConfig.focusPoint.x}
                      onChange={(e) => {
                        const newX = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                        const boxW = zoomConfig.focusRegion?.width || 60;
                        const boxH = zoomConfig.focusRegion?.height || 50;
                        handleUpdateZoomPan({
                          linkedHotspotId: null,
                          focusPoint: {
                            ...zoomConfig.focusPoint,
                            x: newX,
                          },
                          focusRegion: {
                            x: Math.round(Math.max(0, Math.min(100 - boxW, newX - boxW / 2)) * 10) / 10,
                            y: zoomConfig.focusRegion?.y ?? 15,
                            width: boxW,
                            height: boxH,
                          },
                        });
                      }}
                      className="w-full text-xs py-1 px-2 rounded-lg border border-border-default bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted">Y Position (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={zoomConfig.focusPoint.y}
                      onChange={(e) => {
                        const newY = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                        const boxW = zoomConfig.focusRegion?.width || 60;
                        const boxH = zoomConfig.focusRegion?.height || 50;
                        handleUpdateZoomPan({
                          linkedHotspotId: null,
                          focusPoint: {
                            ...zoomConfig.focusPoint,
                            y: newY,
                          },
                          focusRegion: {
                            x: zoomConfig.focusRegion?.x ?? 20,
                            y: Math.round(Math.max(0, Math.min(100 - boxH, newY - boxH / 2)) * 10) / 10,
                            width: boxW,
                            height: boxH,
                          },
                        });
                      }}
                      className="w-full text-xs py-1 px-2 rounded-lg border border-border-default bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Timing & Duration */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[12px] font-semibold text-heading">
                    <span>Zoom Duration</span>
                    <span className="font-mono text-brand-purple">{zoomConfig.durationMs || 800} ms</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="2000"
                    step="50"
                    value={zoomConfig.durationMs || 800}
                    onChange={(e) => handleUpdateZoomPan({ durationMs: parseInt(e.target.value, 10) })}
                    className="w-full h-1.5 bg-border-default rounded-lg appearance-none cursor-pointer accent-brand-purple"
                  />
                </div>

                {/* Easing */}
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-heading">Easing Curve</label>
                  <select
                    value={zoomConfig.easing || 'easeOut'}
                    onChange={(e) => handleUpdateZoomPan({ easing: e.target.value as ZoomPanEasing })}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-border-default bg-white text-heading focus:outline-none focus:border-brand-purple"
                  >
                    {EASING_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Collapsible Advanced Settings */}
              <div className="border border-border-default rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full p-3 bg-light hover:bg-border-light text-xs font-bold text-gray-600 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Advanced Timing & End Behavior</span>
                  </div>
                  {showAdvanced ? (
                    <ChevronUp className="w-4 h-4 text-body" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-body" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="p-3.5 space-y-3 bg-white">
                    {/* Start Delay */}
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-600">Start Delay</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="3000"
                          step="100"
                          value={zoomConfig.delayMs || 0}
                          onChange={(e) =>
                            handleUpdateZoomPan({ delayMs: Math.max(0, parseInt(e.target.value, 10) || 0) })
                          }
                          className="w-20 text-xs py-1 px-2 rounded-lg border border-border-default font-mono text-right"
                        />
                        <span className="text-xs text-body">ms</span>
                      </div>
                    </div>

                    {/* Hold Duration */}
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-600">Hold Duration</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="5000"
                          step="100"
                          value={zoomConfig.holdDurationMs || 600}
                          onChange={(e) =>
                            handleUpdateZoomPan({
                              holdDurationMs: Math.max(0, parseInt(e.target.value, 10) || 0),
                            })
                          }
                          className="w-20 text-xs py-1 px-2 rounded-lg border border-border-default font-mono text-right"
                        />
                        <span className="text-xs text-body">ms</span>
                      </div>
                    </div>

                    {/* Return to Fit Duration */}
                    {zoomConfig.endBehavior === 'returnToFit' && (
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-600">Return Duration</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="200"
                            max="3000"
                            step="100"
                            value={zoomConfig.returnDurationMs || 500}
                            onChange={(e) =>
                              handleUpdateZoomPan({
                                returnDurationMs: Math.max(100, parseInt(e.target.value, 10) || 100),
                              })
                            }
                            className="w-20 text-xs py-1 px-2 rounded-lg border border-border-default font-mono text-right"
                          />
                          <span className="text-xs text-body">ms</span>
                        </div>
                      </div>
                    )}

                    {/* End Behavior */}
                    <div className="space-y-1 pt-1 border-t border-border-light">
                      <label className="text-xs font-semibold text-heading">Camera End Behavior</label>
                      <select
                        value={zoomConfig.endBehavior || 'hold'}
                        onChange={(e) =>
                          handleUpdateZoomPan({ endBehavior: e.target.value as ZoomPanEndBehavior })
                        }
                        className="w-full text-xs py-1.5 px-2.5 rounded-xl border border-border-default bg-white text-heading"
                      >
                        {END_BEHAVIORS.map((b) => (
                          <option key={b.value} value={b.value}>
                            {b.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Preview / Reset / Remove */}
              <div className="pt-2 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={onPreviewAnimation}
                    isLoading={isPreviewing}
                    leftIcon={<Play className="w-3.5 h-3.5" />}
                  >
                    Preview Animation
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onResetCamera}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                    title="Reset camera back to 1.0× overview"
                  >
                    Reset
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveZoomPan}
                  className="w-full py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Zoom Animation</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SECTION: AUTOPLAY & STEP PROGRESSION                   */}
      {/* ========================================================= */}
      {section === 'autoplay' && (
        <div className="space-y-4">
          {/* Per-Step Progression Policy & Dwell Override Card */}
          <div className="p-3.5 bg-canvas rounded-2xl border border-border-default space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-purple" />
                <span className="text-xs font-bold text-heading">This Step's Playback</span>
              </div>
              <span className="text-[10px] font-semibold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full">
                Step {(currentStep?.order ?? 0) + 1}
              </span>
            </div>

            {/* Step Progression Policy */}
            <div className="space-y-2">
              <label className="text-[11.5px] font-semibold text-heading">
                Progression Behavior
              </label>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                <label className="flex items-start gap-2 p-2 rounded-xl bg-white border border-border-default cursor-pointer hover:border-slate-300 transition-colors">
                  <input
                    type="radio"
                    name="step-progression-policy"
                    checked={!currentStep?.navigation?.progressionPolicy || currentStep?.navigation?.progressionPolicy === 'auto'}
                    onChange={() =>
                      onUpdateStep({
                        navigation: {
                          ...(currentStep?.navigation || {}),
                          progressionPolicy: 'auto',
                        },
                      })
                    }
                    className="mt-0.5 accent-brand-purple"
                  />
                  <div>
                    <span className="font-semibold text-heading block">
                      Auto-advance Step
                    </span>
                    <span className="text-[10.5px] text-body leading-snug">
                      Automatically moves to next step after camera animation and dwell time.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2 p-2 rounded-xl bg-white border border-border-default cursor-pointer hover:border-slate-300 transition-colors">
                  <input
                    type="radio"
                    name="step-progression-policy"
                    checked={currentStep?.navigation?.progressionPolicy === 'requireInteraction'}
                    onChange={() =>
                      onUpdateStep({
                        navigation: {
                          ...(currentStep?.navigation || {}),
                          progressionPolicy: 'requireInteraction',
                        },
                      })
                    }
                    className="mt-0.5 accent-brand-purple"
                  />
                  <div>
                    <span className="font-semibold text-heading block">
                      Wait for Viewer Interaction
                    </span>
                    <span className="text-[10.5px] text-body leading-snug">
                      Plays camera zoom and pointer guidance, but pauses until viewer clicks the hotspot.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Per-Step Dwell Override */}
            <div className="pt-2 border-t border-border-light space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11.5px] font-semibold text-heading">
                  Step Dwell Duration
                </label>
                <span className="text-xs font-mono font-bold text-brand-purple">
                  {currentStep?.navigation?.durationOverrideMs
                    ? `${(currentStep.navigation.durationOverrideMs / 1000).toFixed(1)}s (Override)`
                    : `${((demoSettings.autoplayDelay || 4000) / 1000).toFixed(1)}s (Inherited)`}
                </span>
              </div>

              <div className="space-y-1.5">
                <input
                  type="range"
                  min="1500"
                  max="10000"
                  step="500"
                  value={currentStep?.navigation?.durationOverrideMs || demoSettings.autoplayDelay || 4000}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    onUpdateStep({
                      navigation: {
                        ...(currentStep?.navigation || {}),
                        durationOverrideMs: val,
                      },
                    });
                  }}
                  className="w-full h-1.5 bg-border-default rounded-lg appearance-none cursor-pointer accent-brand-purple"
                />
                <div className="flex items-center justify-between text-[10px] text-muted">
                  <span>1.5s</span>
                  {currentStep?.navigation?.durationOverrideMs && (
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateStep({
                          navigation: {
                            ...(currentStep?.navigation || {}),
                            durationOverrideMs: null,
                          },
                        })
                      }
                      className="text-brand-purple hover:underline font-semibold cursor-pointer"
                    >
                      Reset to demo default
                    </button>
                  )}
                  <span>10s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demo-level Autoplay Defaults Card */}
          <div className="p-3.5 bg-light rounded-2xl border border-border-default space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-body">
              Demo-Level Autoplay Defaults
            </div>

            <Checkbox
              id="enable-autoplay-global"
              label={<span className="text-xs font-bold text-heading">Autoplay Enabled by Default</span>}
              description="Automatically start walkthrough playback when viewer opens the demo."
              checked={demoSettings.autoplay ?? false}
              onChange={(e) => {
                onUpdateDemoSettings({ autoplay: e.target.checked });
              }}
            />

            <Checkbox
              id="enable-autoplay-loop"
              label={<span className="text-xs font-bold text-heading">Loop Continuously</span>}
              description="Automatically restart demo from step 1 after reaching completion."
              checked={demoSettings.loop ?? demoSettings.autoplayLoop ?? false}
              onChange={(e) => {
                onUpdateDemoSettings({ loop: e.target.checked, autoplayLoop: e.target.checked });
              }}
            />

            {demoSettings.autoplay && (
              <div className="space-y-2 pt-2 border-t border-border-default">
                <div className="flex items-center justify-between text-xs font-semibold text-heading">
                  <span>Default Dwell Duration</span>
                  <span className="font-mono text-brand-purple">
                    {((demoSettings.autoplayDelay || 2000) / 1000).toFixed(1)}s
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={demoSettings.autoplayDelay || 2000}
                  onChange={(e) =>
                    onUpdateDemoSettings({ autoplayDelay: parseInt(e.target.value, 10) })
                  }
                  className="w-full h-1.5 bg-border-default rounded-lg appearance-none cursor-pointer accent-brand-purple"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
