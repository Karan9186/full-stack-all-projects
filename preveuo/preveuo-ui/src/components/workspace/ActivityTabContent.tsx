'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Card, Badge } from '@/components/ui';
import {
  Activity,
  Search,
  Filter,
  Download,
  Calendar,
  ExternalLink,
  UserCheck,
  CheckCircle2,
  FileEdit,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { WORKSPACE_FULL_ACTIVITY } from '@/lib/workspaceDashboardData';

export const ActivityTabContent: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActivities = WORKSPACE_FULL_ACTIVITY.filter((item) => {
    if (selectedUser !== 'all' && item.user !== selectedUser) return false;
    if (
      searchTerm &&
      !item.demoName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.user.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.details.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-heading">
            Activity & Audit Log
          </h2>
          <p className="text-[13.5px] text-body font-normal mt-0.5">
            Full compliance audit trail of all demo edits, publications, integrations, and leads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => {}}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-border-default mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Member Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-body">Member:</span>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-light border border-border-default text-xs font-medium text-heading focus:outline-none focus:border-brand-purple"
            >
              <option value="all">All Members (4)</option>
              <option value="Karan Shah">Karan Shah (Owner)</option>
              <option value="Sarah Jenkins">Sarah Jenkins (Admin)</option>
              <option value="Alex Chen">Alex Chen (Editor)</option>
              <option value="David Ross">David Ross (Viewer)</option>
            </select>
          </div>

          {/* Event Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-body">Event:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-light border border-border-default text-xs font-medium text-heading focus:outline-none focus:border-brand-purple"
            >
              <option value="all">All Events</option>
              <option value="published">Publications</option>
              <option value="edited">Edits & Hotspots</option>
              <option value="leads">Lead Captures</option>
              <option value="integrations">Integrations</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity log..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-light border border-border-default text-xs text-heading placeholder-muted focus:outline-none focus:border-brand-purple"
          />
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-2xl border border-border-default overflow-hidden">
        <div className="p-4 bg-canvas border-b border-border-light flex items-center justify-between text-xs font-medium text-body">
          <span>Audit Events ({filteredActivities.length})</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Past 30 Days
          </span>
        </div>

        <div className="divide-y divide-border-light">
          {filteredActivities.map((act) => {
            const isLead = act.action.includes('captured');
            const isPublish = act.action.includes('published');
            const isEdit = act.action.includes('edited');

            return (
              <div
                key={act.id}
                className="p-5 hover:bg-canvas transition-colors flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isLead
                        ? 'bg-emerald-50 text-emerald-600'
                        : isPublish
                        ? 'bg-brand-purple/10 text-brand-purple'
                        : 'bg-border-light text-gray-600'
                    }`}
                  >
                    {act.avatarInitials}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[13.5px] text-heading leading-snug">
                      <span className="font-semibold">{act.user}</span>{' '}
                      <span className="text-body font-normal">{act.action}</span>{' '}
                      <span className="font-medium text-brand-purple hover:underline cursor-pointer">
                        {act.demoName}
                      </span>
                    </p>

                    <p className="text-[12.5px] text-body font-normal mt-1 bg-light p-2 rounded-lg border border-border-light">
                      {act.details}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] text-muted font-normal">{act.timeAgo}</span>
                      <span className="text-border-input">•</span>
                      <span className="text-[11px] text-body font-normal flex items-center gap-1 font-mono">
                        ID: {act.id}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/workspace?tab=demos"
                  className="text-muted hover:text-brand-purple p-2 rounded-lg hover:bg-border-light transition-colors shrink-0"
                  title="View Item"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
