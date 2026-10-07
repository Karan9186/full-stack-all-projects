'use client';

import React, { createContext, useContext, useState } from 'react';

/**
 * Tabs System
 *
 * Implements Rule 21 of Common UI Component Architecture Rules:
 * Accessible tab switcher following Preveuo Design System.
 */

interface TabsContextValue {
  value: string;
  onValueChange: (val: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className = '',
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = (val: string) => {
    if (!isControlled) {
      setUncontrolledValue(val);
    }
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
      <div className={`flex flex-col gap-4 w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div
      role="tablist"
      className={`inline-flex items-center gap-1 p-1 bg-[#f0f0f4] rounded-xl self-start ${className}`}
    >
      {children}
    </div>
  );
};

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  disabled = false,
  className = '',
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const isSelected = context.value === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isSelected}
      disabled={disabled}
      onClick={() => context.onValueChange(value)}
      className={`
        px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-150 select-none
        ${
          isSelected
            ? 'bg-white text-[#0f0f1a] shadow-2xs'
            : 'text-[#6b7280] hover:text-[#0f0f1a] hover:bg-white/50'
        }
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = '',
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  if (context.value !== value) return null;

  return (
    <div role="tabpanel" tabIndex={0} className={`outline-none ${className}`}>
      {children}
    </div>
  );
};
