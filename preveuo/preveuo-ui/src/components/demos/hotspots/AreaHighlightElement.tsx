'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IDemoElement, HotspotConfig } from '@/types/demo';
import { SupademoHotspotCard } from './SupademoHotspotCard';
import { PRIMARY_COLOR, THEME_COLORS } from '@/lib/constants/theme';
import { Square } from 'lucide-react';

export interface AreaHighlightElementProps {
  element: IDemoElement;
  isSelected?: boolean;
  isEditor?: boolean;
  isVisible?: boolean;
  stepNumber?: number;
  totalSteps?: number;
  onSelect?: () => void;
  onMove?: (x: number, y: number) => void;
  onResize?: (width: number, height: number, x: number, y: number) => void;
  onUpdate?: (updates: Partial<IDemoElement>) => void;
  onAction?: (actionType: string, target?: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const AreaHighlightElement: React.FC<AreaHighlightElementProps> = ({
  element,
  isSelected = false,
  isEditor = false,
  isVisible = true,
  stepNumber,
  totalSteps,
  onSelect,
  onMove,
  onResize,
  onUpdate,
  onAction,
  containerRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ clientX: 0, clientY: 0, startX: 0, startY: 0, startW: 0, startH: 0 });

  const config: HotspotConfig = element.hotspotConfig || {
    type: 'area',
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
      animation: 'none',
    },
    area: {
      fillColor: PRIMARY_COLOR,
      fillOpacity: 0.14,
      borderColor: PRIMARY_COLOR,
      borderWidth: 2,
      borderStyle: 'solid',
      borderRadius: 14,
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
  const areaW = position.width || 30;
  const areaH = position.height || 20;

  const cardBg = config.appearance.background || PRIMARY_COLOR;
  const borderColor = config.area?.borderColor || cardBg;
  const fillColor = config.area?.fillColor || cardBg;
  const fillOpacity = config.area?.fillOpacity ?? 0.14;
  const borderWidth = config.area?.borderWidth ?? 2;
  const borderStyle = config.area?.borderStyle || 'solid';
  const borderRadius = config.area?.borderRadius ?? 14;
  const isNearBottom = (position.y + areaH) > 75;

  // Handle Dragging Area Box
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditor) return;
    e.stopPropagation();
    onSelect?.();

    setDragStart({
      clientX: e.clientX,
      clientY: e.clientY,
      startX: position.x,
      startY: position.y,
      startW: areaW,
      startH: areaH,
    });
    setIsDragging(true);
  };

  // Handle Resize initiation for the Area Box
  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    if (!isEditor) return;
    e.stopPropagation();
    onSelect?.();

    setDragStart({
      clientX: e.clientX,
      clientY: e.clientY,
      startX: position.x,
      startY: position.y,
      startW: areaW,
      startH: areaH,
    });
    setIsResizing(handle);
  };

  // MouseMove for moving or resizing the Area Box
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaXPct = ((e.clientX - dragStart.clientX) / rect.width) * 100;
      const deltaYPct = ((e.clientY - dragStart.clientY) / rect.height) * 100;

      if (isDragging) {
        let newX = dragStart.startX + deltaXPct;
        let newY = dragStart.startY + deltaYPct;

        newX = Math.max(0, Math.min(100 - areaW, newX));
        newY = Math.max(0, Math.min(100 - areaH, newY));

        onMove?.(Math.round(newX * 10) / 10, Math.round(newY * 10) / 10);
      } else if (isResizing) {
        let newX = dragStart.startX;
        let newY = dragStart.startY;
        let newW = dragStart.startW;
        let newH = dragStart.startH;

        if (isResizing.includes('e')) {
          newW = Math.max(6, Math.min(100 - newX, dragStart.startW + deltaXPct));
        }
        if (isResizing.includes('s')) {
          newH = Math.max(6, Math.min(100 - newY, dragStart.startH + deltaYPct));
        }
        if (isResizing.includes('w')) {
          const maxLeftMove = dragStart.startX;
          const clampedDelta = Math.max(-maxLeftMove, Math.min(dragStart.startW - 6, deltaXPct));
          newX = dragStart.startX + clampedDelta;
          newW = dragStart.startW - clampedDelta;
        }
        if (isResizing.includes('n')) {
          const maxTopMove = dragStart.startY;
          const clampedDelta = Math.max(-maxTopMove, Math.min(dragStart.startH - 6, deltaYPct));
          newY = dragStart.startY + clampedDelta;
          newH = dragStart.startH - clampedDelta;
        }

        onResize?.(
          Math.round(newW * 10) / 10,
          Math.round(newH * 10) / 10,
          Math.round(newX * 10) / 10,
          Math.round(newY * 10) / 10
        );
      }
    },
    [isDragging, isResizing, dragStart, areaW, areaH, containerRef, onMove, onResize]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${areaW}%`,
        height: `${areaH}%`,
        position: 'absolute',
        zIndex: isSelected ? 40 : 25,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      className="select-none"
    >
      {/* 1. SUPADEMO RECTANGULAR REGION HIGHLIGHT BOX */}
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
        style={{
          backgroundColor: fillColor,
          opacity: isEditor ? Math.max(0.18, fillOpacity) : fillOpacity,
          borderColor: borderColor,
          borderWidth: `${borderWidth}px`,
          borderStyle: borderStyle,
          borderRadius: `${borderRadius}px`,
        }}
        className={`w-full h-full relative transition-colors ${
          isEditor
            ? isSelected
              ? 'shadow-lg cursor-grab active:cursor-grabbing ring-1 ring-brand-purple/40'
              : 'hover:opacity-30 cursor-grab'
            : 'cursor-pointer hover:opacity-30 transition-opacity'
        }`}
      />

      {/* 2. SUPADEMO PRECISION VIEWFINDER CORNER BRACKETS [ ] */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {/* Top-Left Bracket */}
        <div
          style={{ borderColor: borderColor }}
          className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-[2.5px] border-l-[2.5px] rounded-tl-sm"
        />
        {/* Top-Right Bracket */}
        <div
          style={{ borderColor: borderColor }}
          className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-[2.5px] border-r-[2.5px] rounded-tr-sm"
        />
        {/* Bottom-Left Bracket */}
        <div
          style={{ borderColor: borderColor }}
          className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-[2.5px] border-l-[2.5px] rounded-bl-sm"
        />
        {/* Bottom-Right Bracket */}
        <div
          style={{ borderColor: borderColor }}
          className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-[2.5px] border-r-[2.5px] rounded-br-sm"
        />
      </div>



      {/* 3. RESIZE HANDLES (8-points) for the Area Box in Editor */}
      {isEditor && isSelected && (
        <>
          {/* NW Handle */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
            style={{ borderColor: borderColor }}
            className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 rounded-xs cursor-nwse-resize shadow-xs z-40 hover:scale-125 transition-transform"
          />
          {/* NE Handle */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
            style={{ borderColor: borderColor }}
            className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 rounded-xs cursor-nesw-resize shadow-xs z-40 hover:scale-125 transition-transform"
          />
          {/* SW Handle */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            style={{ borderColor: borderColor }}
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 rounded-xs cursor-nesw-resize shadow-xs z-40 hover:scale-125 transition-transform"
          />
          {/* SE Handle */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            style={{ borderColor: borderColor }}
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 rounded-xs cursor-nwse-resize shadow-xs z-40 hover:scale-125 transition-transform"
          />
          {/* N Handle */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'n')}
            style={{ borderColor: borderColor }}
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-white border rounded-full cursor-ns-resize z-40"
          />
          {/* S Handle */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 's')}
            style={{ borderColor: borderColor }}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-white border rounded-full cursor-ns-resize z-40"
          />
          {/* W Handle */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'w')}
            style={{ borderColor: borderColor }}
            className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 bg-white border rounded-full cursor-ew-resize z-40"
          />
          {/* E Handle */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            style={{ borderColor: borderColor }}
            className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 bg-white border rounded-full cursor-ew-resize z-40"
          />
        </>
      )}

      {/* 4. SUPADEMO CONNECTED TOOLTIP CARD (Centered below the Area Box) */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 ${
          isNearBottom ? 'bottom-full mb-3' : 'top-full mt-2.5'
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
