'use client';

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { IDemoElement, HotspotConfig } from '@/types/demo';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import {
  calculateHotspotPosition,
  HOTSPOT_WIDTH_TOKENS,
} from '@/lib/runtime/hotspotPositioningEngine';

interface HotspotMarkerProps {
  element: IDemoElement;
  isSelected?: boolean;
  isEditor?: boolean;
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
  const isPointer = config.type === 'pointer';
  const isArea = config.type === 'area';
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

      {/* 1. AREA HOTSPOT MODE */}
      {isArea && (
        <div
          onMouseDown={handleMouseDown}
          style={{
            backgroundColor: `${config.appearance.background}25`,
            borderColor: config.appearance.background,
          }}
          className={`w-full h-full border-2 border-dashed relative rounded-xl transition-all ${
            isSelected
              ? 'ring-2 ring-[#5B5CE2] shadow-lg'
              : 'hover:border-solid hover:bg-black/10'
          }`}
        >
          {/* Label Tag */}
          <div
            style={{
              backgroundColor: config.appearance.background,
              color: config.appearance.textColor,
            }}
            className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-xs pointer-events-none"
          >
            {config.content.text || 'Hotspot Area'}
          </div>

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
                color: config.appearance.textColor,
                transform: `scale(${isDragging ? 0.92 : 1})`,
                opacity: isDragging ? 0 : 1,
                pointerEvents: isDragging ? 'none' : 'auto',
                transition: isDragging
                  ? 'opacity 0.15s ease-out, transform 0.15s ease-out'
                  : 'left 0.35s cubic-bezier(0.16, 1, 0.3, 1), top 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
              }}
              className={`p-4 sm:p-5 shadow-2xl ${radiusClasses} ${
                isSelected ? 'ring-2 ring-white/80 ring-offset-2' : ''
              } ${justDropped ? 'animate-in fade-in zoom-in-95 duration-300' : ''}`}
            >
              {/* Dynamic Callout Arrow Pointer connecting to anchor dot */}
              {isPointer && (
                <div
                  style={{
                    position: 'absolute',
                    pointerEvents: 'none',
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
                      <path d="M0 10 L9 1 L18 10 Z" fill={config.appearance.background} />
                    </svg>
                  )}
                  {arrowDirection === 'down' && (
                    <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                      <path d="M0 0 L9 9 L18 0 Z" fill={config.appearance.background} />
                    </svg>
                  )}
                  {arrowDirection === 'left' && (
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                      <path d="M10 0 L1 9 L10 18 Z" fill={config.appearance.background} />
                    </svg>
                  )}
                  {arrowDirection === 'right' && (
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                      <path d="M0 0 L9 9 L0 18 Z" fill={config.appearance.background} />
                    </svg>
                  )}
                </div>
              )}

              {/* Text Content */}
              <p
                className={`text-[13.5px] sm:text-[14.5px] font-bold leading-relaxed mb-3.5 select-text break-words overflow-wrap-anywhere ${textAlignClasses}`}
              >
                {config.content.text || 'Add some hotspot text here.'}
              </p>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between gap-2 pt-1">
                {/* Left: Edit (in editor) or Back button */}
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
                    style={{
                      backgroundColor: config.navigation.backButton.background,
                      color: config.navigation.backButton.textColor,
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{config.navigation.backButton.text || 'Back'}</span>
                  </button>
                ) : isEditor ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect?.();
                    }}
                    className="text-white/90 hover:text-white text-[13px] font-semibold underline underline-offset-2 cursor-pointer transition-colors"
                  >
                    Edit
                  </button>
                ) : (
                  <span />
                )}

                {/* Right: Next / Continue CTA Button */}
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
                          : 'rgba(255, 255, 255, 0.22)',
                      color: config.navigation.nextButton?.textColor || '#ffffff',
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm hover:bg-white/30 transition-all active:scale-95 cursor-pointer ml-auto min-w-[34px]"
                    title={config.navigation.nextButton?.text || 'Continue'}
                  >
                    {config.navigation.nextButton?.text &&
                    config.navigation.nextButton.text !== 'Continue' &&
                    config.navigation.nextButton.text !== '' ? (
                      <span>{config.navigation.nextButton.text}</span>
                    ) : null}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Target Pointer Circle Dot (●) - Centered precisely on Anchor (0, 0) */}
          {isPointer && (
            <div
              onMouseDown={handleMouseDown}
              style={{
                position: 'absolute',
                left: '0px',
                top: '0px',
                transform: 'translate(-50%, -50%)',
              }}
              className="cursor-pointer group flex items-center justify-center z-30"
            >
              {/* Animation Ping Ring */}
              {config.appearance.animation === 'ping' && !isDragging && (
                <span
                  style={{ backgroundColor: config.appearance.background }}
                  className="absolute -inset-2.5 rounded-full animate-ping opacity-60 pointer-events-none"
                />
              )}

              {/* Target Circle Dot */}
              <div
                style={{
                  backgroundColor: config.appearance.background,
                }}
                className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-white transition-transform duration-150 ${
                  isDragging
                    ? 'scale-125 ring-4 ring-[#5B5CE2]/50 shadow-2xl'
                    : isSelected
                    ? 'scale-115 ring-4 ring-[#5B5CE2]/40'
                    : 'group-hover:scale-110'
                } ${config.appearance.animation !== 'ping' && !isDragging ? getAnimationClass() : ''}`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
