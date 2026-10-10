import React from 'react';

/**
 * PageHeader
 *
 * Implements Rule 28 of Common UI Component Architecture Rules:
 * Shared page header component providing consistent title, description, and action buttons.
 */
export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#e5e7eb] ${className}`}
    >
      <div className="flex flex-col gap-1.5 max-w-2xl">
        {breadcrumbs && <div className="mb-1">{breadcrumbs}</div>}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-[-0.025em] text-[#0f0f1a] leading-tight">
            {title}
          </h1>
          {badge && <div>{badge}</div>}
        </div>
        {description && (
          <p className="text-[13.5px] sm:text-[14px] text-[#6b7280] font-normal leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
};
