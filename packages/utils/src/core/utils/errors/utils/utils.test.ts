import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import { resolveError, resolveTypeName, normalizeError } from './utils.ts';

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation((m, ...o: any[]) => ({ m, o }));
});
describe('Error Utils', () => {
  describe('resolveTypeName', () => {
    it('resolves type name for primitives', () => {
      expect(resolveTypeName(123)).toBe('Number');
      expect(resolveTypeName('hello')).toBe('String');
      expect(resolveTypeName(true)).toBe('Boolean');
      expect(resolveTypeName(undefined)).toBe('Undefined');
      expect(resolveTypeName(null)).toBe('Null');
      expect(resolveTypeName(Symbol('sym'))).toBe('Symbol');
      expect(resolveTypeName(10n)).toBe('BigInt');
    });

    it('resolves type name for objects and functions', () => {
      expect(resolveTypeName({})).toBe('Object');
      expect(resolveTypeName([])).toBe('Array');
      expect(resolveTypeName(() => {})).toBe('Function(anonymous)');
      expect(resolveTypeName(new Date())).toBe('Date');
      // eslint-disable-next-line @typescript-eslint/no-extraneous-class
      class CustomClass {}
      expect(resolveTypeName(new CustomClass())).toBe('CustomClass');
    });
    it('resolves type name for objects with typeName property', () => {
      const objWithTypeName = { typeName: 'CustomType' };
      expect(resolveTypeName(objWithTypeName)).toBe('CustomType');
    });
    it('falls back to "Object" for objects without constructor name', () => {
      const obj = Object.create(null);
      expect(resolveTypeName(obj)).toBe('Object');
    });
  });
  describe('resolveError', () => {
    it('resolves string errors', () => {
      expect(resolveError('error message')).toEqual({ message: 'error message', type: 'string' });
    });

    it('resolves Error instances', () => {
      const error = new Error('test error');
      error.cause = 'root cause';
      const resolved = resolveError(error);

      expect(resolved.message).toBe('test error');
      expect(resolved.type).toBe('Error');
      expect(resolved.cause).toBe('root cause');
      expect(resolved.stack).toBeDefined();
    });

    it('resolves non-string, non-Error values', () => {
      expect(resolveError(123)).toEqual({ message: '123', type: 'Number' });

      expect(resolveError({ key: 'value' })).toMatchObject({
        message: expect.stringContaining('"key":"value"'),
        type: 'Object',
        cause: undefined,
        stack: undefined
      });

      expect(resolveError(null)).toEqual({ message: 'null', type: 'Null' });
    });
  });
  describe('normalizeError', () => {
    it('returns the error if it is already an instance of the specified type', () => {
      const error = new TypeError('Example error');
      expect(normalizeError(error)).toBe(error);
    });

    it('normalizes non-error values to the specified error type', () => {
      const normalized = normalizeError('Not an error');
      expect(normalized).toBeInstanceOf(Error);
      expect(normalized.message).toBe('Not an error');
      expectTypeOf(normalized).toEqualTypeOf<Error>();
    });
    it('preserves stack and cause when normalizing', () => {
      const originalError = new Error('Original error');
      originalError.stack = 'Custom stack trace';
      originalError.cause = 'Root cause';

      const normalized = normalizeError(originalError);
      expect(normalized).toBeInstanceOf(Error);
      expect(normalized.message).toBe('Original error');
      expect(normalized.stack).toBe('Custom stack trace');
      expect(normalized.cause).toBe('Root cause');
    });
    it('skips stack and cause if not present in the original error', () => {
      const normalized = normalizeError(5);
      expect(normalized).toBeInstanceOf(Error);
      expect(normalized.message).toBe('5');
      expect(normalized.stack).toBeUndefined();
      expect(normalized.cause).toBeUndefined();
    });
    it('retains a stack and cause in a custom error object', () => {
      resolveError({ message: 'Custom error', stack: 'Custom stack' });
      const normalized = normalizeError({
        message: 'Custom error',
        stack: 'Custom stack',
        cause: 'Custom cause'
      });
      expect(normalized).toBeInstanceOf(Error);
      expect(normalized.message).toBe('Custom error');
      expect(normalized.stack).toBe('Custom stack');
      expect(normalized.cause).toBe('Custom cause');
    });
  });
});
