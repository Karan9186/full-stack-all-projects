'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  PlaySquare,
  Folder,
  LayoutTemplate,
  BarChart3,
  Users,
  Image as ImageIcon,
  SlidersHorizontal,
  Sparkles,
  Activity,
  HelpCircle,
  Bell,
  Settings,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';
import { UserProfileDropdown } from './UserProfileDropdown';
import { authService } from '@/lib/api/authService';
import { AuthSession } from '@/types/auth';

interface WorkspaceSidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  activeTab = 'home',
  onSelectTab,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = authService.getStoredSession();
      if (stored) {
        setSession(stored);
      }
    }
  }, []);

  const primaryNav = [
    { id: 'home', label: 'Home', href: '/workspace?tab=home', icon: Home },
    { id: 'demos', label: 'Demos', href: '/workspace?tab=demos', icon: PlaySquare },
    { id: 'collections', label: 'Collections', href: '/workspace?tab=collections', icon: Folder },
    { id: 'templates', label: 'Templates', href: '/workspace?tab=templates', icon: LayoutTemplate },
    { id: 'analytics', label: 'Analytics', href: '/workspace?tab=analytics', icon: BarChart3 },
    { id: 'audience', label: 'Audience', href: '/workspace?tab=audience', icon: Users, badge: '24' },
    { id: 'assets', label: 'Assets', href: '/workspace?tab=assets', icon: ImageIcon },
    { id: 'integrations', label: 'Integrations', href: '/workspace?tab=integrations', icon: SlidersHorizontal },
    { id: 'ai-studio', label: 'AI Studio', href: '/workspace?tab=ai-studio', icon: Sparkles, badge: 'NEW', badgeColor: 'bg-brand-purple/10 text-brand-purple' },
    { id: 'activity', label: 'Activity', href: '/workspace?tab=activity', icon: Activity },
  ];

  const secondaryNav = [
    { id: 'help', label: 'Help & resources', href: '/workspace?tab=help', icon: HelpCircle },
    { id: 'notifications', label: 'Notifications', href: '/workspace?tab=notifications', icon: Bell, badge: '2' },
    { id: 'settings', label: 'Settings', href: '/workspace?tab=settings', icon: Settings },
  ];

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    if (onSelectTab) {
      e.preventDefault();
      onSelectTab(id);
    }
  };

  const wsName = session?.workspaceName || 'Acme Corporation';
  const usrName = session?.user?.fullName || 'Karan Shah';
  const usrEmail = session?.user?.email || 'karan@acme.co';
  const usrInitials = usrName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'KS';

  return (
    <aside className="w-64 bg-white border-r border-border-default flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-purple flex items-center justify-center text-white font-black text-sm shadow-xs">
            P
          </div>
          <span className="text-[17px] font-extrabold tracking-tight text-heading">
            PREVEUO
          </span>
        </div>

        {/* Workspace Switcher Card */}
        <div className="px-4 mb-4">
          <button
            type="button"
            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-border-default hover:border-border-input bg-canvas transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-dark text-white flex items-center justify-center font-bold text-xs shrink-0">
                {wsName[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="text-[13px] font-bold text-heading truncate leading-tight">
                  {wsName}
                </h4>
                <p className="text-[11px] text-body truncate leading-tight mt-0.5">
                  Marketing workspace
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted shrink-0 ml-1" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 space-y-0.5">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(item.id, e)}
                className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] transition-all ${
                  isActive
                    ? 'bg-border-light text-heading font-semibold'
                    : 'text-gray-600 font-medium hover:text-heading hover:bg-light'
                }`}
              >
                {isActive && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-purple rounded-r-full" />
                )}
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-heading' : 'text-body'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-border-light text-body'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-border-light space-y-1 relative">
        {secondaryNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(item.id, e)}
              className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] transition-colors ${
                isActive
                  ? 'bg-border-light text-heading font-semibold'
                  : 'text-gray-600 font-medium hover:text-heading hover:bg-light'
              }`}
            >
              {isActive && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-purple rounded-r-full" />
              )}
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-heading' : 'text-body'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-purple text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* User Card with 3-dot Dropdown */}
        <div className="pt-2 mt-2 border-t border-border-light relative">
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-light transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-xs shrink-0">
                {usrInitials}
              </div>
              <div className="min-w-0">
                <h5 className="text-[13px] font-semibold text-heading truncate leading-tight">
                  {usrName}
                </h5>
                <p className="text-[11.5px] text-body truncate leading-tight mt-0.5">
                  {usrEmail}
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Profile options"
              onClick={(e) => {
                e.stopPropagation();
                setIsProfileOpen(!isProfileOpen);
              }}
              className="text-muted hover:text-heading p-1.5 rounded-lg hover:bg-border-default/50 transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Floating Popover */}
          <UserProfileDropdown
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            onSelectTab={onSelectTab}
          />
        </div>
      </div>
    </aside>
  );
};
