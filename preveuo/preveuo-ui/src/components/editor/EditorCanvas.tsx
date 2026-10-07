import React from 'react';
import Image from 'next/image';
import { DemoStep } from '@/types/demo';
import { Badge } from '@/components/ui';

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
    <main className="flex-1 bg-[#f8f8fc] p-6 flex items-center justify-center overflow-auto relative">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-[#e5e7eb] shadow-xl overflow-hidden relative flex flex-col">
        {/* Browser Top Bar */}
        <div className="h-10 bg-[#fafafc] border-b border-[#f0f0f4] px-4 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#f87171]/70" />
            <span className="w-3 h-3 rounded-full bg-[#fbbf24]/70" />
            <span className="w-3 h-3 rounded-full bg-[#34d399]/70" />
          </div>

          <span className="text-[11px] font-mono text-[#9ca3af] bg-[#f0f0f5] px-4 py-1 rounded-full">
            Click anywhere on screenshot to reposition hotspot target
          </span>

          <div className="w-12" />
        </div>

        {/* Canvas Area */}
        <div
          onClick={handleCanvasClick}
          className="relative aspect-[16/10] w-full bg-[#0f0f1a] overflow-hidden select-none cursor-crosshair"
        >
          <Image
            src={step.screenshotUrl}
            alt={step.title}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover pointer-events-none"
            priority
          />

          {/* Hotspot indicator */}
          <div
            style={{
              left: `${targetPoint.x}%`,
              top: `${targetPoint.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <span className="absolute -inset-3 rounded-full bg-[#5B5CE2]/30 animate-ping opacity-75" />
            <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#5B5CE2] text-white shadow-lg border-2 border-white">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
            </span>
          </div>

          {/* Callout Tooltip Preview */}
          <div
            style={tooltipStyle}
            className="absolute z-40 max-w-xs w-72 bg-white rounded-2xl p-4 shadow-2xl border border-[#e5e7eb] pointer-events-none"
          >
            <Badge variant="purple" size="sm" className="mb-2">
              {callout.badge || `Step ${step.stepNumber}`}
            </Badge>
            <h4 className="text-xs font-bold text-[#0f0f1a]">
              {callout.title}
            </h4>
            <p className="text-[11.5px] text-[#6b7280] mt-1 leading-relaxed">
              {callout.description}
            </p>
            <div className="mt-3 flex justify-end">
              <span className="px-3 py-1 rounded-lg bg-[#5B5CE2] text-white text-[11px] font-semibold">
                {callout.buttonText || 'Next Step'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
