import React from 'react';

/**
 * EmptyState
 *
 * Implements Rule 24 of Common UI Component Architecture Rules:
 * Consistent empty state display with icon, title, description, and action button.
 */
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-[#d1d5db] bg-[#fafafc] ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#5B5CE2]/10 text-[#5B5CE2] flex items-center justify-center mb-4">
        {icon || (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>

      <h4 className="text-[16px] sm:text-[18px] font-bold text-[#0f0f1a] tracking-tight">
        {title}
      </h4>

      {description && (
        <p className="text-[13.5px] sm:text-[14px] text-[#6b7280] max-w-sm mt-1.5 leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
