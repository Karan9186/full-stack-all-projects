'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { IDemoElement, HotspotConfig } from '@/types/demo';
import { ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react';
import {
  calculateHotspotPosition,
  HOTSPOT_WIDTH_TOKENS,
} from '@/lib/runtime/hotspotPositioningEngine';
import { PointerRenderer } from './PointerRenderer';

interface HotspotMarkerProps {
  element: IDemoElement;
  isSelected?: boolean;
  isEditor?: boolean;
  stepNumber?: number;
  totalSteps?: number;
  onSelect?: () => void;
  onMove?: (x: number, y: number) => void;
  onResize?: (width: number, height: number, x: number, y: number) => void;
  onAction?: (actionType: string, target?: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const HotspotMarker: React.FC<HotspotMarkerProps> = ({
  element,
  isSelected = false,
  isEditor = false,
  stepNumber,
  totalSteps,
  onSelect,
  onMove,
  onResize,
  onAction,
  containerRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [justDropped, setJustDropped] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(true);
  const [isCardRevealed, setIsCardRevealed] = useState(isEditor ? true : false);

  // Synchronize card entrance with pointer animation phase in preview
  useEffect(() => {
    if (isEditor) {
      setIsCardRevealed(true);
      return;
    }
    // In preview mode: reset card to entrance state then reveal on pointer click or fallback timeout
    setIsCardRevealed(false);
    const pointerStyle = element.hotspotConfig?.appearance?.pointerStyle || 'beacon';
    const fallbackDelay = pointerStyle === 'beacon' || pointerStyle === 'target' ? 280 : 640;
    const timer = setTimeout(() => {
      setIsCardRevealed(true);
    }, fallbackDelay);
    return () => clearTimeout(timer);
  }, [element.id, (element as any)._id, stepNumber, element.hotspotConfig?.appearance?.pointerStyle, isEditor]);

  const handlePointerClick = useCallback(() => {
    setIsCardRevealed(true);
  }, []);

  const handleActionComplete = useCallback(() => {
    setIsCardRevealed(true);
  }, []);

  // Measure container dimensions for boundary engine
  const [containerSize, setContainerSize] = useState({ width: 800, height: 500 });

  // Measure content dimensions dynamically to prevent overflow
  const calloutRef = useRef<HTMLDivElement>(null);
  const [measuredContentSize, setMeasuredContentSize] = useState({ width: 320, height: 160 });

  const config: HotspotConfig = element.hotspotConfig || {
    type: 'pointer',
    content: {
      text: element.content || 'Add some hotspot text here.',
      textAlign: 'left',
    },
    appearance: {
      background: element.style?.backgroundColor || '#5B5CE2',
      textColor: element.style?.color || '#ffffff',
      backdrop: false,
      borderRadius: 'rounded',
      width: 'medium',
      animation: 'ping',
      pointerStyle: 'beacon',
    },
    visibility: 'always',
    navigation: {
      showNext: true,
      nextButton: {
        enabled: true,
        text: 'Continue',
        background: '#ffffff',
        textColor: '#5B5CE2',
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
  };

  const { position } = element;
  const isArea = config.type === 'area';
  const isPointer = !isArea;
  const isCallout = config.type === 'callout';

  // Keep container dimensions updated via ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setContainerSize({ width: rect.width, height: rect.height });
        }
      }
    };
    updateSize();

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(containerRef.current);
    window.addEventListener('resize', updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [containerRef]);

  // Dynamically re-measure callout content height when text, buttons or width token changes
  useLayoutEffect(() => {
    if (!calloutRef.current) return;
    const rect = calloutRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setMeasuredContentSize({
        width: rect.width,
        height: rect.height,
      });
    }
  }, [
    config.content.text,
    config.appearance.width,
    config.navigation.showNext,
    config.navigation.backButton?.enabled,
    config.navigation.nextButton?.text,
  ]);

  // Unified Positioning Engine execution (Same algorithm in Editor & Runtime)
  const configuredWidth = HOTSPOT_WIDTH_TOKENS[config.appearance.width || 'medium'];
  const positioning = calculateHotspotPosition({
    anchor: { x: position.x, y: position.y },
    canvas: containerSize,
    content: {
      width: configuredWidth,
      height: measuredContentSize.height,
    },
    preferredPlacement: 'bottom',
    offset: 28,
    safeMargin: 12,
  });

  const {
    anchorPx,
    relativeOffsetPx,
    placement,
    arrowOffsetPx,
    arrowDirection,
    adjustedContentSize,
  } = positioning;

  // Drag handling across container
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditor || isResizing) return;
    e.stopPropagation();
    onSelect?.();
    setIsDragging(true);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const currentPxX = (position.x / 100) * rect.width;
      const currentPxY = (position.y / 100) * rect.height;
      setDragOffset({
        x: e.clientX - (rect.left + currentPxX),
        y: e.clientY - (rect.top + currentPxY),
      });
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left - dragOffset.x;
      const rawY = e.clientY - rect.top - dragOffset.y;

      const pctX = Math.round((rawX / rect.width) * 100);
      const pctY = Math.round((rawY / rect.height) * 100);

      // Boundary clamping inside canvas: allow reaching every edge while preventing escape
      const clampedX = Math.min(98.5, Math.max(1.5, pctX));
      const clampedY = Math.min(98.5, Math.max(1.5, pctY));

      onMove?.(clampedX, clampedY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setJustDropped(true);
      setTimeout(() => setJustDropped(false), 450);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onMove, containerRef, position]);

  // Area resize handling
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = (position.x / 100) * rect.width;
      const currentY = (position.y / 100) * rect.height;

      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      let newWidth = position.width || 30;
      let newHeight = position.height || 20;

      if (isResizing.includes('r')) {
        newWidth = Math.max(10, Math.min(90, Math.round(((cursorX - currentX) / rect.width) * 100)));
      }
      if (isResizing.includes('b')) {
        newHeight = Math.max(8, Math.min(90, Math.round(((cursorY - currentY) / rect.height) * 100)));
      }

      onResize?.(newWidth, newHeight, position.x, position.y);
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onResize, containerRef, position]);

  // Border radius tokens
  const radiusClasses = {
    square: 'rounded-lg',
    rounded: 'rounded-2xl',
    pill: 'rounded-3xl',
  }[config.appearance.borderRadius || 'rounded'];

  // Animation classes operating purely on visual pulse/ping without shifting position
  const getAnimationClass = () => {
    switch (config.appearance.animation) {
      case 'ping':
        return 'animate-ping';
      case 'pulse':
        return 'animate-pulse';
      case 'bounce':
        return 'animate-bounce';
      default:
        return '';
    }
  };

  // Text alignment classes
  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[config.content.textAlign || 'left'];

  // Distances to canvas edges for alignment guides in editor
  const topPx = Math.max(0, anchorPx.y);
  const bottomPx = Math.max(0, Math.round(containerSize.height - anchorPx.y));
  const leftPx = Math.max(0, anchorPx.x);
  const rightPx = Math.max(0, Math.round(containerSize.width - anchorPx.x));

  return (
    <div
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: isArea ? 'none' : 'translate(0, 0)',
        width: isArea ? `${position.width || 25}%` : '0px',
        height: isArea ? `${position.height || 18}%` : '0px',
        transition: isDragging
          ? 'none'
          : 'left 0.35s cubic-bezier(0.16, 1, 0.3, 1), top 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className={`absolute z-30 select-none ${
        isEditor ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      {/* Real-time Alignment Guidelines & Distance Badges (active during drag in editor) */}
      {isDragging && isEditor && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
          {/* Vertical full-span dashed guideline passing through dot center */}
          <div
            style={{
              position: 'absolute',
              left: '0px',
              top: `-${topPx}px`,
              height: `${containerSize.height}px`,
              transform: 'translateX(-50%)',
            }}
            className="w-0 border-l border-dashed border-[#5B5CE2] pointer-events-none"
          >
            {/* Top distance badge (only show if clearance >= 35px to prevent badge edge clipping) */}
            {topPx > 35 && (
              <div
                style={{
                  position: 'absolute',
                  top: `${Math.max(16, topPx * 0.45)}px`,
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                className="px-2 py-0.5 rounded-md bg-[#5B5CE2] text-white text-[11px] font-bold font-mono shadow-md whitespace-nowrap"
              >
                {topPx}px
              </div>
            )}

            {/* Bottom distance badge */}
            {bottomPx > 35 && (
              <div
                style={{
                  position: 'absolute',
                  top: `${topPx + Math.max(20, bottomPx * 0.45)}px`,
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                className="px-2 py-0.5 rounded-md bg-[#5B5CE2] text-white text-[11px] font-bold font-mono shadow-md whitespace-nowrap"
              >
                {bottomPx}px
              </div>
            )}
          </div>

          {/* Horizontal full-span dashed guideline passing through dot center */}
          <div
            style={{
              position: 'absolute',
              top: '0px',
              left: `-${leftPx}px`,
              width: `${containerSize.width}px`,
              transform: 'translateY(-50%)',
            }}
            className="h-0 border-t border-dashed border-[#5B5CE2] pointer-events-none"
          >
            {/* Left distance badge (only show if clearance >= 35px) */}
            {leftPx > 35 && (
              <div
                style={{
                  position: 'absolute',
                  left: `${Math.max(16, leftPx * 0.4)}px`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                className="px-2 py-0.5 rounded-md bg-[#5B5CE2] text-white text-[11px] font-bold font-mono shadow-md whitespace-nowrap"
              >
                {leftPx}px
              </div>
            )}

            {/* Right distance badge */}
            {rightPx > 35 && (
              <div
                style={{
                  position: 'absolute',
                  left: `${leftPx + Math.max(20, rightPx * 0.45)}px`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                className="px-2 py-0.5 rounded-md bg-[#5B5CE2] text-white text-[11px] font-bold font-mono shadow-md whitespace-nowrap"
              >
                {rightPx}px
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1. AREA HOTSPOT MODE (Supademo Precision Viewfinder Styling) */}
      {isArea && (
        <div
          onMouseDown={isEditor ? handleMouseDown : undefined}
          onClick={(e) => {
            e.stopPropagation();
            if (!isEditor) {
              const targetAction = config.navigation.nextButton?.action || 'nextStep';
              const targetTarget = config.navigation.nextButton?.target;
              onAction?.(targetAction, targetTarget);
              onSelect?.();
            } else {
              onSelect?.();
            }
          }}
          style={{
            backgroundColor: isEditor
              ? `${config.appearance.background}18`
              : `${config.appearance.background}15`,
            borderColor: config.appearance.background,
          }}
          className={`w-full h-full relative rounded-2xl transition-all ${
            isEditor
              ? isSelected
                ? 'border-2 border-[#5B5CE2] ring-3 ring-[#5B5CE2]/35 shadow-xl cursor-grab active:cursor-grabbing backdrop-blur-[1px]'
                : 'border-2 border-dashed border-[#5B5CE2]/65 hover:border-solid hover:bg-[#5B5CE2]/20 cursor-grab active:cursor-grabbing'
              : 'border-2 border-[#5B5CE2] bg-[#5B5CE2]/15 hover:bg-[#5B5CE2]/25 animate-area-glow shadow-[0_0_24px_rgba(91,92,226,0.3)] hover:shadow-[0_0_36px_rgba(91,92,226,0.55)] cursor-pointer group backdrop-blur-[1px]'
          }`}
        >
          {/* Viewfinder precision corner brackets matching Supademo/Storylane */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white rounded-tl-sm pointer-events-none drop-shadow-sm" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white rounded-tr-sm pointer-events-none drop-shadow-sm" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white rounded-bl-sm pointer-events-none drop-shadow-sm" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white rounded-br-sm pointer-events-none drop-shadow-sm" />

          {/* Label Tag (Editor only) */}
          {isEditor && (
            <div
              style={{
                backgroundColor: config.appearance.background,
                color: config.appearance.textColor,
              }}
              className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md pointer-events-none flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>{config.content.text || 'Hotspot Area'}</span>
            </div>
          )}

          {/* Centered Beacon in Preview / Viewer mode (Supademo aesthetic) */}
          {!isEditor && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                style={{ backgroundColor: config.appearance.background }}
                className="w-10 h-10 rounded-full animate-hotspot-radar-1 opacity-40 absolute"
              />
              <span
                style={{ backgroundColor: config.appearance.background }}
                className="w-8 h-8 rounded-full animate-hotspot-radar-2 opacity-30 absolute"
              />
              <div
                style={{
                  backgroundColor: config.appearance.background,
                  boxShadow: `0 0 0 2px #ffffff, 0 3px 12px ${config.appearance.background}60`,
                }}
                className="w-5 h-5 rounded-full flex items-center justify-center relative z-10 group-hover:scale-115 transition-transform"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white pointer-events-none" />
              </div>

              {/* Hover guidance tooltip badge */}
              <div className="absolute -bottom-7 px-2.5 py-0.5 rounded-full bg-[#0f0f1a]/90 backdrop-blur-md text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex items-center gap-1">
                <span>Click here</span>
              </div>
            </div>
          )}

          {/* Area Resize Handles (Editor only) */}
          {isEditor && isSelected && (
            <>
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsResizing('br');
                }}
                className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-[#5B5CE2] rounded-full cursor-se-resize shadow-xs"
              />
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsResizing('r');
                }}
                className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#5B5CE2] rounded-full cursor-e-resize shadow-xs"
              />
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsResizing('b');
                }}
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-[#5B5CE2] rounded-full cursor-s-resize shadow-xs"
              />
            </>
          )}
        </div>
      )}

      {/* 2. POINTER OR CALLOUT HOTSPOT MODE */}
      {!isArea && (
        <div className="relative">
          {/* Floating Callout Bubble positioned via HotspotPositioningEngine */}
          {(isOpen || config.visibility === 'always') && (
            <div
              ref={calloutRef}
              onMouseDown={handleMouseDown}
              style={{
                position: 'absolute',
                left: `${relativeOffsetPx.x}px`,
                top: `${relativeOffsetPx.y}px`,
                width: `${adjustedContentSize.width}px`,
                maxWidth: 'calc(100vw - 32px)',
                backgroundColor: config.appearance.background,
                color: config.appearance.textColor || '#ffffff',
                border: 'none',
                transform: isDragging
                  ? 'scale(0.92)'
                  : !isCardRevealed && !isEditor
                  ? 'scale(0.92) translateY(6px)'
                  : 'scale(1) translateY(0)',
                opacity: isDragging ? 0 : !isCardRevealed && !isEditor ? 0 : 1,
                pointerEvents: isDragging || (!isCardRevealed && !isEditor) ? 'none' : 'auto',
                transition: isDragging
                  ? 'opacity 0.15s ease-out, transform 0.15s ease-out'
                  : 'left 0.35s cubic-bezier(0.16, 1, 0.3, 1), top 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1), transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
              }}
              className={`p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.55)] ${radiusClasses} border-0 border-none outline-none select-none text-left ${
                isSelected && isEditor ? 'ring-2 ring-white/60 shadow-2xl' : ''
              }`}
            >
              {/* Dynamic Callout Arrow Pointer connecting to anchor dot */}
              {isPointer && (
                <div
                  style={{
                    position: 'absolute',
                    pointerEvents: 'none',
                    border: 'none',
                    ...(arrowDirection === 'up'
                      ? {
                          top: '-9px',
                          left: `${arrowOffsetPx}px`,
                          transform: 'translateX(-50%)',
                        }
                      : arrowDirection === 'down'
                      ? {
                          bottom: '-9px',
                          left: `${arrowOffsetPx}px`,
                          transform: 'translateX(-50%)',
                        }
                      : arrowDirection === 'left'
                      ? {
                          left: '-9px',
                          top: `${arrowOffsetPx}px`,
                          transform: 'translateY(-50%)',
                        }
                      : {
                          right: '-9px',
                          top: `${arrowOffsetPx}px`,
                          transform: 'translateY(-50%)',
                        }),
                    transition: 'left 0.25s ease-out, top 0.25s ease-out',
                  }}
                >
                  {arrowDirection === 'up' && (
                    <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                      <polygon points="0,10 9,0 18,10" fill={config.appearance.background} />
                    </svg>
                  )}
                  {arrowDirection === 'down' && (
                    <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                      <polygon points="0,0 9,10 18,0" fill={config.appearance.background} />
                    </svg>
                  )}
                  {arrowDirection === 'left' && (
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                      <polygon points="10,0 0,9 10,18" fill={config.appearance.background} />
                    </svg>
                  )}
                  {arrowDirection === 'right' && (
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                      <polygon points="0,0 10,9 0,18" fill={config.appearance.background} />
                    </svg>
                  )}
                </div>
              )}

              {/* STEP 2 OF 12 Label (Reference UI) */}
              <div className="flex items-center justify-between gap-2 mb-2 select-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#9394f8] select-none">
                  {config.content.badge ||
                    `STEP ${stepNumber || 1}${totalSteps ? ` OF ${totalSteps}` : ''}`}
                </span>
                {isEditor && (
                  <span className="text-[10px] text-white/50 font-mono">
                    {Math.round(position.x)}%, {Math.round(position.y)}%
                  </span>
                )}
              </div>

              {/* Headline Title */}
              <h4 className="text-[17px] sm:text-[18px] font-extrabold text-white tracking-[-0.015em] leading-snug mb-2 select-text break-words">
                {config.content.title ||
                  (config.content.text?.includes('\n')
                    ? config.content.text.split('\n')[0]
                    : config.content.text || element.content || 'Everything, at a glance')}
              </h4>

              {/* Subtitle Description */}
              {(() => {
                const desc =
                  config.content.description ||
                  (config.content.text?.includes('\n')
                    ? config.content.text.split('\n').slice(1).join('\n')
                    : '');
                if (!desc) return <div className="mb-4" />;
                return (
                  <p className="text-[13px] sm:text-[13.5px] text-white/80 leading-relaxed font-normal mb-5 select-text break-words">
                    {desc}
                  </p>
                );
              })()}

              {/* Action Buttons Row */}
              <div className="flex items-center justify-end gap-3 pt-1 mt-auto">
                {/* Secondary / Skip button */}
                {config.navigation.backButton?.enabled ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction?.(
                        config.navigation.backButton?.action || 'previousStep',
                        config.navigation.backButton?.target
                      );
                    }}
                    className="text-white/70 hover:text-white text-xs font-semibold px-2 py-1.5 transition-colors cursor-pointer mr-1"
                  >
                    {config.navigation.backButton.text || 'Back'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction?.('nextStep');
                    }}
                    className="text-white/70 hover:text-white text-xs font-semibold px-2 py-1.5 transition-colors cursor-pointer mr-1"
                  >
                    Skip
                  </button>
                )}

                {/* Primary Next > button */}
                {config.navigation.showNext && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction?.(
                        config.navigation.nextButton?.action || 'nextStep',
                        config.navigation.nextButton?.target
                      );
                    }}
                    style={{
                      backgroundColor:
                        config.navigation.nextButton?.background &&
                        config.navigation.nextButton.background !== '#ffffff'
                          ? config.navigation.nextButton.background
                          : '#5B5CE2',
                      color: config.navigation.nextButton?.textColor || '#ffffff',
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>
                      {config.navigation.nextButton?.text &&
                      config.navigation.nextButton.text !== 'Continue'
                        ? config.navigation.nextButton.text
                        : 'Next'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Target Pointer Anchor Marker - Centered precisely on Anchor (0, 0) */}
          {isPointer && (
            <div
              onMouseDown={isEditor ? handleMouseDown : undefined}
              onClick={(e) => {
                e.stopPropagation();
                setIsCardRevealed(true);
                if (!isEditor) {
                  onAction?.(
                    config.navigation.nextButton?.action || 'nextStep',
                    config.navigation.nextButton?.target
                  );
                  onSelect?.();
                } else {
                  onSelect?.();
                }
              }}
              style={{
                position: 'absolute',
                left: '0px',
                top: '0px',
                transform: 'translate(-50%, -50%)',
              }}
              className="cursor-pointer group flex items-center justify-center z-30"
            >
              <PointerRenderer
                style={config.appearance.pointerStyle || 'beacon'}
                color={config.appearance.background || '#5B5CE2'}
                size={config.appearance.pointerAnimation?.size || 'md'}
                isEditor={isEditor}
                isDragging={isDragging}
                isSelected={isSelected}
                stepNumber={stepNumber}
                autoPlayMotion={!isEditor || isSelected}
                animationSettings={config.appearance.pointerAnimation}
                onPointerClick={handlePointerClick}
                onActionComplete={handleActionComplete}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
