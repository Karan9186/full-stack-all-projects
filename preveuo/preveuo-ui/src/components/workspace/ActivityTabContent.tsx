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
          <h2 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-[#0f0f1a]">
            Activity & Audit Log
          </h2>
          <p className="text-[14px] text-[#6b7280] mt-0.5">
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
      <div className="p-4 rounded-2xl bg-white border border-[#e5e7eb] mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Member Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#6b7280]">Member:</span>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#f8f8fc] border border-[#e5e7eb] text-xs font-medium text-[#0f0f1a] focus:outline-none focus:border-[#5B5CE2]"
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
            <span className="text-xs font-semibold text-[#6b7280]">Event:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#f8f8fc] border border-[#e5e7eb] text-xs font-medium text-[#0f0f1a] focus:outline-none focus:border-[#5B5CE2]"
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
          <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity log..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-[#f8f8fc] border border-[#e5e7eb] text-xs text-[#0f0f1a] placeholder-[#9ca3af] focus:outline-none focus:border-[#5B5CE2]"
          />
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
        <div className="p-4 bg-[#fafafc] border-b border-[#f0f0f4] flex items-center justify-between text-xs font-semibold text-[#6b7280]">
          <span>Audit Events ({filteredActivities.length})</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Past 30 Days
          </span>
        </div>

        <div className="divide-y divide-[#f0f0f4]">
          {filteredActivities.map((act) => {
            const isLead = act.action.includes('captured');
            const isPublish = act.action.includes('published');
            const isEdit = act.action.includes('edited');

            return (
              <div
                key={act.id}
                className="p-5 hover:bg-[#fafafc] transition-colors flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isLead
                        ? 'bg-emerald-50 text-emerald-600'
                        : isPublish
                        ? 'bg-[#5B5CE2]/10 text-[#5B5CE2]'
                        : 'bg-[#f0f0f4] text-[#4b5563]'
                    }`}
                  >
                    {act.avatarInitials}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[13.5px] text-[#0f0f1a] leading-snug">
                      <span className="font-bold">{act.user}</span>{' '}
                      <span className="text-[#6b7280]">{act.action}</span>{' '}
                      <span className="font-semibold text-[#5B5CE2] hover:underline cursor-pointer">
                        {act.demoName}
                      </span>
                    </p>

                    <p className="text-[12.5px] text-[#6b7280] mt-1 bg-[#f8f8fc] p-2 rounded-lg border border-[#f0f0f4]">
                      {act.details}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] text-[#9ca3af] font-medium">{act.timeAgo}</span>
                      <span className="text-[#d1d5db]">•</span>
                      <span className="text-[11px] text-[#6b7280] flex items-center gap-1 font-mono">
                        ID: {act.id}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/workspace?tab=demos"
                  className="text-[#9ca3af] hover:text-[#5B5CE2] p-2 rounded-lg hover:bg-[#f0f0f4] transition-colors shrink-0"
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
