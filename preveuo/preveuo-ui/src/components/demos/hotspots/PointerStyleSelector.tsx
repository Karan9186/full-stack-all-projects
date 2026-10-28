'use client';

import React, { useState } from 'react';
import { HotspotPointerStyle } from '@/types/demo';
import { Orbit, Sparkles, Radar, Crosshair, MousePointer2, Waves } from 'lucide-react';

interface PointerStyleOption {
  value: HotspotPointerStyle;
  label: string;
  tagline: string;
  icon: React.ReactNode;
  description: string;
  badge?: 'Signature' | 'AI' | 'HUD' | 'Radar';
}

const POINTER_OPTIONS: PointerStyleOption[] = [
  {
    value: 'aura',
    label: 'Aura',
    tagline: 'Spatial Glow Orb',
    icon: <Orbit className="w-4 h-4" />,
    description: 'Luminous ambient spatial orb with breathing chromatic glow & orbital ring (Preveuo Signature)',
    badge: 'Signature',
  },
  {
    value: 'sparkle',
    label: 'Sparkle',
    tagline: 'AI Starlight',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Celestial AI starlight with orbiting particles & twinkle stardust for smart recommendations',
    badge: 'AI',
  },
  {
    value: 'beacon',
    label: 'Beacon',
    tagline: 'Sonar Sweep',
    icon: <Radar className="w-4 h-4" />,
    description: 'Continuous 360° sweeping sonar radar beam with concentric distance range rings',
    badge: 'Radar',
  },
  {
    value: 'target',
    label: 'Target',
    tagline: 'Cyber Reticle',
    icon: <Crosshair className="w-4 h-4" />,
    description: 'Cyber precision reticle HUD with calibrated viewfinder brackets & laser diode lock',
    badge: 'HUD',
  },
  {
    value: 'cursor',
    label: 'Cursor',
    tagline: 'Vector Arrow',
    icon: <MousePointer2 className="w-4 h-4" />,
    description: 'Realistic aerodynamic studio vector cursor with tactile click ripple feedback',
  },
  {
    value: 'ripple',
    label: 'Ripple',
    tagline: 'Ultrasonic Pulse',
    icon: <Waves className="w-4 h-4" />,
    description: 'Minimal concentric ultrasonic wave rings with customizable pulse speed',
  },
];

interface PointerStyleSelectorProps {
  value: HotspotPointerStyle;
  onChange: (value: HotspotPointerStyle) => void;
  disabled?: boolean;
}

export const PointerStyleSelector: React.FC<PointerStyleSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [hoveredOption, setHoveredOption] = useState<PointerStyleOption | null>(null);

  // Normalize aliases like 'bullseye' to 'target'
  const normalizedValue = value === 'bullseye' ? 'target' : value;

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (disabled) return;
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % POINTER_OPTIONS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + POINTER_OPTIONS.length) % POINTER_OPTIONS.length;
    }
    if (nextIndex !== currentIndex) {
      onChange(POINTER_OPTIONS[nextIndex].value);
    }
  };

  return (
    <div className="space-y-2 select-none">
      <div
        role="radiogroup"
        aria-label="Pointer Visual Style"
        className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-50 border border-slate-200 transition-all ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {POINTER_OPTIONS.map((opt, idx) => {
          const isSelected = normalizedValue === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onMouseEnter={() => setHoveredOption(opt)}
              onMouseLeave={() => setHoveredOption(null)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-purple ${
                isSelected
                  ? 'bg-white text-heading shadow-xs font-bold border border-slate-200/90 ring-1 ring-brand-purple/20 scale-[1.02]'
                  : 'text-body hover:text-heading hover:bg-white/80 border border-transparent'
              }`}
            >
              {opt.badge && (
                <span
                  className={`absolute top-1 right-1 px-1 py-0.2 rounded text-[7.5px] font-bold uppercase tracking-wider leading-none ${
                    opt.badge === 'Signature'
                      ? 'bg-brand-purple/10 text-brand-purple'
                      : opt.badge === 'AI'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {opt.badge}
                </span>
              )}
              <span
                className={`mb-1 transition-colors shrink-0 ${
                  isSelected ? 'text-brand-purple' : 'text-slate-500'
                }`}
              >
                {opt.icon}
              </span>
              <span className="text-[11px] font-semibold leading-none tracking-tight">
                {opt.label}
              </span>
              <span className="text-[9px] text-muted leading-none mt-1">
                {opt.tagline}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Accessible Micro-Help / Tooltip Explanation */}
      <div className="min-h-[28px] px-1 text-[11px] text-body leading-snug transition-opacity flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0" />
        <span>
          {hoveredOption
            ? hoveredOption.description
            : POINTER_OPTIONS.find((o) => o.value === normalizedValue)?.description ||
              'Choose how the pointer guides viewers to the target.'}
        </span>
      </div>
    </div>
  );
};
