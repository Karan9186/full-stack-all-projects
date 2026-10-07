import React from 'react';
import { DemoStep } from '@/types/demo';
import { Button, Badge } from '@/components/ui';
import { ChevronRight } from 'lucide-react';

interface DemoCalloutCardProps {
  step: DemoStep;
  onNext: () => void;
  isLastStep: boolean;
}

export const DemoCalloutCard: React.FC<DemoCalloutCardProps> = ({
  step,
  onNext,
  isLastStep,
}) => {
  const { callout, targetPoint } = step;

  // Position callout relative to hotspot with safe canvas clamping
  const isRightHalf = targetPoint.x > 50;
  const isBottomHalf = targetPoint.y > 60;

  const stylePosition: React.CSSProperties = {
    left: isRightHalf ? `${Math.max(10, targetPoint.x - 32)}%` : `${Math.min(68, targetPoint.x + 4)}%`,
    top: isBottomHalf ? `${Math.max(10, targetPoint.y - 25)}%` : `${Math.min(70, targetPoint.y + 4)}%`,
  };

  return (
    <div
      style={stylePosition}
      className="absolute z-40 max-w-sm w-80 bg-white rounded-2xl p-5 shadow-2xl border border-[#e5e7eb] animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <Badge variant="purple" size="sm">
          {callout.badge || `Step ${step.stepNumber}`}
        </Badge>
      </div>

      <h3 className="text-[15px] font-bold text-[#0f0f1a] leading-snug">
        {callout.title}
      </h3>

      <p className="text-[13px] text-[#6b7280] leading-relaxed mt-1.5 mb-4">
        {callout.description}
      </p>

      <div className="flex items-center justify-end">
        <Button
          variant="primary"
          size="sm"
          onClick={onNext}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          {isLastStep ? 'Complete Tour' : callout.buttonText || 'Next Step'}
        </Button>
      </div>
    </div>
  );
};
