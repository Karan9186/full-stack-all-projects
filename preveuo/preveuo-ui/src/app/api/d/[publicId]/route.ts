import { NextRequest, NextResponse } from 'next/server';
import { DemoService } from '@/lib/services/demoService';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await params;
    const snapshot = await DemoService.getPublicDemo(publicId);

    if (!snapshot) {
      return NextResponse.json({ success: false, error: 'Published demo not found or unavailable' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: snapshot });
  } catch (error) {
    console.error('[GET /api/d/[publicId] error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve demo experience' }, { status: 500 });
  }
}
