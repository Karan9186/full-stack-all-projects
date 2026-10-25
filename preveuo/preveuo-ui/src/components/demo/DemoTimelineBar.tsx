import React from 'react';
import { DemoStep } from '@/types/demo';
import { Button, IconButton } from '@/components/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DemoTimelineBarProps {
  steps: DemoStep[];
  currentIndex: number;
  onSelectStep: (idx: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const DemoTimelineBar: React.FC<DemoTimelineBarProps> = ({
  steps,
  currentIndex,
  onSelectStep,
  onPrev,
  onNext,
}) => {
  return (
    <div className="h-16 border-t border-border-default bg-white px-4 sm:px-8 flex items-center justify-between shrink-0 z-20">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={currentIndex === 0}
        leftIcon={<ChevronLeft className="w-4 h-4" />}
      >
        Previous
      </Button>

      {/* Step Pills Timeline */}
      <div className="flex items-center gap-2 overflow-x-auto px-4 max-w-xl no-scrollbar">
        {steps.map((st, idx) => {
          const isActive = idx === currentIndex;
          const isPassed = idx < currentIndex;

          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onSelectStep(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-brand-purple text-white shadow-xs'
                  : isPassed
                  ? 'bg-border-light text-heading hover:bg-border-default'
                  : 'bg-white text-muted border border-border-default hover:border-border-input'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                isActive ? 'bg-white text-brand-purple' : 'bg-border-default text-body'
              }`}>
                {idx + 1}
              </span>
              <span className="hidden sm:inline truncate max-w-[100px]">{st.title}</span>
            </button>
          );
        })}
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={onNext}
        rightIcon={<ChevronRight className="w-4 h-4" />}
      >
        {currentIndex === steps.length - 1 ? 'Finish' : 'Next'}
      </Button>
    </div>
  );
};
