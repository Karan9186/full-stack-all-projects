import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
}) => {
  return (
    <label
      className={`inline-flex items-center justify-between gap-3 cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {(label || description) && (
        <div className="flex flex-col text-left">
          {label && (
            <span className="text-[12.5px] font-bold text-[#0f0f1a] select-none">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-[#6b7280] select-none">
              {description}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
          checked ? 'bg-[#5B5CE2]' : 'bg-[#e5e7eb]'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${
            checked ? 'translate-x-4.5' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
};
