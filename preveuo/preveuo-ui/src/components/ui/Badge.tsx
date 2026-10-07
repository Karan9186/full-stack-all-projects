import React from 'react';

/**
 * Badge
 *
 * Reusable badge indicator for Preveuo.
 * Implements Rule 14 of Common UI Component Architecture Rules:
 * - Variants: default, purple, success, warning, danger, info
 * - Sizes: sm, md
 * - Optional status dot indicator
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'purple' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  dot = false,
  children,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]',
    purple: 'bg-[#5B5CE2]/10 text-[#5B5CE2] border-[#5B5CE2]/20',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  const dotStyles = {
    default: 'bg-[#6b7280]',
    purple: 'bg-[#5B5CE2]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
  };

  const sizeStyles = {
    sm: 'text-[11.5px] px-2.5 py-0.5 gap-1.5 font-medium',
    md: 'text-[13px] px-3 py-1 gap-2 font-semibold',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border leading-tight select-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
