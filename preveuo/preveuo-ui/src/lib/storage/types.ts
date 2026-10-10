export interface StorageUploadResult {
  url: string;
  filename: string;
  type: 'image' | 'video';
  mimeType: string;
  size: number;
}

export interface IStorageProvider {
  readonly name: string;
  upload(file: File): Promise<StorageUploadResult>;
  delete?(fileUrl: string): Promise<boolean>;
}
