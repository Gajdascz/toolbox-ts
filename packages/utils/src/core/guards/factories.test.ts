import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  createCheckGuard,
  createGenericIsGuards,
  createGuard,
  createIsGuards,
  createNames,
  createTypeNames
} from './factories.js';

type Test = `Test`;

describe('Guard Factory Functions', () => {
  describe('Names', () => {
    it('createNames capitalizes names correctly', () => {
      const names = createNames('Name');
      expect(names.is).toBe('isName');
      expect(names.check).toBe('checkIsName');
      expect(names.type).toBe('Name');
    });
    it('createTypeNames creates correct type names', () => {
      const { type, example, test, _ } = createTypeNames('Sample', ['type', 'example', 'test']);
      expect(type).toBe('SampleType');
      expect(_).toBe('Sample');
      expect(example).toBe('SampleExample');
      expect(test).toBe('SampleTest');
    });
  });
  describe('Factories', () => {
    it('createGuard creates guard with correct name and typeName', () => {
      const guard = createGuard(
        'isSample',
        'Sample',
        (v: unknown): v is string => typeof v === 'string'
      );
      expect(guard.name).toBe('isSample');
      expect(guard.typeName).toBe('Sample');
      expect(guard('test')).toBe(true);
      expect(guard(123)).toBe(false);
    });
    it('createCheckGuard creates check guard with correct name and typeName', () => {
      const checkGuard = createCheckGuard(
        'Sample',
        (v: unknown): v is string => typeof v === 'string'
      );
      expect(checkGuard.name).toBe('checkIsSample');
      expect(checkGuard.typeName).toBe('Sample');
      expect(checkGuard('test')).toBe(true);
      expect(checkGuard(123)).toBe(false);
      expectTypeOf(checkGuard).returns.toEqualTypeOf<boolean>();
    });
    describe('createIsGuards', () => {
      const { is, check } = createIsGuards<'Test', Test, [trim?: boolean]>(
        'Test',
        (v, trim = false): v is Test => {
          let r = '';
          if (typeof v === 'string') {
            r = v;
            if (trim) r = r.trim();
          }
          return r === 'Test';
        }
      );
      it('`is` narrows to exact type', () => {
        const value: unknown = 'Test';
        const result = is(value);
        expect(result).toBe(true);
        if (result) {
          expectTypeOf(value).toEqualTypeOf<Test>();
          expectTypeOf(value).not.toEqualTypeOf<string>();
        }
      });
      it('`is` does not narrow type when false', () => {
        const value: unknown = 'Test';
        const result = is(value);
        expect(result).toBe(true);
        if (!result) expectTypeOf(value).toEqualTypeOf<unknown>();
      });
      it('`check` does not narrow type', () => {
        const value: unknown = 'Test';
        const result = check(value);
        expect(result).toBe(true);
        expectTypeOf(value).toEqualTypeOf<unknown>();
      });
      it('properly handles provided parameters', () => {
        expect(is('Test')).toBe(true);
        expect(is('test')).toBe(false);
        expect(is('Test', true)).toBe(true);
        expect(is('TEST', true)).toBe(false);
        expect(is(' Test ', true)).toBe(true);
      });
      it(`capitalizes typeName correctly`, () => {
        const { is: isNumber } = createIsGuards('number', (_): _ is number => true);
        const { is: isEmail } = createIsGuards('emailAddress', (_): _ is string => true);
        expect(isNumber.typeName).toBe('Number');
        expect(isEmail.typeName).toBe('EmailAddress');
        expect(is.typeName).toBe('Test');
        expect(check.typeName).toBe('Test');
      });
    });
    describe('createGenericIsGuards', () => {
      const { is } = createGenericIsGuards(
        'Test',
        <T extends string>(v: unknown, trim = false): v is T => {
          let r = '';
          if (typeof v === 'string') {
            r = v;
            if (trim) r = r.trim();
          }
          return r === 'Test';
        }
      );
      it('`is` narrows to exact type', () => {
        const value: unknown = 'Test';
        const result = is<'Test'>(value);
        expect(result).toBe(true);
        if (result) {
          expectTypeOf(value).toEqualTypeOf<Test>();
          expectTypeOf(value).not.toEqualTypeOf<string>();
        }
      });
      it('`is` does not narrow type when false', () => {
        const value: unknown = 'Test';
        const result = is<'Test'>(value);
        expect(result).toBe(true);
        if (!result) expectTypeOf(value).toEqualTypeOf<unknown>();
      });
      it('properly handles provided parameters', () => {
        expect(is<'Test'>('Test')).toBe(true);
        expect(is<'Test'>('test')).toBe(false);
        expect(is<'Test'>('Test', true)).toBe(true);
        expect(is<'Test'>('TEST', true)).toBe(false);
        expect(is<'Test'>(' Test ', true)).toBe(true);
      });
    });
  });
});
