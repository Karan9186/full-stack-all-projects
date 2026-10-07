'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { Search, Bell, Plus } from 'lucide-react';

interface WorkspaceNavbarProps {
  pageTitle?: string;
  onCreateDemo: () => void;
}

export const WorkspaceNavbar: React.FC<WorkspaceNavbarProps> = ({
  pageTitle = 'Home',
  onCreateDemo,
}) => {
  return (
    <header className="h-16 bg-white border-b border-[#e5e7eb] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Breadcrumbs & Page title */}
      <div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f87171]" />
          <span className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-[#9ca3af]">
            MARKETING WORKSPACE
          </span>
        </div>
        <h1 className="text-[19px] font-extrabold tracking-tight text-[#0f0f1a] leading-tight mt-0.5">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Search, Notification Bell, Create Demo */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-[#fafafc] border border-[#e5e7eb] text-[#0f0f1a] placeholder-[#9ca3af] focus:outline-none focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/15 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[#9ca3af] bg-white border border-[#e5e7eb] rounded">
            /
          </kbd>
        </div>

        {/* Bell Button */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-xl border border-[#e5e7eb] bg-white text-[#4b5563] hover:text-[#0f0f1a] hover:bg-[#fafafc] transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#5B5CE2]" />
        </button>

        {/* Create Demo CTA */}
        <Button
          variant="primary"
          size="md"
          onClick={onCreateDemo}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create demo
        </Button>
      </div>
    </header>
  );
};
