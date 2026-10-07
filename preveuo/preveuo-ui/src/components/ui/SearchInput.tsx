'use client';

import React from 'react';

/**
 * SearchInput
 *
 * Standardized search field for Preveuo.
 * Adheres to Rule 10 of Common UI Component Architecture Rules:
 * - Search icon
 * - Clear button
 * - Keyboard shortcut indicator
 * - Loading indicator
 */
export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  shortcut?: string;
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      size = 'md',
      isLoading = false,
      shortcut = '⌘K',
      onClear,
      value,
      defaultValue,
      className = '',
      placeholder = 'Search...',
      disabled,
      ...props
    },
    ref
  ) => {
    const [innerVal, setInnerVal] = React.useState<string>(
      value !== undefined ? String(value) : defaultValue !== undefined ? String(defaultValue) : ''
    );

    const isControlled = value !== undefined;
    const currentVal = isControlled ? String(value) : innerVal;

    const handleClear = () => {
      if (!isControlled) {
        setInnerVal('');
      }
      onClear?.();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInnerVal(e.target.value);
      }
      props.onChange?.(e);
    };

    const sizeStyles = {
      sm: 'py-1.5 pl-8 pr-12 text-[12.5px] rounded-lg',
      md: 'py-2.5 pl-9 pr-14 text-[13.5px] rounded-xl',
      lg: 'py-3.5 pl-11 pr-16 text-[15px] rounded-xl',
    };

    const iconSizes = {
      sm: 'w-3.5 h-3.5 left-2.5',
      md: 'w-4 h-4 left-3',
      lg: 'w-5 h-5 left-3.5',
    };

    return (
      <div className={`relative w-full ${className}`}>
        {/* Search Icon or Spinner */}
        <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af] ${iconSizes[size]}`}>
          {isLoading ? (
            <svg className="animate-spin w-full h-full text-[#5B5CE2]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>

        {/* Input */}
        <input
          ref={ref}
          type="search"
          disabled={disabled}
          placeholder={placeholder}
          value={currentVal}
          onChange={handleChange}
          className={`
            w-full border border-[#d1d5db] bg-white text-[#0f0f1a] placeholder-[#9ca3af]
            shadow-2xs transition-all duration-150
            focus:outline-none focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/15
            hover:border-[#9ca3af] disabled:bg-[#f8f8fc] disabled:cursor-not-allowed
            ${sizeStyles[size]}
          `}
          {...props}
        />

        {/* Clear Button or Keyboard Shortcut */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {currentVal && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="p-1 rounded-md text-[#9ca3af] hover:text-[#0f0f1a] hover:bg-[#f3f4f6] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {shortcut && !currentVal && (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-medium text-[#9ca3af] bg-[#f3f4f6] border border-[#e5e7eb] rounded-md pointer-events-none">
              {shortcut}
            </kbd>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
