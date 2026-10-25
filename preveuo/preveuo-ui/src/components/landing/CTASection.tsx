'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ChevronRight } from 'lucide-react';
import { authService } from '@/lib/api/authService';

export default function CTASection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = authService.getStoredSession();
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes('preveuo_token=');
    if (session || hasCookie) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-brand-purple/10 via-brand-purple/5 to-transparent border-t border-brand-purple/20">
      <div className="max-w-[760px] mx-auto px-6 text-center">
        {/* Centered purple logo badge */}
        <div className="w-12 h-12 rounded-xl bg-brand-purple flex items-center justify-center mx-auto mb-6 shadow-sm shadow-brand-purple/20">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="7" width="10" height="8" rx="1.5" fill="white" fillOpacity="0.9" />
            <path d="M5 7V5a3 3 0 016 0v2" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand-purple mb-3">
          Get started today
        </p>
        <h2 className="text-[40px] sm:text-[50px] font-extrabold tracking-[-0.03em] text-heading leading-[1.12] mb-4">
          Ready to make your product<br className="hidden sm:block" /> unforgettable?
        </h2>
        <p className="text-[16px] sm:text-[17px] text-body mb-9 max-w-[480px] mx-auto leading-relaxed">
          Join thousands of teams who use Preveuo to turn product complexity into buyer confidence—without a single sales call.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={isAuthenticated ? '/workspace' : '/register'}
            id="cta-section-primary"
            className="w-full sm:w-auto"
          >
            <Button
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              {isAuthenticated ? 'Go to your workspace' : "Create your first demo — it's free"}
            </Button>
          </Link>
          <Link href="/demo" id="cta-section-demo" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" fullWidth>
              View live interactive demo
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted mt-4">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}
