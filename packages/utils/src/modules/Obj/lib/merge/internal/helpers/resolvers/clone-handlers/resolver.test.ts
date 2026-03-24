import { getArrayCloneHandler, getCloneHandler, getObjectTypeCloneHandler } from './resolver.ts';
import { describe, expect, it, vi } from 'vitest';

describe('Obj/merge/resolvers/clone-handlers', () => {
  describe('getCloneHandler', () => {
    it('"none" should return a function that returns the same value', () => {
      const handler = getCloneHandler('none');
      const value = { a: 1 };
      expect(handler(value)).toBe(value);
    });
    it('"shallow" should return a function that returns a new object with the same properties', () => {
      const handler = getCloneHandler('shallow');
      const value = { a: 1 };
      const result = handler(value);
      expect(result).toEqual(value);
      expect(result).not.toBe(value);
    });
    it('"structured" should return a function that returns a deeply cloned object', () => {
      const handler = getCloneHandler('structured');
      const value = { a: 1 };
      const result = handler(value);
      expect(result).toEqual(value);
      expect(result).not.toBe(value);
    });
    it('"function" should use the provided function to clone the object', () => {
      const cloneFn = vi.fn((obj) => ({ ...obj }));
      const handler = getCloneHandler(cloneFn);
      const value = { a: 1 };
      const result = handler(value);
      expect(result).toEqual(value);
      expect(result).not.toBe(value);
      expect(cloneFn).toHaveBeenCalledWith(value);
    });
    it('"deep" should return a function that returns a deeply cloned object', () => {
      const handler = getCloneHandler('deep');
      const value = { a: 1 };
      const result = handler(value);
      expect(result).toEqual(value);
      expect(result).not.toBe(value);
    });
  });
  describe('getObjectTypeCloneHandler', () => {
    const defaultCloneHandler = (value: { constructor: new (...args: any[]) => any }) =>
      new value.constructor(value);
    it('"none" should return a function that returns the same value', () => {
      const handler = getObjectTypeCloneHandler('none', defaultCloneHandler);
      const value = new Map();
      expect(handler(value)).toBe(value);
    });
    it('"shallow" should return a function that returns a new object with the same properties', () => {
      const handler = getObjectTypeCloneHandler('shallow', defaultCloneHandler);
      const value = new Date();
      const result = handler(value);
      expect(result).toEqual(value);
      expect(result).not.toBe(value);
    });
    it('"structured" should return a function that returns a deeply cloned object', () => {
      const handler = getObjectTypeCloneHandler('structured', defaultCloneHandler);
      const value = new Set([1, 2, 3]);
      const result = handler(value);
      expect(result).toEqual(value);
      expect(result).not.toBe(value);
    });
    it('"deep" should return a function that returns a deeply cloned object', () => {
      const handler = getObjectTypeCloneHandler('deep', defaultCloneHandler);
      const value = new Map([['a', 1]]);
      const result = handler(value);
      expect(result).toEqual(value);
      expect(result).not.toBe(value);
    });
    describe('"object-constructor-name-map"({ Set: () => Set, ...etc })', () => {
      it('should return a function that uses the map to clone the object', () => {
        const handlers = { Set: vi.fn((value: Set<any>) => new Set(value)) };
        const handler = getObjectTypeCloneHandler(handlers, defaultCloneHandler);

        const value = new Set([1, 2, 3]);
        const result = handler(value);
        expect(result).toEqual(value);
        expect(result).not.toBe(value);
        expect(handlers.Set).toHaveBeenCalledWith(value);
      });
      it('should return the default handler for unknown types', () => {
        const handlers = { Set: vi.fn((value: Set<any>) => new Set(value)) };
        const handler = getObjectTypeCloneHandler(handlers, defaultCloneHandler);

        const value = new Map([['a', 1]]);
        const result = handler(value);
        expect(result).toEqual(value);
        expect(result).not.toBe(value);
      });
    });
  });
  describe('getArrayCloneHandler', () => {
    it('"none" should return a function that returns the same array', () => {
      const handler = getArrayCloneHandler('none');
      const array = [1, 2, 3];
      expect(handler(array)).toBe(array);
    });
    it('"shallow" should return a function that returns a new array with the same elements', () => {
      const handler = getArrayCloneHandler('shallow');
      const array = [1, 2, 3];
      const result = handler(array);
      expect(result).toEqual(array);
      expect(result).not.toBe(array);
    });
    it('"structured" should return a function that returns a deeply cloned array', () => {
      vi.stubGlobal(
        'structuredClone',
        vi.fn((obj) => JSON.parse(JSON.stringify(obj)))
      );
      const stubbedStructuredClone = vi.mocked(structuredClone);
      const handler = getArrayCloneHandler('structured');
      const array = [1, 2, 3];
      const result = handler(array);
      expect(result).toEqual(array);
      expect(result).not.toBe(array);
      expect(stubbedStructuredClone).toHaveBeenCalledWith(array);
      vi.unstubAllGlobals();
    });
    it('"function" should use the provided function to clone the array', () => {
      const cloneFn = vi.fn((arr) => [...arr]);
      const handler = getArrayCloneHandler(cloneFn);
      const array = [1, 2, 3];
      const result = handler(array);
      expect(result).toEqual(array);
      expect(result).not.toBe(array);
      expect(cloneFn).toHaveBeenCalledWith(array);
    });
  });
});
