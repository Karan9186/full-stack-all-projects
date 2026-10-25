'use client';

import React, { useState, useMemo } from 'react';
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
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Lock,
  Sparkles,
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

  // Inline editing states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [editingBtnId, setEditingBtnId] = useState<string | null>(null);

  // 3D Tilt & Card Parallax Physics
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBeaconHovered, setIsBeaconHovered] = useState(false);

  // Form / Password state for runtime
  const [formEmail, setFormEmail] = useState('');
  const [formName, setFormName] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Theme & Layout configs
  const theme = chapter.theme || 'dark';
  const layout = chapter.layout || 'left';
  const opacity = typeof chapter.opacity === 'number' ? chapter.opacity : 24;
  const blur = chapter.blur ?? false;
  const logoConfig = chapter.logo || { visible: true, altText: 'supademo' };
  const coverConfig = chapter.cover || { type: 'steps' };
  const chapterType = chapter.type || 'default';

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

  // Handle 3D Mouse Parallax and dynamic Glare
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    const tiltX = (xRatio - 0.5) * 12;
    const tiltY = (yRatio - 0.5) * -12;

    setCardTilt({ x: tiltX, y: tiltY });
    setGlarePosition({ x: Math.round(xRatio * 100), y: Math.round(yRatio * 100) });
    setIsCardHovered(true);
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
    setIsCardHovered(false);
    setIsBeaconHovered(false);
  };

  // Mini browser reload animation
  const handleRefreshClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 700);
  };

  // Button actions
  const handleButtonClick = (btn: ChapterButton) => {
    if (isEditor) {
      onSelectButton?.(btn.id);
      return;
    }
    onAction?.(btn.action);
  };

  // Card click action
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

  const sceneSlug = targetScene?.slug || 'yaanna.lifestyle';
  const isDark = theme === 'dark';
  const overlayOpacity = Math.max(0, Math.min(100, opacity)) / 100;
  const isCenter = layout === 'center';
  const isLeft = layout === 'left';
  const isRight = layout === 'right';
  const showCover = coverConfig.type !== 'none';

  return (
    <div
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 45% 40%, rgba(62,65,77,1) 0%, rgba(41,42,52,1) 50%, rgba(23,24,33,1) 100%)'
          : 'white',
      }}
      className={`relative w-full h-full min-h-[460px] flex items-center justify-center overflow-hidden font-sans select-none ${
        isDark ? 'text-white' : 'text-heading'
      }`}
    >
      {/* ========================================================================= */}
      {/* BACKGROUND IMAGE (Zero blur when blur is OFF, Blur-XL when blur is ON)    */}
      {/* ========================================================================= */}
      {resolvedImageUrl && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolvedImageUrl}
            alt="Chapter Background"
            className={`w-full h-full object-cover transform transition-all duration-300 ${
              blur ? 'filter blur-2xl brightness-75 scale-105' : 'filter-none scale-100'
            }`}
          />
        </div>
      )}

      {/* Dim / Tint Overlay (Strictly controlled by Overlay Opacity slider: 0% = transparent) */}
      <div
        style={{
          backgroundColor: isDark ? 'black' : 'white',
          opacity: overlayOpacity,
        }}
        className="absolute inset-0 pointer-events-none z-1 transition-opacity duration-150"
      />

      {/* Backdrop blur overlay (ONLY active when Background Blur is toggled ON) */}
      {blur && (
        <div className="absolute inset-0 backdrop-blur-md pointer-events-none z-2 transition-all duration-300" />
      )}

      {/* ========================================================================= */}
      {/* MAIN CHAPTER CONTENT CONTAINER                                            */}
      {/* ========================================================================= */}
      <div
        className={`relative z-10 w-full h-full max-w-6xl mx-auto px-6 sm:px-10 py-8 flex items-center ${
          isCenter || !showCover
            ? 'flex-col items-center justify-center text-center'
            : isLeft
            ? 'flex-col md:flex-row-reverse items-center justify-between text-left gap-8 lg:gap-12'
            : 'flex-col md:flex-row items-center justify-between text-left gap-8 lg:gap-12'
        }`}
      >
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Logo, Title Pill, Description Pill, Controls                 */}
        {/* ========================================================================= */}
        <div
          className={`flex flex-col ${
            isCenter || !showCover
              ? 'items-center max-w-2xl'
              : 'items-start flex-1 max-w-md lg:max-w-lg'
          } space-y-3.5`}
        >
          {/* Logo with Dashed Boundary Matching User Reference Image */}
          {logoConfig.visible && (
            <div className="inline-flex items-center w-fit">
              {isEditor && isEditingLogo ? (
                <div className="inline-flex items-center gap-2 bg-zinc-800 border border-dashed border-brand-purple rounded-xl px-3 py-1.5 shadow-lg w-fit">
                  <input
                    type="text"
                    autoFocus
                    value={logoConfig.altText || 'supademo'}
                    onChange={(e) =>
                      onUpdate?.({
                        logo: { ...logoConfig, altText: e.target.value },
                      })
                    }
                    onBlur={() => setIsEditingLogo(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditingLogo(false);
                    }}
                    className="bg-transparent text-white font-serif text-lg font-bold tracking-tight outline-none w-28"
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingLogo(false)}
                    className="p-1 hover:bg-white/10 rounded text-emerald-400 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => {
                    if (isEditor) setIsEditingLogo(true);
                  }}
                  className={`group/logo inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all duration-200 w-fit ${
                    isEditor
                      ? 'border border-dashed border-white/40 hover:border-white hover:bg-white/5 cursor-pointer active:scale-98'
                      : ''
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
                    <span className="font-serif italic text-white/95 text-lg font-medium tracking-wide lowercase selection:bg-white/20">
                      {logoConfig.altText || 'supademo'}
                    </span>
                  )}
                  {isEditor && (
                    <Pencil className="w-3 h-3 text-white/40 opacity-0 group-hover/logo:opacity-100 transition-opacity ml-1" />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Chapter Title: Tightly Hugs Text Width (w-fit) */}
          <div className="inline-block w-fit max-w-[440px]">
            {isEditor && isEditingTitle ? (
              <div className="relative inline-block w-fit max-w-[440px] bg-zinc-800 rounded-2xl px-5 py-3 border-2 border-brand-purple shadow-xl">
                <textarea
                  autoFocus
                  rows={2}
                  value={chapter.title}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setIsEditingTitle(false);
                    }
                  }}
                  onChange={(e) => onUpdate?.({ title: e.target.value })}
                  style={{
                    width: `${Math.max(16, (chapter.title || 'Create a Supademo in minutes').length)}ch`,
                    maxWidth: '400px',
                  }}
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-transparent text-white focus:outline-none resize-none leading-tight border-none p-0 m-0 block"
                />
                <div className="text-[9.5px] text-white/40 pt-1 text-right">Press Enter to save</div>
              </div>
            ) : (
              <div
                onClick={() => {
                  if (isEditor) setIsEditingTitle(true);
                }}
                className={`group/title inline-block w-fit max-w-[440px] ${
                  isEditor
                    ? 'bg-zinc-800/90 hover:bg-zinc-700 rounded-2xl px-5 py-3 cursor-text transition-all duration-200 border border-transparent hover:border-white/20 hover:shadow-lg active:scale-[0.99]'
                    : ''
                }`}
                title={isEditor ? 'Click to edit title' : undefined}
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight flex items-center gap-2">
                  <span>{chapter.title || 'Create a Supademo in minutes'}</span>
                  {isEditor && (
                    <Pencil className="w-3.5 h-3.5 text-white/40 opacity-0 group-hover/title:opacity-100 transition-opacity shrink-0" />
                  )}
                </h2>
              </div>
            )}
          </div>

          {/* Chapter Description: Tightly Hugs Text Width (w-fit) */}
          <div className="inline-block w-fit max-w-[440px]">
            {isEditor && isEditingDesc ? (
              <div className="relative inline-block w-fit max-w-[440px] bg-zinc-800 rounded-xl px-4 py-2 border-2 border-brand-purple shadow-xl">
                <textarea
                  autoFocus
                  rows={1}
                  value={chapter.description || ''}
                  onBlur={() => setIsEditingDesc(false)}
                  onChange={(e) => onUpdate?.({ description: e.target.value })}
                  style={{
                    width: `${Math.max(20, (chapter.description || '').length)}ch`,
                    maxWidth: '400px',
                  }}
                  className="text-sm sm:text-base font-normal leading-relaxed bg-transparent text-white/90 focus:outline-none resize-none border-none p-0 m-0 block"
                />
                <div className="text-[9px] text-white/40 pt-0.5 text-right">Click away to save</div>
              </div>
            ) : (
              <div
                onClick={() => {
                  if (isEditor) setIsEditingDesc(true);
                }}
                className={`group/desc inline-block w-fit max-w-[440px] ${
                  isEditor
                    ? 'bg-zinc-800/90 hover:bg-zinc-700 rounded-xl px-4 py-2 cursor-text transition-all duration-200 border border-transparent hover:border-white/15 hover:shadow-md'
                    : ''
                }`}
                title={isEditor ? 'Click to edit description' : undefined}
              >
                <p className="text-sm sm:text-base font-normal text-white/80 leading-relaxed flex items-center gap-2">
                  <span>{chapter.description || "Here's a description of the Supademo"}</span>
                  {isEditor && (
                    <Pencil className="w-3 h-3 text-white/40 opacity-0 group-hover/desc:opacity-100 transition-opacity shrink-0" />
                  )}
                </p>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* CHAPTER TYPE RENDERING                                                    */}
          {/* ========================================================================= */}

          {/* 1. DEFAULT CHAPTER: Buttons + Add Button */}
          {chapterType === 'default' && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {buttons
                .filter((btn) => btn.visible !== false)
                .map((btn) => {
                  const isSelected = isEditor && selectedButtonId === btn.id;
                  const isEditingThisBtn = editingBtnId === btn.id;

                  if (isEditingThisBtn && isEditor) {
                    return (
                      <div
                        key={btn.id}
                        className="flex items-center gap-1.5 bg-zinc-800 border border-brand-purple rounded-xl px-3 py-1.5 shadow-lg w-fit"
                      >
                        <input
                          type="text"
                          autoFocus
                          value={btn.label}
                          onChange={(e) => handleUpdateButtonLabel(btn.id, e.target.value)}
                          onBlur={() => setEditingBtnId(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setEditingBtnId(null);
                          }}
                          className="bg-transparent text-white font-semibold text-sm outline-none w-24"
                        />
                        <button
                          type="button"
                          onClick={() => setEditingBtnId(null)}
                          className="p-1 hover:bg-white/10 rounded text-emerald-400 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div key={btn.id} className="relative group/btnitem inline-flex items-center">
                      <button
                        type="button"
                        onClick={() => handleButtonClick(btn)}
                        className={`relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer overflow-hidden shadow-lg active:scale-95 ${
                          btn.style === 'secondary'
                            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                            : btn.style === 'outline'
                            ? 'bg-transparent hover:bg-white/10 border border-white/30 text-white'
                            : 'bg-brand-purple hover:bg-brand-purple-hover text-white shadow-brand-purple/35 hover:shadow-brand-purple/60 hover:-translate-y-0.5'
                        } ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50' : ''}`}
                      >
                        {/* Shimmer sweep on primary button */}
                        {btn.style !== 'secondary' && btn.style !== 'outline' && (
                          <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btnitem:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                        )}

                        <span className="relative z-10">{btn.label || 'Get Started'}</span>

                        {btn.action.type === 'external_url' ? (
                          <ExternalLink className="relative z-10 w-3.5 h-3.5 opacity-80 group-hover/btnitem:translate-x-0.5 transition-transform" />
                        ) : btn.action.type === 'previous' ? (
                          <ArrowLeft className="relative z-10 w-3.5 h-3.5 opacity-80 group-hover/btnitem:-translate-x-0.5 transition-transform" />
                        ) : (
                          <ArrowRight className="relative z-10 w-3.5 h-3.5 opacity-80 group-hover/btnitem:translate-x-0.5 transition-transform" />
                        )}
                      </button>

                      {/* Quick controls in editor mode */}
                      {isEditor && (
                        <div className="absolute -top-3 -right-2 hidden group-hover/btnitem:flex items-center gap-1 z-30 bg-black/80 rounded-full px-1.5 py-0.5 shadow-md border border-white/20">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingBtnId(btn.id);
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

              {/* Add Button with Dashed Border matching reference image */}
              {isEditor && (
                <button
                  type="button"
                  onClick={onAddButton}
                  className="group/add inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl border border-dashed border-white/40 hover:border-white bg-white/5 hover:bg-white/10 text-white/75 hover:text-white font-medium text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                  title="Add new button to chapter"
                >
                  <span>Add Button</span>
                </button>
              )}
            </div>
          )}

          {/* 2. FORM CHAPTER: Lead Capture Form */}
          {chapterType === 'form' && (
            <form onSubmit={handleFormSubmit} className="w-full max-w-sm pt-2 space-y-3">
              <div className="space-y-2">
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder={chapter.formConfig?.emailPlaceholder || 'Enter your work email...'}
                  className="w-full bg-zinc-800/90 border border-white/20 focus:border-brand-purple rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors"
                />
                {chapter.formConfig?.requireName && (
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Your full name..."
                    className="w-full bg-zinc-800/90 border border-white/20 focus:border-brand-purple rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors"
                  />
                )}
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-6 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-semibold text-sm shadow-lg shadow-brand-purple/35 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>{chapter.formConfig?.buttonLabel || 'Access Demo'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <p className="text-[10px] text-white/50 text-center">
                🔒 Your information is secure. No spam.
              </p>
            </form>
          )}

          {/* 3. EMBED CHAPTER: Video / Iframe */}
          {chapterType === 'embed' && (
            <div className="w-full max-w-md pt-2 space-y-3">
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
                className="py-2.5 px-6 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-semibold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Tour</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 4. PASSWORD GATE CHAPTER */}
          {chapterType === 'password' && (
            <form onSubmit={handlePasswordUnlock} className="w-full max-w-sm pt-2 space-y-3">
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
                  className={`w-full bg-zinc-800/90 border ${
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
                className="w-full py-2.5 px-6 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-semibold text-sm shadow-lg shadow-brand-purple/35 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Unlock Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {chapter.passwordConfig?.hint && (
                <p className="text-[10.5px] text-white/50 text-center">
                  Hint: {chapter.passwordConfig.hint}
                </p>
              )}
            </form>
          )}
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Browser Mockup Card with Dashed Border                      */}
        {/* ========================================================================= */}
        {showCover && (
          <div
            className={`hidden md:flex ${
              isCenter ? 'mt-8 w-full max-w-xl' : 'flex-1 w-full max-w-md lg:max-w-xl pl-2'
            } justify-center items-center`}
          >
            {/* Dashed Border Container around the Mockup (matching user screenshot) */}
            <div
              className={`w-full p-1 rounded-2xl transition-all duration-300 ${
                isEditor
                  ? 'border-2 border-dashed border-white/45 hover:border-brand-purple hover:bg-white/5'
                  : ''
              }`}
            >
              {/* 3D Tilting Browser Window */}
              <div
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                onClick={handleCoverCardClick}
                style={{
                  transform: isCardHovered
                    ? `perspective(1200px) rotateX(${cardTilt.y}deg) rotateY(${cardTilt.x}deg) scale(1.015)`
                    : 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)',
                  transition: isCardHovered
                    ? 'transform 0.08s ease-out'
                    : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="relative aspect-[16/10] w-full rounded-xl overflow-hidden shadow-2xl bg-zinc-900 border border-white/10 flex flex-col will-change-transform cursor-pointer group/card"
              >
                {/* Dynamic Glare Reflection Overlay */}
                {isCardHovered && (
                  <div
                    style={{
                      background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)`,
                    }}
                    className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-150"
                  />
                )}

                {/* Refresh Flash Effect */}
                {isRefreshing && (
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-40 animate-pulse pointer-events-none flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  </div>
                )}

                {/* Mini browser address bar matching user screenshot */}
                <div className="h-7 bg-zinc-800 border-b border-white/10 px-3 flex items-center justify-between shrink-0 select-none z-20">
                  {/* Traffic Light Dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 group-hover/card:brightness-110 transition-all cursor-pointer" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 group-hover/card:brightness-110 transition-all cursor-pointer" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover/card:brightness-110 transition-all cursor-pointer" />
                  </div>

                  {/* Browser Controls */}
                  <div className="flex items-center gap-1 text-white/40 text-[10px]">
                    <ChevronLeft className="w-2.5 h-2.5 hover:text-white cursor-pointer" />
                    <ChevronRight className="w-2.5 h-2.5 hover:text-white cursor-pointer" />
                    <button
                      type="button"
                      onClick={handleRefreshClick}
                      className="p-0.5 hover:text-white rounded cursor-pointer transition-transform active:rotate-180"
                      title="Refresh page simulation"
                    >
                      <RotateCw className={`w-2.5 h-2.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Domain Pill */}
                  <div className="bg-zinc-950 border border-white/10 rounded-md px-2.5 py-0.5 text-[10.5px] text-white/80 font-mono flex items-center gap-1.5 shadow-inner">
                    <Lock className="w-2.5 h-2.5 text-emerald-400" />
                    <span className="tracking-tight">{sceneSlug}</span>
                  </div>

                  <div className="w-6" />
                </div>

                {/* Mockup Body: Step Screenshot / Custom Cover Asset */}
                <div className="relative flex-1 w-full overflow-hidden flex flex-col bg-zinc-900">
                  {resolvedImageUrl ? (
                    <div className="relative w-full h-full overflow-hidden group/img">
                      {Boolean(resolvedImageUrl.match(/\.(mp4|webm|mov)$/i)) ||
                      targetScene?.sourceType === 'recording' ? (
                        <video
                          src={resolvedImageUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-103"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolvedImageUrl}
                          alt={targetStep?.title || 'Step Preview'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-103"
                        />
                      )}

                      {/* Subtle vignette gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                      {/* Animated Pulsing Hotspot Radar Beacon on Preview Card */}
                      <div
                        onMouseEnter={() => setIsBeaconHovered(true)}
                        onMouseLeave={() => setIsBeaconHovered(false)}
                        className="absolute top-[48%] left-[52%] -translate-x-1/2 -translate-y-1/2 z-20 transition-transform duration-300 group-hover/card:scale-110"
                      >
                        <span className="absolute -inset-3.5 rounded-full bg-brand-purple animate-ping opacity-70" />
                        <span className="absolute -inset-1.5 rounded-full bg-brand-purple/60 animate-pulse" />
                        <div className="relative w-7 h-7 rounded-full bg-brand-purple text-white flex items-center justify-center shadow-2xl border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                        </div>

                        {/* Interactive Tooltip on Beacon Hover */}
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 top-9 whitespace-nowrap z-30 transition-all duration-300 pointer-events-none ${
                            isBeaconHovered || isCardHovered
                              ? 'opacity-100 translate-y-0 scale-100'
                              : 'opacity-0 translate-y-1 scale-95'
                          }`}
                        >
                          <div className="bg-black/85 backdrop-blur-md text-white text-[9.5px] font-semibold px-2.5 py-1 rounded-lg border border-white/20 shadow-2xl flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Step 1 • Start Walkthrough</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800 text-white/50 p-6 text-center select-none">
                      <ImageIcon className="w-8 h-8 mb-2 text-white/30" />
                      <span className="text-xs font-medium">Select a step or image in Cover settings</span>
                    </div>
                  )}

                  {/* Interactive Floating Hover Badges on Card */}
                  <div className="absolute inset-x-0 bottom-2.5 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-y-1.5 group-hover/card:translate-y-0 pointer-events-none z-30">
                    {isEditor ? (
                      <div className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-medium flex items-center gap-1.5 shadow-2xl">
                        <Sparkles className="w-3 h-3 text-brand-purple" />
                        <span>Interactive Step Preview</span>
                      </div>
                    ) : (
                      <div className="px-4 py-1.5 rounded-full bg-brand-purple text-white text-[11px] font-bold flex items-center gap-1.5 shadow-2xl animate-bounce">
                        <Play className="w-3 h-3 fill-white" />
                        <span>Click Anywhere to Start Tour</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
