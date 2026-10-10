// Comprehensive Domain Models for Preveuo Interactive Demo & Walkthrough Engine

export type DemoType = 'interactive' | 'walkthrough' | 'presentation' | 'onboarding';
export type DemoStatus = 'draft' | 'published' | 'archived';

export interface DemoSettings {
  theme?: 'light' | 'dark' | 'auto';
  navigation?: boolean;
  progressBar?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  showBranding?: boolean;
  allowRestart?: boolean;
  allowSkip?: boolean;
  showCursor?: boolean;
  showControls?: boolean;
  responsive?: boolean;
  background?: string;
  defaultTransition?: 'fade' | 'slide' | 'zoom' | 'none';
  accentColor?: string;
  aspectRatio?: string;
  canonicalWidth?: number;
  canonicalHeight?: number;
}

export type SceneSourceType = 'screenshot' | 'recording' | 'url' | 'upload' | 'custom';

export interface SceneViewport {
  width: number;
  height: number;
  aspectRatio?: string;
}

export interface IDemoScene {
  _id?: string;
  id: string;
  demoId: string;
  name: string;
  slug: string;
  order: number;
  sourceType: SceneSourceType;
  sourceAssetUrl: string;
  viewport: SceneViewport;
  background?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export type StepActionType = 'click' | 'hover' | 'type' | 'select' | 'scroll' | 'observe' | 'custom';

export interface StepTooltip {
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  badge?: string;
  buttonText?: string;
  secondaryButtonText?: string;
}

export interface StepSpotlight {
  enabled: boolean;
  shape?: 'rectangle' | 'circle';
  padding?: number;
  borderRadius?: number;
}

export interface StepNavigation {
  canSkip?: boolean;
  autoAdvance?: boolean;
  delayMs?: number;
}

export interface IDemoStep {
  _id?: string;
  id: string;
  demoId: string;
  sceneId: string;
  chapterId?: string;
  order: number;
  title: string;
  description?: string;
  targetElementId?: string;
  action: StepActionType;
  tooltip: StepTooltip;
  spotlight?: StepSpotlight;
  navigation?: StepNavigation;
  completion?: {
    type: 'click' | 'delay' | 'button';
    nextStepId?: string;
    nextSceneId?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export type ElementType =
  | 'hotspot'
  | 'button'
  | 'text'
  | 'image'
  | 'input'
  | 'tooltip'
  | 'callout'
  | 'cursor'
  | 'highlight'
  | 'video'
  | 'embed'
  | 'link';

export type HotspotType = 'pointer' | 'callout' | 'area';
export type HotspotTextAlign = 'left' | 'center' | 'right';
export type HotspotBorderRadius = 'square' | 'rounded' | 'pill';
export type HotspotWidth = 'small' | 'medium' | 'large';
export type HotspotAnimation = 'none' | 'ping' | 'pulse' | 'bounce';
export type HotspotVisibility = 'always' | 'onHover' | 'onClick' | 'afterDelay';
export type HotspotActionType = 'nextStep' | 'previousStep' | 'goToStep' | 'goToScene' | 'goToChapter' | 'externalUrl';

export type HotspotPointerStyle = 'beacon' | 'cursor' | 'hand' | 'target' | 'bullseye' | 'number';

export interface PointerAnimationSettings {
  speed?: 'slow' | 'medium' | 'fast';
  size?: 'sm' | 'md' | 'lg';
  clickFeedback?: boolean;
  autoPlayMotion?: boolean;
  intensity?: 'subtle' | 'standard' | 'high';
  startDelay?: number;
  holdDuration?: number;
  repeat?: boolean;
}

export interface HotspotButtonConfig {
  enabled: boolean;
  text: string;
  background: string;
  textColor: string;
  action: HotspotActionType;
  target?: string;
}

export interface HotspotConfig {
  type: HotspotType;
  content: {
    text: string;
    title?: string;
    description?: string;
    badge?: string;
    textAlign: HotspotTextAlign;
  };
  appearance: {
    background: string;
    textColor: string;
    backdrop: boolean;
    borderRadius: HotspotBorderRadius;
    width: HotspotWidth;
    animation: HotspotAnimation;
    pointerStyle?: HotspotPointerStyle;
    pointerAnimation?: PointerAnimationSettings;
  };
  visibility: HotspotVisibility;
  delayMs?: number;
  navigation: {
    showNext: boolean;
    nextButton?: HotspotButtonConfig;
    backButton?: HotspotButtonConfig;
  };
}

export type ChapterType = 'default' | 'form' | 'embed' | 'password';
export type ChapterLayout = 'left' | 'center' | 'right';
export type ChapterTheme = 'dark' | 'light' | 'custom';
export type ChapterCoverType = 'none' | 'steps' | 'custom';

export type ChapterButtonActionType =
  | 'next'
  | 'previous'
  | 'go_to_step'
  | 'go_to_chapter'
  | 'external_url';

export interface ChapterButtonAction {
  type: ChapterButtonActionType;
  targetId?: string;
  url?: string;
}

export interface ChapterButton {
  id: string;
  label: string;
  action: ChapterButtonAction;
  style: 'primary' | 'secondary' | 'outline';
  visible: boolean;
}

export interface ChapterLogoConfig {
  visible: boolean;
  assetUrl?: string;
  assetId?: string | null;
  altText?: string;
}

export interface ChapterCoverConfig {
  type: ChapterCoverType;
  assetUrl?: string | null;
  assetId?: string | null;
  stepId?: string | null;
}

export interface IDemoChapter {
  id: string;
  _id?: string;
  demoId: string;
  type?: ChapterType;
  title: string;
  description?: string;
  logo?: ChapterLogoConfig;
  cover?: ChapterCoverConfig;
  layout?: ChapterLayout;
  theme?: ChapterTheme;
  opacity?: number;
  blur?: boolean;
  buttons?: ChapterButton[];
  formConfig?: {
    buttonLabel?: string;
    emailPlaceholder?: string;
    requireName?: boolean;
  };
  embedConfig?: {
    embedUrl?: string;
  };
  passwordConfig?: {
    password?: string;
    hint?: string;
  };
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ElementPosition {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage or px
  height: number; // percentage or px
  rotation?: number;
}

export interface ElementStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  opacity?: number;
  pulseAnimation?: boolean;
  shadow?: string;
  padding?: string;
}

export interface IDemoElement {
  _id?: string;
  id: string;
  demoId: string;
  sceneId: string;
  stepId?: string;
  type: ElementType;
  name: string;
  position: ElementPosition;
  style: ElementStyle;
  content?: string;
  target?: string;
  visible: boolean;
  locked?: boolean;
  order: number;
  hotspotConfig?: HotspotConfig;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export type InteractionTrigger =
  | 'click'
  | 'doubleClick'
  | 'hover'
  | 'mouseenter'
  | 'mouseleave'
  | 'focus'
  | 'input'
  | 'change'
  | 'submit'
  | 'scroll'
  | 'drag'
  | 'load'
  | 'timer'
  | 'stepEnter'
  | 'stepComplete';

export type ConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'exists'
  | 'notExists';

export interface InteractionCondition {
  field: string;
  operator: ConditionOperator;
  value: unknown;
}

export type InteractionActionType =
  | 'navigate'
  | 'nextStep'
  | 'previousStep'
  | 'openScene'
  | 'close'
  | 'show'
  | 'hide'
  | 'highlight'
  | 'spotlight'
  | 'tooltip'
  | 'scrollTo'
  | 'focus'
  | 'setVariable'
  | 'openUrl'
  | 'showModal'
  | 'completeDemo';

export interface InteractionAction {
  type: InteractionActionType;
  targetSceneId?: string;
  targetStepId?: string;
  targetElementId?: string;
  variableKey?: string;
  variableValue?: unknown;
  url?: string;
  openInNewTab?: boolean;
  modalContent?: string;
}

export interface IDemoInteraction {
  _id?: string;
  id: string;
  demoId: string;
  sceneId: string;
  elementId?: string;
  trigger: InteractionTrigger;
  conditions?: InteractionCondition[];
  actions: InteractionAction[];
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDemo {
  _id?: string;
  id: string;
  workspaceId: string;
  projectId?: string;
  name: string;
  slug: string;
  description?: string;
  type: DemoType;
  status: DemoStatus;
  thumbnail?: string;
  coverImage?: string;
  settings: DemoSettings;
  activeVersionId?: string;
  publishedVersionId?: string;
  publicId?: string;
  scenesCount?: number;
  stepsCount?: number;
  viewsCount?: number;
  completionsCount?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Complete Full Demo Document Bundle (Editor State)
export interface FullDemoData {
  demo: IDemo;
  chapters?: IDemoChapter[];
  scenes: IDemoScene[];
  steps: IDemoStep[];
  elements: IDemoElement[];
  interactions: IDemoInteraction[];
}

// Runtime Snapshot saved in PublishVersion for 1-query instant public playback
export interface DemoRuntimeSnapshot {
  demo: {
    id: string;
    name: string;
    description?: string;
    type: DemoType;
    settings: DemoSettings;
    publicId: string;
  };
  chapters?: IDemoChapter[];
  scenes: IDemoScene[];
  steps: IDemoStep[];
  elements: IDemoElement[];
  interactions: IDemoInteraction[];
  publishedAt: string;
}

export interface IPublishVersion {
  _id?: string;
  id: string;
  demoId: string;
  workspaceId: string;
  version: number;
  snapshot: DemoRuntimeSnapshot;
  status: 'active' | 'superseded' | 'archived';
  publishedBy: string;
  publishedAt: string;
  createdAt?: string;
}

export type DemoAnalyticsEventType =
  | 'DEMO_VIEW'
  | 'SESSION_START'
  | 'STEP_VIEW'
  | 'STEP_COMPLETE'
  | 'ELEMENT_VIEW'
  | 'ELEMENT_CLICK'
  | 'INTERACTION_TRIGGER'
  | 'CTA_CLICK'
  | 'DEMO_COMPLETE'
  | 'DEMO_EXIT'
  | 'REPLAY'
  | 'HOTSPOT_VIEW'
  | 'HOTSPOT_CLICK'
  | 'HOTSPOT_OPEN'
  | 'HOTSPOT_CLOSE'
  | 'HOTSPOT_ACTION'
  | 'HOTSPOT_NEXT'
  | 'HOTSPOT_BACK'
  | 'CHAPTER_VIEW'
  | 'CHAPTER_BUTTON_CLICK'
  | 'CHAPTER_EXIT';

export interface IDemoAnalyticsEvent {
  demoId: string;
  publishVersionId?: string;
  sessionId: string;
  visitorId?: string;
  eventType: DemoAnalyticsEventType;
  sceneId?: string;
  stepId?: string;
  elementId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Backward compatibility interfaces
export interface HotspotPoint {
  id: string;
  x: number;
  y: number;
  title?: string;
  description?: string;
  action?: 'next' | 'link' | 'submit' | 'info';
  targetUrl?: string;
}

export interface DemoCallout {
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  badge?: string;
  buttonText?: string;
}

export interface DemoStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle?: string;
  screenshotUrl: string;
  targetPoint: HotspotPoint;
  callout: DemoCallout;
  delayMs?: number;
  cameraZoom?: number;
  interactive?: boolean;
}

export interface DemoProject {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  views: number;
  completions: number;
  completionRate: number;
  status: 'published' | 'draft' | 'archived';
  category: string;
  stepsCount: number;
  steps: DemoStep[];
}

export interface DemoAnalyticsData {
  totalViews: number;
  uniqueViewers: number;
  avgCompletionTime: string;
  completionRate: number;
  leadsCaptured: number;
  funnelSteps: {
    step: number;
    title: string;
    views: number;
    dropoffPercentage: number;
  }[];
  topReferrers: {
    source: string;
    visitors: number;
    conversion: number;
  }[];
}
