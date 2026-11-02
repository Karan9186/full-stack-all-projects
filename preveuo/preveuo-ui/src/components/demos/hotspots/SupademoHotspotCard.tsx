'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { HotspotConfig } from '@/types/demo';
import { PRIMARY_COLOR, THEME_COLORS } from '@/lib/constants/theme';
import { ArrowRight } from 'lucide-react';

export interface SupademoHotspotCardProps {
  config: HotspotConfig;
  isSelected?: boolean;
  isEditor?: boolean;
  showArrow?: boolean;
  arrowPosition?: 'top' | 'bottom' | 'left' | 'right';
  stepNumber?: number;
  totalSteps?: number;
  onNextClick?: (e: React.MouseEvent) => void;
  onBackClick?: (e: React.MouseEvent) => void;
  onCardClick?: (e: React.MouseEvent) => void;
  onResizeWidth?: (widthPx: number) => void;
  onResizeDimensions?: (widthPx: number, heightPx: number | 'auto') => void;
  onDragStart?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const SupademoHotspotCard: React.FC<SupademoHotspotCardProps> = ({
  config,
  isSelected = false,
  isEditor = false,
  showArrow = true,
  arrowPosition = 'top',
  stepNumber,
  totalSteps,
  onNextClick,
  onBackClick,
  onCardClick,
  onResizeWidth,
  onResizeDimensions,
  onDragStart,
  className = '',
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Compute card width: explicit customWidth or predefined tokens (Supademo default: 244px)
  const defaultWidth =
    config.appearance.customWidth ??
    (config.appearance.width === 'small'
      ? 200
      : config.appearance.width === 'large'
      ? 320
      : 244);

  // Compute card height: explicit customHeight or 'auto' (Supademo auto-fit)
  const defaultHeight: number | 'auto' = config.appearance.customHeight ?? 'auto';

  const [currentWidth, setCurrentWidth] = useState<number>(defaultWidth);
  const [currentHeight, setCurrentHeight] = useState<number | 'auto'>(defaultHeight);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({
    clientX: 0,
    clientY: 0,
    startWidth: defaultWidth,
    startHeight: 120,
  });

  const latestDimensionsRef = useRef<{ width: number; height: number | 'auto' }>({
    width: defaultWidth,
    height: defaultHeight,
  });

  useEffect(() => {
    setCurrentWidth(defaultWidth);
    latestDimensionsRef.current.width = defaultWidth;
  }, [defaultWidth]);

  useEffect(() => {
    setCurrentHeight(defaultHeight);
    latestDimensionsRef.current.height = defaultHeight;
  }, [defaultHeight]);

  // Active rendered dimensions (Editor uses live drag state; Runtime / Preview uses configured dimensions directly)
  const activeWidth = isEditor ? currentWidth : defaultWidth;
  const activeHeight = isEditor ? currentHeight : defaultHeight;

  // Handle Resize initiation from selection handles (supports Width & Height expansion!)
  const handleHandleMouseDown = (e: React.MouseEvent, handle: string) => {
    if (!isEditor) return;
    e.stopPropagation();
    setIsResizing(handle);

    const rect = cardRef.current?.getBoundingClientRect();
    const actualH = rect ? rect.height : typeof currentHeight === 'number' ? currentHeight : 120;

    setResizeStart({
      clientX: e.clientX,
      clientY: e.clientY,
      startWidth: currentWidth,
      startHeight: actualH,
    });
  };

  const handleResizeMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const deltaX = e.clientX - resizeStart.clientX;
      const deltaY = e.clientY - resizeStart.clientY;

      let newW = resizeStart.startWidth;
      let newH: number | 'auto' = resizeStart.startHeight;

      // 1. Horizontal Resizing (E, W, Corner handles)
      if (isResizing.includes('e')) {
        newW = Math.max(160, Math.min(600, Math.round(resizeStart.startWidth + deltaX)));
      } else if (isResizing.includes('w')) {
        newW = Math.max(160, Math.min(600, Math.round(resizeStart.startWidth - deltaX)));
      }

      // 2. Vertical Resizing (S, N, Corner handles - allows expanding height-wise!)
      if (isResizing.includes('s')) {
        newH = Math.max(70, Math.min(600, Math.round(resizeStart.startHeight + deltaY)));
      } else if (isResizing.includes('n')) {
        newH = Math.max(70, Math.min(600, Math.round(resizeStart.startHeight - deltaY)));
      }

      latestDimensionsRef.current = { width: newW, height: newH };
      setCurrentWidth(newW);
      if (newH !== resizeStart.startHeight) {
        setCurrentHeight(newH);
      }

      onResizeDimensions?.(newW, newH);
    },
    [isResizing, resizeStart, onResizeDimensions]
  );

  const handleResizeMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(null);
      onResizeDimensions?.(
        latestDimensionsRef.current.width,
        latestDimensionsRef.current.height
      );
    }
  }, [isResizing, onResizeDimensions]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMouseMove);
      window.addEventListener('mouseup', handleResizeMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [isResizing, handleResizeMouseMove, handleResizeMouseUp]);

  const cardBg = config.appearance.background || PRIMARY_COLOR;
  const textColor = config.appearance.textColor || THEME_COLORS.white;

  const radiusClasses =
    config.appearance.borderRadius === 'square'
      ? 'rounded-lg'
      : config.appearance.borderRadius === 'pill'
      ? 'rounded-3xl'
      : 'rounded-2xl';

  const textAlignClass =
    config.content.textAlign === 'center'
      ? 'text-center'
      : config.content.textAlign === 'right'
      ? 'text-right'
      : 'text-left';

  // Extract clean title and clean description without duplicates
  const displayTitle =
    config.content.title !== undefined
      ? config.content.title
      : config.content.text?.includes('\n')
      ? config.content.text.split('\n')[0]
      : config.content.text || 'Add some hotspot text here.';

  const displayDescription =
    config.content.description !== undefined
      ? config.content.description
      : config.content.text?.includes('\n')
      ? config.content.text.split('\n').slice(1).join('\n')
      : undefined;

  return (
    <div
      ref={cardRef}
      onClick={onCardClick}
      onMouseDown={onDragStart}
      style={{
        width: `${activeWidth}px`,
        height: activeHeight === 'auto' ? 'auto' : `${activeHeight}px`,
        minHeight: activeHeight === 'auto' ? undefined : `${activeHeight}px`,
        backgroundColor: cardBg,
        color: textColor,
        boxShadow:
          '0 18px 40px -8px rgba(0, 0, 0, 0.42), 0 4px 14px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.12)',
        ...style,
      }}
      className={`relative p-4 sm:p-5 ${radiusClasses} ${textAlignClass} select-none transition-shadow flex flex-col justify-between ${
        isEditor ? 'cursor-grab active:cursor-grabbing' : ''
      } ${className}`}
    >
      {/* 1. UPWARD/DOWNWARD ARROW WEDGE (z-35 sits cleanly above selection outline without clipping) */}
      {showArrow && arrowPosition === 'top' && (
        <div className="absolute -top-[7.5px] left-1/2 -translate-x-1/2 pointer-events-none z-35 leading-none">
          <svg width="18" height="8" viewBox="0 0 18 8" fill="none" className="drop-shadow-xs">
            <path d="M0 8 L9 0 L18 8 Z" fill={cardBg} />
          </svg>
        </div>
      )}

      {showArrow && arrowPosition === 'bottom' && (
        <div className="absolute -bottom-[7.5px] left-1/2 -translate-x-1/2 pointer-events-none z-35 leading-none">
          <svg width="18" height="8" viewBox="0 0 18 8" fill="none" className="drop-shadow-xs">
            <path d="M0 0 L9 8 L18 0 Z" fill={cardBg} />
          </svg>
        </div>
      )}

      {showArrow && arrowPosition === 'left' && (
        <div className="absolute -left-[7.5px] top-1/2 -translate-y-1/2 pointer-events-none z-35 leading-none">
          <svg width="8" height="18" viewBox="0 0 8 18" fill="none" className="drop-shadow-xs">
            <path d="M8 0 L0 9 L8 18 Z" fill={cardBg} />
          </svg>
        </div>
      )}

      {showArrow && arrowPosition === 'right' && (
        <div className="absolute -right-[7.5px] top-1/2 -translate-y-1/2 pointer-events-none z-35 leading-none">
          <svg width="8" height="18" viewBox="0 0 8 18" fill="none" className="drop-shadow-xs">
            <path d="M0 0 L8 9 L0 18 Z" fill={cardBg} />
          </svg>
        </div>
      )}

      {/* 2. CARD CONTENT CONTAINER (Title & Optional Description) */}
      <div className="flex-1">
        <h4 className="text-[14px] sm:text-[15px] font-semibold text-white leading-snug tracking-tight select-text">
          {displayTitle}
        </h4>

        {displayDescription && (
          <p className="text-[12px] sm:text-[13px] text-white/85 mt-1.5 leading-relaxed select-text">
            {displayDescription}
          </p>
        )}
      </div>

      {/* 3. BOTTOM ACTIONS ROW */}
      <div className="mt-3.5 flex items-center justify-between gap-2 shrink-0">
        {/* Optional Back / Skip Button */}
        {config.navigation.backButton?.enabled ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBackClick?.(e);
            }}
            className="text-[12px] font-medium text-white/75 hover:text-white transition-colors cursor-pointer px-1 py-0.5"
          >
            {config.navigation.backButton?.text || 'Back'}
          </button>
        ) : (
          <div />
        )}

        {/* Supademo Next Arrow Button (White right arrow in rounded square) */}
        {config.navigation.showNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNextClick?.(e);
            }}
            className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 transition-all flex items-center justify-center text-white cursor-pointer shadow-xs ml-auto group"
            title={config.navigation.nextButton?.text || 'Next'}
          >
            <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* 4. SUPADEMO SELECTION OUTLINE, 8 WHITE HANDLES & DIMENSION BADGE */}
      {isEditor && isSelected && (
        <>
          {/* Dashed outer border around card */}
          <div
            style={{ borderColor: cardBg }}
            className="absolute -inset-1.5 border border-dashed rounded-[20px] pointer-events-none z-20 opacity-80"
          />

          {/* 8 White Resize Handles (NW, N, NE, W, E, SW, S, SE - All fully draggable for width & height!) */}
          {/* NW - Top Left */}
          <div
            onMouseDown={(e) => handleHandleMouseDown(e, 'nw')}
            style={{ borderColor: cardBg }}
            className="absolute -top-3 -left-3 w-3.5 h-3.5 bg-white border rounded-xs shadow-xs cursor-nwse-resize z-40 hover:scale-125 transition-transform"
            title="Drag to resize width and height"
          />
          {/* N - Top Center (only shown when no top arrow wedge is present to prevent arrow obstruction) */}
          {(!showArrow || arrowPosition !== 'top') && (
            <div
              onMouseDown={(e) => handleHandleMouseDown(e, 'n')}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setCurrentHeight('auto');
                latestDimensionsRef.current.height = 'auto';
                onResizeDimensions?.(currentWidth, 'auto');
              }}
              style={{ borderColor: cardBg }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border rounded-xs shadow-xs cursor-ns-resize z-40 hover:scale-125 transition-transform"
              title="Drag to resize height (double click to reset to auto)"
            />
          )}
          {/* NE - Top Right */}
          <div
            onMouseDown={(e) => handleHandleMouseDown(e, 'ne')}
            style={{ borderColor: cardBg }}
            className="absolute -top-3 -right-3 w-3.5 h-3.5 bg-white border rounded-xs shadow-xs cursor-nesw-resize z-40 hover:scale-125 transition-transform"
            title="Drag to resize width and height"
          />
          {/* W - Middle Left */}
          <div
            onMouseDown={(e) => handleHandleMouseDown(e, 'w')}
            style={{ borderColor: cardBg }}
            className="absolute top-1/2 -left-3 -translate-y-1/2 w-3.5 h-3.5 bg-white border rounded-xs shadow-xs cursor-ew-resize z-40 hover:scale-125 transition-transform"
            title="Drag to resize width"
          />
          {/* E - Middle Right */}
          <div
            onMouseDown={(e) => handleHandleMouseDown(e, 'e')}
            style={{ borderColor: cardBg }}
            className="absolute top-1/2 -right-3 -translate-y-1/2 w-3.5 h-3.5 bg-white border rounded-xs shadow-xs cursor-ew-resize z-40 hover:scale-125 transition-transform"
            title="Drag to resize width"
          />
          {/* SW - Bottom Left */}
          <div
            onMouseDown={(e) => handleHandleMouseDown(e, 'sw')}
            style={{ borderColor: cardBg }}
            className="absolute -bottom-3 -left-3 w-3.5 h-3.5 bg-white border rounded-xs shadow-xs cursor-nesw-resize z-40 hover:scale-125 transition-transform"
            title="Drag to resize width and height"
          />
          {/* S - Bottom Center (only shown when no bottom arrow wedge is present) */}
          {(!showArrow || arrowPosition !== 'bottom') && (
            <div
              onMouseDown={(e) => handleHandleMouseDown(e, 's')}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setCurrentHeight('auto');
                latestDimensionsRef.current.height = 'auto';
                onResizeDimensions?.(currentWidth, 'auto');
              }}
              style={{ borderColor: cardBg }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border rounded-xs shadow-xs cursor-ns-resize z-40 hover:scale-125 transition-transform"
              title="Drag to resize height (double click to reset to auto)"
            />
          )}
          {/* SE - Bottom Right */}
          <div
            onMouseDown={(e) => handleHandleMouseDown(e, 'se')}
            style={{ borderColor: cardBg }}
            className="absolute -bottom-3 -right-3 w-3.5 h-3.5 bg-white border rounded-xs shadow-xs cursor-nwse-resize z-40 hover:scale-125 transition-transform"
            title="Drag to resize width and height"
          />

          {/* 5. Supademo Centered Bottom Dimension Badge (${width} × ${height}) */}
          <div
            onDoubleClick={(e) => {
              e.stopPropagation();
              setCurrentHeight('auto');
              latestDimensionsRef.current.height = 'auto';
              onResizeDimensions?.(currentWidth, 'auto');
            }}
            style={{ backgroundColor: cardBg }}
            className={`absolute ${
              showArrow && arrowPosition === 'bottom' ? '-bottom-11' : '-bottom-9'
            } left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-md text-white text-[11px] font-semibold tracking-tight shadow-md whitespace-nowrap z-40 font-mono cursor-pointer hover:scale-105 active:scale-95 transition-transform`}
            title="Double-click to reset height to auto"
          >
            {Math.round(activeWidth)} × {activeHeight === 'auto' ? 'auto' : `${Math.round(activeHeight as number)}`}
          </div>
        </>
      )}
    </div>
  );
};
