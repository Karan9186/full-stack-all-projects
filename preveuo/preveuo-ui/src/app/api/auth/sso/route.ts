import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Workspace } from '@/lib/db/models/Workspace';
import { User } from '@/lib/db/models/User';
import { ensureDefaultDataSeeded } from '@/lib/db/seedDefaultData';
import { AuthApiResponse, LoginApiResponseData, AuthSession } from '@/types/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceSlug } = body;

    if (!workspaceSlug || !workspaceSlug.trim()) {
      return NextResponse.json<AuthApiResponse>(
        { success: false, error: 'Workspace domain slug is required.' },
        { status: 400 }
      );
    }

    const cleanSlug = workspaceSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');

    await connectToDatabase();
    await ensureDefaultDataSeeded();

    const workspaceDoc = await Workspace.findOne({ slug: cleanSlug });

    if (!workspaceDoc) {
      return NextResponse.json<AuthApiResponse>(
        {
          success: false,
          error: `No enterprise workspace found for "${cleanSlug}.preveuo.com". Please check your domain or contact IT.`,
        },
        { status: 404 }
      );
    }

    // Lookup workspace owner or admin
    let userDoc = await User.findById(workspaceDoc.ownerId);
    if (!userDoc) {
      userDoc = await User.findOne({ 'workspaces.workspaceId': workspaceDoc._id });
    }

    const safeUser = userDoc
      ? {
          id: userDoc._id.toString(),
          fullName: userDoc.fullName,
          email: userDoc.email,
          avatarUrl: userDoc.avatarUrl || '',
          role: 'admin' as const,
          workspaceId: workspaceDoc._id.toString(),
          workspaceName: workspaceDoc.name,
          workspaceSlug: workspaceDoc.slug,
          createdAt: userDoc.createdAt.toISOString(),
        }
      : {
          id: `sso_${workspaceDoc._id}`,
          fullName: 'SSO Corporate User',
          email: `sso@${workspaceDoc.slug}.com`,
          avatarUrl: '',
          role: 'admin' as const,
          workspaceId: workspaceDoc._id.toString(),
          workspaceName: workspaceDoc.name,
          workspaceSlug: workspaceDoc.slug,
          createdAt: new Date().toISOString(),
        };

    const token = `prev_sso_${workspaceDoc._id}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const session: AuthSession = {
      user: safeUser,
      workspaceSlug: workspaceDoc.slug,
      workspaceName: workspaceDoc.name,
      token,
      expiresAt,
    };

    const responseData: LoginApiResponseData = {
      session,
      redirectUrl: `/workspace?tab=home&slug=${workspaceDoc.slug}`,
    };

    const response = NextResponse.json<AuthApiResponse<LoginApiResponseData>>({
      success: true,
      data: responseData,
      message: `SSO authentication successful for ${workspaceDoc.name}!`,
    });

    response.cookies.set({
      name: 'preveuo_token',
      value: token,
      path: '/',
      httpOnly: false,
      maxAge: 24 * 60 * 60,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('[MongoDB SSO API error]:', error);
    return NextResponse.json<AuthApiResponse>(
      { success: false, error: 'SSO provider handshake failed.' },
      { status: 500 }
    );
  }
}
