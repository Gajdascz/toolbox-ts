import { describe, expectTypeOf, it } from 'vitest';

import type {
  CamelToKebab,
  CamelToPascal,
  CamelToSnake,
  CamelToTitle,
  CaseType,
  KebabToCamel,
  KebabToPascal,
  KebabToSnake,
  KebabToTitle,
  PascalToCamel,
  PascalToKebab,
  PascalToSnake,
  PascalToTitle,
  SnakeToCamel,
  SnakeToKebab,
  SnakeToPascal,
  SnakeToTitle,
  TitleToCamel,
  TitleToKebab,
  TitleToPascal,
  TitleToSnake
} from './cases.js';

describe('String Case Types', () => {
  describe('CaseType', () => {
    it('defines valid case format types', () => {
      expectTypeOf<CaseType>().toEqualTypeOf<
        'camel' | 'kebab' | 'pascal' | 'snake' | 'title'
      >();
    });
  });

  describe('KebabTo conversions', () => {
    describe('KebabToCamel', () => {
      it('converts single word kebab to camel', () => {
        expectTypeOf<KebabToCamel<'hello'>>().toEqualTypeOf<'hello'>();
      });

      it('converts multi-word kebab to camel', () => {
        expectTypeOf<
          KebabToCamel<'hello-world'>
        >().toEqualTypeOf<'helloWorld'>();
      });

      it('converts three-word kebab to camel', () => {
        expectTypeOf<
          KebabToCamel<'hello-world-test'>
        >().toEqualTypeOf<'helloWorldTest'>();
      });

      it('handles empty string', () => {
        expectTypeOf<KebabToCamel<''>>().toEqualTypeOf<''>();
      });
    });

    describe('KebabToPascal', () => {
      it('converts single word kebab to pascal', () => {
        expectTypeOf<KebabToPascal<'hello'>>().toEqualTypeOf<'Hello'>();
      });

      it('converts multi-word kebab to pascal', () => {
        expectTypeOf<
          KebabToPascal<'hello-world'>
        >().toEqualTypeOf<'HelloWorld'>();
      });

      it('converts three-word kebab to pascal', () => {
        expectTypeOf<
          KebabToPascal<'foo-bar-baz'>
        >().toEqualTypeOf<'FooBarBaz'>();
      });
    });

    describe('KebabToSnake', () => {
      it('converts single word kebab to snake', () => {
        expectTypeOf<KebabToSnake<'hello'>>().toEqualTypeOf<'hello'>();
      });

      it('converts multi-word kebab to snake', () => {
        expectTypeOf<
          KebabToSnake<'hello-world'>
        >().toEqualTypeOf<'hello_world'>();
      });

      it('converts three-word kebab to snake', () => {
        expectTypeOf<
          KebabToSnake<'foo-bar-baz'>
        >().toEqualTypeOf<'foo_bar_baz'>();
      });
    });

    describe('KebabToTitle', () => {
      it('converts single word kebab to title', () => {
        expectTypeOf<KebabToTitle<'hello'>>().toEqualTypeOf<'Hello'>();
      });

      it('converts multi-word kebab to title', () => {
        expectTypeOf<
          KebabToTitle<'hello-world'>
        >().toEqualTypeOf<'Hello World'>();
      });

      it('converts three-word kebab to title', () => {
        expectTypeOf<
          KebabToTitle<'foo-bar-baz'>
        >().toEqualTypeOf<'Foo Bar Baz'>();
      });
    });
  });

  describe('CamelTo conversions', () => {
    describe('CamelToKebab', () => {
      it('converts single word camel to kebab', () => {
        expectTypeOf<CamelToKebab<'hello'>>().toEqualTypeOf<'hello'>();
      });

      it('converts multi-word camel to kebab', () => {
        expectTypeOf<
          CamelToKebab<'helloWorld'>
        >().toEqualTypeOf<'hello-world'>();
      });

      it('converts three-word camel to kebab', () => {
        expectTypeOf<
          CamelToKebab<'helloWorldTest'>
        >().toEqualTypeOf<'hello-world-test'>();
      });

      it('handles empty string', () => {
        expectTypeOf<CamelToKebab<''>>().toEqualTypeOf<''>();
      });
    });

    describe('CamelToPascal', () => {
      it('converts camel to pascal', () => {
        expectTypeOf<
          CamelToPascal<'helloWorld'>
        >().toEqualTypeOf<'HelloWorld'>();
      });

      it('converts single word camel to pascal', () => {
        expectTypeOf<CamelToPascal<'hello'>>().toEqualTypeOf<'Hello'>();
      });
    });

    describe('CamelToSnake', () => {
      it('converts single word camel to snake', () => {
        expectTypeOf<CamelToSnake<'hello'>>().toEqualTypeOf<'hello'>();
      });

      it('converts multi-word camel to snake', () => {
        expectTypeOf<
          CamelToSnake<'helloWorld'>
        >().toEqualTypeOf<'hello_world'>();
      });

      it('converts three-word camel to snake', () => {
        expectTypeOf<
          CamelToSnake<'fooBarBaz'>
        >().toEqualTypeOf<'foo_bar_baz'>();
      });
    });

    describe('CamelToTitle', () => {
      it('converts single word camel to title', () => {
        expectTypeOf<CamelToTitle<'hello'>>().toEqualTypeOf<'Hello'>();
      });

      it('converts multi-word camel to title', () => {
        expectTypeOf<
          CamelToTitle<'helloWorld'>
        >().toEqualTypeOf<'Hello World'>();
      });

      it('converts three-word camel to title', () => {
        expectTypeOf<
          CamelToTitle<'fooBarBaz'>
        >().toEqualTypeOf<'Foo Bar Baz'>();
      });
    });
  });

  describe('PascalTo conversions', () => {
    describe('PascalToCamel', () => {
      it('converts pascal to camel', () => {
        expectTypeOf<
          PascalToCamel<'HelloWorld'>
        >().toEqualTypeOf<'helloWorld'>();
      });

      it('converts single word pascal to camel', () => {
        expectTypeOf<PascalToCamel<'Hello'>>().toEqualTypeOf<'hello'>();
      });
    });

    describe('PascalToKebab', () => {
      it('converts single word pascal to kebab', () => {
        expectTypeOf<PascalToKebab<'Hello'>>().toEqualTypeOf<'hello'>();
      });

      it('converts multi-word pascal to kebab', () => {
        expectTypeOf<
          PascalToKebab<'HelloWorld'>
        >().toEqualTypeOf<'hello-world'>();
      });

      it('converts three-word pascal to kebab', () => {
        expectTypeOf<
          PascalToKebab<'FooBarBaz'>
        >().toEqualTypeOf<'foo-bar-baz'>();
      });
    });

    describe('PascalToSnake', () => {
      it('converts single word pascal to snake', () => {
        expectTypeOf<PascalToSnake<'Hello'>>().toEqualTypeOf<'hello'>();
      });

      it('converts multi-word pascal to snake', () => {
        expectTypeOf<
          PascalToSnake<'HelloWorld'>
        >().toEqualTypeOf<'hello_world'>();
      });

      it('converts three-word pascal to snake', () => {
        expectTypeOf<
          PascalToSnake<'FooBarBaz'>
        >().toEqualTypeOf<'foo_bar_baz'>();
      });
    });

    describe('PascalToTitle', () => {
      it('converts single word pascal to title', () => {
        expectTypeOf<PascalToTitle<'Hello'>>().toEqualTypeOf<'Hello'>();
      });

      it('converts multi-word pascal to title', () => {
        expectTypeOf<
          PascalToTitle<'HelloWorld'>
        >().toEqualTypeOf<'Hello World'>();
      });

      it('converts three-word pascal to title', () => {
        expectTypeOf<
          PascalToTitle<'FooBarBaz'>
        >().toEqualTypeOf<'Foo Bar Baz'>();
      });
    });
  });

  describe('SnakeTo conversions', () => {
    describe('SnakeToCamel', () => {
      it('converts single word snake to camel', () => {
        expectTypeOf<SnakeToCamel<'hello'>>().toEqualTypeOf<'hello'>();
      });

      it('converts multi-word snake to camel', () => {
        expectTypeOf<
          SnakeToCamel<'hello_world'>
        >().toEqualTypeOf<'helloWorld'>();
      });

      it('converts three-word snake to camel', () => {
        expectTypeOf<
          SnakeToCamel<'foo_bar_baz'>
        >().toEqualTypeOf<'fooBarBaz'>();
      });
    });

    describe('SnakeToKebab', () => {
      it('converts single word snake to kebab', () => {
        expectTypeOf<SnakeToKebab<'hello'>>().toEqualTypeOf<'hello'>();
      });

      it('converts multi-word snake to kebab', () => {
        expectTypeOf<
          SnakeToKebab<'hello_world'>
        >().toEqualTypeOf<'hello-world'>();
      });

      it('converts three-word snake to kebab', () => {
        expectTypeOf<
          SnakeToKebab<'foo_bar_baz'>
        >().toEqualTypeOf<'foo-bar-baz'>();
      });
    });

    describe('SnakeToPascal', () => {
      it('converts single word snake to pascal', () => {
        expectTypeOf<SnakeToPascal<'hello'>>().toEqualTypeOf<'Hello'>();
      });

      it('converts multi-word snake to pascal', () => {
        expectTypeOf<
          SnakeToPascal<'hello_world'>
        >().toEqualTypeOf<'HelloWorld'>();
      });

      it('converts three-word snake to pascal', () => {
        expectTypeOf<
          SnakeToPascal<'foo_bar_baz'>
        >().toEqualTypeOf<'FooBarBaz'>();
      });
    });

    describe('SnakeToTitle', () => {
      it('converts single word snake to title', () => {
        expectTypeOf<SnakeToTitle<'hello'>>().toEqualTypeOf<'Hello'>();
      });

      it('converts multi-word snake to title', () => {
        expectTypeOf<
          SnakeToTitle<'hello_world'>
        >().toEqualTypeOf<'Hello World'>();
      });

      it('converts three-word snake to title', () => {
        expectTypeOf<
          SnakeToTitle<'foo_bar_baz'>
        >().toEqualTypeOf<'Foo Bar Baz'>();
      });
    });
  });

  describe('TitleTo conversions', () => {
    describe('TitleToCamel', () => {
      it('converts single word title to camel', () => {
        expectTypeOf<TitleToCamel<'Hello'>>().toEqualTypeOf<'hello'>();
      });

      it('converts multi-word title to camel', () => {
        expectTypeOf<
          TitleToCamel<'Hello World'>
        >().toEqualTypeOf<'helloWorld'>();
      });

      it('converts three-word title to camel', () => {
        expectTypeOf<
          TitleToCamel<'Foo Bar Baz'>
        >().toEqualTypeOf<'fooBarBaz'>();
      });
    });

    describe('TitleToKebab', () => {
      it('converts single word title to kebab', () => {
        expectTypeOf<TitleToKebab<'Hello'>>().toEqualTypeOf<'hello'>();
      });

      it('converts multi-word title to kebab', () => {
        expectTypeOf<
          TitleToKebab<'Hello World'>
        >().toEqualTypeOf<'hello-world'>();
      });

      it('converts three-word title to kebab', () => {
        expectTypeOf<
          TitleToKebab<'Foo Bar Baz'>
        >().toEqualTypeOf<'foo-bar-baz'>();
      });
    });

    describe('TitleToPascal', () => {
      it('converts single word title to pascal', () => {
        expectTypeOf<TitleToPascal<'Hello'>>().toEqualTypeOf<'Hello'>();
      });

      it('converts multi-word title to pascal', () => {
        expectTypeOf<
          TitleToPascal<'Hello World'>
        >().toEqualTypeOf<'HelloWorld'>();
      });

      it('converts three-word title to pascal', () => {
        expectTypeOf<
          TitleToPascal<'Foo Bar Baz'>
        >().toEqualTypeOf<'FooBarBaz'>();
      });
    });

    describe('TitleToSnake', () => {
      it('converts single word title to snake', () => {
        expectTypeOf<TitleToSnake<'Hello'>>().toEqualTypeOf<'hello'>();
      });

      it('converts multi-word title to snake', () => {
        expectTypeOf<
          TitleToSnake<'Hello World'>
        >().toEqualTypeOf<'hello_world'>();
      });

      it('converts three-word title to snake', () => {
        expectTypeOf<
          TitleToSnake<'Foo Bar Baz'>
        >().toEqualTypeOf<'foo_bar_baz'>();
      });
    });
  });

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

    it('converts kebab to title and back', () => {
      type Original = 'hello-world';
      type Converted = TitleToKebab<KebabToTitle<Original>>;
      expectTypeOf<Converted>().toEqualTypeOf<Original>();
    });
  });
});
