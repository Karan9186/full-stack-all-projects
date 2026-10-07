/**
 * Analytics & Performance Insights Domain Types
 * Preveuo 2.0
 */

export interface LeadRecord {
  id: string;
  email: string;
  company: string;
  date: string;
  step: string;
  status: 'Synced to HubSpot' | 'Synced to Salesforce' | 'Pending Sync' | 'Exported';
}

export interface FunnelStepMetric {
  step: number;
  title: string;
  views: number;
  dropoffPercentage: number;
  avgTimeSeconds?: number;
}

export interface ReferrerTrafficItem {
  source: string;
  count: number;
  sharePercentage: number;
}

export interface EngagementMetricCard {
  label: string;
  value: string | number;
  changePercent?: string;
  isPositive?: boolean;
  subtext?: string;
}

export type TimeRangeOption =
  | 'Last 7 Days'
  | 'Last 30 Days'
  | 'Last 90 Days'
  | 'All Time';
