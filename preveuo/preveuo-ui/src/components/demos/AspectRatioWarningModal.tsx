'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui';
import { AlertTriangle, ArrowRight, Crop } from 'lucide-react';
import { AspectRatioInfo, CanonicalAspectRatioInfo } from '@/lib/utils/aspectRatio';

export interface AspectRatioWarningModalProps {
  isOpen: boolean;
  currentInfo: CanonicalAspectRatioInfo;
  newInfo: AspectRatioInfo;
  onCancel: () => void;
  onChangeAspectRatio: () => void;
  onCropToMatch?: () => void;
  isProcessing?: boolean;
}

export const AspectRatioWarningModal: React.FC<AspectRatioWarningModalProps> = ({
  isOpen,
  currentInfo,
  newInfo,
  onCancel,
  onChangeAspectRatio,
  onCropToMatch,
  isProcessing = false,
}) => {
  // Support Escape key to close/cancel
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel, isProcessing]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="aspect-ratio-warning-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-border-default animate-in zoom-in-95 duration-200 text-left relative">
        {/* Warning Icon Badge - Amber Outlined */}
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-center justify-center text-amber-600 mb-4 shadow-2xs">
          <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
        </div>

        {/* Modal Title */}
        <h3
          id="aspect-ratio-warning-title"
          className="text-xl font-bold text-heading tracking-tight mb-2"
        >
          Aspect ratio warning
        </h3>

        {/* Explanatory Body Copy */}
        <p className="text-[13px] sm:text-[14px] text-gray-600 leading-relaxed mb-6 font-normal">
          Your new media has a different aspect ratio than your current Preveuo demo.
          To prevent hotspot and slide misalignment, upload or crop content to match
          the current aspect ratio—Preveuo uses the first slide to set the aspect
          ratio for all steps.{' '}
          <a
            href="https://preveuo.com/resources/aspect-ratios"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-purple hover:underline font-medium inline-block"
          >
            Learn more
          </a>
        </p>

        {/* Side-by-side Dimension & Ratio Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-2 mb-6">
          {/* Current Card */}
          <div className="bg-light border border-border-default rounded-2xl p-4 sm:p-5 text-left">
            <span className="text-xs font-semibold text-body block">Current</span>
            <div className="text-xl sm:text-2xl font-bold text-heading mt-1 tabular-nums tracking-tight">
              {currentInfo.width} × {currentInfo.height}
            </div>
            <div className="text-xs sm:text-[13px] text-body mt-1 font-medium">
              With aspect ratio of {currentInfo.label}
            </div>
          </div>

          {/* Transition Arrow */}
          <div className="flex items-center justify-center py-1 sm:py-0 text-muted">
            <ArrowRight className="w-5 h-5 hidden sm:block" />
            <div className="w-full h-px bg-border-default sm:hidden my-1" />
          </div>

          {/* New Card */}
          <div className="bg-light border border-border-default rounded-2xl p-4 sm:p-5 text-left">
            <span className="text-xs font-semibold text-body block">New</span>
            <div className="text-xl sm:text-2xl font-bold text-heading mt-1 tabular-nums tracking-tight">
              {newInfo.width} × {newInfo.height}
            </div>
            <div className="text-xs sm:text-[13px] text-body mt-1 font-medium">
              With aspect ratio of {newInfo.label}
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          {onCropToMatch && (
            <Button
              variant="outline"
              size="md"
              leftIcon={<Crop className="w-4 h-4 text-brand-purple" />}
              onClick={onCropToMatch}
              disabled={isProcessing}
              className="w-full sm:w-auto"
              title="Crop the new image centered to fit the current aspect ratio without altering the demo"
            >
              Crop to match
            </Button>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={onChangeAspectRatio}
            isLoading={isProcessing}
            className="w-full sm:w-auto"
          >
            Change aspect ratio
          </Button>
        </div>
      </div>
    </div>
  );
};
