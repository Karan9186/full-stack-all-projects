import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth/getAuthSession';
import { DemoService } from '@/lib/services/demoService';
export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const type = searchParams.get('type') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const result = await DemoService.getDemos(auth.workspaceId, {
      search,
      status,
      type,
      page,
      limit,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('[GET /api/demos error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve demos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, type, initialImageUrl } = body;

    const fullDemo = await DemoService.createDemo(auth.workspaceId, auth.userId, {
      name: name || 'Untitled Interactive Tour',
      description,
      type,
      initialImageUrl,
    });

    return NextResponse.json({ success: true, data: fullDemo }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/demos error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to create demo' }, { status: 500 });
  }
}
