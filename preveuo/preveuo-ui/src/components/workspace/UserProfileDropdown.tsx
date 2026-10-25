'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Settings,
  Building,
  Check,
  Plus,
  HelpCircle,
  Keyboard,
  Moon,
  Sparkles,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { authService } from '@/lib/api/authService';
import { AuthSession } from '@/types/auth';

export interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: string) => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = authService.getStoredSession();
      if (stored) {
        setSession(stored);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    onClose();
    await authService.logout();
  };

  if (!isOpen) return null;

  const userName = session?.user?.fullName || 'Karan Shah';
  const userEmail = session?.user?.email || 'karan@acme.co';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'KS';
  const workspaceName = session?.workspaceName || 'Acme Corporation';
  const roleName = session?.user?.role ? `${session.user.role.toUpperCase()}` : 'OWNER';

  return (
    <div
      ref={menuRef}
      className="absolute bottom-16 left-3 w-72 bg-white rounded-2xl border border-border-default shadow-xl z-50 p-2 text-heading animate-in fade-in zoom-in-95 duration-150"
    >
      {/* User Header Profile */}
      <div className="p-3 border-b border-border-light mb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-purple/15 text-brand-purple flex items-center justify-center font-bold text-sm shrink-0">
            {userInitials}
          </div>
          <div className="min-w-0">
            <h4 className="text-[13.5px] font-semibold text-heading truncate leading-tight">
              {userName}
            </h4>
            <p className="text-[11.5px] text-body font-normal truncate leading-tight mt-0.5">
              {userEmail}
            </p>
            <span className="inline-block text-[10.5px] font-medium text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full mt-1.5 tracking-wide">
              Workspace {roleName} • Pro
            </span>
          </div>
        </div>
      </div>

      {/* Switch Workspace Section */}
      <div className="px-2 py-1.5">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted px-2 py-1">
          Switch Workspace
        </div>
        <button
          type="button"
          onClick={() => onClose()}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[12.5px] font-semibold text-heading hover:bg-light transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-dark text-white flex items-center justify-center text-[10px] font-bold">
              {workspaceName[0]}
            </div>
            <span className="truncate">{workspaceName}</span>
          </div>
          <Check className="w-3.5 h-3.5 text-brand-purple shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => onClose()}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[12.5px] font-medium text-body hover:text-heading hover:bg-light transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-border-light text-body flex items-center justify-center text-[10px] font-medium">
              P
            </div>
            <span>Personal Workspace</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            window.location.href = '/register';
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[12px] font-medium text-brand-purple hover:bg-brand-purple/10 transition-colors mt-0.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create workspace</span>
        </button>
      </div>

      <div className="border-t border-border-light my-1" />

      {/* Quick Navigation Links */}
      <div className="px-1 space-y-0.5">
        <button
          type="button"
          onClick={() => {
            onClose();
            if (onSelectTab) onSelectTab('settings');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:text-heading hover:bg-light transition-colors text-left cursor-pointer"
        >
          <Settings className="w-4 h-4 text-muted" />
          <span>Account & Settings</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            if (onSelectTab) onSelectTab('help');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:text-heading hover:bg-light transition-colors text-left cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-muted" />
          <span>Help & Documentation</span>
        </button>

        <button
          type="button"
          onClick={() => onClose()}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:text-heading hover:bg-light transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-4 h-4 text-muted" />
            <span>Shortcuts</span>
          </div>
          <span className="text-[10px] font-mono text-muted bg-border-light px-1.5 py-0.5 rounded">
            ⌘K
          </span>
        </button>
      </div>

      <div className="border-t border-border-light my-1" />

      {/* Logout */}
      <div className="px-1">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};
