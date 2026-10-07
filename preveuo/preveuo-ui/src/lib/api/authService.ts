/**
 * Centralized Client-Side Authentication Service
 * Preveuo 2.0 — Architecture Rule 26: Centralized API Layer
 */

import {
  LoginCredentials,
  RegisterRequestPayload,
  SsoCredentials,
  AuthApiResponse,
  LoginApiResponseData,
  RegisterApiResponseData,
  AuthSession,
} from '@/types/auth';

const SESSION_STORAGE_KEY = 'preveuo_auth_session';

export const authService = {
  /**
   * Log in with Email and Password
   */
  async login(credentials: LoginCredentials): Promise<AuthApiResponse<LoginApiResponseData>> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: AuthApiResponse<LoginApiResponseData> = await res.json();

      if (data.success && data.data?.session) {
        authService.saveSession(data.data.session);
      }

      return data;
    } catch (err: unknown) {
      console.error('authService.login error:', err);
      return {
        success: false,
        error: 'Network error: Unable to reach authentication server. Please check your connection.',
      };
    }
  },

  /**
   * Register new user and provision Multi-Tenant Workspace
   */
  async register(payload: RegisterRequestPayload): Promise<AuthApiResponse<RegisterApiResponseData>> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: AuthApiResponse<RegisterApiResponseData> = await res.json();

      if (data.success && data.data?.session) {
        authService.saveSession(data.data.session);
      }

      return data;
    } catch (err: unknown) {
      console.error('authService.register error:', err);
      return {
        success: false,
        error: 'Network error: Registration request failed. Please try again.',
      };
    }
  },

  /**
   * Authenticate via Enterprise SAML/Okta SSO
   */
  async ssoLogin(credentials: SsoCredentials): Promise<AuthApiResponse<LoginApiResponseData>> {
    try {
      const res = await fetch('/api/auth/sso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: AuthApiResponse<LoginApiResponseData> = await res.json();

      if (data.success && data.data?.session) {
        authService.saveSession(data.data.session);
      }

      return data;
    } catch (err: unknown) {
      console.error('authService.ssoLogin error:', err);
      return {
        success: false,
        error: 'Network error: Failed to initiate SSO authentication.',
      };
    }
  },

  /**
   * Get Current Session from server
   */
  async getMe(): Promise<AuthApiResponse<AuthSession>> {
    try {
      const res = await fetch('/api/auth/me');
      const data: AuthApiResponse<AuthSession> = await res.json();
      return data;
    } catch (err: unknown) {
      console.error('authService.getMe error:', err);
      return {
        success: false,
        error: 'Failed to retrieve active session.',
      };
    }
  },

  /**
   * Sign out and clear stored sessions
   */
  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('authService.logout error:', err);
    } finally {
      authService.clearSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },

  /**
   * Store active session in localStorage for client-side persistence
   */
  saveSession(session: AuthSession): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } catch (e) {
        console.warn('Unable to persist session to localStorage', e);
      }
    }
  },

  /**
   * Retrieve active session from localStorage
   */
  getStoredSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Remove active session
   */
  clearSession(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        document.cookie = 'preveuo_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      } catch (e) {
        console.warn('Unable to remove session from localStorage', e);
      }
    }
  },
};
