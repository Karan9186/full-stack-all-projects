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
    <div className="h-16 border-t border-[#e5e7eb] bg-white px-4 sm:px-8 flex items-center justify-between shrink-0 z-20">
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
                  ? 'bg-[#5B5CE2] text-white shadow-xs'
                  : isPassed
                  ? 'bg-[#f0f0f4] text-[#0f0f1a] hover:bg-[#e5e7eb]'
                  : 'bg-white text-[#9ca3af] border border-[#e5e7eb] hover:border-[#d1d5db]'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                isActive ? 'bg-white text-[#5B5CE2]' : 'bg-[#e5e7eb] text-[#6b7280]'
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
