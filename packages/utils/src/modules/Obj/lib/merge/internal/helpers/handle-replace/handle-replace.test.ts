import { handleReplace } from './handle-replace.ts';
import { expect, describe, it, vi } from 'vitest';

const mockedCloneArray = vi.fn((arr) => [...arr]);
const mockedCloneObjectType = vi.fn((obj) => new obj.constructor(obj));
const mockedClonePlainObject = vi.fn((obj) => ({ ...obj }));
const ctx = {
  cloneArray: mockedCloneArray,
  cloneObjectType: mockedCloneObjectType,
  clonePlainObject: mockedClonePlainObject
};
describe('Obj/merge/handleReplace', () => {
  it('should return value when not any kind of object', () => {
    const result = handleReplace(42, ctx);
    expect(result).toBe(42);
  });
  describe('array', () => {
    it('should return a new empty array when value is empty', () => {
      const value: any[] = [];
      const result = handleReplace(value, ctx);
      expect(result).toEqual([]);
      expect(result).not.toBe(value);
      expect(ctx.cloneArray).not.toHaveBeenCalled();
    });
    it('should return a cloned array when value is not empty', () => {
      const value: any[] = [1, 2, 3];
      const result = handleReplace(value, ctx);
      expect(result).toEqual(value);
      expect(result).not.toBe(value);
      expect(ctx.cloneArray).toHaveBeenCalledWith(value);
    });
  });
  it('should return a cloned object when value is a non-plain object', () => {
    const value = new Date();
    const result = handleReplace(value, ctx);
    expect(result).toEqual(value);
    expect(result).not.toBe(value);
    expect(ctx.cloneObjectType).toHaveBeenCalledWith(value);
  });
  describe('plain object', () => {
    it('should return a new empty object when value is empty', () => {
      const value = {};
      const result = handleReplace(value, ctx);
      expect(result).toEqual({});
      expect(result).not.toBe(value);
      expect(ctx.clonePlainObject).not.toHaveBeenCalled();
    });
    it('should return a cloned object when value is a non-plain object', () => {
      const value = { a: 1 };
      const result = handleReplace(value, ctx);
      expect(result).toEqual(value);
      expect(result).not.toBe(value);
      expect(ctx.clonePlainObject).toHaveBeenCalledWith(value);
    });
  });
});
