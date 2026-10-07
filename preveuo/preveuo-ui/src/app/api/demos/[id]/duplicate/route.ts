import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth/getAuthSession';
import { DemoService } from '@/lib/services/demoService';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthContext(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const duplicated = await DemoService.duplicateDemo(auth.workspaceId, id, auth.userId);

    if (!duplicated) {
      return NextResponse.json({ success: false, error: 'Failed to duplicate demo' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: duplicated }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/demos/[id]/duplicate error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to duplicate demo' }, { status: 500 });
  }
}
