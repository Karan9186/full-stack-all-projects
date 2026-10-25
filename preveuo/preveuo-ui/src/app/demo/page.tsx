'use client';

import React, { useState, useEffect } from 'react';
import { SAMPLE_STEPS } from '@/lib/demoData';
import confetti from 'canvas-confetti';
import {
  DemoPlayerHeader,
  DemoCanvas,
  DemoTimelineBar,
  DemoShareModal,
} from '@/components/demo';

export default function DemoPlayerPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [mode, setMode] = useState<'guided' | 'interactive'>('guided');
  const [showShareModal, setShowShareModal] = useState(false);

  const currentStep = SAMPLE_STEPS[currentStepIndex];
  const totalSteps = SAMPLE_STEPS.length;

  // Autoplay ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !isCompleted) {
      const delay = (currentStep.delayMs || 3500) / speed;
      timer = setTimeout(() => {
        handleNext();
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, isCompleted, speed]);

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback if confetti isn't supported
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setIsCompleted(false);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setIsPlaying(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-heading font-sans overflow-hidden select-none">
      <DemoPlayerHeader
        title="Acme Analytics Tour"
        stepNumber={currentStepIndex + 1}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onRestart={handleRestart}
        onShare={() => setShowShareModal(true)}
        speed={speed}
        onSpeedChange={setSpeed}
        mode={mode}
        onModeChange={setMode}
      />

      <DemoCanvas
        step={currentStep}
        onNext={handleNext}
        isLastStep={currentStepIndex === totalSteps - 1}
      />

      <DemoTimelineBar
        steps={SAMPLE_STEPS}
        currentIndex={currentStepIndex}
        onSelectStep={(idx) => {
          setCurrentStepIndex(idx);
          setIsCompleted(false);
        }}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <DemoShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        demoUrl="https://preveuo.com/demo?id=sample-tour"
      />
    </div>
  );
}
