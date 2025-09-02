import { describe, expect, it } from 'vitest';

import { createBaseConfig, ROOT } from './root.js';

describe('createBaseConfig', () => {
  it('returns a config with expected defaults and overrides', () => {
    const cfg = createBaseConfig('test', {
      files: ['src/index.ts'],
      ignores: ['custom-ignore']
    });
    expect(cfg.name).toBe('test');
    expect(cfg.extends[0]).toBe(ROOT);
    expect(cfg.files).toEqual(['src/index.ts']);
    expect(cfg.ignores).toContain('custom-ignore');
    expect(Array.isArray(cfg.importResolverNodeExtensions)).toBe(true);
    expect(typeof cfg.rules).toBe('object');
  });
});
