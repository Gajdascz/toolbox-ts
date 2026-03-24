import { describe, expectTypeOf, it } from 'vitest';

import type * as Key from './key.ts';

describe('Key types', () => {
  //#region> OfType
  describe('OfType<T, K>', () => {
    it('should extract key of type string', () => {
      interface T {
        0: boolean;
        id: number;
        name: string;
      }
      type Result = Key.OfType<T, string>;

      expectTypeOf<Result>().toEqualTypeOf<'id' | 'name'>();
    });

    it('should extract key of type number', () => {
      interface T {
        0: boolean;
        id: number;
        name: string;
      }
      type Result = Key.OfType<T, number>;

      expectTypeOf<Result>().toEqualTypeOf<0>();
    });

    it('should extract key of type symbol', () => {
      const sym = Symbol('test');
      interface T {
        id: number;
        [sym]: string;
      }
      type Result = Key.OfType<T, symbol>;
      expectTypeOf<Result>().toEqualTypeOf<typeof sym>();
    });
  });
  //#endregion
  //#region> Optional
  describe('Optional<T>', () => {
    it('should extract optional key from object type', () => {
      interface User {
        email?: string;
        id: number;
        name?: string;
      }
      type Result = Key.Optional<User>;

      expectTypeOf<Result>().toEqualTypeOf<'email' | 'name'>();
    });

    it('should return never when no optional key exist', () => {
      interface AllRequired {
        id: number;
        name: string;
      }
      type Result = Key.Optional<AllRequired>;

      expectTypeOf<Result>().toEqualTypeOf<never>();
    });

    it('should handle objects with only optional key', () => {
      interface AllOptional {
        age?: number;
        email?: string;
        name?: string;
      }
      type Result = Key.Optional<AllOptional>;

      expectTypeOf<Result>().toEqualTypeOf<'age' | 'email' | 'name'>();
    });

    it('should handle complex nested objects (shallow check)', () => {
      interface User {
        address: { city?: string; zip: number };
        id: number;
        name?: string;
      }
      type Result = Key.Optional<User>;

      // Only checks shallow level
      expectTypeOf<Result>().toEqualTypeOf<'name'>();
    });

    it('should handle empty object', () => {
      type Result = Key.Optional<{}>;

      expectTypeOf<Result>().toEqualTypeOf<never>();
    });

    it('should handle object with undefined in union', () => {
      interface Mixed {
        id: number;
        name: string | undefined;
      }
      type Result = Key.Optional<Mixed>;

      // name is still required even though it can be undefined
      expectTypeOf<Result>().toEqualTypeOf<never>();
    });

    it('should handle optional and required key mixed', () => {
      interface Product {
        description?: string;
        discount?: number;
        id: number;
        name: string;
        price: number;
      }
      type Result = Key.Optional<Product>;

      expectTypeOf<Result>().toEqualTypeOf<'description' | 'discount'>();
    });
  });
  //#endregion

  //#region> Required
  describe('Required<T>', () => {
    it('should extract required key from object type', () => {
      interface User {
        email?: string;
        id: number;
        name: string;
      }
      type Result = Key.Required<User>;

      expectTypeOf<Result>().toEqualTypeOf<'id' | 'name'>();
    });

    it('should return all key when no optional key exist', () => {
      interface AllRequired {
        email: string;
        id: number;
        name: string;
      }
      type Result = Key.Required<AllRequired>;

      expectTypeOf<Result>().toEqualTypeOf<'email' | 'id' | 'name'>();
    });

    it('should return never when all key are optional', () => {
      interface AllOptional {
        age?: number;
        name?: string;
      }
      type Result = Key.Required<AllOptional>;

      expectTypeOf<Result>().toEqualTypeOf<never>();
    });

    it('should handle complex nested objects (shallow check)', () => {
      interface User {
        address: { city?: string; zip: number };
        id: number;
        name?: string;
      }
      type Result = Key.Required<User>;

      // Only checks shallow level
      expectTypeOf<Result>().toEqualTypeOf<'address' | 'id'>();
    });

    it('should handle empty object', () => {
      type Result = Key.Required<{}>;

      expectTypeOf<Result>().toEqualTypeOf<never>();
    });

    it('should treat undefined union as required', () => {
      interface Mixed {
        id: number;
        name: string | undefined;
      }
      type Result = Key.Required<Mixed>;

      // Both are required even though name can be undefined
      expectTypeOf<Result>().toEqualTypeOf<'id' | 'name'>();
    });

    it('should handle mixed required and optional key', () => {
      interface Product {
        description?: string;
        discount?: number;
        id: number;
        name: string;
        price: number;
      }
      type Result = Key.Required<Product>;

      expectTypeOf<Result>().toEqualTypeOf<'id' | 'name' | 'price'>();
    });
  });
  //#endregion

  //#region> Shared
  describe('Shared<T, U>', () => {
    it('should extract key shared between two types', () => {
      interface A {
        age: number;
        id: number;
        name: string;
      }
      interface B {
        email: string;
        id: number;
      }
      type Result = Key.Shared<A, B>;

      expectTypeOf<Result>().toEqualTypeOf<'id'>();
    });

    it('should return never when no key are shared', () => {
      interface A {
        id: number;
        name: string;
      }
      interface B {
        age: number;
        email: string;
      }
      type Result = Key.Shared<A, B>;

      expectTypeOf<Result>().toEqualTypeOf<never>();
    });

    it('should return all key when types are identical', () => {
      interface A {
        id: number;
        name: string;
      }
      interface B {
        id: number;
        name: string;
      }
      type Result = Key.Shared<A, B>;

      expectTypeOf<Result>().toEqualTypeOf<'id' | 'name'>();
    });

    it('should handle multiple shared key', () => {
      interface A {
        age: number;
        email: string;
        id: number;
        name: string;
      }
      interface B {
        address: string;
        email: string;
        id: number;
      }
      type Result = Key.Shared<A, B>;

      expectTypeOf<Result>().toEqualTypeOf<'email' | 'id'>();
    });

    it('should handle empty objects', () => {
      interface A {}
      interface B {
        id: number;
      }
      type Result = Key.Shared<A, B>;

      expectTypeOf<Result>().toEqualTypeOf<never>();
    });

    it('should be commutative (order does not matter)', () => {
      interface A {
        age: number;
        id: number;
        name: string;
      }
      interface B {
        email: string;
        id: number;
      }
      type Result1 = Key.Shared<A, B>;
      type Result2 = Key.Shared<B, A>;

      expectTypeOf<Result1>().toEqualTypeOf<Result2>();
    });

    it('should handle symbol and number key', () => {
      const sym = Symbol('test');
      interface A {
        0: boolean;
        id: number;
        [sym]: string;
      }
      interface B {
        0: string;
        id: string;
        [sym]: number;
      }
      type Result = Key.Shared<A, B>;

      expectTypeOf<Result>().toEqualTypeOf<'id' | 0 | typeof sym>();
    });

    it('should only check key names, not value types', () => {
      interface A {
        id: number;
        name: string;
      }
      interface B {
        id: string;
        name: boolean;
      } // Different value types
      type Result = Key.Shared<A, B>;

      // Still shared because key exist in both
      expectTypeOf<Result>().toEqualTypeOf<'id' | 'name'>();
    });
  });
  //#endregion

  //#region> String
  describe('String<T>', () => {
    it('should extract only string key', () => {
      interface Mixed {
        0: boolean;
        id: number;
        name: string;
      }
      type Result = Key.String<Mixed>;

      expectTypeOf<Result>().toEqualTypeOf<'id' | 'name'>();
    });

    it('should return all key when all are strings', () => {
      interface AllStrings {
        email: string;
        id: number;
        name: string;
      }
      type Result = Key.String<AllStrings>;

      expectTypeOf<Result>().toEqualTypeOf<'email' | 'id' | 'name'>();
    });

    it('should exclude symbol key', () => {
      const sym = Symbol('test');
      interface WithSymbol {
        id: number;
        [sym]: string;
      }
      type Result = Key.String<WithSymbol>;

      expectTypeOf<Result>().toEqualTypeOf<'id'>();
    });

    it('should exclude number key', () => {
      interface WithNumbers {
        0: string;
        1: boolean;
        id: number;
      }
      type Result = Key.String<WithNumbers>;

      expectTypeOf<Result>().toEqualTypeOf<'id'>();
    });

    it('should handle empty object', () => {
      type Result = Key.String<{}>;

      expectTypeOf<Result>().toEqualTypeOf<never>();
    });

    it('should handle record types', () => {
      type NumRecord = Record<string, number>;
      type Result = Key.String<NumRecord>;

      expectTypeOf<Result>().toEqualTypeOf<string>();
    });

    it('should handle mixed key types comprehensively', () => {
      const sym1 = Symbol('a');
      const sym2 = Symbol('b');
      interface Complex {
        0: boolean;
        1: string;
        strKey1: number;
        strKey2: string;
        [sym1]: number;
        [sym2]: string;
      }
      type Result = Key.String<Complex>;

      expectTypeOf<Result>().toEqualTypeOf<'strKey1' | 'strKey2'>();
    });
  });
  //#endregion

  //#region> Unique
  describe('Unique<T, U>', () => {
    it('should extract key unique to either type', () => {
      interface A {
        age: number;
        id: number;
        name: string;
      }
      interface B {
        email: string;
        id: number;
      }
      type Result = Key.Unique<A, B>;

      expectTypeOf<Result>().toEqualTypeOf<'age' | 'email' | 'name'>();
    });

    it('should return all key from both when no key are shared', () => {
      interface A {
        id: number;
        name: string;
      }
      interface B {
        age: number;
        email: string;
      }
      type Result = Key.Unique<A, B>;

      expectTypeOf<Result>().toEqualTypeOf<'age' | 'email' | 'id' | 'name'>();
    });

    it('should return never when types are identical', () => {
      interface A {
        id: number;
        name: string;
      }
      interface B {
        id: number;
        name: string;
      }
      type Result = Key.Unique<A, B>;

      expectTypeOf<Result>().toEqualTypeOf<never>();
    });

    it('should handle one empty object', () => {
      interface A {
        id: number;
        name: string;
      }
      interface B {}
      type Result = Key.Unique<A, B>;

      expectTypeOf<Result>().toEqualTypeOf<'id' | 'name'>();
    });

    it('should handle both empty objects', () => {
      interface A {}
      interface B {}
      type Result = Key.Unique<A, B>;

      expectTypeOf<Result>().toEqualTypeOf<never>();
    });

    it('should be commutative (order does not matter)', () => {
      interface A {
        age: number;
        id: number;
        name: string;
      }
      interface B {
        email: string;
        id: number;
      }
      type Result1 = Key.Unique<A, B>;
      type Result2 = Key.Unique<B, A>;

      expectTypeOf<Result1>().toEqualTypeOf<Result2>();
    });

    it('should handle symbol and number key', () => {
      const sym = Symbol('test');
      interface A {
        0: boolean;
        id: number;
        [sym]: string;
        unique1: string;
      }
      interface B {
        0: string;
        id: string;
        [sym]: number;
        unique2: number;
      }
      type Result = Key.Unique<A, B>;

      expectTypeOf<Result>().toEqualTypeOf<'unique1' | 'unique2'>();
    });

    it('should exclude shared key regardless of value types', () => {
      interface A {
        age: number;
        id: number;
        name: string;
      }
      interface B {
        email: string;
        id: string;
        name: boolean;
      } // Different value types for shared key
      type Result = Key.Unique<A, B>;

      // id and name are shared (by key name), so only unique key remain
      expectTypeOf<Result>().toEqualTypeOf<'age' | 'email'>();
    });

    it('should handle complex scenarios', () => {
      interface A {
        shared1: number;
        shared2: string;
        uniqueA1: boolean;
        uniqueA2: number;
      }
      interface B {
        shared1: string;
        shared2: number;
        uniqueB1: string;
        uniqueB2: boolean;
      }
      type Result = Key.Unique<A, B>;

      expectTypeOf<Result>().toEqualTypeOf<'uniqueA1' | 'uniqueA2' | 'uniqueB1' | 'uniqueB2'>();
    });
  });
  //#endregion
});
