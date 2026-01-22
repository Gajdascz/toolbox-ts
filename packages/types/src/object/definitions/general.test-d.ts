import { describe, expectTypeOf, it } from 'vitest';

import type {
  Entries,
  InferPrototype,
  Keys,
  SymbolEntries,
  Symbols,
  SymbolValues,
  ToIndexable,
  Values
} from './general.js';
import type { KeyEnumerable } from './key/index.ts';

describe('general', () => {
  describe('InferPrototype', () => {
    it('should infer prototype of a object with prototype property', () => {
      interface T {
        prototype: { a: number };
      }
      type Result = InferPrototype<T>;
      expectTypeOf<Result>().toEqualTypeOf<{ a: number }>();
    });

    it('should infer prototype of a object with __proto__ property', () => {
      interface T {
        __proto__: { b: string };
      }
      type Result = InferPrototype<T>;
      expectTypeOf<Result>().toEqualTypeOf<{ b: string }>();
    });

    it('should return null for null type', () => {
      type Result = InferPrototype<null>;
      expectTypeOf<Result>().toEqualTypeOf<null>();
    });
    it('should return prototype of classes', () => {
      type DatePrototype = InferPrototype<typeof Date>;
      expectTypeOf<DatePrototype>().toEqualTypeOf<typeof Date.prototype>();

      class MyClass {
        a = 123;
        b() {
          return 'hello';
        }
      }
      type MyClassPrototype = InferPrototype<typeof MyClass>;
      expectTypeOf<MyClassPrototype>().toEqualTypeOf<
        typeof MyClass.prototype
      >();
    });

    it('should return object shape for types without prototype properties', () => {
      interface T {
        a: number;
      }
      type Result = InferPrototype<T>;
      expectTypeOf<Result>().toEqualTypeOf<{ a: number }>();
    });
  });
  describe('Return Types', () => {
    describe('Enumerable', () => {
      it('keys', () => {
        interface T {
          0: boolean;
          a: number;
          b: string;
        }
        type Result = Keys<T>;
        expectTypeOf<Result>().toEqualTypeOf<('0' | 'a' | 'b')[]>();
      });
      it('values', () => {
        interface T {
          0: boolean;
          a: number;
          b: string;
        }
        type Result = Values<T>;
        expectTypeOf<Result>().toEqualTypeOf<(boolean | number | string)[]>();
      });
      it('entries', () => {
        interface T {
          0: boolean;
          a: number;
          b: string;
        }
        type Result = Entries<T>;
        expectTypeOf<Result>().toEqualTypeOf<
          (['0', boolean] | ['a', number] | ['b', string])[]
        >();
      });
    });
    describe('Symbol', () => {
      it('keys', () => {
        const sym = Symbol('sym');
        const sym2 = Symbol('sym2');
        interface T {
          [sym]: number;
          [sym2]: string;
        }
        type Result = Symbols<T>;
        expectTypeOf<Result>().toEqualTypeOf<(typeof sym | typeof sym2)[]>();
      });
      it('values', () => {
        const sym = Symbol('sym');
        const sym2 = Symbol('sym2');
        interface T {
          0: true;
          a: true;
          [sym]: number;
          [sym2]: string;
        }
        type Result = SymbolValues<T>;
        expectTypeOf<Result>().toEqualTypeOf<(number | string)[]>();
      });
      it('entries', () => {
        const sym = Symbol('sym');
        const sym2 = Symbol('sym2');
        interface T {
          readonly [sym]: number;
          readonly [sym2]: string;
        }
        type Result = SymbolEntries<T>;
        expectTypeOf<Result>().toEqualTypeOf<
          ([typeof sym, number] | [typeof sym2, string])[]
        >();
      });
    });
  });
  it('ToIndexable', () => {
    interface T {
      0: boolean;
      a: number;
      b: string;
    }
    expectTypeOf<ToIndexable<T>>().toEqualTypeOf<
      { [key: PropertyKey]: unknown } & {
        [K in keyof T as KeyEnumerable<T>]: T[K];
      }
    >();
  });
});
