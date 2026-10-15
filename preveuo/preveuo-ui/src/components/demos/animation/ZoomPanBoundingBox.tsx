'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ZoomPanConfig, ZoomPanFocusRegion } from '@/types/demo';
import { Play, Trash2, HelpCircle, Eye, Check, X } from 'lucide-react';

interface ZoomPanBoundingBoxProps {
  config: ZoomPanConfig;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onUpdateConfig: (updates: Partial<ZoomPanConfig>) => void;
  onRemove: () => void;
  onPreview: () => void;
  isPreviewing?: boolean;
  isInteractive?: boolean;
}

type DragMode = 'move' | 'nw' | 'ne' | 'sw' | 'se' | null;

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
  const dragModeRef = useRef<DragMode>(null);
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    region: ZoomPanFocusRegion;
  }>({
    clientX: 0,
    clientY: 0,
    region: { x: 20, y: 15, width: 60, height: 70 },
  });

  // Default region fallback if not configured yet
  const region: ZoomPanFocusRegion = config.focusRegion || {
    x: Math.max(5, Math.min(65, (config.focusPoint?.x ?? 50) - 30)),
    y: Math.max(5, Math.min(65, (config.focusPoint?.y ?? 50) - 25)),
    width: 60,
    height: 50,
  };

  const currentZoomMultiplier = Math.round((100 / Math.max(20, region.width)) * 10) / 10;

  const handlePointerDown = (
    e: React.PointerEvent,
    mode: DragMode
  ) => {
    if (!isInteractive || !containerRef.current || isPreviewing) return;
    e.stopPropagation();
    e.preventDefault();

    dragModeRef.current = mode;
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      region: { ...region },
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const mode = dragModeRef.current;
      if (!mode || !containerRef.current) return;
      e.stopPropagation();

      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const deltaXPct = ((e.clientX - dragStartRef.current.clientX) / rect.width) * 100;
      const deltaYPct = ((e.clientY - dragStartRef.current.clientY) / rect.height) * 100;

      const initial = dragStartRef.current.region;
      let nextX = initial.x;
      let nextY = initial.y;
      let nextWidth = initial.width;
      let nextHeight = initial.height;

      const minSize = 15; // Minimum 15% width and height

      if (mode === 'move') {
        nextX = Math.max(0, Math.min(100 - initial.width, initial.x + deltaXPct));
        nextY = Math.max(0, Math.min(100 - initial.height, initial.y + deltaYPct));
      } else if (mode === 'se') {
        nextWidth = Math.max(minSize, Math.min(100 - initial.x, initial.width + deltaXPct));
        nextHeight = Math.max(minSize, Math.min(100 - initial.y, initial.height + deltaYPct));
      } else if (mode === 'sw') {
        const potentialWidth = initial.width - deltaXPct;
        if (potentialWidth >= minSize && initial.x + deltaXPct >= 0) {
          nextX = initial.x + deltaXPct;
          nextWidth = potentialWidth;
        }
        nextHeight = Math.max(minSize, Math.min(100 - initial.y, initial.height + deltaYPct));
      } else if (mode === 'ne') {
        nextWidth = Math.max(minSize, Math.min(100 - initial.x, initial.width + deltaXPct));
        const potentialHeight = initial.height - deltaYPct;
        if (potentialHeight >= minSize && initial.y + deltaYPct >= 0) {
          nextY = initial.y + deltaYPct;
          nextHeight = potentialHeight;
        }
      } else if (mode === 'nw') {
        const potentialWidth = initial.width - deltaXPct;
        if (potentialWidth >= minSize && initial.x + deltaXPct >= 0) {
          nextX = initial.x + deltaXPct;
          nextWidth = potentialWidth;
        }
        const potentialHeight = initial.height - deltaYPct;
        if (potentialHeight >= minSize && initial.y + deltaYPct >= 0) {
          nextY = initial.y + deltaYPct;
          nextHeight = potentialHeight;
        }
      }

      // Round to 1 decimal place
      const roundedRegion: ZoomPanFocusRegion = {
        x: Math.round(nextX * 10) / 10,
        y: Math.round(nextY * 10) / 10,
        width: Math.round(nextWidth * 10) / 10,
        height: Math.round(nextHeight * 10) / 10,
      };

      const calculatedZoom = Math.round((100 / Math.max(20, roundedRegion.width)) * 100) / 100;
      const centerX = Math.round((roundedRegion.x + roundedRegion.width / 2) * 10) / 10;
      const centerY = Math.round((roundedRegion.y + roundedRegion.height / 2) * 10) / 10;

      onUpdateConfig({
        enabled: true,
        focusRegion: roundedRegion,
        focusPoint: { x: centerX, y: centerY },
        zoomLevel: Math.max(1.1, Math.min(3.5, calculatedZoom)),
      });
    },
    [containerRef, onUpdateConfig]
  );

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragModeRef.current) return;
    dragModeRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Close help tooltip on click outside or escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowHelpTooltip(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (isPreviewing) {
    // Hide editor handles while animation is playing preview
    return null;
  }

  return (
    <div className="absolute inset-0 z-35 pointer-events-none select-none">
      {/* 1. Backdrop Masks (Spotlight effect outside bounding box) */}
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

      {/* 2. Interactive Bounding Box */}
      <div
        onPointerDown={(e) => handlePointerDown(e, 'move')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`absolute rounded-xl border-2 border-[#5B5CE2] shadow-2xl transition-shadow ${
          isInteractive
            ? 'pointer-events-auto cursor-move hover:border-[#4a4bd4] hover:shadow-[0_0_0_1px_#5B5CE2]'
            : 'pointer-events-none'
        }`}
        style={{
          left: `${region.x}%`,
          top: `${region.y}%`,
          width: `${region.width}%`,
          height: `${region.height}%`,
        }}
      >
        {/* Subtle inner grid lines or center indicator */}
        <div className="absolute inset-0 bg-[#5B5CE2]/5 rounded-lg pointer-events-none" />

        {/* Zoom Magnifier Pill Tag (Top-left inside box) */}
        <div className="absolute top-2 left-2 pointer-events-none flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/95 text-[#0f0f1a] shadow-xs text-[10px] font-bold font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5B5CE2]" />
          <span>Zoom {currentZoomMultiplier.toFixed(1)}×</span>
        </div>

        {/* 4 Corner Resize Handles */}
        {isInteractive && (
          <>
            {/* Top-Left */}
            <div
              onPointerDown={(e) => handlePointerDown(e, 'nw')}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 rounded bg-[#5B5CE2] border-2 border-white shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-40"
              title="Resize Top-Left"
            />
            {/* Top-Right */}
            <div
              onPointerDown={(e) => handlePointerDown(e, 'ne')}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded bg-[#5B5CE2] border-2 border-white shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-40"
              title="Resize Top-Right"
            />
            {/* Bottom-Left */}
            <div
              onPointerDown={(e) => handlePointerDown(e, 'sw')}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 rounded bg-[#5B5CE2] border-2 border-white shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-40"
              title="Resize Bottom-Left"
            />
            {/* Bottom-Right */}
            <div
              onPointerDown={(e) => handlePointerDown(e, 'se')}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 rounded bg-[#5B5CE2] border-2 border-white shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-40"
              title="Resize Bottom-Right"
            />
          </>
        )}

        {/* 3. Docked Floating Action Bar (Bottom Center of Box) */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-full mt-3 left-1/2 -translate-x-1/2 pointer-events-auto z-50 flex items-center gap-1.5 p-1 bg-white rounded-2xl shadow-xl border border-[#e5e7eb] animate-fade-in"
        >
          {/* Zoom Preview Button */}
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="px-4 py-2 rounded-xl bg-[#5B5CE2] hover:bg-[#4a4bd4] active:scale-95 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all duration-150 cursor-pointer hover:shadow-md"
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
                  ? 'bg-[#5B5CE2]/10 text-[#5B5CE2]'
                  : 'text-gray-400 hover:text-[#5B5CE2] hover:bg-gray-100'
              }`}
              title="Help & instructions"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {showHelpTooltip && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 rounded-2xl bg-[#0f0f1a] text-white text-xs shadow-2xl border border-white/10 space-y-1.5 z-60 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between font-bold text-white">
                  <span>How Zoom & Pan Works</span>
                  <button
                    type="button"
                    onClick={() => setShowHelpTooltip(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed font-normal">
                  Drag the box to pan the camera focus. Resize corners to zoom in on key buttons or fields.
                  During playback, the viewer smoothly zooms directly into this crop region!
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-[#5B5CE2] font-semibold">
                  <span>Aspect-ratio locked</span>
                  <span className="font-mono">{currentZoomMultiplier.toFixed(1)}× magnification</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
