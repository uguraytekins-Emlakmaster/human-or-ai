/**
 * Content loader – single entry point for game content.
 * Currently uses built-in datasets (image, audio, text, video). For production:
 * - Load from remote JSON (e.g. CONTENT_API_URL) to support daily updates or A/B sets.
 * - Optional: fetch image/audio URLs from CDN by ID.
 */

export { selectNextContent } from './selectContent';
