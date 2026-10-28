'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  FullDemoData,
  IDemoScene,
  SceneViewport,
  IDemoStep,
  IDemoElement,
  IDemoInteraction,
  IDemoChapter,
} from '@/types/demo';
import { DemoRuntimePlayer } from '@/components/runtime/DemoRuntimePlayer';
import { HotspotMarker, HotspotPropertiesPanel } from '@/components/demos/hotspots';
import { ChapterRenderer, ChapterPropertiesPanel } from '@/components/demos/chapters';
import { AnimationPropertiesPanel, FocusCrosshairOverlay, ZoomPanBoundingBox } from '@/components/demos/animation';
import { DemoSettingsModal, SettingsModalTab } from '@/components/demos/settings';
import { computeCameraTransform, getEasingCss, DEFAULT_ZOOM_PAN_CONFIG } from '@/lib/utils/cameraTransform';
import { AddStepModal } from '@/components/demos/steps/AddStepModal';
import { AspectRatioWarningModal } from '@/components/demos/AspectRatioWarningModal';
import {
  calculateAspectRatio,
  areAspectRatiosMatching,
  getCanonicalDemoAspectRatio,
  getImageDimensions,
  cropImageToAspectRatio,
  AspectRatioInfo,
  CanonicalAspectRatioInfo,
} from '@/lib/utils/aspectRatio';
import { Button, IconButton, Badge, Input, Textarea, Select } from '@/components/ui';
import {
  ArrowLeft,
  Eye,
  Send,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  Sparkles,
  SlidersHorizontal,
  Radio,
  Droplets,
  Mic,
  MoreVertical,
  RotateCw,
  FolderPlus,
  ArrowRight,
  BookOpen,
  Layers,
  Moon,
  Plus,
  Video,
  Upload,
  Search,
  Share2,
  LayoutGrid,
  Image as ImageIcon,
  Command,
  X,
  ChevronDown,
  Maximize2,
  Play,
  Settings,
} from 'lucide-react';
import { PRIMARY_COLOR, THEME_COLORS } from '@/lib/constants/theme';

interface PreveuoStudioEditorProps {
  initialData: FullDemoData;
  onSave?: (data: FullDemoData) => Promise<void>;
}

export const PreveuoStudioEditor: React.FC<PreveuoStudioEditorProps> = ({
  initialData,
}) => {
  const [demo, setDemo] = useState(initialData.demo);
  const [scenes, setScenes] = useState<IDemoScene[]>(initialData.scenes);
  const [steps, setSteps] = useState<IDemoStep[]>(initialData.steps);
  const [elements, setElements] = useState<IDemoElement[]>(initialData.elements);
  const [interactions, setInteractions] = useState<IDemoInteraction[]>(initialData.interactions);
  const [chapters, setChapters] = useState<IDemoChapter[]>(initialData.chapters || []);

  // Synchronize state if initialData changes across navigations
  useEffect(() => {
    setDemo(initialData.demo);
    setScenes(initialData.scenes);
    setSteps(initialData.steps);
    setElements(initialData.elements);
    setInteractions(initialData.interactions);
    setChapters(initialData.chapters || []);
    setActiveStepIndex(0);
    setSelectedNodeType('step');
    if (initialData.steps && initialData.steps.length > 0) {
      const firstStepSceneId = initialData.steps[0].sceneId;
      const matchIdx = initialData.scenes.findIndex(
        (sc) => sc.id === firstStepSceneId || (sc as any)._id === firstStepSceneId
      );
      setActiveSceneIndex(matchIdx !== -1 ? matchIdx : 0);
    } else {
      setActiveSceneIndex(0);
    }
  }, [initialData]);

  // Node selection: always default to 'step' to show the first step when opening demo
  const [selectedNodeType, setSelectedNodeType] = useState<'step' | 'chapter'>('step');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    initialData.chapters && initialData.chapters.length > 0 ? initialData.chapters[0].id : null
  );
  const [openChapterMenuId, setOpenChapterMenuId] = useState<string | null>(null);

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(() => {
    if (initialData.steps && initialData.steps.length > 0) {
      const firstStepSceneId = initialData.steps[0].sceneId;
      const matchIdx = initialData.scenes.findIndex(
        (sc) => sc.id === firstStepSceneId || (sc as any)._id === firstStepSceneId
      );
      if (matchIdx !== -1) return matchIdx;
    }
    return 0;
  });
  const [activeTab, setActiveTab] = useState<'step' | 'interactions' | 'animation' | 'settings'>('step');

  // Animation Top-bar Dropdown & Section State ('zoomPan' | 'autoplay')
  const [isAnimationMenuOpen, setIsAnimationMenuOpen] = useState(false);
  const [activeAnimationSection, setActiveAnimationSection] = useState<'zoomPan' | 'autoplay'>('zoomPan');
  const animationMenuRef = useRef<HTMLDivElement>(null);

  // Full Demo Settings Modal State (Supademo-style Playback / Autoplay / Branding)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsModalTab, setSettingsModalTab] = useState<SettingsModalTab>('autoplay');

  // Close animation dropdown menu on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (animationMenuRef.current && !animationMenuRef.current.contains(e.target as Node)) {
        setIsAnimationMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAnimationMenuOpen(false);
      }
    };
    if (isAnimationMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAnimationMenuOpen]);

  // Studio Virtual Camera Preview State
  const [isStudioAnimationPreviewing, setIsStudioAnimationPreviewing] = useState(false);
  const [studioCameraScale, setStudioCameraScale] = useState(1.0);
  const [studioCameraTransition, setStudioCameraTransition] = useState('none');
  const studioAnimationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Direct media upload and drag & drop state
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isDraggingOverStage, setIsDraggingOverStage] = useState(false);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const directFileInputRef = useRef<HTMLInputElement>(null);

  // Hotspot Editing & Placement state
  const [isPlacingHotspot, setIsPlacingHotspot] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [openStepMenuIdx, setOpenStepMenuIdx] = useState<number | null>(null);

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedResult, setPublishedResult] = useState<{ publicId: string; publicUrl: string } | null>(
    demo.publicId && demo.status === 'published'
      ? { publicId: demo.publicId, publicUrl: `/d/${demo.publicId}` }
      : null
  );
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);
  const [lastAddedStepId, setLastAddedStepId] = useState<string | null>(null);
  const [lastAddedChapterId, setLastAddedChapterId] = useState<string | null>(null);

  // Canonical Aspect Ratio single source of truth across editor, preview, and player
  const canonicalRatioInfo = useMemo(() => {
    return getCanonicalDemoAspectRatio(demo, scenes);
  }, [demo, scenes]);

  // Aspect Ratio Warning Modal state for direct uploads and scene replacements
  const [editorAspectWarning, setEditorAspectWarning] = useState<{
    file: File;
    currentInfo: CanonicalAspectRatioInfo;
    newInfo: AspectRatioInfo;
    target: 'direct_upload' | 'replace_scene';
  } | null>(null);
  const [isEditorCropping, setIsEditorCropping] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = steps[activeStepIndex] || steps[0];

  const currentScene = useMemo(() => {
    if (currentStep?.sceneId) {
      const matched = scenes.find(
        (sc) => sc.id === currentStep.sceneId || (sc as any)._id === currentStep.sceneId
      );
      if (matched) return matched;
    }
    return scenes[activeSceneIndex] || scenes[0];
  }, [scenes, currentStep, activeSceneIndex]);

  // Hotspots belonging to current step and scene
  const stepElements = useMemo(() => {
    return elements.filter((el) => {
      if (el.stepId) {
        return el.stepId === currentStep?.id || el.stepId === currentStep?._id;
      }
      return Boolean(
        currentStep?.targetElementId &&
        (el.id === currentStep.targetElementId || el._id === currentStep.targetElementId)
      );
    });
  }, [elements, currentStep]);

  // Selected Hotspot element (only within the active step)
  const selectedHotspotElement = useMemo(() => {
    if (!selectedElementId) return null;
    return (
      stepElements.find(
        (el) =>
          (el.id === selectedElementId || el._id === selectedElementId) &&
          (el.type === 'hotspot' || el.hotspotConfig)
      ) || null
    );
  }, [stepElements, selectedElementId]);

  // Auto-select first hotspot of active step on mount or step change if none selected, or clear if step has no hotspots
  useEffect(() => {
    if (stepElements.length > 0) {
      const isCurrentSelectedInStep = stepElements.some(
        (el) => el.id === selectedElementId || el._id === selectedElementId
      );
      if (!isCurrentSelectedInStep) {
        setSelectedElementId(stepElements[0].id || (stepElements[0] as any)._id || null);
      }
    } else {
      setSelectedElementId(null);
    }
  }, [activeStepIndex, stepElements, selectedElementId]);

  // Selected Chapter
  const selectedChapter = useMemo(() => {
    if (!selectedChapterId) return chapters[0] || null;
    return chapters.find((ch) => ch.id === selectedChapterId) || chapters[0] || null;
  }, [chapters, selectedChapterId]);

  // Group steps by chapter
  const stepsByChapter = useMemo(() => {
    const map = new Map<string, { step: IDemoStep; originalIndex: number }[]>();
    chapters.forEach((ch) => map.set(ch.id, []));
    const unassigned: { step: IDemoStep; originalIndex: number }[] = [];

    const hasAnyChapterId = steps.some((s) => !!s.chapterId);

    steps.forEach((st, idx) => {
      if (st.chapterId && map.has(st.chapterId)) {
        map.get(st.chapterId)!.push({ step: st, originalIndex: idx });
      } else if (!hasAnyChapterId && chapters.length > 0) {
        // Fallback: put steps under first chapter
        map.get(chapters[0].id)!.push({ step: st, originalIndex: idx });
      } else {
        unassigned.push({ step: st, originalIndex: idx });
      }
    });

    return { map, unassigned };
  }, [chapters, steps]);

  // Close 3-dots menus on outside click
  useEffect(() => {
    const handleOutsideClick = () => {
      setOpenStepMenuIdx(null);
      setOpenChapterMenuId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Immediate Save helper
  const saveImmediately = useCallback(
    async (
      updatedDemo = demo,
      updatedScenes = scenes,
      updatedSteps = steps,
      updatedElements = elements,
      updatedInteractions = interactions,
      updatedChapters = chapters
    ) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      setSaveStatus('saving');
      try {
        // Always compute thumbnail from the first step's scene
        const sortedSteps = (updatedSteps || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const firstStep = sortedSteps[0];
        let computedThumbnail = '';
        if (firstStep?.sceneId) {
          const matchedScene = updatedScenes.find(
            (s) => s.id === firstStep.sceneId || (s as any)._id === firstStep.sceneId
          );
          if (matchedScene?.sourceAssetUrl) {
            computedThumbnail = matchedScene.sourceAssetUrl;
          }
        }
        if (!computedThumbnail) {
          computedThumbnail =
            updatedScenes.find((s) => s.sourceAssetUrl)?.sourceAssetUrl ||
            updatedDemo.thumbnail ||
            '';
        }

        const targetId = updatedDemo.id || (updatedDemo as any)._id || demo.id || (demo as any)._id;
        const res = await fetch(`/api/demos/${targetId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: updatedDemo.name,
            description: updatedDemo.description,
            thumbnail: computedThumbnail,
            settings: updatedDemo.settings,
            scenes: updatedScenes,
            steps: updatedSteps,
            elements: updatedElements,
            interactions: updatedInteractions,
            chapters: updatedChapters,
          }),
        });
        if (res.ok) {
          const resData = await res.json().catch(() => null);
          if (resData?.data?.demo) {
            setDemo({
              ...resData.data.demo,
              settings: {
                ...(updatedDemo.settings || {}),
                ...(resData.data.demo.settings || {}),
              },
            });
          }
          setSaveStatus('saved');
        } else {
          setSaveStatus('error');
        }
      } catch {
        setSaveStatus('error');
      }
    },
    [demo, scenes, steps, elements, interactions, chapters]
  );

  // Debounced Autosave
  const triggerAutosave = useCallback(
    (
      updatedDemo = demo,
      updatedScenes = scenes,
      updatedSteps = steps,
      updatedElements = elements,
      updatedInteractions = interactions,
      updatedChapters = chapters
    ) => {
      setSaveStatus('saving');
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(async () => {
        await saveImmediately(
          updatedDemo,
          updatedScenes,
          updatedSteps,
          updatedElements,
          updatedInteractions,
          updatedChapters
        );
      }, 800);
    },
    [saveImmediately]
  );

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // Immediate Save for manual button press
  const handleImmediateSave = async () => {
    await saveImmediately();
  };

  // Update Demo Details
  const handleUpdateDemoName = (name: string) => {
    const updated = { ...demo, name };
    setDemo(updated);
    triggerAutosave(updated, scenes, steps, elements, interactions, chapters);
  };

  // Update Step Properties
  const handleUpdateStep = (updates: Partial<IDemoStep>) => {
    const nextSteps = steps.map((s, idx) =>
      idx === activeStepIndex ? { ...s, ...updates } : s
    );
    setSteps(nextSteps);
    triggerAutosave(demo, scenes, nextSteps, elements, interactions, chapters);
  };

  // Select Chapter
  const handleSelectChapter = (chapterId: string) => {
    setSelectedNodeType('chapter');
    setSelectedChapterId(chapterId);
    setSelectedElementId(null);
  };

  // Select Step with clean camera state isolation
  const handleSelectStep = (idx: number) => {
    // Cancel any running animation preview from the previous step
    if (studioAnimationTimeoutRef.current) {
      clearTimeout(studioAnimationTimeoutRef.current);
      studioAnimationTimeoutRef.current = null;
    }
    setIsStudioAnimationPreviewing(false);
    setStudioCameraScale(1.0);
    setStudioCameraTransition('none');

    setSelectedNodeType('step');
    setActiveStepIndex(idx);
    const targetStep = steps[idx];
    if (targetStep) {
      if (targetStep.sceneId) {
        const scIdx = scenes.findIndex(
          (sc) => sc.id === targetStep.sceneId || (sc as any)._id === targetStep.sceneId
        );
        if (scIdx !== -1) {
          setActiveSceneIndex(scIdx);
        }
      }
      const stepHotspot = elements.find(
        (el) =>
          (el.stepId === targetStep.id || el.id === targetStep.targetElementId) &&
          (el.type === 'hotspot' || el.hotspotConfig)
      );
      setSelectedElementId(stepHotspot ? stepHotspot.id : null);
    }
  };

  // Add Chapter with complete production defaults matching Supademo
  const handleAddChapter = (insertIndex?: number) => {
    const chapterNumber = chapters.length + 1;
    const newChapterId = `ch_${Date.now()}`;
    const newChapter: IDemoChapter = {
      id: newChapterId,
      demoId: demo.id,
      type: 'default',
      title: 'Create a Preveuo in minutes',
      description: "Here's a description of the Preveuo",
      logo: {
        visible: true,
        altText: 'preveuo',
      },
      cover: {
        type: 'steps',
      },
      layout: 'left',
      theme: 'dark',
      opacity: 24,
      blur: false,
      buttons: [
        {
          id: `btn_${Date.now()}_1`,
          label: 'Get Started',
          action: {
            type: 'next',
          },
          style: 'primary',
          visible: true,
        },
      ],
      order: typeof insertIndex === 'number' ? insertIndex : chapters.length,
    };

    let nextChapters = [...chapters];
    const targetIdx = typeof insertIndex === 'number' ? insertIndex : chapters.length;
    nextChapters.splice(targetIdx, 0, newChapter);
    nextChapters = nextChapters.map((ch, idx) => ({ ...ch, order: idx }));

    setChapters(nextChapters);
    setSelectedNodeType('chapter');
    setSelectedChapterId(newChapterId);
    setSelectedElementId(null);
    setLastAddedChapterId(newChapterId);
    setTimeout(() => {
      setLastAddedChapterId((prev) => (prev === newChapterId ? null : prev));
    }, 2500);
    triggerAutosave(demo, scenes, steps, elements, interactions, nextChapters);
  };

  // Add Chapter Button directly from canvas
  const handleAddChapterButton = (chapterId: string) => {
    const targetChapter = chapters.find((ch) => ch.id === chapterId);
    if (!targetChapter) return;
    const newButton = {
      id: `btn_${Date.now()}_${(targetChapter.buttons?.length || 0) + 1}`,
      label: 'Add Button',
      action: { type: 'next' as const },
      style: 'secondary' as const,
      visible: true,
    };
    const updatedButtons = [...(targetChapter.buttons || []), newButton];
    handleUpdateChapter(chapterId, { buttons: updatedButtons });
  };

  // Update Chapter Properties
  const handleUpdateChapter = (chapterId: string, patch: Partial<IDemoChapter>) => {
    const nextChapters = chapters.map((ch) =>
      ch.id === chapterId ? { ...ch, ...patch } : ch
    );
    setChapters(nextChapters);
    triggerAutosave(demo, scenes, steps, elements, interactions, nextChapters);
  };

  // Duplicate Chapter
  const handleDuplicateChapter = (chapterId: string) => {
    const sourceChapter = chapters.find((ch) => ch.id === chapterId);
    if (!sourceChapter) return;

    const newChapterId = `ch_${Date.now()}`;
    const sourceIdx = chapters.findIndex((ch) => ch.id === chapterId);

    const clonedButtons = (sourceChapter.buttons || []).map((b, bIdx) => ({
      ...b,
      id: `btn_${Date.now()}_${bIdx + 1}`,
    }));

    const clonedChapter: IDemoChapter = {
      ...sourceChapter,
      id: newChapterId,
      title: `${sourceChapter.title} (Copy)`,
      order: sourceIdx + 1,
      buttons: clonedButtons,
    };

    const nextChapters = [...chapters];
    nextChapters.splice(sourceIdx + 1, 0, clonedChapter);
    const reordered = nextChapters.map((ch, idx) => ({ ...ch, order: idx }));

    setChapters(reordered);
    setSelectedNodeType('chapter');
    setSelectedChapterId(newChapterId);
    setSelectedElementId(null);
    triggerAutosave(demo, scenes, steps, elements, interactions, reordered);
  };

  // Delete Chapter
  const handleDeleteChapter = (chapterId: string) => {
    const nextChapters = chapters.filter((ch) => ch.id !== chapterId);

    // Clean up any button or hotspot navigation referencing this chapter
    const sanitizedElements = elements.map((el) => {
      if (
        el.hotspotConfig?.navigation?.nextButton?.action === 'goToChapter' &&
        el.hotspotConfig?.navigation?.nextButton?.target === chapterId
      ) {
        return {
          ...el,
          hotspotConfig: {
            ...el.hotspotConfig,
            navigation: {
              ...el.hotspotConfig.navigation,
              nextButton: {
                ...el.hotspotConfig.navigation.nextButton,
                action: 'nextStep' as any,
                target: undefined,
              },
            },
          },
        };
      }
      if (
        el.hotspotConfig?.navigation?.backButton?.action === 'goToChapter' &&
        el.hotspotConfig?.navigation?.backButton?.target === chapterId
      ) {
        return {
          ...el,
          hotspotConfig: {
            ...el.hotspotConfig,
            navigation: {
              ...el.hotspotConfig.navigation,
              backButton: {
                ...el.hotspotConfig.navigation.backButton,
                action: 'previousStep' as any,
                target: undefined,
              },
            },
          },
        };
      }
      return el;
    });

    const sanitizedSteps = steps.map((st) => {
      if (st.chapterId === chapterId) {
        return { ...st, chapterId: undefined };
      }
      return st;
    });

    setChapters(nextChapters);
    setElements(sanitizedElements);
    setSteps(sanitizedSteps);

    if (selectedChapterId === chapterId) {
      if (nextChapters.length > 0) {
        setSelectedNodeType('chapter');
        setSelectedChapterId(nextChapters[0].id);
      } else {
        setSelectedNodeType('step');
        setSelectedChapterId(null);
      }
    }

    triggerAutosave(demo, scenes, sanitizedSteps, sanitizedElements, interactions, nextChapters);
  };

  // Add Step Modal State & Handlers
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);
  const [addStepContext, setAddStepContext] = useState<{
    insertIndex?: number;
    chapterId?: string;
  } | null>(null);

  const handleOpenAddStepModal = (insertIndex?: number, chapterId?: string) => {
    setAddStepContext({ insertIndex, chapterId });
    setIsAddStepModalOpen(true);
  };

  // Add Step opens the Add Step Modal (with Image/Video Upload, Scenes, or URL)
  const handleAddStep = (insertIndex?: number, chapterId?: string) => {
    handleOpenAddStepModal(insertIndex, chapterId);
  };

  const handleConfirmAddStep = async (payload: {
    title: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    existingSceneId?: string;
    chapterId?: string;
    aspectRatioChange?: {
      width: number;
      height: number;
      aspectRatio: string;
    };
  }) => {
    let targetSceneId = payload.existingSceneId;
    let nextScenes = [...scenes];

    // Determine viewport for new scene
    let sceneViewport: SceneViewport = { width: 1920, height: 1080, aspectRatio: '16:9' };
    if (payload.aspectRatioChange) {
      sceneViewport = {
        width: payload.aspectRatioChange.width,
        height: payload.aspectRatioChange.height,
        aspectRatio: payload.aspectRatioChange.aspectRatio,
      };
    } else if (scenes.length > 0 && scenes[0].viewport) {
      sceneViewport = {
        width: scenes[0].viewport.width,
        height: scenes[0].viewport.height,
        aspectRatio: scenes[0].viewport.aspectRatio || '16:9',
      };
    } else if (demo.settings?.canonicalWidth && demo.settings?.canonicalHeight) {
      sceneViewport = {
        width: demo.settings.canonicalWidth,
        height: demo.settings.canonicalHeight,
        aspectRatio: demo.settings.aspectRatio || '16:9',
      };
    }

    // If user uploaded a new image/video or entered a custom URL, create a new Scene!
    if (!targetSceneId) {
      const newSceneId = `sc_${Date.now()}`;
      const newScene: IDemoScene = {
        id: newSceneId,
        demoId: demo.id,
        name: payload.title || `Scene ${scenes.length + 1}`,
        slug: `scene-${scenes.length + 1}`,
        order: scenes.length,
        sourceType: payload.mediaType === 'video' ? 'recording' : 'screenshot',
        sourceAssetUrl: payload.mediaUrl,
        viewport: sceneViewport,
        metadata: {},
      };
      nextScenes.push(newScene);
      targetSceneId = newSceneId;
    }

    // If aspect ratio was changed, update all existing scenes to maintain canonical consistency
    if (payload.aspectRatioChange) {
      nextScenes = nextScenes.map((sc) => ({
        ...sc,
        viewport: {
          ...sc.viewport,
          width: payload.aspectRatioChange!.width,
          height: payload.aspectRatioChange!.height,
          aspectRatio: payload.aspectRatioChange!.aspectRatio,
        },
      }));
    }

    const stepNumber = steps.length + 1;
    const newStepId = `st_${Date.now()}`;

    const insertIdx = addStepContext?.insertIndex;
    const assignedChapterId =
      payload.chapterId ||
      addStepContext?.chapterId ||
      (selectedNodeType === 'chapter' ? selectedChapterId || undefined : currentStep?.chapterId);

    // Create new step cleanly without any default hotspot
    const newStep: IDemoStep = {
      id: newStepId,
      demoId: demo.id,
      sceneId: targetSceneId,
      chapterId: assignedChapterId,
      order: typeof insertIdx === 'number' ? insertIdx : steps.length,
      title: payload.title || `Step ${stepNumber}`,
      description: '',
      targetElementId: '',
      action: 'click',
      tooltip: {
        title: payload.title || `Step ${stepNumber}`,
        description: '',
        position: 'bottom',
        badge: `Step ${stepNumber}`,
        buttonText: 'Next',
      },
      spotlight: {
        enabled: false,
        shape: 'rectangle',
        padding: 10,
        borderRadius: 12,
      },
      navigation: { canSkip: true, autoAdvance: false },
    };

    const nextElements = [...elements];
    let nextSteps = [...steps];
    const targetIdx = typeof insertIdx === 'number' ? insertIdx : steps.length;
    nextSteps.splice(targetIdx, 0, newStep);

    // Reindex order
    nextSteps = nextSteps.map((st, i) => ({ ...st, order: i }));

    setElements(nextElements);
    setSteps(nextSteps);
    setSelectedNodeType('step');
    setActiveStepIndex(targetIdx);
    setSelectedElementId(null);
    setLastAddedStepId(newStepId);
    setTimeout(() => {
      setLastAddedStepId((prev) => (prev === newStepId ? null : prev));
    }, 2500);

    // Automatically sync scene
    const scIdx = nextScenes.findIndex(
      (sc) => sc.id === targetSceneId || (sc as any)._id === targetSceneId
    );
    if (scIdx !== -1) {
      setActiveSceneIndex(scIdx);
    }
    const updatedDemo = {
      ...demo,
      thumbnail: demo.thumbnail || (payload.mediaType === 'image' ? payload.mediaUrl : demo.thumbnail),
      settings: {
        ...demo.settings,
        ...(payload.aspectRatioChange
          ? {
              aspectRatio: payload.aspectRatioChange.aspectRatio,
              canonicalWidth: payload.aspectRatioChange.width,
              canonicalHeight: payload.aspectRatioChange.height,
            }
          : scenes.length === 0
          ? {
              aspectRatio: sceneViewport.aspectRatio,
              canonicalWidth: sceneViewport.width,
              canonicalHeight: sceneViewport.height,
            }
          : {}),
      },
    };
    setDemo(updatedDemo);
    await saveImmediately(updatedDemo, nextScenes, nextSteps, nextElements, interactions, chapters);
  };

  // Helper to execute direct upload and add step
  const executeDirectUpload = async (
    file: File,
    aspectRatioChange?: { width: number; height: number; aspectRatio: string }
  ) => {
    try {
      setIsUploadingMedia(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      await handleConfirmAddStep({
        title: file.name.replace(/\.[^/.]+$/, '').slice(0, 30) || `Step ${steps.length + 1}`,
        mediaUrl: data.url,
        mediaType: data.type || (file.type.startsWith('video/') ? 'video' : 'image'),
        aspectRatioChange,
      });
    } catch (err: any) {
      alert(err.message || 'Failed to upload media.');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // Direct upload for the empty state dropzone / file picker with aspect-ratio validation
  const handleDirectUploadFile = async (file: File) => {
    try {
      const dims = await getImageDimensions(file);
      const fileAspect = calculateAspectRatio(dims.width, dims.height);
      const canonical = getCanonicalDemoAspectRatio(demo, scenes);

      if (scenes.length > 0 && !areAspectRatiosMatching(fileAspect.ratio, canonical.ratio)) {
        setEditorAspectWarning({
          file,
          currentInfo: canonical,
          newInfo: fileAspect,
          target: 'direct_upload',
        });
        return;
      }

      await executeDirectUpload(
        file,
        scenes.length === 0
          ? {
              width: dims.width,
              height: dims.height,
              aspectRatio: fileAspect.label,
            }
          : undefined
      );
    } catch (err: any) {
      alert(err.message || 'Failed to inspect media dimensions.');
    }
  };

  // Screen & camera recording helper
  const handleStartScreenRecording = async () => {
    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices?.getDisplayMedia) {
        alert('Screen recording is not supported in this browser.');
        return;
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        if (chunks.length === 0) return;
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'video/webm' });
        await handleDirectUploadFile(file);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
    } catch (err: any) {
      if (err.name !== 'NotAllowedError') {
        alert(err.message || 'Screen recording could not be started.');
      }
    }
  };

  // Helper to execute replacing media for the currently selected scene
  const executeReplaceSceneMedia = async (
    file: File,
    aspectRatioChange?: { width: number; height: number; aspectRatio: string }
  ) => {
    if (!currentScene) return;
    try {
      setIsUploadingMedia(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload media');
      }

      let nextScenes = scenes.map((sc) =>
        sc.id === currentScene.id || (sc as any)._id === currentScene.id
          ? {
              ...sc,
              sourceAssetUrl: data.url,
              sourceType: data.type === 'video' ? ('recording' as const) : ('screenshot' as const),
              viewport: aspectRatioChange
                ? {
                    width: aspectRatioChange.width,
                    height: aspectRatioChange.height,
                    aspectRatio: aspectRatioChange.aspectRatio,
                  }
                : sc.viewport,
            }
          : sc
      );

      if (aspectRatioChange) {
        nextScenes = nextScenes.map((sc) => ({
          ...sc,
          viewport: {
            ...sc.viewport,
            width: aspectRatioChange.width,
            height: aspectRatioChange.height,
            aspectRatio: aspectRatioChange.aspectRatio,
          },
        }));
      }

      const isFirstScene =
        scenes.findIndex((sc) => sc.id === currentScene.id || (sc as any)._id === currentScene.id) <= 0;
      const updatedDemo = {
        ...demo,
        thumbnail: isFirstScene ? data.url : demo.thumbnail,
        settings: {
          ...demo.settings,
          ...(aspectRatioChange
            ? {
                aspectRatio: aspectRatioChange.aspectRatio,
                canonicalWidth: aspectRatioChange.width,
                canonicalHeight: aspectRatioChange.height,
              }
            : {}),
        },
      };

      setScenes(nextScenes);
      setDemo(updatedDemo);
      await saveImmediately(updatedDemo, nextScenes, steps, elements, interactions, chapters);
    } catch (err: any) {
      alert(err.message || 'Failed to replace scene media.');
    } finally {
      setIsUploadingMedia(false);
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
    }
  };

  // Replace media for the currently selected scene with aspect-ratio validation
  const handleReplaceSceneMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentScene) return;

    try {
      const dims = await getImageDimensions(file);
      const fileAspect = calculateAspectRatio(dims.width, dims.height);
      const canonical = getCanonicalDemoAspectRatio(demo, scenes);

      if (scenes.length > 0 && !areAspectRatiosMatching(fileAspect.ratio, canonical.ratio)) {
        setEditorAspectWarning({
          file,
          currentInfo: canonical,
          newInfo: fileAspect,
          target: 'replace_scene',
        });
        return;
      }

      await executeReplaceSceneMedia(file);
    } catch (err: any) {
      alert(err.message || 'Failed to inspect media dimensions.');
    }
  };

  const handleCancelEditorAspectWarning = () => {
    setEditorAspectWarning(null);
    if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
    if (directFileInputRef.current) directFileInputRef.current.value = '';
  };

  const handleChangeEditorAspectRatio = async () => {
    if (!editorAspectWarning) return;
    const { file, newInfo, target } = editorAspectWarning;
    const change = {
      width: newInfo.width,
      height: newInfo.height,
      aspectRatio: newInfo.label,
    };
    setEditorAspectWarning(null);
    if (target === 'direct_upload') {
      await executeDirectUpload(file, change);
    } else {
      await executeReplaceSceneMedia(file, change);
    }
  };

  const handleCropEditorToMatch = async () => {
    if (!editorAspectWarning) return;
    const { file, currentInfo, target } = editorAspectWarning;
    try {
      setIsEditorCropping(true);
      const cropped = await cropImageToAspectRatio(file, currentInfo.ratio);
      setEditorAspectWarning(null);
      if (target === 'direct_upload') {
        await executeDirectUpload(cropped);
      } else {
        await executeReplaceSceneMedia(cropped);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to crop image to current aspect ratio.');
    } finally {
      setIsEditorCropping(false);
    }
  };

  // Duplicate Step with independent camera & hotspot configuration
  const handleDuplicateStep = (idx: number) => {
    const sourceStep = steps[idx];
    if (!sourceStep) return;

    if (studioAnimationTimeoutRef.current) {
      clearTimeout(studioAnimationTimeoutRef.current);
      studioAnimationTimeoutRef.current = null;
    }
    setIsStudioAnimationPreviewing(false);
    setStudioCameraScale(1.0);
    setStudioCameraTransition('none');

    const newStepId = `st_${Date.now()}`;
    const newElementId = `el_${Date.now()}`;

    // Duplicate target element
    const sourceElement = elements.find(
      (el) => el.id === sourceStep.targetElementId || el.stepId === sourceStep.id
    );

    let nextElements = [...elements];
    if (sourceElement) {
      const clonedElement: IDemoElement = {
        ...sourceElement,
        id: newElementId,
        stepId: newStepId,
        name: `${sourceElement.name} (Copy)`,
      };
      nextElements.push(clonedElement);
    }

    const clonedStep: IDemoStep = {
      ...sourceStep,
      id: newStepId,
      title: `${sourceStep.title} (Copy)`,
      targetElementId: newElementId,
      order: idx + 1,
      zoomPan: sourceStep.zoomPan
        ? {
            ...sourceStep.zoomPan,
            focusPoint: { ...sourceStep.zoomPan.focusPoint },
            focusRegion: sourceStep.zoomPan.focusRegion
              ? { ...sourceStep.zoomPan.focusRegion }
              : undefined,
            linkedHotspotId:
              sourceStep.zoomPan.linkedHotspotId === sourceStep.targetElementId ||
              sourceStep.zoomPan.linkedHotspotId === sourceElement?.id
                ? newElementId
                : sourceStep.zoomPan.linkedHotspotId,
          }
        : undefined,
      navigation: sourceStep.navigation ? { ...sourceStep.navigation } : undefined,
    };

    const nextSteps = [...steps];
    nextSteps.splice(idx + 1, 0, clonedStep);

    setElements(nextElements);
    setSteps(nextSteps);
    setActiveStepIndex(idx + 1);
    setSelectedElementId(newElementId);

    triggerAutosave(demo, scenes, nextSteps, nextElements, interactions, chapters);
  };

  // Delete Step and repair references
  const handleDeleteStep = (idx: number) => {
    if (steps.length <= 1) return;
    const stepToDelete = steps[idx];

    if (studioAnimationTimeoutRef.current) {
      clearTimeout(studioAnimationTimeoutRef.current);
      studioAnimationTimeoutRef.current = null;
    }
    setIsStudioAnimationPreviewing(false);
    setStudioCameraScale(1.0);
    setStudioCameraTransition('none');

    const nextSteps = steps
      .filter((_, i) => i !== idx)
      .map((st) => {
        if (st.completion?.nextStepId === stepToDelete.id) {
          return {
            ...st,
            completion: { ...st.completion, nextStepId: undefined },
          };
        }
        return st;
      });

    const nextElements = elements.filter(
      (el) => el.stepId !== stepToDelete.id && el.id !== stepToDelete.targetElementId
    );

    setSteps(nextSteps);
    setElements(nextElements);

    const nextActive = Math.min(idx, nextSteps.length - 1);
    setActiveStepIndex(nextActive);

    // Update selected hotspot
    const remainingStep = nextSteps[nextActive];
    const newSelected = nextElements.find(
      (el) => el.stepId === remainingStep.id || el.id === remainingStep.targetElementId
    );
    setSelectedElementId(newSelected ? newSelected.id : null);

    triggerAutosave(demo, scenes, nextSteps, nextElements, interactions, chapters);
  };

  // Canvas Click: Place new Hotspot or Click Canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const rawX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const rawY = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const clampedX = Math.min(98.5, Math.max(1.5, rawX));
    const clampedY = Math.min(98.5, Math.max(1.5, rawY));

    // Canvas click in Animation tab sets or updates focus point when in Zoom & Pan mode
    if (activeTab === 'animation' && activeAnimationSection === 'zoomPan') {
      const existingConfig = currentStep?.zoomPan || DEFAULT_ZOOM_PAN_CONFIG;
      const boxW = existingConfig.focusRegion?.width || 60;
      const boxH = existingConfig.focusRegion?.height || 50;
      const roundedX = Math.round(clampedX * 10) / 10;
      const roundedY = Math.round(clampedY * 10) / 10;
      const newBoxX = Math.max(0, Math.min(100 - boxW, roundedX - boxW / 2));
      const newBoxY = Math.max(0, Math.min(100 - boxH, roundedY - boxH / 2));

      handleUpdateStep({
        zoomPan: {
          ...existingConfig,
          enabled: true,
          linkedHotspotId: null,
          focusPoint: {
            x: roundedX,
            y: roundedY,
          },
          focusRegion: {
            x: Math.round(newBoxX * 10) / 10,
            y: Math.round(newBoxY * 10) / 10,
            width: boxW,
            height: boxH,
          },
        },
      });
      return;
    }

    if (isPlacingHotspot) {
      // Create new hotspot at clicked point
      const newElementId = `el_${Date.now()}`;
      const newHotspot: IDemoElement = {
        id: newElementId,
        demoId: demo.id,
        sceneId: currentScene?.id || '',
        stepId: currentStep?.id,
        type: 'hotspot',
        name: `Hotspot ${elements.length + 1}`,
        position: { x: clampedX, y: clampedY, width: 28, height: 18 },
        style: {
          backgroundColor: PRIMARY_COLOR,
          color: THEME_COLORS.white,
          borderRadius: 16,
          pulseAnimation: true,
        },
        hotspotConfig: {
          type: 'pointer',
          content: {
            text: 'Add some hotspot text here.',
            textAlign: 'left',
          },
          appearance: {
            background: PRIMARY_COLOR,
            textColor: THEME_COLORS.white,
            backdrop: false,
            borderRadius: 'rounded',
            width: 'medium',
            animation: 'ping',
            pointerStyle: 'ripple',
          },
          visibility: 'always',
          navigation: {
            showNext: true,
            nextButton: {
              enabled: true,
              text: '',
              background: 'rgba(255, 255, 255, 0.22)',
              textColor: 'white',
              action: 'nextStep',
            },
            backButton: {
              enabled: false,
              text: 'Back',
              background: 'white',
              textColor: THEME_COLORS.textBody,
              action: 'previousStep',
            },
          },
        },
        visible: true,
        order: elements.length,
      };

      const nextElements = [...elements, newHotspot];
      setElements(nextElements);
      setSelectedElementId(newElementId);
      setIsPlacingHotspot(false);

      triggerAutosave(demo, scenes, steps, nextElements, interactions, chapters);
    }
  };

  // Move Hotspot
  const handleMoveHotspot = (elementId: string, x: number, y: number) => {
    const nextElements = elements.map((el) =>
      el.id === elementId || el._id === elementId
        ? {
            ...el,
            position: { ...el.position, x, y },
          }
        : el
    );
    setElements(nextElements);

    // If current step's zoomPan is linked to this hotspot, synchronize focusPoint
    if (
      currentStep?.zoomPan?.linkedHotspotId &&
      (currentStep.zoomPan.linkedHotspotId === elementId ||
        (currentStep as any)._id === elementId)
    ) {
      handleUpdateStep({
        zoomPan: {
          ...currentStep.zoomPan,
          focusPoint: { x, y },
          focusRegion: {
            x: Math.round(Math.max(0, Math.min(100 - (currentStep.zoomPan.focusRegion?.width || 60), x - (currentStep.zoomPan.focusRegion?.width || 60) / 2)) * 10) / 10,
            y: Math.round(Math.max(0, Math.min(100 - (currentStep.zoomPan.focusRegion?.height || 50), y - (currentStep.zoomPan.focusRegion?.height || 50) / 2)) * 10) / 10,
            width: currentStep.zoomPan.focusRegion?.width || 60,
            height: currentStep.zoomPan.focusRegion?.height || 50,
          },
        },
      });
    }

    triggerAutosave(demo, scenes, steps, nextElements, interactions, chapters);
  };

  // Resize Area Hotspot
  const handleResizeHotspot = (
    elementId: string,
    width: number,
    height: number,
    x: number,
    y: number
  ) => {
    const nextElements = elements.map((el) =>
      el.id === elementId || el._id === elementId
        ? {
            ...el,
            position: { ...el.position, width, height, x, y },
          }
        : el
    );
    setElements(nextElements);
    triggerAutosave(demo, scenes, steps, nextElements, interactions, chapters);
  };

  // Update Hotspot Properties
  const handleUpdateHotspot = (elementId: string, updates: Partial<IDemoElement>) => {
    const nextElements = elements.map((el) =>
      el.id === elementId || el._id === elementId ? { ...el, ...updates } : el
    );
    setElements(nextElements);
    triggerAutosave(demo, scenes, steps, nextElements, interactions, chapters);
  };

  // Delete Hotspot
  const handleDeleteHotspot = (elementId: string) => {
    const nextElements = elements.filter(
      (el) => el.id !== elementId && el._id !== elementId
    );
    const nextSteps = steps.map((st) => {
      let updatedSt = st.targetElementId === elementId ? { ...st, targetElementId: '' } : st;
      if (updatedSt.zoomPan?.linkedHotspotId === elementId) {
        updatedSt = {
          ...updatedSt,
          zoomPan: { ...updatedSt.zoomPan, linkedHotspotId: null },
        };
      }
      return updatedSt;
    });
    setElements(nextElements);
    setSteps(nextSteps);
    setSelectedElementId(null);
    triggerAutosave(demo, scenes, nextSteps, nextElements, interactions, chapters);
  };

  // Studio Virtual Camera Animation Preview
  const handlePreviewStudioAnimation = () => {
    let zoomConfig = currentStep?.zoomPan;
    if (!zoomConfig) {
      zoomConfig = DEFAULT_ZOOM_PAN_CONFIG;
    }
    if (!zoomConfig.enabled) {
      zoomConfig = { ...zoomConfig, enabled: true };
      handleUpdateStep({ zoomPan: zoomConfig });
    }

    if (studioAnimationTimeoutRef.current) {
      clearTimeout(studioAnimationTimeoutRef.current);
      studioAnimationTimeoutRef.current = null;
    }

    // 1. Prepare preview: hide editor handles and ensure 1.0x baseline
    setIsStudioAnimationPreviewing(true);
    setStudioCameraScale(1.0);
    setStudioCameraTransition('none');

    const durationMs = Math.max(200, zoomConfig.durationMs || 800);
    const holdMs = 1200; // Hold at zoomed state for 1.2s so user can evaluate framing
    const returnMs = 600; // Smooth return to original size
    const easingCss = getEasingCss(zoomConfig.easing);

    const targetZoom = zoomConfig.focusRegion?.width
      ? Math.max(1.1, Math.min(3.5, 100 / zoomConfig.focusRegion.width))
      : (zoomConfig.zoomLevel || 1.5);

    // 2. Animate camera to zoomed region
    setTimeout(() => {
      setStudioCameraTransition(`transform ${durationMs}ms ${easingCss}`);
      setStudioCameraScale(targetZoom);

      // 3. Hold at zoomed position, then smoothly return to original 1.0x size
      studioAnimationTimeoutRef.current = setTimeout(() => {
        // 4. Return to fit (1.0x original size)
        setStudioCameraTransition(`transform ${returnMs}ms cubic-bezier(0.16, 1, 0.3, 1)`);
        setStudioCameraScale(1.0);

        // 5. Restore editor handles once return animation finishes
        studioAnimationTimeoutRef.current = setTimeout(() => {
          setStudioCameraTransition('none');
          setIsStudioAnimationPreviewing(false);
          studioAnimationTimeoutRef.current = null;
        }, returnMs);
      }, durationMs + holdMs);
    }, 60);
  };

  const handleResetStudioCamera = () => {
    if (studioAnimationTimeoutRef.current) {
      clearTimeout(studioAnimationTimeoutRef.current);
      studioAnimationTimeoutRef.current = null;
    }
    setStudioCameraTransition('transform 300ms ease-out');
    setStudioCameraScale(1.0);
    setIsStudioAnimationPreviewing(false);
  };

  // Compute studio camera transform
  const studioCameraState = useMemo(() => {
    const zoomConfig = currentStep?.zoomPan;
    let effectiveFocus = zoomConfig?.focusPoint || { x: 50, y: 50 };
    if (zoomConfig?.linkedHotspotId) {
      const linked = stepElements.find(
        (el) =>
          el.id === zoomConfig.linkedHotspotId ||
          (el as any)._id === zoomConfig.linkedHotspotId
      );
      if (linked) {
        effectiveFocus = { x: linked.position.x, y: linked.position.y };
      }
    }
    const hasLinkedHotspot = Boolean(zoomConfig?.linkedHotspotId);
    return computeCameraTransform({
      scale: studioCameraScale,
      focusPoint: effectiveFocus,
      focusRegion: hasLinkedHotspot ? undefined : zoomConfig?.focusRegion,
      active: studioCameraScale > 1.001,
    });
  }, [currentStep?.zoomPan, studioCameraScale, stepElements]);

  // Keyboard positioning & deletion for selected hotspot with focus safety
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElementId) return;

      // Focus safety check: Do not intercept if user is typing in form controls
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      const selectedEl = elements.find(
        (el) => el.id === selectedElementId || el._id === selectedElementId
      );
      if (!selectedEl) return;

      const step = e.shiftKey ? 5 : 1;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const nextX = Math.max(1.5, Math.min(98.5, selectedEl.position.x - step));
        handleMoveHotspot(selectedElementId, nextX, selectedEl.position.y);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextX = Math.max(1.5, Math.min(98.5, selectedEl.position.x + step));
        handleMoveHotspot(selectedElementId, nextX, selectedEl.position.y);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const nextY = Math.max(1.5, Math.min(98.5, selectedEl.position.y - step));
        handleMoveHotspot(selectedElementId, selectedEl.position.x, nextY);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextY = Math.max(1.5, Math.min(98.5, selectedEl.position.y + step));
        handleMoveHotspot(selectedElementId, selectedEl.position.x, nextY);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteHotspot(selectedElementId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, elements]);

  // Hotspot Navigation Action dispatch
  const handleHotspotAction = (actionType: string, target?: string) => {
    if (actionType === 'nextStep') {
      if (activeStepIndex < steps.length - 1) {
        setActiveStepIndex(activeStepIndex + 1);
      }
    } else if (actionType === 'previousStep') {
      if (activeStepIndex > 0) {
        setActiveStepIndex(activeStepIndex - 1);
      }
    } else if (actionType === 'goToStep') {
      if (target) {
        const idx = steps.findIndex((s) => s.id === target || s._id === target);
        if (idx !== -1) {
          setSelectedNodeType('step');
          setActiveStepIndex(idx);
        }
      }
    } else if (actionType === 'goToChapter') {
      if (target) {
        setSelectedNodeType('chapter');
        setSelectedChapterId(target);
        setSelectedElementId(null);
      }
    } else if (actionType === 'goToScene') {
      if (target) {
        const idx = scenes.findIndex((s) => s.id === target || s._id === target);
        if (idx !== -1) setActiveSceneIndex(idx);
      }
    } else if (actionType === 'externalUrl') {
      if (target && (target.startsWith('http://') || target.startsWith('https://'))) {
        window.open(target, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Check if backdrop is enabled on selected hotspot
  const isBackdropActive = selectedHotspotElement?.hotspotConfig?.appearance?.backdrop ?? false;

  // Open Preview Modal ensuring any latest in-flight changes are saved
  const handleOpenPreview = async () => {
    await saveImmediately();
    setIsPreviewOpen(true);
  };

  // Publish Demo Flow
  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      await saveImmediately();
      const res = await fetch(`/api/demos/${demo.id}/publish`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPublishedResult({
          publicId: data.data.publicId,
          publicUrl: data.data.publicUrl,
        });
        setDemo((prev) => ({ ...prev, status: 'published', publicId: data.data.publicId }));
        setShowPublishModal(true);
      } else {
        alert(data.error || 'Failed to publish demo');
      }
    } catch {
      alert('Network error while publishing demo');
    } finally {
      setIsPublishing(false);
    }
  };

  const publicShareLink = publishedResult
    ? typeof window !== 'undefined'
      ? `${window.location.origin}/d/${publishedResult.publicId}`
      : `https://preveuo.com/d/${publishedResult.publicId}`
    : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicShareLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = async () => {
    if (demo.publicId && demo.status === 'published') {
      const url = `${window.location.origin}/d/${demo.publicId}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      await handlePublish();
    }
  };

  // Helper to render "+ Add Step" dashed divider
  const renderAddStepDivider = (insertIndex: number) => (
    <div className="relative py-2 flex items-center justify-center group select-none">
      <div className="absolute inset-x-3 h-px border-t border-dashed border-border-input group-hover:border-brand-purple transition-colors" />
      <button
        type="button"
        onClick={() => handleAddStep(insertIndex)}
        className="relative z-10 px-3 py-0.5 rounded-full bg-canvas hover:bg-white text-[11px] font-bold text-body group-hover:text-brand-purple transition-all cursor-pointer shadow-xs border border-transparent hover:border-brand-purple/30"
      >
        + Add Step
      </button>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-heading font-sans overflow-hidden select-none">
      {/* Top Studio Navbar */}
      <header className="h-14 border-b border-border-default bg-white px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/demos">
            <IconButton variant="secondary" size="sm" aria-label="Back to Demos">
              <ArrowLeft className="w-4 h-4 text-heading" />
            </IconButton>
          </Link>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={demo.name}
              onChange={(e) => handleUpdateDemoName(e.target.value)}
              className="text-[14px] sm:text-[15px] font-semibold text-heading bg-transparent border-b border-transparent hover:border-border-input focus:border-brand-purple focus:outline-none px-1 py-0.5 transition-colors max-w-xs sm:max-w-md"
            />

            {saveStatus === 'saving' && (
              <Badge variant="warning" size="sm" dot>
                Saving...
              </Badge>
            )}
            {saveStatus === 'saved' && (
              <Badge variant="success" size="sm" dot>
                Saved
              </Badge>
            )}
            {saveStatus === 'error' && (
              <Badge variant="danger" size="sm" dot>
                Sync error
              </Badge>
            )}
          </div>
        </div>

        {/* Action Toolbar */}
        {steps.length === 0 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-lg hover:bg-light text-body hover:text-heading flex items-center justify-center transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleOpenPreview}
              className="px-3.5 py-1.5 rounded-xl border border-border-input bg-white text-xs font-semibold text-heading hover:bg-light hover:border-brand-purple flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-body" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-4 py-1.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-white" />
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              className="w-8 h-8 rounded-lg hover:bg-light text-body hover:text-heading flex items-center justify-center transition-colors cursor-pointer"
              title="More Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Hotspot Toggle */}
            <button
              type="button"
              onClick={() => setIsPlacingHotspot((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                isPlacingHotspot
                  ? 'font-semibold bg-brand-purple text-white shadow-sm ring-2 ring-brand-purple/40'
                  : 'font-medium bg-white hover:bg-light text-heading border border-border-input'
              }`}
              title="Click to place a new hotspot on canvas"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Hotspot</span>
            </button>

            {/* Animation Toggle & Dropdown Menu */}
            <div ref={animationMenuRef} className="relative inline-block">
              <button
                type="button"
                onClick={() => {
                  setIsAnimationMenuOpen((prev) => !prev);
                  if (activeTab !== 'animation') {
                    setSelectedElementId(null);
                    setSelectedNodeType('step');
                    setIsPlacingHotspot(false);
                    setActiveTab('animation');
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                  activeTab === 'animation' && !selectedElementId && selectedNodeType === 'step'
                    ? 'font-semibold bg-brand-purple text-white shadow-sm ring-2 ring-brand-purple/40'
                    : 'font-medium bg-white hover:bg-light text-heading border border-border-input'
                }`}
                title="Animation options: Zoom & Pan and Autoplay"
                aria-expanded={isAnimationMenuOpen}
                aria-haspopup="true"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Animation</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-150 ${
                    isAnimationMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Animation Options Dropdown Menu */}
              {isAnimationMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-border-default py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-border-light flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-body">
                      Animation Modes
                    </span>
                    <span className="text-[10px] font-medium text-muted">Select mode</span>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {/* Option 1: Zoom & Pan */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveAnimationSection('zoomPan');
                        setSelectedElementId(null);
                        setSelectedNodeType('step');
                        setIsPlacingHotspot(false);
                        setActiveTab('animation');
                        setIsAnimationMenuOpen(false);
                        if (!currentStep?.zoomPan?.enabled) {
                          handleUpdateStep({
                            zoomPan: {
                              ...(currentStep?.zoomPan || DEFAULT_ZOOM_PAN_CONFIG),
                              enabled: true,
                            },
                          });
                        }
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        activeTab === 'animation' && activeAnimationSection === 'zoomPan'
                          ? 'bg-brand-purple/10 text-brand-purple'
                          : 'hover:bg-light text-heading'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0 mt-0.5">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-heading">Zoom & Pan</span>
                          {currentStep?.zoomPan?.enabled ? (
                            <span className="text-[9.5px] font-semibold bg-emerald-500/15 text-emerald-600 px-1.5 py-0.5 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="text-[9.5px] font-medium text-muted">
                              Off
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-body leading-snug mt-0.5">
                          Focal camera magnification & cinematic glide
                        </p>
                      </div>
                    </button>

                    {/* Option 2: Autoplay (Opens Settings Modal) */}
                    <button
                      type="button"
                      onClick={() => {
                        setSettingsModalTab('autoplay');
                        setIsSettingsModalOpen(true);
                        setIsAnimationMenuOpen(false);
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer hover:bg-light text-heading"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0 mt-0.5">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-heading">Autoplay Settings</span>
                          {demo.settings?.autoplay ? (
                            <span className="text-[9.5px] font-semibold bg-emerald-500/15 text-emerald-600 px-1.5 py-0.5 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="text-[9.5px] font-medium text-muted">
                              Off
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-body leading-snug mt-0.5">
                          Slide timing, delays, loop & voiceover arbitration
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Blur & Annotate */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-light text-heading border border-border-input transition-colors cursor-pointer"
            >
              <Droplets className="w-3.5 h-3.5 text-body" />
              <span>Blur & Annotate</span>
            </button>

            {/* Voice... */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-light text-heading border border-border-input transition-colors cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-body" />
              <span>Voice...</span>
            </button>

            <div className="h-5 w-px bg-border-default mx-1" />

            {/* Settings Button (Opens Full Supademo-style Settings Modal) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSettingsModalTab('autoplay');
                setIsSettingsModalOpen(true);
              }}
              leftIcon={<Settings className="w-3.5 h-3.5 text-brand-purple" />}
            >
              Settings
            </Button>

            {/* Preview Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenPreview}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
            >
              Preview
            </Button>

            {/* Share / Publish Button */}
            <Button
              variant="primary"
              size="sm"
              isLoading={isPublishing}
              onClick={handleShare}
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
            >
              {copiedLink ? 'Copied!' : demo.status === 'published' ? 'Share' : 'Publish'}
            </Button>

            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              className="w-8 h-8 rounded-lg hover:bg-light text-body hover:text-heading flex items-center justify-center transition-colors cursor-pointer"
              title="More Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Main Studio Body (3 Columns) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Rail: Chapters & Steps (only shown when steps exist) */}
        {steps.length > 0 && (
          <aside className="w-64 sm:w-72 border-r border-border-default bg-canvas flex flex-col shrink-0 overflow-y-auto">
          {/* Add Step & Add Chapter Action Buttons */}
          <div className="p-3 border-b border-border-light grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleOpenAddStepModal()}
              className="py-2 px-2 rounded-xl bg-white hover:bg-light border border-border-default flex items-center justify-center gap-1.5 transition-all cursor-pointer group shadow-xs hover:border-brand-purple hover:shadow-sm"
              title="Add step with image or video"
            >
              <div className="w-6 h-6 rounded-lg bg-brand-purple/10 group-hover:bg-brand-purple flex items-center justify-center transition-colors">
                <Plus className="w-3.5 h-3.5 text-brand-purple group-hover:text-white" />
              </div>
              <span className="text-xs font-medium text-heading group-hover:text-brand-purple">
                + Add Step
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleAddChapter()}
              className="py-2 px-2 rounded-xl bg-white hover:bg-light border border-border-default flex items-center justify-center gap-1.5 transition-all cursor-pointer group shadow-xs hover:border-brand-purple hover:shadow-sm"
              title="Add new chapter"
            >
              <div className="w-6 h-6 rounded-lg bg-brand-purple/10 group-hover:bg-brand-purple flex items-center justify-center transition-colors">
                <FolderPlus className="w-3.5 h-3.5 text-brand-purple group-hover:text-white" />
              </div>
              <span className="text-xs font-medium text-heading group-hover:text-brand-purple">
                + Chapter
              </span>
            </button>
          </div>

          {/* Chapters and/or Steps Tree */}
          <div className="p-3 pb-8 space-y-4">
            {chapters.map((ch, chIdx) => {
              const isChapterSelected = selectedNodeType === 'chapter' && selectedChapterId === ch.id;
              const chapterStepItems = stepsByChapter.map.get(ch.id) || [];

              return (
                <div key={ch.id} className="space-y-2">
                  {/* Chapter Card */}
                  <div
                    onClick={() => handleSelectChapter(ch.id)}
                    className={`relative rounded-xl p-3 border-2 transition-all cursor-pointer group ${
                      isChapterSelected
                        ? 'border-brand-purple bg-white ring-2 ring-brand-purple/30 shadow-md'
                        : 'border-border-default bg-white hover:border-slate-300'
                    } ${
                      lastAddedChapterId === ch.id
                        ? 'animate-slide-in-step animate-highlight-glow ring-2 ring-brand-purple'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
                          <BookOpen className="w-3.5 h-3.5" />
                        </span>
                        <div className="min-w-0">
                          <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
                            Chapter {chIdx + 1}
                          </span>
                          <h4 className="text-[12.5px] font-semibold text-heading truncate">
                            {ch.title || `Chapter ${chIdx + 1}`}
                          </h4>
                        </div>
                      </div>

                      {/* Chapter 3-dots Menu */}
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenChapterMenuId(openChapterMenuId === ch.id ? null : ch.id);
                          }}
                          className="w-6 h-6 rounded-md hover:bg-border-light text-body hover:text-heading flex items-center justify-center transition-colors cursor-pointer"
                          title="Chapter options"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {openChapterMenuId === ch.id && (
                          <div className="absolute right-0 top-7 w-36 bg-white rounded-xl shadow-xl border border-border-default py-1 z-30 animate-fade-in text-left">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateChapter(ch.id);
                                setOpenChapterMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-heading hover:bg-light flex items-center gap-2 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5 text-body" />
                              Duplicate
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteChapter(ch.id);
                                setOpenChapterMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Steps nested under this Chapter */}
                  <div className="pl-3 border-l-2 border-border-default space-y-1.5">
                    {chapterStepItems.map(({ step: st, originalIndex: idx }) => {
                      const isStepActive = selectedNodeType === 'step' && activeStepIndex === idx;
                      const isJustAdded = lastAddedStepId === st.id;
                      return (
                        <div
                          key={st.id || idx}
                          onClick={() => handleSelectStep(idx)}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer group shadow-xs ${
                            isStepActive
                              ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-md'
                              : 'border-border-default hover:border-slate-300'
                          } ${
                            isJustAdded
                              ? 'animate-slide-in-step animate-highlight-glow ring-2 ring-brand-purple'
                              : ''
                          }`}
                        >
                          <div className="relative aspect-[16/9] w-full bg-zinc-900 overflow-hidden">
                            {(() => {
                              const stepScene =
                                scenes.find((s) => s.id === st.sceneId || (s as any)._id === st.sceneId) ||
                                currentScene;
                              const isVid =
                                Boolean(stepScene?.sourceAssetUrl?.match(/\.(mp4|webm|mov)$/i)) ||
                                stepScene?.sourceType === 'recording';
                              if (!stepScene?.sourceAssetUrl) {
                                return (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] text-white/40">
                                    Step Preview
                                  </div>
                                );
                              }
                              if (isVid) {
                                return (
                                  <div className="relative w-full h-full bg-black">
                                    <video
                                      src={stepScene.sourceAssetUrl}
                                      muted
                                      className="w-full h-full object-cover pointer-events-none"
                                    />
                                    <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-xs rounded px-1 py-0.5 text-[8px] font-bold text-white flex items-center gap-0.5">
                                      <Video className="w-2.5 h-2.5 text-brand-purple" />
                                      <span>VIDEO</span>
                                    </div>
                                  </div>
                                );
                              }
                              return (
                                <img
                                  src={stepScene.sourceAssetUrl}
                                  alt={st.title}
                                  className="w-full h-full object-cover pointer-events-none"
                                />
                              );
                            })()}
                            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                            <div className="absolute bottom-1.5 left-1.5 w-5 h-5 rounded-full bg-brand-purple text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                              {idx + 1}
                            </div>
                            <div className="absolute bottom-1 right-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenStepMenuIdx(openStepMenuIdx === idx ? null : idx);
                                }}
                                className="w-5 h-5 rounded bg-black/40 hover:bg-black/75 text-white flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <MoreVertical className="w-3 h-3" />
                              </button>
                              {openStepMenuIdx === idx && (
                                <div className="absolute right-0 bottom-7 w-32 bg-white rounded-xl shadow-xl border border-border-default py-1 z-30 animate-fade-in text-left">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDuplicateStep(idx);
                                      setOpenStepMenuIdx(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-heading hover:bg-light flex items-center gap-2 cursor-pointer"
                                  >
                                    <Copy className="w-3 h-3 text-body" />
                                    Duplicate
                                  </button>
                                  {steps.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteStep(idx);
                                        setOpenStepMenuIdx(null);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      Delete
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add Step inside this chapter button */}
                    <button
                      type="button"
                      onClick={() => handleAddStep(undefined, ch.id)}
                      className="w-full py-1.5 px-2 rounded-lg bg-white hover:bg-light border border-dashed border-border-input hover:border-brand-purple text-[11px] font-semibold text-body hover:text-brand-purple flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      + Add Step to Chapter
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Unassigned steps if any */}
            {stepsByChapter.unassigned.length > 0 && (
              <div className="space-y-2">
                {chapters.length > 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-body px-1">
                    Other Steps
                  </span>
                )}
                {stepsByChapter.unassigned.map(({ step: st, originalIndex: idx }) => {
                  const isStepActive = selectedNodeType === 'step' && activeStepIndex === idx;
                  const isJustAdded = lastAddedStepId === st.id;
                  return (
                    <React.Fragment key={st.id || idx}>
                      {chapters.length === 0 && renderAddStepDivider(idx)}
                      <div
                        onClick={() => handleSelectStep(idx)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer group shadow-xs ${
                          isStepActive
                            ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-md'
                            : 'border-border-default hover:border-slate-300'
                        } ${
                          isJustAdded
                            ? 'animate-slide-in-step animate-highlight-glow ring-2 ring-brand-purple'
                            : ''
                        }`}
                      >
                        <div className="relative aspect-[16/9] w-full bg-zinc-900 overflow-hidden">
                          {(() => {
                            const stepScene =
                              scenes.find((s) => s.id === st.sceneId || (s as any)._id === st.sceneId) ||
                              currentScene;
                            const isVid =
                              Boolean(stepScene?.sourceAssetUrl?.match(/\.(mp4|webm|mov)$/i)) ||
                              stepScene?.sourceType === 'recording';
                            if (!stepScene?.sourceAssetUrl) {
                              return (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-white/40">
                                  Step Preview
                                </div>
                              );
                            }
                            if (isVid) {
                              return (
                                <div className="relative w-full h-full bg-black">
                                  <video
                                    src={stepScene.sourceAssetUrl}
                                    muted
                                    className="w-full h-full object-cover pointer-events-none"
                                  />
                                  <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-xs rounded px-1 py-0.5 text-[8px] font-bold text-white flex items-center gap-0.5">
                                    <Video className="w-2.5 h-2.5 text-brand-purple" />
                                    <span>VIDEO</span>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <img
                                src={stepScene.sourceAssetUrl}
                                alt={st.title}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            );
                          })()}
                          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                          <div className="absolute bottom-1.5 left-1.5 w-5 h-5 rounded-full bg-brand-purple text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                            {idx + 1}
                          </div>
                          <div className="absolute bottom-1 right-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenStepMenuIdx(openStepMenuIdx === idx ? null : idx);
                              }}
                              className="w-5 h-5 rounded bg-black/40 hover:bg-black/75 text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <MoreVertical className="w-3 h-3" />
                            </button>
                            {openStepMenuIdx === idx && (
                              <div className="absolute right-0 bottom-7 w-32 bg-white rounded-xl shadow-xl border border-border-default py-1 z-30 animate-fade-in text-left">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicateStep(idx);
                                    setOpenStepMenuIdx(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-heading hover:bg-light flex items-center gap-2 cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5 text-body" />
                                  Duplicate
                                </button>
                                {steps.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteStep(idx);
                                      setOpenStepMenuIdx(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                {chapters.length === 0 && steps.length > 0 && renderAddStepDivider(steps.length)}
              </div>
            )}

            {/* Empty Sidebar Notice */}
            {steps.length === 0 && chapters.length === 0 && (
              <div className="p-4 rounded-2xl bg-white border border-border-default text-center my-3 shadow-2xs">
                <p className="text-xs font-semibold text-heading mb-1">No steps yet</p>
                <p className="text-[11px] text-body">
                  Click + Add Step below or upload media on the canvas.
                </p>
              </div>
            )}

            {/* Always-accessible Add Step button at rail bottom */}
            <button
              type="button"
              onClick={() => handleOpenAddStepModal()}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-light border border-dashed border-border-input hover:border-brand-purple text-xs font-bold text-body hover:text-brand-purple flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs mt-3"
            >
              <Plus className="w-3.5 h-3.5 text-brand-purple" />
              <span>+ Add Step</span>
            </button>
          </div>
        </aside>
      )}

      {/* Center: Dotted Grid Canvas Stage */}
        <main
          className="flex-1 p-6 flex flex-col items-center justify-center overflow-auto relative select-none"
          style={{
            backgroundColor: THEME_COLORS.bgLight,
            backgroundImage: `radial-gradient(${THEME_COLORS.borderInput} 1.2px, transparent 1.2px)`,
            backgroundSize: '16px 16px',
          }}
        >
          {steps.length === 0 ? (
            <>
              {/* Hidden file input for direct uploads */}
              <input
                ref={directFileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleDirectUploadFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {/* Floating Top-Left Action Widget matching Reference UI */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-2 p-2 bg-white/95 backdrop-blur-md rounded-2xl border border-border-default shadow-md">
                <button
                  type="button"
                  onClick={() => handleOpenAddStepModal()}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 hover:text-brand-purple text-slate-500 flex items-center justify-center transition-all cursor-pointer"
                  title="Open Media Library"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => directFileInputRef.current?.click()}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 hover:text-brand-purple text-slate-500 flex items-center justify-center transition-all cursor-pointer"
                  title="Upload Image/Video"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Centered Browser Window Mockup matching Reference UI */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOverStage(true);
                }}
                onDragLeave={() => setIsDraggingOverStage(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingOverStage(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleDirectUploadFile(e.dataTransfer.files[0]);
                  }
                }}
                className={`w-full max-w-2xl bg-white rounded-2xl shadow-xl border overflow-hidden flex flex-col my-auto transition-all ${
                  isDraggingOverStage ? 'border-brand-purple ring-4 ring-brand-purple/10 scale-[0.99]' : 'border-border-default'
                }`}
              >
                {/* Browser Mockup Top Bar */}
                <div className="h-11 bg-light border-b border-border-default/80 px-4 flex items-center justify-between select-none">
                  {/* Traffic Light Dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>

                  {/* Centered Pill with Demo Name */}
                  <div className="bg-slate-100 text-gray-600 text-xs font-semibold px-6 py-1 rounded-full shadow-inner max-w-xs truncate">
                    {demo.name || 'New Demo'}
                  </div>

                  {/* Top Right Preview & Theme Icons */}
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <button
                      type="button"
                      onClick={handleOpenPreview}
                      className="hover:text-heading transition-colors p-1 cursor-pointer"
                      title="Preview demo"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="hover:text-heading transition-colors p-1 cursor-pointer"
                      title="Theme"
                    >
                      <Moon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mockup Inside Content */}
                <div className="py-16 px-8 flex flex-col items-center justify-center text-center">
                  <h1 className="text-2xl sm:text-[26px] font-bold text-heading tracking-[-0.025em] mb-2 leading-tight">
                    Create a Supademo in minutes
                  </h1>
                  <p className="text-[13px] sm:text-[14px] text-slate-500 mb-8 font-normal leading-relaxed">
                    Upload content or record your screen to get started.
                  </p>

                  {isUploadingMedia ? (
                    <div className="flex items-center gap-2.5 text-sm text-brand-purple font-semibold py-4">
                      <div className="w-5 h-5 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
                      <span>Uploading media to storage...</span>
                    </div>
                  ) : (
                    <div className="w-64 sm:w-72 flex flex-col gap-3">
                      {/* Button 1: Open Media Library */}
                      <button
                        type="button"
                        onClick={() => handleOpenAddStepModal()}
                        className="w-full py-2.5 px-4 rounded-xl border border-border-input bg-white text-heading hover:border-brand-purple hover:text-brand-purple text-xs sm:text-[13px] font-medium flex items-center justify-center gap-2.5 shadow-xs hover:shadow-sm transition-all cursor-pointer"
                      >
                        <LayoutGrid className="w-4 h-4 text-slate-500" />
                        <span>Open Media Library</span>
                      </button>

                      {/* Button 2: Upload Media */}
                      <button
                        type="button"
                        onClick={() => directFileInputRef.current?.click()}
                        className="w-full py-2.5 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-white" />
                        <span>Upload Media</span>
                      </button>

                      {/* Button 3: Record Cam & Screen */}
                      <button
                        type="button"
                        onClick={handleStartScreenRecording}
                        className="w-full py-2.5 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <Video className="w-4 h-4 text-white" />
                        <span>Record Cam & Screen</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Shortcut Button in Bottom Right */}
              <div className="absolute bottom-6 right-6 z-20">
                <button
                  type="button"
                  onClick={() => setIsShortcutModalOpen(true)}
                  className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-gray-600 hover:text-brand-purple hover:border-brand-purple hover:shadow-lg transition-all cursor-pointer ring-4 ring-black/[0.02]"
                  title="Shortcuts (⌘)"
                >
                  <Command className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : selectedNodeType === 'chapter' && selectedChapter ? (
            <>
              {/* Chapter Indicator Header above Mockup */}
              <div className="mb-3 text-center">
                <span className="text-xs font-bold text-brand-purple tracking-wider uppercase">
                  Chapter: {selectedChapter.title}
                </span>
              </div>

              {/* Browser Window Mockup Frame */}
              <div className="w-full max-w-5xl bg-white rounded-2xl border border-border-default shadow-2xl overflow-hidden relative flex flex-col">
                {/* Browser Header Bar matching Supademo */}
                <div className="h-10 bg-light border-b border-border-default px-4 flex items-center justify-between select-none shrink-0">
                  {/* Traffic light dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>

                  {/* Centered Demo Title Pill */}
                  <div className="flex-1 max-w-xs mx-auto flex items-center justify-center">
                    <div className="w-full bg-slate-100 rounded-full px-5 py-1 text-center text-xs font-semibold text-gray-600 truncate shadow-inner">
                      {demo.name || 'New Demo'}
                    </div>
                  </div>

                  {/* Right: Eye & Theme icons */}
                  <div className="flex items-center gap-2.5 text-body">
                    <button
                      type="button"
                      onClick={handleOpenPreview}
                      className="hover:text-heading transition-colors p-1 cursor-pointer"
                      title="Preview demo"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const nextTheme = selectedChapter.theme === 'dark' ? 'light' : 'dark';
                        handleUpdateChapter(selectedChapter.id, { theme: nextTheme });
                      }}
                      className="hover:text-heading transition-colors p-1 cursor-pointer"
                      title="Toggle dark/light theme"
                    >
                      <Moon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stage Viewport */}
                <div className="relative aspect-[16/10] w-full overflow-hidden select-none bg-dark">
                  <ChapterRenderer
                    chapter={selectedChapter}
                    mode="editor"
                    onUpdate={(patch: Partial<IDemoChapter>) => handleUpdateChapter(selectedChapter.id, patch)}
                    onAddButton={() => handleAddChapterButton(selectedChapter.id)}
                    steps={steps}
                    scenes={scenes}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Step Indicator Header above Mockup */}
              <div className="mb-3 text-center">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-body">
                  Step {activeStepIndex + 1}
                </span>
              </div>

              {/* Browser Window Mockup Frame */}
              <div className="w-full max-w-4xl bg-white rounded-2xl border border-border-default shadow-xl overflow-hidden relative flex flex-col">
                {/* Browser Header Bar */}
                <div className="h-10 bg-light border-b border-border-default px-4 flex items-center justify-between select-none shrink-0">
                  {/* Traffic light dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>

                  {/* Browser controls & URL bar */}
                  <div className="flex items-center gap-2 flex-1 max-w-md mx-4">
                    <div className="flex items-center gap-1 text-muted">
                      <ArrowLeft className="w-3 h-3" />
                      <ArrowRight className="w-3 h-3" />
                      <RotateCw className="w-3 h-3" />
                    </div>
                    <div className="flex-1 bg-white rounded-lg border border-border-default px-3 py-1 flex items-center gap-1.5 text-xs text-body">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="truncate">{currentScene?.slug || 'yaanna.lifestyle'}</span>
                      <span
                        className="ml-auto px-2 py-0.5 rounded bg-border-light text-[10px] font-bold text-brand-purple tracking-wider uppercase shrink-0"
                        title={`Canonical aspect ratio: ${canonicalRatioInfo.label} (${canonicalRatioInfo.width} × ${canonicalRatioInfo.height})`}
                      >
                        {canonicalRatioInfo.label}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => replaceFileInputRef.current?.click()}
                      className="px-2 py-0.5 rounded-md bg-white border border-border-input hover:border-brand-purple hover:text-brand-purple text-[10px] font-semibold text-gray-600 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      title="Replace media for this scene"
                    >
                      <Upload className="w-2.5 h-2.5" />
                      <span>Replace</span>
                    </button>
                  </div>

                  {/* Placement Hint or Hotspot coords */}
                  <div className="text-[11px] text-body">
                    {isPlacingHotspot ? (
                      <span className="text-brand-purple font-bold animate-pulse">
                        Click canvas to place hotspot
                      </span>
                    ) : (
                      <span className="font-mono text-muted">
                        {selectedHotspotElement
                          ? `X: ${selectedHotspotElement.position.x}% Y: ${selectedHotspotElement.position.y}%`
                          : 'Hotspot Ready'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Canvas Viewport with Canonical Aspect Ratio */}
                <div
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  style={{
                    aspectRatio: canonicalRatioInfo.cssRatio,
                  }}
                  className={`relative w-full max-h-[75vh] bg-dark overflow-hidden select-none transition-all duration-300 mx-auto ${
                    isPlacingHotspot || (activeTab === 'animation' && activeAnimationSection === 'zoomPan')
                      ? 'cursor-crosshair'
                      : 'cursor-default'
                  }`}
                >
                  {/* Virtual Camera Transformed Stage Container */}
                  <div
                    className="relative w-full h-full will-change-transform"
                    style={{
                      transform: studioCameraState.transform,
                      transformOrigin: studioCameraState.transformOrigin,
                      transition: studioCameraTransition,
                    }}
                  >
                    {/* Scene Media (Image or Video) */}
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
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={currentScene.sourceAssetUrl}
                          alt={currentScene.name}
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">
                        No scene image
                      </div>
                    )}

                    {/* Dim Backdrop Overlay if requested by active hotspot */}
                    {isBackdropActive && (
                      <div className="absolute inset-0 bg-black/50 z-20 pointer-events-none transition-opacity duration-300" />
                    )}

                    {/* Interactive Canvas Zoom & Pan Bounding Box Overlay */}
                    {Boolean(currentStep?.zoomPan?.enabled) && (
                      <ZoomPanBoundingBox
                        config={currentStep.zoomPan!}
                        containerRef={canvasRef}
                        isPreviewing={isStudioAnimationPreviewing}
                        onUpdateConfig={(updates) => {
                          const existing = currentStep?.zoomPan || DEFAULT_ZOOM_PAN_CONFIG;
                          handleUpdateStep({
                            zoomPan: {
                              ...existing,
                              ...updates,
                              enabled: true,
                            },
                          });
                        }}
                        onRemove={() => {
                          if (studioAnimationTimeoutRef.current) {
                            clearTimeout(studioAnimationTimeoutRef.current);
                            studioAnimationTimeoutRef.current = null;
                          }
                          setIsStudioAnimationPreviewing(false);
                          setStudioCameraScale(1.0);
                          setStudioCameraTransition('transform 300ms ease-out');
                          handleUpdateStep({
                            zoomPan: {
                              ...(currentStep?.zoomPan || DEFAULT_ZOOM_PAN_CONFIG),
                              enabled: false,
                            },
                          });
                        }}
                        onPreview={() => {
                          handlePreviewStudioAnimation();
                        }}
                      />
                    )}

                    {/* Render Hotspots for the active step */}
                    {stepElements.map((element) => {
                      if (element.type === 'hotspot' || element.hotspotConfig) {
                        return (
                          <HotspotMarker
                            key={element.id || element._id}
                            element={element}
                            isSelected={selectedElementId === element.id || selectedElementId === element._id}
                            isEditor={true}
                            stepNumber={activeStepIndex + 1}
                            totalSteps={steps.length}
                            containerRef={canvasRef}
                            onSelect={() => setSelectedElementId(element.id)}
                            onMove={(x, y) => handleMoveHotspot(element.id, x, y)}
                            onResize={(w, h, x, y) => handleResizeHotspot(element.id, w, h, x, y)}
                            onAction={(action, target) => handleHotspotAction(action, target)}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>


                  {/* duplicate removed */ false && (
                    <ZoomPanBoundingBox
                      config={currentStep.zoomPan!}
                      containerRef={canvasRef}
                      isPreviewing={isStudioAnimationPreviewing}
                      onUpdateConfig={(updates) => {
                        const existing = currentStep?.zoomPan || DEFAULT_ZOOM_PAN_CONFIG;
                        handleUpdateStep({
                          zoomPan: {
                            ...existing,
                            ...updates,
                            enabled: true,
                          },
                        });
                      }}
                      onRemove={() => {
                        if (studioAnimationTimeoutRef.current) {
                          clearTimeout(studioAnimationTimeoutRef.current);
                          studioAnimationTimeoutRef.current = null;
                        }
                        setIsStudioAnimationPreviewing(false);
                        setStudioCameraScale(1.0);
                        setStudioCameraTransition('transform 300ms ease-out');
                        handleUpdateStep({
                          zoomPan: {
                            ...(currentStep?.zoomPan || DEFAULT_ZOOM_PAN_CONFIG),
                            enabled: false,
                          },
                        });
                      }}
                      onPreview={() => {
                        handlePreviewStudioAnimation();
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </main>

        {/* Right Properties Inspector */}
        {steps.length > 0 && (
          selectedNodeType === 'chapter' && selectedChapter ? (
          <ChapterPropertiesPanel
            chapter={selectedChapter}
            steps={steps}
            chapters={chapters}
            scenes={scenes}
            onUpdate={(patch: Partial<IDemoChapter>) => handleUpdateChapter(selectedChapter.id, patch)}
            onDelete={() => handleDeleteChapter(selectedChapter.id)}
            onClose={() => setSelectedNodeType('step')}
            onSave={handleImmediateSave}
            isSaving={saveStatus === 'saving'}
          />
        ) : selectedHotspotElement ? (
          <HotspotPropertiesPanel
            element={selectedHotspotElement}
            steps={steps}
            scenes={scenes}
            chapters={chapters}
            onUpdate={(updates) => handleUpdateHotspot(selectedHotspotElement.id, updates)}
            onDelete={() => handleDeleteHotspot(selectedHotspotElement.id)}
            onClose={() => setSelectedElementId(null)}
            onSave={handleImmediateSave}
            isSaving={saveStatus === 'saving'}
          />
        ) : (
          <aside className="w-[360px] border-l border-border-default bg-white flex flex-col shrink-0">
            {/* Tabs Header */}
            <div className="flex border-b border-border-light px-1 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('step')}
                className={`flex-1 pb-2 text-[11.5px] transition-colors cursor-pointer border-b-2 text-center ${
                  activeTab === 'step'
                    ? 'font-semibold border-brand-purple text-brand-purple'
                    : 'font-medium border-transparent text-body hover:text-heading'
                }`}
              >
                Step
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('interactions')}
                className={`flex-1 pb-2 text-[11.5px] transition-colors cursor-pointer border-b-2 text-center ${
                  activeTab === 'interactions'
                    ? 'font-semibold border-brand-purple text-brand-purple'
                    : 'font-medium border-transparent text-body hover:text-heading'
                }`}
              >
                Interactions
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('animation')}
                className={`flex-1 pb-2 text-[11.5px] transition-colors cursor-pointer border-b-2 text-center ${
                  activeTab === 'animation'
                    ? 'font-semibold border-brand-purple text-brand-purple'
                    : 'font-medium border-transparent text-body hover:text-heading'
                }`}
              >
                Animation
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex-1 pb-2 text-[11.5px] transition-colors cursor-pointer border-b-2 text-center ${
                  activeTab === 'settings'
                    ? 'font-semibold border-brand-purple text-brand-purple'
                    : 'font-medium border-transparent text-body hover:text-heading'
                }`}
              >
                Settings
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeTab === 'step' && (
                <>
                  <Input
                    label="Step Heading"
                    value={currentStep?.tooltip?.title || currentStep?.title || ''}
                    onChange={(e) =>
                      handleUpdateStep({
                        title: e.target.value,
                        tooltip: { ...currentStep?.tooltip, title: e.target.value },
                      })
                    }
                  />

                  <Textarea
                    label="Guidance Message"
                    rows={3}
                    value={currentStep?.tooltip?.description || currentStep?.description || ''}
                    onChange={(e) =>
                      handleUpdateStep({
                        description: e.target.value,
                        tooltip: { ...currentStep?.tooltip, description: e.target.value },
                      })
                    }
                  />

                  {/* Scene Media Section */}
                  <div className="p-3 bg-light rounded-xl border border-border-default space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-medium text-heading">Scene Media</span>
                      <span className="text-[10px] font-semibold text-body uppercase tracking-[0.16em]">
                        {currentScene?.sourceType === 'recording' ? 'Video' : 'Screenshot'}
                      </span>
                    </div>

                    {currentScene?.sourceAssetUrl ? (
                      <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-border-default bg-dark">
                        {Boolean(currentScene.sourceAssetUrl.match(/\.(mp4|webm|mov)$/i)) ||
                        currentScene.sourceType === 'recording' ? (
                          <video
                            src={currentScene.sourceAssetUrl}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={currentScene.sourceAssetUrl}
                            alt={currentScene.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ) : null}

                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      onClick={() => replaceFileInputRef.current?.click()}
                      leftIcon={<Upload className="w-3.5 h-3.5" />}
                      isLoading={isUploadingMedia}
                    >
                      Replace Media / Upload
                    </Button>
                    <input
                      ref={replaceFileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleReplaceSceneMedia}
                      className="hidden"
                    />
                  </div>

                  <div className="p-3 bg-light rounded-xl border border-border-default text-xs text-body leading-relaxed">
                    Select a hotspot on the canvas or click <strong>Hotspot</strong> on the top bar to create and configure custom pointer callouts, area zones, animations, and navigation actions.
                  </div>
                </>
              )}

              {activeTab === 'interactions' && (
                <div className="space-y-4">
                  <Select
                    label="Trigger Event"
                    value={currentStep?.action || 'click'}
                    onChange={(e) => handleUpdateStep({ action: e.target.value as any })}
                    options={[
                      { value: 'click', label: 'Click Target Hotspot' },
                      { value: 'hover', label: 'Hover Over Target' },
                      { value: 'observe', label: 'Observe / Auto-Advance' },
                    ]}
                  />

                  <div className="p-3 bg-canvas rounded-xl border border-border-default space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-heading">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-brand-purple" />
                      <span>Action Pipeline</span>
                    </div>
                    <p className="text-[12px] text-body font-normal leading-relaxed">
                      Hotspots trigger interactive animations, step transitions, external URLs, and track analytics events.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'animation' && (
                <AnimationPropertiesPanel
                  currentStep={currentStep}
                  demoSettings={demo.settings || {}}
                  stepElements={stepElements}
                  activeSection={activeAnimationSection}
                  onSectionChange={setActiveAnimationSection}
                  onUpdateStep={(updates) => handleUpdateStep(updates)}
                  onUpdateDemoSettings={(patch) => {
                    const updated = {
                      ...demo,
                      settings: { ...demo.settings, ...patch },
                    };
                    setDemo(updated);
                    triggerAutosave(updated, scenes, steps, elements, interactions, chapters);
                  }}
                  onPreviewAnimation={handlePreviewStudioAnimation}
                  onResetCamera={handleResetStudioCamera}
                  isPreviewing={isStudioAnimationPreviewing}
                />
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  {/* Full Settings Modal Banner Button */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-purple/10 to-brand-purple/5 border border-brand-purple/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-heading">
                        <Settings className="w-4 h-4 text-brand-purple" />
                        <span>Walkthrough Settings</span>
                      </div>
                      <span className="text-[10px] font-semibold text-brand-purple bg-white px-2 py-0.5 rounded-md border border-brand-purple/20 shadow-2xs">
                        Full Modal
                      </span>
                    </div>
                    <p className="text-[11px] text-body leading-snug">
                      Configure Autoplay timing, audio arbitration, custom branding, and embed permissions.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => {
                        setSettingsModalTab('autoplay');
                        setIsSettingsModalOpen(true);
                      }}
                      leftIcon={<Settings className="w-3.5 h-3.5" />}
                    >
                      Open Full Settings Modal
                    </Button>
                  </div>

                  <Input
                    label="Demo Title"
                    value={demo.name}
                    onChange={(e) => handleUpdateDemoName(e.target.value)}
                  />

                  <Textarea
                    label="Demo Description"
                    rows={2}
                    value={demo.description || ''}
                    onChange={(e) => {
                      const updated = { ...demo, description: e.target.value };
                      setDemo(updated);
                      triggerAutosave(updated, scenes, steps, elements, interactions, chapters);
                    }}
                  />

                  {/* Quick Autoplay Settings in Settings Tab */}
                  <div className="p-3.5 bg-canvas rounded-2xl border border-border-default space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-heading block">Autoplay</span>
                        <span className="text-[11px] text-body">Play content without interaction</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={demo.settings?.autoplay ?? false}
                        onChange={(e) => {
                          const updated = {
                            ...demo,
                            settings: { ...demo.settings, autoplay: e.target.checked },
                          };
                          setDemo(updated);
                          triggerAutosave(updated, scenes, steps, elements, interactions, chapters);
                        }}
                        className="w-4 h-4 accent-brand-purple"
                      />
                    </div>

                    {demo.settings?.autoplay && (
                      <div className="pt-2 border-t border-border-light space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-700 font-semibold">Step Duration</span>
                            <span className="font-mono text-brand-purple font-bold">
                              {demo.settings?.autoplayDelay ?? 2000} ms
                            </span>
                          </div>
                          <input
                            type="range"
                            min="500"
                            max="10000"
                            step="250"
                            value={demo.settings?.autoplayDelay ?? 2000}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              const updated = {
                                ...demo,
                                settings: { ...demo.settings, autoplayDelay: val },
                              };
                              setDemo(updated);
                              triggerAutosave(updated, scenes, steps, elements, interactions, chapters);
                            }}
                            className="w-full h-1.5 bg-border-default rounded-lg appearance-none cursor-pointer accent-brand-purple"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-700 font-semibold">Loop Content</span>
                          <input
                            type="checkbox"
                            checked={Boolean(demo.settings?.loop || demo.settings?.autoplayLoop)}
                            onChange={(e) => {
                              const updated = {
                                ...demo,
                                settings: {
                                  ...demo.settings,
                                  loop: e.target.checked,
                                  autoplayLoop: e.target.checked,
                                },
                              };
                              setDemo(updated);
                              triggerAutosave(updated, scenes, steps, elements, interactions, chapters);
                            }}
                            className="w-4 h-4 accent-brand-purple"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="text-[12.5px] font-medium text-gray-700">
                      Show Progress Bar
                    </label>
                    <input
                      type="checkbox"
                      checked={demo.settings?.progressBar !== false}
                      onChange={(e) => {
                        const updated = {
                          ...demo,
                          settings: { ...demo.settings, progressBar: e.target.checked },
                        };
                        setDemo(updated);
                        triggerAutosave(updated, scenes, steps, elements, interactions, chapters);
                      }}
                      className="w-4 h-4 accent-brand-purple"
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        ))}
      </div>

      {/* Full Preview Modal using REAL DemoRuntimePlayer */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-sm">Live Preview Mode</span>
              <span className="text-xs text-white/50 font-normal hidden sm:inline">(Using Real Production Hotspot Runtime Engine)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-all duration-150 hover:scale-105 active:scale-95 shadow-sm"
            >
              Exit Preview
            </button>
          </div>

          <div className="flex-1 w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-preview-modal">
            <DemoRuntimePlayer
              key={`preview-${activeStepIndex}-${steps.length}-${JSON.stringify(demo.settings || {})}-${scenes.map((s) => s.sourceAssetUrl).join('|')}`}
              demoName={demo.name}
              demoSettings={demo.settings}
              scenes={scenes}
              steps={steps}
              chapters={chapters}
              elements={elements}
              interactions={interactions}
              initialStepIndex={activeStepIndex}
            />
          </div>
        </div>
      )}

      {/* Publish Success Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-border-default text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto mb-4">
              <Send className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-semibold text-heading mb-1 tracking-tight">
              Tour Published Successfully!
            </h3>
            <p className="text-xs text-body font-normal mb-5 leading-relaxed">
              Your interactive demo is live and ready to be shared with prospects or embedded into your website.
            </p>

            <div className="flex items-center gap-2 p-2 bg-light rounded-xl border border-border-default mb-5">
              <input
                type="text"
                readOnly
                value={publicShareLink}
                className="flex-1 bg-transparent text-xs font-mono text-heading outline-none px-2 select-all truncate"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-purple text-white text-xs font-semibold hover:bg-brand-purple-hover transition-colors cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border-input text-xs font-semibold text-heading hover:bg-light cursor-pointer"
              >
                Close
              </button>
              <a
                href={publicShareLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-purple-hover shadow-md"
              >
                <span>Open Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Add Step Modal (Upload Image/Video, Select Scene, or URL) */}
      <AddStepModal
        isOpen={isAddStepModalOpen}
        onClose={() => {
          setIsAddStepModalOpen(false);
          setAddStepContext(null);
        }}
        onConfirm={handleConfirmAddStep}
        defaultChapterId={
          addStepContext?.chapterId ||
          (selectedNodeType === 'chapter' ? selectedChapterId || undefined : currentStep?.chapterId)
        }
        nextStepNumber={steps.length + 1}
        scenes={scenes}
        chapters={chapters}
        demo={demo}
      />

      {/* Aspect Ratio Warning Modal for Direct Editor Uploads and Replace Media */}
      {editorAspectWarning && (
        <AspectRatioWarningModal
          isOpen={Boolean(editorAspectWarning)}
          currentInfo={editorAspectWarning.currentInfo}
          newInfo={editorAspectWarning.newInfo}
          onCancel={handleCancelEditorAspectWarning}
          onChangeAspectRatio={handleChangeEditorAspectRatio}
          onCropToMatch={
            editorAspectWarning.file.type.startsWith('image/')
              ? handleCropEditorToMatch
              : undefined
          }
          isProcessing={isEditorCropping}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      {isShortcutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-border-default w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                  <Command className="w-4 h-4" />
                </div>
                <h3 className="text-[16px] font-semibold text-heading tracking-tight">Studio Shortcuts</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShortcutModalOpen(false)}
                className="text-muted hover:text-heading p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-light">
                <span className="text-gray-600 font-medium">Open Media Library</span>
                <kbd className="px-2 py-1 rounded-md bg-white border border-border-default font-mono font-semibold text-heading shadow-2xs">
                  ⌘ + M
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-light">
                <span className="text-gray-600 font-medium">Upload Media</span>
                <kbd className="px-2 py-1 rounded-md bg-white border border-border-default font-mono font-semibold text-heading shadow-2xs">
                  ⌘ + U
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-light">
                <span className="text-gray-600 font-medium">Record Screen</span>
                <kbd className="px-2 py-1 rounded-md bg-white border border-border-default font-mono font-semibold text-heading shadow-2xs">
                  ⌘ + R
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-light">
                <span className="text-gray-600 font-medium">Preview Demo</span>
                <kbd className="px-2 py-1 rounded-md bg-white border border-border-default font-mono font-semibold text-heading shadow-2xs">
                  Space
                </kbd>
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setIsShortcutModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supademo-Style Full Demo Settings Modal (Appearance, Autoplay, Branding, Sharing) */}
      <DemoSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={demo.settings || {}}
        initialTab={settingsModalTab}
        onSave={async (updatedSettings) => {
          const updated = {
            ...demo,
            settings: {
              ...(demo.settings || {}),
              ...updatedSettings,
            },
          };
          setDemo(updated);
          await saveImmediately(
            updated,
            scenes,
            steps,
            elements,
            interactions,
            chapters
          );
        }}
      />
    </div>
  );
};
