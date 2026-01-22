import { describe, expect, expectTypeOf, it } from 'vitest';

import { createIsGuards } from './factories.js';

type Test = `Test`;

describe('Guard Factory Functions', () => {
  describe('createIsGuards', () => {
    const { checkIsTest, isTest } = createIsGuards<
      'Test',
      Test,
      [trim?: boolean]
    >('Test', (v, trim = false): v is Test => {
      let r = '';
      if (typeof v === 'string') {
        r = v;
        if (trim) r = r.trim();
      }
      return r === 'Test';
    });
    it('`is` narrows to exact type', () => {
      const value: unknown = 'Test';
      const result = isTest(value);
      expect(result).toBe(true);
      if (result) {
        expectTypeOf(value).toEqualTypeOf<Test>();
        expectTypeOf(value).not.toEqualTypeOf<string>();
      }
    });
    it('`is` does not narrow type when false', () => {
      const value: unknown = 'Test';
      const result = isTest(value);
      expect(result).toBe(true);
      if (!result) expectTypeOf(value).toEqualTypeOf<unknown>();
    });
    it('`check` does not narrow type', () => {
      const value: unknown = 'Test';
      const result = checkIsTest(value);
      expect(result).toBe(true);
      expectTypeOf(value).toEqualTypeOf<unknown>();
    });
    it('properly handles provided parameters', () => {
      expect(isTest('Test')).toBe(true);
      expect(isTest('test')).toBe(false);
      expect(isTest('Test', true)).toBe(true);
      expect(isTest('TEST', true)).toBe(false);
      expect(isTest(' Test ', true)).toBe(true);
    });
    it(`capitalizes typeName correctly`, () => {
      const { isNumber, checkIsNumber } = createIsGuards(
        'number',
        (v): v is number => true
      );
      const { isEmailAddress, checkIsEmailAddress } = createIsGuards(
        'emailAddress',
        (v): v is string => true
      );
      expect(isNumber.typeName).toBe('Number');
      expect(isEmailAddress.typeName).toBe('EmailAddress');
      expect(isTest.typeName).toBe('Test');
      expect(checkIsTest.typeName).toBe('Test');
    });
  });
});
