'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IDemoElement, HotspotConfig } from '@/types/demo';
import { PointerRenderer } from './PointerRenderer';
import { SupademoHotspotCard } from './SupademoHotspotCard';
import { PRIMARY_COLOR, THEME_COLORS } from '@/lib/constants/theme';

export interface HotspotMarkerElementProps {
  element: IDemoElement;
  isSelected?: boolean;
  isEditor?: boolean;
  isVisible?: boolean;
  stepNumber?: number;
  totalSteps?: number;
  onSelect?: () => void;
  onMove?: (x: number, y: number) => void;
  onUpdate?: (updates: Partial<IDemoElement>) => void;
  onAction?: (actionType: string, target?: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const HotspotMarkerElement: React.FC<HotspotMarkerElementProps> = ({
  element,
  isSelected = false,
  isEditor = false,
  isVisible = true,
  stepNumber,
  totalSteps,
  onSelect,
  onMove,
  onUpdate,
  onAction,
  containerRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 800, height: 500 });

  const config: HotspotConfig = element.hotspotConfig || {
    type: 'pointer',
    content: {
      text: element.content || 'Add some hotspot text here.',
      textAlign: 'left',
    },
    appearance: {
      background: element.style?.backgroundColor || PRIMARY_COLOR,
      textColor: element.style?.color || THEME_COLORS.white,
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
        text: 'Next',
        background: PRIMARY_COLOR,
        textColor: 'white',
        action: 'nextStep',
      },
    },
  };

  const { position } = element;

  // Track container dimensions for guidelines
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
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef]);

  // Dragging interaction for Hotspot Marker (dragging pin or card)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditor) return;
    e.stopPropagation();
    onSelect?.();

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentPxX = (position.x / 100) * rect.width;
    const currentPxY = (position.y / 100) * rect.height;

    setDragOffset({
      x: e.clientX - currentPxX,
      y: e.clientY - currentPxY,
    });
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentPxX = e.clientX - dragOffset.x;
      const currentPxY = e.clientY - dragOffset.y;

      let nextX = (currentPxX / rect.width) * 100;
      let nextY = (currentPxY / rect.height) * 100;

      // Clamp within canvas boundaries
      nextX = Math.max(1, Math.min(99, nextX));
      nextY = Math.max(1, Math.min(99, nextY));

      onMove?.(Math.round(nextX * 10) / 10, Math.round(nextY * 10) / 10);
    },
    [isDragging, dragOffset, containerRef, onMove]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const pointerColor =
    config.appearance.pointerColor ||
    (config.appearance.background &&
    !['#0f0f1a', '#121214', '#000000', '#1f2937', '#111827'].includes(
      config.appearance.background.toLowerCase()
    )
      ? config.appearance.background
      : PRIMARY_COLOR);

  const leftPx = Math.round((position.x / 100) * containerSize.width);
  const topPx = Math.round((position.y / 100) * containerSize.height);
  const rightPx = Math.max(0, containerSize.width - leftPx);
  const bottomPx = Math.max(0, containerSize.height - topPx);

  const isCustomPointer =
    config.appearance.pointerStyle &&
    !['beacon', 'bullseye'].includes(config.appearance.pointerStyle);

  // Auto-flip tooltip above pin if too close to bottom of canvas
  const isNearBottom = position.y > 65;

  return (
    <div
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        position: 'absolute',
        width: 32,
        height: 32,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 45 : 30,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      className="select-none flex items-center justify-center pointer-events-none"
    >
      {/* Editor Alignment Guidelines during drag (anchored to exact center 16px, 16px) */}
      {isDragging && isEditor && (
        <div className="absolute pointer-events-none select-none z-10" style={{ left: 16, top: 16 }}>
          {/* Vertical full-span dashed guideline */}
          <div
            style={{
              position: 'absolute',
              top: `-${topPx}px`,
              left: '0px',
              height: `${containerSize.height}px`,
              transform: 'translateX(-50%)',
            }}
            className="w-0 border-l border-dashed border-brand-purple pointer-events-none"
          >
            {topPx > 35 && (
              <div
                style={{
                  position: 'absolute',
                  top: `${Math.max(16, topPx * 0.4)}px`,
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: PRIMARY_COLOR,
                }}
                className="px-2 py-0.5 rounded-md text-white text-[11px] font-bold font-mono shadow-md whitespace-nowrap"
              >
                {topPx}px
              </div>
            )}
            {bottomPx > 35 && (
              <div
                style={{
                  position: 'absolute',
                  top: `${topPx + Math.max(20, bottomPx * 0.45)}px`,
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: PRIMARY_COLOR,
                }}
                className="px-2 py-0.5 rounded-md text-white text-[11px] font-bold font-mono shadow-md whitespace-nowrap"
              >
                {bottomPx}px
              </div>
            )}
          </div>

          {/* Horizontal full-span dashed guideline */}
          <div
            style={{
              position: 'absolute',
              top: '0px',
              left: `-${leftPx}px`,
              width: `${containerSize.width}px`,
              transform: 'translateY(-50%)',
            }}
            className="h-0 border-t border-dashed border-brand-purple pointer-events-none"
          >
            {leftPx > 35 && (
              <div
                style={{
                  position: 'absolute',
                  left: `${Math.max(16, leftPx * 0.4)}px`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: PRIMARY_COLOR,
                }}
                className="px-2 py-0.5 rounded-md text-white text-[11px] font-bold font-mono shadow-md whitespace-nowrap"
              >
                {leftPx}px
              </div>
            )}
            {rightPx > 35 && (
              <div
                style={{
                  position: 'absolute',
                  left: `${leftPx + Math.max(20, rightPx * 0.45)}px`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: PRIMARY_COLOR,
                }}
                className="px-2 py-0.5 rounded-md text-white text-[11px] font-bold font-mono shadow-md whitespace-nowrap"
              >
                {rightPx}px
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1. SUPADEMO TARGET PIN DOT */}
      <div
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
          if (!isEditor) {
            const action = config.navigation.nextButton?.action || 'nextStep';
            const target = config.navigation.nextButton?.target;
            onAction?.(action, target);
          }
        }}
        className="group relative flex items-center justify-center cursor-pointer pointer-events-auto z-40 shrink-0 w-8 h-8"
      >
        {isCustomPointer ? (
          <PointerRenderer
            style={config.appearance.pointerStyle!}
            color={pointerColor}
            size={config.appearance.pointerAnimation?.size || 'md'}
            isEditor={isEditor}
            isDragging={isDragging}
            isSelected={isSelected}
            stepNumber={stepNumber}
            autoPlayMotion={!isEditor}
            animationSettings={config.appearance.pointerAnimation}
          />
        ) : (
          /* Supademo Pin Dot with Water Drop Jump & Ripple Animation in Demo Time */
          <div className="relative flex items-center justify-center">
            {/* Water Surface Waves (Expanding on drop impact in demo time) */}
            {!isEditor && (
              <>
                <span
                  style={{ borderColor: pointerColor, backgroundColor: `${pointerColor}15` }}
                  className="absolute left-1/2 top-1/2 -ml-6 -mt-6 w-12 h-12 rounded-full border-2 animate-water-wave-primary pointer-events-none"
                />
                <span
                  style={{ borderColor: pointerColor, backgroundColor: `${pointerColor}0a` }}
                  className="absolute left-1/2 top-1/2 -ml-8 -mt-8 w-16 h-16 rounded-full border animate-water-wave-secondary pointer-events-none"
                />
                <span
                  style={{ backgroundColor: `${pointerColor}50` }}
                  className="absolute left-1/2 -ml-3 bottom-0 w-6 h-2 rounded-full animate-water-surface-pool pointer-events-none filter blur-[1px]"
                />
              </>
            )}

            {/* Droplet (With jumping water physics in demo time) */}
            <div className={!isEditor ? 'animate-water-drop-jump' : ''}>
              <div
                style={{
                  backgroundColor: pointerColor,
                  boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.95), 0 4px 14px rgba(0, 0, 0, 0.35)',
                }}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isDragging ? 'scale-115' : isSelected ? 'scale-110 ring-2 ring-brand-purple' : 'hover:scale-110'
                }`}
              >
                <span className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_2px_white]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. SUPADEMO CONNECTED TOOLTIP CARD (Constant fixed anchor offset so changing pointer styles never moves the card) */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 ${
          isNearBottom ? 'bottom-[calc(100%+6px)]' : 'top-[calc(100%+6px)]'
        } z-30 pointer-events-auto`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
      >
        <SupademoHotspotCard
          config={config}
          isSelected={isSelected}
          isEditor={isEditor}
          showArrow={true}
          arrowPosition={isNearBottom ? 'bottom' : 'top'}
          stepNumber={stepNumber}
          totalSteps={totalSteps}
          onDragStart={handleMouseDown}
          onCardClick={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
          onNextClick={(e) => {
            e.stopPropagation();
            const action = config.navigation.nextButton?.action || 'nextStep';
            const target = config.navigation.nextButton?.target;
            onAction?.(action, target);
          }}
          onBackClick={(e) => {
            e.stopPropagation();
            const action = config.navigation.backButton?.action || 'previousStep';
            const target = config.navigation.backButton?.target;
            onAction?.(action, target);
          }}
          onResizeWidth={(newWidth) => {
            onUpdate?.({
              hotspotConfig: {
                ...config,
                appearance: {
                  ...config.appearance,
                  customWidth: newWidth,
                },
              },
            });
          }}
          onResizeDimensions={(newWidth, newHeight) => {
            onUpdate?.({
              hotspotConfig: {
                ...config,
                appearance: {
                  ...config.appearance,
                  customWidth: newWidth,
                  customHeight: typeof newHeight === 'number' ? newHeight : undefined,
                },
              },
            });
          }}
        />
      </div>
    </div>
  );
};
