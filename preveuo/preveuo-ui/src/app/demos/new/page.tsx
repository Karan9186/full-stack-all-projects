'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea, Card } from '@/components/ui';
import {
  ArrowLeft,
  Sparkles,
  MousePointer,
  HelpCircle,
  Laptop,
  Check,
} from 'lucide-react';
import { DemoType } from '@/types/demo';

const STARTER_TEMPLATES = [
  {
    id: 'analytics',
    title: 'SaaS Analytics Dashboard',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    description: 'KPI metrics, revenue progression graphs, and cohort breakdown cards.',
  },
  {
    id: 'crm',
    title: 'Deal Flow CRM Pipeline',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    description: 'Sales deals stages, contact lists, and conversion funnel boards.',
  },
  {
    id: 'billing',
    title: 'Customer Billing & Settings',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
    description: 'Self-serve plan selection, payment methods, and invoice history.',
  },
];

export default function NewDemoPage() {
  const router = useRouter();
  const [name, setName] = useState('New Interactive Tour');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<DemoType>('walkthrough');
  const [selectedTemplateUrl, setSelectedTemplateUrl] = useState(STARTER_TEMPLATES[0].imageUrl);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsLoading(true);
      const res = await fetch('/api/demos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          type,
          initialImageUrl: customImageUrl.trim() || selectedTemplateUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const newId = data.data.demo.id || data.data.demo._id;
        router.push(`/demos/${newId}`);
      } else {
        alert(data.error || 'Failed to create demo');
        setIsLoading(false);
      }
    } catch {
      alert('Error creating demo');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#0f0f1a] font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-[#e5e7eb] bg-white px-6 flex items-center justify-between sticky top-0 z-30">
        <Link
          href="/demos"
          className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] hover:text-[#0f0f1a] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back to Demos</span>
        </Link>

        <span className="text-xs font-bold uppercase tracking-wider text-[#5B5CE2]">
          Preveuo Studio Wizard
        </span>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto p-6 sm:p-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f0f1a] tracking-tight mb-2">
            Create an Interactive Demo
          </h1>
          <p className="text-sm text-[#6b7280]">
            Set up the core details of your guided walkthrough or interactive product simulation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e7eb] shadow-sm">
          {/* Demo Name */}
          <Input
            label="Tour Title"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Analytics Guided Onboarding"
          />

          {/* Description */}
          <Textarea
            label="Description (Optional)"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of the experience and what prospects will learn."
          />

          {/* Demo Type Selection */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0f0f1a] mb-2.5">
              Experience Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'walkthrough' as const,
                  title: 'Guided Walkthrough',
                  desc: 'Step-by-step spotlight tour with explanatory callouts.',
                  icon: <HelpCircle className="w-5 h-5 text-[#5B5CE2]" />,
                },
                {
                  id: 'interactive' as const,
                  title: 'Interactive Sandbox',
                  desc: 'Viewer freely clicks and navigates across scenes.',
                  icon: <MousePointer className="w-5 h-5 text-[#5B5CE2]" />,
                },
                {
                  id: 'onboarding' as const,
                  title: 'User Onboarding',
                  desc: 'Structured checklist guiding users to activation.',
                  icon: <Sparkles className="w-5 h-5 text-[#5B5CE2]" />,
                },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    type === t.id
                      ? 'border-[#5B5CE2] bg-[#5B5CE2]/5 ring-2 ring-[#5B5CE2]/15'
                      : 'border-[#e5e7eb] hover:border-[#d1d5db]'
                  }`}
                >
                  <div className="mb-2">{t.icon}</div>
                  <h4 className="font-bold text-xs text-[#0f0f1a] mb-1">{t.title}</h4>
                  <p className="text-[11px] text-[#6b7280] leading-relaxed">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Starter Screenshot Backdrop */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0f0f1a] mb-2.5">
              Initial Scene Screenshot
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {STARTER_TEMPLATES.map((tmpl) => {
                const isSelected = !customImageUrl && selectedTemplateUrl === tmpl.imageUrl;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => {
                      setCustomImageUrl('');
                      setSelectedTemplateUrl(tmpl.imageUrl);
                    }}
                    className={`relative rounded-xl border overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#5B5CE2] ring-2 ring-[#5B5CE2]/20'
                        : 'border-[#e5e7eb] hover:border-[#d1d5db]'
                    }`}
                  >
                    <div className="h-24 bg-[#0f0f1a] relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tmpl.imageUrl}
                        alt={tmpl.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#5B5CE2] text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 bg-white">
                      <h5 className="font-bold text-[11px] text-[#0f0f1a] truncate">{tmpl.title}</h5>
                    </div>
                  </div>
                );
              })}
            </div>

            <Input
              label="Or Custom Screenshot URL (Optional)"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="https://your-domain.com/screenshot.png"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0f0f4]">
            <Link href="/demos">
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </Link>

            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isLoading}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Initialize Demo Studio
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
