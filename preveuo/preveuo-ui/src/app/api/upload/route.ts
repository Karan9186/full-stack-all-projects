import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

    const mimeType = file.type || '';
    const isImage = mimeType.startsWith('image/');
    const isVideo = mimeType.startsWith('video/');

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, error: 'Only image and video files are supported' },
        { status: 400 }
      );
    }

    // Maximum file sizes: 50MB for video, 20MB for image
    const maxSize = isVideo ? 50 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds limit (${isVideo ? '50MB' : '20MB'})`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Sanitize extension
    const originalExt = path.extname(file.name).toLowerCase() || (isImage ? '.png' : '.mp4');
    const safeBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const filename = `${safeBaseName}_${uniqueSuffix}${originalExt}`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      type: isVideo ? 'video' : 'image',
      mimeType,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
