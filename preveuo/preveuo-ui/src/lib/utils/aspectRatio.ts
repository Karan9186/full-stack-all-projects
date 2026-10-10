import { IDemo, IDemoScene } from '@/types/demo';

export interface AspectRatioInfo {
  width: number;
  height: number;
  ratio: number;
  label: string;
  cssRatio: string;
}

export interface CanonicalAspectRatioInfo extends AspectRatioInfo {
  isDefault: boolean;
}

/**
 * Standard aspect ratios table with tolerance window
 */
const STANDARD_RATIOS: Array<{ label: string; ratio: number; tolerance: number }> = [
  { label: '16:9', ratio: 16 / 9, tolerance: 0.035 }, // ~1.7778 (1920x1080, 1280x720, 2560x1440)
  { label: '16:10', ratio: 16 / 10, tolerance: 0.035 }, // ~1.6000 (1440x900, 1920x1200, 2880x1800)
  { label: '2:1', ratio: 2 / 1, tolerance: 0.045 }, // ~2.0000 (2876x1440 = 1.9972 -> matches 2:1)
  { label: '4:3', ratio: 4 / 3, tolerance: 0.035 }, // ~1.3333 (1024x768, 1600x1200)
  { label: '3:2', ratio: 3 / 2, tolerance: 0.035 }, // ~1.5000 (1500x1000, 3000x2000)
  { label: '1:1', ratio: 1 / 1, tolerance: 0.035 }, // 1.0000 (square)
  { label: '21:9', ratio: 21 / 9, tolerance: 0.045 }, // ~2.3333 (ultrawide)
  { label: '5:4', ratio: 5 / 4, tolerance: 0.035 }, // ~1.2500
  { label: '9:16', ratio: 9 / 16, tolerance: 0.035 }, // ~0.5625 (mobile portrait)
  { label: '10:16', ratio: 10 / 16, tolerance: 0.035 }, // ~0.6250
  { label: '3:4', ratio: 3 / 4, tolerance: 0.035 }, // ~0.7500
];

/**
 * Greatest common divisor for simplifying non-standard integer ratios
 */
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Calculates aspect ratio information for given width and height
 */
export function calculateAspectRatio(width: number, height: number): AspectRatioInfo {
  const safeWidth = Math.max(1, Math.round(width));
  const safeHeight = Math.max(1, Math.round(height));
  const numericRatio = safeWidth / safeHeight;

  // 1. Check if matches one of the recognized standard ratios within tolerance
  for (const std of STANDARD_RATIOS) {
    if (Math.abs(numericRatio - std.ratio) <= std.tolerance) {
      return {
        width: safeWidth,
        height: safeHeight,
        ratio: numericRatio,
        label: std.label,
        cssRatio: `${safeWidth} / ${safeHeight}`,
      };
    }
  }

  // 2. Try simplifying via GCD if relatively small integers
  const divisor = gcd(safeWidth, safeHeight);
  const simpleW = safeWidth / divisor;
  const simpleH = safeHeight / divisor;

  if (simpleW <= 32 && simpleH <= 32) {
    return {
      width: safeWidth,
      height: safeHeight,
      ratio: numericRatio,
      label: `${simpleW}:${simpleH}`,
      cssRatio: `${safeWidth} / ${safeHeight}`,
    };
  }

  // 3. Fallback to decimal:1 representation
  return {
    width: safeWidth,
    height: safeHeight,
    ratio: numericRatio,
    label: `${numericRatio.toFixed(2)}:1`,
    cssRatio: `${safeWidth} / ${safeHeight}`,
  };
}

/**
 * Checks if two aspect ratios match within tolerance (e.g. 1920x1080 vs 1280x720)
 */
export function areAspectRatiosMatching(
  ratio1: number,
  ratio2: number,
  tolerance = 0.04
): boolean {
  if (ratio1 <= 0 || ratio2 <= 0) return true;
  return Math.abs(ratio1 - ratio2) <= tolerance;
}

/**
 * Resolves the canonical aspect ratio for a demo following the single source of truth rules:
 * 1. Demo settings canonicalWidth & canonicalHeight (or aspectRatio string)
 * 2. First scene viewport width & height
 * 3. Default fallback: 1920 × 1080 (16:9)
 */
export function getCanonicalDemoAspectRatio(
  demo?: IDemo | null,
  scenes?: IDemoScene[]
): CanonicalAspectRatioInfo {
  // 1. Explicit canonical dimensions on demo settings
  if (
    demo?.settings?.canonicalWidth &&
    demo?.settings?.canonicalHeight &&
    demo.settings.canonicalWidth > 0 &&
    demo.settings.canonicalHeight > 0
  ) {
    const info = calculateAspectRatio(
      demo.settings.canonicalWidth,
      demo.settings.canonicalHeight
    );
    return {
      ...info,
      label: demo.settings.aspectRatio || info.label,
      isDefault: false,
    };
  }

  // 2. First valid scene's viewport
  if (scenes && scenes.length > 0) {
    const firstScene = scenes.find((s) => s.viewport?.width > 0 && s.viewport?.height > 0) || scenes[0];
    if (firstScene?.viewport?.width && firstScene?.viewport?.height) {
      const info = calculateAspectRatio(firstScene.viewport.width, firstScene.viewport.height);
      return {
        ...info,
        label: firstScene.viewport.aspectRatio || info.label,
        isDefault: false,
      };
    }
  }

  // 3. String aspect ratio on demo settings if defined without raw dimensions
  if (demo?.settings?.aspectRatio) {
    const found = STANDARD_RATIOS.find((r) => r.label === demo.settings.aspectRatio);
    if (found) {
      const [w, h] = found.label.split(':').map(Number);
      return {
        width: w * 120,
        height: h * 120,
        ratio: found.ratio,
        label: found.label,
        cssRatio: `${w} / ${h}`,
        isDefault: false,
      };
    }
  }

  // 4. Default fallback: 1920 × 1080 (16:9)
  return {
    width: 1920,
    height: 1080,
    ratio: 16 / 9,
    label: '16:9',
    cssRatio: '16 / 9',
    isDefault: true,
  };
}

/**
 * Measures actual dimensions of an image or video file or URL asynchronously
 */
export function getImageDimensions(
  fileOrUrl: File | Blob | string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    // If string URL
    if (typeof fileOrUrl === 'string') {
      const isVideoUrl = Boolean(fileOrUrl.match(/\.(mp4|webm|mov|m4v|ogg)$/i));

      if (isVideoUrl) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            resolve({ width: video.videoWidth, height: video.videoHeight });
          } else {
            resolve({ width: 1920, height: 1080 });
          }
        };
        video.onerror = () => {
          reject(new Error('Failed to load video metadata from URL.'));
        };
        video.src = fileOrUrl;
      } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
          } else {
            resolve({ width: 1920, height: 1080 });
          }
        };
        img.onerror = () => {
          reject(new Error('Failed to load image from URL.'));
        };
        img.src = fileOrUrl;
      }
      return;
    }

    // If File or Blob object
    const isVideoFile =
      fileOrUrl.type.startsWith('video/') ||
      Boolean((fileOrUrl as File).name?.match(/\.(mp4|webm|mov|m4v|ogg)$/i));

    const objectUrl = URL.createObjectURL(fileOrUrl);

    if (isVideoFile) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          resolve({ width: video.videoWidth, height: video.videoHeight });
        } else {
          resolve({ width: 1920, height: 1080 });
        }
      };
      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to inspect video dimensions.'));
      };
      video.src = objectUrl;
    } else {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        } else {
          resolve({ width: 1920, height: 1080 });
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to inspect image dimensions. The file may be corrupt or unreadable.'));
      };
      img.src = objectUrl;
    }
  });
}

/**
 * Centered crop of an image file to match target aspect ratio using an offscreen canvas
 * Preserves high quality and returns a new File object matching the target ratio
 */
export async function cropImageToAspectRatio(file: File, targetRatio: number): Promise<File> {
  // If target ratio is <= 0 or not an image file, return original
  if (targetRatio <= 0 || file.type.startsWith('video/')) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      const currentRatio = originalWidth / originalHeight;

      let cropX = 0;
      let cropY = 0;
      let cropWidth = originalWidth;
      let cropHeight = originalHeight;

      if (currentRatio > targetRatio) {
        // Image is wider than target ratio -> crop left & right
        cropHeight = originalHeight;
        cropWidth = Math.round(cropHeight * targetRatio);
        cropX = Math.round((originalWidth - cropWidth) / 2);
      } else {
        // Image is taller than target ratio -> crop top & bottom
        cropWidth = originalWidth;
        cropHeight = Math.round(cropWidth / targetRatio);
        cropY = Math.round((originalHeight - cropHeight) / 2);
      }

      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(file); // fallback to original if 2D context unavailable
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      const mimeType = file.type || 'image/png';
      const quality = mimeType === 'image/jpeg' || mimeType === 'image/webp' ? 0.95 : undefined;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const croppedFile = new File([blob], file.name, {
            type: mimeType,
            lastModified: Date.now(),
          });
          resolve(croppedFile);
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for cropping.'));
    };

    img.src = objectUrl;
  });
}
