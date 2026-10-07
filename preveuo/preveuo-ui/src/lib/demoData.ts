import { DemoProject, DemoStep, DemoAnalyticsData } from '@/types/demo';

export const SAMPLE_STEPS: DemoStep[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'Initialize Workspace',
    subtitle: 'Welcome to your interactive product command center',
    screenshotUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    targetPoint: {
      id: 'pt-1',
      x: 32,
      y: 44,
      title: 'Quick Create',
      description: 'Click to start capturing your interactive walkthrough'
    },
    callout: {
      title: 'Start with 1-Click Capture',
      description: 'Record any web app or upload design files to generate interactive steps automatically.',
      position: 'bottom',
      badge: 'Step 1 of 5',
      buttonText: 'Next Step →'
    },
    cameraZoom: 1.05
  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'AI Smart Hotspot Detection',
    subtitle: 'Preveuo highlights the exact elements your users interact with',
    screenshotUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80',
    targetPoint: {
      id: 'pt-2',
      x: 68,
      y: 36,
      title: 'Action Target',
      description: 'AI automatically anchors the beacon to the active CTA'
    },
    callout: {
      title: 'Intelligent Guidance Beacons',
      description: 'No manual coordinates needed. The engine detects buttons, modals, and input fields effortlessly.',
      position: 'left',
      badge: 'Step 2 of 5',
      buttonText: 'See Camera Zoom →'
    },
    cameraZoom: 1.08
  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'Focus Zoom & Context Tooltips',
    subtitle: 'Guide viewer attention precisely to key features',
    screenshotUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    targetPoint: {
      id: 'pt-3',
      x: 48,
      y: 58,
      title: 'Metric Card',
      description: 'Zoom smoothly into high-value ROI statistics'
    },
    callout: {
      title: 'Virtual Camera Precision',
      description: 'Deliver cinematic focus with smooth cubic-bezier zooming right onto your highest-converting elements.',
      position: 'top',
      badge: 'Step 3 of 5',
      buttonText: 'Explore Lead Gating →'
    },
    cameraZoom: 1.12
  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'Integrated Lead Capture',
    subtitle: 'Turn passive viewers into high-intent qualified leads',
    screenshotUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80',
    targetPoint: {
      id: 'pt-4',
      x: 75,
      y: 65,
      title: 'Lead Form',
      description: 'Collect email before revealing the finale'
    },
    callout: {
      title: 'Conversion Gateways',
      description: 'Capture viewer details with inline forms synchronized straight to HubSpot, Salesforce, and Marketo.',
      position: 'left',
      badge: 'Step 4 of 5',
      buttonText: 'Finish Walkthrough →'
    },
    cameraZoom: 1.04
  },
  {
    id: 'step-5',
    stepNumber: 5,
    title: 'Embed & Share Everywhere',
    subtitle: 'Distribute across marketing pages, emails, docs, and sales decks',
    screenshotUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    targetPoint: {
      id: 'pt-5',
      x: 50,
      y: 50,
      title: 'Share Hub',
      description: 'Publish responsive iframe or custom domain link'
    },
    callout: {
      title: 'Ready to Publish!',
      description: 'Your interactive demo is live. Export lightweight embed snippets or send password-protected links to prospects.',
      position: 'bottom',
      badge: 'Completed',
      buttonText: 'Restart Demo ↺'
    },
    cameraZoom: 1.0
  }
];

export const SAMPLE_PROJECTS: DemoProject[] = [
  {
    id: 'demo-101',
    name: 'SaaS Platform Onboarding Walkthrough',
    slug: 'saas-platform-onboarding',
    description: 'Interactive product tour highlighting primary navigation, billing metrics, and AI workflow creation.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    createdAt: '2 days ago',
    views: 4890,
    completions: 3912,
    completionRate: 80,
    status: 'published',
    category: 'Product Onboarding',
    stepsCount: 5,
    steps: SAMPLE_STEPS
  },
  {
    id: 'demo-102',
    name: 'Fintech Payment Gateway Checkout Flow',
    slug: 'fintech-checkout-flow',
    description: 'Step-by-step interactive payment authorization, fraud checks, and one-click invoice dispatch.',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    createdAt: '4 days ago',
    views: 2640,
    completions: 2165,
    completionRate: 82,
    status: 'published',
    category: 'Sales Enablement',
    stepsCount: 6,
    steps: SAMPLE_STEPS
  },
  {
    id: 'demo-103',
    name: 'AI Analytics Copilot Interactive Guide',
    slug: 'ai-analytics-copilot',
    description: 'Interactive sandbox demonstrating natural language queries and dynamic KPI chart generation.',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    createdAt: '1 week ago',
    views: 1840,
    completions: 1420,
    completionRate: 77,
    status: 'published',
    category: 'Marketing Demos',
    stepsCount: 4,
    steps: SAMPLE_STEPS
  },
  {
    id: 'demo-104',
    name: 'Enterprise Role-Based Access Control (RBAC)',
    slug: 'enterprise-rbac-setup',
    description: 'Guided walkthrough for compliance officers setting up SSO, SAML, and granular security policies.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    createdAt: '2 weeks ago',
    views: 890,
    completions: 740,
    completionRate: 83,
    status: 'draft',
    category: 'Customer Success',
    stepsCount: 7,
    steps: SAMPLE_STEPS
  }
];

export const SAMPLE_ANALYTICS: DemoAnalyticsData = {
  totalViews: 14820,
  uniqueViewers: 11450,
  avgCompletionTime: '2m 14s',
  completionRate: 79.4,
  leadsCaptured: 892,
  funnelSteps: [
    { step: 1, title: 'Step 1: Initialize Workspace', views: 14820, dropoffPercentage: 4 },
    { step: 2, title: 'Step 2: AI Hotspot Detection', views: 14227, dropoffPercentage: 6 },
    { step: 3, title: 'Step 3: Focus Zoom & Tooltips', views: 13373, dropoffPercentage: 8 },
    { step: 4, title: 'Step 4: Integrated Lead Capture', views: 12303, dropoffPercentage: 5 },
    { step: 5, title: 'Step 5: Embed & Share Everywhere', views: 11767, dropoffPercentage: 0 }
  ],
  topReferrers: [
    { source: 'Product Landing Page', visitors: 6240, conversion: 84 },
    { source: 'Outbound Sales Emails', visitors: 4120, conversion: 78 },
    { source: 'G2 & Product Hunt', visitors: 2890, conversion: 74 },
    { source: 'Help Center Docs', visitors: 1570, conversion: 82 }
  ]
};
