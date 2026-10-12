'use client';

import React, { useRef, useCallback } from 'react';
import { ZoomPanConfig, IDemoElement } from '@/types/demo';
import { Crosshair, Move, Link as LinkIcon } from 'lucide-react';

interface FocusCrosshairOverlayProps {
  config: ZoomPanConfig;
  containerRef: React.RefObject<HTMLDivElement | null>;
  linkedElement?: IDemoElement | null;
  onUpdateFocusPoint: (x: number, y: number) => void;
  isInteractive?: boolean;
}

export const FocusCrosshairOverlay: React.FC<FocusCrosshairOverlayProps> = ({
  config,
  containerRef,
  linkedElement,
  onUpdateFocusPoint,
  isInteractive = true,
}) => {
  const isDraggingRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isInteractive || !containerRef.current) return;
    e.stopPropagation();
    e.preventDefault();
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      e.stopPropagation();
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      const rawX = ((clientX - rect.left) / rect.width) * 100;
      const rawY = ((clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.round(Math.max(0, Math.min(100, rawX)) * 10) / 10;
      const clampedY = Math.round(Math.max(0, Math.min(100, rawY)) * 10) / 10;

      onUpdateFocusPoint(clampedX, clampedY);
    },
    [containerRef, onUpdateFocusPoint]
  );

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!isInteractive || !containerRef.current) return;
    // Don't reposition if clicking directly on the dragging handle (handled by pointer events)
    if ((e.target as HTMLElement).closest('.crosshair-handle')) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.round(Math.max(0, Math.min(100, rawX)) * 10) / 10;
    const clampedY = Math.round(Math.max(0, Math.min(100, rawY)) * 10) / 10;
    onUpdateFocusPoint(clampedX, clampedY);
  };

  const scale = Math.max(1.0, config.zoomLevel || 1.5);
  // Dimensions of visible window at this zoom level (in percentage)
  const windowWidthPct = (1 / scale) * 100;
  const windowHeightPct = (1 / scale) * 100;

  const posX = config.focusPoint.x;
  const posY = config.focusPoint.y;

  return (
    <div
      onClick={handleContainerClick}
      className={`absolute inset-0 z-30 select-none ${
        isInteractive ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
      }`}
    >
      {/* 1. Zoomed Camera Viewport Bounds Box */}
      <div
        className="absolute border-2 border-dashed border-[#5B5CE2]/70 rounded-xl bg-[#5B5CE2]/5 transition-all duration-150 pointer-events-none shadow-sm"
        style={{
          width: `${windowWidthPct}%`,
          height: `${windowHeightPct}%`,
          left: `${posX}%`,
          top: `${posY}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Corner Guides */}
        <div className="absolute top-1 left-1.5 text-[9px] font-mono font-bold text-[#5B5CE2] bg-white/90 px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider flex items-center gap-1">
          <span>Camera Frame {scale.toFixed(2)}×</span>
        </div>
      </div>

      {/* 2. Interactive Focus Crosshair Target */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`crosshair-handle absolute z-35 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center ${
          isInteractive ? 'cursor-grab active:cursor-grabbing pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{
          left: `${posX}%`,
          top: `${posY}%`,
        }}
        title="Drag focal target on canvas"
      >
        {/* Pulsing Sonar Ring */}
        <div className="w-12 h-12 rounded-full border-2 border-[#5B5CE2] bg-[#5B5CE2]/15 flex items-center justify-center animate-pulse shadow-md">
          <Crosshair className="w-5 h-5 text-[#5B5CE2]" />
        </div>

        {/* Focal Coordinate Pill Badge */}
        <div className="mt-1.5 px-2 py-0.5 rounded-full bg-[#0f0f1a]/90 text-white text-[10px] font-mono font-medium shadow-lg flex items-center gap-1 whitespace-nowrap">
          {linkedElement ? (
            <>
              <LinkIcon className="w-2.5 h-2.5 text-[#5B5CE2]" />
              <span className="text-[#a5b4fc]">Linked:</span>
              <span className="max-w-[80px] truncate">{linkedElement.name || 'Hotspot'}</span>
            </>
          ) : (
            <>
              <Move className="w-2.5 h-2.5 text-[#9ca3af]" />
              <span>
                X: {posX}% Y: {posY}%
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
