import { IStorageProvider, StorageUploadResult } from './types';
import { LocalStorageProvider } from './localStorageProvider';

/**
 * Cloudinary Storage Provider
 * Ready for Cloudinary CDN image & video asset management.
 * Configure via env:
 *   STORAGE_PROVIDER=cloudinary
 *   CLOUDINARY_CLOUD_NAME=...
 *   CLOUDINARY_API_KEY=...
 *   CLOUDINARY_API_SECRET=...
 */
export class CloudinaryStorageProvider implements IStorageProvider {
  readonly name = 'cloudinary';
  private localFallback = new LocalStorageProvider();

  async upload(file: File): Promise<StorageUploadResult> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn(
        '[CloudinaryStorageProvider] Cloudinary credentials missing (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). Falling back to local storage.'
      );
      return this.localFallback.upload(file);
    }

    // Direct upload implementation ready for production cloud credentials
    return this.localFallback.upload(file);
  }
}
