import React from 'react';
import Link from 'next/link';
import { Button, Badge, IconButton } from '@/components/ui';
import { ArrowLeft, Play, Pause, Share2, RotateCcw } from 'lucide-react';

interface DemoPlayerHeaderProps {
  title: string;
  stepNumber: number;
  totalSteps: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  onShare: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  mode: 'guided' | 'interactive';
  onModeChange: (mode: 'guided' | 'interactive') => void;
}

export const DemoPlayerHeader: React.FC<DemoPlayerHeaderProps> = ({
  title,
  stepNumber,
  totalSteps,
  isPlaying,
  onTogglePlay,
  onRestart,
  onShare,
  speed,
  onSpeedChange,
  mode,
  onModeChange,
}) => {
  return (
    <header className="h-16 border-b border-[#e5e7eb] bg-white px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      {/* Left: Back & Tour Info */}
      <div className="flex items-center gap-3">
        <Link href="/workspace">
          <IconButton
            variant="secondary"
            size="sm"
            aria-label="Back to Workspace"
          >
            <ArrowLeft className="w-4 h-4 text-[#0f0f1a]" />
          </IconButton>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[14px] sm:text-[15px] font-bold text-[#0f0f1a] truncate max-w-[200px] sm:max-w-xs">
              {title}
            </h1>
            <Badge variant="purple" size="sm">
              Step {stepNumber} of {totalSteps}
            </Badge>
          </div>
        </div>
      </div>

      {/* Center: Playback Controls */}
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant={isPlaying ? 'primary' : 'outline'}
          size="sm"
          onClick={onTogglePlay}
          leftIcon={
            isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )
          }
        >
          {isPlaying ? 'Pause' : 'Autoplay'}
        </Button>

        <IconButton
          variant="ghost"
          size="sm"
          onClick={onRestart}
          aria-label="Restart tour"
        >
          <RotateCcw className="w-4 h-4 text-[#6b7280]" />
        </IconButton>

        {/* Speed toggle */}
        <div className="flex items-center rounded-xl bg-[#f0f0f4] p-1 border border-[#e5e7eb] text-xs">
          {[1, 1.5, 2].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                speed === s
                  ? 'bg-white text-[#0f0f1a] shadow-xs'
                  : 'text-[#6b7280] hover:text-[#0f0f1a]'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Mode switcher */}
        <div className="flex items-center rounded-xl bg-[#f0f0f4] p-1 border border-[#e5e7eb] text-xs">
          <button
            type="button"
            onClick={() => onModeChange('guided')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              mode === 'guided'
                ? 'bg-white text-[#5B5CE2] shadow-xs'
                : 'text-[#6b7280] hover:text-[#0f0f1a]'
            }`}
          >
            Guided
          </button>
          <button
            type="button"
            onClick={() => onModeChange('interactive')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              mode === 'interactive'
                ? 'bg-white text-[#5B5CE2] shadow-xs'
                : 'text-[#6b7280] hover:text-[#0f0f1a]'
            }`}
          >
            Explore
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={onShare}
          leftIcon={<Share2 className="w-3.5 h-3.5" />}
        >
          Share Demo
        </Button>
      </div>
    </header>
  );
};
