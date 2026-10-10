'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  IDemoScene,
  IDemoStep,
  IDemoElement,
  IDemoInteraction,
  IDemoChapter,
  ChapterButtonAction,
  DemoSettings,
  InteractionAction,
  DemoAnalyticsEventType,
} from '@/types/demo';
import { getCanonicalDemoAspectRatio } from '@/lib/utils/aspectRatio';
import { DemoEventBus } from '@/lib/runtime/interactionEngine';
import { interpolateVariables } from '@/lib/runtime/variableEngine';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
} from 'lucide-react';
import { HotspotMarker } from '@/components/demos/hotspots';
import { ChapterRenderer } from '@/components/demos/chapters';

export interface DemoRuntimePlayerProps {
  demoName: string;
  demoSettings?: DemoSettings;
  chapters?: IDemoChapter[];
  scenes: IDemoScene[];
  steps: IDemoStep[];
  elements: IDemoElement[];
  interactions?: IDemoInteraction[];
  initialVariables?: Record<string, unknown>;
  initialStepIndex?: number;
  onTrackEvent?: (
    eventType: DemoAnalyticsEventType,
    payload: {
      sceneId?: string;
      stepId?: string;
      elementId?: string;
      metadata?: Record<string, unknown>;
    }
  ) => void;
  isEmbedded?: boolean;
}

export const DemoRuntimePlayer: React.FC<DemoRuntimePlayerProps> = ({
  demoName,
  demoSettings = {},
  chapters = [],
  scenes = [],
  steps = [],
  elements = [],
  interactions = [],
  initialVariables = { viewer: { name: 'Sarah', role: 'Product Leader', company: 'Acme' } },
  initialStepIndex,
  onTrackEvent,
  isEmbedded = false,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(() =>
    typeof initialStepIndex === 'number' && initialStepIndex >= 0 && initialStepIndex < steps.length
      ? initialStepIndex
      : 0
  );

  const currentStep = steps[currentStepIndex] || steps[0];

  const [currentSceneIndex, setCurrentSceneIndex] = useState(() => {
    if (currentStep?.sceneId) {
      const matchIdx = scenes.findIndex(
        (s) => s.id === currentStep.sceneId || (s as any)._id === currentStep.sceneId
      );
      if (matchIdx !== -1) return matchIdx;
    }
    return 0;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [variables, setVariables] = useState(initialVariables);
  const [rippleTarget, setRippleTarget] = useState<{ x: number; y: number } | null>(null);

  // Chapter state in runtime
  const [activeChapterId, setActiveChapterId] = useState<string | null>(
    chapters && chapters.length > 0 ? chapters[0].id : null
  );
  const [isAtChapter, setIsAtChapter] = useState<boolean>(
    typeof initialStepIndex === 'number' ? false : Boolean(chapters && chapters.length > 0)
  );

  // Sync initialStepIndex prop changes
  useEffect(() => {
    if (typeof initialStepIndex === 'number' && initialStepIndex >= 0 && initialStepIndex < steps.length) {
      setCurrentStepIndex(initialStepIndex);
      setIsAtChapter(false);
    }
  }, [initialStepIndex, steps.length]);

  const activeChapter = useMemo(() => {
    if (!activeChapterId) return chapters[0] || null;
    return (
      chapters.find((ch) => ch.id === activeChapterId || ch._id === activeChapterId) ||
      chapters[0] ||
      null
    );
  }, [chapters, activeChapterId]);

  // Track chapter view once per chapter entry
  useEffect(() => {
    if (isAtChapter && activeChapter) {
      onTrackEvent?.('CHAPTER_VIEW', {
        metadata: {
          chapterId: activeChapter.id,
          title: activeChapter.title,
        },
      });
    }
  }, [isAtChapter, activeChapter, onTrackEvent]);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamically resolve currentScene based on currentStep.sceneId
  const currentScene = useMemo(() => {
    if (currentStep?.sceneId) {
      const matched = scenes.find(
        (s) => s.id === currentStep.sceneId || (s as any)._id === currentStep.sceneId
      );
      if (matched) return matched;
    }
    return scenes[currentSceneIndex] || scenes[0];
  }, [scenes, currentStep, currentSceneIndex]);

  // Keep scene index in sync when step switches
  useEffect(() => {
    if (currentStep?.sceneId) {
      const idx = scenes.findIndex(
        (s) => s.id === currentStep.sceneId || (s as any)._id === currentStep.sceneId
      );
      if (idx !== -1 && idx !== currentSceneIndex) {
        setCurrentSceneIndex(idx);
      }
    }
  }, [currentStep, scenes, currentSceneIndex]);

  // Filter elements belonging to active scene and active step
  const sceneElements = useMemo(() => {
    if (!currentScene) return [];
    return elements.filter((el) => {
      const matchScene =
        !el.sceneId ||
        el.sceneId === currentScene.id ||
        (el as any)._id === currentScene.id ||
        el.sceneId === (currentScene as any)._id;

      if (el.stepId && currentStep) {
        return (
          el.stepId === currentStep.id ||
          (el as any)._id === currentStep.id ||
          el.stepId === (currentStep as any)._id
        );
      }
      return matchScene;
    });
  }, [elements, currentScene, currentStep]);

  // Find target element for current walkthrough step
  const targetElement = useMemo(() => {
    if (!currentStep?.targetElementId) return null;
    return sceneElements.find(
      (el) => el.id === currentStep.targetElementId || el._id === currentStep.targetElementId
    );
  }, [currentStep, sceneElements]);

  // Event bus & action handling
  const handleAction = useCallback(
    (action: InteractionAction) => {
      switch (action.type) {
        case 'nextStep':
          goToNextStep();
          break;
        case 'previousStep':
          goToPrevStep();
          break;
        case 'openScene':
          if (action.targetSceneId) {
            const idx = scenes.findIndex(
              (s) => s.id === action.targetSceneId || s._id === action.targetSceneId
            );
            if (idx !== -1) {
              setCurrentSceneIndex(idx);
              onTrackEvent?.('STEP_VIEW', { sceneId: action.targetSceneId });
            }
          }
          break;
        case 'openUrl':
          if (action.url) {
            window.open(action.url, action.openInNewTab ? '_blank' : '_self');
          }
          break;
        case 'setVariable':
          if (action.variableKey) {
            setVariables((prev) => ({
              ...prev,
              [action.variableKey!]: action.variableValue,
            }));
          }
          break;
        case 'completeDemo':
          handleComplete();
          break;
        default:
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenes, steps, currentStepIndex]
  );

  // Canonical Aspect Ratio single source of truth driving runtime playback stage
  const canonicalRatioInfo = useMemo(() => {
    return getCanonicalDemoAspectRatio(
      { settings: demoSettings } as any,
      scenes
    );
  }, [demoSettings, scenes]);

  const eventBus = useMemo(() => {
    const bus = new DemoEventBus(interactions, variables);
    bus.setActionHandler(handleAction);
    return bus;
  }, [interactions, variables, handleAction]);

  // Chapter Action Handler
  const handleChapterAction = useCallback(
    (action: ChapterButtonAction) => {
      onTrackEvent?.('CHAPTER_BUTTON_CLICK', {
        metadata: {
          chapterId: activeChapter?.id,
          actionType: action.type,
          targetId: action.targetId,
        },
      });

      if (action.type === 'next') {
        if (activeChapter) {
          const firstStepIdx = steps.findIndex(
            (s) => s.chapterId === activeChapter.id || s.chapterId === activeChapter._id
          );
          if (firstStepIdx !== -1) {
            setCurrentStepIndex(firstStepIdx);
            const targetStep = steps[firstStepIdx];
            if (targetStep?.sceneId) {
              const scIdx = scenes.findIndex(
                (sc) => sc.id === targetStep.sceneId || sc._id === targetStep.sceneId
              );
              if (scIdx !== -1) setCurrentSceneIndex(scIdx);
            }
          }
        }
        setIsAtChapter(false);
      } else if (action.type === 'previous') {
        goToPrevStep();
      } else if (action.type === 'go_to_step') {
        if (action.targetId) {
          const sIdx = steps.findIndex(
            (s) => s.id === action.targetId || s._id === action.targetId
          );
          if (sIdx !== -1) {
            setCurrentStepIndex(sIdx);
            const targetStep = steps[sIdx];
            if (targetStep?.sceneId) {
              const scIdx = scenes.findIndex(
                (sc) => sc.id === targetStep.sceneId || sc._id === targetStep.sceneId
              );
              if (scIdx !== -1) setCurrentSceneIndex(scIdx);
            }
            setIsAtChapter(false);
          }
        }
      } else if (action.type === 'go_to_chapter') {
        if (action.targetId) {
          const ch = chapters.find(
            (c) => c.id === action.targetId || c._id === action.targetId
          );
          if (ch) {
            setActiveChapterId(ch.id);
            setIsAtChapter(true);
          }
        }
      } else if (action.type === 'external_url') {
        if (action.url && (action.url.startsWith('http://') || action.url.startsWith('https://'))) {
          window.open(action.url, '_blank', 'noopener,noreferrer');
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeChapter, chapters, steps, scenes]
  );

  // Hotspot action handler for interactive runtime
  const handleHotspotAction = useCallback(
    (actionType: string, target?: string) => {
      onTrackEvent?.('HOTSPOT_ACTION', {
        stepId: currentStep?.id,
        metadata: { action: actionType, target },
      });

      if (actionType === 'nextStep') {
        goToNextStep();
      } else if (actionType === 'previousStep') {
        goToPrevStep();
      } else if (actionType === 'goToStep') {
        if (target) {
          const idx = steps.findIndex((s) => s.id === target || s._id === target);
          if (idx !== -1) {
            setCurrentStepIndex(idx);
            setIsAtChapter(false);
          }
        }
      } else if (actionType === 'goToChapter') {
        if (target) {
          const ch = chapters.find((c) => c.id === target || c._id === target);
          if (ch) {
            setActiveChapterId(ch.id);
            setIsAtChapter(true);
          }
        }
      } else if (actionType === 'goToScene') {
        if (target) {
          const idx = scenes.findIndex((s) => s.id === target || s._id === target);
          if (idx !== -1) setCurrentSceneIndex(idx);
        }
      } else if (actionType === 'externalUrl') {
        if (target && (target.startsWith('http://') || target.startsWith('https://'))) {
          window.open(target, '_blank', 'noopener,noreferrer');
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentStep, steps, scenes, chapters, currentStepIndex]
  );

  // Check if any active element requests a backdrop overlay
  const hasActiveBackdrop = useMemo(() => {
    return sceneElements.some(
      (el) => (el.type === 'hotspot' || el.hotspotConfig) && el.hotspotConfig?.appearance?.backdrop
    );
  }, [sceneElements]);

  // Track initial demo view
  useEffect(() => {
    onTrackEvent?.('DEMO_VIEW', {
      sceneId: currentScene?.id,
      stepId: currentStep?.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track step view on step change
  useEffect(() => {
    if (currentStep) {
      onTrackEvent?.('STEP_VIEW', {
        sceneId: currentScene?.id,
        stepId: currentStep?.id,
      });
    }
  }, [currentStepIndex, currentStep, currentScene, onTrackEvent]);

  const goToNextStep = () => {
    if (currentStep) {
      onTrackEvent?.('STEP_COMPLETE', {
        sceneId: currentScene?.id,
        stepId: currentStep?.id,
      });
    }

    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);

      // If next step belongs to a different scene, switch scenes
      const nextStep = steps[nextIndex];
      if (nextStep?.sceneId) {
        const sceneIdx = scenes.findIndex(
          (s) => s.id === nextStep.sceneId || s._id === nextStep.sceneId
        );
        if (sceneIdx !== -1 && sceneIdx !== currentSceneIndex) {
          setCurrentSceneIndex(sceneIdx);
        }
      }
    } else {
      handleComplete();
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);

      const prevStep = steps[prevIndex];
      if (prevStep?.sceneId) {
        const sceneIdx = scenes.findIndex(
          (s) => s.id === prevStep.sceneId || s._id === prevStep.sceneId
        );
        if (sceneIdx !== -1 && sceneIdx !== currentSceneIndex) {
          setCurrentSceneIndex(sceneIdx);
        }
      }
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setIsPlaying(false);
    onTrackEvent?.('DEMO_COMPLETE', {
      sceneId: currentScene?.id,
      stepId: currentStep?.id,
    });
  };

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setIsPlaying(false);
    onTrackEvent?.('REPLAY', {
      sceneId: scenes[0]?.id,
      stepId: steps[0]?.id,
    });
  };

  const handleElementClick = (element: IDemoElement) => {
    onTrackEvent?.('ELEMENT_CLICK', {
      sceneId: currentScene?.id,
      stepId: currentStep?.id,
      elementId: element.id,
    });

    // Trigger ripple visual
    setRippleTarget({ x: element.position.x, y: element.position.y });
    setTimeout(() => setRippleTarget(null), 700);

    // Dispatch event to interaction bus
    eventBus.dispatch('click', currentScene?.id, element.id);

    // If active walkthrough step targets this element and is click-action
    if (
      currentStep?.targetElementId === element.id ||
      currentStep?.targetElementId === element._id ||
      currentStep?.action === 'click'
    ) {
      goToNextStep();
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // Autoplay progression
  useEffect(() => {
    if (!isPlaying || isCompleted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const delay = demoSettings.autoplayDelay || currentStep?.navigation?.delayMs || 4000;
    timerRef.current = setTimeout(() => {
      goToNextStep();
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentStepIndex, isCompleted]);

  // Interpolated step content
  const stepTitle = interpolateVariables(
    currentStep?.tooltip?.title || currentStep?.title || '',
    variables
  );
  const stepDescription = interpolateVariables(
    currentStep?.tooltip?.description || currentStep?.description || '',
    variables
  );

  const progressPercentage =
    steps.length > 0 ? Math.round(((currentStepIndex + 1) / steps.length) * 100) : 100;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden font-sans select-none bg-[#0a0a10] text-white ${
        isFullscreen ? 'fixed inset-0 z-50' : 'rounded-2xl shadow-2xl'
      }`}
    >
      {/* Main Canonical Aspect Ratio Canvas Stage */}
      <div
        style={{
          aspectRatio: canonicalRatioInfo.cssRatio,
        }}
        className="relative w-full h-full max-w-[1920px] max-h-[1080px] flex items-center justify-center overflow-hidden transition-all duration-300 mx-auto"
      >
        {isAtChapter && activeChapter ? (
          <div className="w-full h-full flex items-center justify-center animate-fade-in">
            <ChapterRenderer
              chapter={activeChapter}
              mode="runtime"
              onAction={handleChapterAction}
              steps={steps}
              scenes={scenes}
            />
          </div>
        ) : (
          <>
            {/* Background Media (Image or Video) */}
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
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentScene.sourceAssetUrl}
                  alt={currentScene.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              )
            ) : (
              <div className="w-full h-full bg-[#13131e] flex items-center justify-center text-[#6b7280]">
                <span>No scene preview available</span>
              </div>
            )}

        {/* Spotlight Cutout Mask Overlay */}
        {currentStep?.spotlight?.enabled && targetElement && !isCompleted && (
          <div className="absolute inset-0 pointer-events-none transition-all duration-300">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <mask id="spotlight-cutout-mask">
                  {/* White background reveals mask */}
                  <rect width="100%" height="100%" fill="white" />
                  {/* Black cutout makes hole transparent */}
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
                mask="url(#spotlight-cutout-mask)"
              />
            </svg>
          </div>
        )}

        {/* Dim Backdrop Overlay when requested by active hotspot */}
        {hasActiveBackdrop && !isCompleted && (
          <div className="absolute inset-0 bg-black/50 z-20 pointer-events-none transition-opacity duration-300" />
        )}

        {/* Interactive Elements / Hotspots */}
        {!isCompleted &&
          sceneElements.map((element) => {
            if (element.type === 'hotspot' || element.hotspotConfig) {
              return (
                <HotspotMarker
                  key={`${element.id || element._id}-step-${currentStepIndex}`}
                  element={element}
                  isEditor={false}
                  stepNumber={currentStepIndex + 1}
                  totalSteps={steps.length}
                  containerRef={containerRef}
                  onAction={(action, target) => handleHotspotAction(action, target)}
                  onSelect={() => {
                    onTrackEvent?.('HOTSPOT_CLICK', {
                      stepId: currentStep?.id,
                      elementId: element.id,
                    });
                  }}
                />
              );
            }

            const isTarget = targetElement?.id === element.id || targetElement?._id === element.id;
            return (
              <div
                key={element.id || element._id}
                style={{
                  left: `${element.position.x}%`,
                  top: `${element.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => handleElementClick(element)}
                className="absolute z-20 cursor-pointer group flex items-center justify-center"
              >
                {/* Hotspot Dual Radar Pulse Waves */}
                {element.style?.pulseAnimation !== false && (
                  <>
                    <span
                      className={`absolute w-10 h-10 rounded-full animate-hotspot-radar-1 opacity-70 pointer-events-none ${
                        isTarget ? 'bg-[#5B5CE2]' : 'bg-[#5B5CE2]/60'
                      }`}
                    />
                    <span
                      className={`absolute w-8 h-8 rounded-full animate-hotspot-radar-2 opacity-50 pointer-events-none ${
                        isTarget ? 'bg-[#5B5CE2]' : 'bg-[#5B5CE2]/40'
                      }`}
                    />
                  </>
                )}

                {/* Hotspot Core Beacon - Supademo polished proportion */}
                <div
                  style={{
                    backgroundColor: '#5B5CE2',
                    boxShadow: isTarget
                      ? '0 0 0 2.5px #ffffff, 0 4px 16px rgba(91,92,226,0.65)'
                      : '0 0 0 2.5px #ffffff, 0 3px 12px rgba(91,92,226,0.4)',
                  }}
                  className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-white transition-all duration-150 group-hover:scale-115"
                >
                  <span className="w-2 h-2 rounded-full bg-white shadow-xs pointer-events-none animate-pulse" />
                </div>
              </div>
            );
          })}

        {/* Click Ripple Effect */}
        {rippleTarget && (
          <div
            style={{
              left: `${rippleTarget.x}%`,
              top: `${rippleTarget.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-30 pointer-events-none w-16 h-16 rounded-full border-2 border-[#5B5CE2] bg-[#5B5CE2]/20 animate-ping"
          />
        )}

        {/* Guided Walkthrough Tooltip / Callout Card (if no hotspot with callout on step) */}
        {currentStep && !isCompleted && !sceneElements.some((el) => (el.type === 'hotspot' || el.hotspotConfig) && el.hotspotConfig?.type !== 'area') && (
          <div
            style={{
              left: targetElement ? `${Math.min(Math.max(targetElement.position.x, 22), 78)}%` : '50%',
              top: targetElement
                ? targetElement.position.y > 60
                  ? `calc(${targetElement.position.y}% - 140px)`
                  : `calc(${targetElement.position.y}% + 45px)`
                : '80%',
              transform: 'translate(-50%, 0)',
            }}
            className="absolute z-40 w-[90%] max-w-[360px] bg-white text-[#0f0f1a] rounded-2xl shadow-2xl border border-[#e5e7eb] p-5 animate-fade-in transition-all duration-300"
          >
            {/* Header pill */}
            <div className="flex items-center justify-between mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5B5CE2]/10 text-[#5B5CE2] text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5B5CE2]" />
                {currentStep.tooltip?.badge || `Step ${currentStepIndex + 1} of ${steps.length}`}
              </span>

              {currentStep.navigation?.canSkip !== false && (
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="text-[#9ca3af] hover:text-[#0f0f1a] p-1 rounded-md transition-colors cursor-pointer"
                  title="Skip this step"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Title & Description */}
            <h4 className="font-extrabold text-[15px] leading-snug text-[#0f0f1a] mb-1.5">
              {stepTitle}
            </h4>
            <p className="text-[13px] text-[#6b7280] leading-relaxed mb-4">
              {stepDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f4]">
              {currentStepIndex > 0 ? (
                <button
                  type="button"
                  onClick={goToPrevStep}
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
                onClick={goToNextStep}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B5CE2] hover:bg-[#4a4bd4] text-white text-[13px] font-bold shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>
                  {currentStepIndex === steps.length - 1
                    ? 'Complete Tour'
                    : currentStep.tooltip?.buttonText || 'Next'}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
          </>
        )}

        {/* Completion Modal */}
        {isCompleted && (
          <div className="absolute inset-0 z-50 bg-[#0a0a10]/85 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
            <div className="w-full max-w-md bg-white text-[#0f0f1a] rounded-3xl p-8 shadow-2xl border border-white/20 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B5CE2] mb-1">
                Tour Completed
              </span>
              <h3 className="text-2xl font-extrabold text-[#0f0f1a] tracking-tight mb-2">
                You’re Ready to Get Started!
              </h3>
              <p className="text-[14px] text-[#6b7280] leading-relaxed mb-6">
                You’ve explored all key highlights of {demoName}. Ready to experience Preveuo in your own workspace?
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#d1d5db] text-[#0f0f1a] font-semibold text-[14px] hover:border-[#5B5CE2] hover:text-[#5B5CE2] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Replay Tour
                </button>

                <a
                  href="/register"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#5B5CE2] hover:bg-[#4a4bd4] text-white font-bold text-[14px] shadow-md transition-transform hover:-translate-y-0.5"
                >
                  <span>Start Free Trial</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Control Bar */}
      {demoSettings.showControls !== false && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#12121a]/90 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-4 shadow-2xl">
          {/* Restart */}
          {demoSettings.allowRestart !== false && (
            <button
              type="button"
              onClick={handleRestart}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-lg"
              title="Restart demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Play / Pause Autoplay */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg"
            title={isPlaying ? 'Pause autoplay' : 'Play tour automatically'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Chapter / Step Progress Pill */}
          {isAtChapter && activeChapter ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#5B5CE2]" />
              <span className="max-w-[120px] truncate">{activeChapter.title || 'Chapter'}</span>
            </div>
          ) : demoSettings.progressBar !== false && steps.length > 0 && (
            <div className="flex items-center gap-2 px-2">
              <div className="w-24 sm:w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#5B5CE2] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-[11px] font-mono font-medium text-white/70">
                {currentStepIndex + 1}/{steps.length}
              </span>
            </div>
          )}

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Brand pill */}
          {demoSettings.showBranding !== false && (
            <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-white/10 text-[10px] text-white/50 uppercase tracking-widest font-bold">
              <span>Powered by</span>
              <span className="text-[#5B5CE2] font-extrabold">Preveuo</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
