'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HotspotPointerStyle, PointerAnimationSettings } from '@/types/demo';

export interface PointerRendererProps {
  style?: HotspotPointerStyle;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  isEditor?: boolean;
  isDragging?: boolean;
  isSelected?: boolean;
  stepNumber?: number;
  autoPlayMotion?: boolean;
  animationSettings?: PointerAnimationSettings;
  onActionComplete?: () => void;
  onPointerClick?: () => void;
  className?: string;
}

export const PointerRenderer: React.FC<PointerRendererProps> = ({
  style = 'beacon',
  color = '#5B5CE2',
  size = 'md',
  isEditor = false,
  isDragging = false,
  isSelected = false,
  stepNumber,
  autoPlayMotion = false,
  animationSettings,
  onActionComplete,
  onPointerClick,
  className = '',
}) => {
  // Normalize style aliases
  const canonicalStyle = style === 'bullseye' ? 'target' : style;

  // Check reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Motion lifecycle state: 'idle' | 'start' | 'moving' | 'clicking' | 'holding'
  const [motionPhase, setMotionPhase] = useState<'idle' | 'start' | 'moving' | 'clicking' | 'holding'>(
    autoPlayMotion ? 'start' : 'idle'
  );
  const [showRipple, setShowRipple] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Speed mapping in milliseconds
  const speedMs =
    animationSettings?.speed === 'fast'
      ? 380
      : animationSettings?.speed === 'slow'
      ? 750
      : 520;

  // Sizing tokens
  const sizeConfig = {
    sm: { beacon: 18, icon: 20, dot: 4, target: 20 },
    md: { beacon: 22, icon: 24, dot: 6, target: 24 },
    lg: { beacon: 26, icon: 28, dot: 8, target: 28 },
  }[size || animationSettings?.size || 'md'];

  // Motion Sequence Runner
  const timelineTimers = useRef<NodeJS.Timeout[]>([]);

  const clearTimelines = () => {
    timelineTimers.current.forEach((t) => clearTimeout(t));
    timelineTimers.current = [];
  };

  useEffect(() => {
    if (!autoPlayMotion || reducedMotion || isDragging) {
      setMotionPhase('idle');
      setHasEntered(true);
      clearTimelines();
      return;
    }

    clearTimelines();
    setHasEntered(false);

    const startDelay = animationSettings?.startDelay ?? 120;
    const holdDuration = animationSettings?.holdDuration ?? 260;

    // Phase 1: Start position
    setMotionPhase('start');

    // Phase 2: Begin movement / entrance toward target
    const t1 = setTimeout(() => {
      setMotionPhase('moving');
    }, startDelay);

    // Phase 3: Reach target & initiate click press or lock-in
    const t2 = setTimeout(() => {
      setMotionPhase('clicking');
      setHasEntered(true);
      if (animationSettings?.clickFeedback !== false) {
        setShowRipple(true);
      }
      onPointerClick?.();
    }, startDelay + speedMs);

    // Phase 4: Settle / hold after click
    const t3 = setTimeout(() => {
      setShowRipple(false);
      setMotionPhase('holding');
      onActionComplete?.();
    }, startDelay + speedMs + 180);

    // Phase 5: Loop if repeat enabled
    if (animationSettings?.repeat) {
      const t4 = setTimeout(() => {
        setMotionPhase('start');
      }, startDelay + speedMs + 180 + holdDuration + 700);
      timelineTimers.current.push(t4);
    }

    timelineTimers.current.push(t1, t2, t3);

    return () => clearTimelines();
  }, [
    autoPlayMotion,
    reducedMotion,
    isDragging,
    speedMs,
    animationSettings?.startDelay,
    animationSettings?.holdDuration,
    animationSettings?.clickFeedback,
    animationSettings?.repeat,
    onPointerClick,
    onActionComplete,
  ]);

  // Movement transform for Cursor
  const getCursorTransform = () => {
    if (reducedMotion || !autoPlayMotion) return 'translate(0, 0) scale(1)';
    switch (motionPhase) {
      case 'start':
        return 'translate(52px, 44px) scale(0.92)';
      case 'moving':
        return 'translate(0, 0) scale(1)';
      case 'clicking':
        return 'translate(0, 0) scale(0.85)';
      case 'holding':
      default:
        return 'translate(0, 0) scale(1)';
    }
  };

  // Movement transform for Hand
  const getHandTransform = () => {
    if (reducedMotion || !autoPlayMotion) return 'translate(0, 0) rotate(0deg) scale(1)';
    switch (motionPhase) {
      case 'start':
        return 'translate(42px, 52px) rotate(-14deg) scale(0.92)';
      case 'moving':
        return 'translate(0, 0) rotate(0deg) scale(1)';
      case 'clicking':
        return 'translate(0, 2px) rotate(0deg) scale(0.85)';
      case 'holding':
      default:
        return 'translate(0, 0) rotate(0deg) scale(1)';
    }
  };

  // Movement transform for Beacon
  const getBeaconTransform = () => {
    if (reducedMotion || !autoPlayMotion) return 'scale(1)';
    switch (motionPhase) {
      case 'start':
        return 'scale(0)';
      case 'moving':
        return 'scale(1.25)';
      case 'clicking':
        return 'scale(1.0)';
      case 'holding':
      default:
        return 'scale(1)';
    }
  };

  // Movement transform for Target
  const getTargetTransform = () => {
    if (reducedMotion || !autoPlayMotion) return 'scale(1)';
    switch (motionPhase) {
      case 'start':
        return 'scale(2.1)';
      case 'moving':
        return 'scale(0.95)';
      case 'clicking':
        return 'scale(1.0)';
      case 'holding':
      default:
        return 'scale(1)';
    }
  };

  const getMotionOpacity = () => {
    if (reducedMotion || !autoPlayMotion) return 1;
    return motionPhase === 'start' ? 0 : 1;
  };

  const motionTransition =
    motionPhase === 'moving'
      ? `transform ${speedMs}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${Math.round(speedMs * 0.65)}ms ease-out`
      : motionPhase === 'clicking'
      ? 'transform 120ms ease-out, opacity 0.15s ease-out'
      : 'transform 0.25s ease-out, opacity 0.25s ease-out';

  // =========================================================================
  // 1. BEACON STYLE
  // =========================================================================
  if (canonicalStyle === 'beacon') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        {/* Continuous Sonar Breathing Waves */}
        {!isDragging && !reducedMotion && (
          <>
            <span
              style={{
                borderColor: color,
                backgroundColor: `${color}18`,
              }}
              className="absolute w-8 h-8 rounded-full border border-current animate-hotspot-sonar pointer-events-none"
            />
            <span
              style={{
                borderColor: color,
                backgroundColor: `${color}0f`,
              }}
              className="absolute w-11 h-11 rounded-full border border-current animate-hotspot-sonar-delayed pointer-events-none"
            />
          </>
        )}

        {/* Entrance / Click Feedback Ripple */}
        {(showRipple || motionPhase === 'clicking') && (
          <span
            style={{ borderColor: color, backgroundColor: `${color}35` }}
            className="absolute w-12 h-12 rounded-full border-2 animate-hotspot-ripple pointer-events-none"
          />
        )}

        {/* High-Contrast Beacon Center Disc with Entrance Pop */}
        <div
          style={{
            width: `${sizeConfig.beacon}px`,
            height: `${sizeConfig.beacon}px`,
            backgroundColor: color,
            boxShadow: `0 0 0 2px #ffffff, 0 4px 14px ${color}85, 0 1px 3px rgba(0,0,0,0.35)`,
            transform: getBeaconTransform(),
            opacity: getMotionOpacity(),
            transition: motionTransition,
          }}
          className={`rounded-full flex items-center justify-center text-white origin-center ${
            isDragging
              ? 'scale-125 ring-3 ring-[#5B5CE2]/50 shadow-xl'
              : isSelected
              ? 'scale-115 ring-2 ring-[#5B5CE2]/40'
              : 'group-hover:scale-115'
          } ${!isDragging && !reducedMotion && (motionPhase === 'holding' || motionPhase === 'idle') ? 'animate-hotspot-breathe' : ''}`}
        >
          <span
            style={{ width: `${sizeConfig.dot}px`, height: `${sizeConfig.dot}px` }}
            className="rounded-full bg-white pointer-events-none shadow-xs"
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. CURSOR STYLE
  // =========================================================================
  if (canonicalStyle === 'cursor') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        {/* Interactive Click Ripple at Hotspot Anchor (0, 0) */}
        {(showRipple || motionPhase === 'clicking') && (
          <span
            style={{ borderColor: color, backgroundColor: `${color}25` }}
            className="absolute w-10 h-10 rounded-full border-2 animate-hotspot-ripple pointer-events-none -translate-x-1 -translate-y-1"
          />
        )}

        {/* Realistic Simulated Vector Mouse Pointer Arrow */}
        <div
          style={{
            transform: getCursorTransform(),
            opacity: getMotionOpacity(),
            transition: motionTransition,
          }}
          className={`relative filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] origin-top-left -translate-x-1 -translate-y-1 ${
            isDragging ? 'scale-125' : isSelected ? 'scale-110' : 'group-hover:scale-105'
          }`}
        >
          <svg
            width={sizeConfig.icon}
            height={sizeConfig.icon}
            viewBox="0 0 24 24"
            fill="none"
            className="overflow-visible"
          >
            <path
              d="M3 2L10.5 20L13.5 13L20.5 10.5L3 2Z"
              fill={color}
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
          </svg>

          {/* Micro active status pip at top-right of cursor */}
          <span
            style={{ backgroundColor: color }}
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white shadow-xs"
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. HAND STYLE
  // =========================================================================
  if (canonicalStyle === 'hand') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        {/* Tap Ripple Feedback under fingertip */}
        {(showRipple || motionPhase === 'clicking') && (
          <span
            style={{ borderColor: color, backgroundColor: `${color}30` }}
            className="absolute w-10 h-10 rounded-full border-2 animate-hotspot-ripple pointer-events-none -translate-x-2 -translate-y-2.5"
          />
        )}

        {/* Hand Pointer with Touch Pose */}
        <div
          style={{
            transform: getHandTransform(),
            opacity: getMotionOpacity(),
            transition: motionTransition,
          }}
          className={`relative filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.38)] origin-bottom-right -translate-x-2 -translate-y-2.5 ${
            isDragging ? 'scale-125' : isSelected ? 'scale-110' : 'group-hover:scale-110'
          }`}
        >
          <div
            style={{
              backgroundColor: color,
              boxShadow: `0 0 0 2px #ffffff, 0 4px 14px ${color}70`,
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. TARGET STYLE
  // =========================================================================
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Precision Crosshair Lines extending in 4 directions */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <span
          style={{ backgroundColor: color }}
          className={`absolute w-7 h-[1.5px] rounded-full transition-all duration-300 ${
            motionPhase === 'start' ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-60'
          }`}
        />
        <span
          style={{ backgroundColor: color }}
          className={`absolute h-7 w-[1.5px] rounded-full transition-all duration-300 ${
            motionPhase === 'start' ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-60'
          }`}
        />
      </div>

      {/* Rotating Outer Dashed Guidance Ring */}
      {!isDragging && !reducedMotion && (
        <span
          style={{ borderColor: color }}
          className="absolute w-9 h-9 rounded-full border border-dashed animate-spin opacity-50 duration-[12s] pointer-events-none"
        />
      )}

      {/* Target Lock Flash Ripple */}
      {(showRipple || motionPhase === 'clicking') && (
        <span
          style={{ borderColor: color, backgroundColor: `${color}35` }}
          className="absolute w-12 h-12 rounded-full border-2 animate-hotspot-ripple pointer-events-none"
        />
      )}

      {/* Reticle Focus Ring that Locks Down onto Target */}
      <div
        style={{
          width: `${sizeConfig.target}px`,
          height: `${sizeConfig.target}px`,
          borderColor: color,
          boxShadow: `0 0 0 2px #ffffff, 0 3px 12px ${color}60`,
          transform: getTargetTransform(),
          opacity: getMotionOpacity(),
          transition: motionTransition,
        }}
        className={`rounded-full border-2 bg-white flex items-center justify-center shadow-md origin-center ${
          isDragging
            ? 'scale-125 ring-3 ring-[#5B5CE2]/50'
            : isSelected
            ? 'scale-115 ring-2 ring-[#5B5CE2]/40'
            : 'group-hover:scale-115'
        }`}
      >
        <span
          style={{
            width: `${sizeConfig.dot + 2}px`,
            height: `${sizeConfig.dot + 2}px`,
            backgroundColor: color,
          }}
          className="rounded-full shadow-xs"
        />
      </div>
    </div>
  );
};
