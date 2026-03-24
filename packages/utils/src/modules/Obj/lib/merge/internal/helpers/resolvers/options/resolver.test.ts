import { resolveOptions } from './resolver.ts';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../clone-handlers/index.js', () => ({
  getArrayCloneHandler: vi.fn((s) => `cloneArray:${s}`),
  getCloneHandler: vi.fn((s) => `clonePlainObject:${s}`),
  getObjectTypeCloneHandler: vi.fn((s, fallback) => `cloneObjectType:${s}:${fallback}`)
}));

vi.mock('../merge-handlers/index.js', () => ({
  getArrayMergeHandler: vi.fn(() => 'mergeArray'),
  getKeyMergeHandler: vi.fn(() => 'mergeKey'),
  getObjectTypeMergeHandler: vi.fn((s, _h) => `mergeObjectType:${s}`),
  getPrimitiveMergeHandler: vi.fn((s) => `mergePrimitive:${s}`)
}));

vi.mock('../../../../../clone/clone.js', () => ({
  clone: vi.fn((value, _opts) => ({ cloned: value }))
}));

import {
  getArrayCloneHandler,
  getCloneHandler,
  getObjectTypeCloneHandler
} from '../clone-handlers/index.js';
import {
  getArrayMergeHandler,
  getKeyMergeHandler,
  getObjectTypeMergeHandler,
  getPrimitiveMergeHandler
} from '../merge-handlers/index.js';
import { clone } from '../../../../../clone/clone.js';

const mockClone = vi.mocked(clone);
const mockGetArrayCloneHandler = vi.mocked(getArrayCloneHandler);
const mockGetCloneHandler = vi.mocked(getCloneHandler);
const mockGetObjectTypeCloneHandler = vi.mocked(getObjectTypeCloneHandler);
const mockGetArrayMergeHandler = vi.mocked(getArrayMergeHandler);
const mockGetKeyMergeHandler = vi.mocked(getKeyMergeHandler);
const mockGetObjectTypeMergeHandler = vi.mocked(getObjectTypeMergeHandler);
const mockGetPrimitiveMergeHandler = vi.mocked(getPrimitiveMergeHandler);

const _merge = vi.fn();
const _replace = vi.fn();

beforeEach(() => vi.clearAllMocks());

const resolve = (opts = {}) => resolveOptions(opts, _merge, _replace);

describe('Obj/merge/resolvers/options', () => {
  it('returns a context with defaults when called with no options', () => {
    const ctx = resolve();
    expect(ctx).toBeDefined();
    expect(ctx.depth.curr).toBe(0);
    expect(ctx.depth.max).toBe(Infinity);
    expect(mockGetArrayCloneHandler).toHaveBeenCalledWith('shallow');
    expect(mockGetCloneHandler).toHaveBeenCalledWith('shallow');
    expect(mockGetObjectTypeCloneHandler).toHaveBeenCalledWith('shallow', 'shallow');
    expect(mockGetArrayMergeHandler).toHaveBeenCalledWith(
      'replace',
      expect.anything(),
      expect.anything(),
      _merge
    );
    expect(mockGetObjectTypeMergeHandler).toHaveBeenCalledWith('replace', expect.anything());
    expect(mockGetPrimitiveMergeHandler).toHaveBeenCalledWith('replace');
    expect(ctx.nullBehavior).toBe('overwrite');
    expect(ctx.overwriteWithEmptyObjects).toBe(false);
    expect(ctx.overwriteWithEmptyArrays).toBe(false);
    expect(ctx.mergeArray).toBeDefined();
    expect(ctx.cloneBase).toBeDefined();
  });
  describe('clone', () => {
    describe('set to true', () => {
      it('cloneBase uses deep strategy via clone()', () => {
        const ctx = resolve({ clone: true });
        const obj = { a: 1 };
        ctx.cloneBase(obj);
        expect(mockClone).toHaveBeenCalledWith(obj, { strategy: 'deep' });
        expect(mockGetArrayCloneHandler).toHaveBeenCalledWith('shallow');
        expect(mockGetCloneHandler).toHaveBeenCalledWith('shallow');
        expect(mockGetObjectTypeCloneHandler).toHaveBeenCalledWith('shallow', 'shallow');
      });
    });
    describe('set to false', () => {
      it('cloneBase returns value as-is', () => {
        const ctx = resolve({ clone: false });
        const obj = { a: 1 };
        expect(ctx.cloneBase(obj)).toBe(obj);
        expect(mockClone).not.toHaveBeenCalled();
        expect(mockGetArrayCloneHandler).toHaveBeenCalledWith('none');
        expect(mockGetCloneHandler).toHaveBeenCalledWith('none');
        expect(mockGetObjectTypeCloneHandler).toHaveBeenCalledWith('none', 'shallow');
      });
    });
    describe('set to "none"', () => {
      it('cloneBase returns value as-is', () => {
        const ctx = resolve({ clone: 'none' });
        const obj = { x: 2 };
        expect(ctx.cloneBase(obj)).toBe(obj);
        expect(mockClone).not.toHaveBeenCalled();
        expect(mockGetArrayCloneHandler).toHaveBeenCalledWith('none');
        expect(mockGetCloneHandler).toHaveBeenCalledWith('none');
        expect(mockGetObjectTypeCloneHandler).toHaveBeenCalledWith('none', 'shallow');
      });
    });
    describe('set to "structured"', () => {
      it('cloneBase uses structured strategy via clone()', () => {
        const ctx = resolve({ clone: 'structured' });
        const obj = { a: 1 };
        ctx.cloneBase(obj);
        expect(mockClone).toHaveBeenCalledWith(obj, { strategy: 'structured' });
        expect(mockGetArrayCloneHandler).toHaveBeenCalledWith('structured');
        expect(mockGetCloneHandler).toHaveBeenCalledWith('structured');
        expect(mockGetObjectTypeCloneHandler).toHaveBeenCalledWith('structured', 'shallow');
      });
    });
    describe('set to "deep"', () => {
      it('cloneBase uses deep strategy via clone()', () => {
        const ctx = resolve({ clone: 'deep' });
        const obj = { a: 1 };
        ctx.cloneBase(obj);
        expect(mockClone).toHaveBeenCalledWith(obj, { strategy: 'deep' });
      });
      it('uses structured for array, deep for objectType and plainObject', () => {
        resolve({ clone: 'deep' });
        expect(mockGetArrayCloneHandler).toHaveBeenCalledWith('structured');
        expect(mockGetCloneHandler).toHaveBeenCalledWith('deep');
        expect(mockGetObjectTypeCloneHandler).toHaveBeenCalledWith('deep', 'shallow');
      });
    });
    it('uses custom object settings', () => {
      resolve({
        clone: { base: 'none', array: 'structured', objectType: 'deep', plainObject: 'structured' }
      });
      expect(mockGetCloneHandler).not.toHaveBeenCalledWith('none');
      expect(mockGetArrayCloneHandler).toHaveBeenCalledWith('structured');
      expect(mockGetCloneHandler).toHaveBeenCalledWith('structured');
      expect(mockGetObjectTypeCloneHandler).toHaveBeenCalledWith('deep', 'shallow');
    });
    it('sets cloneBase to custom function when provided', () => {
      const customCloneBase = vi.fn((value) => ({ customCloned: value }));
      const ctx = resolve({ clone: { base: customCloneBase } });
      const obj = { a: 1 };
      expect(ctx.cloneBase).toBe(customCloneBase);
      expect(ctx.cloneBase(obj)).toEqual({ customCloned: obj });
    });
  });
  describe('on handlers', () => {
    it('array', () => {
      resolve({ on: { array: 'merge' } });
      expect(mockGetArrayMergeHandler).toHaveBeenCalledWith(
        'merge',
        expect.anything(),
        expect.anything(),
        _merge
      );
    });
    it('objectType', () => {
      resolve({ on: { objectType: 'merge' } });
      expect(mockGetObjectTypeMergeHandler).toHaveBeenCalledWith('merge', expect.anything());
    });
    it('primitive', () => {
      resolve({ on: { primitive: 'skip' } });
      expect(mockGetPrimitiveMergeHandler).toHaveBeenCalledWith('skip');
    });
    it('null', () => {
      const ctx = resolve({ on: { null: 'skip' } });
      expect(ctx.nullBehavior).toBe('skip');
    });
    it('onKey', () => {
      const onKey = { someKey: vi.fn() };
      resolve({ on: { key: onKey } });
      expect(mockGetKeyMergeHandler).toHaveBeenCalledWith(
        onKey,
        expect.objectContaining({ clonePlainObject: expect.anything() }),
        _replace
      );
    });
    describe('emptyObject', () => {
      it('sets overwriteWithEmptyObjects true when overwrite', () => {
        const ctx = resolve({ on: { emptyObject: 'overwrite' } });
        expect(ctx.overwriteWithEmptyObjects).toBe(true);
      });
      it('sets overwriteWithEmptyObjects false when skip', () => {
        const ctx = resolve({ on: { emptyObject: 'skip' } });
        expect(ctx.overwriteWithEmptyObjects).toBe(false);
      });
    });
    describe('emptyArray', () => {
      it('sets overwriteWithEmptyArrays true when overwrite', () => {
        const ctx = resolve({ on: { emptyArray: 'overwrite' } });
        expect(ctx.overwriteWithEmptyArrays).toBe(true);
      });
      it('sets overwriteWithEmptyArrays false when skip', () => {
        const ctx = resolve({ on: { emptyArray: 'skip' } });
        expect(ctx.overwriteWithEmptyArrays).toBe(false);
      });
    });
  });
  describe('hasKeyHandler', () => {
    it('returns true for keys present in onKey', () => {
      const ctx = resolve({ on: { key: { myKey: vi.fn() } } });
      expect(ctx.hasKeyHandler('myKey')).toBe(true);
    });

    it('returns false for keys not in onKey', () => {
      const ctx = resolve({ on: { key: { myKey: vi.fn() } } });
      expect(ctx.hasKeyHandler('otherKey')).toBe(false);
    });

    it('returns false for all keys when onKey is empty', () => {
      const ctx = resolve();
      expect(ctx.hasKeyHandler('anything')).toBe(false);
    });
  });
  describe('maxDepth', () => {
    it('sets depth.max from options', () => {
      const ctx = resolve({ maxDepth: 5 });
      expect(ctx.depth.max).toBe(5);
    });

    it('uses Infinity when maxDepth not provided', () => {
      const ctx = resolve({});
      expect(ctx.depth.max).toBe(Infinity);
    });
  });
  describe('_replace forwarding', () => {
    it('passes _replace to getKeyMergeHandler', () => {
      resolve();
      expect(mockGetKeyMergeHandler).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        _replace
      );
    });
  });
  describe('_merge forwarding', () => {
    it('passes _merge to getArrayMergeHandler', () => {
      resolve();
      expect(mockGetArrayMergeHandler).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        _merge
      );
    });
  });
});
