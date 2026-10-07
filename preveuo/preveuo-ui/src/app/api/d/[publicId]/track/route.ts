import { NextRequest, NextResponse } from 'next/server';
import { DemoService } from '@/lib/services/demoService';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await params;
    const body = await req.json();

    const {
      sessionId,
      eventType,
      visitorId,
      sceneId,
      stepId,
      elementId,
      device,
      browser,
      referrer,
      metadata,
    } = body;

    if (!sessionId || !eventType) {
      return NextResponse.json({ success: false, error: 'sessionId and eventType are required' }, { status: 400 });
    }

    await DemoService.recordAnalyticsEvent({
      publicId,
      sessionId,
      eventType,
      visitorId,
      sceneId,
      stepId,
      elementId,
      device,
      browser,
      referrer,
      metadata,
    });

    return NextResponse.json({ success: true, message: 'Event tracked' });
  } catch (error) {
    console.error('[POST /api/d/[publicId]/track error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to record event' }, { status: 500 });
  }
}
