import { describe, expectTypeOf, it } from 'vitest';

import type {
  CamelCase,
  CamelToKebab,
  CamelToPascal,
  CamelToSnake,
  ConvertCase,
  IsCamelCase,
  IsKebabCase,
  IsPascalCase,
  IsSnakeCase,
  KebabCase,
  KebabToCamel,
  KebabToPascal,
  KebabToSnake,
  PascalCase,
  PascalToCamel,
  PascalToKebab,
  PascalToSnake,
  SnakeCase,
  SnakeToCamel,
  SnakeToKebab,
  SnakeToPascal
} from './cases.js';
type Camel = 'helloWorldHowAreYou';
type Kebab = 'hello-world-how-are-you';
type Pascal = 'HelloWorldHowAreYou';
type Snake = 'hello_world_how_are_you';

describe('String Case Types', () => {
  it('KebabToCamel', () =>
    expectTypeOf<KebabToCamel<Kebab>>().toEqualTypeOf<Camel>());
  it('KebabToPascal', () =>
    expectTypeOf<KebabToPascal<Kebab>>().toEqualTypeOf<Pascal>());
  it('KebabToSnake', () =>
    expectTypeOf<KebabToSnake<Kebab>>().toEqualTypeOf<Snake>());

  it('CamelToKebab', () =>
    expectTypeOf<CamelToKebab<Camel>>().toEqualTypeOf<Kebab>());
  it('CamelToPascal', () =>
    expectTypeOf<CamelToPascal<Camel>>().toEqualTypeOf<Pascal>());
  it('CamelToSnake', () =>
    expectTypeOf<CamelToSnake<Camel>>().toEqualTypeOf<Snake>());

  it('PascalToCamel', () =>
    expectTypeOf<PascalToCamel<Pascal>>().toEqualTypeOf<Camel>());
  it('PascalToKebab', () =>
    expectTypeOf<PascalToKebab<Pascal>>().toEqualTypeOf<Kebab>());
  it('PascalToSnake', () =>
    expectTypeOf<PascalToSnake<Pascal>>().toEqualTypeOf<Snake>());

  it('SnakeToCamel', () =>
    expectTypeOf<SnakeToCamel<Snake>>().toEqualTypeOf<Camel>());
  it('SnakeToKebab', () =>
    expectTypeOf<SnakeToKebab<Snake>>().toEqualTypeOf<Kebab>());
  it('SnakeToPascal', () =>
    expectTypeOf<SnakeToPascal<Snake>>().toEqualTypeOf<Pascal>());

  describe('Round-trip conversions', () => {
    it('converts camel to kebab and back', () => {
      type Original = 'helloWorld';
      type Converted = KebabToCamel<CamelToKebab<Original>>;
      expectTypeOf<Converted>().toEqualTypeOf<Original>();
    });

    it('converts pascal to snake and back', () => {
      type Original = 'HelloWorld';
      type Converted = SnakeToPascal<PascalToSnake<Original>>;
      expectTypeOf<Converted>().toEqualTypeOf<Original>();
    });
  });

  it('ConvertCase works as expected', () => {
    type Original = 'helloWorld';
    type Converted = ConvertCase<Original, 'camel', 'kebab'>;
    expectTypeOf<Converted>().toEqualTypeOf<'hello-world'>();
    type ConvertedBack = ConvertCase<Converted, 'kebab', 'camel'>;
    expectTypeOf<ConvertedBack>().toEqualTypeOf<Original>();
  });
  describe('Is Case', () => {
    it('identifies camel case', () => {
      expectTypeOf<IsCamelCase<'helloWorld'>>().toEqualTypeOf<'helloWorld'>();
      expectTypeOf<
        IsCamelCase<'helloWorldTest!'>
      >().toEqualTypeOf<'helloWorldTest!'>();
      expectTypeOf<IsCamelCase<'HelloWorld'>>().toEqualTypeOf<never>();
      expectTypeOf<IsCamelCase<'hello-world'>>().toEqualTypeOf<never>();
      expectTypeOf<IsCamelCase<'hello_world'>>().toEqualTypeOf<never>();
      expectTypeOf<IsCamelCase<'Hello World'>>().toEqualTypeOf<never>();
    });
    it('identifies kebab case', () => {
      expectTypeOf<IsKebabCase<'hello-world'>>().toEqualTypeOf<'hello-world'>();
      expectTypeOf<
        IsKebabCase<'hello-world-test'>
      >().toEqualTypeOf<'hello-world-test'>();
      expectTypeOf<IsKebabCase<'hello'>>().toEqualTypeOf<'hello'>();
      expectTypeOf<IsKebabCase<'Hello'>>().toEqualTypeOf<never>();
      expectTypeOf<IsKebabCase<'Hello-World'>>().toEqualTypeOf<never>();
      expectTypeOf<IsKebabCase<'helloWorld'>>().toEqualTypeOf<never>();
      expectTypeOf<IsKebabCase<'hello_world'>>().toEqualTypeOf<never>();
      expectTypeOf<IsKebabCase<'Hello World'>>().toEqualTypeOf<never>();
    });
    it('identifies pascal case', () => {
      expectTypeOf<IsPascalCase<'HelloWorld'>>().toEqualTypeOf<'HelloWorld'>();
      expectTypeOf<
        IsPascalCase<'HelloWorldTest'>
      >().toEqualTypeOf<'HelloWorldTest'>();
      expectTypeOf<IsPascalCase<'helloWorld'>>().toEqualTypeOf<never>();
      expectTypeOf<IsPascalCase<'hello-world'>>().toEqualTypeOf<never>();
      expectTypeOf<IsPascalCase<'hello_world'>>().toEqualTypeOf<never>();
      expectTypeOf<IsPascalCase<'Hello World'>>().toEqualTypeOf<never>();
      expectTypeOf<IsPascalCase<'Hello-World'>>().toEqualTypeOf<never>();
    });
    it('identifies snake case', () => {
      expectTypeOf<IsSnakeCase<'hello_world'>>().toEqualTypeOf<'hello_world'>();
      expectTypeOf<
        IsSnakeCase<'hello_world_test'>
      >().toEqualTypeOf<'hello_world_test'>();
      expectTypeOf<IsSnakeCase<'HelloWorld'>>().toEqualTypeOf<never>();
      expectTypeOf<IsSnakeCase<'Hello_World'>>().toEqualTypeOf<never>();
      expectTypeOf<IsSnakeCase<'hello-world'>>().toEqualTypeOf<never>();
    });
  });
  it('general case types pass Is validation', () => {
    expectTypeOf<IsCamelCase<CamelCase>>().toEqualTypeOf<CamelCase>();
    expectTypeOf<IsKebabCase<KebabCase>>().toEqualTypeOf<KebabCase>();
    expectTypeOf<IsPascalCase<PascalCase>>().toEqualTypeOf<PascalCase>();
    expectTypeOf<IsSnakeCase<SnakeCase>>().toEqualTypeOf<SnakeCase>();
  });
});
