'use client';

import React from 'react';

/**
 * Textarea
 *
 * Shared textarea component for Preveuo.
 * Adheres to Rule 8 of Common UI Component Architecture Rules.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showCount = false,
      maxLength,
      value,
      defaultValue,
      className = '',
      id,
      disabled,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const [charCount, setCharCount] = React.useState<number>(
      value ? String(value).length : defaultValue ? String(defaultValue).length : 0
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="block text-[13px] font-semibold text-[#0f0f1a]"
            >
              {label}
              {required && <span className="text-[#5B5CE2] ml-1">*</span>}
            </label>
            {showCount && maxLength && (
              <span className="text-[11.5px] font-medium text-[#9ca3af]">
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}

        <div className="relative rounded-xl shadow-2xs">
          <textarea
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            rows={rows}
            maxLength={maxLength}
            onChange={handleChange}
            value={value}
            defaultValue={defaultValue}
            className={`
              w-full px-3.5 py-3 rounded-xl border text-[14px] text-[#0f0f1a]
              bg-white placeholder-[#9ca3af] transition-all duration-150 resize-y
              focus:outline-none focus:ring-2 disabled:bg-[#f8f8fc] disabled:cursor-not-allowed
              ${
                error
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                  : 'border-[#d1d5db] hover:border-[#9ca3af] focus:border-[#5B5CE2] focus:ring-[#5B5CE2]/15'
              }
              ${className}
            `}
            {...props}
          />
        </div>

        {error ? (
          <p className="text-[12px] font-medium text-red-600 flex items-center gap-1 mt-0.5">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16" r="0.75" fill="currentColor" strokeWidth="1" />
            </svg>
            {error}
          </p>
        ) : helperText ? (
          <p className="text-[12px] text-[#6b7280] mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
