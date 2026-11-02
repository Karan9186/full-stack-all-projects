'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IDemoElement, HotspotConfig } from '@/types/demo';
import { SupademoHotspotCard } from './SupademoHotspotCard';
import { PRIMARY_COLOR, THEME_COLORS } from '@/lib/constants/theme';

export interface CalloutCardElementProps {
  element: IDemoElement;
  isSelected?: boolean;
  isEditor?: boolean;
  isVisible?: boolean;
  stepNumber?: number;
  totalSteps?: number;
  onSelect?: () => void;
  onMoveTarget?: (x: number, y: number) => void;
  onMoveCard?: (offset: { x: number; y: number }) => void;
  onUpdate?: (updates: Partial<IDemoElement>) => void;
  onAction?: (actionType: string, target?: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const CalloutCardElement: React.FC<CalloutCardElementProps> = ({
  element,
  isSelected = false,
  isEditor = false,
  isVisible = true,
  stepNumber,
  totalSteps,
  onSelect,
  onMoveTarget,
  onUpdate,
  onAction,
  containerRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 800, height: 500 });

  const config: HotspotConfig = element.hotspotConfig || {
    type: 'callout',
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

  // Track container dimensions for dragging bounds
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

  // Handle Dragging the Callout card in the editor
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

      // Clamping within editor canvas bounds
      nextX = Math.max(1, Math.min(99, nextX));
      nextY = Math.max(1, Math.min(99, nextY));

      onMoveTarget?.(Math.round(nextX * 10) / 10, Math.round(nextY * 10) / 10);
    },
    [isDragging, dragOffset, containerRef, onMoveTarget]
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
      {/* SUPADEMO STANDALONE FLOATING CALLOUT CARD (Identical vertical & horizontal anchor so switching from pointer never jumps) */}
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
          showArrow={false} // Clean standalone card
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
