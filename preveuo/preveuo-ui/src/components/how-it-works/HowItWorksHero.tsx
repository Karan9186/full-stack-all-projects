import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ChevronRight } from 'lucide-react';

export const HowItWorksHero: React.FC = () => {
  return (
    <section className="pt-16 pb-24 px-6 text-center">
      <div className="max-w-[850px] mx-auto">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#5B5CE2] mb-5">
          HOW PREVEUO WORKS
        </p>
        <h1 className="text-[42px] sm:text-[56px] lg:text-[62px] font-extrabold tracking-[-0.035em] text-[#0f0f1a] leading-[1.08] mb-6">
          A complete product story,<br />
          from capture to conversion.
        </h1>
        <p className="text-[16px] sm:text-[18px] text-[#6b7280] leading-relaxed max-w-[620px] mx-auto mb-9">
          Give every team the tools to create, personalize, publish, and improve interactive demos—without a production bottleneck.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/register" id="how-it-works-hero-cta">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Create your first demo
            </Button>
          </Link>
          <Link href="/demo" id="how-it-works-hero-walkthrough">
            <Button variant="secondary" size="lg">
              Book a walkthrough
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
