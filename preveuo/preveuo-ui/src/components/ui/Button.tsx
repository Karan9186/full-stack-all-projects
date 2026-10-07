import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'social';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#5B5CE2]/20 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

    // Variant styles matching Preveuo Design System
    const variantStyles = {
      primary:
        'bg-[#5B5CE2] hover:bg-[#4a4bd4] text-white shadow-sm hover:shadow-md hover:-translate-y-[0.5px] active:translate-y-0',
      secondary:
        'border border-[#d1d5db] bg-white text-[#0f0f1a] hover:border-[#5B5CE2] hover:text-[#5B5CE2] shadow-2xs hover:bg-[#fafafc]',
      outline:
        'border border-[#e5e7eb] bg-white text-[#374151] hover:border-[#5B5CE2] hover:text-[#5B5CE2] hover:bg-[#f8f8fc]',
      ghost:
        'text-[#4b5563] hover:text-[#0f0f1a] hover:bg-[#f3f4f6]',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-sm',
      social:
        'border border-[#e5e7eb] bg-white hover:bg-[#f8f8fc] text-[#0f0f1a] font-medium shadow-2xs hover:border-[#d1d5db]',
    };

    // Size styles
    const sizeStyles = {
      sm: 'text-[12.5px] px-3.5 py-2 gap-1.5',
      md: 'text-[14px] px-5 py-2.5 gap-2',
      lg: 'text-[15px] px-6 py-3.5 gap-2.5',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
