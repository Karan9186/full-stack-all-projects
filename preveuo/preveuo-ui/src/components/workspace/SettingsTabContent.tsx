'use client';

import React, { useState } from 'react';
import { PRIMARY_COLOR } from '@/lib/constants/theme';
import { Button, Card, Badge, Input } from '@/components/ui';
import {
  Settings,
  Users,
  Palette,
  CreditCard,
  Globe,
  Shield,
  Save,
  UserPlus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { WORKSPACE_SETTINGS_MEMBERS } from '@/lib/workspaceDashboardData';

export const SettingsTabContent: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'team' | 'branding' | 'billing'>('general');
  const [workspaceName, setWorkspaceName] = useState('Acme Corporation');
  const [workspaceSlug, setWorkspaceSlug] = useState('acme-corp');
  const [brandColor, setBrandColor] = useState<string>(PRIMARY_COLOR);
  const [customDomain, setCustomDomain] = useState('demos.acme.co');
  const [whiteLabel, setWhiteLabel] = useState(true);
  const [members, setMembers] = useState(WORKSPACE_SETTINGS_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Editor');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const newMember = {
      id: `mem-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      avatarInitials: inviteEmail.substring(0, 2).toUpperCase(),
      status: 'Active',
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail('');
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-heading">
            Workspace Settings
          </h2>
          <p className="text-[13.5px] text-body font-normal mt-0.5">
            Manage organization members, custom domains, branding, and billing plans.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Save className="w-4 h-4" />}
          onClick={handleSave}
        >
          {isSaved ? 'Changes Saved ✓' : 'Save Changes'}
        </Button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-border-default mb-8 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubTab('general')}
          className={`flex items-center gap-2 px-4 py-3 text-[13.5px] border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'general'
              ? 'border-brand-purple text-brand-purple font-semibold'
              : 'border-transparent text-body font-medium hover:text-heading'
          }`}
        >
          <Settings className="w-4 h-4" /> General
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('team')}
          className={`flex items-center gap-2 px-4 py-3 text-[13.5px] border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'team'
              ? 'border-brand-purple text-brand-purple font-semibold'
              : 'border-transparent text-body font-medium hover:text-heading'
          }`}
        >
          <Users className="w-4 h-4" /> Team & Members ({members.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('branding')}
          className={`flex items-center gap-2 px-4 py-3 text-[13.5px] border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'branding'
              ? 'border-brand-purple text-brand-purple font-semibold'
              : 'border-transparent text-body font-medium hover:text-heading'
          }`}
        >
          <Palette className="w-4 h-4" /> Branding & Domains
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('billing')}
          className={`flex items-center gap-2 px-4 py-3 text-[13.5px] border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'billing'
              ? 'border-brand-purple text-brand-purple font-semibold'
              : 'border-transparent text-body font-medium hover:text-heading'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Plan & Billing
        </button>
      </div>

      {/* General Settings */}
      {activeSubTab === 'general' && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-6 rounded-2xl bg-white border border-border-default space-y-5">
            <h3 className="text-[17px] font-semibold text-heading">Workspace Profile</h3>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-dark text-white flex items-center justify-center font-bold text-xl">
                A
              </div>
              <div>
                <Button variant="outline" size="sm" leftIcon={<Upload className="w-4 h-4" />}>
                  Upload organization logo
                </Button>
                <p className="text-[11px] text-muted mt-1">Recommended 256x256 PNG or SVG.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-heading">Workspace Name</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-border-default text-[13px] text-heading focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-heading">Workspace URL Slug</label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 rounded-l-xl bg-light border border-r-0 border-border-default text-xs text-muted select-none">
                    preveuo.com/w/
                  </span>
                  <input
                    type="text"
                    value={workspaceSlug}
                    onChange={(e) => setWorkspaceSlug(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-r-xl bg-white border border-border-default text-[13px] text-heading focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-heading">Default Demo Privacy</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-border-default text-[13px] text-heading focus:outline-none focus:border-brand-purple">
                <option value="public">Public (Anyone with link can view and interact)</option>
                <option value="unlisted">Unlisted (Hidden from Google search indexing)</option>
                <option value="internal">Workspace Members Only (Requires Preveuo login)</option>
              </select>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-border-default space-y-4">
            <h3 className="text-[17px] font-semibold text-red-600">Danger Zone</h3>
            <p className="text-[13px] text-body font-normal">
              Permanently delete this workspace and all associated interactive demos, captured leads, and analytics data.
            </p>
            <Button variant="danger" size="sm">
              Delete Workspace
            </Button>
          </div>
        </div>
      )}

      {/* Team & Members */}
      {activeSubTab === 'team' && (
        <div className="space-y-6">
          {/* Invite Member Form */}
          <div className="p-6 rounded-2xl bg-white border border-border-default">
            <h3 className="text-[17px] font-semibold text-heading mb-4">Invite Team Members</h3>
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="colleague@acme.co"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-border-default text-[13px] text-heading focus:outline-none focus:border-brand-purple"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="px-3.5 py-2.5 rounded-xl bg-white border border-border-default text-[13px] text-heading focus:outline-none focus:border-brand-purple"
              >
                <option value="Admin">Admin (Can manage settings)</option>
                <option value="Editor">Editor (Can build demos)</option>
                <option value="Viewer">Viewer (Read-only access)</option>
              </select>
              <Button
                variant="primary"
                size="md"
                type="submit"
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                Send Invite
              </Button>
            </form>
          </div>

          {/* Members List Table */}
          <div className="p-6 rounded-2xl bg-white border border-border-default">
            <h3 className="text-[17px] font-semibold text-heading mb-4">Current Team Members</h3>

            <div className="divide-y divide-border-light">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-purple/15 text-brand-purple flex items-center justify-center font-bold text-xs shrink-0">
                      {member.avatarInitials}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold text-heading leading-tight">
                        {member.name}
                      </h4>
                      <p className="text-[12px] text-body font-normal leading-tight mt-0.5">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={member.role === 'Owner' ? 'purple' : 'default'}
                      size="sm"
                    >
                      {member.role}
                    </Badge>

                    {member.role !== 'Owner' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Branding & Custom Domains */}
      {activeSubTab === 'branding' && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-6 rounded-2xl bg-white border border-border-default space-y-5">
            <h3 className="text-[17px] font-semibold text-heading">Brand Theme & Colors</h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-heading">Primary Brand Accent</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-border-default cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-32 px-3 py-2 rounded-xl bg-white border border-border-default font-mono text-xs uppercase"
                />
                <span className="text-xs text-body font-normal">
                  Used for interactive hotspot pulses and CTA buttons in demo players.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border-light">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whiteLabel}
                  onChange={(e) => setWhiteLabel(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-purple focus:ring-brand-purple"
                />
                <div>
                  <span className="text-[13.5px] font-semibold text-heading block">
                    Remove Preveuo Branding (White-label)
                  </span>
                  <span className="text-xs text-body font-normal">
                    Hides the &quot;Powered by Preveuo&quot; footer watermark across all embedded demos.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-border-default space-y-4">
            <h3 className="text-[17px] font-semibold text-heading">Custom CNAME Domain</h3>
            <p className="text-[13px] text-body font-normal">
              Host all public demos under your own corporate subdomain with automated SSL certificate provisioning.
            </p>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-border-default text-[13px] text-heading font-mono"
              />
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> DNS Verified
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-canvas border border-border-light text-xs font-mono text-gray-600">
              CNAME: demos.acme.co &rarr; edge.preveuo.com
            </div>
          </div>
        </div>
      )}

      {/* Plan & Billing */}
      {activeSubTab === 'billing' && (
        <div className="space-y-6 max-w-4xl">
          {/* Current Plan Overview Card */}
          <div className="p-6 rounded-2xl bg-white border border-border-default">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-full">
                  Current Plan
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-heading mt-2">
                  Preveuo Pro Plan ($49 / month)
                </h3>
                <p className="text-xs text-body font-normal mt-1">
                  Billed annually. Next renewal date is November 1, 2026.
                </p>
              </div>

              <Button variant="primary" size="md">
                Upgrade to Enterprise
              </Button>
            </div>

            {/* Usage Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-border-light">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-body">Team Seats</span>
                  <span className="text-heading">4 of 10</span>
                </div>
                <div className="w-full h-2 bg-border-light rounded-full overflow-hidden">
                  <div className="w-[40%] h-full bg-brand-purple rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-body">Interactive Demos</span>
                  <span className="text-heading">6 / Unlimited</span>
                </div>
                <div className="w-full h-2 bg-border-light rounded-full overflow-hidden">
                  <div className="w-[15%] h-full bg-emerald-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-body">Viewer Impressions</span>
                  <span className="text-heading">18.4k / 50k</span>
                </div>
                <div className="w-full h-2 bg-border-light rounded-full overflow-hidden">
                  <div className="w-[36%] h-full bg-blue-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method & Invoices */}
          <div className="p-6 rounded-2xl bg-white border border-border-default">
            <h3 className="text-[17px] font-semibold text-heading mb-4">Payment Method</h3>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border-default mb-6">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-brand-purple" />
                <div>
                  <span className="text-sm font-semibold text-heading">Visa ending in 4242</span>
                  <p className="text-xs text-muted font-normal">Expires 08/2028 • Default payment card</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Edit Card
              </Button>
            </div>

            <h4 className="text-sm font-semibold text-heading mb-3">Invoice Receipts</h4>
            <div className="divide-y divide-border-light text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span>Oct 1, 2026 • Pro Plan Annual Subscription</span>
                <span className="font-semibold text-heading">$588.00 • <button className="text-brand-purple underline">Download PDF</button></span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span>Oct 1, 2025 • Pro Plan Annual Subscription</span>
                <span className="font-semibold text-heading">$588.00 • <button className="text-brand-purple underline">Download PDF</button></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
