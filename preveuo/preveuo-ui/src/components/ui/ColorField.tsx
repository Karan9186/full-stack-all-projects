import React from 'react';

export interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  presetColors?: string[];
  className?: string;
}

const DEFAULT_PRESET_COLORS = [
  '#5B5CE2', // Brand Purple
  '#4a4bd4', // Dark Purple
  '#2563eb', // Blue
  '#0f0f1a', // Dark
  '#ffffff', // White
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
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
      <label className="block text-[12.5px] font-bold text-[#0f0f1a]">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-xl border border-[#e5e7eb] overflow-hidden shrink-0 shadow-2xs">
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
          placeholder="#5B5CE2"
          className="flex-1 px-3 py-1.5 rounded-xl text-xs font-mono bg-white border border-[#e5e7eb] text-[#0f0f1a] focus:outline-none focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/15 uppercase"
        />
      </div>

      {presetColors && presetColors.length > 0 && (
        <div className="flex items-center gap-1.5 pt-1">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
              className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                value.toLowerCase() === color.toLowerCase()
                  ? 'border-[#0f0f1a] scale-115 ring-2 ring-[#5B5CE2]/30'
                  : 'border-[#e5e7eb] hover:scale-110'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
