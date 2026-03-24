import { describe, expectTypeOf, it } from 'vitest';
import type {
  Add,
  Decrement,
  GreaterThan,
  LessThan,
  Increment,
  Subtract,
  IsDivisible
} from './number.ts';

describe('Number Types', () => {
  it('Add', () => {
    type Test = Add<2, 3>;
    expectTypeOf<Test>().toEqualTypeOf<5>();
  });
  it('Subtract', () => {
    type Test = Subtract<5, 3>;
    expectTypeOf<Test>().toEqualTypeOf<2>();
  });
  it('Increment', () => {
    type Test = Increment<4>;
    expectTypeOf<Test>().toEqualTypeOf<5>();
  });
  it('Decrement', () => {
    type Test = Decrement<4>;
    expectTypeOf<Test>().toEqualTypeOf<3>();
  });
  it('GreaterThan', () => {
    type Test1 = GreaterThan<5, 3>;
    type Test2 = GreaterThan<2, 4>;
    expectTypeOf<Test1>().toEqualTypeOf<true>();
    expectTypeOf<Test2>().toEqualTypeOf<false>();
  });
  it('LessThan', () => {
    type Test1 = LessThan<2, 4>;
    type Test2 = LessThan<5, 3>;
    expectTypeOf<Test1>().toEqualTypeOf<true>();
    expectTypeOf<Test2>().toEqualTypeOf<false>();
  });
  it('IsDivisible', () => {
    type Test1 = IsDivisible<6, 3>;
    type Test2 = IsDivisible<7, 3>;
    expectTypeOf<Test1>().toEqualTypeOf<true>();
    expectTypeOf<Test2>().toEqualTypeOf<false>();
  });
});
