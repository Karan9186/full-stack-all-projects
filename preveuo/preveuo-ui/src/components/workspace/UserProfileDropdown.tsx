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
      className="absolute bottom-16 left-3 w-72 bg-white rounded-2xl border border-[#e5e7eb] shadow-xl z-50 p-2 text-[#0f0f1a] animate-in fade-in zoom-in-95 duration-150"
    >
      {/* User Header Profile */}
      <div className="p-3 border-b border-[#f0f0f4] mb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#5B5CE2]/15 text-[#5B5CE2] flex items-center justify-center font-bold text-sm shrink-0">
            {userInitials}
          </div>
          <div className="min-w-0">
            <h4 className="text-[13.5px] font-semibold text-[#0f0f1a] truncate leading-tight">
              {userName}
            </h4>
            <p className="text-[11.5px] text-[#6b7280] font-normal truncate leading-tight mt-0.5">
              {userEmail}
            </p>
            <span className="inline-block text-[10.5px] font-medium text-[#5B5CE2] bg-[#5B5CE2]/10 px-2 py-0.5 rounded-full mt-1.5 tracking-wide">
              Workspace {roleName} • Pro
            </span>
          </div>
        </div>
      </div>

      {/* Switch Workspace Section */}
      <div className="px-2 py-1.5">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#9ca3af] px-2 py-1">
          Switch Workspace
        </div>
        <button
          type="button"
          onClick={() => onClose()}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[12.5px] font-semibold text-[#0f0f1a] hover:bg-[#f8f8fc] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#0f0f1a] text-white flex items-center justify-center text-[10px] font-bold">
              {workspaceName[0]}
            </div>
            <span className="truncate">{workspaceName}</span>
          </div>
          <Check className="w-3.5 h-3.5 text-[#5B5CE2] shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => onClose()}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[12.5px] font-medium text-[#6b7280] hover:text-[#0f0f1a] hover:bg-[#f8f8fc] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#f0f0f4] text-[#6b7280] flex items-center justify-center text-[10px] font-medium">
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
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[12px] font-medium text-[#5B5CE2] hover:bg-[#5B5CE2]/10 transition-colors mt-0.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create workspace</span>
        </button>
      </div>

      <div className="border-t border-[#f0f0f4] my-1" />

      {/* Quick Navigation Links */}
      <div className="px-1 space-y-0.5">
        <button
          type="button"
          onClick={() => {
            onClose();
            if (onSelectTab) onSelectTab('settings');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-[#374151] hover:text-[#0f0f1a] hover:bg-[#f8f8fc] transition-colors text-left cursor-pointer"
        >
          <Settings className="w-4 h-4 text-[#9ca3af]" />
          <span>Account & Settings</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            if (onSelectTab) onSelectTab('help');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-[#374151] hover:text-[#0f0f1a] hover:bg-[#f8f8fc] transition-colors text-left cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-[#9ca3af]" />
          <span>Help & Documentation</span>
        </button>

        <button
          type="button"
          onClick={() => onClose()}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium text-[#374151] hover:text-[#0f0f1a] hover:bg-[#f8f8fc] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-4 h-4 text-[#9ca3af]" />
            <span>Shortcuts</span>
          </div>
          <span className="text-[10px] font-mono text-[#9ca3af] bg-[#f0f0f4] px-1.5 py-0.5 rounded">
            ⌘K
          </span>
        </button>
      </div>

      <div className="border-t border-[#f0f0f4] my-1" />

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
