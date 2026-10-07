'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isPassword = false,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[12.5px] font-semibold text-[#374151] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-[#9ca3af] pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={`w-full py-2.5 rounded-xl border bg-white text-[13.5px] text-[#0f0f1a] placeholder:text-[#9ca3af] transition-colors focus:outline-none focus:ring-2 disabled:bg-[#f9fafb] disabled:text-[#9ca3af] disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } ${
              isPassword || rightIcon ? 'pr-10' : 'pr-3.5'
            } ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                : 'border-[#e5e7eb] focus:border-[#5B5CE2] focus:ring-[#5B5CE2]/10'
            } ${className}`}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-[#9ca3af] hover:text-[#4b5563] focus:outline-none transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : (
            rightIcon && (
              <span className="absolute right-3.5 text-[#9ca3af] pointer-events-none flex items-center">
                {rightIcon}
              </span>
            )
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-[11.5px] font-medium text-red-600 flex items-center gap-1">
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="mt-1.5 text-[11.5px] text-[#9ca3af]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
