'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Badge } from '@/components/ui';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Sliders,
  ExternalLink,
  Users,
  Trophy,
  MessageSquare,
  Sparkles,
  Check,
} from 'lucide-react';
import { WORKSPACE_NOTIFICATIONS } from '@/lib/workspaceDashboardData';

export const NotificationsTabContent: React.FC = () => {
  const [notifications, setNotifications] = useState(WORKSPACE_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'lead' | 'milestone' | 'mention' | 'system'>('all');

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter !== 'all') return n.type === activeFilter;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-heading">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <Badge variant="purple" size="md">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <p className="text-[13.5px] text-body font-normal mt-0.5">
            Real-time updates on high-intent lead conversions, view milestones, and team mentions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="md"
              leftIcon={<Check className="w-4 h-4" />}
              onClick={markAllRead}
            >
              Mark all as read
            </Button>
          )}
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Sliders className="w-4 h-4" />}
            onClick={() => {}}
          >
            Preferences
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {(['all', 'unread', 'lead', 'milestone', 'mention', 'system'] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${
              activeFilter === filter
                ? 'bg-brand-purple text-white shadow-xs'
                : 'bg-white border border-border-default text-body hover:text-heading hover:bg-canvas'
            }`}
          >
            {filter === 'all'
              ? 'All Notifications'
              : filter === 'lead'
              ? 'Leads'
              : filter === 'milestone'
              ? 'Milestones'
              : filter === 'mention'
              ? 'Mentions'
              : filter}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-border-default overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-border-light text-muted flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-heading mb-1">All caught up!</h4>
            <p className="text-xs text-body font-normal">
              There are no {activeFilter !== 'all' ? activeFilter : ''} notifications right now.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {filteredNotifications.map((notif) => {
              const isLead = notif.type === 'lead';
              const isMilestone = notif.type === 'milestone';
              const isMention = notif.type === 'mention';

              return (
                <div
                  key={notif.id}
                  className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                    !notif.isRead ? 'bg-brand-purple/[0.03]' : 'hover:bg-canvas'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Icon or Avatar */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isLead
                          ? 'bg-emerald-50 text-emerald-600'
                          : isMilestone
                          ? 'bg-amber-50 text-amber-600'
                          : isMention
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-border-light text-gray-600'
                      }`}
                    >
                      {isLead ? (
                        <Users className="w-5 h-5" />
                      ) : isMilestone ? (
                        <Trophy className="w-5 h-5" />
                      ) : isMention ? (
                        <MessageSquare className="w-5 h-5" />
                      ) : (
                        <Bell className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-[13.5px] font-semibold text-heading leading-tight">
                          {notif.title}
                        </h4>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-brand-purple shrink-0" />
                        )}
                      </div>

                      <p className="text-[13px] text-body font-normal leading-relaxed mb-2">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-muted font-normal">
                        <span>{notif.timestamp}</span>
                        <span>•</span>
                        <span className="capitalize font-medium text-brand-purple">
                          {notif.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleRead(notif.id)}
                      className="p-1.5 rounded-lg text-muted hover:text-brand-purple hover:bg-border-light transition-colors"
                      title={notif.isRead ? 'Mark as unread' : 'Mark as read'}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteNotification(notif.id)}
                      className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
