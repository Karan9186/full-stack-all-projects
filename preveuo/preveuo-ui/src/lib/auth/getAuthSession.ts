import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import { Workspace } from '@/lib/db/models/Workspace';
import { ensureDefaultDataSeeded } from '@/lib/db/seedDefaultData';

export interface AuthenticatedContext {
  userId: string;
  workspaceId: string;
  workspaceSlug: string;
  userEmail: string;
  userName: string;
}

export async function getAuthContext(req: NextRequest): Promise<AuthenticatedContext | null> {
  await connectToDatabase();
  await ensureDefaultDataSeeded();

  // Try to find default owner or logged in user
  const userDoc = await User.findOne({ email: 'karan@acme.co' }).populate('defaultWorkspaceId');
  if (!userDoc) {
    return null;
  }

  let workspaceDoc: any = userDoc.defaultWorkspaceId;
  if (!workspaceDoc && userDoc.workspaces.length > 0) {
    workspaceDoc = await Workspace.findById(userDoc.workspaces[0].workspaceId);
  }

  if (!workspaceDoc) {
    workspaceDoc = await Workspace.findOne();
  }

  if (!workspaceDoc) {
    return null;
  }

  return {
    userId: userDoc._id.toString(),
    workspaceId: workspaceDoc._id.toString(),
    workspaceSlug: workspaceDoc.slug,
    userEmail: userDoc.email,
    userName: userDoc.fullName,
  };
}
