/**
 * Common Shared Domain & Utility Types
 * Preveuo 2.0
 */

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiStatusResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export type ActionStatus = 'idle' | 'loading' | 'success' | 'error';
