'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  IDemoChapter,
  IDemoStep,
  IDemoScene,
  ChapterButtonAction,
  ChapterButton,
} from '@/types/demo';
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Lock,
  Play,
  Pencil,
  Trash2,
  Check,
  ImageIcon,
} from 'lucide-react';

interface ChapterRendererProps {
  chapter: IDemoChapter;
  mode?: 'editor' | 'runtime';
  onUpdate?: (updates: Partial<IDemoChapter>) => void;
  onAction?: (action: ChapterButtonAction) => void;
  onSelectButton?: (buttonId: string) => void;
  onAddButton?: () => void;
  selectedButtonId?: string | null;
  steps?: IDemoStep[];
  scenes?: IDemoScene[];
}

export const ChapterRenderer: React.FC<ChapterRendererProps> = ({
  chapter,
  mode = 'runtime',
  onUpdate,
  onAction,
  onSelectButton,
  onAddButton,
  selectedButtonId,
  steps = [],
  scenes = [],
}) => {
  const isEditor = mode === 'editor';

  // Theme & Layout configs
  const theme = chapter.theme || 'dark';
  const layout = chapter.layout || 'left';
  const opacity = typeof chapter.opacity === 'number' ? chapter.opacity : 24;
  const blur = chapter.blur ?? false;
  const blurAmount = typeof chapter.blurAmount === 'number' ? chapter.blurAmount : 8;
  const logoConfig = chapter.logo || { visible: true, altText: 'preveuo' };
  const coverConfig = chapter.cover || { type: 'steps' };
  const chapterType = chapter.type || 'default';

  // Inline editing states & local buffers to eliminate UI fluctuation and parent re-render lag
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(chapter.title || '');

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [localDesc, setLocalDesc] = useState(chapter.description || '');

  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [localLogoText, setLocalLogoText] = useState(logoConfig.altText || 'preveuo');

  const [editingBtnId, setEditingBtnId] = useState<string | null>(null);
  const [localBtnLabel, setLocalBtnLabel] = useState('');

  // Keep local buffers synced with props when not actively editing
  useEffect(() => {
    if (!isEditingTitle) {
      setLocalTitle(chapter.title || '');
    }
  }, [chapter.title, isEditingTitle]);

  useEffect(() => {
    if (!isEditingDesc) {
      setLocalDesc(chapter.description || '');
    }
  }, [chapter.description, isEditingDesc]);

  useEffect(() => {
    if (!isEditingLogo) {
      setLocalLogoText(logoConfig.altText || 'preveuo');
    }
  }, [logoConfig.altText, isEditingLogo]);

  // Form / Password state for runtime
  const [formEmail, setFormEmail] = useState('');
  const [formName, setFormName] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Commit handlers: fires onUpdate once on blur/save instead of on every keystroke
  const handleCommitTitle = () => {
    setIsEditingTitle(false);
    const trimmed = localTitle.trim();
    if (trimmed !== (chapter.title || '')) {
      onUpdate?.({ title: trimmed || 'Create a Preveuo in minutes' });
    }
  };

  const handleCommitDesc = () => {
    setIsEditingDesc(false);
    const trimmed = localDesc.trim();
    if (trimmed !== (chapter.description || '')) {
      onUpdate?.({ description: trimmed });
    }
  };

  const handleCommitLogo = () => {
    setIsEditingLogo(false);
    const trimmed = localLogoText.trim();
    if (trimmed !== (logoConfig.altText || 'preveuo')) {
      onUpdate?.({
        logo: { ...logoConfig, altText: trimmed || 'preveuo' },
      });
    }
  };

  const handleStartEditButton = (btn: ChapterButton) => {
    setEditingBtnId(btn.id);
    setLocalBtnLabel(btn.label || 'Get Started');
  };

  const handleCommitButtonLabel = (btnId: string) => {
    setEditingBtnId(null);
    const trimmed = localBtnLabel.trim();
    if (trimmed) {
      handleUpdateButtonLabel(btnId, trimmed);
    }
  };

  // Resolve Target Step & Scene based on user selection or defaults
  const targetStep = useMemo(() => {
    if (coverConfig.type === 'steps' && coverConfig.stepId) {
      const match = steps.find(
        (s) =>
          s.id === coverConfig.stepId ||
          (s as any)._id === coverConfig.stepId ||
          String(s.id) === String(coverConfig.stepId) ||
          String((s as any)._id) === String(coverConfig.stepId)
      );
      if (match) return match;
    }
    return steps[0] || null;
  }, [coverConfig.type, coverConfig.stepId, steps]);

  const targetScene = useMemo(() => {
    if (targetStep) {
      const match = scenes.find(
        (sc) =>
          sc.id === targetStep.sceneId ||
          (sc as any)._id === targetStep.sceneId ||
          String(sc.id) === String(targetStep.sceneId) ||
          String((sc as any)._id) === String(targetStep.sceneId)
      );
      if (match) return match;
    }
    return scenes[0] || null;
  }, [targetStep, scenes]);

  // Resolve cover / background image URL
  const resolvedImageUrl: string | null = useMemo(() => {
    if (coverConfig.type === 'custom' && coverConfig.assetUrl) {
      return coverConfig.assetUrl;
    }
    if (coverConfig.type === 'none') {
      return null;
    }
    const url = targetScene?.sourceAssetUrl || scenes[0]?.sourceAssetUrl || null;
    return url;
  }, [coverConfig.type, coverConfig.assetUrl, targetScene, scenes]);

  const buttons: ChapterButton[] = useMemo(() => {
    if (chapter.buttons && chapter.buttons.length > 0) {
      return chapter.buttons;
    }
    return [
      {
        id: 'btn_default_1',
        label: 'Get Started',
        action: { type: 'next' },
        style: 'primary',
        visible: true,
      },
    ];
  }, [chapter.buttons]);

  // Button actions
  const handleButtonClick = (btn: ChapterButton) => {
    if (isEditor) {
      onSelectButton?.(btn.id);
      return;
    }
    onAction?.(btn.action);
  };

  // Cover Card click action
  const handleCoverCardClick = () => {
    if (!isEditor) {
      const firstAction = buttons[0]?.action || { type: 'next' };
      onAction?.(firstAction);
    }
  };

  // Handle Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditor) {
      const firstAction = buttons[0]?.action || { type: 'next' };
      onAction?.(firstAction);
    }
  };

  // Handle Password Unlock
  const handlePasswordUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = chapter.passwordConfig?.password;
    if (expected && passwordInput !== expected) {
      setPasswordError(true);
      return;
    }
    setPasswordError(false);
    if (!isEditor) {
      const firstAction = buttons[0]?.action || { type: 'next' };
      onAction?.(firstAction);
    }
  };

  // Update button label helper
  const handleUpdateButtonLabel = (btnId: string, newLabel: string) => {
    const updated = buttons.map((b) => (b.id === btnId ? { ...b, label: newLabel } : b));
    onUpdate?.({ buttons: updated });
  };

  // Delete button helper
  const handleDeleteButton = (btnId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttons.length <= 1) return;
    const updated = buttons.filter((b) => b.id !== btnId);
    onUpdate?.({ buttons: updated });
  };

  const isDark = theme === 'dark';
  const overlayOpacity = Math.max(0, Math.min(100, opacity)) / 100;
  const isCenter = layout === 'center';
  const isLeft = layout === 'left';
  const isRight = layout === 'right';
  const showCover = coverConfig.type !== 'none';

  // =========================================================================
  // COVER CARD COMPONENT (Matches Supademo exactly, docked to edges)
  // =========================================================================
  const renderCoverCard = (layoutType: 'left' | 'center' | 'right') => {
    if (!showCover) return null;

    // Supademo editor dashed borders vs runtime clean borders
    const editorBorderClasses =
      layoutType === 'left'
        ? 'rounded-tl-2xl sm:rounded-tl-3xl border-t-2 border-l-2 border-dashed border-white/50 border-r-0 border-b-0'
        : layoutType === 'right'
        ? 'rounded-tr-2xl sm:rounded-tr-3xl border-t-2 border-r-2 border-dashed border-white/50 border-l-0 border-b-0'
        : 'rounded-t-2xl sm:rounded-t-3xl border-t-2 border-l-2 border-r-2 border-dashed border-white/50 border-b-0';

    const runtimeBorderClasses =
      layoutType === 'left'
        ? 'rounded-tl-2xl sm:rounded-tl-3xl border-t border-l border-white/20 border-r-0 border-b-0'
        : layoutType === 'right'
        ? 'rounded-tr-2xl sm:rounded-tr-3xl border-t border-r border-white/20 border-l-0 border-b-0'
        : 'rounded-t-2xl sm:rounded-t-3xl border-t border-l border-r border-white/20 border-b-0';

    return (
      <div
        onClick={handleCoverCardClick}
        className={`group/cover relative w-full h-full overflow-hidden bg-zinc-900 shadow-2xl transition-all duration-300 ${
          isEditor
            ? `${editorBorderClasses} hover:border-brand-purple cursor-pointer`
            : `${runtimeBorderClasses} cursor-pointer`
        }`}
      >
        {resolvedImageUrl ? (
          Boolean(resolvedImageUrl.match(/\.(mp4|webm|mov)$/i)) ||
          targetScene?.sourceType === 'recording' ? (
            <video
              src={resolvedImageUrl}
              autoPlay
              loop
              muted
              playsInline
              className={`w-full h-full object-cover transition-transform duration-500 group-hover/cover:scale-[1.01] ${
                layoutType === 'left'
                  ? 'object-left-top'
                  : layoutType === 'right'
                  ? 'object-right-top'
                  : 'object-top'
              }`}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolvedImageUrl}
              alt={targetStep?.title || 'Cover Preview'}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover/cover:scale-[1.01] ${
                layoutType === 'left'
                  ? 'object-left-top'
                  : layoutType === 'right'
                  ? 'object-right-top'
                  : 'object-top'
              }`}
            />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/80 text-white/50 p-6 text-center select-none">
            <ImageIcon className="w-10 h-10 mb-2 text-white/30" />
            <span className="text-xs font-medium">Select a step or image in Cover settings</span>
          </div>
        )}

        {/* Runtime Tour Launch Badge (Hidden in Editor mode to keep screenshot clean) */}
        {false && (
          <>
            <div className="absolute inset-0 bg-black/10 group-hover/cover:bg-black/0 transition-colors pointer-events-none" />
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-all duration-300 transform translate-y-1.5 group-hover/cover:translate-y-0 pointer-events-none z-20">
              <div className="px-5 py-2 rounded-full bg-brand-purple text-white text-[12px] font-bold flex items-center gap-1.5 shadow-2xl animate-bounce">
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Click Anywhere to Start Tour</span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // =========================================================================
  // CHAPTER CONTENT BLOCK: Logo, Title, Description, Buttons / Form
  // (Identical matching width between Title & Description, zero layout shift)
  // =========================================================================
  const renderContent = () => (
    <>
      {/* 1. Logo Pill with Dashed Border */}
      {logoConfig.visible && (
        <div className={`inline-flex items-center w-fit max-w-full ${isCenter || !showCover ? 'mx-auto' : ''}`}>
          {isEditor && isEditingLogo ? (
            <div className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-dashed border-brand-purple rounded-xl px-3.5 py-1.5 shadow-lg w-fit max-w-full">
              <input
                type="text"
                autoFocus
                value={localLogoText}
                onChange={(e) => setLocalLogoText(e.target.value)}
                onBlur={handleCommitLogo}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCommitLogo();
                  if (e.key === 'Escape') {
                    setLocalLogoText(logoConfig.altText || 'preveuo');
                    setIsEditingLogo(false);
                  }
                }}
                style={{
                  width: `${Math.max(6, localLogoText.length + 1)}ch`,
                }}
                className="bg-transparent text-white font-serif italic text-lg sm:text-xl font-bold tracking-tight outline-none border-none p-0 m-0"
              />
              <button
                type="button"
                onClick={handleCommitLogo}
                className="p-0.5 hover:bg-white/10 rounded text-emerald-400 cursor-pointer shrink-0"
                title="Save logo text"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => {
                if (isEditor) {
                  setLocalLogoText(logoConfig.altText || 'preveuo');
                  setIsEditingLogo(true);
                }
              }}
              className={`group/logo inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all duration-200 w-fit max-w-full ${
                isEditor
                  ? 'border border-dashed border-white/40 hover:border-white bg-black/25 hover:bg-black/35 cursor-pointer'
                  : 'border border-transparent'
              }`}
              title={isEditor ? 'Click to edit logo text' : undefined}
            >
              {logoConfig.assetUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoConfig.assetUrl}
                  alt={logoConfig.altText || 'Logo'}
                  className="max-h-7 max-w-[130px] object-contain drop-shadow-sm transition-transform group-hover/logo:scale-105"
                />
              ) : (
                <span className="font-serif text-white font-extrabold text-2xl sm:text-3xl tracking-tight lowercase">
                  {logoConfig.altText || 'preveuo'}
                </span>
              )}
              {isEditor && (
                <Pencil className="w-3 h-3 text-white/40 opacity-0 group-hover/logo:opacity-100 transition-opacity ml-1" />
              )}
            </div>
          )}
        </div>
      )}

      {/* 2 & 3. Title & Description Box (Guarantees identical matching width between title & description) */}
      <div className={`w-full max-w-[440px] lg:max-w-[480px] flex flex-col space-y-2.5 ${isCenter || !showCover ? 'mx-auto items-center' : 'items-start'}`}>
        {/* Chapter Title Pill */}
        {isEditor && isEditingTitle ? (
          <div className="relative w-full bg-black/60 backdrop-blur-md rounded-2xl px-5 py-3 border-2 border-brand-purple shadow-xl">
            <textarea
              autoFocus
              rows={1}
              value={localTitle}
              onBlur={handleCommitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCommitTitle();
                }
                if (e.key === 'Escape') {
                  setLocalTitle(chapter.title || '');
                  setIsEditingTitle(false);
                }
              }}
              ref={(el) => {
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = `${el.scrollHeight}px`;
              }}
              onChange={(e) => setLocalTitle(e.target.value)}
              style={{ lineHeight: '1.25' }}
              className={`w-full font-sans text-xl sm:text-2xl lg:text-[28px] font-extrabold tracking-tight bg-transparent text-white focus:outline-none resize-none border-none p-0 m-0 block break-words overflow-hidden ${
                isCenter || !showCover ? 'text-center' : 'text-left'
              }`}
            />
          </div>
        ) : (
          <div
            onClick={() => {
              if (isEditor) {
                setLocalTitle(chapter.title || 'Create a Preveuo in minutes');
                setIsEditingTitle(true);
              }
            }}
            className={`group/title relative w-full transition-colors duration-150 ${
              isEditor
                ? 'rounded-2xl px-5 py-3 bg-black/30 backdrop-blur-sm border-2 border-transparent hover:bg-black/45 cursor-text hover:border-white/20 hover:shadow-lg'
                : 'px-0 py-1'
            }`}
            title={isEditor ? 'Click to edit title' : undefined}
          >
            <h2
              style={{ lineHeight: '1.25' }}
              className={`w-full font-sans text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-white leading-tight m-0 p-0 block break-words ${
                isCenter || !showCover ? 'text-center' : 'text-left'
              }`}
            >
              {chapter.title || 'Create a Preveuo in minutes'}
            </h2>
            {isEditor && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Pencil className="w-3.5 h-3.5 text-white/40 opacity-0 group-hover/title:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
        )}

        {/* Chapter Description Pill (Exact same width as Title, zero-shift) */}
        {isEditor && isEditingDesc ? (
          <div className="relative w-full bg-black/60 backdrop-blur-md rounded-xl px-5 py-2.5 border-2 border-brand-purple shadow-xl">
            <textarea
              autoFocus
              rows={1}
              value={localDesc}
              onBlur={handleCommitDesc}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCommitDesc();
                }
                if (e.key === 'Escape') {
                  setLocalDesc(chapter.description || '');
                  setIsEditingDesc(false);
                }
              }}
              ref={(el) => {
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = `${el.scrollHeight}px`;
              }}
              onChange={(e) => setLocalDesc(e.target.value)}
              style={{ lineHeight: '1.4' }}
              className={`w-full font-sans text-xs sm:text-sm lg:text-[15px] font-normal leading-relaxed bg-transparent text-white/90 focus:outline-none resize-none border-none p-0 m-0 block break-words overflow-hidden ${
                isCenter || !showCover ? 'text-center' : 'text-left'
              }`}
            />
          </div>
        ) : (
          <div
            onClick={() => {
              if (isEditor) {
                setLocalDesc(chapter.description || "Here's a description of the Preveuo");
                setIsEditingDesc(true);
              }
            }}
            className={`group/desc relative w-full transition-colors duration-150 ${
              isEditor
                ? 'rounded-xl px-5 py-2.5 bg-black/30 backdrop-blur-sm border-2 border-transparent hover:bg-black/45 cursor-text hover:border-white/20 hover:shadow-md'
                : 'px-0 py-0.5'
            }`}
            title={isEditor ? 'Click to edit description' : undefined}
          >
            <p
              style={{ lineHeight: '1.4' }}
              className={`w-full font-sans text-sm sm:text-base lg:text-[16.5px] font-normal text-white/80 leading-relaxed m-0 p-0 block break-words ${
                isCenter || !showCover ? 'text-center' : 'text-left'
              }`}
            >
              {chapter.description || "Here's a description of the Preveuo"}
            </p>
            {isEditor && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Pencil className="w-3 h-3 text-white/40 opacity-0 group-hover/desc:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Action Controls: Default Buttons / Lead Form / Embed / Password Gate */}
      {chapterType === 'default' && (
        <div
          className={`flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1.5 max-w-full ${
            isCenter || !showCover ? 'justify-center' : 'justify-start'
          }`}
        >
          {buttons
            .filter((btn) => btn.visible !== false)
            .map((btn) => {
              const isSelected = isEditor && selectedButtonId === btn.id;
              const isEditingThisBtn = editingBtnId === btn.id;

              if (isEditingThisBtn && isEditor) {
                return (
                  <div
                    key={btn.id}
                    className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-brand-purple rounded-xl px-3.5 py-2 shadow-lg w-fit"
                  >
                    <input
                      type="text"
                      autoFocus
                      value={localBtnLabel}
                      onChange={(e) => setLocalBtnLabel(e.target.value)}
                      onBlur={() => handleCommitButtonLabel(btn.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCommitButtonLabel(btn.id);
                        if (e.key === 'Escape') setEditingBtnId(null);
                      }}
                      className="bg-transparent text-white font-semibold text-sm outline-none w-24"
                    />
                    <button
                      type="button"
                      onClick={() => handleCommitButtonLabel(btn.id)}
                      className="p-1 hover:bg-white/10 rounded text-emerald-400 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              }

              return (
                <div key={btn.id} className="relative group/btnitem inline-flex items-center">
                  {/* Button Ripple Waves (Button-shaped waves radiating from button perimeter, NOT a circle) */}
                  {btn.style !== 'secondary' && btn.style !== 'outline' && (
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                      <span className="absolute inset-0 rounded-xl bg-brand-purple/50 animate-btn-ripple-1" />
                      <span className="absolute inset-0 rounded-xl bg-brand-purple/35 animate-btn-ripple-2" />
                      <span className="absolute inset-0 rounded-xl border border-white/40 animate-btn-ripple-3" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleButtonClick(btn)}
                    className={`relative z-10 inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-[15px] transition-all duration-150 cursor-pointer overflow-hidden shadow-lg active:scale-95 ${
                      btn.style === 'secondary'
                        ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                        : btn.style === 'outline'
                        ? 'bg-transparent hover:bg-white/10 border border-white/30 text-white'
                        : 'bg-brand-purple hover:bg-brand-purple-hover text-white shadow-brand-purple/35 hover:shadow-brand-purple/60 animate-btn-pulse'
                    } ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50' : ''}`}
                  >
                    {/* Shimmer sweep on primary button */}
                    {btn.style !== 'secondary' && btn.style !== 'outline' && (
                      <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btnitem:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                    )}

                    <span className="relative z-10">{btn.label || 'Get Started'}</span>

                    {btn.action.type === 'external_url' && (
                      <ExternalLink className="relative z-10 w-3.5 h-3.5 opacity-80 group-hover/btnitem:translate-x-0.5 transition-transform" />
                    )}
                    {btn.action.type === 'previous' && (
                      <ArrowLeft className="relative z-10 w-3.5 h-3.5 opacity-80 group-hover/btnitem:-translate-x-0.5 transition-transform" />
                    )}
                  </button>

                  {/* Quick controls in editor mode */}
                  {isEditor && (
                    <div className="absolute -top-3 -right-2 hidden group-hover/btnitem:flex items-center gap-1 z-30 bg-black/80 rounded-full px-1.5 py-0.5 shadow-md border border-white/20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEditButton(btn);
                        }}
                        className="p-1 hover:text-brand-purple text-white/70 transition-colors"
                        title="Rename button"
                      >
                        <Pencil className="w-2.5 h-2.5" />
                      </button>
                      {buttons.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteButton(btn.id, e)}
                          className="p-1 hover:text-red-400 text-white/70 transition-colors"
                          title="Delete button"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

          {/* Add Button with Dashed Border matching Supademo */}
          {isEditor && (
            <button
              type="button"
              onClick={onAddButton}
              className="group/add inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-dashed border-white/40 hover:border-white bg-black/25 hover:bg-black/40 text-white/75 hover:text-white font-medium text-sm sm:text-[15px] transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              title="Add new button to chapter"
            >
              <span>Add Button</span>
            </button>
          )}
        </div>
      )}

      {/* Lead Capture Form Chapter */}
      {chapterType === 'form' && (
        <form
          onSubmit={handleFormSubmit}
          className={`w-full max-w-sm pt-2 space-y-3 ${isCenter || !showCover ? 'mx-auto' : ''}`}
        >
          <div className="space-y-2">
            <input
              type="email"
              required
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder={chapter.formConfig?.emailPlaceholder || 'Enter your work email...'}
              className="w-full bg-black/35 border border-white/20 focus:border-brand-purple rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors"
            />
            {chapter.formConfig?.requireName && (
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Your full name..."
                className="w-full bg-black/35 border border-white/20 focus:border-brand-purple rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors"
              />
            )}
          </div>
          <div className="relative w-full">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <span className="absolute inset-0 rounded-xl bg-brand-purple/50 animate-btn-ripple-1" />
              <span className="absolute inset-0 rounded-xl bg-brand-purple/35 animate-btn-ripple-2" />
              <span className="absolute inset-0 rounded-xl border border-white/40 animate-btn-ripple-3" />
            </div>
            <button
              type="submit"
              className="relative z-10 w-full py-3 px-6 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-semibold text-sm shadow-lg shadow-brand-purple/35 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 animate-btn-pulse"
            >
              <span>{chapter.formConfig?.buttonLabel || 'Access Demo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-white/50 text-center">
            🔒 Your information is secure. No spam.
          </p>
        </form>
      )}

      {/* Embed Video / Iframe Chapter */}
      {chapterType === 'embed' && (
        <div
          className={`w-full max-w-md pt-2 space-y-3 ${isCenter || !showCover ? 'mx-auto' : ''}`}
        >
          {chapter.embedConfig?.embedUrl ? (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/20 bg-black/60 shadow-xl">
              <iframe
                src={chapter.embedConfig.embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/20 text-center text-xs text-white/60">
              Enter embed URL in Chapter Settings to display video or interactive frame.
            </div>
          )}
          <button
            type="button"
            onClick={() =>
              handleButtonClick(
                buttons[0] || {
                  id: 'btn_embed_next',
                  label: 'Continue to Tour',
                  action: { type: 'next' },
                  style: 'primary',
                  visible: true,
                }
              )
            }
            className="py-3 px-6 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-semibold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Continue to Tour</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Password Gate Chapter */}
      {chapterType === 'password' && (
        <form
          onSubmit={handlePasswordUnlock}
          className={`w-full max-w-sm pt-2 space-y-3 ${isCenter || !showCover ? 'mx-auto' : ''}`}
        >
          <div className="relative">
            <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              placeholder="Enter passcode to unlock..."
              className={`w-full bg-black/35 border ${
                passwordError ? 'border-red-500' : 'border-white/20 focus:border-brand-purple'
              } rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors`}
            />
          </div>
          {passwordError && (
            <p className="text-[11px] text-red-400 font-medium">
              Incorrect passcode. Please try again.
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-semibold text-sm shadow-lg shadow-brand-purple/35 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Unlock Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {chapter.passwordConfig?.hint && (
            <p className="text-[10.5px] text-white/50 text-center">
              Hint: {chapter.passwordConfig.hint}
            </p>
          )}
        </form>
      )}
    </>
  );

  return (
    <div
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 45% 40%, rgba(62,65,77,1) 0%, rgba(41,42,52,1) 50%, rgba(23,24,33,1) 100%)'
          : 'white',
      }}
      className={`relative w-full h-full overflow-hidden font-sans select-none ${
        isDark ? 'text-white' : 'text-heading'
      }`}
    >
      {/* Background Image with Dynamic Blur */}
      {resolvedImageUrl && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolvedImageUrl}
            alt="Chapter Background"
            style={{
              filter: blur ? `blur(${blurAmount}px) brightness(0.7)` : 'blur(16px) brightness(0.7)',
              transform: 'scale(1.08)',
            }}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>
      )}

      {/* Dim / Tint Overlay */}
      <div
        style={{
          backgroundColor: isDark ? 'black' : 'white',
          opacity: overlayOpacity,
        }}
        className="absolute inset-0 pointer-events-none z-1 transition-opacity duration-150"
      />

      {/* Backdrop blur overlay */}
      {blur && (
        <div
          style={{
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
          }}
          className="absolute inset-0 pointer-events-none z-2 transition-all duration-300"
        />
      )}

      {/* ========================================================================= */}
      {/* 1. LEFT LAYOUT (Matches media_1793589405982_a7f38671.png)                  */}
      {/* ========================================================================= */}
      {isLeft && showCover && (
        <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-stretch">
          {/* Left Column: Content (Tightly aligned with minimum space to card) */}
          <div className="w-full md:w-[46%] lg:w-[48%] h-full flex flex-col justify-center items-start pl-8 sm:pl-12 lg:pl-16 pr-3 py-6 space-y-4 z-10 min-w-0 overflow-hidden">
            {renderContent()}
          </div>

          {/* Right Column: Screenshot Card docked to right & bottom */}
          <div className="w-full md:w-[54%] lg:w-[52%] h-full flex items-end justify-end overflow-hidden z-10 shrink-0">
            <div className="w-full h-[85%] sm:h-[87%]">
              {renderCoverCard('left')}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CENTER LAYOUT (Matches media_1793589405983_268b7ca2.png)                */}
      {/* ========================================================================= */}
      {isCenter && showCover && (
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-between overflow-hidden">
          {/* Top Section: Content centered, compact with minimal vertical space */}
          <div className="w-full flex-none flex flex-col items-center justify-center pt-5 sm:pt-7 pb-2 px-6 text-center space-y-3 z-10 min-w-0 max-w-3xl mx-auto">
            {renderContent()}
          </div>

          {/* Bottom Section: Screenshot Card centered, emerging from bottom with minimal space to content */}
          <div className="w-full flex-1 min-h-0 flex items-end justify-center px-4 sm:px-8 lg:px-12 overflow-hidden z-10 pb-0">
            <div className="w-full max-w-5xl h-full max-h-[94%]">
              {renderCoverCard('center')}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RIGHT LAYOUT (Matches media_1793589405984_a56518b0.png)                 */}
      {/* ========================================================================= */}
      {isRight && showCover && (
        <div className="relative z-10 w-full h-full flex flex-col-reverse md:flex-row items-stretch">
          {/* Left Column: Screenshot Card docked to left & bottom */}
          <div className="w-full md:w-[54%] lg:w-[52%] h-full flex items-end justify-start overflow-hidden z-10 shrink-0">
            <div className="w-full h-[85%] sm:h-[87%]">
              {renderCoverCard('right')}
            </div>
          </div>

          {/* Right Column: Content (Tightly aligned with minimum space to card) */}
          <div className="w-full md:w-[46%] lg:w-[48%] h-full flex flex-col justify-center items-start pl-2 sm:pl-3 pr-6 sm:pr-10 lg:pr-12 py-6 space-y-3.5 z-10 min-w-0 overflow-hidden">
            {renderContent()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. NO COVER LAYOUT (cover === 'none')                                      */}
      {/* ========================================================================= */}
      {!showCover && (
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 text-center space-y-4 max-w-3xl mx-auto py-8">
          {renderContent()}
        </div>
      )}
    </div>
  );
};
