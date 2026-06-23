/**
 * TikTok viral loop: export short vertical clip (image → guess → correct reveal).
 * Production: use react-native-view-shot for frames + FFmpeg or expo-av to encode
 * vertical video (9:16) for TikTok/Reels.
 */

export interface ClipSegment {
  imageUri: string;
  answer: 'real' | 'ai';
  correct: boolean;
}

export const CLIP_CONFIG = {
  width: 1080,
  height: 1920,
  durationPerSegment: 2,
  format: 'mp4' as const,
};

export async function exportClip(segments: ClipSegment[]): Promise<string | null> {
  // Production: composite segments into vertical video, save to gallery, return path
  return null;
}

export function canExportClip(): boolean {
  return false; // Enable when implementation is ready
}
