import {
  ZoomPanConfig,
  ZoomPanAnimationType,
  ZoomPanEasing,
  ZoomPanEndBehavior,
  ZoomPanFocusPoint,
  ZoomPanFocusRegion,
} from '@/types/demo';

export interface CameraTransformState {
  scale: number;
  translateX: number; // percentage
  translateY: number; // percentage
  transform: string;
  transformOrigin: string;
  isZoomed: boolean;
  clampedCenter: { x: number; y: number }; // normalized 0-1
}

export const DEFAULT_ZOOM_PAN_CONFIG: ZoomPanConfig = {
  enabled: true,
  animationType: 'zoomIn',
  zoomLevel: 1.5,
  focusPoint: { x: 50, y: 50 },
  focusRegion: { x: 20, y: 15, width: 60, height: 70 },
  durationMs: 800,
  delayMs: 0,
  holdDurationMs: 600,
  returnDurationMs: 500,
  easing: 'easeOut',
  endBehavior: 'hold',
  linkedHotspotId: null,
};

export const ZOOM_LEVEL_PRESETS: { label: string; value: number }[] = [
  { label: 'Fit / 1×', value: 1.0 },
  { label: '1.25×', value: 1.25 },
  { label: '1.50×', value: 1.5 },
  { label: '2.0×', value: 2.0 },
  { label: '2.5×', value: 2.5 },
];

export const EASING_OPTIONS: { label: string; value: ZoomPanEasing; css: string }[] = [
  { label: 'Ease Out', value: 'easeOut', css: 'cubic-bezier(0, 0, 0.2, 1)' },
  { label: 'Ease In', value: 'easeIn', css: 'cubic-bezier(0.4, 0, 1, 1)' },
  { label: 'Ease In Out', value: 'easeInOut', css: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  { label: 'Linear', value: 'linear', css: 'linear' },
];

export const ANIMATION_TYPES: {
  label: string;
  value: ZoomPanAnimationType;
  desc: string;
}[] = [
  { label: 'Zoom In', value: 'zoomIn', desc: 'Magnify into target focal area' },
  { label: 'Zoom Out', value: 'zoomOut', desc: 'Pull back to overview perspective' },
  { label: 'Pan', value: 'pan', desc: 'Glide across stage without changing scale' },
  { label: 'Zoom & Pan', value: 'zoomAndPan', desc: 'Simultaneous scale and camera glide' },
];

export const END_BEHAVIORS: {
  label: string;
  value: ZoomPanEndBehavior;
  desc: string;
}[] = [
  { label: 'Hold at Destination', value: 'hold', desc: 'Keep focused until step transition' },
  { label: 'Return to Fit', value: 'returnToFit', desc: 'Smoothly glide back to 1.0× overview' },
  { label: 'Continue to Next', value: 'continue', desc: 'Preserve camera position for next animation' },
  { label: 'Reset on Next Step', value: 'resetOnNextStep', desc: 'Reset instantly when advancing' },
];

/**
 * Maps easing enum to CSS transition timing function
 */
export function getEasingCss(easing: ZoomPanEasing = 'easeOut'): string {
  const found = EASING_OPTIONS.find((e) => e.value === easing);
  return found ? found.css : 'cubic-bezier(0, 0, 0.2, 1)';
}

/**
 * Calculates total sequence lifecycle duration in milliseconds
 */
export function calculateZoomPanTotalDuration(config?: ZoomPanConfig | null): number {
  if (!config || !config.enabled) return 0;
  const delay = Math.max(0, config.delayMs || 0);
  const zoom = Math.max(100, config.durationMs || 800);
  const hold = Math.max(0, config.holdDurationMs || 600);
  const ret = config.endBehavior === 'returnToFit' ? Math.max(100, config.returnDurationMs || 500) : 0;
  return delay + zoom + hold + ret;
}

/**
 * Computes exact camera scale and translation percentages with zero margin leakage
 */
export function computeCameraTransform({
  scale = 1.0,
  focusPoint = { x: 50, y: 50 },
  focusRegion,
  active = true,
}: {
  scale?: number;
  focusPoint?: ZoomPanFocusPoint;
  focusRegion?: ZoomPanFocusRegion;
  active?: boolean;
}): CameraTransformState {
  // Authoritative target coordinates: focusPoint is always the exact zoom point
  let targetX = focusPoint?.x ?? 50;
  let targetY = focusPoint?.y ?? 50;

  if (
    (typeof focusPoint?.x !== 'number' || typeof focusPoint?.y !== 'number') &&
    focusRegion &&
    focusRegion.width > 0 &&
    focusRegion.height > 0
  ) {
    targetX = focusRegion.x + focusRegion.width / 2;
    targetY = focusRegion.y + focusRegion.height / 2;
  }

  // Safe camera scale: only zoom when active and scale is greater than 1.001
  const safeScale = active && scale > 1.001 ? Math.max(1.0, Math.min(3.5, scale)) : 1.0;

  if (safeScale <= 1.001) {
    return {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
      transform: 'translate(0%, 0%) scale(1)',
      transformOrigin: '0 0',
      isZoomed: false,
      clampedCenter: { x: 0.5, y: 0.5 },
    };
  }

  // Normalized focus point in [0, 1]
  const rawX = Math.max(0, Math.min(100, targetX)) / 100;
  const rawY = Math.max(0, Math.min(100, targetY)) / 100;

  // Half-window visible at safeScale
  const halfWindow = 1 / (2 * safeScale);

  // Clamped center guaranteed to prevent empty margins
  const clampedX = Math.max(halfWindow, Math.min(1 - halfWindow, rawX));
  const clampedY = Math.max(halfWindow, Math.min(1 - halfWindow, rawY));

  // Translation percentage when origin is '0 0'
  const tx = (0.5 - safeScale * clampedX) * 100;
  const ty = (0.5 - safeScale * clampedY) * 100;

  return {
    scale: safeScale,
    translateX: tx,
    translateY: ty,
    transform: `translate(${tx.toFixed(3)}%, ${ty.toFixed(3)}%) scale(${safeScale.toFixed(3)})`,
    transformOrigin: '0 0',
    isZoomed: true,
    clampedCenter: { x: clampedX, y: clampedY },
  };
}

/**
 * Resolves effective dwell duration for a step considering step override, navigation delay, and demo settings
 */
export function getStepDwellDuration(
  step?: any,
  demoSettings?: any,
  voiceoverDurationMs?: number
): number {
  let dwell = 2000;

  if (
    demoSettings?.autoplayMode === 'custom' &&
    typeof step?.navigation?.durationOverrideMs === 'number' &&
    step.navigation.durationOverrideMs > 0
  ) {
    dwell = step.navigation.durationOverrideMs;
  } else if (
    typeof demoSettings?.autoplayDelay === 'number' &&
    demoSettings.autoplayDelay > 0
  ) {
    dwell = demoSettings.autoplayDelay;
  } else if (
    typeof step?.navigation?.durationOverrideMs === 'number' &&
    step.navigation.durationOverrideMs > 0
  ) {
    dwell = step.navigation.durationOverrideMs;
  } else if (
    typeof step?.navigation?.delayMs === 'number' &&
    step.navigation.delayMs > 0
  ) {
    dwell = step.navigation.delayMs;
  }

  // Voiceover priority rule: "If a voiceover is present, the longer of the step or voiceover duration is used."
  if (voiceoverDurationMs && voiceoverDurationMs > 0) {
    dwell = Math.max(dwell, voiceoverDurationMs);
  }

  return dwell;
}

/**
 * Determines whether a step requires viewer interaction before progression
 */
export function doesStepRequireInteraction(
  step?: any,
  demoSettings?: any
): boolean {
  if (!step) return false;
  if (step.navigation?.progressionPolicy === 'requireInteraction') {
    return true;
  }
  if (step.navigation?.progressionPolicy === 'auto') {
    return false;
  }
  if (demoSettings?.autoplayProgressionPolicy === 'requireInteraction') {
    return true;
  }
  return false;
}
