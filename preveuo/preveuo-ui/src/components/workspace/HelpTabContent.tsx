'use client';

import React, { useState } from 'react';
import { Button, Card, Badge } from '@/components/ui';
import {
  HelpCircle,
  Search,
  BookOpen,
  Globe,
  Video,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  LifeBuoy,
} from 'lucide-react';
import { WORKSPACE_HELP_ARTICLES } from '@/lib/workspaceDashboardData';

export const HelpTabContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can I embed Preveuo demos in Webflow, WordPress, and Notion?',
      a: 'Yes! Every published demo generates a responsive iframe code snippet, an inline Webflow script, and a direct Notion embed link. Demos scale seamlessly across mobile and desktop devices.',
    },
    {
      q: 'How does lead capture work inside an interactive demo?',
      a: 'You can insert lead capture gates at any step of your demo (e.g., step 4). When prospects enter their email, name, or company, Preveuo automatically pushes the contact directly into HubSpot or Salesforce.',
    },
    {
      q: 'What screen recording resolution is recommended?',
      a: 'We recommend recording in 1080p (1920x1080) or 1440p for crisp UI rendering on Retina screens. Preveuo compresses and caches all frames via our global edge CDN.',
    },
    {
      q: 'Can I use a custom white-label domain for public demo links?',
      a: 'Yes. On our Pro and Enterprise plans, you can map your custom domain (e.g. demos.yourbrand.com) with automated SSL certification via Cloudflare.',
    },
  ];

  const filteredArticles = WORKSPACE_HELP_ARTICLES.filter(
    (art) =>
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-heading">
            Help & Resources
          </h2>
          <p className="text-[13.5px] text-body font-normal mt-0.5">
            Documentation, video walkthroughs, and engineering support for your workspace.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<MessageSquare className="w-4 h-4" />}
          onClick={() => {}}
        >
          Contact Support
        </Button>
      </div>

      {/* Hero Resource Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-5 rounded-2xl bg-white border border-border-default hover:border-brand-purple transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-3">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-[14.5px] font-semibold text-heading mb-1">Chrome Extension</h4>
            <p className="text-[13px] text-body font-normal leading-relaxed mb-4">
              Capture your web app with 1-click HTML & DOM recording.
            </p>
          </div>
          <Button variant="outline" size="sm" fullWidth>
            Install Extension
          </Button>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-border-default hover:border-brand-purple transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Video className="w-5 h-5" />
            </div>
            <h4 className="text-[14.5px] font-semibold text-heading mb-1">Video Tutorials</h4>
            <p className="text-[13px] text-body font-normal leading-relaxed mb-4">
              5-minute masterclasses on hotspot branching and lead gates.
            </p>
          </div>
          <Button variant="outline" size="sm" fullWidth>
            Watch Videos
          </Button>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-border-default hover:border-brand-purple transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-[14.5px] font-semibold text-heading mb-1">Interactive Tour</h4>
            <p className="text-[13px] text-body font-normal leading-relaxed mb-4">
              Explore the Preveuo editor interface hands-on.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => {
              window.location.href = '/demo';
            }}
          >
            Launch Tour
          </Button>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-border-default hover:border-brand-purple transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <h4 className="text-[14.5px] font-semibold text-heading mb-1">Community Hub</h4>
            <p className="text-[13px] text-body font-normal leading-relaxed mb-4">
              Join 1,200+ product marketers on Slack sharing best practices.
            </p>
          </div>
          <Button variant="outline" size="sm" fullWidth>
            Join Slack
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search documentation, guides, and articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-border-default text-[13.5px] text-heading placeholder-muted focus:outline-none focus:border-brand-purple"
        />
      </div>

      {/* Knowledge Base Articles Grid */}
      <h3 className="text-[17px] font-semibold text-heading mb-4">Popular Guides & Documentation</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="p-5 rounded-2xl bg-white border border-border-default hover:border-border-input transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-brand-purple">
                  {art.category}
                </span>
                <span className="text-[11px] text-muted font-normal">{art.readTime}</span>
              </div>

              <h4 className="text-[15px] font-semibold text-heading mb-1.5 hover:text-brand-purple cursor-pointer">
                {art.title}
              </h4>

              <p className="text-[13px] text-body font-normal leading-relaxed mb-4">
                {art.description}
              </p>
            </div>

            <a
              href="/resources"
              className="text-xs font-medium text-brand-purple hover:underline flex items-center gap-1.5 pt-2 border-t border-border-light"
            >
              Read full article <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="p-6 rounded-2xl bg-white border border-border-default mb-8">
        <h3 className="text-[17px] font-semibold text-heading mb-4 flex items-center gap-2">
          <FileQuestion className="w-5 h-5 text-brand-purple" /> Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div
                key={faq.q}
                className="border border-border-default rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-[13.5px] text-heading hover:bg-canvas cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-body shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-body shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-[13px] text-body font-normal leading-relaxed border-t border-border-light">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Support Banner */}
      <div className="p-6 rounded-2xl bg-dark text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-[17px] font-bold mb-1">Need hands-on setup assistance?</h4>
          <p className="text-[13px] text-muted">
            Schedule a 1-on-1 implementation call with a Preveuo solution architect.
          </p>
        </div>
        <Button variant="primary" size="md">
          Book Onboarding Call
        </Button>
      </div>
    </div>
  );
};
