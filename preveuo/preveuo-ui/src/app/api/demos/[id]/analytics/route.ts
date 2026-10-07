import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth/getAuthSession';
import { DemoService } from '@/lib/services/demoService';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthContext(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const analytics = await DemoService.getDemoAnalytics(auth.workspaceId, id);

    if (!analytics) {
      return NextResponse.json({ success: false, error: 'Demo not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: analytics });
  } catch (error) {
    console.error('[GET /api/demos/[id]/analytics error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve demo analytics' }, { status: 500 });
  }
}
