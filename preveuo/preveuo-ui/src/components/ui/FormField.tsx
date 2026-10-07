import React from 'react';

/**
 * FormField Primitives
 *
 * Implements Rules 11, 12, 13 of Common UI Component Architecture Rules:
 * - Consistent label layout
 * - Standardized error messages with iconography
 * - Standardized description / helper text
 */

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormField: React.FC<FormFieldProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  required,
  className = '',
  ...props
}) => {
  return (
    <label
      className={`block text-[13px] font-semibold text-[#0f0f1a] select-none ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-[#5B5CE2] ml-1">*</span>}
    </label>
  );
};

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormDescription: React.FC<FormDescriptionProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <p className={`text-[12px] text-[#6b7280] leading-normal ${className}`} {...props}>
      {children}
    </p>
  );
};

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormError: React.FC<FormErrorProps> = ({
  children,
  className = '',
  ...props
}) => {
  if (!children) return null;

  return (
    <p
      className={`text-[12px] font-medium text-red-600 flex items-center gap-1.5 mt-0.5 ${className}`}
      role="alert"
      {...props}
    >
      <svg
        className="w-3.5 h-3.5 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16" r="0.75" fill="currentColor" strokeWidth="1" />
      </svg>
      <span>{children}</span>
    </p>
  );
};
