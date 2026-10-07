import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import { Workspace } from '@/lib/db/models/Workspace';
import { ensureDefaultDataSeeded } from '@/lib/db/seedDefaultData';
import { AuthApiResponse, LoginApiResponseData, AuthSession } from '@/types/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !email.trim()) {
      return NextResponse.json<AuthApiResponse>(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json<AuthApiResponse>(
        { success: false, error: 'Password is required.' },
        { status: 400 }
      );
    }

    // Connect to real MongoDB
    await connectToDatabase();
    await ensureDefaultDataSeeded();

    const normalizedEmail = email.toLowerCase().trim();
    const userDoc = await User.findOne({ email: normalizedEmail }).populate('defaultWorkspaceId');

    if (!userDoc) {
      return NextResponse.json<AuthApiResponse>(
        {
          success: false,
          error: 'No account found with this email address. Please verify your email or sign up.',
        },
        { status: 401 }
      );
    }

    // Verify bcrypt password hash
    const isPasswordValid = await bcrypt.compare(password, userDoc.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json<AuthApiResponse>(
        {
          success: false,
          error: 'Invalid password. Please check your credentials and try again.',
        },
        { status: 401 }
      );
    }

    // Resolve tenant workspace
    let workspaceDoc: any = userDoc.defaultWorkspaceId;
    if (!workspaceDoc && userDoc.workspaces.length > 0) {
      workspaceDoc = await Workspace.findById(userDoc.workspaces[0].workspaceId);
    }

    const workspaceSlug = workspaceDoc?.slug || 'acme-corp';
    const workspaceName = workspaceDoc?.name || 'Acme Corporation';

    const userMembership = userDoc.workspaces.find(
      (w) => w.workspaceId.toString() === workspaceDoc?._id?.toString()
    );

    const safeUser = {
      id: userDoc._id.toString(),
      fullName: userDoc.fullName,
      email: userDoc.email,
      avatarUrl: userDoc.avatarUrl || '',
      role: (userMembership?.role || 'owner') as any,
      workspaceId: workspaceDoc?._id?.toString() || '',
      workspaceName,
      workspaceSlug,
      createdAt: userDoc.createdAt.toISOString(),
    };

    const token = `prev_jwt_${userDoc._id}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const session: AuthSession = {
      user: safeUser,
      workspaceSlug,
      workspaceName,
      token,
      expiresAt,
    };

    const responseData: LoginApiResponseData = {
      session,
      redirectUrl: `/workspace?tab=home&slug=${workspaceSlug}`,
    };

    const response = NextResponse.json<AuthApiResponse<LoginApiResponseData>>({
      success: true,
      data: responseData,
      message: `Welcome back, ${userDoc.fullName}!`,
    });

    response.cookies.set({
      name: 'preveuo_token',
      value: token,
      path: '/',
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('[MongoDB Login API error]:', error);
    return NextResponse.json<AuthApiResponse>(
      { success: false, error: 'Database authentication service failed. Please try again.' },
      { status: 500 }
    );
  }
}
