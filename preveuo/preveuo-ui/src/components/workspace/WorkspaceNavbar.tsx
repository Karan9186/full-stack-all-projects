'use client';

import React from 'react';
import { Search, Bell } from 'lucide-react';

interface WorkspaceNavbarProps {
  pageTitle?: string;
  onCreateDemo?: () => void;
}

export const WorkspaceNavbar: React.FC<WorkspaceNavbarProps> = ({
  pageTitle = 'Home',
}) => {
  return (
    <header className="h-16 bg-white border-b border-border-default px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* Left: Breadcrumbs & Page title */}
      <div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-body">
            MARKETING WORKSPACE
          </span>
        </div>
        <h1 className="text-[19px] sm:text-[20px] font-bold tracking-[-0.02em] text-heading leading-tight mt-0.5">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Search & Notification Bell */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-canvas border border-border-default text-heading placeholder-muted focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-muted bg-white border border-border-default rounded">
            /
          </kbd>
        </div>

        {/* Bell Button */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-xl border border-border-default bg-white text-gray-600 hover:text-heading hover:bg-canvas transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-purple" />
        </button>
      </div>
    </header>
  );
};
