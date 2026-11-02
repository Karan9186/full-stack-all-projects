'use client';

import React from 'react';
import { HotspotPointerStyle } from '@/types/demo';
import { Orbit, Sparkles, Radar, Crosshair, MousePointer2, Waves } from 'lucide-react';

interface PointerStyleOption {
  value: HotspotPointerStyle;
  label: string;
  icon: React.ReactNode;
}

const POINTER_OPTIONS: PointerStyleOption[] = [
  {
    value: 'aura',
    label: 'Aura',
    icon: <Orbit className="w-4 h-4" />,
  },
  {
    value: 'sparkle',
    label: 'Sparkle',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    value: 'beacon',
    label: 'Beacon',
    icon: <Radar className="w-4 h-4" />,
  },
  {
    value: 'target',
    label: 'Target',
    icon: <Crosshair className="w-4 h-4" />,
  },
  {
    value: 'cursor',
    label: 'Cursor',
    icon: <MousePointer2 className="w-4 h-4" />,
  },
  {
    value: 'ripple',
    label: 'Ripple',
    icon: <Waves className="w-4 h-4" />,
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
    <div className="select-none">
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
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-purple ${
                isSelected
                  ? 'bg-white text-heading shadow-xs font-bold border border-slate-200 ring-1 ring-brand-purple/20'
                  : 'text-body hover:text-heading hover:bg-white/80 border border-transparent'
              }`}
            >
              <span
                className={`mb-1.5 transition-colors shrink-0 ${
                  isSelected ? 'text-brand-purple' : 'text-slate-500'
                }`}
              >
                {opt.icon}
              </span>
              <span className="text-[12px] font-semibold leading-none tracking-tight">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
