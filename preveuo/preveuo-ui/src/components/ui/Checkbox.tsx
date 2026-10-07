import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  description?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = '', id, ...props }, ref) => {
    const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1 select-none">
        <div className="flex items-start gap-2.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={`w-4 h-4 mt-0.5 rounded text-[#5B5CE2] border-[#d1d5db] focus:ring-[#5B5CE2]/20 focus:ring-offset-0 focus:ring-2 cursor-pointer transition-colors accent-[#5B5CE2] ${
              error ? 'border-red-400' : ''
            } ${className}`}
            {...props}
          />
          <div className="text-left">
            <label
              htmlFor={checkboxId}
              className="text-[13px] text-[#4b5563] cursor-pointer leading-tight inline-block"
            >
              {label}
            </label>
            {description && (
              <p className="text-[11.5px] text-[#9ca3af] mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {error && (
          <p className="text-[11.5px] font-medium text-red-600 pl-6.5 mt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
