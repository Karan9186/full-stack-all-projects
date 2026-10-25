import React from 'react';
import Image from 'next/image';
import { DemoStep } from '@/types/demo';
import { DemoHotspot } from './DemoHotspot';
import { DemoCalloutCard } from './DemoCalloutCard';

interface DemoCanvasProps {
  step: DemoStep;
  onNext: () => void;
  isLastStep: boolean;
}

export const DemoCanvas: React.FC<DemoCanvasProps> = ({
  step,
  onNext,
  isLastStep,
}) => {
  return (
    <div className="flex-1 bg-light p-4 sm:p-8 flex items-center justify-center overflow-auto">
      {/* Simulated Browser Frame */}
      <div className="w-full max-w-5xl bg-white rounded-2xl border border-border-default shadow-xl overflow-hidden relative flex flex-col">
        {/* Browser Top Chrome */}
        <div className="h-10 bg-canvas border-b border-border-light px-4 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/70" />
            <span className="w-3 h-3 rounded-full bg-amber-400/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/70" />
          </div>

          <div className="bg-gray-100 text-muted px-4 py-1 rounded-full text-[11px] font-mono truncate max-w-xs sm:max-w-md">
            app.preveuo.com/demos/{step.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}
          </div>

          <div className="w-12" />
        </div>

        {/* Canvas Screenshot with Hotspot & Tooltip */}
        <div className="relative aspect-[16/10] w-full bg-dark overflow-hidden select-none">
          <Image
            src={step.screenshotUrl}
            alt={step.title}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
            priority
          />

          {/* Interactive Hotspot */}
          <DemoHotspot
            point={step.targetPoint}
            onClick={onNext}
          />

          {/* Floating Callout Card */}
          <DemoCalloutCard
            step={step}
            onNext={onNext}
            isLastStep={isLastStep}
          />
        </div>
      </div>
    </div>
  );
};
