import { describe, expect, it } from 'vitest';

import { createBaseConfig, extendRoot, ROOT } from './root.js';

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

describe('extendRoot', () => {
  it('extends the ROOT config with additional extends, plugins, and rules', () => {
    const res = extendRoot({
      extends: ['some-other-config'],
      plugins: { 'custom-plugin': {} },
      rules: { 'custom-rule': 'error' }
    });
    expect(res.extends).toContain('some-other-config');
    expect(res.plugins).toHaveProperty('custom-plugin');
    expect(res.rules).toHaveProperty('custom-rule', 'error');
  });
});
