/**
 * Authentication & Multi-Tenant Identity Domain Types
 * Preveuo 2.0
 */

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SsoCredentials {
  workspaceSlug: string;
}

export interface RegisterStep1Data {
  fullName: string;
  email: string;
  password: string;
  agreedToTerms: boolean;
}

export interface RegisterStep2WorkspaceData {
  workspaceName: string;
  workspaceSlug: string;
  role: string;
  teamSize: '1-10' | '11-50' | '51-200' | '201+';
  primaryGoal: 'sales' | 'marketing' | 'onboarding' | 'support';
}

export interface RegisterRequestPayload {
  // Step 1: User Account
  fullName: string;
  email: string;
  password: string;
  agreedToTerms: boolean;
  // Step 2: Multi-Tenant Workspace
  workspaceName: string;
  workspaceSlug: string;
  role: string;
  teamSize: '1-10' | '11-50' | '51-200' | '201+';
  primaryGoal: 'sales' | 'marketing' | 'onboarding' | 'support';
}

export interface AuthSession {
  user: User;
  workspaceSlug: string;
  workspaceName: string;
  token: string;
  expiresAt: string;
}

export interface AuthApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginApiResponseData {
  session: AuthSession;
  redirectUrl: string;
}

export interface RegisterApiResponseData {
  session: AuthSession;
  redirectUrl: string;
}
