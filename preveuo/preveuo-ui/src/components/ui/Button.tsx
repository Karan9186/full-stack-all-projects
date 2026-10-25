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
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

    // Variant styles matching Preveuo Design System
    const variantStyles = {
      primary:
        'bg-brand-purple hover:bg-brand-purple-hover text-white shadow-sm hover:shadow-md hover:-translate-y-[0.5px] active:translate-y-0',
      secondary:
        'border border-border-input bg-white text-heading hover:border-brand-purple hover:text-brand-purple shadow-2xs hover:bg-canvas',
      outline:
        'border border-border-default bg-white text-gray-700 hover:border-brand-purple hover:text-brand-purple hover:bg-light',
      ghost:
        'text-gray-600 hover:text-heading hover:bg-gray-100',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-sm',
      social:
        'border border-border-default bg-white hover:bg-light text-heading font-medium shadow-2xs hover:border-border-input',
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
