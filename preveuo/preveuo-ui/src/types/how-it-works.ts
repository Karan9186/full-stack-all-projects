import React from 'react';

/**
 * How It Works & Walkthrough Domain Types
 * Preveuo 2.0
 */

export interface WalkthroughFeatureStep {
  stepNumber: string;
  badge: string;
  title: string;
  description: string;
  bulletPoints: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  }[];
  previewType: 'capture' | 'branching' | 'personalization' | 'analytics';
  reversedLayout?: boolean;
}
