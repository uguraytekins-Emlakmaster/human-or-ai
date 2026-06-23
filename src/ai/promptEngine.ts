/**
 * AI Image Prompt Engine
 * Prompts designed to generate convincing real-looking AI images.
 * Can be used with Stable Diffusion, DALL·E, or Midjourney-style APIs.
 */

export const REALISTIC_PROMPTS = {
  portrait: [
    'ultra realistic portrait photography, studio lighting, natural skin texture, DSLR photo, 50mm lens, depth of field',
    'professional headshot, soft lighting, sharp focus, human portrait, 85mm, shallow depth of field',
    'editorial portrait, natural light, authentic skin pores, high resolution photograph',
  ],
  animal: [
    'wildlife photography, animal in natural habitat, sharp focus, golden hour, National Geographic style',
    'macro animal photo, detailed fur texture, professional nature photography',
    'pet portrait, studio lighting, shallow depth of field, 50mm',
  ],
  food: [
    'food photography, restaurant menu style, natural lighting, appetizing, high resolution',
    'culinary photo, steam rising, fresh ingredients, commercial food photography',
    'minimalist food shot, white background, professional product photography',
  ],
  nature: [
    'nature photography, forest, natural lighting, organic texture, high resolution',
    'wilderness landscape, authentic foliage, natural depth of field',
  ],
  landscape: [
    'landscape photography, golden hour, dramatic sky, wide angle, 16mm, sharp foreground',
    'mountain scenery, natural lighting, Ansel Adams style, large format',
    'urban landscape, cityscape at dusk, long exposure, professional travel photo',
  ],
  architecture: [
    'architecture photography, clean lines, dramatic shadows, wide angle, HDR',
    'interior design photo, natural light, minimalist, professional real estate',
    'building exterior, blue hour, symmetrical composition, sharp details',
  ],
  object: [
    'product photography, white background, studio lighting, commercial shot',
    'still life, natural texture, soft shadows, 100mm macro',
    'minimalist object photo, clean composition, professional advertisement',
  ],
  art: [
    'digital art mimicking oil painting, realistic brush strokes, gallery quality',
    'photorealistic illustration, fine art style, museum lighting',
    'mixed media art, hyperrealistic elements, contemporary art style',
  ],
  fashion: [
    'fashion photography, editorial, natural skin, studio lighting, Vogue style',
    'street style photography, candid, natural lighting, 35mm film look',
    'model portrait, high fashion, dramatic lighting, sharp focus',
  ],
  street: [
    'street photography, candid moment, natural light, 35mm, documentary style',
    'urban life photo, human element, golden hour, authentic moment',
    'city street scene, passerby, shallow depth of field, Leica style',
  ],
} as const;

export type PromptCategory = keyof typeof REALISTIC_PROMPTS;

export function getRandomPrompt(category: PromptCategory): string {
  const prompts = REALISTIC_PROMPTS[category];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

/**
 * Placeholder for calling an actual AI image API.
 * Returns null when no API key; app falls back to dataset.
 */
export async function generateAIImage(
  category: PromptCategory,
  _apiKey?: string
): Promise<{ uri: string; prompt: string } | null> {
  const prompt = getRandomPrompt(category);
  // In production: call Stability AI, OpenAI, or Replicate API
  // return { uri: response.url, prompt };
  return null;
}
