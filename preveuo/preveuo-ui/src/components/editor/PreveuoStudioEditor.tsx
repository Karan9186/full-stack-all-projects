'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  FullDemoData,
  IDemoScene,
  IDemoStep,
  IDemoElement,
  IDemoInteraction,
  IDemoChapter,
} from '@/types/demo';
import { DemoRuntimePlayer } from '@/components/runtime/DemoRuntimePlayer';
import { HotspotMarker, HotspotPropertiesPanel } from '@/components/demos/hotspots';
import { ChapterRenderer, ChapterPropertiesPanel } from '@/components/demos/chapters';
import { AddStepModal } from '@/components/demos/steps/AddStepModal';
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
} from 'lucide-react';

interface PreveuoStudioEditorProps {
  initialData: FullDemoData;
  onSave?: (data: FullDemoData) => Promise<void>;
}

export const PreveuoStudioEditor: React.FC<PreveuoStudioEditorProps> = ({
  initialData,
}) => {
  const [demo, setDemo] = useState(initialData.demo);
  const [scenes, setScenes] = useState<IDemoScene[]>(() =>
    initialData.scenes.map((s) => ({
      ...s,
      sourceAssetUrl: s.sourceAssetUrl?.includes('1551288049-bebda4e38f71')
        ? '/yaanna-webpage.png'
        : s.sourceAssetUrl,
    }))
  );
  const [steps, setSteps] = useState<IDemoStep[]>(initialData.steps);
  const [elements, setElements] = useState<IDemoElement[]>(initialData.elements);
  const [interactions, setInteractions] = useState<IDemoInteraction[]>(initialData.interactions);
  const [chapters, setChapters] = useState<IDemoChapter[]>(initialData.chapters || []);

  // Node selection: 'step' or 'chapter'
  const [selectedNodeType, setSelectedNodeType] = useState<'step' | 'chapter'>('step');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    (initialData.chapters && initialData.chapters.length > 0) ? initialData.chapters[0].id : null
  );
  const [openChapterMenuId, setOpenChapterMenuId] = useState<string | null>(null);

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'step' | 'interactions' | 'settings'>('step');

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
      return el.id === currentStep?.targetElementId || el._id === currentStep?.targetElementId;
    });
  }, [elements, currentStep]);

  // Selected Hotspot element
  const selectedHotspotElement = useMemo(() => {
    if (!selectedElementId) return null;
    return elements.find(
      (el) =>
        (el.id === selectedElementId || el._id === selectedElementId) &&
        (el.type === 'hotspot' || el.hotspotConfig)
    ) || null;
  }, [elements, selectedElementId]);

  // Auto-select first hotspot of active step on mount or step change if none selected
  useEffect(() => {
    if (!selectedElementId && stepElements.length > 0) {
      const firstHotspot = stepElements.find((el) => el.type === 'hotspot' || el.hotspotConfig);
      if (firstHotspot) {
        setSelectedElementId(firstHotspot.id);
      }
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
        try {
          const res = await fetch(`/api/demos/${demo.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: updatedDemo.name,
              description: updatedDemo.description,
              settings: updatedDemo.settings,
              scenes: updatedScenes,
              steps: updatedSteps,
              elements: updatedElements,
              interactions: updatedInteractions,
              chapters: updatedChapters,
            }),
          });
          if (res.ok) {
            setSaveStatus('saved');
          } else {
            setSaveStatus('error');
          }
        } catch {
          setSaveStatus('error');
        }
      }, 1000);
    },
    [demo, scenes, steps, elements, interactions, chapters]
  );

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // Immediate Save for manual button press
  const handleImmediateSave = async () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/demos/${demo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: demo.name,
          description: demo.description,
          settings: demo.settings,
          scenes,
          steps,
          elements,
          interactions,
          chapters,
        }),
      });
      if (res.ok) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
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

  // Select Step
  const handleSelectStep = (idx: number) => {
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
  }) => {
    let targetSceneId = payload.existingSceneId;
    let nextScenes = [...scenes];

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
        viewport: { width: 1440, height: 900, aspectRatio: '16:10' },
        metadata: {},
      };
      nextScenes.push(newScene);
      setScenes(nextScenes);
      targetSceneId = newSceneId;
    }

    const stepNumber = steps.length + 1;
    const newElementId = `el_${Date.now()}`;
    const newStepId = `st_${Date.now()}`;

    // Create starter hotspot element matching reference UI
    const newHotspot: IDemoElement = {
      id: newElementId,
      demoId: demo.id,
      sceneId: targetSceneId,
      stepId: newStepId,
      type: 'hotspot',
      name: `${payload.title || `Step ${stepNumber}`} Hotspot`,
      position: { x: 50, y: 45, width: 28, height: 18 },
      style: {
        backgroundColor: '#5B5CE2',
        color: '#ffffff',
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
          background: '#5B5CE2',
          textColor: '#ffffff',
          backdrop: false,
          borderRadius: 'rounded',
          width: 'medium',
          animation: 'ping',
        },
        visibility: 'always',
        navigation: {
          showNext: true,
          nextButton: {
            enabled: true,
            text: '',
            background: 'rgba(255, 255, 255, 0.22)',
            textColor: '#ffffff',
            action: 'nextStep',
          },
          backButton: {
            enabled: false,
            text: 'Back',
            background: '#ffffff',
            textColor: '#6b7280',
            action: 'previousStep',
          },
        },
      },
      visible: true,
      order: elements.length,
    };

    const insertIdx = addStepContext?.insertIndex;
    const assignedChapterId =
      payload.chapterId ||
      addStepContext?.chapterId ||
      (selectedNodeType === 'chapter' ? selectedChapterId || undefined : currentStep?.chapterId);

    const newStep: IDemoStep = {
      id: newStepId,
      demoId: demo.id,
      sceneId: targetSceneId,
      chapterId: assignedChapterId,
      order: typeof insertIdx === 'number' ? insertIdx : steps.length,
      title: payload.title || `Step ${stepNumber}`,
      description: 'Interact with the highlighted hotspot to proceed.',
      targetElementId: newElementId,
      action: 'click',
      tooltip: {
        title: payload.title || `Step ${stepNumber}`,
        description: 'Add some hotspot text here.',
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

    const nextElements = [...elements, newHotspot];
    let nextSteps = [...steps];
    const targetIdx = typeof insertIdx === 'number' ? insertIdx : steps.length;
    nextSteps.splice(targetIdx, 0, newStep);

    // Reindex order
    nextSteps = nextSteps.map((st, i) => ({ ...st, order: i }));

    setElements(nextElements);
    setSteps(nextSteps);
    setSelectedNodeType('step');
    setActiveStepIndex(targetIdx);
    setSelectedElementId(newElementId);

    // Automatically sync scene
    const scIdx = nextScenes.findIndex(
      (sc) => sc.id === targetSceneId || (sc as any)._id === targetSceneId
    );
    if (scIdx !== -1) {
      setActiveSceneIndex(scIdx);
    }

    triggerAutosave(demo, nextScenes, nextSteps, nextElements, interactions, chapters);
  };

  // Duplicate Step
  const handleDuplicateStep = (idx: number) => {
    const sourceStep = steps[idx];
    if (!sourceStep) return;

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
    };

    const nextSteps = [...steps];
    nextSteps.splice(idx + 1, 0, clonedStep);

    setElements(nextElements);
    setSteps(nextSteps);
    setActiveStepIndex(idx + 1);
    setSelectedElementId(newElementId);

    triggerAutosave(demo, scenes, nextSteps, nextElements, interactions, chapters);
  };

  // Delete Step
  const handleDeleteStep = (idx: number) => {
    if (steps.length <= 1) return;
    const stepToDelete = steps[idx];
    const nextSteps = steps.filter((_, i) => i !== idx);
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

    if (isPlacingHotspot) {
      // Create new hotspot at clicked point
      const newElementId = `el_${Date.now()}`;
      const newHotspot: IDemoElement = {
        id: newElementId,
        demoId: demo.id,
        sceneId: currentScene?.id || '',
        stepId: currentStep?.id,
        type: 'hotspot',
        name: `Hotspot #${elements.length + 1}`,
        position: { x: clampedX, y: clampedY, width: 28, height: 18 },
        style: {
          backgroundColor: '#5B5CE2',
          color: '#ffffff',
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
            background: '#5B5CE2',
            textColor: '#ffffff',
            backdrop: false,
            borderRadius: 'rounded',
            width: 'medium',
            animation: 'ping',
          },
          visibility: 'always',
          navigation: {
            showNext: true,
            nextButton: {
              enabled: true,
              text: '',
              background: 'rgba(255, 255, 255, 0.22)',
              textColor: '#ffffff',
              action: 'nextStep',
            },
            backButton: {
              enabled: false,
              text: 'Back',
              background: '#ffffff',
              textColor: '#6b7280',
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
    setElements(nextElements);
    setSelectedElementId(null);
    triggerAutosave(demo, scenes, steps, nextElements, interactions, chapters);
  };

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

  // Publish Demo Flow
  const handlePublish = async () => {
    try {
      setIsPublishing(true);
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

  // Helper to render "+ Add Step" dashed divider
  const renderAddStepDivider = (insertIndex: number) => (
    <div className="relative py-2 flex items-center justify-center group select-none">
      <div className="absolute inset-x-3 h-px border-t border-dashed border-[#d1d5db] group-hover:border-[#5B5CE2] transition-colors" />
      <button
        type="button"
        onClick={() => handleAddStep(insertIndex)}
        className="relative z-10 px-3 py-0.5 rounded-full bg-[#fafafc] hover:bg-white text-[11px] font-bold text-[#6b7280] group-hover:text-[#5B5CE2] transition-all cursor-pointer shadow-xs border border-transparent hover:border-[#5B5CE2]/30"
      >
        + Add Step
      </button>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-[#0f0f1a] font-sans overflow-hidden select-none">
      {/* Top Studio Navbar */}
      <header className="h-14 border-b border-[#e5e7eb] bg-white px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/demos">
            <IconButton variant="secondary" size="sm" aria-label="Back to Demos">
              <ArrowLeft className="w-4 h-4 text-[#0f0f1a]" />
            </IconButton>
          </Link>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={demo.name}
              onChange={(e) => handleUpdateDemoName(e.target.value)}
              className="text-[14px] sm:text-[15px] font-bold text-[#0f0f1a] bg-transparent border-b border-transparent hover:border-[#d1d5db] focus:border-[#5B5CE2] focus:outline-none px-1 py-0.5 transition-colors max-w-xs sm:max-w-md"
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

        {/* Action Toolbar matching Reference UI */}
        <div className="flex items-center gap-2">
          {/* Hotspot Toggle */}
          <button
            type="button"
            onClick={() => setIsPlacingHotspot((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isPlacingHotspot
                ? 'bg-[#5B5CE2] text-white shadow-sm ring-2 ring-[#5B5CE2]/40'
                : 'bg-white hover:bg-[#f8f8fc] text-[#0f0f1a] border border-[#d1d5db]'
            }`}
            title="Click to place a new hotspot on canvas"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Hotspot</span>
          </button>

          {/* Blur & Annotate */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-[#f8f8fc] text-[#0f0f1a] border border-[#d1d5db] transition-colors cursor-pointer"
          >
            <Droplets className="w-3.5 h-3.5 text-[#6b7280]" />
            <span>Blur & Annotate</span>
          </button>

          {/* Voice... */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-[#f8f8fc] text-[#0f0f1a] border border-[#d1d5db] transition-colors cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-[#6b7280]" />
            <span>Voice...</span>
          </button>

          <div className="h-5 w-px bg-[#e5e7eb] mx-1" />

          {/* Preview Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewOpen(true)}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Preview
          </Button>

          {/* Publish Button */}
          <Button
            variant="primary"
            size="sm"
            isLoading={isPublishing}
            onClick={handlePublish}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            {demo.status === 'published' ? 'Update & Publish' : 'Publish'}
          </Button>
        </div>
      </header>

      {/* Main Studio Body (3 Columns) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Rail: Chapters & Steps */}
        <aside className="w-64 sm:w-72 border-r border-[#e5e7eb] bg-[#fafafc] flex flex-col shrink-0 overflow-y-auto">
          {/* Add Step & Add Chapter Action Buttons */}
          <div className="p-3 border-b border-[#f0f0f4] grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleOpenAddStepModal()}
              className="py-2.5 px-2 rounded-xl bg-white hover:bg-[#f8f8fc] border border-[#e5e7eb] flex items-center justify-center gap-1.5 transition-all cursor-pointer group shadow-xs hover:border-[#5B5CE2] hover:shadow-sm"
              title="Add step with image or video"
            >
              <div className="w-6 h-6 rounded-lg bg-[#5B5CE2]/10 group-hover:bg-[#5B5CE2] flex items-center justify-center transition-colors">
                <Plus className="w-3.5 h-3.5 text-[#5B5CE2] group-hover:text-white" />
              </div>
              <span className="text-xs font-bold text-[#0f0f1a] group-hover:text-[#5B5CE2]">
                + Add Step
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleAddChapter()}
              className="py-2.5 px-2 rounded-xl bg-white hover:bg-[#f8f8fc] border border-[#e5e7eb] flex items-center justify-center gap-1.5 transition-all cursor-pointer group shadow-xs hover:border-[#5B5CE2] hover:shadow-sm"
              title="Add new chapter"
            >
              <div className="w-6 h-6 rounded-lg bg-[#5B5CE2]/10 group-hover:bg-[#5B5CE2] flex items-center justify-center transition-colors">
                <FolderPlus className="w-3.5 h-3.5 text-[#5B5CE2] group-hover:text-white" />
              </div>
              <span className="text-xs font-bold text-[#0f0f1a] group-hover:text-[#5B5CE2]">
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
                        ? 'border-[#5B5CE2] bg-white ring-2 ring-[#5B5CE2]/30 shadow-md'
                        : 'border-[#e5e7eb] bg-white hover:border-[#cbd5e1]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-[#5B5CE2]/10 text-[#5B5CE2] flex items-center justify-center shrink-0">
                          <BookOpen className="w-3.5 h-3.5" />
                        </span>
                        <div className="min-w-0">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#5B5CE2]">
                            Chapter {chIdx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-[#0f0f1a] truncate">
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
                          className="w-6 h-6 rounded-md hover:bg-[#f0f0f4] text-[#6b7280] hover:text-[#0f0f1a] flex items-center justify-center transition-colors cursor-pointer"
                          title="Chapter options"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {openChapterMenuId === ch.id && (
                          <div className="absolute right-0 top-7 w-36 bg-white rounded-xl shadow-xl border border-[#e5e7eb] py-1 z-30 animate-fade-in text-left">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateChapter(ch.id);
                                setOpenChapterMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-[#0f0f1a] hover:bg-[#f8f8fc] flex items-center gap-2 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5 text-[#6b7280]" />
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
                  <div className="pl-3 border-l-2 border-[#e5e7eb] space-y-1.5">
                    {chapterStepItems.map(({ step: st, originalIndex: idx }) => {
                      const isStepActive = selectedNodeType === 'step' && activeStepIndex === idx;
                      return (
                        <div
                          key={st.id || idx}
                          onClick={() => handleSelectStep(idx)}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer group shadow-xs ${
                            isStepActive
                              ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/40 shadow-md'
                              : 'border-[#e5e7eb] hover:border-[#cbd5e1]'
                          }`}
                        >
                          <div className="relative aspect-[16/9] w-full bg-[#1e1e2d] overflow-hidden">
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
                                      <Video className="w-2.5 h-2.5 text-[#5B5CE2]" />
                                      <span>VIDEO</span>
                                    </div>
                                  </div>
                                );
                              }
                              return (
                                <img
                                  src={
                                    stepScene.sourceAssetUrl.includes('1551288049-bebda4e38f71')
                                      ? '/yaanna-webpage.png'
                                      : stepScene.sourceAssetUrl
                                  }
                                  alt={st.title}
                                  className="w-full h-full object-cover pointer-events-none"
                                />
                              );
                            })()}
                            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                            <div className="absolute bottom-1.5 left-1.5 w-5 h-5 rounded-full bg-[#5B5CE2] text-white flex items-center justify-center text-[10px] font-bold shadow-md">
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
                                <div className="absolute right-0 bottom-7 w-32 bg-white rounded-xl shadow-xl border border-[#e5e7eb] py-1 z-30 animate-fade-in text-left">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDuplicateStep(idx);
                                      setOpenStepMenuIdx(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-[#0f0f1a] hover:bg-[#f8f8fc] flex items-center gap-2 cursor-pointer"
                                  >
                                    <Copy className="w-3 h-3 text-[#6b7280]" />
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
                      className="w-full py-1.5 px-2 rounded-lg bg-white hover:bg-[#f8f8fc] border border-dashed border-[#d1d5db] hover:border-[#5B5CE2] text-[11px] font-semibold text-[#6b7280] hover:text-[#5B5CE2] flex items-center justify-center gap-1 transition-all cursor-pointer"
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
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280] px-1">
                    Other Steps
                  </span>
                )}
                {stepsByChapter.unassigned.map(({ step: st, originalIndex: idx }) => {
                  const isStepActive = selectedNodeType === 'step' && activeStepIndex === idx;
                  return (
                    <React.Fragment key={st.id || idx}>
                      {chapters.length === 0 && renderAddStepDivider(idx)}
                      <div
                        onClick={() => handleSelectStep(idx)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer group shadow-xs ${
                          isStepActive
                            ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/40 shadow-md'
                            : 'border-[#e5e7eb] hover:border-[#cbd5e1]'
                        }`}
                      >
                        <div className="relative aspect-[16/9] w-full bg-[#1e1e2d] overflow-hidden">
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
                                    <Video className="w-2.5 h-2.5 text-[#5B5CE2]" />
                                    <span>VIDEO</span>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <img
                                src={
                                  stepScene.sourceAssetUrl.includes('1551288049-bebda4e38f71')
                                    ? '/yaanna-webpage.png'
                                    : stepScene.sourceAssetUrl
                                }
                                alt={st.title}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            );
                          })()}
                          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                          <div className="absolute bottom-1.5 left-1.5 w-5 h-5 rounded-full bg-[#5B5CE2] text-white flex items-center justify-center text-[10px] font-bold shadow-md">
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
                              <div className="absolute right-0 bottom-7 w-32 bg-white rounded-xl shadow-xl border border-[#e5e7eb] py-1 z-30 animate-fade-in text-left">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicateStep(idx);
                                    setOpenStepMenuIdx(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-[#0f0f1a] hover:bg-[#f8f8fc] flex items-center gap-2 cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5 text-[#6b7280]" />
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
                {chapters.length === 0 && renderAddStepDivider(steps.length)}
              </div>
            )}

            {/* Always-accessible Add Step button at rail bottom */}
            <button
              type="button"
              onClick={() => handleOpenAddStepModal()}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#f8f8fc] border border-dashed border-[#d1d5db] hover:border-[#5B5CE2] text-xs font-bold text-[#6b7280] hover:text-[#5B5CE2] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs mt-3"
            >
              <Plus className="w-3.5 h-3.5 text-[#5B5CE2]" />
              <span>+ Add Step</span>
            </button>
          </div>
        </aside>

        {/* Center: Dotted Grid Canvas Stage */}
        <main
          className="flex-1 p-6 flex flex-col items-center justify-center overflow-auto relative select-none"
          style={{
            backgroundColor: '#f8f8fd',
            backgroundImage: 'radial-gradient(#d1d5db 1.2px, transparent 1.2px)',
            backgroundSize: '16px 16px',
          }}
        >
          {selectedNodeType === 'chapter' && selectedChapter ? (
            <>
              {/* Chapter Indicator Header above Mockup */}
              <div className="mb-3 text-center">
                <span className="text-xs font-bold text-[#5B5CE2] tracking-wider uppercase">
                  Chapter: {selectedChapter.title}
                </span>
              </div>

              {/* Browser Window Mockup Frame */}
              <div className="w-full max-w-5xl bg-white rounded-2xl border border-[#e5e7eb] shadow-2xl overflow-hidden relative flex flex-col">
                {/* Browser Header Bar matching Supademo */}
                <div className="h-10 bg-[#f4f4f8] border-b border-[#e5e7eb] px-4 flex items-center justify-between select-none shrink-0">
                  {/* Traffic light dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>

                  {/* Centered Demo Title Pill */}
                  <div className="flex-1 max-w-xs mx-auto flex items-center justify-center">
                    <div className="w-full bg-[#e8eaf0] rounded-full px-5 py-1 text-center text-xs font-semibold text-[#4b5563] truncate shadow-inner">
                      {demo.name || 'New Demo'}
                    </div>
                  </div>

                  {/* Right: Eye & Theme icons */}
                  <div className="flex items-center gap-2.5 text-[#6b7280]">
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="hover:text-[#0f0f1a] transition-colors p-1 cursor-pointer"
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
                      className="hover:text-[#0f0f1a] transition-colors p-1 cursor-pointer"
                      title="Toggle dark/light theme"
                    >
                      <Moon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stage Viewport */}
                <div className="relative aspect-[16/10] w-full overflow-hidden select-none bg-[#191b22]">
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
                <span className="text-xs font-bold text-[#6b7280] tracking-wider uppercase">
                  Step {activeStepIndex + 1}
                </span>
              </div>

              {/* Browser Window Mockup Frame */}
              <div className="w-full max-w-4xl bg-white rounded-2xl border border-[#e5e7eb] shadow-xl overflow-hidden relative flex flex-col">
                {/* Browser Header Bar */}
                <div className="h-10 bg-[#f4f4f8] border-b border-[#e5e7eb] px-4 flex items-center justify-between select-none shrink-0">
                  {/* Traffic light dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>

                  {/* Browser controls & URL bar */}
                  <div className="flex items-center gap-2 flex-1 max-w-md mx-4">
                    <div className="flex items-center gap-1 text-[#9ca3af]">
                      <ArrowLeft className="w-3 h-3" />
                      <ArrowRight className="w-3 h-3" />
                      <RotateCw className="w-3 h-3" />
                    </div>
                    <div className="flex-1 bg-white rounded-lg border border-[#e5e7eb] px-3 py-1 flex items-center gap-1.5 text-xs text-[#6b7280]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="truncate">{currentScene?.slug || 'yaanna.lifestyle'}</span>
                    </div>
                  </div>

                  {/* Placement Hint or Hotspot coords */}
                  <div className="text-[11px] text-[#6b7280]">
                    {isPlacingHotspot ? (
                      <span className="text-[#5B5CE2] font-bold animate-pulse">
                        Click canvas to place hotspot
                      </span>
                    ) : (
                      <span className="font-mono text-[#9ca3af]">
                        {selectedHotspotElement
                          ? `X: ${selectedHotspotElement.position.x}% Y: ${selectedHotspotElement.position.y}%`
                          : 'Hotspot Ready'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Canvas Viewport */}
                <div
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className={`relative aspect-[16/10] w-full bg-[#0a0a10] overflow-hidden select-none ${
                    isPlacingHotspot ? 'cursor-crosshair' : 'cursor-default'
                  }`}
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
                        src={
                          currentScene.sourceAssetUrl.includes('1551288049-bebda4e38f71')
                            ? '/yaanna-webpage.png'
                            : currentScene.sourceAssetUrl
                        }
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

                  {/* Render Hotspots for the active step */}
                  {stepElements.map((element) => {
                    if (element.type === 'hotspot' || element.hotspotConfig) {
                      return (
                        <HotspotMarker
                          key={element.id || element._id}
                          element={element}
                          isSelected={selectedElementId === element.id || selectedElementId === element._id}
                          isEditor={true}
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
              </div>
            </>
          )}
        </main>

        {/* Right Properties Inspector */}
        {selectedNodeType === 'chapter' && selectedChapter ? (
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
          <aside className="w-80 border-l border-[#e5e7eb] bg-white flex flex-col shrink-0">
            {/* Tabs Header */}
            <div className="flex border-b border-[#f0f0f4] px-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('step')}
                className={`flex-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'step'
                    ? 'border-[#5B5CE2] text-[#5B5CE2]'
                    : 'border-transparent text-[#6b7280] hover:text-[#0f0f1a]'
                }`}
              >
                Step Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('interactions')}
                className={`flex-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'interactions'
                    ? 'border-[#5B5CE2] text-[#5B5CE2]'
                    : 'border-transparent text-[#6b7280] hover:text-[#0f0f1a]'
                }`}
              >
                Interactions
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'settings'
                    ? 'border-[#5B5CE2] text-[#5B5CE2]'
                    : 'border-transparent text-[#6b7280] hover:text-[#0f0f1a]'
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

                  <div className="p-3 bg-[#f8f8fc] rounded-xl border border-[#e5e7eb] text-xs text-[#6b7280] leading-relaxed">
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

                  <div className="p-3 bg-[#fafafc] rounded-xl border border-[#e5e7eb] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0f0f1a]">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#5B5CE2]" />
                      <span>Action Pipeline</span>
                    </div>
                    <p className="text-[12px] text-[#6b7280] leading-relaxed">
                      Hotspots trigger interactive animations, step transitions, external URLs, and track analytics events.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
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

                  <div className="flex items-center justify-between pt-2">
                    <label className="text-xs font-bold text-[#0f0f1a]">
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
                      className="w-4 h-4 accent-[#5B5CE2]"
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Full Preview Modal using REAL DemoRuntimePlayer */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-fade-in">
          <div className="flex items-center justify-between pb-3 text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="font-bold text-sm">Live Preview Mode</span>
              <span className="text-xs text-white/50">(Using Real Production Hotspot Runtime Engine)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
            >
              Exit Preview
            </button>
          </div>

          <div className="flex-1 w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <DemoRuntimePlayer
              demoName={demo.name}
              demoSettings={demo.settings}
              scenes={scenes}
              steps={steps}
              chapters={chapters}
              elements={elements}
              interactions={interactions}
            />
          </div>
        </div>
      )}

      {/* Publish Success Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#e5e7eb] text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#5B5CE2]/10 text-[#5B5CE2] flex items-center justify-center mx-auto mb-4">
              <Send className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-extrabold text-[#0f0f1a] mb-1">
              Tour Published Successfully!
            </h3>
            <p className="text-xs text-[#6b7280] mb-5">
              Your interactive demo is live and ready to be shared with prospects or embedded into your website.
            </p>

            <div className="flex items-center gap-2 p-2 bg-[#f8f8fc] rounded-xl border border-[#e5e7eb] mb-5">
              <input
                type="text"
                readOnly
                value={publicShareLink}
                className="flex-1 bg-transparent text-xs font-mono text-[#0f0f1a] outline-none px-2 select-all truncate"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#5B5CE2] text-white text-xs font-bold hover:bg-[#4a4bd4] transition-colors cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#d1d5db] text-xs font-bold text-[#0f0f1a] hover:bg-[#f8f8fc]"
              >
                Close
              </button>
              <a
                href={publicShareLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5B5CE2] text-white text-xs font-bold hover:bg-[#4a4bd4] shadow-md"
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
      />
    </div>
  );
};
