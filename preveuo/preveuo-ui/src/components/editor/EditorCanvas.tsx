import React from 'react';
import Image from 'next/image';
import { DemoStep } from '@/types/demo';
import { Badge } from '@/components/ui';
import { PRIMARY_COLOR } from '@/lib/constants/theme';

interface EditorCanvasProps {
  step: DemoStep;
  onUpdateHotspot: (x: number, y: number) => void;
  isPreviewMode: boolean;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  step,
  onUpdateHotspot,
  isPreviewMode,
}) => {
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPreviewMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onUpdateHotspot(Math.min(95, Math.max(5, x)), Math.min(95, Math.max(5, y)));
  };

  const { targetPoint, callout } = step;

  // Position callout relative to hotspot
  const isRightHalf = targetPoint.x > 50;
  const isBottomHalf = targetPoint.y > 60;

  const tooltipStyle: React.CSSProperties = {
    left: isRightHalf ? `${Math.max(10, targetPoint.x - 30)}%` : `${Math.min(70, targetPoint.x + 4)}%`,
    top: isBottomHalf ? `${Math.max(10, targetPoint.y - 25)}%` : `${Math.min(70, targetPoint.y + 4)}%`,
  };

  return (
    <main className="flex-1 bg-light p-6 flex items-center justify-center overflow-auto relative">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-border-default shadow-xl overflow-hidden relative flex flex-col">
        {/* Browser Top Bar */}
        <div className="h-10 bg-canvas border-b border-border-light px-4 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/70" />
            <span className="w-3 h-3 rounded-full bg-amber-400/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/70" />
          </div>

          <span className="text-[11.5px] font-normal text-body bg-gray-100 px-4 py-1 rounded-full">
            Click anywhere on screenshot to reposition hotspot target
          </span>

          <div className="w-12" />
        </div>

        {/* Canvas Area */}
        <div
          onClick={handleCanvasClick}
          className="relative aspect-[16/10] w-full bg-dark overflow-hidden select-none cursor-crosshair"
        >
          <Image
            src={step.screenshotUrl}
            alt={step.title}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover pointer-events-none"
            priority
          />

          {/* Hotspot indicator (Supademo dual-radar pulse) */}
          <div
            style={{
              left: `${targetPoint.x}%`,
              top: `${targetPoint.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex items-center justify-center"
          >
            <span className="absolute w-10 h-10 rounded-full bg-brand-purple animate-hotspot-radar-1 opacity-70" />
            <span className="absolute w-8 h-8 rounded-full bg-brand-purple animate-hotspot-radar-2 opacity-50" />
            <span
              style={{
                backgroundColor: PRIMARY_COLOR,
                boxShadow: '0 0 0 2.5px white, 0 4px 14px var(--color-brand-purple)',
              }}
              className="relative flex items-center justify-center w-[20px] h-[20px] rounded-full text-white"
            >
              <span className="w-2 h-2 rounded-full bg-white shadow-xs animate-pulse" />
            </span>
          </div>

          {/* Callout Tooltip Preview */}
          <div
            style={tooltipStyle}
            className="absolute z-40 max-w-xs w-72 bg-white rounded-2xl p-4 shadow-2xl border border-border-default pointer-events-none"
          >
            <Badge variant="purple" size="sm" className="mb-2">
              {callout.badge || `Step ${step.stepNumber}`}
            </Badge>
            <h4 className="text-[13px] font-semibold text-heading">
              {callout.title}
            </h4>
            <p className="text-[12px] text-body font-normal mt-1 leading-relaxed">
              {callout.description}
            </p>
            <div className="mt-3 flex justify-end">
              <span className="px-3 py-1 rounded-lg bg-brand-purple text-white text-[11.5px] font-medium">
                {callout.buttonText || 'Next Step'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
