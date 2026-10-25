'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ChevronRight, Play, Check } from 'lucide-react';
import { Button } from '@/components/ui';
import { authService } from '@/lib/api/authService';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = authService.getStoredSession();
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes('preveuo_token=');
    if (session || hasCookie) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-badge',   { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 })
        .fromTo('.hero-h1-1',   { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.25')
        .fromTo('.hero-h1-2',   { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
        .fromTo('.hero-sub',    { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
        .fromTo('.hero-ctas',   { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, '-=0.25')
        .fromTo('.hero-trust',  { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.2')
        .fromTo('.hero-mockup', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, '-=0.3');
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="pt-[100px] pb-0 bg-white overflow-hidden">
      {/* Text content — centered */}
      <div className="max-w-[760px] mx-auto px-6 text-center">

        {/* Announcement badge */}
        <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-medium mb-7 cursor-pointer hover:bg-brand-purple/10 transition-colors">
          {/* Sparkle icon */}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-brand-purple">
            <path d="M6 0l1.2 4.8L12 6l-4.8 1.2L6 12 4.8 7.2 0 6l4.8-1.2L6 0z" fill="currentColor"/>
          </svg>
          <span className="font-semibold">Preveuo AI is here</span>
          <span className="text-brand-purple/80">Explore what's new</span>
          <ChevronRight className="w-3 h-3 text-brand-purple/80" />
        </div>

        {/* Headline */}
        <h1 className="font-extrabold leading-[1.10] tracking-[-0.03em] text-heading mb-5">
          <span className="hero-h1-1 block text-[52px] sm:text-[64px] lg:text-[72px]">
            Turn your product into an
          </span>
          <span className="hero-h1-2 block text-[52px] sm:text-[64px] lg:text-[72px] text-brand-purple">
            interactive experience.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero-sub text-[17px] sm:text-[18px] text-body leading-[1.65] mb-8 max-w-[580px] mx-auto">
          Create beautiful product demos, personalized tours, and sales stories
          that help every buyer understand your value—without waiting for a call.
        </p>

        {/* CTAs */}
        <div className="hero-ctas flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
          <Link
            href={isAuthenticated ? '/workspace' : '/register'}
            id="hero-cta-primary"
            className="w-full sm:w-auto"
          >
            <Button
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              {isAuthenticated ? 'Open your workspace' : 'Create your first demo'}
            </Button>
          </Link>
          <Link href="/demo" id="hero-cta-secondary" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              leftIcon={
                <span className="w-5 h-5 rounded border border-border-input flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current" />
                </span>
              }
            >
              Watch how it works
            </Button>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="hero-trust flex items-center justify-center gap-5 text-[12.5px] text-muted mb-12">
          {['Free to start', 'No credit card', 'Publish in minutes'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-brand-purple" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Dashboard mockup */}
      <div className="hero-mockup max-w-[980px] mx-auto px-4 sm:px-8">
        {/* Browser chrome */}
        <div className="rounded-t-2xl border border-border-default border-b-0 bg-gray-50 px-4 py-2.5 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 mx-4">
            <div className="max-w-[280px] mx-auto bg-white border border-border-default rounded-md px-3 py-1 text-[11px] text-muted text-center">
              app.preveuo.com/demos/q3-product-overview
            </div>
          </div>
        </div>

        {/* App shell */}
        <div className="border border-border-default rounded-b-2xl overflow-hidden flex shadow-[0_20px_60px_-10px_rgba(91,92,226,0.12)]" style={{ minHeight: 480 }}>

          {/* Sidebar */}
          <div className="hidden sm:flex flex-col items-center gap-5 py-5 px-3 border-r border-border-light bg-white w-[56px] shrink-0">
            <div className="w-8 h-8 rounded-[7px] bg-brand-purple flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="7" width="10" height="8" rx="1.5" fill="white" fillOpacity="0.9"/>
                <path d="M5 7V5a3 3 0 016 0v2" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div className="mt-2 flex flex-col gap-4">
              {/* Home */}
              <svg className="text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              </svg>
              {/* Demos - active */}
              <div className="w-9 h-9 rounded-lg bg-brand-purple/5 flex items-center justify-center">
                <svg className="text-brand-purple" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
              </div>
              {/* Folder */}
              <svg className="text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
              </svg>
              {/* Analytics */}
              <svg className="text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 20V10M12 20V4M6 20v-6"/>
              </svg>
              {/* Users */}
              <svg className="text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
                <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.85"/>
              </svg>
            </div>
            <div className="mt-auto">
              <svg className="text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 bg-white min-w-0">
            {/* Top bar */}
            <div className="border-b border-border-light px-6 py-3.5 flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest text-gray-700 uppercase">Demos</span>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 border border-border-default rounded-lg px-3 py-1.5 text-xs text-muted bg-gray-50 w-40">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  Search demos...
                </div>
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-purple text-white text-xs font-semibold rounded-lg">
                  <span>+</span> Create demo
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6 relative">
              {/* CTA Conversion floating card */}
              <div className="absolute top-4 right-4 bg-white border border-border-default rounded-xl shadow-lg p-3 w-[140px] z-10">
                <div className="text-[9px] font-bold uppercase tracking-widest text-muted mb-1">CTA Conversion</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                      <path d="M2 7l3-3 2 2 3-4" stroke="currentColor" className="text-emerald-500" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-[16px] font-bold text-heading">12.4%</span>
                  <span className="text-[10px] font-semibold text-emerald-500">+3.1%</span>
                </div>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-purple mb-1">Your Demos</div>
              <h2 className="text-[22px] font-bold text-heading mb-5">Stories that move buyers forward</h2>

              {/* KPI Cards */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Total Views',  value: '42,680', delta: '↑ 18.4%' },
                  { label: 'Engagement',   value: '74.8%',  delta: '↑ 3.2%' },
                  { label: 'Conversion',   value: '8.6%',   delta: '↑ 0.4%' },
                ].map((kpi) => (
                  <div key={kpi.label} className="border border-border-light rounded-xl p-4">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-muted mb-2">{kpi.label}</div>
                    <div className="text-[22px] font-bold text-heading mb-1">{kpi.value}</div>
                    <div className="text-[10px] text-emerald-500 font-semibold">{kpi.delta}</div>
                  </div>
                ))}
              </div>

              {/* Bottom row */}
              <div className="grid grid-cols-5 gap-3">
                {/* Demo card */}
                <div className="col-span-2 border border-border-light rounded-xl overflow-hidden relative">
                  <div className="h-[120px] bg-gradient-to-br from-indigo-950 to-indigo-900 relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-end pr-4">
                      <div className="flex flex-col gap-2">
                        <div className="w-20 h-3 bg-indigo-100 rounded opacity-60" />
                        <div className="w-16 h-3 bg-indigo-100 rounded opacity-40" />
                        <div className="w-20 h-3 bg-indigo-100 rounded opacity-50" />
                      </div>
                    </div>
                    <div className="w-14 h-20 bg-gray-900 rounded absolute left-4" />
                  </div>
                  <div className="px-3 py-2.5">
                    <div className="text-[12px] font-semibold text-heading">Q3 Product Overview</div>
                    <div className="text-[10px] text-muted mt-0.5">12 steps · Published</div>
                  </div>
                  {/* Avatar group overlay */}
                  <div className="absolute bottom-12 left-2 bg-white border border-border-default rounded-xl shadow-lg px-2.5 py-2 flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {['AL','MR','JD'].map((a, i) => (
                        <div
                          key={i}
                          className={`w-5 h-5 rounded-full border-2 border-white text-[8px] font-bold flex items-center justify-center ${['bg-purple-200 text-purple-700', 'bg-amber-200 text-amber-800', 'bg-emerald-200 text-emerald-800'][i]}`}
                        >
                          {a}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-heading">+2,184</div>
                      <div className="text-[8px] text-muted">viewers this week</div>
                    </div>
                  </div>
                </div>

                {/* Viewer engagement chart */}
                <div className="col-span-3 border border-border-light rounded-xl p-4">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-muted mb-3">Viewer Engagement</div>
                  <svg width="100%" height="90" viewBox="0 0 300 90" preserveAspectRatio="none">
                    {/* Gray baseline */}
                    <path d="M0,80 C30,78 60,72 90,65 C120,58 150,52 180,48 C210,44 240,42 300,38"
                      stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
                    {/* Purple main line */}
                    <path d="M0,75 C30,70 60,60 90,50 C120,40 150,32 180,28 C210,24 240,18 300,10"
                      stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" className="text-brand-purple"/>
                    {/* Area fill */}
                    <path d="M0,75 C30,70 60,60 90,50 C120,40 150,32 180,28 C210,24 240,18 300,10 L300,90 L0,90 Z"
                      fill="url(#chartGrad)" opacity="0.15"/>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" className="text-brand-purple"/>
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-brand-purple"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
