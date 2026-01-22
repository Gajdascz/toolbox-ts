import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  doTry,
  doTrySync,
  handleCatch,
  resolveError,
  resolveTypeName
} from './utils.ts';

let consoleErrorSpy;
beforeEach(() => {
  consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation((m, ...o: any[]) => ({ m, o }));
});
describe('Error Utils', () => {
  describe('resolveTypeName', () => {
    it('resolves type name for primitives', () => {
      expect(resolveTypeName(123)).toBe('number');
      expect(resolveTypeName('hello')).toBe('string');
      expect(resolveTypeName(true)).toBe('boolean');
      expect(resolveTypeName(undefined)).toBe('undefined');
      expect(resolveTypeName(null)).toBe('null');
      expect(resolveTypeName(Symbol('sym'))).toBe('symbol');
      expect(resolveTypeName(10n)).toBe('bigint');
    });

    it('resolves type name for objects and functions', () => {
      expect(resolveTypeName({})).toBe('Object');
      expect(resolveTypeName([])).toBe('Array');
      expect(resolveTypeName(() => {})).toBe('Function');
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
      expect(resolveError('error message')).toEqual({
        message: 'error message',
        type: 'string'
      });
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
      expect(resolveError(123)).toEqual({ message: '123', type: 'number' });

      expect(resolveError({ key: 'value' })).toEqual({
        message: '[object Object]',
        type: 'object'
      });

      expect(resolveError(null)).toEqual({ message: 'null', type: 'object' });
    });
  });

  describe('doTry', () => {
    it('returns the result on success', async () => {
      const result = await doTry(() => Promise.resolve('success'), 'throw');
      expect(result).toMatchObject({ ok: true, value: 'success' });
    });

    it('throws on error when onErr is "throw"', async () => {
      await expect(
        doTry(() => {
          throw new Error('test error');
        }, 'throw')
      ).rejects.toThrow('test error');
    });

    it('logs and returns undefined when onErr is "log"', async () => {
      const result = await doTry(() => {
        throw new Error('test error');
      }, 'log');

      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error caught', {
        message: 'test error',
        type: 'Error',
        cause: undefined,
        stack: expect.any(String)
      });

      consoleErrorSpy.mockRestore();
    });

    it('calls custom error handler', async () => {
      const result = await doTry(
        () => {
          throw new Error('test error');
        },
        (err) => {
          return `handled: ${err.message}`;
        }
      );

      expect(result).toBe('handled: test error');
    });

    it('calls custom error handler that returns synchronously', async () => {
      const result = await doTry(
        () => {
          throw new Error('test error');
        },
        (err) => {
          return `handled: ${err.message}`;
        }
      );

      expect(result).toBe('handled: test error');
    });
    it('returns Result type when onErr is "return"', async () => {
      const result = await doTry(() => {
        throw new Error('test error');
      }, 'return');

      expect(result).toEqual({
        ok: false,
        error: {
          message: 'test error',
          type: 'Error',
          stack: expect.any(String),
          cause: undefined
        }
      });
    });
  });

  describe('doTrySync', () => {
    it('returns the result on success', () => {
      const result = doTrySync(() => 'success', 'throw');
      expect(result).toMatchObject({ ok: true, value: 'success' });
    });

    it('throws on error when onErr is "throw"', () => {
      expect(() =>
        doTrySync(() => {
          throw new Error('test error');
        }, 'throw')
      ).toThrow('test error');
    });

    it('logs and returns undefined when onErr is "log"', () => {
      const result = doTrySync(() => {
        throw new Error('test error');
      }, 'log');

      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error caught', {
        message: 'test error',
        type: 'Error',
        cause: undefined,
        stack: expect.any(String)
      });

      consoleErrorSpy.mockRestore();
    });

    it('calls custom error handler', () => {
      const result = doTrySync(
        () => {
          throw new Error('test error');
        },
        (err) => {
          return `handled: ${err.message}`;
        }
      );

      expect(result).toBe('handled: test error');
    });
    it('returns Result type when onErr is "return"', () => {
      const result = doTrySync(() => {
        throw new Error('test error');
      }, 'return');

      expect(result).toEqual({
        ok: false,
        error: {
          message: 'test error',
          type: 'Error',
          stack: expect.any(String),
          cause: undefined
        }
      });
    });
  });

  describe('handleCatch', () => {
    it('logs error when onErr is "log"', () => {
      handleCatch(new Error('test error'), 'log');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error caught', {
        message: 'test error',
        type: 'Error',
        cause: undefined,
        stack: expect.any(String)
      });

      consoleErrorSpy.mockRestore();
    });

    it('throws error when onErr is "throw"', () => {
      expect(() => handleCatch(new Error('test error'), 'throw')).toThrow(
        'test error'
      );
    });

    it('preserves error type and stack when throwing', () => {
      const originalError = new TypeError('type error');
      originalError.cause = 'cause';
      let cause, message, name, stack;
      try {
        handleCatch(originalError, 'throw');
      } catch (error) {
        name = (error as Error).name;
        message = (error as Error).message;
        cause = (error as Error).cause;
        stack = (error as Error).stack;
      }
      expect(name).toBe('TypeError');
      expect(message).toBe('type error');
      expect(cause).toBe('cause');
      expect(stack).toBeDefined();
    });

    it('calls custom error handler', () => {
      const result = handleCatch(new Error('test error'), (err) => {
        return `custom: ${err.message}`;
      });

      expect(result).toBe('custom: test error');
    });

    it('handles string errors', () => {
      handleCatch('string error', 'log');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error caught', {
        message: 'string error',
        type: 'string',
        cause: undefined,
        stack: undefined
      });

      consoleErrorSpy.mockRestore();
    });
    it('throws provided error type when throwing', () => {
      class CustomError extends Error {
        message: string;
        constructor(message?: string) {
          super(message);
          this.name = 'CustomError';
        }
      }

      expect(() =>
        handleCatch(new Error('test error'), 'throw', CustomError)
      ).toThrow(CustomError);
    });
  });
});
