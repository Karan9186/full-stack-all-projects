'use client';

import React, { useState } from 'react';
import { Button, Card, Badge } from '@/components/ui';
import {
  Sparkles,
  Wand2,
  Mic,
  Languages,
  Eye,
  Sliders,
  Play,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Zap,
} from 'lucide-react';

export const AiStudioTabContent: React.FC = () => {
  const [prompt, setPrompt] = useState(
    'Create a 6-step interactive onboarding walkthrough for our new SaaS billing & subscription management portal.'
  );
  const [tone, setTone] = useState<'professional' | 'punchy' | 'conversational' | 'technical'>('punchy');
  const [targetAudience, setTargetAudience] = useState('New Customers');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationSuccess(true);
      setTimeout(() => setGenerationSuccess(false), 4000);
    }, 1800);
  };

  const aiGenerations = [
    {
      id: 'gen-1',
      title: 'Billing Portal Setup Tour',
      prompt: 'Create 6-step billing & subscription onboarding guide',
      date: '10 minutes ago',
      steps: 6,
      tokens: '1,420 tokens',
      status: 'Ready',
    },
    {
      id: 'gen-2',
      title: 'Enterprise SSO Walkthrough',
      prompt: 'Automated SAML & Okta configuration tutorial with callouts',
      date: 'Yesterday',
      steps: 8,
      tokens: '2,150 tokens',
      status: 'Ready',
    },
    {
      id: 'gen-3',
      title: 'Lead Routing Automations',
      prompt: 'Explain webhook triggering and CRM property sync',
      date: '3 days ago',
      steps: 5,
      tokens: '980 tokens',
      status: 'Ready',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#5B5CE2] bg-[#5B5CE2]/10 px-2.5 py-0.5 rounded-full">
              Preveuo Intelligence 2.0
            </span>
          </div>
          <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#0f0f1a]">
            AI Studio
          </h2>
          <p className="text-[13.5px] text-[#6b7280] font-normal mt-0.5">
            Transform product URLs, release notes, and text prompts into interactive guided experiences.
          </p>
        </div>

        {/* AI Credits Badge */}
        <div className="p-3 rounded-xl bg-white border border-[#e5e7eb] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#5B5CE2]/10 text-[#5B5CE2] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10.5px] font-medium uppercase tracking-wider text-[#9ca3af]">AI Token Balance</div>
            <div className="text-[13px] font-semibold text-[#0f0f1a]">16,550 / 25,000 remaining</div>
          </div>
        </div>
      </div>

      {/* Main AI Generator Studio Box */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-white via-white to-[#f8f8fc] border border-[#e5e7eb] shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5B5CE2]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 text-[#5B5CE2] text-xs font-semibold uppercase tracking-wider mb-2">
            <Wand2 className="w-4 h-4" /> Prompt-to-Demo Generator
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#0f0f1a] mb-2">
            Describe what you want to showcase
          </h3>
          <p className="text-[13.5px] text-[#6b7280] font-normal mb-5">
            Preveuo AI will generate step sequences, hotspots, callout copies, and interactive action buttons automatically.
          </p>

          {/* Prompt Area */}
          <div className="mb-4">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Walk the user through inviting 5 teammates, setting up role permissions, and generating an API key..."
              className="w-full p-4 rounded-2xl bg-white border border-[#e5e7eb] text-[13.5px] text-[#0f0f1a] focus:outline-none focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/20 resize-none transition-all shadow-inner"
            />
          </div>

          {/* Generator Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4b5563] mb-2">
                Narrative Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['punchy', 'professional', 'conversational', 'technical'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${
                      tone === t
                        ? 'bg-[#5B5CE2] text-white shadow-xs'
                        : 'bg-white border border-[#e5e7eb] text-[#6b7280] hover:text-[#0f0f1a]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4b5563] mb-2">
                Target Persona
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#e5e7eb] text-[13px] text-[#0f0f1a] focus:outline-none focus:border-[#5B5CE2]"
              >
                <option value="New Customers">New Customers (Self-Serve Onboarding)</option>
                <option value="Sales Prospects">Sales Prospects (High Intent Demos)</option>
                <option value="Technical Buyers">Technical Buyers (Security & APIs)</option>
                <option value="Enterprise Champions">Enterprise Champions (Executive ROI)</option>
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              isLoading={isGenerating}
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={handleGenerate}
            >
              {isGenerating ? 'Generating Demo with AI...' : 'Generate Interactive Demo'}
            </Button>

            {generationSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" /> Demo drafted successfully! Redirecting to canvas...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* AI Features Grid */}
      <h3 className="text-[17px] font-semibold text-[#0f0f1a] mb-4">
        AI Capabilities in Your Workspace
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-5 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#5B5CE2]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#5B5CE2]/10 text-[#5B5CE2] flex items-center justify-center mb-3">
            <Mic className="w-5 h-5" />
          </div>
          <h4 className="text-[14.5px] font-semibold text-[#0f0f1a] mb-1">AI Voiceover Studio</h4>
          <p className="text-[13px] text-[#6b7280] font-normal leading-relaxed mb-3">
            Generate lifelike voice narration in 12+ voices. Synchronizes automatically with hotspot clicks.
          </p>
          <span className="text-xs font-medium text-[#5B5CE2] hover:underline cursor-pointer flex items-center gap-1">
            Configure voices <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#5B5CE2]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Eye className="w-5 h-5" />
          </div>
          <h4 className="text-[14.5px] font-semibold text-[#0f0f1a] mb-1">Smart Hotspot Vision</h4>
          <p className="text-[13px] text-[#6b7280] font-normal leading-relaxed mb-3">
            Preveuo automatically detects clickable UI elements from raw screenshots and sets step bounding boxes.
          </p>
          <span className="text-xs font-medium text-[#5B5CE2] hover:underline cursor-pointer flex items-center gap-1">
            View demo sample <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#5B5CE2]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Languages className="w-5 h-5" />
          </div>
          <h4 className="text-[14.5px] font-semibold text-[#0f0f1a] mb-1">1-Click Localization</h4>
          <p className="text-[13px] text-[#6b7280] font-normal leading-relaxed mb-3">
            Instantly translate step instructions, tooltips, and CTAs into 32+ international languages.
          </p>
          <span className="text-xs font-medium text-[#5B5CE2] hover:underline cursor-pointer flex items-center gap-1">
            Manage locales <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#5B5CE2]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Sliders className="w-5 h-5" />
          </div>
          <h4 className="text-[14.5px] font-semibold text-[#0f0f1a] mb-1">Dynamic Personalization</h4>
          <p className="text-[13px] text-[#6b7280] font-normal leading-relaxed mb-3">
            Inject prospect names, company logos, and industry tags into demo text overlays on the fly.
          </p>
          <span className="text-xs font-medium text-[#5B5CE2] hover:underline cursor-pointer flex items-center gap-1">
            Setup merge tags <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Generation History Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#e5e7eb]">
        <h3 className="text-[17px] font-semibold text-[#0f0f1a] mb-4">Recent AI Generations</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#f0f0f4] text-[#9ca3af] font-medium text-xs">
                <th className="pb-3 font-medium">Demo Title</th>
                <th className="pb-3 font-medium">Prompt Snippet</th>
                <th className="pb-3 font-medium">Steps</th>
                <th className="pb-3 font-medium">Tokens</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f4]">
              {aiGenerations.map((gen) => (
                <tr key={gen.id} className="hover:bg-[#fafafc] transition-colors">
                  <td className="py-3.5 font-semibold text-[#0f0f1a]">{gen.title}</td>
                  <td className="py-3.5 text-[#6b7280] font-normal max-w-xs truncate">{gen.prompt}</td>
                  <td className="py-3.5 font-medium text-[#0f0f1a]">{gen.steps} steps</td>
                  <td className="py-3.5 text-[#9ca3af] font-normal">{gen.tokens}</td>
                  <td className="py-3.5 text-[#9ca3af] font-normal">{gen.date}</td>
                  <td className="py-3.5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = `/edit?id=${gen.id}`;
                      }}
                    >
                      Open in Canvas
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
