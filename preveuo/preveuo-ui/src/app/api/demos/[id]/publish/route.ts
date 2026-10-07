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
    const publishResult = await DemoService.publishDemo(auth.workspaceId, id, auth.userId);

    if (!publishResult) {
      return NextResponse.json({ success: false, error: 'Failed to publish demo' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: publishResult,
      message: `Demo successfully published! Live at ${publishResult.publicUrl}`,
    });
  } catch (error: any) {
    console.error('[POST /api/demos/[id]/publish error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to publish demo' },
      { status: 400 }
    );
  }
}
