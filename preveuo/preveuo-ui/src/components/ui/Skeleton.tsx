import React from 'react';

/**
 * Skeleton Primitives
 *
 * Implements Rule 23 of Common UI Component Architecture Rules:
 * Standardized loading skeleton primitives to prevent layout shifts.
 */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  rounded = 'md',
  ...props
}) => {
  const roundedStyles = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`animate-pulse bg-[#f0f0f4] ${roundedStyles[rounded]} ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-6 rounded-2xl border border-[#e5e7eb] bg-white flex flex-col gap-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton rounded="full" className="w-10 h-10 shrink-0" />
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton rounded="xl" className="h-32 w-full" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-8 w-20 rounded-xl" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number; className?: string }> = ({
  rows = 5,
  columns = 4,
  className = '',
}) => {
  return (
    <div className={`w-full rounded-2xl border border-[#e5e7eb] bg-white overflow-hidden ${className}`}>
      <div className="p-4 border-b border-[#f0f0f4] flex gap-4 bg-[#fafafc]">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-[#f0f0f4]">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
