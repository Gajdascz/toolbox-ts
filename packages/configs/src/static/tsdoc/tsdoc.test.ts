import { describe, expect, it } from 'vitest';

import { define } from './tsdoc.ts';

describe('tsdoc', () => {
  describe('define', () => {
    it('should return defaults when called without arguments', () => {
      const result = define();
      expect(result.tagDefinitions).toHaveLength(4);
    });

    it('should include default tag definitions', () => {
      const result = define();

      expect(result.tagDefinitions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ tagName: '@important' }),
          expect.objectContaining({ tagName: '@module' }),
          expect.objectContaining({ tagName: '@default' }),
          expect.objectContaining({ tagName: '@template' })
        ])
      );
    });

    it('should merge custom rules with defaults', () => {
      const customRule = {
        tagName: '@custom',
        syntaxKind: 'inline' as const,
        allowMultiple: false
      };

      const result = define([customRule]);

      expect(result.tagDefinitions).toHaveLength(5);
      expect(result.tagDefinitions).toContainEqual(customRule);
    });

    it('should preserve rule properties', () => {
      const customRule = {
        tagName: '@example',
        syntaxKind: 'block' as const,
        allowMultiple: true
      };

      const result = define([customRule]);

      const found = result.tagDefinitions.find((r) => r.tagName === '@example');
      expect(found).toEqual(customRule);
    });

    it('should handle multiple custom rules', () => {
      const rules = [
        {
          tagName: '@rule1',
          syntaxKind: 'modifier' as const,
          allowMultiple: true
        },
        {
          tagName: '@rule2',
          syntaxKind: 'inline' as const,
          allowMultiple: false
        }
      ];

      const result = define(rules);

      expect(result.tagDefinitions).toHaveLength(6);
      expect(result.tagDefinitions).toContainEqual(rules[0]);
      expect(result.tagDefinitions).toContainEqual(rules[1]);
    });
  });
});
