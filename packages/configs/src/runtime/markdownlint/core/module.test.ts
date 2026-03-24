import { describe, it, expect } from 'vitest';
import { define, DEFAULTS, toFileEntry } from './module.ts';

const minimal = (): Parameters<typeof define>[0] => ({});

describe('configs/runtime/markdownlint', () => {
  describe('define', () => {
    describe('globs', () => {
      it('includes default globs when none provided', () => {
        const result = define(minimal());
        for (const g of DEFAULTS.globs) expect(result.globs).toContain(g);
      });

      it('merges input globs with defaults', () => {
        const result = define({ globs: ['./docs/**/*.md'] });
        expect(result.globs).toContain('./docs/**/*.md');
        for (const g of DEFAULTS.globs) expect(result.globs).toContain(g);
      });

      it('deduplicates globs', () => {
        const result = define({ globs: [DEFAULTS.globs[0]] });
        const count = result.globs.filter((g) => g === DEFAULTS.globs[0]).length;
        expect(count).toBe(1);
      });

      it('empty globs input still includes defaults', () => {
        const result = define({ globs: [] });
        expect(result.globs).toEqual(expect.arrayContaining(DEFAULTS.globs));
      });
    });
    describe('ignores', () => {
      it('includes default ignores when none provided', () => {
        const result = define(minimal());
        for (const i of DEFAULTS.ignores) expect(result.ignores).toContain(i);
      });

      it('merges input ignores with defaults', () => {
        const result = define({ ignores: ['**/dist/**'] });
        expect(result.ignores).toContain('**/dist/**');
        for (const i of DEFAULTS.ignores) expect(result.ignores).toContain(i);
      });

      it('deduplicates ignores', () => {
        const result = define({ ignores: [DEFAULTS.ignores[0]] });
        const count = result.ignores.filter((i) => i === DEFAULTS.ignores[0]).length;
        expect(count).toBe(1);
      });
    });
    describe('config', () => {
      it('includes default config rules when none provided', () => {
        const result = define(minimal());
        expect(result.config.MD013).toBe(false);
        expect(result.config.MD033).toEqual(DEFAULTS.config.MD033);
      });

      it('merges input config over defaults', () => {
        const result = define({ config: { MD013: { line_length: 120 } as any } });
        expect(result.config.MD013).toEqual({ line_length: 120 });
      });

      it('input config does not mutate DEFAULTS.config', () => {
        const before = { ...DEFAULTS.config };
        define({ config: { MD001: true } as any });
        expect(DEFAULTS.config).toEqual(before);
      });

      it('preserves unrelated default rules when overriding one', () => {
        const result = define({ config: { MD013: true } as any });
        expect(result.config.MD033).toEqual(DEFAULTS.config.MD033);
      });

      it('caller can override MD033 allowed_elements', () => {
        const custom = { allowed_elements: ['div'] };
        const result = define({ config: { MD033: custom } });
        expect(result.config.MD033).toEqual(custom);
      });
    });
  });
  it('toFileEntry should produce correct file entry', () => {
    const config: Parameters<typeof define>[0] = {
      globs: ['**/*.md'],
      ignores: ['**/node_modules/**'],
      config: { MD001: true, MD033: { allowed_elements: ['span'] } }
    };
    const fileEntry = toFileEntry(config);
    expect(fileEntry).toMatchSnapshot();
  });
});
