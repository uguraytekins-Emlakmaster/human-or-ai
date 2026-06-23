/**
 * Video içeriği – ücretsiz kaynaklar, sıfır depolama maliyeti.
 * Tüm URL'ler doğrudan sağlayıcı sunucularından (lorem.video, Google sample bucket)
 * oynatılır; uygulama hiç video depolamaz.
 *
 * Kaynaklar:
 * - lorem.video: Ücretsiz placeholder API, CORS uyumlu (5–10 sn klipler)
 * - Google GCS sample bucket: Kamu malı örnek videolar
 */

import type { GameContent, ImageType, ImageCategory } from '../logic/types';

const CATEGORIES: ImageCategory[] = [
  'portrait',
  'animal',
  'food',
  'architecture',
  'object',
  'landscape',
  'nature',
  'art',
];

/** Ücretsiz, doğrudan oynatılabilir video URL'leri (lorem.video – 5–10 sn) */
const LOREM_VIDEO_URLS: string[] = [
  'https://lorem.video/bunny_720p_h264_5s',
  'https://lorem.video/bunny_480p_h264_5s',
  'https://lorem.video/bunny_720p_h264_8s',
  'https://lorem.video/bunny_480p_h264_8s',
  'https://lorem.video/cat_720p_h264_5s',
  'https://lorem.video/cat_480p_h264_5s',
  'https://lorem.video/cat_720p_h264_8s',
  'https://lorem.video/cat_480p_h264_8s',
  'https://lorem.video/corgi_720p_h264_5s',
  'https://lorem.video/corgi_480p_h264_5s',
  'https://lorem.video/corgi_720p_h264_8s',
  'https://lorem.video/corgi_480p_h264_8s',
  'https://lorem.video/test_720p_h264_5s',
  'https://lorem.video/test_480p_h264_5s',
  'https://lorem.video/test_720p_h264_8s',
  'https://lorem.video/test_480p_h264_8s',
  'https://lorem.video/bunny_720p_h264_10s',
  'https://lorem.video/bunny_480p_h264_10s',
  'https://lorem.video/cat_720p_h264_10s',
  'https://lorem.video/cat_480p_h264_10s',
  'https://lorem.video/corgi_720p_h264_10s',
  'https://lorem.video/corgi_480p_h264_10s',
  'https://lorem.video/test_720p_h264_10s',
  'https://lorem.video/test_480p_h264_10s',
  'https://lorem.video/720p_h264_5s',
  'https://lorem.video/480p_h264_5s',
  'https://lorem.video/720p_h264_8s',
  'https://lorem.video/480p_h264_8s',
  'https://lorem.video/720p_h264_10s',
  'https://lorem.video/480p_h264_10s',
];

/** Google sample bucket – kamu malı / test videoları (kısa klipler) */
const GOOGLE_SAMPLE_URLS: string[] = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
];

const ALL_VIDEO_URLS = [...LOREM_VIDEO_URLS, ...GOOGLE_SAMPLE_URLS];

/**
 * Zengin video havuzu oluşturur (60+ öğe).
 * Her URL farklı difficulty/category/imageType ile birden fazla kez kullanılır.
 */
export function buildVideoContent(): GameContent[] {
  const list: GameContent[] = [];
  for (let i = 0; i < 72; i++) {
    const url = ALL_VIDEO_URLS[i % ALL_VIDEO_URLS.length];
    const id = `video-${i}`;
    const imageType: ImageType = i % 2 === 0 ? 'real' : 'ai';
    const category = CATEGORIES[i % CATEGORIES.length];
    const difficultyLevel = Math.min(20, Math.floor(i / 4) + 1);
    list.push({
      contentType: 'video',
      id,
      imageType,
      difficultyLevel,
      category,
      videoUri: url,
    });
  }
  return list;
}

export function pickNextVideo(
  pool: GameContent[],
  level: number,
  recentIds: string[],
  levelMin: number,
  levelMax: number
): GameContent | null {
  const exclude = new Set(recentIds);
  const minD = Math.max(levelMin, level - 2);
  const maxD = Math.min(levelMax, level + 3);
  const candidates = pool.filter(
    (c) =>
      c.contentType === 'video' &&
      c.difficultyLevel >= minD &&
      c.difficultyLevel <= maxD &&
      !exclude.has(c.id)
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** Video turu için sabit 2 video (gerçek URI'ler). */
const VIDEO_TOUR_URIS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
];

export function getVideoTourContents(): GameContent[] {
  const pool = buildVideoContent();
  const byUri = new Map(pool.map((c) => [c.videoUri, c]));
  return VIDEO_TOUR_URIS.map((uri, i) => {
    const existing = byUri.get(uri);
    if (existing) return existing;
    return {
      contentType: 'video' as const,
      id: `video-tour-${i}`,
      imageType: (i % 2 === 0 ? 'real' : 'ai') as ImageType,
      difficultyLevel: 5,
      category: 'landscape' as ImageCategory,
      videoUri: uri,
    };
  }).filter((c): c is GameContent => !!c.videoUri);
}
