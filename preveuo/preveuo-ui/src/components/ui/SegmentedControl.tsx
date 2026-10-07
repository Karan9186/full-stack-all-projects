import React from 'react';

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = 'sm',
  fullWidth = true,
  className = '',
}) => {
  const sizeClasses =
    size === 'sm' ? 'py-1 px-2 text-[11.5px]' : 'py-1.5 px-3 text-xs';

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-xl bg-[#f0f0f4] border border-[#e5e7eb] ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg font-bold transition-all cursor-pointer ${sizeClasses} ${
              isSelected
                ? 'bg-white text-[#0f0f1a] shadow-xs'
                : 'text-[#6b7280] hover:text-[#0f0f1a]'
            }`}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span className="truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};
