import React from 'react';

/**
 * Resources & Content Hub Domain Types
 * Preveuo 2.0
 */

export interface ResourceArticle {
  id: string;
  number: string;
  category: string;
  tabCategory: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  bgTint: string;
  watermarkColor: string;
  icon?: React.ReactNode;
  slug?: string;
}

export type ResourceCategoryTab =
  | 'All articles'
  | 'Product-led growth'
  | 'Sales enablement'
  | 'Product marketing'
  | 'Customer success';

export interface NewsletterSubscription {
  email: string;
  source?: string;
}
