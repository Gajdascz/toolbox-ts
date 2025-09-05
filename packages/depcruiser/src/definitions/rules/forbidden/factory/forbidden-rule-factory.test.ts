import { describe, expect, it, vi } from 'vitest';

import { create } from './forbidden-rule-factory.ts';

vi.mock('../../utils/utils.js', () => ({
  normalizePaths: vi.fn((input) => {
    if (!input || (Array.isArray(input) && input.every((item) => !item))) {
      return undefined;
    }
    return Array.isArray(input) ?
        input.filter(Boolean)
      : [input].filter(Boolean);
  })
}));

describe('forbiddenRuleFactory', () => {
  describe('factory creation', () => {
    it('should create a factory with META properties', () => {
      const _factory = create('test-rule', 'Test rule description');

      expect(_factory.META.name).toBe('test-rule');
      expect(_factory.META.comment).toBe('Test rule description');
    });

    it('should create defaults with default values when no config provided', () => {
      const _factory = create('test-rule', 'Test description');

      expect(_factory.defaults.severity).toBe('error');
      expect(_factory.defaults.from).toEqual({});
      expect(_factory.defaults.to).toEqual({});
    });

    it('should create defaults with custom severity', () => {
      const _factory = create('test-rule', 'Test description', {
        severity: 'warn'
      });

      expect(_factory.defaults.severity).toBe('warn');
    });

    it('should create defaults with custom from configuration', () => {
      const fromConfig = { path: 'src/**' };
      const _factory = create('test-rule', 'Test description', {
        from: fromConfig
      });

      expect(_factory.defaults.from).toEqual(fromConfig);
    });

    it('should create defaults with custom to configuration', () => {
      const toConfig = { dependencyTypes: ['npm-dev'] };
      const _factory = create('test-rule', 'Test description', {
        to: { dependencyTypes: ['npm-dev'] }
      });

      expect(_factory.defaults.to).toEqual(toConfig);
    });

    it('should create defaults with all custom configurations', () => {
      const config = { from: { path: 'src/**' }, severity: 'info' as const };
      const _factory = create('test-rule', 'Test description', {
        ...config,
        to: { dependencyTypes: ['npm-dev'] }
      });

      expect(_factory.defaults.severity).toBe('info');
      expect(_factory.defaults.from).toEqual(config.from);
      expect(_factory.defaults.to).toEqual({ dependencyTypes: ['npm-dev'] });
    });
  });

  describe('generate method', () => {
    it('should generate a rule with default values', () => {
      const _factory = create('test-rule', 'Test rule description');
      const rule = _factory.generate();

      expect(rule.name).toBe('test-rule');
      expect(rule.comment).toBe('Test rule description');
      expect(rule.severity).toBe('error');
      expect(rule.from).toEqual({});
      expect(rule.to).toEqual({});
    });

    it('should generate a rule with custom severity', () => {
      const _factory = create('test-rule', 'Test description');
      const rule = _factory.generate({ severity: 'warn' });

      expect(rule.severity).toBe('warn');
    });

    it('should generate a rule with custom from configuration', () => {
      const _factory = create('test-rule', 'Test description');
      const rule = _factory.generate({ from: { orphan: true } });

      expect(rule.from).toMatchObject({ orphan: true });
    });

    it('should generate a rule with custom to configuration', () => {
      const _factory = create('test-rule', 'Test description');
      const rule = _factory.generate({ to: { circular: true } });

      expect(rule.to).toMatchObject({ circular: true });
    });

    it('should merge default and custom configurations', () => {
      const _factory = create('test-rule', 'Test description', {
        from: { path: 'default/**' },
        to: { dependencyTypes: ['core'] }
      });

      const rule = _factory.generate({
        from: { pathNot: 'custom/**' },
        to: { circular: true }
      });

      expect(rule.to).toMatchObject({
        circular: true,
        dependencyTypes: ['core']
      });
    });

    it('should handle empty generate parameter', () => {
      const _factory = create('test-rule', 'Test description');
      const rule = _factory.generate({});

      expect(rule.name).toBe('test-rule');
      expect(rule.severity).toBe('error');
    });

    it('should handle undefined generate parameter', () => {
      const _factory = create('test-rule', 'Test description');
      const rule = _factory.generate();

      expect(rule.name).toBe('test-rule');
      expect(rule.severity).toBe('error');
    });

    it('should normalize paths in from configuration', () => {
      const _factory = create('test-rule', 'Test description', {
        from: { path: 'default-path' }
      });

      const rule = _factory.generate({ from: { path: 'custom-path' } });

      expect(rule.from.path).toEqual(['default-path', 'custom-path']);
    });

    it('should normalize pathNot in from configuration', () => {
      const _factory = create('test-rule', 'Test description', {
        from: { pathNot: 'default-exclude' }
      });

      const rule = _factory.generate({ from: { pathNot: 'custom-exclude' } });

      expect(rule.from.pathNot).toEqual(['default-exclude', 'custom-exclude']);
    });

    it('should normalize paths in to configuration', () => {
      const _factory = create('test-rule', 'Test description', {
        to: { path: 'default-to-path' }
      });

      const rule = _factory.generate({ to: { path: 'custom-to-path' } });

      expect(rule.to.path).toEqual(['default-to-path', 'custom-to-path']);
    });

    it('should normalize pathNot in to configuration', () => {
      const _factory = create('test-rule', 'Test description', {
        to: { pathNot: 'default-to-exclude' }
      });

      const rule = _factory.generate({ to: { pathNot: 'custom-to-exclude' } });

      expect(rule.to.pathNot).toEqual([
        'default-to-exclude',
        'custom-to-exclude'
      ]);
    });

    it('should handle undefined paths in normalization', () => {
      const _factory = create('test-rule', 'Test description');
      const rule = _factory.generate({
        from: { path: 'only-custom' },
        to: { pathNot: 'only-custom-exclude' }
      });

      expect(rule.from.path).toEqual(['only-custom']);
      expect(rule.to.pathNot).toEqual(['only-custom-exclude']);
    });

    it('should preserve non-path properties in to configuration', () => {
      const _factory = create('test-rule', 'Test description', {
        to: { circular: true, dependencyTypes: ['core'] }
      });

      const rule = _factory.generate({ to: { couldNotResolve: true } });

      expect(rule.to).toMatchObject({
        circular: true,
        couldNotResolve: true,
        dependencyTypes: ['core']
      });
    });

    it('should override default to properties with custom ones', () => {
      const _factory = create('test-rule', 'Test description', {
        to: { dependencyTypes: ['core'] }
      });

      const rule = _factory.generate({ to: { dependencyTypes: ['npm-dev'] } });

      expect(rule.to.dependencyTypes).toEqual(['npm-dev']);
    });

    it('should work with different severity types', () => {
      const _factory = create('test-rule', 'Test description');

      const errorRule = _factory.generate({ severity: 'error' });
      const warnRule = _factory.generate({ severity: 'warn' });
      const infoRule = _factory.generate({ severity: 'info' });

      expect(errorRule.severity).toBe('error');
      expect(warnRule.severity).toBe('warn');
      expect(infoRule.severity).toBe('info');
    });

    it('should return the rule as const', () => {
      const _factory = create('test-rule', 'Test description');
      const rule = _factory.generate();

      // The function returns `as const`, ensuring immutability
      expect(typeof rule).toBe('object');
      expect(rule.name).toBe('test-rule');
    });
  });

  describe('type safety', () => {
    it('should preserve generic type parameter for rule name', () => {
      const _factory = create('specific-rule-name', 'Description');
      const rule = _factory.generate();

      expect(rule.name).toBe('specific-rule-name');
      expect(_factory.META.name).toBe('specific-rule-name');
    });

    it('should work with different rule names', () => {
      const factory1 = create('no-circular', 'Prevent circular deps');
      const factory2 = create('no-dev-deps', 'Prevent dev deps');

      expect(factory1.META.name).toBe('no-circular');
      expect(factory2.META.name).toBe('no-dev-deps');

      const rule1 = factory1.generate();
      const rule2 = factory2.generate();

      expect(rule1.name).toBe('no-circular');
      expect(rule2.name).toBe('no-dev-deps');
    });
  });
});
