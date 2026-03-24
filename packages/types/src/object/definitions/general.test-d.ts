import { describe, expectTypeOf, it } from 'vitest';

import type {
  Entries,
  FromEntries,
  InferPrototype,
  Keys,
  PathToValue,
  SymbolEntries,
  Symbols,
  SymbolValues,
  ToIndexable,
  ValuePathToObject,
  Values,
  PickPath,
  Paths,
  PickPaths,
  PathLeaves,
  Simplify,
  DeepSimplify
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
      expectTypeOf<MyClassPrototype>().toEqualTypeOf<typeof MyClass.prototype>();
    });

    it('should return object shape for types without prototype properties', () => {
      interface T {
        a: number;
      }
      type Result = InferPrototype<T>;
      expectTypeOf<Result>().toEqualTypeOf<{ a: number }>();
    });
  });
  describe('Simplify', () => {
    it('should simplify a type by flattening its structure', () => {
      type A = { a: number } & { b: string };
      type B = Simplify<A>;
      expectTypeOf<B>().toEqualTypeOf<{ a: number; b: string }>();
    });
  });
  describe('DeepSimplify', () => {
    it('should deeply simplify a type by flattening its structure', () => {
      type A = { a: number; b: { c: string; d: { e: number } } } & { b: { d: { f: boolean } } };
      type B = DeepSimplify<A>;
      expectTypeOf<B>().toEqualTypeOf<{
        a: number;
        b: { c: string; d: { e: number; f: boolean } };
      }>();
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
        expectTypeOf<Result>().toEqualTypeOf<(['0', boolean] | ['a', number] | ['b', string])[]>();
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
        expectTypeOf<Result>().toEqualTypeOf<([typeof sym, number] | [typeof sym2, string])[]>();
      });
    });
  });
  describe('Paths', () => {
    it('Paths', () => {
      interface T {
        a: { b: { c: number } };
        d: string;
      }
      type Result = Paths<T>;
      expectTypeOf<Result>().toEqualTypeOf<'a' | 'a.b' | 'a.b.c' | 'd'>();
    });
    it('PathToValue', () => {
      interface T {
        a: { b: { c: { d: number } } };
      }
      type Result = PathToValue<T, 'a.b.c.d'>;
      expectTypeOf<Result>().toEqualTypeOf<number>();
      type Result2 = PathToValue<T, 'a.b.x'>;
      expectTypeOf<Result2>().toEqualTypeOf<never>();
    });
    it('ValuePathToObject', () => {
      type Result = ValuePathToObject<'a.b.c.d', number>;
      expectTypeOf<Result>().toEqualTypeOf<{ a: { b: { c: { d: number } } } }>();
      type Result2 = ValuePathToObject<'a', boolean>;
      expectTypeOf<Result2>().toEqualTypeOf<{ a: boolean }>();
    });
    it('PickPath', () => {
      interface T {
        a: { b: { c: { d: number } } };
        x: string;
      }
      type Result = PickPath<T, 'a.b.c.d'>;
      expectTypeOf<Result>().toEqualTypeOf<{ a: { b: { c: { d: number } } } }>();
      type Result2 = PickPath<T, 'x'>;
      expectTypeOf<Result2>().toEqualTypeOf<{ x: string }>();
    });
    it('PickPaths', () => {
      interface T {
        a: { b: { c: { d: number } } };
        x: string;
      }
      type Result = PickPaths<T, 'a.b.c.d' | 'x'>;
      expectTypeOf<Result>().toEqualTypeOf<{ a: { b: { c: { d: number } } }; x: string }>();
    });
    it('PathLeaves', () => {
      interface T {
        a: { b: { c: { d: number } } };
        x: string;
      }
      type Result = PathLeaves<T>;
      expectTypeOf<Result>().toEqualTypeOf<'a.b.c.d' | 'x'>();
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

  it('FromEntries constructs an object using entries', () => {
    type T = (['a', number] | ['b', string] | ['c', boolean])[];
    type Result = FromEntries<T>;
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: string; c: boolean }>();
  });
});
