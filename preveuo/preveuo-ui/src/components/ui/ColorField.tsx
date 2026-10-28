import { THEME_COLORS } from '@/lib/constants/theme';
import React from 'react';
import { PRIMARY_COLOR, PRIMARY_COLOR_HOVER } from '@/lib/constants/theme';

export interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  presetColors?: string[];
  className?: string;
}

const DEFAULT_PRESET_COLORS = [
  PRIMARY_COLOR, // Brand Purple
  PRIMARY_COLOR_HOVER, // Dark Purple
  THEME_COLORS.info, // Blue
  THEME_COLORS.bgDark, // Dark
  THEME_COLORS.white, // White
  THEME_COLORS.success, // Emerald
  THEME_COLORS.warning, // Amber
  THEME_COLORS.danger, // Red
];

export const ColorField: React.FC<ColorFieldProps> = ({
  label,
  value,
  onChange,
  presetColors = DEFAULT_PRESET_COLORS,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-[12.5px] font-bold text-heading">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-xl border border-border-default overflow-hidden shrink-0 shadow-2xs">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 w-12 h-12 cursor-pointer border-0 p-0"
          />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={PRIMARY_COLOR}
          className="flex-1 px-3 py-1.5 rounded-xl text-xs font-mono bg-white border border-border-default text-heading focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 uppercase"
        />
      </div>

      {presetColors && presetColors.length > 0 && (
        <div className="flex items-center gap-1.5 pt-1 flex-wrap">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
              className={`w-5 h-5 rounded-full border transition-transform cursor-pointer shrink-0 ${
                value.toLowerCase() === color.toLowerCase()
                  ? 'border-heading scale-115 ring-2 ring-brand-purple/30'
                  : 'border-border-default hover:scale-110'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
