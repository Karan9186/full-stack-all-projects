'use client';

import React, { useState } from 'react';
import { Button, Card, Badge, Input } from '@/components/ui';
import {
  Search,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Zap,
  SlidersHorizontal,
  Key,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { WORKSPACE_INTEGRATIONS } from '@/lib/workspaceDashboardData';
import { IntegrationItem } from '@/types';

export const IntegrationsTabContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'CRM' | 'Analytics' | 'Productivity' | 'Automation'>('all');
  const [integrationsList, setIntegrationsList] = useState<IntegrationItem[]>(WORKSPACE_INTEGRATIONS);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookSuccess, setWebhookSuccess] = useState(false);

  const toggleConnection = (id: string) => {
    setIntegrationsList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'connected' ? 'available' : 'connected';
          return {
            ...item,
            status: nextStatus,
            lastSync: nextStatus === 'connected' ? 'Just now' : undefined,
          };
        }
        return item;
      })
    );
  };

  const filteredIntegrations = integrationsList.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('prev_live_sk98f21908234857bva02');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleTestWebhook = () => {
    setIsTestingWebhook(true);
    setTimeout(() => {
      setIsTestingWebhook(false);
      setWebhookSuccess(true);
      setTimeout(() => setWebhookSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-[#0f0f1a]">
            Integrations & Apps
          </h2>
          <p className="text-[14px] text-[#6b7280] mt-0.5">
            Connect Preveuo with your tech stack to automate lead routing, analytics, and CRM data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={() => {}}
          >
            Sync all
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Zap className="w-4 h-4" />}
          >
            Request integration
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white border border-[#e5e7eb] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5B5CE2]/10 text-[#5B5CE2] flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#9ca3af]">Connected</div>
            <div className="text-xl font-black text-[#0f0f1a]">3 Active</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e5e7eb] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#9ca3af]">Leads Synced</div>
            <div className="text-xl font-black text-[#0f0f1a]">1,248</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e5e7eb] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#9ca3af]">Webhook Events</div>
            <div className="text-xl font-black text-[#0f0f1a]">42.1k / mo</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e5e7eb] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#9ca3af]">API Status</div>
            <div className="text-xl font-black text-[#0f0f1a]">99.98%</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
          {(['all', 'CRM', 'Analytics', 'Productivity', 'Automation'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#5B5CE2] text-white shadow-xs'
                  : 'bg-white border border-[#e5e7eb] text-[#6b7280] hover:text-[#0f0f1a] hover:bg-[#fafafc]'
              }`}
            >
              {cat === 'all' ? 'All Integrations' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#e5e7eb] text-[13px] text-[#0f0f1a] placeholder-[#9ca3af] focus:outline-none focus:border-[#5B5CE2] focus:ring-1 focus:ring-[#5B5CE2] transition-colors"
          />
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {filteredIntegrations.map((item) => {
          const isConnected = item.status === 'connected';
          const isConfigured = item.status === 'configured';

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#d1d5db] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#f8f8fc] border border-[#f0f0f4] flex items-center justify-center font-black text-sm text-[#0f0f1a]">
                      {item.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-[#0f0f1a] flex items-center gap-2">
                        {item.name}
                        {isConnected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </h4>
                      <span className="text-[11px] font-semibold text-[#5B5CE2] uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant={isConnected ? 'success' : isConfigured ? 'warning' : 'default'}
                    size="sm"
                  >
                    {isConnected ? 'Connected' : isConfigured ? 'Configured' : 'Available'}
                  </Badge>
                </div>

                <p className="text-[13px] text-[#6b7280] leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#f0f0f4] flex items-center justify-between">
                <span className="text-[11px] text-[#9ca3af] font-medium">
                  {item.lastSync || 'Not connected'}
                </span>

                <Button
                  variant={isConnected ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => toggleConnection(item.id)}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Developer API & Webhooks Section */}
      <div className="p-6 rounded-2xl bg-white border border-[#e5e7eb]">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#5B5CE2]/10 text-[#5B5CE2] flex items-center justify-center">
            <Key className="w-4 h-4" />
          </div>
          <h3 className="text-[18px] font-bold text-[#0f0f1a]">Developer API & Webhooks</h3>
        </div>
        <p className="text-[13.5px] text-[#6b7280] mb-6">
          Stream real-time demo events directly to your endpoint or ingest Preveuo metrics programmatically.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Key */}
          <div className="space-y-2">
            <label className="text-[12.5px] font-bold text-[#0f0f1a]">Live Workspace API Key</label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                readOnly
                value="prev_live_sk98f21908234857bva02"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#f8f8fc] border border-[#e5e7eb] font-mono text-[13px] text-[#0f0f1a] select-all"
              />
              <Button
                variant="outline"
                size="md"
                onClick={handleCopyApiKey}
                leftIcon={copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              >
                {copiedKey ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <p className="text-[11px] text-[#9ca3af]">
              Keep your secret key confidential. Read our{' '}
              <a href="/resources" className="text-[#5B5CE2] underline font-medium">
                REST API Docs
              </a>
              .
            </p>
          </div>

          {/* Webhook Endpoint */}
          <div className="space-y-2">
            <label className="text-[12.5px] font-bold text-[#0f0f1a]">Webhook Endpoint URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                defaultValue="https://api.acme.co/v1/webhooks/preveuo"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e7eb] text-[13px] text-[#0f0f1a] focus:outline-none focus:border-[#5B5CE2]"
              />
              <Button
                variant="secondary"
                size="md"
                isLoading={isTestingWebhook}
                onClick={handleTestWebhook}
              >
                {webhookSuccess ? 'Payload Sent ✓' : 'Test Ping'}
              </Button>
            </div>
            <p className="text-[11px] text-[#9ca3af]">
              Events triggered: `lead.captured`, `demo.completed`, `step.dropoff`.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
