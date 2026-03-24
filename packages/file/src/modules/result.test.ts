import { describe, expect, it } from 'vitest';
import { err, ok, tryCatch, tryCatchSync, OperationError } from './result.js';

describe('File result utilities', () => {
  it('should create a successful result with ok', () => {
    const result = ok({ message: 'Success' });
    expect(result).toEqual({ ok: true, detail: { message: 'Success' } });
  });
  it('should create an error result with err', () => {
    const error = new OperationError('Something went wrong');
    const result = err(error);
    expect(result).toEqual({ ok: false, error });
  });
  it('tryCatch should return success result when promise resolves', async () => {
    const successFn = () => Promise.resolve('Data loaded');
    const errorFn = (e: unknown) => new OperationError(String(e));
    const result = await tryCatch(successFn, errorFn);
    expect(result).toEqual({ ok: true, detail: 'Data loaded' });
  });
  it('tryCatch should return error result when promise rejects', async () => {
    const successFn = () => Promise.reject(new Error('Load failed'));
    const errorFn = (e: unknown) => new OperationError(String(e));
    const result = await tryCatch(successFn, errorFn);
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toBeInstanceOf(OperationError);
    expect(!result.ok && result.error.message).toBe('Error: Load failed');
  });
  it('tryCatchSync should return success result when function succeeds', () => {
    const successFn = () => 'Data loaded';
    const errorFn = (e: unknown) => new OperationError(String(e));
    const result = tryCatchSync(successFn, errorFn);
    expect(result).toEqual({ ok: true, detail: 'Data loaded' });
  });
  it('tryCatchSync should return error result when function throws', () => {
    const successFn = () => {
      throw new Error('Load failed');
    };
    const errorFn = (e: unknown) => new OperationError(String(e));
    const result = tryCatchSync(successFn, errorFn);
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toBeInstanceOf(OperationError);
    expect(!result.ok && result.error.message).toBe('Error: Load failed');
  });
});
