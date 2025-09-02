import { describe, expect, it } from 'vitest';

import { isTypeOf } from './Prim.ts';

describe('primitive', () => {
  describe('isTypeOf.type', () => {
    it('should validate primitive type strings', () => {
      expect(isTypeOf.type('string')).toBe(true);
      expect(isTypeOf.type('number')).toBe(true);
      expect(isTypeOf.type('undefined')).toBe(false);
      expect(isTypeOf.type('undefined', { allowUndefined: true })).toBe(true);
      expect(isTypeOf.type('null')).toBe(false);
      expect(isTypeOf.type('null', { allowNull: true })).toBe(true);
      expect(isTypeOf.type('object')).toBe(false);
      expect(isTypeOf.type(123)).toBe(false);
    });
  });

  describe('type checkers', () => {
    it('should correctly identify types', () => {
      // Test positive cases
      expect(isTypeOf.string('test')).toBe(true);
      expect(isTypeOf.number(123)).toBe(true);
      expect(isTypeOf.boolean(false)).toBe(true);
      expect(
        isTypeOf.function(() => {
          return;
        })
      ).toBe(true);
      expect(isTypeOf.symbol(Symbol())).toBe(true);
      expect(isTypeOf.bigint(BigInt(1))).toBe(true);
      expect(isTypeOf.undefined(undefined)).toBe(true);
      expect(isTypeOf.null(null)).toBe(true);

      // Test negative cases
      expect(isTypeOf.string(123)).toBe(false);
      expect(isTypeOf.number('123')).toBe(false);
      expect(isTypeOf.boolean(0)).toBe(false);
      expect(isTypeOf.function({})).toBe(false);
      expect(isTypeOf.symbol('symbol')).toBe(false);
      expect(isTypeOf.bigint(123)).toBe(false);
      expect(isTypeOf.undefined(null)).toBe(false);
      expect(isTypeOf.null(undefined)).toBe(false);
    });
  });
});
