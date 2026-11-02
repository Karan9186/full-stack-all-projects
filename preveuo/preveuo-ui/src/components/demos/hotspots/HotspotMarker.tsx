'use client';

import React from 'react';
import { IDemoElement, HotspotConfig } from '@/types/demo';
import { HotspotMarkerElement } from './HotspotMarkerElement';
import { CalloutCardElement } from './CalloutCardElement';
import { AreaHighlightElement } from './AreaHighlightElement';

export interface HotspotMarkerProps {
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

export const HotspotMarker: React.FC<HotspotMarkerProps> = ({
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
    },
  };

  // 1. SUPADEMO AREA HIGHLIGHT MODE
  // Rectangular region highlight with brackets [ ] and connected card with upward arrow wedge
  if (config.type === 'area') {
    return (
      <AreaHighlightElement
        element={element}
        isSelected={isSelected}
        isEditor={isEditor}
        isVisible={isVisible}
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        onSelect={onSelect}
        onMove={onMove}
        onResize={onResize}
        onUpdate={onUpdate}
        onAction={onAction}
        containerRef={containerRef}
      />
    );
  }

  // 2. SUPADEMO CALLOUT FLOATING CARD MODE
  // Pure floating tour card (no anchor pin dot, no arrow wedge)
  if (config.type === 'callout') {
    return (
      <CalloutCardElement
        element={element}
        isSelected={isSelected}
        isEditor={isEditor}
        isVisible={isVisible}
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        onSelect={onSelect}
        onMoveTarget={(x, y) => onMove?.(x, y)}
        onUpdate={onUpdate}
        onAction={onAction}
        containerRef={containerRef}
      />
    );
  }

  // 3. SUPADEMO POINTER / PINPOINT MODE (Default)
  // Solid circular pin dot with connected tooltip card & upward arrow wedge
  return (
    <HotspotMarkerElement
      element={element}
      isSelected={isSelected}
      isEditor={isEditor}
      isVisible={isVisible}
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      onSelect={onSelect}
      onMove={onMove}
      onUpdate={onUpdate}
      onAction={onAction}
      containerRef={containerRef}
    />
  );
};
