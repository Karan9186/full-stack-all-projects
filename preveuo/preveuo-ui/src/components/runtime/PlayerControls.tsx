'use client';

import React, { useMemo } from 'react';
import {
  Play,
  Pause,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { DemoSettings } from '@/types/demo';

export interface PlayerControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  steps?: Array<{ id: string; title?: string }>;
  chapters?: Array<{ id: string; title?: string }>;
  isPlaying: boolean;
  isCompleted: boolean;
  isFullscreen: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGoToStep?: (index: number) => void;
  onGoToChapter?: (chapterId?: string) => void;
  onTogglePlay: () => void;
  onRestart: () => void;
  onToggleFullscreen: () => void;
  activeChapterTitle?: string;
  totalChapters?: number;
  onOpenChapterMenu?: () => void;
  demoSettings?: DemoSettings;
  className?: string;
  isHovered?: boolean;
  isAtChapter?: boolean;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentStepIndex,
  totalSteps,
  steps = [],
  chapters = [],
  isPlaying,
  isCompleted,
  isFullscreen,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  onGoToStep,
  onGoToChapter,
  onTogglePlay,
  onRestart,
  onToggleFullscreen,
  activeChapterTitle,
  totalChapters = 0,
  onOpenChapterMenu,
  demoSettings = {},
  className = '',
  isHovered = false,
  isAtChapter = false,
}) => {
  if (demoSettings.showControls === false || isCompleted) {
    return null;
  }

  // Segmented timeline calculation
  const hasChapter = Boolean(chapters && chapters.length > 0);
  const chapterTitle = activeChapterTitle || (chapters && chapters[0]?.title) || 'Chapter Intro';

  // Construct individual timeline cut segments according to steps & chapters
  const segmentsList = useMemo(() => {
    const list: Array<{
      type: 'chapter' | 'step';
      index: number;
      id: string;
      label: string;
      title: string;
    }> = [];

    // 1. Chapter intro segment if demo has chapters
    if (hasChapter) {
      list.push({
        type: 'chapter',
        index: 0,
        id: chapters?.[0]?.id || 'chapter_cover',
        label: `Chapter: ${chapterTitle}`,
        title: chapterTitle,
      });
    }

    // 2. Step segments
    const stepCount = steps && steps.length > 0 ? steps.length : totalSteps;
    for (let i = 0; i < stepCount; i++) {
      const stepItem = steps?.[i];
      const stepTitle = stepItem?.title || `Step ${i + 1}`;
      list.push({
        type: 'step',
        index: i,
        id: stepItem?.id || `step_${i}`,
        label: `Step ${i + 1}: ${stepTitle}`,
        title: stepTitle,
      });
    }

    return list;
  }, [hasChapter, chapterTitle, steps, totalSteps, chapters]);

  // Determine whether segment at index `idx` is active/filled
  const isSegmentFilled = (idx: number) => {
    if (hasChapter) {
      if (isAtChapter) {
        return idx === 0;
      }
      return idx <= 1 + currentStepIndex;
    }
    return idx <= currentStepIndex;
  };

  const isSegmentCurrent = (idx: number) => {
    if (hasChapter) {
      if (isAtChapter) return idx === 0;
      return idx === 1 + currentStepIndex;
    }
    return idx === currentStepIndex;
  };

  return (
    <div
      role="toolbar"
      aria-label="Demo Player Controls"
      className={`absolute bottom-0 inset-x-0 z-40 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-8 pb-4 px-6 sm:px-8 transition-all duration-300 select-none ${
        isHovered
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-2 pointer-events-none'
      } ${className}`}
    >
      {/* Cut / Segmented Progress Bar across the bottom (Divided by Steps & Chapter) */}
      {demoSettings.progressBar !== false && segmentsList.length > 0 && (
        <div
          role="progressbar"
          aria-label="Demo progress timeline"
          aria-valuemin={0}
          aria-valuemax={segmentsList.length}
          aria-valuenow={
            hasChapter
              ? isAtChapter
                ? 1
                : 2 + currentStepIndex
              : currentStepIndex + 1
          }
          className="w-full flex items-center gap-1.5 sm:gap-2 mb-3.5 select-none"
        >
          {segmentsList.map((seg, idx) => {
            const isFilled = isSegmentFilled(idx);
            const isCurrent = isSegmentCurrent(idx);

            return (
              <button
                key={seg.id || idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (seg.type === 'chapter') {
                    onGoToChapter?.(chapters?.[0]?.id);
                  } else {
                    onGoToStep?.(seg.index);
                  }
                }}
                className="group relative flex-1 h-3.5 flex items-center cursor-pointer focus:outline-none"
                aria-label={seg.label}
              >
                {/* Segment bar: height grows slightly on hover (3px -> 5.5px), NO hover tooltip/text */}
                <div
                  className={`w-full h-[3px] group-hover:h-[5.5px] rounded-full transition-all duration-200 ease-out ${
                    isFilled
                      ? 'bg-brand-purple shadow-[0_0_8px_rgba(91,92,226,0.7)] group-hover:shadow-[0_0_12px_rgba(91,92,226,0.9)]'
                      : 'bg-white/25 group-hover:bg-white/60'
                  } ${isCurrent ? 'ring-1 ring-brand-purple/60' : ''}`}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Controls Row: Left = Play/Pause, Prev, Next; Right = Fullscreen */}
      <div className="flex items-center justify-between text-white">
        {/* Left Controls */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            className="text-white/90 hover:text-white hover:scale-110 active:scale-95 transition-all p-1 cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white text-white" />
            ) : (
              <Play className="w-5 h-5 fill-white text-white ml-0.5" />
            )}
          </button>

          {/* Previous Step Arrow */}
          <button
            type="button"
            onClick={onPrev}
            disabled={!canGoPrev}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              canGoPrev
                ? 'text-white/90 hover:text-white hover:bg-white/15 active:scale-90 cursor-pointer'
                : 'text-white/20 cursor-not-allowed'
            }`}
            title="Previous Step (Left Arrow)"
            aria-label="Previous Step"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* Next Step Arrow */}
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              canGoNext
                ? 'text-white/90 hover:text-white hover:bg-white/15 active:scale-90 cursor-pointer'
                : 'text-white/20 cursor-not-allowed'
            }`}
            title="Next Step (Right Arrow)"
            aria-label="Next Step"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* Step Count indicator */}
          {totalSteps > 0 && !isAtChapter && (
            <span className="text-[11px] font-mono text-white/50 tracking-wider ml-1">
              {currentStepIndex + 1}/{totalSteps}
            </span>
          )}

          {/* Chapters Switcher Drawer trigger */}
          {totalChapters > 1 && onOpenChapterMenu && (
            <button
              type="button"
              onClick={onOpenChapterMenu}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-medium transition-colors ml-2 cursor-pointer"
              title="Browse Chapters"
            >
              <Layers className="w-3.5 h-3.5 text-brand-purple" />
              <span className="max-w-[120px] truncate">{activeChapterTitle || 'Chapters'}</span>
            </button>
          )}

          {/* Restart Button (Desktop) */}
          {demoSettings.allowRestart !== false && (
            <button
              type="button"
              onClick={onRestart}
              className="hidden md:inline-flex text-white/50 hover:text-white/90 hover:scale-110 active:scale-95 transition-all p-1 cursor-pointer"
              title="Restart Demo (R)"
              aria-label="Restart Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Controls: Fullscreen Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="text-white/90 hover:text-white hover:scale-110 active:scale-95 transition-all p-1 cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <Maximize2 className="w-5 h-5 stroke-[2.2]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
