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
import {
  calculateZoomPanTotalDuration,
  getEasingCss,
  getStepDwellDuration,
  doesStepRequireInteraction,
} from '@/lib/utils/cameraTransform';
import { DemoEventBus } from '@/lib/runtime/interactionEngine';
import { interpolateVariables } from '@/lib/runtime/variableEngine';
import { PlayerControls } from './PlayerControls';
import { PlayerChapterMenu } from './PlayerChapterMenu';
import { PlayerCompletion } from './PlayerCompletion';
import { PlayerViewport } from './PlayerViewport';
import { ExternalLink } from 'lucide-react';

export type PlaybackStatus =
  | 'loading'
  | 'ready'
  | 'playing'
  | 'animating'
  | 'waiting'
  | 'transitioning'
  | 'completed'
  | 'error';

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
  // 1. Playback State Machine
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('ready');

  // Step & Scene state
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

  const [isPlaying, setIsPlaying] = useState(() => Boolean(demoSettings.autoplay));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isChapterMenuOpen, setIsChapterMenuOpen] = useState(false);
  const [variables, setVariables] = useState(initialVariables);

  // Sync isPlaying if demoSettings.autoplay prop updates
  useEffect(() => {
    if (demoSettings.autoplay !== undefined) {
      setIsPlaying(Boolean(demoSettings.autoplay));
    }
  }, [demoSettings.autoplay]);

  // Chapter state in runtime
  const [activeChapterId, setActiveChapterId] = useState<string | null>(() => {
    if (typeof initialStepIndex === 'number' && steps[initialStepIndex]?.chapterId) {
      return steps[initialStepIndex].chapterId!;
    }
    return chapters && chapters.length > 0 ? chapters[0].id : null;
  });

  const [isAtChapter, setIsAtChapter] = useState<boolean>(
    typeof initialStepIndex === 'number' ? false : Boolean(chapters && chapters.length > 0)
  );

  // Sync initialStepIndex prop changes from editor
  useEffect(() => {
    if (typeof initialStepIndex === 'number' && initialStepIndex >= 0 && initialStepIndex < steps.length) {
      setCurrentStepIndex(initialStepIndex);
      setIsAtChapter(false);
      setIsCompleted(false);
      setPlaybackStatus('ready');
    }
  }, [initialStepIndex, steps.length]);

  const activeChapter = useMemo(() => {
    if (!activeChapterId) return chapters[0] || null;
    return (
      chapters.find((ch) => ch.id === activeChapterId || (ch as any)._id === activeChapterId) ||
      chapters[0] ||
      null
    );
  }, [chapters, activeChapterId]);

  // Track chapter view
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

  // Authoritative Camera and Playback Lifecycle State
  const [cameraScale, setCameraScale] = useState(1.0);
  const cameraScaleRef = useRef(1.0);
  const [cameraTransition, setCameraTransition] = useState('none');
  const [showHotspots, setShowHotspots] = useState(true);
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  const isZoomingOutRef = useRef(false);
  const stepPhaseRef = useRef<'init' | 'animating' | 'holding' | 'waiting' | 'done'>('init');
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const updateCameraScale = useCallback((scale: number) => {
    cameraScaleRef.current = scale;
    setCameraScale(scale);
  }, []);

  const lifecycleTimersRef = useRef<{
    delay?: NodeJS.Timeout;
    camera?: NodeJS.Timeout;
    pointer?: NodeJS.Timeout;
    hold?: NodeJS.Timeout;
    advance?: NodeJS.Timeout;
    zoomOut?: NodeJS.Timeout;
  }>({});

  const cancelPlaybackLifecycle = useCallback(() => {
    if (lifecycleTimersRef.current.delay) clearTimeout(lifecycleTimersRef.current.delay);
    if (lifecycleTimersRef.current.camera) clearTimeout(lifecycleTimersRef.current.camera);
    if (lifecycleTimersRef.current.pointer) clearTimeout(lifecycleTimersRef.current.pointer);
    if (lifecycleTimersRef.current.hold) clearTimeout(lifecycleTimersRef.current.hold);
    if (lifecycleTimersRef.current.advance) clearTimeout(lifecycleTimersRef.current.advance);
    if (lifecycleTimersRef.current.zoomOut) clearTimeout(lifecycleTimersRef.current.zoomOut);
    lifecycleTimersRef.current = {};
  }, []);

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
      (el) => el.id === currentStep.targetElementId || (el as any)._id === currentStep.targetElementId
    );
  }, [currentStep, sceneElements]);

  // Canonical Aspect Ratio single source of truth
  const canonicalRatioInfo = useMemo(() => {
    return getCanonicalDemoAspectRatio(
      { settings: demoSettings } as any,
      scenes
    );
  }, [demoSettings, scenes]);

  const handleComplete = useCallback(() => {
    cancelPlaybackLifecycle();
    setIsCompleted(true);
    setIsPlaying(false);
    setPlaybackStatus('completed');
    onTrackEvent?.('DEMO_COMPLETE', {
      sceneId: currentScene?.id,
      stepId: currentStep?.id,
    });
  }, [cancelPlaybackLifecycle, currentScene, currentStep, onTrackEvent]);

  const handleRestart = useCallback(() => {
    cancelPlaybackLifecycle();
    isZoomingOutRef.current = false;
    setIsZoomingOut(false);
    setShowHotspots(false);
    updateCameraScale(1.0);
    setCameraTransition('none');
    stepPhaseRef.current = 'init';
    setCurrentSceneIndex(0);
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setIsPlaying(Boolean(demoSettings.autoplay));
    setIsChapterMenuOpen(false);
    setPlaybackStatus('ready');

    if (chapters && chapters.length > 0) {
      setActiveChapterId(chapters[0].id);
      setIsAtChapter(true);
    } else {
      setIsAtChapter(false);
    }

    onTrackEvent?.('REPLAY', {
      sceneId: scenes[0]?.id,
      stepId: steps[0]?.id,
    });
  }, [cancelPlaybackLifecycle, chapters, scenes, steps, demoSettings.autoplay, updateCameraScale, onTrackEvent]);

  // Step Navigation Functions with explicit destination & loop support
  const goToNextStep = useCallback(() => {
    if (isZoomingOutRef.current) return;
    cancelPlaybackLifecycle();

    const zoomConfig = currentStep?.zoomPan;
    const hasZoom = Boolean(zoomConfig?.enabled);
    const isCurrentlyZoomed =
      hasZoom &&
      (cameraScaleRef.current > 1.001 ||
        stepPhaseRef.current === 'animating' ||
        stepPhaseRef.current === 'holding' ||
        stepPhaseRef.current === 'waiting' ||
        playbackStatus === 'ready');

    const proceedToNext = () => {
      updateCameraScale(1.0);
      setCameraTransition('none');
      stepPhaseRef.current = 'init';

      if (currentStep) {
        onTrackEvent?.('STEP_COMPLETE', {
          sceneId: currentScene?.id,
          stepId: currentStep?.id,
        });
      }

      // Check completion explicit nextStepId
      if (currentStep?.completion) {
        const comp = currentStep.completion;
        if (comp.nextStepId) {
          const targetIdx = steps.findIndex(
            (s) => s.id === comp.nextStepId || (s as any)._id === comp.nextStepId
          );
          if (targetIdx !== -1) {
            setPlaybackStatus('transitioning');
            setCurrentStepIndex(targetIdx);
            const nextStep = steps[targetIdx];
            if (nextStep?.sceneId) {
              const sceneIdx = scenes.findIndex(
                (s) => s.id === nextStep.sceneId || (s as any)._id === nextStep.sceneId
              );
              if (sceneIdx !== -1 && sceneIdx !== currentSceneIndex) {
                setCurrentSceneIndex(sceneIdx);
              }
            }
            if (nextStep?.chapterId && nextStep.chapterId !== activeChapterId) {
              setActiveChapterId(nextStep.chapterId);
            }
            setTimeout(() => setPlaybackStatus('ready'), 200);
            return;
          }
        }
      }

      if (currentStepIndex < steps.length - 1) {
        const nextIndex = currentStepIndex + 1;
        setPlaybackStatus('transitioning');
        setCurrentStepIndex(nextIndex);

        const nextStep = steps[nextIndex];
        if (nextStep?.sceneId) {
          const sceneIdx = scenes.findIndex(
            (s) => s.id === nextStep.sceneId || (s as any)._id === nextStep.sceneId
          );
          if (sceneIdx !== -1 && sceneIdx !== currentSceneIndex) {
            setCurrentSceneIndex(sceneIdx);
          }
        }

        if (nextStep?.chapterId && nextStep.chapterId !== activeChapterId) {
          setActiveChapterId(nextStep.chapterId);
        }

        setTimeout(() => setPlaybackStatus('ready'), 200);
      } else {
        const shouldLoop = Boolean(demoSettings.loop || demoSettings.autoplayLoop);
        if (shouldLoop && isPlayingRef.current) {
          // Continuous looping restart
          setPlaybackStatus('transitioning');
          setCurrentStepIndex(0);
          const firstStep = steps[0];
          if (firstStep?.sceneId) {
            const scIdx = scenes.findIndex(
              (s) => s.id === firstStep.sceneId || (s as any)._id === firstStep.sceneId
            );
            if (scIdx !== -1) setCurrentSceneIndex(scIdx);
          }
          if (firstStep?.chapterId && firstStep.chapterId !== activeChapterId) {
            setActiveChapterId(firstStep.chapterId);
          }
          setTimeout(() => setPlaybackStatus('ready'), 200);
        } else {
          handleComplete();
        }
      }
    };

    if (isCurrentlyZoomed) {
      // Hide hotspots first so camera zooms out cleanly to full slide
      setShowHotspots(false);
      isZoomingOutRef.current = true;
      setIsZoomingOut(true);

      const zoomOutDurationMs = Math.max(
        300,
        Math.min(800, zoomConfig?.returnDurationMs || zoomConfig?.durationMs || 500)
      );
      const easingCss = getEasingCss(zoomConfig?.easing || 'easeOut');
      setCameraTransition(`transform ${zoomOutDurationMs}ms ${easingCss}`);
      updateCameraScale(1.0);

      lifecycleTimersRef.current.zoomOut = setTimeout(() => {
        isZoomingOutRef.current = false;
        setIsZoomingOut(false);
        proceedToNext();
      }, zoomOutDurationMs);
    } else {
      proceedToNext();
    }
  }, [
    cancelPlaybackLifecycle,
    currentStep,
    currentStepIndex,
    steps,
    currentScene,
    scenes,
    currentSceneIndex,
    activeChapterId,
    demoSettings.loop,
    demoSettings.autoplayLoop,
    updateCameraScale,
    handleComplete,
    onTrackEvent,
  ]);

  const goToPrevStep = useCallback(() => {
    if (isZoomingOutRef.current) return;
    cancelPlaybackLifecycle();

    const zoomConfig = currentStep?.zoomPan;
    const hasZoom = Boolean(zoomConfig?.enabled);
    const isCurrentlyZoomed =
      hasZoom &&
      (cameraScaleRef.current > 1.001 ||
        stepPhaseRef.current === 'animating' ||
        stepPhaseRef.current === 'holding' ||
        stepPhaseRef.current === 'waiting' ||
        playbackStatus === 'ready');

    const proceedToPrev = () => {
      updateCameraScale(1.0);
      setCameraTransition('none');
      stepPhaseRef.current = 'init';

      if (currentStepIndex > 0) {
        const prevIndex = currentStepIndex - 1;
        setPlaybackStatus('transitioning');
        setCurrentStepIndex(prevIndex);

        const prevStep = steps[prevIndex];
        if (prevStep?.sceneId) {
          const sceneIdx = scenes.findIndex(
            (s) => s.id === prevStep.sceneId || (s as any)._id === prevStep.sceneId
          );
          if (sceneIdx !== -1 && sceneIdx !== currentSceneIndex) {
            setCurrentSceneIndex(sceneIdx);
          }
        }

        if (prevStep?.chapterId && prevStep.chapterId !== activeChapterId) {
          setActiveChapterId(prevStep.chapterId);
        }

        setTimeout(() => setPlaybackStatus('ready'), 200);
      }
    };

    if (isCurrentlyZoomed) {
      setShowHotspots(false);
      isZoomingOutRef.current = true;
      setIsZoomingOut(true);

      const zoomOutDurationMs = Math.max(
        300,
        Math.min(800, zoomConfig?.returnDurationMs || zoomConfig?.durationMs || 500)
      );
      const easingCss = getEasingCss(zoomConfig?.easing || 'easeOut');
      setCameraTransition(`transform ${zoomOutDurationMs}ms ${easingCss}`);
      updateCameraScale(1.0);

      lifecycleTimersRef.current.zoomOut = setTimeout(() => {
        isZoomingOutRef.current = false;
        setIsZoomingOut(false);
        proceedToPrev();
      }, zoomOutDurationMs);
    } else {
      proceedToPrev();
    }
  }, [
    cancelPlaybackLifecycle,
    currentStep,
    currentStepIndex,
    steps,
    scenes,
    currentSceneIndex,
    activeChapterId,
    updateCameraScale,
  ]);

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
              (s) => s.id === action.targetSceneId || (s as any)._id === action.targetSceneId
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
    [goToNextStep, goToPrevStep, handleComplete, scenes, onTrackEvent]
  );

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
            (s) =>
              s.chapterId === activeChapter.id ||
              s.chapterId === (activeChapter as any)._id ||
              String(s.chapterId) === String(activeChapter.id)
          );
          if (firstStepIdx !== -1) {
            setCurrentStepIndex(firstStepIdx);
            const targetStep = steps[firstStepIdx];
            if (targetStep?.sceneId) {
              const scIdx = scenes.findIndex(
                (sc) => sc.id === targetStep.sceneId || (sc as any)._id === targetStep.sceneId
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
            (s) => s.id === action.targetId || (s as any)._id === action.targetId
          );
          if (sIdx !== -1) {
            setCurrentStepIndex(sIdx);
            const targetStep = steps[sIdx];
            if (targetStep?.sceneId) {
              const scIdx = scenes.findIndex(
                (sc) => sc.id === targetStep.sceneId || (sc as any)._id === targetStep.sceneId
              );
              if (scIdx !== -1) setCurrentSceneIndex(scIdx);
            }
            setIsAtChapter(false);
          }
        }
      } else if (action.type === 'go_to_chapter') {
        if (action.targetId) {
          const ch = chapters.find(
            (c) => c.id === action.targetId || (c as any)._id === action.targetId
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
    [activeChapter, chapters, steps, scenes, goToPrevStep, onTrackEvent]
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
          const idx = steps.findIndex((s) => s.id === target || (s as any)._id === target);
          if (idx !== -1) {
            if (isZoomingOutRef.current) return;
            cancelPlaybackLifecycle();

            const zoomConfig = currentStep?.zoomPan;
            const hasZoom = Boolean(zoomConfig?.enabled);
            const isCurrentlyZoomed =
              hasZoom &&
              (cameraScaleRef.current > 1.001 ||
                stepPhaseRef.current === 'animating' ||
                stepPhaseRef.current === 'holding' ||
                stepPhaseRef.current === 'waiting' ||
                playbackStatus === 'ready');

            const proceedToTarget = () => {
              updateCameraScale(1.0);
              setCameraTransition('none');
              stepPhaseRef.current = 'init';
              setPlaybackStatus('transitioning');
              setCurrentStepIndex(idx);
              setIsAtChapter(false);
              const targetStep = steps[idx];
              if (targetStep?.sceneId) {
                const scIdx = scenes.findIndex(
                  (sc) => sc.id === targetStep.sceneId || (sc as any)._id === targetStep.sceneId
                );
                if (scIdx !== -1) setCurrentSceneIndex(scIdx);
              }
              if (targetStep?.chapterId && targetStep.chapterId !== activeChapterId) {
                setActiveChapterId(targetStep.chapterId);
              }
              setTimeout(() => setPlaybackStatus('ready'), 200);
            };

            if (isCurrentlyZoomed) {
              setShowHotspots(false);
              isZoomingOutRef.current = true;
              setIsZoomingOut(true);
              const zoomOutDurationMs = Math.max(
                300,
                Math.min(800, zoomConfig?.returnDurationMs || zoomConfig?.durationMs || 500)
              );
              const easingCss = getEasingCss(zoomConfig?.easing || 'easeOut');
              setCameraTransition(`transform ${zoomOutDurationMs}ms ${easingCss}`);
              updateCameraScale(1.0);

              lifecycleTimersRef.current.zoomOut = setTimeout(() => {
                isZoomingOutRef.current = false;
                setIsZoomingOut(false);
                proceedToTarget();
              }, zoomOutDurationMs);
            } else {
              proceedToTarget();
            }
          }
        }
      } else if (actionType === 'goToChapter') {
        if (target) {
          const ch = chapters.find((c) => c.id === target || (c as any)._id === target);
          if (ch) {
            if (isZoomingOutRef.current) return;
            cancelPlaybackLifecycle();

            const zoomConfig = currentStep?.zoomPan;
            const hasZoom = Boolean(zoomConfig?.enabled);
            const isCurrentlyZoomed =
              hasZoom &&
              (cameraScaleRef.current > 1.001 ||
                stepPhaseRef.current === 'animating' ||
                stepPhaseRef.current === 'holding' ||
                stepPhaseRef.current === 'waiting' ||
                playbackStatus === 'ready');

            const proceedToCh = () => {
              updateCameraScale(1.0);
              setCameraTransition('none');
              stepPhaseRef.current = 'init';
              setActiveChapterId(ch.id);
              setIsAtChapter(true);
            };

            if (isCurrentlyZoomed) {
              setShowHotspots(false);
              isZoomingOutRef.current = true;
              setIsZoomingOut(true);
              const zoomOutDurationMs = Math.max(
                300,
                Math.min(800, zoomConfig?.returnDurationMs || zoomConfig?.durationMs || 500)
              );
              const easingCss = getEasingCss(zoomConfig?.easing || 'easeOut');
              setCameraTransition(`transform ${zoomOutDurationMs}ms ${easingCss}`);
              updateCameraScale(1.0);

              lifecycleTimersRef.current.zoomOut = setTimeout(() => {
                isZoomingOutRef.current = false;
                setIsZoomingOut(false);
                proceedToCh();
              }, zoomOutDurationMs);
            } else {
              proceedToCh();
            }
          }
        }
      } else if (actionType === 'goToScene') {
        if (target) {
          const idx = scenes.findIndex((s) => s.id === target || (s as any)._id === target);
          if (idx !== -1) {
            if (isZoomingOutRef.current) return;
            cancelPlaybackLifecycle();

            const zoomConfig = currentStep?.zoomPan;
            const hasZoom = Boolean(zoomConfig?.enabled);
            const isCurrentlyZoomed =
              hasZoom &&
              (cameraScaleRef.current > 1.001 ||
                stepPhaseRef.current === 'animating' ||
                stepPhaseRef.current === 'holding' ||
                stepPhaseRef.current === 'waiting' ||
                playbackStatus === 'ready');

            const proceedToSc = () => {
              updateCameraScale(1.0);
              setCameraTransition('none');
              stepPhaseRef.current = 'init';
              setCurrentSceneIndex(idx);
            };

            if (isCurrentlyZoomed) {
              setShowHotspots(false);
              isZoomingOutRef.current = true;
              setIsZoomingOut(true);
              const zoomOutDurationMs = Math.max(
                300,
                Math.min(800, zoomConfig?.returnDurationMs || zoomConfig?.durationMs || 500)
              );
              const easingCss = getEasingCss(zoomConfig?.easing || 'easeOut');
              setCameraTransition(`transform ${zoomOutDurationMs}ms ${easingCss}`);
              updateCameraScale(1.0);

              lifecycleTimersRef.current.zoomOut = setTimeout(() => {
                isZoomingOutRef.current = false;
                setIsZoomingOut(false);
                proceedToSc();
              }, zoomOutDurationMs);
            } else {
              proceedToSc();
            }
          }
        }
      } else if (actionType === 'externalUrl') {
        if (target && (target.startsWith('http://') || target.startsWith('https://'))) {
          window.open(target, '_blank', 'noopener,noreferrer');
        }
      }
    },
    [currentStep, goToNextStep, goToPrevStep, steps, chapters, scenes, cancelPlaybackLifecycle, activeChapterId, updateCameraScale, onTrackEvent]
  );

  // Check if active elements request backdrop dimming
  const hasActiveBackdrop = useMemo(() => {
    return sceneElements.some(
      (el) => (el.type === 'hotspot' || el.hotspotConfig) && el.hotspotConfig?.appearance?.backdrop
    );
  }, [sceneElements]);

  // Track initial demo view & step view
  useEffect(() => {
    onTrackEvent?.('DEMO_VIEW', {
      sceneId: currentScene?.id,
      stepId: currentStep?.id,
    });
  }, []);

  useEffect(() => {
    if (currentStep) {
      onTrackEvent?.('STEP_VIEW', {
        sceneId: currentScene?.id,
        stepId: currentStep?.id,
      });
    }
  }, [currentStepIndex, currentStep, currentScene, onTrackEvent]);

  const handleElementClick = (element: IDemoElement) => {
    onTrackEvent?.('ELEMENT_CLICK', {
      sceneId: currentScene?.id,
      stepId: currentStep?.id,
      elementId: element.id,
    });

    eventBus.dispatch('click', currentScene?.id, element.id);

    if (
      currentStep?.targetElementId === element.id ||
      (currentStep?.targetElementId as any) === (element as any)._id ||
      currentStep?.action === 'click'
    ) {
      goToNextStep();
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Background Music Playback Engine
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const music = demoSettings.music;
    if (music?.enabled && music.trackUrl && !isCompleted) {
      if (!bgMusicRef.current) {
        const audio = new Audio(music.trackUrl);
        audio.loop = music.loop !== false;
        audio.volume = Math.max(0, Math.min(1, (music.volume ?? 50) / 100));
        bgMusicRef.current = audio;
      } else {
        bgMusicRef.current.src = music.trackUrl;
        bgMusicRef.current.volume = Math.max(0, Math.min(1, (music.volume ?? 50) / 100));
        bgMusicRef.current.loop = music.loop !== false;
      }

      if (isPlaying) {
        bgMusicRef.current.play().catch(() => {});
      } else {
        bgMusicRef.current.pause();
      }
    } else if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, [demoSettings.music, isPlaying, isCompleted]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if keyboard navigation is disabled in Accessibility settings
      if (demoSettings.accessibility?.disableKeyboardNavigation) {
        return;
      }

      // Ignore if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        goToNextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevStep();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'KeyR' || e.key === 'r') {
        e.preventDefault();
        handleRestart();
      } else if (e.key === 'Escape') {
        setIsChapterMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextStep, goToPrevStep, handleRestart, demoSettings.accessibility?.disableKeyboardNavigation]);

  // Ref to always access the latest goToNextStep without triggering re-renders
  const goToNextStepRef = useRef(goToNextStep);
  useEffect(() => {
    goToNextStepRef.current = goToNextStep;
  });

  // Serialized zoom key to ensure stable dependency tracking
  const zoomConfigKey = useMemo(() => {
    const zp = currentStep?.zoomPan;
    if (!zp) return 'none';
    return `${Boolean(zp.enabled)}-${zp.zoomLevel}-${zp.durationMs}-${zp.delayMs}-${zp.easing}-${zp.endBehavior}-${zp.focusPoint?.x}-${zp.focusPoint?.y}-${zp.focusRegion?.x}-${zp.focusRegion?.y}-${zp.focusRegion?.width}-${zp.focusRegion?.height}-${zp.linkedHotspotId}`;
  }, [currentStep?.zoomPan]);

  // Coordinated Deterministic Per-Step Playback & Camera Lifecycle
  // Step Entrance & Camera Animation (Runs when step/chapter changes)
  useEffect(() => {
    cancelPlaybackLifecycle();

    if (!currentStep || isAtChapter || isCompleted) {
      updateCameraScale(1.0);
      setCameraTransition('none');
      setPlaybackStatus('ready');
      setShowHotspots(true);
      stepPhaseRef.current = 'done';
      return;
    }

    const zoomConfig = currentStep.zoomPan;
    const hasZoom = Boolean(zoomConfig?.enabled);
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Phase 1: Initialize Camera to fit baseline (1.0x) and load hotspots first
    updateCameraScale(1.0);
    setCameraTransition('none');
    setPlaybackStatus('ready');
    stepPhaseRef.current = 'init';
    setShowHotspots(true);

    // If no zoom & pan is applied, keep hotspots immediately and handle normal progression
    if (!hasZoom) {
      stepPhaseRef.current = 'holding';
      const requiresInteraction = doesStepRequireInteraction(currentStep, demoSettings);
      if (requiresInteraction) {
        stepPhaseRef.current = 'waiting';
        setPlaybackStatus('waiting');
        return;
      }

      if (!isPlayingRef.current) {
        setPlaybackStatus('ready');
        return;
      }

      setPlaybackStatus('playing');
      const nominalDwell = getStepDwellDuration(currentStep, demoSettings);
      const transitionDelayMs = Math.max(0, demoSettings?.transitionDelayMs ?? 500);

      lifecycleTimersRef.current.hold = setTimeout(() => {
        lifecycleTimersRef.current.advance = setTimeout(() => {
          goToNextStepRef.current();
        }, transitionDelayMs);
      }, nominalDwell);
      return;
    }

    // Phase 2: Delay before zoom-in (viewer sees full slide with hotspot loaded first, then zoom begins)
    const userDelayMs = Math.max(0, zoomConfig?.delayMs || 0);
    const delayMs = Math.max(350, userDelayMs || 400);
    const cameraDurationMs = prefersReducedMotion ? 0 : Math.max(200, zoomConfig?.durationMs || 800);
    const easingCss = getEasingCss(zoomConfig?.easing);
    const holdDurationMs = Math.max(200, zoomConfig?.holdDurationMs || 1000);
    const returnDurationMs =
      zoomConfig?.endBehavior === 'returnToFit'
        ? (prefersReducedMotion ? 0 : Math.max(200, zoomConfig?.returnDurationMs || 600))
        : 0;

    // Target scale calculation: strictly aligns with studio editor bounding box
    const rawTargetScale =
      zoomConfig?.focusRegion?.width && zoomConfig.focusRegion.width > 5
        ? 100 / zoomConfig.focusRegion.width
        : (zoomConfig?.zoomLevel || 1.5);
    const targetScale = Math.max(1.1, Math.min(3.5, isNaN(rawTargetScale) ? 1.5 : rawTargetScale));

    // Phase 2: Start Delay (viewer sees hotspot on overview, then camera moves into focus)
    lifecycleTimersRef.current.delay = setTimeout(() => {
      // Phase 3: Camera Movement to expected zoom (hotspots zoom smoothly with the camera)
      if (cameraDurationMs > 0) {
        setPlaybackStatus('animating');
        stepPhaseRef.current = 'animating';
        setCameraTransition(`transform ${cameraDurationMs}ms ${easingCss}`);
        updateCameraScale(targetScale);
      } else {
        updateCameraScale(targetScale);
        setCameraTransition('none');
      }

      lifecycleTimersRef.current.camera = setTimeout(() => {
        // Camera has reached expected zoom!
        stepPhaseRef.current = 'holding';

        // Phase 4: Pointer & Interaction Phase
        const pointerWaitMs = 250;

        lifecycleTimersRef.current.pointer = setTimeout(() => {
          // Phase 5: Interaction Checkpoint
          const requiresInteraction = doesStepRequireInteraction(currentStep, demoSettings);

          // Handle Return to Fit behavior
          if (zoomConfig?.endBehavior === 'returnToFit') {
            lifecycleTimersRef.current.hold = setTimeout(() => {
              setShowHotspots(false);
              setCameraTransition(`transform ${returnDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`);
              updateCameraScale(1.0);

              lifecycleTimersRef.current.advance = setTimeout(() => {
                if (requiresInteraction) {
                  stepPhaseRef.current = 'waiting';
                  setPlaybackStatus('waiting');
                  return;
                }

                if (!isPlayingRef.current) {
                  setPlaybackStatus('ready');
                  return;
                }

                setPlaybackStatus('playing');
                const transitionDelayMs = Math.max(0, demoSettings?.transitionDelayMs ?? 500);
                setTimeout(() => {
                  goToNextStepRef.current();
                }, transitionDelayMs);
              }, returnDurationMs);
            }, holdDurationMs);
            return;
          }

          if (requiresInteraction) {
            stepPhaseRef.current = 'waiting';
            setPlaybackStatus('waiting');
            return;
          }

          if (!isPlayingRef.current) {
            setPlaybackStatus('ready');
            return;
          }

          setPlaybackStatus('playing');

          // Phase 6: Hold duration & safe automatic progression
          const nominalDwell = getStepDwellDuration(currentStep, demoSettings);
          const remainingDwell = Math.max(holdDurationMs, nominalDwell);
          const transitionDelayMs = Math.max(0, demoSettings?.transitionDelayMs ?? 500);

          lifecycleTimersRef.current.hold = setTimeout(() => {
            lifecycleTimersRef.current.advance = setTimeout(() => {
              goToNextStepRef.current();
            }, transitionDelayMs);
          }, remainingDwell);

        }, pointerWaitMs);
      }, cameraDurationMs);
    }, delayMs);

    return () => {
      cancelPlaybackLifecycle();
    };
  }, [
    currentStep?.id,
    currentStepIndex,
    zoomConfigKey,
    isAtChapter,
    isCompleted,
    demoSettings.autoplay,
    demoSettings.autoplayDelay,
    demoSettings.autoplayMode,
    demoSettings.autoplayLoop,
    demoSettings.loop,
    demoSettings.transitionDelayMs,
    demoSettings.autoplayProgressionPolicy,
    cancelPlaybackLifecycle,
    updateCameraScale,
  ]);

  // Handle Play/Pause toggling without re-initializing camera transform
  useEffect(() => {
    if (!currentStep || isAtChapter || isCompleted) return;

    if (!isPlaying) {
      // Clear auto-advance hold and advance timers, but PRESERVE camera scale!
      if (lifecycleTimersRef.current.hold) clearTimeout(lifecycleTimersRef.current.hold);
      if (lifecycleTimersRef.current.advance) clearTimeout(lifecycleTimersRef.current.advance);
      if (playbackStatus !== 'waiting') {
        setPlaybackStatus('ready');
      }
    } else {
      // Resumed playing
      if (stepPhaseRef.current === 'waiting') {
        // Step requires interaction, remain waiting
        return;
      }

      if (stepPhaseRef.current === 'holding') {
        // Schedule nominal dwell & advance only after camera animation has already completed
        setPlaybackStatus('playing');
        const zoomConfig = currentStep.zoomPan;
        const hasZoom = Boolean(zoomConfig?.enabled);
        const nominalDwell = getStepDwellDuration(currentStep, demoSettings);
        const returnDurationMs =
          hasZoom && zoomConfig?.endBehavior === 'returnToFit'
            ? Math.max(100, zoomConfig?.returnDurationMs || 500)
            : 0;
        const easingCss = hasZoom ? getEasingCss(zoomConfig?.easing) : 'ease-out';
        const transitionDelayMs = Math.max(0, demoSettings?.transitionDelayMs ?? 500);

        lifecycleTimersRef.current.hold = setTimeout(() => {
          if (hasZoom && zoomConfig?.endBehavior === 'returnToFit') {
            setCameraTransition(`transform ${returnDurationMs}ms ${easingCss}`);
            updateCameraScale(1.0);

            lifecycleTimersRef.current.advance = setTimeout(() => {
              goToNextStepRef.current();
            }, returnDurationMs + transitionDelayMs);
          } else {
            lifecycleTimersRef.current.advance = setTimeout(() => {
              goToNextStepRef.current();
            }, transitionDelayMs);
          }
        }, nominalDwell);
      }
    }
  }, [isPlaying, currentStep, isAtChapter, isCompleted, demoSettings, updateCameraScale]);

  // Interpolated step content
  const stepTitle = interpolateVariables(
    currentStep?.tooltip?.title || currentStep?.title || '',
    variables
  );
  const stepDescription = interpolateVariables(
    currentStep?.tooltip?.description || currentStep?.description || '',
    variables
  );

  // Empty demo state guard
  if (steps.length === 0 && (!chapters || chapters.length === 0)) {
    return (
      <div className="w-full h-full min-h-[400px] bg-dark rounded-2xl flex flex-col items-center justify-center p-8 text-center text-white select-none">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-brand-purple">
          <span className="font-extrabold text-lg">P</span>
        </div>
        <h4 className="text-lg font-bold mb-1">No walkthrough steps yet</h4>
        <p className="text-xs text-white/50 max-w-sm">
          Add screenshots and interactive hotspot steps in the Studio Editor to preview your demo.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden font-sans select-none bg-dark text-white ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-0' : 'rounded-2xl shadow-2xl'
      }`}
    >
      {/* Viewport Stage */}
      <PlayerViewport
        currentScene={currentScene}
        currentStep={currentStep}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        sceneElements={sceneElements}
        targetElement={targetElement}
        canonicalAspectRatio={canonicalRatioInfo.cssRatio}
        isAtChapter={isAtChapter}
        activeChapter={activeChapter}
        hasActiveBackdrop={hasActiveBackdrop}
        transitionStyle={demoSettings.defaultTransition || 'fade'}
        containerRef={containerRef}
        onHotspotAction={handleHotspotAction}
        onElementClick={handleElementClick}
        onChapterAction={handleChapterAction}
        onTrackEvent={onTrackEvent}
        steps={steps}
        scenes={scenes}
        stepTitle={stepTitle}
        stepDescription={stepDescription}
        cameraScale={cameraScale}
        cameraTransition={cameraTransition}
        onNextStep={goToNextStep}
        onPrevStep={goToPrevStep}
        showHotspots={showHotspots}
      />

      {/* Completion Modal */}
      {isCompleted && (
        <PlayerCompletion
          demoName={demoName}
          onRestart={handleRestart}
          ctaText="Start Free Trial"
          ctaUrl="/register"
        />
      )}

      {/* Floating Bottom Control Bar */}
      <PlayerControls
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        isCompleted={isCompleted}
        isFullscreen={isFullscreen}
        canGoPrev={currentStepIndex > 0 && !isAtChapter && !isZoomingOut}
        canGoNext={currentStepIndex < steps.length - 1 && !isZoomingOut}
        onPrev={goToPrevStep}
        onNext={goToNextStep}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onRestart={handleRestart}
        onToggleFullscreen={toggleFullscreen}
        activeChapterTitle={activeChapter?.title}
        totalChapters={chapters.length}
        onOpenChapterMenu={() => setIsChapterMenuOpen(true)}
        demoSettings={demoSettings}
      />

      {/* Chapter Menu Drawer */}
      <PlayerChapterMenu
        isOpen={isChapterMenuOpen}
        onClose={() => setIsChapterMenuOpen(false)}
        chapters={chapters}
        steps={steps}
        activeChapterId={activeChapterId}
        onSelectChapter={(chId) => {
          setActiveChapterId(chId);
          setIsAtChapter(true);
        }}
      />

      {/* Watermark CTA Badge (Appearance -> Branding) */}
      {demoSettings.branding?.watermarkEnabled !== false && (
        <a
          href={demoSettings.branding?.ctaButtonUrl || 'https://preveuo.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 left-4 z-40 px-2.5 py-1 rounded-xl bg-white/90 hover:bg-white text-heading text-[10px] font-bold shadow-md border border-border-default flex items-center gap-1.5 transition-all hover:scale-105"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
          <span>{demoSettings.branding?.watermarkText || 'Created on Preveuo'}</span>
        </a>
      )}

      {/* Embed Open in New Tab Button (Appearance -> Demo) */}
      {demoSettings.openInNewTab && (
        <button
          type="button"
          onClick={() => window.open(window.location.href, '_blank')}
          className="absolute top-3 right-3 z-40 p-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white shadow-md backdrop-blur-xs transition-all hover:scale-105 cursor-pointer"
          title="Open in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
