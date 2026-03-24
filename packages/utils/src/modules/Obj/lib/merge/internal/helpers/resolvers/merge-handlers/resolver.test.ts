import type { ArrayMergeStrategy } from '../../../../types/arrays.ts';
import type { Context } from '../../../../types/context.ts';
import {
  getArrayMergeHandler,
  getKeyMergeHandler,
  getObjectTypeMergeHandler,
  getPrimitiveMergeHandler
} from './resolver.ts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Obj/merge/resolvers/merge-handlers', () => {
  const mockedCloneArray = vi.fn((arr) => [...arr]);
  const mockedCloneObjectType = vi.fn(
    (obj: { constructor: new (...args: any[]) => any }) => new obj.constructor(obj)
  );
  const mockedClonePlainObject = vi.fn((obj: Record<string, any>) => ({ ...obj }));
  const mockedMergeArray = vi.fn((_curr, next) => next);
  const mockedMergePrimitive = vi.fn((_curr, next) => next);
  const mockedMergeObjectType = vi.fn((_curr, next) => next);
  const mockedMergeKey = vi.fn((_key, _curr, next) => next);
  const mockedHasKeyHandler = vi.fn((_key): _key is string => true);
  const context: Context<any> = {
    depth: { curr: 0, max: 10 },
    cloneArray: mockedCloneArray,
    cloneObjectType: mockedCloneObjectType,
    clonePlainObject: mockedClonePlainObject,
    mergeArray: mockedMergeArray,
    mergePrimitive: mockedMergePrimitive,
    mergeObjectType: mockedMergeObjectType,
    nullBehavior: 'overwrite',
    overwriteWithEmptyArrays: true,
    overwriteWithEmptyObjects: false,
    hasKeyHandler: mockedHasKeyHandler as any,
    mergeKey: mockedMergeKey
  };
  const mockedMergeHandler = vi.fn((_curr, next, _ctx: Context<any>) => ({ ..._curr, ...next }));
  beforeEach(() => {
    vi.resetAllMocks();
  });
  describe('getArrayMergeHandler', () => {
    const getHandler = (strategy: ArrayMergeStrategy) =>
      getArrayMergeHandler(strategy, context.cloneArray, context, mockedMergeHandler);
    it('"function" strategy', () => {
      const customFn = vi.fn((curr: number[], next: number[]) => [...curr, ...next]);
      const handler = getHandler(customFn);
      const result = handler([1, 2, 3], [1, 2, 3]);
      expect(result).toEqual([1, 2, 3, 1, 2, 3]);
      expect(customFn).toHaveBeenCalledWith([1, 2, 3], [1, 2, 3]);
    });
    it('"concat" strategy', () => {
      const handler = getHandler('concat');
      const result = handler([1, 2, 3], [4, 5, 6]);
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
      expect(mockedCloneArray).toHaveBeenCalledWith([4, 5, 6]);
    });
    it('"prepend" strategy', () => {
      const handler = getHandler('prepend');
      const result = handler([1, 2, 3], [4, 5, 6]);
      expect(result).toEqual([4, 5, 6, 1, 2, 3]);
      expect(mockedCloneArray).toHaveBeenCalledWith([4, 5, 6]);
    });
    it('"unique" strategy', () => {
      const handler = getHandler('unique');
      const result = handler([1, 2, 3], [4, 5, 6]);
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
      expect(mockedCloneArray).toHaveBeenCalledWith([4, 5, 6]);
    });
    it('"replace" strategy', () => {
      const handler = getHandler('replace');
      const result = handler([1, 2, 3], [4, 5, 6]);
      expect(result).toEqual([4, 5, 6]);
      expect(mockedCloneArray).toHaveBeenCalledWith([4, 5, 6]);
    });
    it('"combine" strategy', () => {
      const handler = getHandler('combine');
      const result = handler([[null, null, null, null], { a: 1 }, 1, 2, 3], [[4, 5, 6], { b: 2 }]);
      expect(result).toEqual([[4, 5, 6, null], { a: 1, b: 2 }, 1, 2, 3]);
      expect(mockedCloneArray).toHaveBeenCalledWith([4, 5, 6]);
      expect(mockedMergeHandler).toHaveBeenCalled();
    });
  });
  describe('getPrimitiveMergeHandler', () => {
    it('"replace" strategy', () => {
      const handler = getPrimitiveMergeHandler('replace');
      const result = handler(1, 2);
      expect(result).toBe(2);
    });
    it('"custom-function" strategy', () => {
      const customFn = vi.fn((curr: number, next: number) => curr + next);
      const handler = getPrimitiveMergeHandler(customFn);
      const result = handler(1, 2);
      expect(result).toBe(3);
      expect(customFn).toHaveBeenCalledWith(1, 2);
    });
  });
  describe('getObjectTypeMergeHandler', () => {
    it('"replace" strategy', () => {
      const handler = getObjectTypeMergeHandler('replace', context.cloneObjectType);
      const obj = { a: 1 };
      const result = handler(obj, { b: 2 });
      expect(result).toEqual({ b: 2 });
      expect(mockedCloneObjectType).toHaveBeenCalledWith({ b: 2 });
    });
    it('"custom-function" strategy', () => {
      const customFn = { Set: vi.fn((curr: any, next: any) => new Set([...curr, ...next])) };
      const handler = getObjectTypeMergeHandler(customFn, context.cloneObjectType);
      const a = new Set([1, 2, 3]);
      const b = new Set([4, 5, 6]);
      const result = handler(a, b);
      expect(result).toEqual(new Set([1, 2, 3, 4, 5, 6]));
      expect(customFn.Set).toHaveBeenCalledWith(a, b);
    });
    it('"custom-function" strategy with non-matching type', () => {
      const customFn = { Map: vi.fn((curr: any, next: any) => new Map([...curr, ...next])) };
      const handler = getObjectTypeMergeHandler(customFn, context.cloneObjectType);
      const a = new Set([1, 2, 3]);
      const b = new Set([4, 5, 6]);
      const result = handler(a, b);
      expect(result).toEqual(new Set([4, 5, 6]));
      expect(mockedCloneObjectType).toHaveBeenCalledWith(b);
    });
  });
  describe('getKeyMergeHandler', () => {
    it('should return the correct handler for each type', () => {
      const mockReplace = vi.fn((b: any, _ctx: Context<any>) => b);
      const handler = getKeyMergeHandler<{ keyA: number; keyB: number; keyC: unknown }>(
        { keyA: (a: any, b: any) => a + b, keyB: (a: any, b: any) => a * b, keyC: 'replace' },
        context,
        mockReplace
      );
      const obj = { keyA: 2, keyB: 3, keyC: null };
      expect(handler('keyA', obj.keyA, 3)).toEqual(5);
      expect(handler('keyB', obj.keyB, 2)).toEqual(6);
      expect(handler('keyC', obj.keyC, { new: 'value' })).toEqual({ new: 'value' });
      expect(mockReplace).toHaveBeenCalled();
    });
  });
});
