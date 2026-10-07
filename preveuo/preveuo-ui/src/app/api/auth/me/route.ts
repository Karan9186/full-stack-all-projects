import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import { Workspace } from '@/lib/db/models/Workspace';
import { ensureDefaultDataSeeded } from '@/lib/db/seedDefaultData';
import { AuthApiResponse, AuthSession } from '@/types/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('preveuo_token')?.value;

    await connectToDatabase();
    await ensureDefaultDataSeeded();

    // Default to primary owner user
    const userDoc = await User.findOne({ email: 'karan@acme.co' }).populate('defaultWorkspaceId');

    if (!userDoc) {
      return NextResponse.json<AuthApiResponse>(
        { success: false, error: 'Unauthenticated' },
        { status: 401 }
      );
    }

    let workspaceDoc: any = userDoc.defaultWorkspaceId;
    if (!workspaceDoc && userDoc.workspaces.length > 0) {
      workspaceDoc = await Workspace.findById(userDoc.workspaces[0].workspaceId);
    }

    const workspaceSlug = workspaceDoc?.slug || 'acme-corp';
    const workspaceName = workspaceDoc?.name || 'Acme Corporation';

    const safeUser = {
      id: userDoc._id.toString(),
      fullName: userDoc.fullName,
      email: userDoc.email,
      avatarUrl: userDoc.avatarUrl || '',
      role: 'owner' as const,
      workspaceId: workspaceDoc?._id?.toString() || '',
      workspaceName,
      workspaceSlug,
      createdAt: userDoc.createdAt.toISOString(),
    };

    const session: AuthSession = {
      user: safeUser,
      workspaceSlug,
      workspaceName,
      token: token || `prev_session_${userDoc._id}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return NextResponse.json<AuthApiResponse<AuthSession>>({
      success: true,
      data: session,
    });
  } catch (error: any) {
    if (error?.digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw error;
    }
    console.error('[MongoDB Session API error]:', error);
    return NextResponse.json<AuthApiResponse>(
      { success: false, error: 'Failed to retrieve session from database.' },
      { status: 500 }
    );
  }
}
