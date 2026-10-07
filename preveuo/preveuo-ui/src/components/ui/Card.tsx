import React from 'react';

/**
 * Card System
 *
 * Implements Rule 15 of Common UI Component Architecture Rules:
 * Composable card components matching Preveuo Design System.
 */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hoverEffect = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-2xl border border-[#e5e7eb] bg-white shadow-2xs overflow-hidden
          ${hoverEffect ? 'hover:shadow-md hover:border-[#d1d5db] transition-all duration-200' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`p-6 pb-4 flex flex-col gap-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <h3
      className={`text-[17px] sm:text-[18px] font-bold text-[#0f0f1a] tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <p className={`text-[13.5px] text-[#6b7280] leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`p-6 pt-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`p-6 pt-4 border-t border-[#f0f0f4] bg-[#fafafc] flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
