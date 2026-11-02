'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ZoomPanConfig, ZoomPanFocusRegion } from '@/types/demo';
import { Play, Trash2, HelpCircle, X } from 'lucide-react';

export interface ZoomPanBoundingBoxProps {
  config: ZoomPanConfig;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onUpdateConfig: (updates: Partial<ZoomPanConfig>) => void;
  onRemove: () => void;
  onPreview: () => void;
  isPreviewing?: boolean;
  isInteractive?: boolean;
}

type DragMode = 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e' | null;

export const ZoomPanBoundingBox: React.FC<ZoomPanBoundingBoxProps> = ({
  config,
  containerRef,
  onUpdateConfig,
  onRemove,
  onPreview,
  isPreviewing = false,
  isInteractive = true,
}) => {
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [dragRegion, setDragRegion] = useState<ZoomPanFocusRegion | null>(null);
  const [isDraggingActive, setIsDraggingActive] = useState(false);

  const dragModeRef = useRef<DragMode>(null);
  const hasMovedRef = useRef<boolean>(false);
  const latestRegionRef = useRef<ZoomPanFocusRegion | null>(null);
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  }>({
    clientX: 0,
    clientY: 0,
    startX: 20,
    startY: 15,
    startW: 60,
    startH: 50,
  });

  // Base fallback region from props
  const baseRegion: ZoomPanFocusRegion = config.focusRegion || {
    x: Math.max(5, Math.min(65, (config.focusPoint?.x ?? 50) - 30)),
    y: Math.max(5, Math.min(65, (config.focusPoint?.y ?? 50) - 25)),
    width: 60,
    height: 50,
  };

  // Active region displayed (local state while dragging/resizing for 60fps responsiveness)
  const region: ZoomPanFocusRegion = dragRegion || baseRegion;
  const currentZoomMultiplier = Math.round((100 / Math.max(20, region.width)) * 10) / 10;

  // Adaptive Action Bar Positioning
  const isNearBottom = region.y + region.height > 80;
  const isNearTop = region.y < 14;
  const placeAbove = isNearBottom && !isNearTop;
  const placeInside = isNearBottom && isNearTop;

  const boxCenterX = region.x + region.width / 2;
  const horizontalClass =
    boxCenterX < 25
      ? 'left-2 translate-x-0'
      : boxCenterX > 75
      ? 'right-2 translate-x-0'
      : 'left-1/2 -translate-x-1/2';

  const verticalClass = placeInside
    ? 'bottom-3'
    : placeAbove
    ? 'bottom-full mb-3'
    : 'top-full mt-3';

  // Tooltip opens away from the bounding box content
  const tooltipVerticalClass = placeAbove ? 'bottom-full mb-2' : 'top-full mt-2';

  // Pointer Down: initiates drag or resize
  const handlePointerDown = (
    e: React.PointerEvent,
    mode: DragMode
  ) => {
    if (!isInteractive || !containerRef.current || isPreviewing) return;
    e.stopPropagation();
    e.preventDefault();

    dragModeRef.current = mode;
    hasMovedRef.current = false;
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: region.x,
      startY: region.y,
      startW: region.width,
      startH: region.height,
    };
    latestRegionRef.current = { ...region };
    setDragRegion({ ...region });
    setIsDraggingActive(true);
  };

  // Window-level Pointer Move and Up listeners: immune to mouse release drops & React DOM re-renders
  useEffect(() => {
    if (!isDraggingActive) return;

    const onPointerMove = (e: PointerEvent) => {
      const mode = dragModeRef.current;
      if (!mode || !containerRef.current) return;
      e.stopPropagation();

      const deltaPixelX = e.clientX - dragStartRef.current.clientX;
      const deltaPixelY = e.clientY - dragStartRef.current.clientY;

      if (Math.abs(deltaPixelX) > 2 || Math.abs(deltaPixelY) > 2) {
        hasMovedRef.current = true;
      }

      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const deltaXPct = (deltaPixelX / rect.width) * 100;
      const deltaYPct = (deltaPixelY / rect.height) * 100;

      const { startX, startY, startW, startH } = dragStartRef.current;
      const minSize = 15; // Minimum 15% width and height

      let nextX = startX;
      let nextY = startY;
      let nextW = startW;
      let nextH = startH;

      if (mode === 'move') {
        nextX = Math.max(0, Math.min(100 - startW, startX + deltaXPct));
        nextY = Math.max(0, Math.min(100 - startH, startY + deltaYPct));
      } else if (mode === 'se') {
        nextW = Math.max(minSize, Math.min(100 - startX, startW + deltaXPct));
        nextH = Math.max(minSize, Math.min(100 - startY, startH + deltaYPct));
      } else if (mode === 'sw') {
        const maxLeftMove = startX;
        const clampedDeltaX = Math.max(-maxLeftMove, Math.min(startW - minSize, deltaXPct));
        nextX = startX + clampedDeltaX;
        nextW = startW - clampedDeltaX;
        nextH = Math.max(minSize, Math.min(100 - startY, startH + deltaYPct));
      } else if (mode === 'ne') {
        nextW = Math.max(minSize, Math.min(100 - startX, startW + deltaXPct));
        const maxTopMove = startY;
        const clampedDeltaY = Math.max(-maxTopMove, Math.min(startH - minSize, deltaYPct));
        nextY = startY + clampedDeltaY;
        nextH = startH - clampedDeltaY;
      } else if (mode === 'nw') {
        const maxLeftMove = startX;
        const clampedDeltaX = Math.max(-maxLeftMove, Math.min(startW - minSize, deltaXPct));
        nextX = startX + clampedDeltaX;
        nextW = startW - clampedDeltaX;

        const maxTopMove = startY;
        const clampedDeltaY = Math.max(-maxTopMove, Math.min(startH - minSize, deltaYPct));
        nextY = startY + clampedDeltaY;
        nextH = startH - clampedDeltaY;
      } else if (mode === 'n') {
        const maxTopMove = startY;
        const clampedDeltaY = Math.max(-maxTopMove, Math.min(startH - minSize, deltaYPct));
        nextY = startY + clampedDeltaY;
        nextH = startH - clampedDeltaY;
      } else if (mode === 's') {
        nextH = Math.max(minSize, Math.min(100 - startY, startH + deltaYPct));
      } else if (mode === 'w') {
        const maxLeftMove = startX;
        const clampedDeltaX = Math.max(-maxLeftMove, Math.min(startW - minSize, deltaXPct));
        nextX = startX + clampedDeltaX;
        nextW = startW - clampedDeltaX;
      } else if (mode === 'e') {
        nextW = Math.max(minSize, Math.min(100 - startX, startW + deltaXPct));
      }

      const roundedRegion: ZoomPanFocusRegion = {
        x: Math.round(nextX * 10) / 10,
        y: Math.round(nextY * 10) / 10,
        width: Math.round(nextW * 10) / 10,
        height: Math.round(nextH * 10) / 10,
      };

      latestRegionRef.current = roundedRegion;
      setDragRegion(roundedRegion);
    };

    const onPointerUp = (e: PointerEvent) => {
      const wasDragging = hasMovedRef.current;
      dragModeRef.current = null;
      setIsDraggingActive(false);

      const finalRegion = latestRegionRef.current;
      setDragRegion(null);

      if (finalRegion) {
        const calculatedZoom = Math.round((100 / Math.max(20, finalRegion.width)) * 100) / 100;
        const centerX = Math.round((finalRegion.x + finalRegion.width / 2) * 10) / 10;
        const centerY = Math.round((finalRegion.y + finalRegion.height / 2) * 10) / 10;

        // Commit final coordinates cleanly to step configuration
        onUpdateConfig({
          enabled: true,
          focusRegion: finalRegion,
          focusPoint: { x: centerX, y: centerY },
          zoomLevel: Math.max(1.1, Math.min(3.5, calculatedZoom)),
          linkedHotspotId: null, // Custom drop unlinks from automatic following
        });
      }

      if (wasDragging) {
        // Suppress follow-up click event resulting from pointer release so canvas never jumps
        const suppressClick = (clickEvent: MouseEvent) => {
          clickEvent.stopPropagation();
          clickEvent.preventDefault();
          window.removeEventListener('click', suppressClick, true);
        };
        window.addEventListener('click', suppressClick, true);
        setTimeout(() => {
          window.removeEventListener('click', suppressClick, true);
        }, 250);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp, { passive: false });
    window.addEventListener('pointercancel', onPointerUp, { passive: false });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isDraggingActive, containerRef, onUpdateConfig]);

  // Close help tooltip on Escape or click outside
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowHelpTooltip(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (isPreviewing) {
    return null;
  }

  return (
    <>
      {/* 1. Backdrop Masks Layer (Behind Hotspots at z-20) */}
      <div
        data-zoom-box="true"
        className="absolute inset-0 z-20 pointer-events-none select-none"
      >
        <div
          className="absolute left-0 right-0 top-0 bg-black/25 transition-colors duration-150"
          style={{ height: `${region.y}%` }}
        />
        <div
          className="absolute left-0 right-0 bottom-0 bg-black/25 transition-colors duration-150"
          style={{ height: `${Math.max(0, 100 - (region.y + region.height))}%` }}
        />
        <div
          className="absolute left-0 bg-black/25 transition-colors duration-150"
          style={{
            top: `${region.y}%`,
            height: `${region.height}%`,
            width: `${region.x}%`,
          }}
        />
        <div
          className="absolute right-0 bg-black/25 transition-colors duration-150"
          style={{
            top: `${region.y}%`,
            height: `${region.height}%`,
            width: `${Math.max(0, 100 - (region.x + region.width))}%`,
          }}
        />
      </div>

      {/* 2. Interactive Bounding Box & Docked Controls Layer (On top of Hotspots at z-50) */}
      <div
        data-zoom-box="true"
        className="absolute inset-0 z-50 pointer-events-none select-none"
      >
        {/* Interactive Bounding Box */}
        <div
          data-zoom-box="true"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onPointerDown={(e) => handlePointerDown(e, 'move')}
          className={`absolute rounded-xl border-2 border-brand-purple shadow-2xl transition-shadow ${
            isInteractive
              ? 'pointer-events-auto cursor-move hover:border-brand-purple-hover hover:ring-1 hover:ring-brand-purple'
              : 'pointer-events-none'
          }`}
          style={{
            left: `${region.x}%`,
            top: `${region.y}%`,
            width: `${region.width}%`,
            height: `${region.height}%`,
          }}
        >
          {/* Subtle inner grid lines */}
          <div className="absolute inset-0 bg-brand-purple/5 rounded-lg pointer-events-none" />

          {/* Zoom Magnifier Pill Tag (Top-left inside box) */}
          <div
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => handlePointerDown(e, 'move')}
            className="absolute top-2 left-2 pointer-events-auto cursor-move flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 text-heading shadow-xs text-[10px] font-bold font-mono hover:bg-white hover:shadow-sm transition-all select-none"
            title="Drag anywhere inside box to reposition Zoom & Pan focus"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
            <span>Zoom {currentZoomMultiplier.toFixed(1)}×</span>
          </div>

          {/* 8 Resize Handles (4 corners + 4 edge centers) */}
          {isInteractive && (
            <>
              {/* Top-Left Corner */}
              <div
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => handlePointerDown(e, 'nw')}
                className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 rounded bg-brand-purple border-2 border-white shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-40"
                title="Resize Top-Left"
              />
              {/* Top-Right Corner */}
              <div
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => handlePointerDown(e, 'ne')}
                className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded bg-brand-purple border-2 border-white shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-40"
                title="Resize Top-Right"
              />
              {/* Bottom-Left Corner */}
              <div
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => handlePointerDown(e, 'sw')}
                className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 rounded bg-brand-purple border-2 border-white shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-40"
                title="Resize Bottom-Left"
              />
              {/* Bottom-Right Corner */}
              <div
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => handlePointerDown(e, 'se')}
                className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 rounded bg-brand-purple border-2 border-white shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-40"
                title="Resize Bottom-Right"
              />

              {/* Top Edge */}
              <div
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => handlePointerDown(e, 'n')}
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-2 rounded-full bg-brand-purple border border-white shadow-xs cursor-ns-resize hover:scale-115 transition-transform z-40"
                title="Resize Height (Top)"
              />
              {/* Bottom Edge */}
              <div
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => handlePointerDown(e, 's')}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 rounded-full bg-brand-purple border border-white shadow-xs cursor-ns-resize hover:scale-115 transition-transform z-40"
                title="Resize Height (Bottom)"
              />
              {/* Left Edge */}
              <div
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => handlePointerDown(e, 'w')}
                className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-6 rounded-full bg-brand-purple border border-white shadow-xs cursor-ew-resize hover:scale-115 transition-transform z-40"
                title="Resize Width (Left)"
              />
              {/* Right Edge */}
              <div
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => handlePointerDown(e, 'e')}
                className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-6 rounded-full bg-brand-purple border border-white shadow-xs cursor-ew-resize hover:scale-115 transition-transform z-40"
                title="Resize Width (Right)"
              />
            </>
          )}

          {/* 3. Docked Floating Action Bar */}
          <div
            data-zoom-box="true"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className={`absolute ${verticalClass} ${horizontalClass} pointer-events-auto z-50 flex items-center gap-1.5 p-1 bg-white rounded-2xl shadow-xl border border-border-default animate-fade-in whitespace-nowrap`}
          >
            {/* Zoom Preview Button */}
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="px-3.5 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-hover active:scale-95 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all duration-150 cursor-pointer hover:shadow-md"
              title="Preview camera zoom in place"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Zoom Preview</span>
            </button>

            {/* Delete Action Button */}
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Remove Zoom & Pan from this step"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Help Action Button with Popover Tooltip */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHelpTooltip(!showHelpTooltip);
                }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  showHelpTooltip
                    ? 'bg-brand-purple/10 text-brand-purple'
                    : 'text-gray-400 hover:text-brand-purple hover:bg-gray-100'
                }`}
                title="Help & instructions"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {showHelpTooltip && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute ${tooltipVerticalClass} right-0 w-72 sm:w-80 p-3.5 rounded-2xl bg-[#0f0f1a]/95 backdrop-blur-md text-white shadow-2xl border border-white/15 space-y-2 z-[100] animate-in fade-in zoom-in-95 duration-150 whitespace-normal break-words select-text`}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-white/10 font-bold text-xs text-white">
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-brand-purple" />
                      <span>How Zoom & Pan Works</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowHelpTooltip(false)}
                      className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Close tooltip"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11.5px] text-gray-300 leading-relaxed font-normal whitespace-normal break-words">
                    Drag the box to pan the camera focus. Resize corners or edges to zoom in on key buttons or fields.
                    During playback, the viewer smoothly zooms directly into this crop region!
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[10.5px] text-brand-purple font-semibold border-t border-white/10">
                    <span>Aspect-ratio locked</span>
                    <span className="font-mono bg-brand-purple/20 px-1.5 py-0.5 rounded text-white">{currentZoomMultiplier.toFixed(1)}× magnification</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
