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
    const fullDemo = await DemoService.getDemoById(auth.workspaceId, id);

    if (!fullDemo) {
      return NextResponse.json({ success: false, error: 'Demo not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: fullDemo });
  } catch (error) {
    console.error('[GET /api/demos/[id] error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve demo' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthContext(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updatedDemo = await DemoService.updateDemo(auth.workspaceId, id, body);
    if (!updatedDemo) {
      return NextResponse.json({ success: false, error: 'Demo not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedDemo });
  } catch (error) {
    console.error('[PATCH /api/demos/[id] error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to update demo' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthContext(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const success = await DemoService.deleteDemo(auth.workspaceId, id);

    if (!success) {
      return NextResponse.json({ success: false, error: 'Demo not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Demo deleted successfully' });
  } catch (error) {
    console.error('[DELETE /api/demos/[id] error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete demo' }, { status: 500 });
  }
}
