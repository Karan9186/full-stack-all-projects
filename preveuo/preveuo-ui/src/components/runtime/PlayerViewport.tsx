'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  IDemoScene,
  IDemoStep,
  IDemoElement,
  IDemoChapter,
  ChapterButtonAction,
  DemoSettings,
} from '@/types/demo';
import { HotspotMarker, PointerRenderer } from '@/components/demos/hotspots';
import { ChapterRenderer } from '@/components/demos/chapters';
import { computeCameraTransform, getEasingCss } from '@/lib/utils/cameraTransform';
import { ChevronRight, ChevronLeft, X, AlertCircle } from 'lucide-react';

export interface PlayerViewportProps {
  currentScene?: IDemoScene;
  currentStep?: IDemoStep;
  currentStepIndex: number;
  totalSteps: number;
  sceneElements: IDemoElement[];
  targetElement?: IDemoElement | null;
  canonicalAspectRatio: string;
  isAtChapter: boolean;
  activeChapter?: IDemoChapter | null;
  hasActiveBackdrop: boolean;
  transitionStyle?: 'fade' | 'slide' | 'zoom' | 'none';
  containerRef: React.RefObject<HTMLDivElement | null>;
  onHotspotAction: (actionType: string, target?: string) => void;
  onElementClick: (element: IDemoElement) => void;
  onChapterAction: (action: ChapterButtonAction) => void;
  onTrackEvent?: (eventType: any, payload: any) => void;
  steps: IDemoStep[];
  scenes: IDemoScene[];
  stepTitle?: string;
  stepDescription?: string;
  cameraScale?: number;
  cameraTransition?: string;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const PlayerViewport: React.FC<PlayerViewportProps> = ({
  currentScene,
  currentStep,
  currentStepIndex,
  totalSteps,
  sceneElements,
  targetElement,
  canonicalAspectRatio,
  isAtChapter,
  activeChapter,
  hasActiveBackdrop,
  transitionStyle = 'fade',
  containerRef,
  onHotspotAction,
  onElementClick,
  onChapterAction,
  onTrackEvent,
  steps,
  scenes,
  stepTitle = '',
  stepDescription = '',
  cameraScale = 1.0,
  cameraTransition = 'none',
  onNextStep,
  onPrevStep,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Resolve effective focal point (if linked to a hotspot, anchor to it)
  const effectiveFocusPoint = useMemo(() => {
    if (currentStep?.zoomPan?.linkedHotspotId) {
      const linked = sceneElements.find(
        (el) =>
          el.id === currentStep.zoomPan?.linkedHotspotId ||
          (el as any)._id === currentStep.zoomPan?.linkedHotspotId
      );
      if (linked) {
        return { x: linked.position.x, y: linked.position.y };
      }
    }
    return currentStep?.zoomPan?.focusPoint || { x: 50, y: 50 };
  }, [currentStep?.zoomPan, sceneElements]);

  const cameraState = useMemo(() => {
    return computeCameraTransform({
      scale: cameraScale,
      focusPoint: effectiveFocusPoint,
      active: Boolean(currentStep?.zoomPan?.enabled),
    });
  }, [cameraScale, effectiveFocusPoint, currentStep?.zoomPan?.enabled]);

  // Transition classes
  const getTransitionClass = () => {
    switch (transitionStyle) {
      case 'slide':
        return 'animate-in slide-in-from-right-4 duration-300';
      case 'zoom':
        return 'animate-in zoom-in-95 duration-300';
      case 'fade':
      default:
        return 'animate-in fade-in duration-250';
    }
  };

  return (
    <div
      style={{
        aspectRatio: canonicalAspectRatio,
      }}
      className="relative w-full h-full max-w-[1920px] max-h-[1080px] flex items-center justify-center overflow-hidden transition-all duration-300 mx-auto select-none"
    >
      {/* 1. CHAPTER VIEW (Intro / Form / Password / Embed) */}
      {isAtChapter && activeChapter ? (
        <div className="w-full h-full flex items-center justify-center animate-in fade-in duration-300">
          <ChapterRenderer
            chapter={activeChapter}
            mode="runtime"
            onAction={onChapterAction}
            steps={steps}
            scenes={scenes}
          />
        </div>
      ) : (
        <div className={`relative w-full h-full ${getTransitionClass()}`}>
          {/* Virtual Camera Transformed Stage Container */}
          <div
            className="relative w-full h-full will-change-transform"
            style={{
              transform: cameraState.transform,
              transformOrigin: cameraState.transformOrigin,
              transition: cameraTransition,
            }}
          >
          {/* 2. MEDIA LAYER (Image or Video) */}
          {currentScene?.sourceAssetUrl ? (
            Boolean(currentScene.sourceAssetUrl.match(/\.(mp4|webm|mov)$/i)) ||
            currentScene.sourceType === 'recording' ? (
              <video
                key={currentScene.id || currentScene.sourceAssetUrl}
                src={currentScene.sourceAssetUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Image Loading Skeleton */}
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 bg-[#12121a] animate-pulse flex items-center justify-center">
                    <span className="w-8 h-8 rounded-full border-2 border-[#5B5CE2] border-t-transparent animate-spin" />
                  </div>
                )}

                {/* Actual Saved Scene Screenshot */}
                <img
                  key={currentScene.id || currentScene.sourceAssetUrl}
                  src={currentScene.sourceAssetUrl}
                  alt={currentScene.name || 'Demo Screenshot'}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Image Load Error Fallback */}
                {imageError && (
                  <div className="absolute inset-0 bg-[#12121a] flex flex-col items-center justify-center text-white/60 p-4 text-center">
                    <AlertCircle className="w-8 h-8 text-[#5B5CE2] mb-2" />
                    <p className="text-xs font-semibold text-white/80 mb-2">Media could not be displayed</p>
                    <button
                      type="button"
                      onClick={() => {
                        setImageError(false);
                        setImageLoaded(false);
                      }}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      Retry Loading
                    </button>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="w-full h-full bg-[#111119] flex items-center justify-center text-[#6b7280]">
              <span className="text-xs font-medium">No scene image available</span>
            </div>
          )}

          {/* 3. SPOTLIGHT CUTOUT MASK OVERLAY */}
          {currentStep?.spotlight?.enabled && targetElement && (
            <div className="absolute inset-0 pointer-events-none transition-all duration-300 z-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <mask id="player-spotlight-cutout">
                    <rect width="100%" height="100%" fill="white" />
                    <rect
                      x={`calc(${targetElement.position.x}% - ${
                        (targetElement.position.width || 36) / 2 + 10
                      }px)`}
                      y={`calc(${targetElement.position.y}% - ${
                        (targetElement.position.height || 36) / 2 + 10
                      }px)`}
                      width={(targetElement.position.width || 36) + 20}
                      height={(targetElement.position.height || 36) + 20}
                      rx={currentStep.spotlight.borderRadius || 12}
                      fill="black"
                    />
                  </mask>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="rgba(10, 10, 16, 0.65)"
                  mask="url(#player-spotlight-cutout)"
                />
              </svg>
            </div>
          )}

          {/* 4. DIM BACKDROP OVERLAY */}
          {hasActiveBackdrop && (
            <div className="absolute inset-0 bg-black/55 z-20 pointer-events-none transition-opacity duration-300" />
          )}

          {/* 5. HOTSPOTS & INTERACTIVE ELEMENTS LAYER */}
          {sceneElements.map((element) => {
            if (element.type === 'hotspot' || element.hotspotConfig) {
              return (
                <HotspotMarker
                  key={`${element.id || (element as any)._id}-step-${currentStepIndex}`}
                  element={element}
                  isEditor={false}
                  stepNumber={currentStepIndex + 1}
                  totalSteps={totalSteps}
                  containerRef={containerRef}
                  onAction={(action, target) => onHotspotAction(action, target)}
                  onSelect={() => {
                    onTrackEvent?.('HOTSPOT_CLICK', {
                      stepId: currentStep?.id,
                      elementId: element.id,
                    });
                  }}
                />
              );
            }

            // Other scene elements (buttons, links, etc.)
            const isTarget =
              targetElement?.id === element.id || (targetElement as any)?._id === element.id;

            return (
              <div
                key={element.id || (element as any)._id}
                style={{
                  left: `${element.position.x}%`,
                  top: `${element.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => onElementClick(element)}
                className="absolute z-20 cursor-pointer group flex items-center justify-center"
              >
                {/* Pointer indicator on targeted interactive element */}
                <PointerRenderer
                  style={((element as any).hotspotConfig?.appearance?.pointerStyle as any) || 'cursor'}
                  color={element.style?.backgroundColor || '#5B5CE2'}
                  autoPlayMotion={true}
                  isSelected={isTarget}
                />
              </div>
            );
          })}
          </div>

          {/* 6. GUIDED WALKTHROUGH STEP CALLOUT CARD (when no explicit hotspot callout element exists) */}
          {currentStep &&
            !sceneElements.some(
              (el) =>
                (el.type === 'hotspot' || el.hotspotConfig) &&
                el.hotspotConfig?.type !== 'area'
            ) && (
              <div
                style={{
                  left: targetElement
                    ? `${Math.min(Math.max(targetElement.position.x, 22), 78)}%`
                    : '50%',
                  top: targetElement
                    ? targetElement.position.y > 60
                      ? `calc(${targetElement.position.y}% - 140px)`
                      : `calc(${targetElement.position.y}% + 45px)`
                    : '80%',
                  transform: 'translate(-50%, 0)',
                }}
                className="absolute z-40 w-[90%] max-w-[360px] bg-white text-[#0f0f1a] rounded-2xl shadow-2xl border-0 p-5 animate-in fade-in zoom-in-95 duration-300"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5B5CE2]/10 text-[#5B5CE2] text-[11px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5B5CE2]" />
                    {currentStep.tooltip?.badge ||
                      `Step ${currentStepIndex + 1} of ${totalSteps}`}
                  </span>

                  {currentStep.navigation?.canSkip !== false && (
                    <button
                      type="button"
                      onClick={onNextStep}
                      className="text-[#9ca3af] hover:text-[#0f0f1a] p-1 rounded-md transition-colors cursor-pointer"
                      title="Skip this step"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Title & Description */}
                <h4 className="font-extrabold text-[15px] leading-snug text-[#0f0f1a] mb-1.5">
                  {stepTitle || currentStep.title || 'Interactive Step'}
                </h4>
                {stepDescription && (
                  <p className="text-[13px] text-[#6b7280] leading-relaxed mb-4">
                    {stepDescription}
                  </p>
                )}

                {/* Step Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f4]">
                  {currentStepIndex > 0 ? (
                    <button
                      type="button"
                      onClick={onPrevStep}
                      className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#6b7280] hover:text-[#0f0f1a] transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                  ) : (
                    <span />
                  )}

                  <button
                    type="button"
                    onClick={onNextStep}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B5CE2] hover:bg-[#4a4bd4] text-white text-[13px] font-bold shadow-md transition-all hover:-translate-y-0.5 cursor-pointer active:scale-95"
                  >
                    <span>
                      {currentStepIndex === totalSteps - 1
                        ? 'Complete Tour'
                        : currentStep.tooltip?.buttonText || 'Next'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};
