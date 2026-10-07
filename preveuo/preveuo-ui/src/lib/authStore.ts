/**
 * In-Memory & Multi-Tenant Identity Store
 * Preveuo 2.0
 */

import { User, AuthSession } from '@/types/auth';

interface StoredUserAccount extends User {
  passwordHash: string; // Plain/hashed comparison
}

interface StoredWorkspace {
  id: string;
  name: string;
  slug: string;
  teamSize: string;
  primaryGoal: string;
  ownerId: string;
  createdAt: string;
}

// Global persistence across Next.js Turbopack fast refreshes
declare global {
  // eslint-disable-next-line no-var
  var __preveuo_users: StoredUserAccount[] | undefined;
  // eslint-disable-next-line no-var
  var __preveuo_workspaces: StoredWorkspace[] | undefined;
}

const DEFAULT_USERS: StoredUserAccount[] = [
  {
    id: 'usr_karan_01',
    fullName: 'Karan Shah',
    email: 'karan@acme.co',
    passwordHash: 'Password123!',
    role: 'owner',
    workspaceId: 'ws_acme_corp',
    workspaceName: 'Acme Corporation',
    workspaceSlug: 'acme-corp',
    avatarUrl: '',
    createdAt: new Date('2025-01-15').toISOString(),
  },
  {
    id: 'usr_sarah_02',
    fullName: 'Sarah Jenkins',
    email: 'sarah@company.com',
    passwordHash: 'Password123!',
    role: 'admin',
    workspaceId: 'ws_tech_cloud',
    workspaceName: 'TechCloud Solutions',
    workspaceSlug: 'techcloud',
    avatarUrl: '',
    createdAt: new Date('2025-03-01').toISOString(),
  },
];

const DEFAULT_WORKSPACES: StoredWorkspace[] = [
  {
    id: 'ws_acme_corp',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    teamSize: '51-200',
    primaryGoal: 'sales',
    ownerId: 'usr_karan_01',
    createdAt: new Date('2025-01-15').toISOString(),
  },
  {
    id: 'ws_tech_cloud',
    name: 'TechCloud Solutions',
    slug: 'techcloud',
    teamSize: '11-50',
    primaryGoal: 'onboarding',
    ownerId: 'usr_sarah_02',
    createdAt: new Date('2025-03-01').toISOString(),
  },
];

const users: StoredUserAccount[] = globalThis.__preveuo_users ?? DEFAULT_USERS;
const workspaces: StoredWorkspace[] = globalThis.__preveuo_workspaces ?? DEFAULT_WORKSPACES;

if (process.env.NODE_ENV !== 'production') {
  globalThis.__preveuo_users = users;
  globalThis.__preveuo_workspaces = workspaces;
}

export function findUserByEmail(email: string): StoredUserAccount | undefined {
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function findWorkspaceBySlug(slug: string): StoredWorkspace | undefined {
  return workspaces.find((w) => w.slug.toLowerCase() === slug.trim().toLowerCase());
}

export function authenticate(email: string, password: string): { user: User; session: AuthSession } | null {
  const account = findUserByEmail(email);
  if (!account) return null;

  // Validate password (supports predefined Password123! or any password if in development for easy testing)
  if (account.passwordHash && account.passwordHash !== password) {
    return null;
  }

  const { passwordHash: _, ...safeUser } = account;
  const token = `prev_jwt_${safeUser.id}_${Date.now()}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return {
    user: safeUser,
    session: {
      user: safeUser,
      workspaceSlug: safeUser.workspaceSlug,
      workspaceName: safeUser.workspaceName,
      token,
      expiresAt,
    },
  };
}

export function registerAccountAndWorkspace(params: {
  fullName: string;
  email: string;
  password: string;
  workspaceName: string;
  workspaceSlug: string;
  role: string;
  teamSize: string;
  primaryGoal: string;
}): { user: User; session: AuthSession } {
  const existingUser = findUserByEmail(params.email);
  if (existingUser) {
    throw new Error('An account with this email address already exists.');
  }

  const existingSlug = findWorkspaceBySlug(params.workspaceSlug);
  if (existingSlug) {
    throw new Error(`The workspace domain "preveuo.com/w/${params.workspaceSlug}" is already taken.`);
  }

  const userId = `usr_${Date.now()}`;
  const workspaceId = `ws_${Date.now()}`;

  const newWorkspace: StoredWorkspace = {
    id: workspaceId,
    name: params.workspaceName.trim(),
    slug: params.workspaceSlug.trim().toLowerCase(),
    teamSize: params.teamSize,
    primaryGoal: params.primaryGoal,
    ownerId: userId,
    createdAt: new Date().toISOString(),
  };

  const newUser: StoredUserAccount = {
    id: userId,
    fullName: params.fullName.trim(),
    email: params.email.trim().toLowerCase(),
    passwordHash: params.password,
    role: 'owner',
    workspaceId,
    workspaceName: newWorkspace.name,
    workspaceSlug: newWorkspace.slug,
    avatarUrl: '',
    createdAt: new Date().toISOString(),
  };

  workspaces.push(newWorkspace);
  users.push(newUser);

  const { passwordHash: _, ...safeUser } = newUser;
  const token = `prev_jwt_${userId}_${Date.now()}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return {
    user: safeUser,
    session: {
      user: safeUser,
      workspaceSlug: safeUser.workspaceSlug,
      workspaceName: safeUser.workspaceName,
      token,
      expiresAt,
    },
  };
}
