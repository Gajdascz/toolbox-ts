import type {
  IsArray,
  IsBigInt,
  IsBoolean,
  IsFalsy,
  IsFunction,
  IsMap,
  IsNever,
  IsNullish,
  IsNumber,
  IsObject,
  IsPrimitive,
  IsSet,
  IsString,
  IsPlainObject,
  IsSymbol,
  IsTuple,
  IsUndefined,
  MaybePromise,
  Narrow,
  NonNullish,
  Truthy,
  Widen,
  WidenMap,
  WidenPrimitive,
  WidenSet
} from './general.ts';
import { it, describe, expectTypeOf } from 'vitest';

describe('General Types', () => {
  it('NonNullish excludes nullish types', () => {
    expectTypeOf<NonNullish<string | null | undefined>>().toEqualTypeOf<string>();
    expectTypeOf<NonNullish<number | null>>().toEqualTypeOf<number>();
    expectTypeOf<NonNullish<undefined | boolean>>().toEqualTypeOf<boolean>();
    expectTypeOf<NonNullish<null | undefined>>().toEqualTypeOf<never>();
  });
  it('Truthy excludes falsy types', () => {
    expectTypeOf<Truthy<string | '' | null | undefined>>().toEqualTypeOf<string>();
    expectTypeOf<Truthy<number | 0 | null>>().toEqualTypeOf<number>();
    expectTypeOf<Truthy<boolean | false | undefined>>().toEqualTypeOf<true>();
    expectTypeOf<Truthy<false | 0 | '' | null | undefined>>().toEqualTypeOf<never>();
  });
  describe('Conditionals', () => {
    it('MaybePromise wraps in Promise if true', () => {
      expectTypeOf<MaybePromise<string, true>>().toEqualTypeOf<Promise<string>>();
      expectTypeOf<MaybePromise<number, false>>().toEqualTypeOf<number>();
      expectTypeOf<MaybePromise<string, boolean>>().toEqualTypeOf<string | Promise<string>>();
    });
    it('IsArray identifies arrays', () => {
      expectTypeOf<IsArray<string[]>>().toEqualTypeOf<true>();
      expectTypeOf<IsArray<readonly number[]>>().toEqualTypeOf<true>();
      expectTypeOf<IsArray<readonly [string, string, string]>>().toEqualTypeOf<true>();
      expectTypeOf<IsArray<string>>().toEqualTypeOf<false>();
    });
    it('IsBigInt identifies bigints', () => {
      expectTypeOf<IsBigInt<bigint>>().toEqualTypeOf<true>();
      expectTypeOf<IsBigInt<number>>().toEqualTypeOf<false>();
      expectTypeOf<IsBigInt<'0n'>>().toEqualTypeOf<false>();
    });
    it('IsTuple identifies tuples', () => {
      expectTypeOf<IsTuple<readonly [string, number]>>().toEqualTypeOf<true>();
      expectTypeOf<IsTuple<[]>>().toEqualTypeOf<true>();
      expectTypeOf<IsTuple<string[]>>().toEqualTypeOf<false>();
      expectTypeOf<IsTuple<readonly string[]>>().toEqualTypeOf<false>();
      expectTypeOf<IsTuple<string>>().toEqualTypeOf<false>();
    });
    it('IsUndefined identifies undefined', () => {
      expectTypeOf<IsUndefined<undefined>>().toEqualTypeOf<true>();
      expectTypeOf<IsUndefined<string>>().toEqualTypeOf<false>();
      expectTypeOf<IsUndefined<null>>().toEqualTypeOf<false>();
    });
    it('IsSymbol identifies symbols', () => {
      expectTypeOf<IsSymbol<symbol>>().toEqualTypeOf<true>();
      expectTypeOf<IsSymbol<'symbol'>>().toEqualTypeOf<false>();
      expectTypeOf<IsSymbol<number>>().toEqualTypeOf<false>();
    });
    it('IsString identifies strings', () => {
      expectTypeOf<IsString<string>>().toEqualTypeOf<true>();
      expectTypeOf<IsString<'string'>>().toEqualTypeOf<true>();
      expectTypeOf<IsString<number>>().toEqualTypeOf<false>();
    });
    it('IsPrimitive identifies primitive types', () => {
      expectTypeOf<IsPrimitive<string>>().toEqualTypeOf<true>();
      expectTypeOf<IsPrimitive<number>>().toEqualTypeOf<true>();
      expectTypeOf<IsPrimitive<boolean>>().toEqualTypeOf<true>();
      expectTypeOf<IsPrimitive<symbol>>().toEqualTypeOf<true>();
      expectTypeOf<IsPrimitive<bigint>>().toEqualTypeOf<true>();
      expectTypeOf<IsPrimitive<null>>().toEqualTypeOf<true>();
      expectTypeOf<IsPrimitive<undefined>>().toEqualTypeOf<true>();
      expectTypeOf<
        IsPrimitive<undefined | string | number | boolean | symbol | bigint | null>
      >().toEqualTypeOf<true>();
      expectTypeOf<IsPrimitive<object>>().toEqualTypeOf<false>();
      expectTypeOf<IsPrimitive<() => void>>().toEqualTypeOf<false>();
    });
    it('IsFunction identifies functions', () => {
      expectTypeOf<IsFunction<() => void>>().toEqualTypeOf<true>();
      expectTypeOf<IsFunction<(...args: any[]) => string>>().toEqualTypeOf<true>();
      expectTypeOf<IsFunction<string>>().toEqualTypeOf<false>();
      expectTypeOf<IsFunction<object>>().toEqualTypeOf<false>();
    });
    it('IsNumber identifies numbers', () => {
      expectTypeOf<IsNumber<number>>().toEqualTypeOf<true>();
      expectTypeOf<IsNumber<42>>().toEqualTypeOf<true>();
      expectTypeOf<IsNumber<string>>().toEqualTypeOf<false>();
    });
    it('IsBoolean identifies booleans', () => {
      expectTypeOf<IsBoolean<boolean>>().toEqualTypeOf<true>();
      expectTypeOf<IsBoolean<true>>().toEqualTypeOf<true>();
      expectTypeOf<IsBoolean<'true'>>().toEqualTypeOf<false>();
    });
    it('IsNullish identifies nullish types', () => {
      expectTypeOf<IsNullish<null>>().toEqualTypeOf<true>();
      expectTypeOf<IsNullish<undefined>>().toEqualTypeOf<true>();
      expectTypeOf<IsNullish<null | undefined>>().toEqualTypeOf<true>();
      expectTypeOf<IsNullish<string>>().toEqualTypeOf<false>();
      expectTypeOf<IsNullish<number | null>>().toEqualTypeOf<boolean>();
    });
    it('IsNever identifies never type', () => {
      expectTypeOf<IsNever<never>>().toEqualTypeOf<true>();
      expectTypeOf<IsNever<string>>().toEqualTypeOf<false>();
      expectTypeOf<IsNever<string | never>>().toEqualTypeOf<false>();
    });
    it('IsObject identifies objects', () => {
      expectTypeOf<IsObject<object>>().toEqualTypeOf<true>();
      expectTypeOf<IsObject<{ a: string }>>().toEqualTypeOf<true>();
      expectTypeOf<IsObject<() => void>>().toEqualTypeOf<true>();
      expectTypeOf<IsObject<string>>().toEqualTypeOf<false>();
      expectTypeOf<IsObject<number>>().toEqualTypeOf<false>();
    });
    it('IsMap identifies maps', () => {
      expectTypeOf<IsMap<Map<string, number>>>().toEqualTypeOf<true>();
      expectTypeOf<IsMap<ReadonlyMap<string, number>>>().toEqualTypeOf<true>();
      expectTypeOf<IsMap<object>>().toEqualTypeOf<false>();
    });
    it('IsSet identifies sets', () => {
      expectTypeOf<IsSet<Set<string>>>().toEqualTypeOf<true>();
      expectTypeOf<IsSet<ReadonlySet<number>>>().toEqualTypeOf<true>();
      expectTypeOf<IsSet<object>>().toEqualTypeOf<false>();
    });
    it('IsFalsy identifies falsy types', () => {
      expectTypeOf<IsFalsy<false>>().toEqualTypeOf<true>();
      expectTypeOf<IsFalsy<0>>().toEqualTypeOf<true>();
      expectTypeOf<IsFalsy<''>>().toEqualTypeOf<true>();
      expectTypeOf<IsFalsy<null>>().toEqualTypeOf<true>();
      expectTypeOf<IsFalsy<undefined>>().toEqualTypeOf<true>();
      expectTypeOf<IsFalsy<string>>().toEqualTypeOf<false>();
      expectTypeOf<IsFalsy<number>>().toEqualTypeOf<false>();
    });
    it('IsPlainObject identifies string records', () => {
      expectTypeOf<IsPlainObject<Record<string, unknown>>>().toEqualTypeOf<true>();
      expectTypeOf<IsPlainObject<{ a: number; b: string }>>().toEqualTypeOf<true>();
      expectTypeOf<IsPlainObject<object>>().toEqualTypeOf<false>();
      expectTypeOf<IsPlainObject<Array<any>>>().toEqualTypeOf<false>();
      expectTypeOf<IsPlainObject<typeof Map>>().toEqualTypeOf<false>();
      expectTypeOf<IsPlainObject<(...args: any[]) => unknown>>().toEqualTypeOf<false>();
    });
  });
  describe('Narrow', () => {
    it('narrows string literals to string', () => {
      expectTypeOf<Narrow<'hello'>>().toEqualTypeOf<string>();
      expectTypeOf<Narrow<'world' | 'foo'>>().toEqualTypeOf<string>();
    });
    it('narrows number literals to number', () => {
      expectTypeOf<Narrow<42>>().toEqualTypeOf<number>();
      expectTypeOf<Narrow<1 | 2 | 3>>().toEqualTypeOf<number>();
    });
    it('narrows boolean literals to boolean', () => {
      expectTypeOf<Narrow<true>>().toEqualTypeOf<boolean>();
      expectTypeOf<Narrow<false>>().toEqualTypeOf<boolean>();
      expectTypeOf<Narrow<true | false>>().toEqualTypeOf<boolean>();
    });
    it('narrows bigint literals to bigint', () => {
      expectTypeOf<Narrow<42n>>().toEqualTypeOf<bigint>();
      expectTypeOf<Narrow<1n | 2n | 3n>>().toEqualTypeOf<bigint>();
    });
    it('narrows symbol literals to symbol', () => {
      const sym1 = Symbol('sym1');
      const sym2 = Symbol('sym2');
      expectTypeOf<Narrow<typeof sym1>>().toEqualTypeOf<symbol>();
      expectTypeOf<Narrow<typeof sym1 | typeof sym2>>().toEqualTypeOf<symbol>();
    });
    it('narrows null and undefined to their types', () => {
      expectTypeOf<Narrow<null>>().toEqualTypeOf<null>();
      expectTypeOf<Narrow<undefined>>().toEqualTypeOf<undefined>();
      expectTypeOf<Narrow<null | undefined>>().toEqualTypeOf<null | undefined>();
    });
    it('narrows objects recursively', () => {
      expectTypeOf<Narrow<{ a: 1; b: 'test'; c: { d: true } }>>().toEqualTypeOf<{
        readonly a: number;
        readonly b: string;
        readonly c: { readonly d: boolean };
      }>();
    });
    it('narrows functions correctly', () => {
      expectTypeOf<Narrow<() => string>>().toEqualTypeOf<() => string>();
      expectTypeOf<Narrow<(x: number, y: boolean) => number>>().toEqualTypeOf<
        (x: number, y: boolean) => number
      >();
    });
  });
  describe('Widen', () => {
    it('primitive types', () => {
      expectTypeOf<WidenPrimitive<'hello'>>().toEqualTypeOf<string>();
      expectTypeOf<WidenPrimitive<42>>().toEqualTypeOf<number>();
      expectTypeOf<WidenPrimitive<true>>().toEqualTypeOf<boolean>();
      expectTypeOf<WidenPrimitive<42n>>().toEqualTypeOf<bigint>();
      const sym = Symbol('sym');
      expectTypeOf<WidenPrimitive<typeof sym>>().toEqualTypeOf<symbol>();
      expectTypeOf<WidenPrimitive<null>>().toEqualTypeOf<null>();
      expectTypeOf<WidenPrimitive<undefined>>().toEqualTypeOf<undefined>();
    });
    it('Map types', () => {
      expectTypeOf<WidenMap<Map<'a', 1>>>().toEqualTypeOf<Map<string, number>>();
      expectTypeOf<WidenMap<ReadonlyMap<'b', 2>>>().toEqualTypeOf<ReadonlyMap<string, number>>();
    });
    it('Set types', () => {
      expectTypeOf<WidenSet<Set<1 | 2 | 3>>>().toEqualTypeOf<Set<number>>();
      expectTypeOf<WidenSet<ReadonlySet<'a' | 'b'>>>().toEqualTypeOf<ReadonlySet<string>>();
    });
    describe('combined', () => {
      it('widens all types correctly', () => {
        const sym = Symbol('sym');
        expectTypeOf<
          Widen<{
            a: 'hello';
            b: 42;
            c: true;
            d: 42n;
            e: typeof sym;
            f: null;
            g: undefined;
            h: Map<'a', 1>;
            i: Set<1 | 2 | 3>;
            j: (x: number) => string;
            k: ['foo', 'bar'];
          }>
        >().branded.toEqualTypeOf<{
          a: string;
          b: number;
          c: boolean;
          d: bigint;
          e: symbol;
          f: null;
          g: undefined;
          h: Map<string, number>;
          i: Set<number>;
          j: (...args: [number]) => string;
          k: string[];
        }>();
      });
    });
    it('widens objects using preserve', () => {
      expectTypeOf<Widen<{ a: 'hello'; b: 42; c: true }, 'preserve'>>().toEqualTypeOf<{
        a: string;
        b: number;
        c: boolean;
      }>();
    });
    it('widens objects to object', () => {
      expectTypeOf<Widen<{ a: 'hello'; b: 42; c: true }, object>>().toEqualTypeOf<object>();
    });
    it('widens objects to Record<string, unknown>', () => {
      expectTypeOf<Widen<{ a: 'hello'; b: 42; c: true }, Record<string, unknown>>>().toEqualTypeOf<
        Record<string, unknown>
      >();
    });
  });
});
