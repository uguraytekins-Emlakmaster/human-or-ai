/**
 * Unit tests for image dataset
 */

import { buildDataset, getImagesForLevel, pickNextImage } from '../dataset';

describe('buildDataset', () => {
  it('returns requested size', () => {
    const pool = buildDataset(50);
    expect(pool).toHaveLength(50);
  });

  it('each image has required fields', () => {
    const pool = buildDataset(10);
    pool.forEach((img) => {
      expect(img).toHaveProperty('id');
      expect(img).toHaveProperty('uri');
      expect(img).toHaveProperty('imageType');
      expect(['real', 'ai']).toContain(img.imageType);
      expect(img).toHaveProperty('difficultyLevel');
      expect(img).toHaveProperty('category');
      expect(img.uri).toMatch(/^https:\/\//);
    });
  });

  it('mix of real and ai', () => {
    const pool = buildDataset(20);
    const real = pool.filter((i) => i.imageType === 'real');
    const ai = pool.filter((i) => i.imageType === 'ai');
    expect(real.length).toBeGreaterThan(0);
    expect(ai.length).toBeGreaterThan(0);
  });
});

describe('getImagesForLevel', () => {
  it('returns images in difficulty range', () => {
    const pool = buildDataset(100);
    const result = getImagesForLevel(pool, 5, 10);
    expect(result.length).toBeLessThanOrEqual(10);
    result.forEach((img) => {
      expect(img.difficultyLevel).toBeGreaterThanOrEqual(3);
      expect(img.difficultyLevel).toBeLessThanOrEqual(8);
    });
  });

  it('excludes given ids', () => {
    const pool = buildDataset(50);
    const exclude = new Set([pool[0].id, pool[1].id]);
    const result = getImagesForLevel(pool, 1, 20, exclude);
    const ids = result.map((i) => i.id);
    expect(ids).not.toContain(pool[0].id);
    expect(ids).not.toContain(pool[1].id);
  });
});

describe('pickNextImage', () => {
  it('returns an image when pool has candidates', () => {
    const pool = buildDataset(50);
    const next = pickNextImage(pool, 3, [], false);
    expect(next).not.toBeNull();
    expect(pool).toContain(next);
  });

  it('can exclude recent ids', () => {
    const pool = buildDataset(30);
    const recent = pool.slice(0, 5).map((i) => i.id);
    const next = pickNextImage(pool, 2, recent, false);
    expect(next).not.toBeNull();
    if (next) expect(recent).not.toContain(next.id);
  });
});
