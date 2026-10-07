'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTASection from '@/components/landing/CTASection';
import {
  HowItWorksHero,
  WalkthroughStep,
  CaptureMockup,
  BranchingMockup,
  PersonalizeMockup,
  AnalyticsMockup,
} from '@/components/how-it-works';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white text-[#0f0f1a] flex flex-col font-sans selection:bg-[#5B5CE2] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <HowItWorksHero />

        {/* Steps Walkthrough */}
        <div className="max-w-[1140px] mx-auto px-6 space-y-28 sm:space-y-36">
          {/* Step 01 */}
          <WalkthroughStep
            stepNumber="01"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B5CE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 8-6 4 6 4V8Z" />
                <rect width="14" height="12" x="2" y="6" rx="2" />
              </svg>
            }
            title="Capture"
            description="Record a real product workflow, upload screenshots, or import an existing recording. Preveuo organizes every interaction into clean, editable steps."
            tags={['Capture', 'Browser extension', 'Screen, window, or tab']}
            mockup={<CaptureMockup />}
          />

          {/* Step 02 */}
          <WalkthroughStep
            stepNumber="02"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B5CE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <path d="M18 15v-1a4 4 0 0 0-4-4H8" />
                <path d="M6 9v9a3 3 0 0 0 3 3h5" />
              </svg>
            }
            title="Design & Branch"
            description="Add hotspots, custom tooltips, auto-pacing, and conditional paths so each buyer explores the features relevant to their specific problem."
            tags={['Multi-branch paths', 'Hotspot overlays', 'Smart auto-pacing']}
            mockup={<BranchingMockup />}
            reversed
          />

          {/* Step 03 */}
          <WalkthroughStep
            stepNumber="03"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B5CE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" x2="19" y1="8" y2="14" />
                <line x1="22" x2="16" y1="11" y2="11" />
              </svg>
            }
            title="Personalize"
            description="Tailor logos, company names, and dynamic variables for every account without creating a dozen duplicate versions from scratch."
            tags={['Dynamic variable tokens', 'Custom branding', 'CRM merge fields']}
            mockup={<PersonalizeMockup />}
          />

          {/* Step 04 */}
          <WalkthroughStep
            stepNumber="04"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B5CE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" x2="18" y1="20" y2="10" />
                <line x1="12" x2="12" y1="20" y2="4" />
                <line x1="6" x2="6" y1="20" y2="14" />
              </svg>
            }
            title="Convert & Analyze"
            description="See who watched, how long they lingered, and where they dropped off. Sync prospect intent straight to your CRM and marketing pipeline."
            tags={['Lead-capture forms', 'Drop-off heatmaps', 'HubSpot & Salesforce sync']}
            mockup={<AnalyticsMockup />}
            reversed
          />
        </div>

        <div className="mt-32">
          <CTASection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
