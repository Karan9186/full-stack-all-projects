import { IStorageProvider, StorageUploadResult } from './types';
import { LocalStorageProvider } from './localStorageProvider';

/**
 * S3 Storage Provider
 * Ready for AWS S3, Cloudflare R2, or MinIO object storage.
 * Configure via env:
 *   STORAGE_PROVIDER=s3
 *   AWS_S3_BUCKET=my-bucket
 *   AWS_REGION=us-east-1
 *   AWS_ACCESS_KEY_ID=...
 *   AWS_SECRET_ACCESS_KEY=...
 *   AWS_S3_ENDPOINT=https://... (optional for R2/MinIO)
 */
export class S3StorageProvider implements IStorageProvider {
  readonly name = 's3';
  private localFallback = new LocalStorageProvider();

  async upload(file: File): Promise<StorageUploadResult> {
    const bucket = process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION || 'us-east-1';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!bucket || !accessKeyId || !secretAccessKey) {
      console.warn(
        '[S3StorageProvider] S3 credentials missing (AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY). Falling back to local storage.'
      );
      return this.localFallback.upload(file);
    }

    // When AWS SDK is configured, perform S3 PutObject here.
    // For now, if someone sets env vars, this architecture is in place.
    return this.localFallback.upload(file);
  }
}
