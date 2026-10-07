/**
 * Preveuo Hotspot Positioning, Boundary & Content Engine
 *
 * Core Concept:
 *   Hotspot Anchor Position (persistent X/Y normalized 0-100%) !== Hotspot Content Position (calculated dynamically)
 *
 * This engine handles:
 *  - Canvas normalized coordinates <-> Canvas pixel conversions
 *  - Content measurement and boundary detection
 *  - Deterministic placement priority (bottom -> top -> right -> left)
 *  - Automatic flip logic on collision
 *  - Orthogonal shift & boundary clamping within safe margin
 *  - Dynamic arrow/pointer tracking and directional orientation
 *  - Responsive screen width adjustments
 */

export type CalloutPlacement = 'top' | 'bottom' | 'left' | 'right';
export type ArrowDirection = 'up' | 'down' | 'left' | 'right';

export interface HotspotAnchor {
  x: number; // 0 to 100 (%)
  y: number; // 0 to 100 (%)
}

export interface CanvasDimensions {
  width: number;
  height: number;
}

export interface ContentDimensions {
  width: number;
  height: number;
}

export interface CalculateHotspotPositionOptions {
  anchor: HotspotAnchor;
  canvas: CanvasDimensions;
  content: ContentDimensions;
  preferredPlacement?: CalloutPlacement;
  offset?: number; // Distance between anchor center and callout edge (default: 28px)
  safeMargin?: number; // Margin from canvas edges (default: 12px)
}

export interface HotspotPositionResult {
  // Exact anchor position in canvas pixels
  anchorPx: {
    x: number;
    y: number;
  };
  // Exact callout top-left position in canvas pixels
  calloutPx: {
    x: number;
    y: number;
  };
  // Relative offset from anchor to callout top-left in pixels
  relativeOffsetPx: {
    x: number;
    y: number;
  };
  // Resulting placement relative to anchor
  placement: CalloutPlacement;
  // Arrow tip position along the callout's connecting border (in pixels)
  arrowOffsetPx: number;
  // Direction the arrow pointer faces (towards the anchor)
  arrowDirection: ArrowDirection;
  // Available space in pixels in all 4 directions
  availableSpace: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  // Clamped normalized anchor
  clampedAnchor: HotspotAnchor;
  // Responsive adjusted content size
  adjustedContentSize: ContentDimensions;
}

/**
 * Standard content width tokens mapped to pixels
 */
export const HOTSPOT_WIDTH_TOKENS = {
  small: 260,
  medium: 320,
  large: 380,
} as const;

export type HotspotWidthToken = keyof typeof HOTSPOT_WIDTH_TOKENS;

/**
 * Normalizes and clamps anchor coordinates to valid percentage range [0, 100]
 */
export function clampAnchor(anchor: HotspotAnchor, min = 0, max = 100): HotspotAnchor {
  const safeX = typeof anchor?.x === 'number' && !isNaN(anchor.x) ? anchor.x : 50;
  const safeY = typeof anchor?.y === 'number' && !isNaN(anchor.y) ? anchor.y : 50;

  return {
    x: Math.max(min, Math.min(max, safeX)),
    y: Math.max(min, Math.min(max, safeY)),
  };
}

/**
 * Pure Positioning Engine calculation
 */
export function calculateHotspotPosition(
  options: CalculateHotspotPositionOptions
): HotspotPositionResult {
  const {
    anchor,
    canvas,
    content,
    preferredPlacement = 'bottom',
    offset = 28,
    safeMargin = 12,
  } = options;

  // 1. Safe canvas dimensions (fallback to desktop minimums if unmounted/zero)
  const canvasWidth = Math.max(200, canvas?.width || 800);
  const canvasHeight = Math.max(150, canvas?.height || 500);

  // 2. Clamp anchor to canvas boundaries
  const clamped = clampAnchor(anchor, 1.5, 98.5);

  // 3. Convert anchor to absolute canvas pixel coordinates
  const anchorPxX = Math.round((clamped.x / 100) * canvasWidth);
  const anchorPxY = Math.round((clamped.y / 100) * canvasHeight);

  // 4. Responsive content width constraint: content width cannot exceed canvas width minus margins
  const maxAllowedWidth = Math.max(160, canvasWidth - safeMargin * 2);
  const adjustedWidth = Math.min(content.width || 300, maxAllowedWidth);
  const adjustedHeight = Math.max(60, content.height || 140);
  const adjustedContentSize = { width: adjustedWidth, height: adjustedHeight };

  // 5. Measure available space around anchor to safe canvas edges
  const spaceTop = Math.max(0, anchorPxY - safeMargin);
  const spaceBottom = Math.max(0, canvasHeight - safeMargin - anchorPxY);
  const spaceLeft = Math.max(0, anchorPxX - safeMargin);
  const spaceRight = Math.max(0, canvasWidth - safeMargin - anchorPxX);

  const availableSpace = {
    top: spaceTop,
    bottom: spaceBottom,
    left: spaceLeft,
    right: spaceRight,
  };

  // 6. Deterministic Placement Resolution (with Collision Flip)
  const neededVertical = adjustedHeight + offset;
  const neededHorizontal = adjustedWidth + offset;

  let placement: CalloutPlacement = preferredPlacement;

  if (preferredPlacement === 'bottom' || preferredPlacement === 'top') {
    const fitsBottom = spaceBottom >= neededVertical;
    const fitsTop = spaceTop >= neededVertical;

    if (preferredPlacement === 'bottom') {
      if (!fitsBottom && fitsTop) {
        placement = 'top';
      } else if (!fitsBottom && !fitsTop) {
        // Neither fits fully vertically, choose the side with the most vertical room
        placement = spaceBottom >= spaceTop ? 'bottom' : 'top';
      }
    } else {
      // Preferred 'top'
      if (!fitsTop && fitsBottom) {
        placement = 'bottom';
      } else if (!fitsTop && !fitsBottom) {
        placement = spaceTop >= spaceBottom ? 'top' : 'bottom';
      }
    }
  } else {
    // Horizontal preferred ('right' or 'left')
    const fitsRight = spaceRight >= neededHorizontal;
    const fitsLeft = spaceLeft >= neededHorizontal;

    if (preferredPlacement === 'right') {
      if (!fitsRight && fitsLeft) {
        placement = 'left';
      } else if (!fitsRight && !fitsLeft) {
        placement = spaceRight >= spaceLeft ? 'right' : 'left';
      }
    } else {
      if (!fitsLeft && fitsRight) {
        placement = 'right';
      } else if (!fitsLeft && !fitsRight) {
        placement = spaceLeft >= spaceRight ? 'left' : 'right';
      }
    }
  }

  // 7. Calculate Callout Box Top-Left Coordinates & Apply Safe Clamping
  let calloutX = 0;
  let calloutY = 0;
  let arrowDirection: ArrowDirection = 'up';
  let arrowOffsetPx = 0;

  if (placement === 'bottom') {
    arrowDirection = 'up';
    calloutY = anchorPxY + offset;

    // Ideal center: callout centered horizontally on anchor
    const idealLeft = anchorPxX - adjustedWidth / 2;
    const minLeft = safeMargin;
    const maxLeft = canvasWidth - safeMargin - adjustedWidth;
    calloutX = Math.max(minLeft, Math.min(maxLeft, idealLeft));

    // Arrow position on the top edge of callout pointing straight at anchorPxX
    const relativeAnchorX = anchorPxX - calloutX;
    arrowOffsetPx = Math.max(20, Math.min(adjustedWidth - 20, relativeAnchorX));
  } else if (placement === 'top') {
    arrowDirection = 'down';
    calloutY = anchorPxY - offset - adjustedHeight;

    const idealLeft = anchorPxX - adjustedWidth / 2;
    const minLeft = safeMargin;
    const maxLeft = canvasWidth - safeMargin - adjustedWidth;
    calloutX = Math.max(minLeft, Math.min(maxLeft, idealLeft));

    const relativeAnchorX = anchorPxX - calloutX;
    arrowOffsetPx = Math.max(20, Math.min(adjustedWidth - 20, relativeAnchorX));
  } else if (placement === 'right') {
    arrowDirection = 'left';
    calloutX = anchorPxX + offset;

    // Ideal vertical center on anchor
    const idealTop = anchorPxY - adjustedHeight / 2;
    const minTop = safeMargin;
    const maxTop = canvasHeight - safeMargin - adjustedHeight;
    calloutY = Math.max(minTop, Math.min(maxTop, idealTop));

    const relativeAnchorY = anchorPxY - calloutY;
    arrowOffsetPx = Math.max(20, Math.min(adjustedHeight - 20, relativeAnchorY));
  } else {
    // placement === 'left'
    arrowDirection = 'right';
    calloutX = anchorPxX - offset - adjustedWidth;

    const idealTop = anchorPxY - adjustedHeight / 2;
    const minTop = safeMargin;
    const maxTop = canvasHeight - safeMargin - adjustedHeight;
    calloutY = Math.max(minTop, Math.min(maxTop, idealTop));

    const relativeAnchorY = anchorPxY - calloutY;
    arrowOffsetPx = Math.max(20, Math.min(adjustedHeight - 20, relativeAnchorY));
  }

  // 8. Relative offset from anchor to callout
  const relativeOffsetPx = {
    x: calloutX - anchorPxX,
    y: calloutY - anchorPxY,
  };

  return {
    anchorPx: { x: anchorPxX, y: anchorPxY },
    calloutPx: { x: Math.round(calloutX), y: Math.round(calloutY) },
    relativeOffsetPx: { x: Math.round(relativeOffsetPx.x), y: Math.round(relativeOffsetPx.y) },
    placement,
    arrowOffsetPx: Math.round(arrowOffsetPx),
    arrowDirection,
    availableSpace,
    clampedAnchor: clamped,
    adjustedContentSize,
  };
}
