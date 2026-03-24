import { describe, expect, it, vi } from 'vitest';

import { createForbiddenRule } from './forbidden-rule-factory.js';

vi.mock('../../utils/utils.js', () => ({
  normalizePaths: vi.fn((input) => {
    if (!input || (Array.isArray(input) && input.every((item) => !item))) {
      return undefined;
    }
    return Array.isArray(input) ? input.filter(Boolean) : [input].filter(Boolean);
  })
}));

describe('forbiddenRuleFactory', () => {
  describe('generate method', () => {
    it('should generate a rule with default values', () => {
      const _factory = createForbiddenRule('test-rule', 'Test rule description');
      const rule = _factory.generate();
      expect(rule.name).toBe('test-rule');
      expect(rule.comment).toBe('Test rule description');
      expect(rule.severity).toBe('error');
      expect(rule.from).toEqual({});
      expect(rule.to).toEqual({});
    });
    it('should generate a rule with custom configuration', () => {
      const _factory = createForbiddenRule('test-rule', 'Test description');
      const rule = _factory.generate({
        from: { orphan: true },
        to: { dependencyTypes: ['core'] },
        severity: 'warn'
      });
      expect(rule.from).toMatchObject({ orphan: true });
      expect(rule.to).toMatchObject({ dependencyTypes: ['core'] });
      expect(rule.severity).toBe('warn');
    });
    it('should merge default and custom configurations', () => {
      const _factory = createForbiddenRule('test-rule', 'Test description', {
        from: { path: 'default/**' },
        to: { dependencyTypes: ['core'] }
      });
      const rule = _factory.generate({ from: { pathNot: 'custom/**' }, to: { circular: true } });
      expect(rule.to).toMatchObject({ circular: true, dependencyTypes: ['core'] });
    });
    it('should normalize paths', () => {
      const _factory = createForbiddenRule('test-rule', 'Test description', {
        from: { path: ['default-path', 'path-1'], pathNot: 'not-path' },
        to: { path: 'to-path', pathNot: ['not-to-path1', 'not-to-path2'] }
      });
      const rule = _factory.generate({ from: { path: 'custom-path' } });
      expect(rule.from.path).toEqual(['default-path', 'path-1', 'custom-path']);
      expect(rule.from.pathNot).toEqual(['not-path']);
      expect(rule.to.path).toEqual(['to-path']);
      expect(rule.to.pathNot).toEqual(['not-to-path1', 'not-to-path2']);
    });
  });
});
