import { NextRequest, NextResponse } from 'next/server';
import { getStorageProvider } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const storage = getStorageProvider();
    const result = await storage.upload(file);

    return NextResponse.json({
      success: true,
      ...result,
      provider: storage.name,
    });
  } catch (error: any) {
    console.error('[Upload error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
