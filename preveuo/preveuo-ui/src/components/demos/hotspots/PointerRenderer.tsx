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
  style = 'beacon',
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
  // Normalize style aliases
  const canonicalStyle: HotspotPointerStyle =
    style === 'aura' ||
    style === 'sparkle' ||
    style === 'beacon' ||
    style === 'target' ||
    style === 'bullseye' ||
    style === 'cursor' ||
    style === 'hand'
      ? style === 'bullseye' ? 'target' : style
      : 'ripple';

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
  const currentSize = size || animationSettings?.size || 'md';
  const sizeConfig = {
    sm: { beacon: 18, icon: 20, dot: 4, outer: 40, star: 18 },
    md: { beacon: 24, icon: 24, dot: 6, outer: 52, star: 24 },
    lg: { beacon: 30, icon: 28, dot: 8, outer: 64, star: 30 },
  }[currentSize];

  // Intensity multiplier for shadows and glows
  const intensity = animationSettings?.intensity || 'standard';
  const glowOpacity = intensity === 'high' ? 0.75 : intensity === 'subtle' ? 0.25 : 0.45;

  // Keep stable callback refs
  const onPointerClickRef = useRef(onPointerClick);
  onPointerClickRef.current = onPointerClick;

  const onActionCompleteRef = useRef(onActionComplete);
  onActionCompleteRef.current = onActionComplete;

  // Entrance & Click feedback sequence
  useEffect(() => {
    if (!autoPlayMotion || reducedMotion || isDragging) {
      setMotionPhase('idle');
      return;
    }

    setMotionPhase('moving');

    const tClick = setTimeout(() => {
      setMotionPhase('clicking');
      if (animationSettings?.clickFeedback !== false) {
        setShowRipple(true);
      }
      onPointerClickRef.current?.();
    }, speedMs);

    const tHold = setTimeout(() => {
      setShowRipple(false);
      setMotionPhase('holding');
      onActionCompleteRef.current?.();
    }, speedMs + 180);

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

  // Motion transitions
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

  const motionTransition =
    motionPhase === 'moving'
      ? `transform ${speedMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
      : motionPhase === 'clicking'
        ? 'transform 120ms ease-out'
        : 'transform 0.25s ease-out';

  // =========================================================================
  // 1. PREVEUO SPATIAL AURA GLOW ORB (Apple Vision / 2026 Spatial UI)
  // Not found in Storylane, Arcade, or Supademo
  // =========================================================================
  if (canonicalStyle === 'aura') {
    return (
      <div
        className={`relative flex items-center justify-center select-none pointer-events-auto cursor-pointer transition-transform duration-200 ${
          isDragging ? 'scale-120' : isSelected ? 'scale-115' : 'hover:scale-108'
        } ${className}`}
        style={{
          width: `${sizeConfig.outer}px`,
          height: `${sizeConfig.outer}px`,
        }}
      >
        {/* Ambient Outer Chromatic Dispersion Nebula */}
        <div
          style={{
            backgroundColor: color,
            filter: `blur(${currentSize === 'lg' ? 18 : 12}px)`,
            opacity: glowOpacity,
          }}
          className="absolute inset-0 rounded-full animate-aura-pulse pointer-events-none"
        />

        {/* Orbiting Gravitational Particle Ring */}
        <div
          style={{
            borderColor: `${color}70`,
            boxShadow: `0 0 16px ${color}35`,
          }}
          className="absolute inset-1 rounded-full border border-dashed animate-spin-slow pointer-events-none"
        >
          {/* Micro Satellites on Orbit */}
          <span
            style={{ backgroundColor: color }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_white]"
          />
        </div>

        {/* Glassmorphic Crystal Core with Specular Light */}
        <div
          style={{
            borderColor: 'rgba(255, 255, 255, 0.75)',
            background: `radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.7) 0%, ${color}30 55%, ${color}95 100%)`,
            boxShadow: `0 4px 16px ${color}65, 0 0 0 1.5px rgba(255, 255, 255, 0.45)`,
            width: `${sizeConfig.beacon + 4}px`,
            height: `${sizeConfig.beacon + 4}px`,
          }}
          className="relative rounded-full flex items-center justify-center backdrop-blur-xs shadow-lg transition-transform duration-150"
        >
          {/* Inner Radiant Pulsing Pearl Core */}
          <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_white] animate-ping" />
          <span className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-white/90" />
        </div>

        {/* Entrance / Click Feedback Ripple */}
        {(showRipple || motionPhase === 'clicking') && (
          <span
            style={{ borderColor: color, backgroundColor: `${color}25` }}
            className="absolute inset-0 rounded-full border-2 animate-hotspot-ripple pointer-events-none z-20"
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. AI MAGIC STARLIGHT SPARKLE (Gemini / Apple Intelligence Celestial Star)
  // Not found in Storylane, Arcade, or Supademo
  // =========================================================================
  if (canonicalStyle === 'sparkle') {
    return (
      <div
        className={`relative flex items-center justify-center select-none pointer-events-auto cursor-pointer transition-transform duration-200 ${
          isDragging ? 'scale-120' : isSelected ? 'scale-115' : 'hover:scale-110'
        } ${className}`}
        style={{
          width: `${sizeConfig.outer}px`,
          height: `${sizeConfig.outer}px`,
        }}
      >
        {/* Ambient Starlight Glow Nebula */}
        <div
          style={{
            backgroundColor: color,
            filter: 'blur(10px)',
            opacity: glowOpacity + 0.1,
          }}
          className="absolute inset-2 rounded-full animate-aura-pulse pointer-events-none"
        />

        {/* Orbiting Stardust Track */}
        <div className="absolute inset-1.5 rounded-full border border-dashed border-white/50 animate-spin-slow pointer-events-none">
          {/* Orbiting Satellite Star 1 */}
          <span
            style={{ backgroundColor: color }}
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-white shadow-[0_0_6px_white]"
          />
          {/* Orbiting Satellite Star 2 */}
          <span className="absolute -bottom-0.5 right-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_white]" />
        </div>

        {/* Central 4-Point Celestial AI Diamond Star */}
        <div
          style={{
            filter: `drop-shadow(0 2px 10px ${color}) drop-shadow(0 0 10px rgba(255,255,255,0.85))`,
          }}
          className="relative flex items-center justify-center transition-transform duration-200 group-hover:rotate-12"
        >
          <svg
            width={sizeConfig.star}
            height={sizeConfig.star}
            viewBox="0 0 24 24"
            fill="none"
            className="animate-pulse"
          >
            {/* Outer Star Body */}
            <path
              d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
              fill={color}
            />
            {/* Inner Radiant Core Star */}
            <path
              d="M12 3.5C12 8.194 8.194 12 3.5 12C8.194 12 12 15.806 12 20.5C12 15.806 15.806 12 20.5 12C15.806 12 12 8.194 12 3.5Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Twinkle Micro Particles */}
        <span className="absolute -top-1.5 -right-1.5 text-[11px] text-amber-300 animate-bounce pointer-events-none select-none">
          ✦
        </span>
        <span className="absolute -bottom-1 -left-1 text-[9px] text-white animate-pulse pointer-events-none select-none">
          ✧
        </span>

        {/* Click Feedback Ripple */}
        {(showRipple || motionPhase === 'clicking') && (
          <span
            style={{ borderColor: color, backgroundColor: `${color}25` }}
            className="absolute inset-0 rounded-full border-2 animate-hotspot-ripple pointer-events-none z-20"
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // 3. CYBER PRECISION RETICLE HUD (High-Tech Sci-Fi Precision Crosshairs)
  // Not found in Storylane, Arcade, or Supademo
  // =========================================================================
  if (canonicalStyle === 'target') {
    return (
      <div
        className={`relative flex items-center justify-center select-none pointer-events-auto cursor-pointer transition-transform duration-200 ${
          isDragging ? 'scale-120' : isSelected ? 'scale-115' : 'hover:scale-108'
        } ${className}`}
        style={{
          width: `${sizeConfig.outer}px`,
          height: `${sizeConfig.outer}px`,
        }}
      >
        {/* Rotating Dotted Calibrated HUD Track */}
        <div
          style={{ borderColor: `${color}70` }}
          className="absolute inset-1 rounded-full border border-dotted animate-spin-reverse-slow pointer-events-none"
        />

        {/* 4 Precision Viewfinder Corner Brackets */}
        <div className="absolute inset-2 pointer-events-none">
          {/* Top-Left */}
          <div
            style={{ borderColor: color }}
            className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 rounded-tl-xs drop-shadow-sm"
          />
          {/* Top-Right */}
          <div
            style={{ borderColor: color }}
            className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 rounded-tr-xs drop-shadow-sm"
          />
          {/* Bottom-Left */}
          <div
            style={{ borderColor: color }}
            className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 rounded-bl-xs drop-shadow-sm"
          />
          {/* Bottom-Right */}
          <div
            style={{ borderColor: color }}
            className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 rounded-br-xs drop-shadow-sm"
          />
        </div>

        {/* Precision Crosshair Lines */}
        <div
          style={{ backgroundColor: `${color}90` }}
          className="absolute w-8 h-0.5 pointer-events-none"
        />
        <div
          style={{ backgroundColor: `${color}90` }}
          className="absolute h-8 w-0.5 pointer-events-none"
        />

        {/* Laser Focus Core Diode */}
        <div
          style={{
            backgroundColor: color,
            boxShadow: `0 0 0 2px white, 0 0 12px ${color}`,
          }}
          className="relative w-4 h-4 rounded-full flex items-center justify-center z-10 transition-transform group-hover:scale-120"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_white]" />
        </div>

        {/* Target Lock Click Feedback */}
        {(showRipple || motionPhase === 'clicking') && (
          <span
            style={{ borderColor: color, backgroundColor: `${color}25` }}
            className="absolute inset-0 rounded-full border-2 animate-hotspot-ripple pointer-events-none z-20"
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // 4. TRUE SONAR RADAR BEACON (Continuous Sweeping Radar Beam & Sonar Pings)
  // Replaces generic ripple with genuine spinning radar sweep
  // =========================================================================
  if (canonicalStyle === 'beacon') {
    return (
      <div
        className={`relative flex items-center justify-center select-none pointer-events-auto cursor-pointer transition-transform duration-200 ${
          isDragging ? 'scale-120' : isSelected ? 'scale-115' : 'hover:scale-108'
        } ${className}`}
        style={{
          width: `${sizeConfig.outer}px`,
          height: `${sizeConfig.outer}px`,
        }}
      >
        {/* Rotating 360° Conic Radar Beam Sweep */}
        <div
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, transparent 260deg, ${color}30 330deg, ${color}95 360deg)`,
            boxShadow: `0 0 14px ${color}35`,
          }}
          className="absolute inset-1 rounded-full animate-spin-radar pointer-events-none"
        />

        {/* Concentric Sonar Grid Range Rings */}
        <div
          style={{ borderColor: `${color}55` }}
          className="absolute inset-1 rounded-full border border-solid pointer-events-none"
        />
        <div
          style={{ borderColor: `${color}35` }}
          className="absolute inset-3.5 rounded-full border border-dashed pointer-events-none"
        />

        {/* Sonar Center Pulsing Diode */}
        <div
          style={{
            backgroundColor: color,
            boxShadow: `0 0 0 2px white, 0 0 14px ${color}90`,
          }}
          className="relative w-4 h-4 rounded-full flex items-center justify-center z-10 transition-transform group-hover:scale-120"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        </div>

        {/* Expanding Sonar Ping Ring */}
        <span
          style={{ borderColor: color, backgroundColor: `${color}15` }}
          className="absolute inset-0 rounded-full border animate-hotspot-sonar pointer-events-none"
        />
      </div>
    );
  }

  // =========================================================================
  // 5. VECTOR PRECISION CURSOR
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
  // 6. TOUCH HAND POINTER
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
            transition: motionTransition,
          }}
          className={`relative filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.38)] origin-bottom-right -translate-x-2 -translate-y-2.5 ${
            isDragging ? 'scale-125' : isSelected ? 'scale-110' : 'group-hover:scale-110'
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
  // 7. DEFAULT: CONCENTRIC ULTRASONIC RIPPLE
  // =========================================================================
  const rippleClass =
    size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-16 h-16' : 'w-14 h-14';

  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-auto cursor-pointer ${
        isDragging ? 'scale-115' : isSelected ? 'scale-110' : 'hover:scale-105'
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
