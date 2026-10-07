import { LeadRecord, FunnelStepMetric, EngagementMetricCard } from '@/types/analytics';

export const ANALYTICS_METRICS: EngagementMetricCard[] = [
  {
    label: 'Total Demo Views',
    value: '14,892',
    changePercent: '+24.5%',
    isPositive: true,
    subtext: 'vs previous period',
  },
  {
    label: 'Unique Viewers',
    value: '9,410',
    changePercent: '+18.2%',
    isPositive: true,
    subtext: '82% verified corporate domains',
  },
  {
    label: 'Avg Completion Time',
    value: '2m 45s',
    changePercent: '-12s',
    isPositive: true,
    subtext: 'optimal engagement window',
  },
  {
    label: 'Leads Captured',
    value: '384',
    changePercent: '+34.1%',
    isPositive: true,
    subtext: 'high-intent demo gates',
  },
];

export const FUNNEL_STEPS: FunnelStepMetric[] = [
  { step: 1, title: 'Step 1: Introduction & Problem Framing', views: 9410, dropoffPercentage: 0, avgTimeSeconds: 24 },
  { step: 2, title: 'Step 2: Core Feature Showcase', views: 8280, dropoffPercentage: 12, avgTimeSeconds: 45 },
  { step: 3, title: 'Step 3: Workflow Automation', views: 7150, dropoffPercentage: 24, avgTimeSeconds: 52 },
  { step: 4, title: 'Step 4: Interactive Lead Gate', views: 5834, dropoffPercentage: 38, avgTimeSeconds: 30 },
  { step: 5, title: 'Step 5: Enterprise Security & CTA', views: 4893, dropoffPercentage: 48, avgTimeSeconds: 14 },
];

export const RECENT_LEADS: LeadRecord[] = [
  {
    id: '1',
    email: 'sarah.j@acmecloud.io',
    company: 'AcmeCloud',
    date: 'Today, 11:24 AM',
    step: 'Step 4 (Lead Gate)',
    status: 'Synced to HubSpot',
  },
  {
    id: '2',
    email: 'alex.chen@fintechpulse.com',
    company: 'Pulse Fintech',
    date: 'Yesterday, 4:15 PM',
    step: 'Step 4 (Lead Gate)',
    status: 'Synced to HubSpot',
  },
  {
    id: '3',
    email: 'd.ross@scaleupventures.co',
    company: 'ScaleUp',
    date: 'Oct 5, 2026',
    step: 'Step 4 (Lead Gate)',
    status: 'Synced to Salesforce',
  },
  {
    id: '4',
    email: 'laura.k@hypergrowth.app',
    company: 'HyperGrowth',
    date: 'Oct 4, 2026',
    step: 'Step 4 (Lead Gate)',
    status: 'Synced to HubSpot',
  },
];
