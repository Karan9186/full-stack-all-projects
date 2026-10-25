'use client';

import React, { useState } from 'react';
import { HotspotPointerStyle } from '@/types/demo';
import { Radio, MousePointer2, Pointer, Target, Waves } from 'lucide-react';

interface PointerStyleOption {
  value: HotspotPointerStyle;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const POINTER_OPTIONS: PointerStyleOption[] = [
  {
    value: 'ripple',
    label: 'Ripple',
    icon: <Waves className="w-4 h-4" />,
    description: 'Concentric expanding ripples for radar-like, soft indeterminate progress',
  },
  {
    value: 'beacon',
    label: 'Beacon',
    icon: <Radio className="w-4 h-4" />,
    description: 'Pulsing sonar beacon with concentric expanding ripples',
  },
  {
    value: 'cursor',
    label: 'Cursor',
    icon: <MousePointer2 className="w-4 h-4" />,
    description: 'Simulated mouse cursor with natural movement and click ripple',
  },
  {
    value: 'hand',
    label: 'Hand',
    icon: <Pointer className="w-4 h-4" />,
    description: 'Pointing hand indicator ideal for buttons and touch targets',
  },
  {
    value: 'target',
    label: 'Target',
    icon: <Target className="w-4 h-4" />,
    description: 'Precision focus reticle highlighting an interactive area',
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
    <div className="space-y-1.5 select-none">
      <div
        role="radiogroup"
        aria-label="Pointer Visual Style"
        className={`relative grid grid-cols-5 p-1 rounded-xl bg-border-light border border-border-default h-[42px] transition-all ${
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
              className={`relative flex items-center justify-center gap-1.5 h-full rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-1 ${
                isSelected
                  ? 'bg-white text-heading shadow-xs font-bold border border-slate-200/60'
                  : 'text-body hover:text-heading hover:bg-white/50'
              }`}
            >
              <span
                className={`transition-colors shrink-0 ${
                  isSelected ? 'text-brand-purple' : 'text-body'
                }`}
              >
                {opt.icon}
              </span>
              <span className="truncate text-[11.5px] tracking-tight">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Accessible Micro-Help / Tooltip Explanation */}
      <div className="min-h-[16px] px-1 text-[11px] text-body leading-snug transition-opacity">
        {hoveredOption
          ? hoveredOption.description
          : POINTER_OPTIONS.find((o) => o.value === normalizedValue)?.description ||
            'Choose how the pointer guides viewers to the target.'}
      </div>
    </div>
  );
};
