import { IStorageProvider } from './types';
import { LocalStorageProvider } from './localStorageProvider';
import { S3StorageProvider } from './s3StorageProvider';
import { CloudinaryStorageProvider } from './cloudinaryStorageProvider';

export * from './types';
export * from './localStorageProvider';
export * from './s3StorageProvider';
export * from './cloudinaryStorageProvider';

let storageInstance: IStorageProvider | null = null;

export function getStorageProvider(): IStorageProvider {
  if (storageInstance) return storageInstance;

  const providerType = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();

  switch (providerType) {
    case 's3':
      storageInstance = new S3StorageProvider();
      break;
    case 'cloudinary':
      storageInstance = new CloudinaryStorageProvider();
      break;
    case 'local':
    default:
      storageInstance = new LocalStorageProvider();
      break;
  }

  return storageInstance;
}
