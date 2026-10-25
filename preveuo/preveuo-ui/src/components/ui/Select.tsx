import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-[12.5px] font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border bg-white text-[13.5px] text-heading transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-muted disabled:cursor-not-allowed appearance-none cursor-pointer ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                : 'border-border-default focus:border-brand-purple focus:ring-brand-purple/10'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-muted absolute right-3.5 pointer-events-none" />
        </div>
        {error ? (
          <p className="mt-1.5 text-[11.5px] font-medium text-red-600">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-[11.5px] text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
