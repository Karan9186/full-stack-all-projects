import React from 'react';

/**
 * IconButton
 *
 * Shared icon-only action button for Preveuo.
 * Rules:
 * - Must include an accessible aria-label or title.
 * - Adheres strictly to Preveuo design tokens.
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      children,
      className = '',
      disabled,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#5B5CE2]/20 disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer';

    const variantStyles = {
      primary: 'bg-[#5B5CE2] hover:bg-[#4a4bd4] text-white shadow-sm hover:shadow-md',
      secondary:
        'border border-[#d1d5db] bg-white text-[#0f0f1a] hover:border-[#5B5CE2] hover:text-[#5B5CE2] shadow-2xs hover:bg-[#fafafc]',
      ghost: 'text-[#6b7280] hover:text-[#0f0f1a] hover:bg-[#f3f4f6]',
      outline:
        'border border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#5B5CE2] hover:text-[#5B5CE2] hover:bg-[#f8f8fc]',
      danger: 'text-red-500 hover:text-red-700 hover:bg-red-50',
    };

    const sizeStyles = {
      xs: 'w-7 h-7 p-1 text-[12px] rounded-lg',
      sm: 'w-8 h-8 p-1.5 text-[14px] rounded-lg',
      md: 'w-10 h-10 p-2 text-[16px] rounded-xl',
      lg: 'w-12 h-12 p-2.5 text-[18px] rounded-xl',
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        title={ariaLabel}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
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
        ) : (
          children
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
