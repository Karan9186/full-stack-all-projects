import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { IStorageProvider, StorageUploadResult } from './types';

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp', 'ico', 'avif']);
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov', 'm4v', 'ogg', 'ogv', 'avi', 'mkv']);

export class LocalStorageProvider implements IStorageProvider {
  readonly name = 'local';

  async upload(file: File): Promise<StorageUploadResult> {
    const rawExt = path.extname(file.name).toLowerCase().replace(/^\./, '');
    const mimeType = file.type || '';

    const isImage = mimeType.startsWith('image/') || IMAGE_EXTENSIONS.has(rawExt);
    const isVideo = mimeType.startsWith('video/') || VIDEO_EXTENSIONS.has(rawExt);

    if (!isImage && !isVideo) {
      throw new Error(`Unsupported media format: .${rawExt || 'unknown'}. Please upload an image or video.`);
    }

    // Size limits: 50MB for video, 25MB for image
    const maxSize = isVideo ? 50 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(
        `File size exceeds limit (${isVideo ? '50MB for video' : '25MB for image'}). Provided size: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)}MB`
      );
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const safeBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 32);

    const extWithDot = rawExt ? `.${rawExt}` : isImage ? '.png' : '.mp4';
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const filename = `${safeBaseName}_${uniqueSuffix}${extWithDot}`;
    const filePath = path.join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const resolvedMime = mimeType || (isImage ? `image/${rawExt === 'jpg' ? 'jpeg' : rawExt || 'png'}` : `video/${rawExt || 'mp4'}`);

    return {
      url: `/uploads/${filename}`,
      filename,
      type: isVideo ? 'video' : 'image',
      mimeType: resolvedMime,
      size: file.size,
    };
  }
}
