/**
 * Viral share: challenge link + shareable score image.
 * "I scored 27 in HUMAN OR AI. Can you beat me?"
 */

import { PLAY_STORE_URL } from '../constants/appLinks';

const SHARE_HASHTAG = '#HumanOrAI';

export function getChallengeLink(score: number): string {
  return PLAY_STORE_URL || `https://play.google.com/store/apps/details?id=com.humanorai.game`;
}

export function getShareMessage(score: number, t: (key: string, opts?: { score?: number }) => string): string {
  return t('share.message', { score });
}

export function getShareMessageWithLink(score: number, t: (key: string, opts?: { score?: number }) => string): string {
  return `${getShareMessage(score, t)}\n${getChallengeLink(score)}`;
}

/** Social share targets for share sheet */
export const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
  { id: 'twitter', name: 'X (Twitter)', icon: '𝕏' },
] as const;

/** Generate data for shareable score image (e.g. for ViewShot). Text overlay: score + CTA */
export function getScoreImageData(score: number): { title: string; subtitle: string; cta: string } {
  return {
    title: `${score}`,
    subtitle: 'Human or AI?',
    cta: 'Can you beat me?',
  };
}
