import { DemoProject } from './demo';

/**
 * Workspace & Multi-Tenant Organization Domain Types
 * Preveuo 2.0
 */

export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type WorkspaceTeamSize = '1-10' | '11-50' | '51-200' | '201+';
export type WorkspaceGoal = 'sales' | 'marketing' | 'onboarding' | 'support';

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  avatarUrl?: string;
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  domainUrl: string;
  teamSize: WorkspaceTeamSize;
  plan: 'free' | 'pro' | 'growth' | 'enterprise';
  members: WorkspaceMember[];
  projectsCount: number;
  totalViews: number;
  createdAt: string;
}

export interface WorkspaceCategoryFilter {
  id: string;
  label: string;
  count?: number;
}

export interface CreateWorkspaceProjectInput {
  name: string;
  description: string;
  category: string;
  initialUrl?: string;
}

export interface WorkspaceMetricCardData {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  sparkline: number[];
}

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  iconName: 'record' | 'upload' | 'ai' | 'template';
  href: string;
}

export interface TeamActivityItem {
  id: string;
  user: string;
  action: string;
  demoName: string;
  timeAgo: string;
  avatarInitials: string;
}

export interface WorkspaceDemoItem {
  id: string;
  title: string;
  description: string;
  stepsCount: number;
  status: 'published' | 'draft';
  views: number;
  completionRate: number;
  authorInitials: string;
  updatedAgo: string;
  colorScheme: 'purple' | 'blue' | 'peach' | 'green' | 'teal' | 'rose';
}

export interface WorkspaceCardItem {
  id: string;
  title: string;
  description: string;
  status: 'Published' | 'Draft';
}

export interface WorkspaceAssetItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'logo' | 'icon';
  size: string;
  url: string;
  uploadedAt: string;
  dimensions?: string;
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: 'CRM' | 'Analytics' | 'Productivity' | 'Automation';
  description: string;
  iconName: string;
  status: 'connected' | 'available' | 'configured';
  lastSync?: string;
}

export interface WorkspaceNotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'lead' | 'milestone' | 'mention' | 'system';
  isRead: boolean;
  avatarInitials?: string;
}

export interface UserProfileMenuAction {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  danger?: boolean;
}
