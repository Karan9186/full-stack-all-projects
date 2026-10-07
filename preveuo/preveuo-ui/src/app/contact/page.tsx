'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    company: '',
    companySize: '',
    useCase: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-white text-[#0f0f1a] flex flex-col font-sans selection:bg-[#5B5CE2] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* ========================================================
            HERO & CONTACT FORM SPLIT SECTION
            ======================================================== */}
        <section className="max-w-[1200px] mx-auto px-6 pt-12 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left Column: Heading, Value Props & Testimonial */}
            <div className="lg:col-span-5 pt-4">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#5B5CE2] mb-4">
                LET'S TALK
              </p>
              <h1 className="text-[40px] sm:text-[48px] font-extrabold tracking-[-0.03em] text-[#0f0f1a] leading-[1.1] mb-5">
                See what Preveuo<br />
                can do for your<br />
                team.
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#6b7280] leading-relaxed mb-9 max-w-[420px]">
                Tell us what you're building and how your team shares product stories today. We'll show you a tailored experience—not a generic pitch.
              </p>

              {/* 4 Feature Points */}
              <div className="space-y-4 mb-9">
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#eeecff] text-[#5B5CE2] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-[14px] font-medium text-[#0f0f1a]">
                    A personalized product walkthrough
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#eeecff] text-[#5B5CE2] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <span className="text-[14px] font-medium text-[#0f0f1a]">
                    Recommendations for your use case
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#eeecff] text-[#5B5CE2] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <span className="text-[14px] font-medium text-[#0f0f1a]">
                    Pricing built around your team
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#eeecff] text-[#5B5CE2] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </div>
                  <span className="text-[14px] font-medium text-[#0f0f1a]">
                    Security and integration answers
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#f0f0f4] pt-8 max-w-[420px]">
                <blockquote className="text-[13px] text-[#4b5563] italic leading-relaxed mb-4">
                  “Our sales team shipped their first personalized demo the same day. Within a month, it was our highest-converting outbound asset.”
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#fce7d8] text-[#ea580c] font-bold text-[11px] flex items-center justify-center shrink-0">
                    MR
                  </div>
                  <div>
                    <p className="text-[12.5px] font-bold text-[#0f0f1a]">Marcus Reed</p>
                    <p className="text-[11px] text-[#9ca3af]">Head of Sales, Aperture</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form Card */}
            <div className="lg:col-span-7">
              <div className="border border-[#e5e7eb] rounded-3xl p-7 sm:p-9 bg-white shadow-xl max-w-[560px] w-full ml-auto">
                <h2 className="text-[22px] font-bold text-[#0f0f1a] mb-1">
                  Talk to our team
                </h2>
                <p className="text-[13px] text-[#9ca3af] mb-7">
                  We usually respond within one business day.
                </p>

                {formSubmitted ? (
                  <div className="py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="text-[18px] font-bold text-[#0f0f1a] mb-2">Request received!</h3>
                    <p className="text-[14px] text-[#6b7280] max-w-sm mx-auto mb-6">
                      Thank you for reaching out. One of our product specialists will be in touch with a customized walkthrough shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="text-[13px] font-semibold text-[#5B5CE2] hover:underline"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="First name"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Karan"
                      />
                      <Input
                        label="Last name"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Shah"
                      />
                    </div>

                    {/* Work Email */}
                    <Input
                      label="Work email"
                      type="email"
                      id="workEmail"
                      name="workEmail"
                      required
                      value={formData.workEmail}
                      onChange={handleChange}
                      placeholder="karan@company.com"
                    />

                    {/* Company */}
                    <Input
                      label="Company"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Corporation"
                    />

                    {/* Company Size & Primary Use Case */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        label="Company size"
                        id="companySize"
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        placeholder="Select size"
                        options={[
                          { value: '1-10', label: '1-10 employees' },
                          { value: '11-50', label: '11-50 employees' },
                          { value: '51-200', label: '51-200 employees' },
                          { value: '201-1000', label: '201-1,000 employees' },
                          { value: '1000+', label: '1,000+ employees' },
                        ]}
                      />

                      <Select
                        label="Primary use case"
                        id="useCase"
                        name="useCase"
                        value={formData.useCase}
                        onChange={handleChange}
                        placeholder="Select use case"
                        options={[
                          { value: 'sales', label: 'Sales demos & leave-behinds' },
                          { value: 'marketing', label: 'Website interactive tours' },
                          { value: 'onboarding', label: 'Customer onboarding' },
                          { value: 'training', label: 'Internal team enablement' },
                        ]}
                      />
                    </div>

                    {/* How can we help? */}
                    <div>
                      <label htmlFor="message" className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                        How can we help?
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your goals, current process, or anything you'd like to see..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-[13.5px] text-[#0f0f1a] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/10 transition-colors resize-none"
                      />
                    </div>

                    {/* Submit CTA */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        size="lg"
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                      >
                        Request a personalized demo
                      </Button>
                    </div>

                    {/* Terms footnote */}
                    <p className="text-[11px] text-[#9ca3af] text-center pt-1 leading-normal">
                      By submitting, you agree to Preveuo's{' '}
                      <Link href="/privacy" className="underline hover:text-[#5B5CE2]">Privacy Policy</Link>
                      {' '}and{' '}
                      <Link href="/terms" className="underline hover:text-[#5B5CE2]">Terms of Service</Link>.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            3 LOWER SUPPORT / CONTACT TILES
            ======================================================== */}
        <section className="max-w-[1200px] mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Tile 1: Support */}
            <div className="border border-[#e5e7eb] rounded-2xl p-6 sm:p-7 bg-white hover:border-[#5B5CE2]/40 transition-all shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#eeecff] text-[#5B5CE2] flex items-center justify-center mb-4">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h3 className="text-[16px] font-bold text-[#0f0f1a] mb-2">
                  Looking for support?
                </h3>
                <p className="text-[13px] text-[#6b7280] leading-relaxed mb-6">
                  Visit our help center for guides, answers, and product documentation.
                </p>
              </div>
              <Link
                href="/docs"
                className="text-[13px] font-semibold text-[#5B5CE2] hover:text-[#4a4bd4] inline-flex items-center gap-1.5 transition-colors group"
              >
                <span>Go to help center</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Tile 2: Building with Preveuo */}
            <div className="border border-[#e5e7eb] rounded-2xl p-6 sm:p-7 bg-white hover:border-[#5B5CE2]/40 transition-all shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#eeecff] text-[#5B5CE2] flex items-center justify-center mb-4">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <h3 className="text-[16px] font-bold text-[#0f0f1a] mb-2">
                  Building with Preveuo?
                </h3>
                <p className="text-[13px] text-[#6b7280] leading-relaxed mb-6">
                  Explore our APIs, webhooks, and developer documentation.
                </p>
              </div>
              <Link
                href="/docs"
                className="text-[13px] font-semibold text-[#5B5CE2] hover:text-[#4a4bd4] inline-flex items-center gap-1.5 transition-colors group"
              >
                <span>View developer docs</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Tile 3: Just want to say hello */}
            <div className="border border-[#e5e7eb] rounded-2xl p-6 sm:p-7 bg-white hover:border-[#5B5CE2]/40 transition-all shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#eeecff] text-[#5B5CE2] flex items-center justify-center mb-4">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  </svg>
                </div>
                <h3 className="text-[16px] font-bold text-[#0f0f1a] mb-2">
                  Just want to say hello?
                </h3>
                <p className="text-[13px] text-[#6b7280] leading-relaxed mb-6">
                  Write to hello@preveuo.com. We'd genuinely love to hear from you.
                </p>
              </div>
              <a
                href="mailto:hello@preveuo.com"
                className="text-[13px] font-semibold text-[#5B5CE2] hover:text-[#4a4bd4] inline-flex items-center gap-1.5 transition-colors group"
              >
                <span>Send an email</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

          </div>
        </section>
      </main>

      {/* ========================================================
          COMMON DARK FOOTER
          ======================================================== */}
      <Footer />
    </div>
  );
}
