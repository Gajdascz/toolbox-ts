import { describe, expect, it } from 'vitest';

import { THIS_PACKAGE } from '../constants/index.ts';
import {
  createRuntimeConfigModule,
  createStaticConfigModule
} from './factories.ts';
describe('Config Module Factories', () => {
  it('should normalize dependencies', () => {
    const module = createRuntimeConfigModule({
      dependencies: ['@my/pkg', { packageName: '@my/pkg' }],
      define: (input) => input,
      filename: 'app.config.ts',
      importName: 'appConfig',
      importFrom: '@my/pkg'
    });
    expect(module.meta.dependencies).toEqual([
      { packageName: '@my/pkg' },
      { packageName: '@my/pkg' }
    ]);
  });
  describe('runtime', () => {
    describe('createRuntimeConfigModule', () => {
      it('should pass input through define function', () => {
        const module = createRuntimeConfigModule({
          filename: 'transform.config.ts',
          importName: 'transformConfig',
          dependencies: [],
          define: (input: { value: number }) => ({
            ...input,
            doubled: input.value * 2
          })
        });

        const result = module.define({ value: 5 });

        expect(result).toEqual({ value: 5, doubled: 10 });
      });

      it('should generate correct template string', () => {
        const module = createRuntimeConfigModule({
          define: (input: { name: string }) => input,
          dependencies: [],
          filename: 'app.config.ts',
          importName: 'appConfig',
          importFrom: '@my/pkg'
        });

        const template = module.getTemplateString({ name: 'test-app' });

        expect(template).toContain("import { appConfig } from '@my/pkg';");
        expect(template).toContain('export default appConfig.define(');
        expect(template).toContain('"name": "test-app"');
      });

      it('should apply define transformation in template string', () => {
        const module = createRuntimeConfigModule({
          define: (input: { count: number }) => ({
            count: input.count,
            isPositive: input.count > 0
          }),
          dependencies: [],
          filename: 'computed.config.ts',
          importName: 'computedConfig',
          importFrom: THIS_PACKAGE
        });

        const template = module.getTemplateString({ count: 10 });

        expect(template).toContain('"count": 10');
        expect(template).toContain('"isPositive": true');
      });

      it('should handle complex nested objects', () => {
        const module = createRuntimeConfigModule({
          define: (input: { nested: { a: number; b: string[] } }) => input,
          dependencies: [],
          filename: 'nested.config.ts',
          importName: 'nestedConfig',
          importFrom: THIS_PACKAGE
        });

        const template = module.getTemplateString({
          nested: { a: 1, b: ['x', 'y'] }
        });

        expect(template).toContain('"nested"');
        expect(template).toContain('"a": 1');
        expect(template).toContain('"b"');
      });

      it('should format JSON with 2-space indentation', () => {
        const module = createRuntimeConfigModule({
          define: (input: { key: string }) => input,
          dependencies: [],
          filename: 'format.config.ts',
          importName: 'formatConfig',
          importFrom: THIS_PACKAGE
        });

        const template = module.getTemplateString({ key: 'value' });

        expect(template).toContain('{\n  "key": "value"\n}');
      });

      it('should return identity when define is passthrough', () => {
        const module = createRuntimeConfigModule({
          define: (input) => input,
          dependencies: [],
          filename: 'identity.config.ts',
          importName: 'identityConfig',
          importFrom: THIS_PACKAGE
        });

        expect(module.define({ data: true })).toEqual({ data: true });
      });
    });
  });
  describe('static', () => {
    it('should create module with meta', () => {
      const module = createStaticConfigModule({
        define: (input: { key: string }) => input,
        dependencies: [],
        filename: 'static.config.json'
      });

      expect(module.meta.filename).toBe('static.config.json');
    });

    it('should pass input through define function', () => {
      const module = createStaticConfigModule({
        define: (input: { value: number }) => ({
          ...input,
          doubled: input.value * 2
        }),
        dependencies: [],
        filename: 'static.config.json'
      });

      const result = module.define({ value: 5 });

      expect(result).toEqual({ value: 5, doubled: 10 });
    });

    it('should handle complex transformations', () => {
      const module = createStaticConfigModule({
        define: (input: { items: string[] }) => ({
          count: input.items.length,
          items: input.items.map((i) => i.toUpperCase())
        }),
        dependencies: [],
        filename: 'transform.json'
      });

      const result = module.define({ items: ['a', 'b', 'c'] });

      expect(result.count).toBe(3);
      expect(result.items).toEqual(['A', 'B', 'C']);
    });

    it('should handle undefined input', () => {
      const module = createStaticConfigModule({
        define: (input?: { optional?: string }) => ({
          value: input?.optional ?? 'default'
        }),
        dependencies: [],
        filename: 'optional.json'
      });

      const result = module.define();

      expect(result.value).toBe('default');
    });
  });
});
