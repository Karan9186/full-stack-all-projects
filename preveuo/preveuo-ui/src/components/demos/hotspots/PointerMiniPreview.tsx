'use client';

import React, { useState, useEffect } from 'react';
import { HotspotPointerStyle, PointerAnimationSettings } from '@/types/demo';
import { PointerRenderer } from './PointerRenderer';
import { RotateCcw, Sparkles, Volume2, Gauge, Maximize2 } from 'lucide-react';

export interface PointerMiniPreviewProps {
  style: HotspotPointerStyle;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  animationSettings?: PointerAnimationSettings;
  onAnimationChange?: (settings: Partial<PointerAnimationSettings>) => void;
}

export const PointerMiniPreview: React.FC<PointerMiniPreviewProps> = ({
  style,
  color = '#5B5CE2',
  size = 'md',
  animationSettings,
  onAnimationChange,
}) => {
  const [replayKey, setReplayKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const canonicalStyle = style === 'bullseye' ? 'target' : style;

  // Auto-play when style changes
  useEffect(() => {
    setIsPlaying(true);
    setReplayKey((k) => k + 1);
    const timer = setTimeout(() => {
      setIsPlaying(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [style, color, size, animationSettings?.speed, animationSettings?.clickFeedback]);

  const handleReplay = () => {
    setIsPlaying(true);
    setReplayKey((k) => k + 1);
    setTimeout(() => {
      setIsPlaying(false);
    }, 1200);
  };

  const currentSize = animationSettings?.size || size || 'md';
  const currentSpeed = animationSettings?.speed || 'medium';
  const clickFeedback = animationSettings?.clickFeedback !== false;

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden shadow-2xs select-none">
      {/* Top Header with Status Indicator & Replay Button */}
      <div className="h-8 px-2.5 bg-[#f8f8fc] border-b border-[#e5e7eb] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-[#5B5CE2]'
            }`}
          />
          <span className="text-[10.5px] font-semibold text-[#4b5563] uppercase tracking-wider">
            {isPlaying ? 'Playing Preview' : 'Interactive Preview'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleReplay}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white text-[11px] font-semibold text-[#5B5CE2] border border-transparent hover:border-[#e5e7eb] transition-all cursor-pointer shadow-2xs active:scale-95"
          title="Replay pointer animation"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Replay</span>
        </button>
      </div>

      {/* Miniature Demonstration Canvas */}
      <div
        style={{
          backgroundColor: '#fafafc',
          backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
        className="h-28 relative flex items-center justify-center overflow-hidden p-4"
      >
        {/* Sample Target UI element inside miniature canvas */}
        <div className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#d1d5db] text-xs font-semibold text-[#0f0f1a] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#5B5CE2]" />
          <span>Save changes</span>

          {/* Pointer Anchored right on the target */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <PointerRenderer
              key={replayKey}
              style={style}
              color={color}
              size={currentSize}
              autoPlayMotion={true}
              animationSettings={animationSettings}
            />
          </div>
        </div>
      </div>

      {/* Compact Animation Settings Controls (only rendered if onAnimationChange provided) */}
      {onAnimationChange && (
        <div className="p-2.5 bg-[#fcfcfe] border-t border-[#f0f0f4] space-y-2 text-xs">
          {/* Size & Speed Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-medium text-[#6b7280]">Size:</span>
              <div className="flex items-center bg-[#f1f2f6] p-0.5 rounded-lg">
                {(['sm', 'md', 'lg'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onAnimationChange({ size: s })}
                    className={`px-2 py-0.5 text-[10.5px] font-semibold rounded-md transition-all cursor-pointer ${
                      currentSize === s
                        ? 'bg-white text-[#0f0f1a] shadow-2xs'
                        : 'text-[#6b7280] hover:text-[#0f0f1a]'
                    }`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[11px] font-medium text-[#6b7280]">Speed:</span>
              <div className="flex items-center bg-[#f1f2f6] p-0.5 rounded-lg">
                {(['slow', 'medium', 'fast'] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => onAnimationChange({ speed: spd })}
                    className={`px-1.5 py-0.5 text-[10.5px] font-semibold rounded-md transition-all cursor-pointer capitalize ${
                      currentSpeed === spd
                        ? 'bg-white text-[#0f0f1a] shadow-2xs'
                        : 'text-[#6b7280] hover:text-[#0f0f1a]'
                    }`}
                  >
                    {spd === 'medium' ? 'Norm' : spd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contextual Options based on Style */}
          {(canonicalStyle === 'cursor' || canonicalStyle === 'hand') && (
            <div className="flex items-center justify-between pt-1 border-t border-[#f0f0f4]">
              <span className="text-[11px] font-medium text-[#6b7280]">Click Ripple Feedback</span>
              <button
                type="button"
                onClick={() => onAnimationChange({ clickFeedback: !clickFeedback })}
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-hidden ${
                  clickFeedback ? 'bg-[#5B5CE2]' : 'bg-[#e5e7eb]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-150 ease-in-out ${
                    clickFeedback ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {(canonicalStyle === 'beacon' || canonicalStyle === 'target') && (
            <div className="flex items-center justify-between pt-1 border-t border-[#f0f0f4]">
              <span className="text-[11px] font-medium text-[#6b7280]">Ring Pulse Intensity</span>
              <div className="flex items-center bg-[#f1f2f6] p-0.5 rounded-lg">
                {(['subtle', 'standard', 'high'] as const).map((intensity) => (
                  <button
                    key={intensity}
                    type="button"
                    onClick={() => onAnimationChange({ intensity })}
                    className={`px-1.5 py-0.5 text-[10.5px] font-semibold rounded-md transition-all cursor-pointer capitalize ${
                      (animationSettings?.intensity || 'standard') === intensity
                        ? 'bg-white text-[#0f0f1a] shadow-2xs'
                        : 'text-[#6b7280] hover:text-[#0f0f1a]'
                    }`}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
