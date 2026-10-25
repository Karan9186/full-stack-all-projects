'use client';

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Layers,
} from 'lucide-react';
import { DemoSettings } from '@/types/demo';

export interface PlayerControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  isCompleted: boolean;
  isFullscreen: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onRestart: () => void;
  onToggleFullscreen: () => void;
  activeChapterTitle?: string;
  totalChapters?: number;
  onOpenChapterMenu?: () => void;
  demoSettings?: DemoSettings;
  className?: string;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  isCompleted,
  isFullscreen,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  onTogglePlay,
  onRestart,
  onToggleFullscreen,
  activeChapterTitle,
  totalChapters = 0,
  onOpenChapterMenu,
  demoSettings = {},
  className = '',
}) => {
  if (demoSettings.showControls === false || isCompleted) {
    return null;
  }

  const progressPercentage =
    totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 100;

  return (
    <div
      role="toolbar"
      aria-label="Demo Player Controls"
      className={`absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[94vw] bg-dark/90 backdrop-blur-md border border-white/10 rounded-2xl px-2.5 sm:px-4 py-2 flex items-center gap-1.5 sm:gap-3 shadow-2xl text-white select-none transition-all duration-200 ${className}`}
    >
      {/* Restart Action */}
      {demoSettings.allowRestart !== false && (
        <button
          type="button"
          onClick={onRestart}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer active:scale-95"
          title="Restart Demo (R)"
          aria-label="Restart Demo"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}

      {/* Previous Step */}
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev}
        className={`p-1.5 rounded-xl transition-all ${
          canGoPrev
            ? 'text-white/80 hover:text-white hover:bg-white/10 cursor-pointer active:scale-95'
            : 'text-white/20 cursor-not-allowed'
        }`}
        title="Previous Step (Left Arrow)"
        aria-label="Previous Step"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Autoplay Play/Pause */}
      <button
        type="button"
        onClick={onTogglePlay}
        className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer active:scale-95"
        title={isPlaying ? 'Pause Autoplay (Space)' : 'Play Autoplay (Space)'}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>

      {/* Next Step */}
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        className={`p-1.5 rounded-xl transition-all ${
          canGoNext
            ? 'text-white/80 hover:text-white hover:bg-white/10 cursor-pointer active:scale-95'
            : 'text-white/20 cursor-not-allowed'
        }`}
        title="Next Step (Right Arrow / Space)"
        aria-label="Next Step"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Chapter Menu Switcher Button (if multiple chapters) */}
      {totalChapters > 1 && onOpenChapterMenu && (
        <button
          type="button"
          onClick={onOpenChapterMenu}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all cursor-pointer active:scale-95 border border-white/5"
          title="Browse Chapters"
        >
          <Layers className="w-3.5 h-3.5 text-brand-purple" />
          <span className="max-w-[110px] truncate">
            {activeChapterTitle || 'Chapters'}
          </span>
        </button>
      )}

      {/* Progress Bar & Step Fraction */}
      {demoSettings.progressBar !== false && totalSteps > 0 && (
        <div className="flex items-center gap-2 pl-1 sm:pl-2">
          <div className="w-20 sm:w-28 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-purple rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-[11px] font-mono font-medium text-white/70 whitespace-nowrap">
            {currentStepIndex + 1}/{totalSteps}
          </span>
        </div>
      )}

      {/* Fullscreen Toggle */}
      <button
        type="button"
        onClick={onToggleFullscreen}
        className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer active:scale-95"
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      {/* Preveuo Branding Pill */}
      {demoSettings.showBranding !== false && (
        <div className="hidden md:flex items-center gap-1.5 pl-2.5 border-l border-white/10 text-[10.5px] text-white/50 uppercase tracking-widest font-bold">
          <span>Powered by</span>
          <span className="text-brand-purple font-extrabold tracking-normal normal-case text-[12px]">Preveuo</span>
        </div>
      )}
    </div>
  );
};
