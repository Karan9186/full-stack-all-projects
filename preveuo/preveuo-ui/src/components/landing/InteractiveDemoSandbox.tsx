'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { SAMPLE_STEPS } from '@/lib/demoData';
import { Play, Pause, ChevronRight, ChevronLeft, RotateCcw, Maximize2, Sparkles, Check, MousePointer, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InteractiveDemoSandbox() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number } | null>(null);

  const currentStep = SAMPLE_STEPS[currentStepIndex];
  const totalSteps = SAMPLE_STEPS.length;

  // Autoplay ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !isCompleted) {
      timer = setTimeout(() => {
        handleNext();
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, isCompleted]);

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // graceful fallback
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

  const handleHotspotClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipplePos({ x: rect.width / 2, y: rect.height / 2 });
    setTimeout(() => setRipplePos(null), 600);
    handleNext();
  };

  return (
    <section id="sandbox" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-gradient from-indigo-900/30 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-xs font-semibold text-indigo-400 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Experience Sandbox</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Experience Preveuo in Action
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Click the active beacons below to navigate this live walkthrough just like your prospects will.
          </p>
        </div>

        {/* Demo Player Sandbox Container */}
        <div className="relative max-w-5xl mx-auto bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          {/* Top Player Status Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                {currentStep.title}
              </div>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {currentStep.subtitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/demo"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Fullscreen Player
              </Link>
            </div>
          </div>

          {/* Interactive Screen Stage */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 overflow-hidden select-none">
            {/* Screen Screenshot with Camera Zoom effect */}
            <div
              className="w-full h-full transition-transform duration-700 ease-out"
              style={{
                transform: `scale(${currentStep.cameraZoom || 1.0})`
              }}
            >
              <img
                src={currentStep.screenshotUrl}
                alt={currentStep.title}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Darkness Vignette */}
            <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />

            {/* Interactive Hotspot Target Beacon */}
            {!isCompleted && (
              <div
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  top: `${currentStep.targetPoint.y}%`,
                  left: `${currentStep.targetPoint.x}%`
                }}
                onClick={handleHotspotClick}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-12 h-12 rounded-full bg-indigo-500/50 animate-beacon" />
                  <span className="w-5 h-5 rounded-full bg-indigo-500 group-hover:bg-indigo-400 border-2 border-white shadow-xl transition-transform group-hover:scale-125" />
                </div>
              </div>
            )}

            {/* Contextual SaaS Callout Card */}
            {!isCompleted && (
              <div
                className="absolute z-30 transition-all duration-300"
                style={{
                  top: `${Math.min(currentStep.targetPoint.y + 7, 72)}%`,
                  left: `${Math.min(Math.max(currentStep.targetPoint.x, 20), 80)}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white p-4 sm:p-5 rounded-2xl shadow-2xl max-w-xs sm:max-w-sm">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                      {currentStep.callout.badge || `Step ${currentStep.stepNumber} of ${totalSteps}`}
                    </span>
                    <span className="text-xs text-slate-400">Click beacon to proceed</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
                    {currentStep.callout.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {currentStep.callout.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs font-mono text-slate-400">
                      Step {currentStepIndex + 1} / {totalSteps}
                    </span>
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
                    >
                      {currentStep.callout.buttonText || 'Next →'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Completion Screen Overlay */}
            {isCompleted && (
              <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-5">
                  <Check className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  Walkthrough Complete!
                </h3>
                <p className="text-sm sm:text-base text-slate-300 max-w-md mb-8">
                  You just experienced how Preveuo transforms standard screenshots into engaging, high-conversion guided demos.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Replay Demo
                  </button>
                  <Link
                    href="/create"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <span>Create Your Own Demo</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Unified Minimal Player Toolbar */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              {SAMPLE_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setIsCompleted(false);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStepIndex
                      ? 'w-8 bg-indigo-500 shadow-sm shadow-indigo-500/50'
                      : idx < currentStepIndex
                      ? 'w-4 bg-indigo-900 hover:bg-indigo-700'
                      : 'w-2 bg-slate-800 hover:bg-slate-700'
                  }`}
                  aria-label={`Jump to step ${idx + 1}`}
                />
              ))}
              <span className="text-xs text-slate-400 font-mono ml-2">
                {currentStepIndex + 1} / {totalSteps}
              </span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors"
                aria-label={isPlaying ? 'Pause walkthrough' : 'Play walkthrough'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Autoplay</span>
                  </>
                )}
              </button>
              <button
                onClick={handleNext}
                disabled={currentStepIndex === totalSteps - 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Next step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleRestart}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                aria-label="Restart demo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
