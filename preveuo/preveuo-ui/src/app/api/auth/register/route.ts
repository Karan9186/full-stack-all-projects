import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import { Workspace } from '@/lib/db/models/Workspace';
import { ensureDefaultDataSeeded } from '@/lib/db/seedDefaultData';
import { AuthApiResponse, RegisterApiResponseData, RegisterRequestPayload, AuthSession } from '@/types/auth';
import { PRIMARY_COLOR } from '@/lib/constants/theme';

export async function POST(req: NextRequest) {
  try {
    const body: Partial<RegisterRequestPayload> = await req.json();

    const {
      fullName,
      email,
      password,
      agreedToTerms,
      workspaceName,
      workspaceSlug,
      role = 'founder',
      teamSize = '11-50',
      primaryGoal = 'sales',
    } = body;

    // Validate Account credentials
    if (!fullName || !fullName.trim()) {
      return NextResponse.json<AuthApiResponse>(
        { success: false, error: 'Full name is required.' },
        { status: 400 }
      );
    }

    if (!email || !email.trim() || !email.includes('@')) {
      return NextResponse.json<AuthApiResponse>(
        { success: false, error: 'A valid work email is required.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json<AuthApiResponse>(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    if (!agreedToTerms) {
      return NextResponse.json<AuthApiResponse>(
        { success: false, error: 'You must agree to the Terms of Service and Privacy Policy.' },
        { status: 400 }
      );
    }

    // Validate Multi-Tenant Workspace configuration
    if (!workspaceName || !workspaceName.trim()) {
      return NextResponse.json<AuthApiResponse>(
        { success: false, error: 'Workspace name is required.' },
        { status: 400 }
      );
    }

    if (!workspaceSlug || !workspaceSlug.trim()) {
      return NextResponse.json<AuthApiResponse>(
        { success: false, error: 'Workspace URL slug is required.' },
        { status: 400 }
      );
    }

    const cleanSlug = workspaceSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!cleanSlug) {
      return NextResponse.json<AuthApiResponse>(
        { success: false, error: 'Please enter a valid workspace slug with lowercase letters or numbers.' },
        { status: 400 }
      );
    }

    // Connect to real MongoDB
    await connectToDatabase();
    await ensureDefaultDataSeeded();

    const normalizedEmail = email.toLowerCase().trim();

    // Enforce uniqueness constraints
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json<AuthApiResponse>(
        { success: false, error: 'An account with this email address already exists. Please log in.' },
        { status: 400 }
      );
    }

    const existingWorkspace = await Workspace.findOne({ slug: cleanSlug });
    if (existingWorkspace) {
      return NextResponse.json<AuthApiResponse>(
        { success: false, error: `The workspace domain "preveuo.com/w/${cleanSlug}" is already taken. Please choose another.` },
        { status: 400 }
      );
    }

    // Hash password securely with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // 1. Create Workspace Document
    const newWorkspace = await Workspace.create({
      name: workspaceName.trim(),
      slug: cleanSlug,
      teamSize,
      primaryGoal,
      brandColor: PRIMARY_COLOR,
      customDomain: '',
      whiteLabel: true,
      plan: {
        name: 'pro',
        status: 'active',
        seatsLimit: teamSize === '1-10' ? 5 : teamSize === '11-50' ? 15 : 50,
        viewsLimit: 50000,
      },
      ssoSettings: {
        enabled: true,
        provider: 'SAML 2.0',
      },
    });

    // 2. Create User Document with membership linked to the workspace
    const newUser = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      avatarUrl: '',
      workspaces: [
        {
          workspaceId: newWorkspace._id,
          role: 'owner',
          joinedAt: new Date(),
        },
      ],
      defaultWorkspaceId: newWorkspace._id,
    });

    // Link ownerId back to workspace
    newWorkspace.ownerId = newUser._id as any;
    await newWorkspace.save();

    const token = `prev_jwt_${newUser._id}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const session: AuthSession = {
      user: {
        id: newUser._id.toString(),
        fullName: newUser.fullName,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl || '',
        role: 'owner',
        workspaceId: newWorkspace._id.toString(),
        workspaceName: newWorkspace.name,
        workspaceSlug: newWorkspace.slug,
        createdAt: newUser.createdAt.toISOString(),
      },
      workspaceSlug: newWorkspace.slug,
      workspaceName: newWorkspace.name,
      token,
      expiresAt,
    };

    const responseData: RegisterApiResponseData = {
      session,
      redirectUrl: `/workspace?tab=home&slug=${newWorkspace.slug}`,
    };

    const response = NextResponse.json<AuthApiResponse<RegisterApiResponseData>>({
      success: true,
      data: responseData,
      message: `Workspace "${newWorkspace.name}" created successfully!`,
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
    console.error('[MongoDB Register API error]:', error);
    return NextResponse.json<AuthApiResponse>(
      { success: false, error: 'Database error occurred while provisioning workspace. Please try again.' },
      { status: 500 }
    );
  }
}
