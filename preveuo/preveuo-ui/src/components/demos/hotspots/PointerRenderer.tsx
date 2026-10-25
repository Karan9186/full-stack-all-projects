'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HotspotPointerStyle, PointerAnimationSettings } from '@/types/demo';
import { Ripple } from '@/components/loading-ui/ripple';
import { PRIMARY_COLOR } from '@/lib/constants/theme';

export interface PointerRendererProps {
  style?: HotspotPointerStyle;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  isEditor?: boolean;
  isDragging?: boolean;
  isSelected?: boolean;
  stepNumber?: number;
  autoPlayMotion?: boolean;
  replayTrigger?: number;
  animationSettings?: PointerAnimationSettings;
  onActionComplete?: () => void;
  onPointerClick?: () => void;
  className?: string;
}

export const PointerRenderer: React.FC<PointerRendererProps> = ({
  style = 'ripple',
  color = PRIMARY_COLOR,
  size = 'md',
  isEditor = false,
  isDragging = false,
  isSelected = false,
  stepNumber,
  autoPlayMotion = false,
  replayTrigger = 0,
  animationSettings,
  onActionComplete,
  onPointerClick,
  className = '',
}) => {
  // Normalize style aliases: all hotspot pointer styles default to infinite ripple
  const canonicalStyle = style === 'cursor' || style === 'hand' ? style : 'ripple';

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

  // Motion lifecycle state: starts at 'idle' so it is ALWAYS 100% visible immediately
  const [motionPhase, setMotionPhase] = useState<'idle' | 'moving' | 'clicking' | 'holding'>('idle');
  const [showRipple, setShowRipple] = useState(false);

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

  // Keep stable callback refs so parent re-renders never re-trigger or cancel the animation
  const onPointerClickRef = useRef(onPointerClick);
  onPointerClickRef.current = onPointerClick;

  const onActionCompleteRef = useRef(onActionComplete);
  onActionCompleteRef.current = onActionComplete;

  // Run the 1-time entrance sequence whenever style, step, or replay changes
  useEffect(() => {
    if (!autoPlayMotion || reducedMotion || isDragging) {
      setMotionPhase('idle');
      return;
    }

    // Step 1: Start motion phase (cursor/hand glides in, beacon pops, target focuses)
    setMotionPhase('moving');

    // Step 2: Reach target & click/tap
    const tClick = setTimeout(() => {
      setMotionPhase('clicking');
      if (animationSettings?.clickFeedback !== false) {
        setShowRipple(true);
      }
      onPointerClickRef.current?.();
    }, speedMs);

    // Step 3: Settle after click
    const tHold = setTimeout(() => {
      setShowRipple(false);
      setMotionPhase('holding');
      onActionCompleteRef.current?.();
    }, speedMs + 180);

    // Step 4: Settle into permanent resting state (never hidden, never re-triggered)
    const tIdle = setTimeout(() => {
      setMotionPhase('idle');
    }, speedMs + 450);

    return () => {
      clearTimeout(tClick);
      clearTimeout(tHold);
      clearTimeout(tIdle);
    };
  }, [
    canonicalStyle,
    stepNumber,
    autoPlayMotion,
    replayTrigger,
    speedMs,
    reducedMotion,
    isDragging,
    animationSettings?.clickFeedback,
  ]);

  // Movement transform for Cursor (always at target (0, 0) when idle/holding)
  const getCursorTransform = () => {
    if (reducedMotion || !autoPlayMotion) return 'translate(0, 0) scale(1)';
    switch (motionPhase) {
      case 'moving':
        return 'translate(44px, 36px) scale(0.96)';
      case 'clicking':
        return 'translate(0, 0) scale(0.85)';
      case 'holding':
      case 'idle':
      default:
        return 'translate(0, 0) scale(1)';
    }
  };

  // Movement transform for Hand (always at target (0, 0) when idle/holding)
  const getHandTransform = () => {
    if (reducedMotion || !autoPlayMotion) return 'translate(0, 0) rotate(0deg) scale(1)';
    switch (motionPhase) {
      case 'moving':
        return 'translate(36px, 44px) rotate(-12deg) scale(0.96)';
      case 'clicking':
        return 'translate(0, 2px) rotate(0deg) scale(0.85)';
      case 'holding':
      case 'idle':
      default:
        return 'translate(0, 0) rotate(0deg) scale(1)';
    }
  };

  // Movement transform for Beacon (always visible scale 1 when idle/holding)
  const getBeaconTransform = () => {
    if (reducedMotion || !autoPlayMotion) return 'scale(1)';
    switch (motionPhase) {
      case 'moving':
        return 'scale(1.22)';
      case 'clicking':
        return 'scale(1.0)';
      case 'holding':
      case 'idle':
      default:
        return 'scale(1)';
    }
  };

  // Movement transform for Target (always visible scale 1 when idle/holding)
  const getTargetTransform = () => {
    if (reducedMotion || !autoPlayMotion) return 'scale(1)';
    switch (motionPhase) {
      case 'moving':
        return 'scale(1.35)';
      case 'clicking':
        return 'scale(1.0)';
      case 'holding':
      case 'idle':
      default:
        return 'scale(1)';
    }
  };

  const motionTransition =
    motionPhase === 'moving'
      ? `transform ${speedMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
      : motionPhase === 'clicking'
        ? 'transform 120ms ease-out'
        : 'transform 0.25s ease-out';

  // =========================================================================
  // 1. CURSOR STYLE — ALWAYS 100% VISIBLE WHEN EXPLICITLY CHOSEN
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

        {/* Realistic Simulated Vector Mouse Pointer Arrow — fully visible */}
        <div
          style={{
            transform: getCursorTransform(),
            transition: motionTransition,
          }}
          className={`relative filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] origin-top-left -translate-x-1 -translate-y-1 ${isDragging ? 'scale-125' : isSelected ? 'scale-110' : 'group-hover:scale-105'
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
              stroke="white"
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
  // 2. HAND STYLE — ALWAYS 100% VISIBLE WHEN EXPLICITLY CHOSEN
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

        {/* Hand Pointer with Touch Pose — fully visible */}
        <div
          style={{
            transform: getHandTransform(),
            transition: motionTransition,
          }}
          className={`relative filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.38)] origin-bottom-right -translate-x-2 -translate-y-2.5 ${isDragging ? 'scale-125' : isSelected ? 'scale-110' : 'group-hover:scale-110'
            }`}
        >
          <div
            style={{
              backgroundColor: color,
              boxShadow: `0 0 0 2.5px white, 0 4px 14px ${color}70`,
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
  // 3. DEFAULT & PRIMARY: INFINITE CONCENTRIC RIPPLE ANIMATION
  // (EXACT LOADING-UI.COM SVG: https://www.loading-ui.com/docs/components/ripple)
  // Operates infinitely non-stop in both studio edit time & preview demo runtime
  // =========================================================================
  const rippleClass =
    size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-16 h-16' : 'w-14 h-14';

  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-auto cursor-pointer ${isDragging ? 'scale-115' : isSelected ? 'scale-110' : 'hover:scale-105'
        } ${className}`}
      style={{
        width: size === 'sm' ? '40px' : size === 'lg' ? '64px' : '56px',
        height: size === 'sm' ? '40px' : size === 'lg' ? '64px' : '56px',
      }}
    >
      <Ripple
        className={`${rippleClass} w-full h-full`}
        color={color || PRIMARY_COLOR}
      />

      {/* Entrance / Click Feedback Ripple */}
      {(showRipple || motionPhase === 'clicking') && (
        <span
          style={{ borderColor: color || PRIMARY_COLOR, backgroundColor: `${color || PRIMARY_COLOR}35` }}
          className="absolute inset-0 rounded-full border-2 animate-hotspot-ripple pointer-events-none z-20"
        />
      )}
    </div>
  );
};
