import { describe, expect, expectTypeOf, it } from 'vitest';

import { camel, kebab, pascal, snake } from './cases.js';

const cc = {
  a: 'hello',
  b: 'helloWorld',
  c: 'helloWorldHowAreYouDoingToday',
  d: 'aAAAAA',
  e: 'hTTPSConnection',
  f: '',
  g: 'hello123World456',
  h: 'x'
} as const;
type CamelCaseMap = typeof cc;
const kc = {
  a: 'hello',
  b: 'hello-world',
  c: 'hello-world-how-are-you-doing-today',
  d: 'a-a-a-a-a-a',
  e: 'h-t-t-p-s-connection',
  f: '',
  g: 'hello123-world456',
  h: 'x'
} as const;
type KebabCaseMap = typeof kc;
const pc = {
  a: 'Hello',
  b: 'HelloWorld',
  c: 'HelloWorldHowAreYouDoingToday',
  d: 'AAAAAA',
  e: 'HTTPSConnection',
  f: '',
  g: 'Hello123World456',
  h: 'X'
} as const;
type PascalCaseMap = typeof pc;
const sc = {
  a: 'hello',
  b: 'hello_world',
  c: 'hello_world_how_are_you_doing_today',
  d: 'a_a_a_a_a_a',
  e: 'h_t_t_p_s_connection',
  f: '',
  g: 'hello123_world456',
  h: 'x'
} as const;
type SnakeCaseMap = typeof sc;

describe('Str Case Conversions', () => {
  describe('camelCase', () => {
    describe('camelCase => ToPascalCase', () => {
      it('handles single word', () => {
        expect(camel.toPascal(cc.a)).toBe(pc.a);
        expectTypeOf(camel.toPascal(cc.a)).toEqualTypeOf<PascalCaseMap['a']>();
      });
      it('handles short string', () => {
        expect(camel.toPascal(cc.b)).toBe(pc.b);
        expectTypeOf(camel.toPascal(cc.b)).toEqualTypeOf<PascalCaseMap['b']>();
      });
      it('handles long string', () => {
        expect(camel.toPascal(cc.c)).toBe(pc.c);
        expectTypeOf(camel.toPascal(cc.c)).toEqualTypeOf<PascalCaseMap['c']>();
      });
      it('handles consecutive uppercase letters', () => {
        expect(camel.toPascal(cc.d)).toBe(pc.d);
        expectTypeOf(camel.toPascal(cc.d)).toEqualTypeOf<PascalCaseMap['d']>();
        expect(camel.toPascal(cc.e)).toBe(pc.e);
        expectTypeOf(camel.toPascal(cc.e)).toEqualTypeOf<PascalCaseMap['e']>();
      });
      it('handles empty string', () => {
        expect(camel.toPascal(cc.f)).toBe(pc.f);
        expectTypeOf(camel.toPascal(cc.f)).toEqualTypeOf<PascalCaseMap['f']>();
      });
      it('handles string with numbers', () => {
        expect(camel.toPascal(cc.g)).toBe(pc.g);
        expectTypeOf(camel.toPascal(cc.g)).toEqualTypeOf<PascalCaseMap['g']>();
      });
      it('handles single character string', () => {
        expect(camel.toPascal(cc.h)).toBe(pc.h);
        expectTypeOf(camel.toPascal(cc.h)).toEqualTypeOf<PascalCaseMap['h']>();
      });
    });
    describe('camelCase => kebab-case', () => {
      it('handles single word', () => {
        expect(camel.toKebab(cc.a)).toBe(kc.a);
        expectTypeOf(camel.toKebab(cc.a)).toEqualTypeOf<KebabCaseMap['a']>();
      });
      it('handles short string', () => {
        expect(camel.toKebab(cc.b)).toBe(kc.b);
        expectTypeOf(camel.toKebab(cc.b)).toEqualTypeOf<KebabCaseMap['b']>();
      });
      it('handles long string', () => {
        expect(camel.toKebab(cc.c)).toBe(kc.c);
        expectTypeOf(camel.toKebab(cc.c)).toEqualTypeOf<KebabCaseMap['c']>();
      });
      it('handles consecutive uppercase letters', () => {
        expect(camel.toKebab(cc.d)).toBe(kc.d);
        expectTypeOf(camel.toKebab(cc.d)).toEqualTypeOf<KebabCaseMap['d']>();
        expect(camel.toKebab(cc.e)).toBe(kc.e);
        expectTypeOf(camel.toKebab(cc.e)).toEqualTypeOf<KebabCaseMap['e']>();
      });
      it('handles empty string', () => {
        expect(camel.toKebab(cc.f)).toBe(kc.f);
        expectTypeOf(camel.toKebab(cc.f)).toEqualTypeOf<KebabCaseMap['f']>();
      });
      it('handles string with numbers', () => {
        expect(camel.toKebab(cc.g)).toBe(kc.g);
        expectTypeOf(camel.toKebab(cc.g)).toEqualTypeOf<KebabCaseMap['g']>();
      });
      it('handles single character string', () => {
        expect(camel.toKebab(cc.h)).toBe(kc.h);
        expectTypeOf(camel.toKebab(cc.h)).toEqualTypeOf<KebabCaseMap['h']>();
      });
    });
    describe('camelCase => to-snake-case', () => {
      it('handles single word', () => {
        expect(camel.toSnake(cc.a)).toBe(sc.a);
        expectTypeOf(camel.toSnake(cc.a)).toEqualTypeOf<SnakeCaseMap['a']>();
      });
      it('handles short string', () => {
        expect(camel.toSnake(cc.b)).toBe(sc.b);
        expectTypeOf(camel.toSnake(cc.b)).toEqualTypeOf<SnakeCaseMap['b']>();
      });
      it('handles long string', () => {
        expect(camel.toSnake(cc.c)).toBe(sc.c);
        expectTypeOf(camel.toSnake(cc.c)).toEqualTypeOf<SnakeCaseMap['c']>();
      });
      it('handles consecutive uppercase letters', () => {
        expect(camel.toSnake(cc.d)).toBe(sc.d);
        expectTypeOf(camel.toSnake(cc.d)).toEqualTypeOf<SnakeCaseMap['d']>();
        expect(camel.toSnake(cc.e)).toBe(sc.e);
        expectTypeOf(camel.toSnake(cc.e)).toEqualTypeOf<SnakeCaseMap['e']>();
      });
      it('handles empty string', () => {
        expect(camel.toSnake(cc.f)).toBe(sc.f);
        expectTypeOf(camel.toSnake(cc.f)).toEqualTypeOf<SnakeCaseMap['f']>();
      });
      it('handles string with numbers', () => {
        expect(camel.toSnake(cc.g)).toBe(sc.g);
        expectTypeOf(camel.toSnake(cc.g)).toEqualTypeOf<SnakeCaseMap['g']>();
      });
      it('handles single character string', () => {
        expect(camel.toSnake(cc.h)).toBe(sc.h);
        expectTypeOf(camel.toSnake(cc.h)).toEqualTypeOf<SnakeCaseMap['h']>();
      });
    });
  });
  describe('PascalCase', () => {
    describe('PascalCase => camelCase', () => {
      it('handles single word', () => {
        expect(pascal.toCamel(pc.a)).toBe(cc.a);
        expectTypeOf(pascal.toCamel(pc.a)).toEqualTypeOf<CamelCaseMap['a']>();
      });
      it('handles short string', () => {
        expect(pascal.toCamel(pc.b)).toBe(cc.b);
        expectTypeOf(pascal.toCamel(pc.b)).toEqualTypeOf<CamelCaseMap['b']>();
      });
      it('handles long string', () => {
        expect(pascal.toCamel(pc.c)).toBe(cc.c);
        expectTypeOf(pascal.toCamel(pc.c)).toEqualTypeOf<CamelCaseMap['c']>();
      });
      it('handles consecutive uppercase letters', () => {
        expect(pascal.toCamel(pc.d)).toBe(cc.d);
        expectTypeOf(pascal.toCamel(pc.d)).toEqualTypeOf<CamelCaseMap['d']>();
        expect(pascal.toCamel(pc.e)).toBe(cc.e);
        expectTypeOf(pascal.toCamel(pc.e)).toEqualTypeOf<CamelCaseMap['e']>();
      });
      it('handles empty string', () => {
        expect(pascal.toCamel(pc.f)).toBe(cc.f);
        expectTypeOf(pascal.toCamel(pc.f)).toEqualTypeOf<CamelCaseMap['f']>();
      });
      it('handles string with numbers', () => {
        expect(pascal.toCamel(pc.g)).toBe(cc.g);
        expectTypeOf(pascal.toCamel(pc.g)).toEqualTypeOf<CamelCaseMap['g']>();
      });
      it('handles single character string', () => {
        expect(pascal.toCamel(pc.h)).toBe(cc.h);
        expectTypeOf(pascal.toCamel(pc.h)).toEqualTypeOf<CamelCaseMap['h']>();
      });
    });
    describe('PascalCase => kebab-case', () => {
      it('handles single word', () => {
        expect(pascal.toKebab(pc.a)).toBe(kc.a);
        expectTypeOf(pascal.toKebab(pc.a)).toEqualTypeOf<KebabCaseMap['a']>();
      });
      it('handles short string', () => {
        expect(pascal.toKebab(pc.b)).toBe(kc.b);
        expectTypeOf(pascal.toKebab(pc.b)).toEqualTypeOf<KebabCaseMap['b']>();
      });
      it('handles long string', () => {
        expect(pascal.toKebab(pc.c)).toBe(kc.c);
        expectTypeOf(pascal.toKebab(pc.c)).toEqualTypeOf<KebabCaseMap['c']>();
      });
      it('handles consecutive uppercase letters', () => {
        expect(pascal.toKebab(pc.d)).toBe(kc.d);
        expectTypeOf(pascal.toKebab(pc.d)).toEqualTypeOf<KebabCaseMap['d']>();
        expect(pascal.toKebab(pc.e)).toBe(kc.e);
        expectTypeOf(pascal.toKebab(pc.e)).toEqualTypeOf<KebabCaseMap['e']>();
      });
      it('handles empty string', () => {
        expect(pascal.toKebab(pc.f)).toBe(kc.f);
        expectTypeOf(pascal.toKebab(pc.f)).toEqualTypeOf<KebabCaseMap['f']>();
      });
      it('handles string with numbers', () => {
        expect(pascal.toKebab(pc.g)).toBe(kc.g);
        expectTypeOf(pascal.toKebab(pc.g)).toEqualTypeOf<KebabCaseMap['g']>();
      });
      it('handles single character string', () => {
        expect(pascal.toKebab(pc.h)).toBe(kc.h);
        expectTypeOf(pascal.toKebab(pc.h)).toEqualTypeOf<KebabCaseMap['h']>();
      });
    });
    describe('PascalCase => snake_case', () => {
      it('handles single word', () => {
        expect(pascal.toSnake(pc.a)).toBe(sc.a);
        expectTypeOf(pascal.toSnake(pc.a)).toEqualTypeOf<SnakeCaseMap['a']>();
      });
      it('handles short string', () => {
        expect(pascal.toSnake(pc.b)).toBe(sc.b);
        expectTypeOf(pascal.toSnake(pc.b)).toEqualTypeOf<SnakeCaseMap['b']>();
      });
      it('handles long string', () => {
        expect(pascal.toSnake(pc.c)).toBe(sc.c);
        expectTypeOf(pascal.toSnake(pc.c)).toEqualTypeOf<SnakeCaseMap['c']>();
      });
      it('handles consecutive uppercase letters', () => {
        expect(pascal.toSnake(pc.d)).toBe(sc.d);
        expectTypeOf(pascal.toSnake(pc.d)).toEqualTypeOf<SnakeCaseMap['d']>();
        expect(pascal.toSnake(pc.e)).toBe(sc.e);
        expectTypeOf(pascal.toSnake(pc.e)).toEqualTypeOf<SnakeCaseMap['e']>();
      });
      it('handles empty string', () => {
        expect(pascal.toSnake(pc.f)).toBe(sc.f);
        expectTypeOf(pascal.toSnake(pc.f)).toEqualTypeOf<SnakeCaseMap['f']>();
      });
      it('handles string with numbers', () => {
        expect(pascal.toSnake(pc.g)).toBe(sc.g);
        expectTypeOf(pascal.toSnake(pc.g)).toEqualTypeOf<SnakeCaseMap['g']>();
      });
      it('handles single character string', () => {
        expect(pascal.toSnake(pc.h)).toBe(sc.h);
        expectTypeOf(pascal.toSnake(pc.h)).toEqualTypeOf<SnakeCaseMap['h']>();
      });
    });
  });
  describe('kebab-case', () => {
    describe('kebab-case => camelCase', () => {
      it('handles single word', () => {
        expect(kebab.toCamel(kc.a)).toBe(cc.a);
        expectTypeOf(kebab.toCamel(kc.a)).toEqualTypeOf<CamelCaseMap['a']>();
      });
      it('handles short string', () => {
        expect(kebab.toCamel(kc.b)).toBe(cc.b);
        expectTypeOf(kebab.toCamel(kc.b)).toEqualTypeOf<CamelCaseMap['b']>();
      });
      it('handles long string', () => {
        expect(kebab.toCamel(kc.c)).toBe(cc.c);
        expectTypeOf(kebab.toCamel(kc.c)).toEqualTypeOf<CamelCaseMap['c']>();
      });
      it('handles consecutive uppercase letters', () => {
        expect(kebab.toCamel(kc.d)).toBe(cc.d);
        expectTypeOf(kebab.toCamel(kc.d)).toEqualTypeOf<CamelCaseMap['d']>();
        expect(kebab.toCamel(kc.e)).toBe(cc.e);
        expectTypeOf(kebab.toCamel(kc.e)).toEqualTypeOf<CamelCaseMap['e']>();
      });
      it('handles empty string', () => {
        expect(kebab.toCamel(kc.f)).toBe(cc.f);
        expectTypeOf(kebab.toCamel(kc.f)).toEqualTypeOf<CamelCaseMap['f']>();
      });
      it('handles string with numbers', () => {
        expect(kebab.toCamel(kc.g)).toBe(cc.g);
        expectTypeOf(kebab.toCamel(kc.g)).toEqualTypeOf<CamelCaseMap['g']>();
      });
      it('handles single character string', () => {
        expect(kebab.toCamel(kc.h)).toBe(cc.h);
        expectTypeOf(kebab.toCamel(kc.h)).toEqualTypeOf<CamelCaseMap['h']>();
      });
    });
    describe('kebab-case => PascalCase', () => {
      it('handles single word', () => {
        expect(kebab.toPascal(kc.a)).toBe(pc.a);
        expectTypeOf(kebab.toPascal(kc.a)).toEqualTypeOf<PascalCaseMap['a']>();
      });
      it('handles short string', () => {
        expect(kebab.toPascal(kc.b)).toBe(pc.b);
        expectTypeOf(kebab.toPascal(kc.b)).toEqualTypeOf<PascalCaseMap['b']>();
      });
      it('handles long string', () => {
        expect(kebab.toPascal(kc.c)).toBe(pc.c);
        expectTypeOf(kebab.toPascal(kc.c)).toEqualTypeOf<PascalCaseMap['c']>();
      });
      it('handles consecutive uppercase letters', () => {
        expect(kebab.toPascal(kc.d)).toBe(pc.d);
        expectTypeOf(kebab.toPascal(kc.d)).toEqualTypeOf<PascalCaseMap['d']>();
        expect(kebab.toPascal(kc.e)).toBe(pc.e);
        expectTypeOf(kebab.toPascal(kc.e)).toEqualTypeOf<PascalCaseMap['e']>();
      });
      it('handles empty string', () => {
        expect(kebab.toPascal(kc.f)).toBe(pc.f);
        expectTypeOf(kebab.toPascal(kc.f)).toEqualTypeOf<PascalCaseMap['f']>();
      });
      it('handles string with numbers', () => {
        expect(kebab.toPascal(kc.g)).toBe(pc.g);
        expectTypeOf(kebab.toPascal(kc.g)).toEqualTypeOf<PascalCaseMap['g']>();
      });
      it('handles single character string', () => {
        expect(kebab.toPascal(kc.h)).toBe(pc.h);
        expectTypeOf(kebab.toPascal(kc.h)).toEqualTypeOf<PascalCaseMap['h']>();
      });
    });
    describe('kebab-case => snake_case', () => {
      it('handles single word', () => {
        expect(kebab.toSnake(kc.a)).toBe(sc.a);
        expectTypeOf(kebab.toSnake(kc.a)).toEqualTypeOf<SnakeCaseMap['a']>();
      });
      it('handles short string', () => {
        expect(kebab.toSnake(kc.b)).toBe(sc.b);
        expectTypeOf(kebab.toSnake(kc.b)).toEqualTypeOf<SnakeCaseMap['b']>();
      });
      it('handles long string', () => {
        expect(kebab.toSnake(kc.c)).toBe(sc.c);
        expectTypeOf(kebab.toSnake(kc.c)).toEqualTypeOf<SnakeCaseMap['c']>();
      });
      it('handles consecutive uppercase letters', () => {
        expect(kebab.toSnake(kc.d)).toBe(sc.d);
        expectTypeOf(kebab.toSnake(kc.d)).toEqualTypeOf<SnakeCaseMap['d']>();
        expect(kebab.toSnake(kc.e)).toBe(sc.e);
        expectTypeOf(kebab.toSnake(kc.e)).toEqualTypeOf<SnakeCaseMap['e']>();
      });
      it('handles empty string', () => {
        expect(kebab.toSnake(kc.f)).toBe(sc.f);
        expectTypeOf(kebab.toSnake(kc.f)).toEqualTypeOf<SnakeCaseMap['f']>();
      });
      it('handles string with numbers', () => {
        expect(kebab.toSnake(kc.g)).toBe(sc.g);
        expectTypeOf(kebab.toSnake(kc.g)).toEqualTypeOf<SnakeCaseMap['g']>();
      });
      it('handles single character string', () => {
        expect(kebab.toSnake(kc.h)).toBe(sc.h);
        expectTypeOf(kebab.toSnake(kc.h)).toEqualTypeOf<SnakeCaseMap['h']>();
      });
    });
  });
  describe('snake_case', () => {
    describe('snake_case => PascalCase', () => {
      it('handles single word', () => {
        expect(snake.toPascal(sc.a)).toBe(pc.a);
        expectTypeOf(snake.toPascal(sc.a)).toEqualTypeOf<PascalCaseMap['a']>();
      });
      it('handles short string', () => {
        expect(snake.toPascal(sc.b)).toBe(pc.b);
        expectTypeOf(snake.toPascal(sc.b)).toEqualTypeOf<PascalCaseMap['b']>();
      });
      it('handles long string', () => {
        expect(snake.toPascal(sc.c)).toBe(pc.c);
        expectTypeOf(snake.toPascal(sc.c)).toEqualTypeOf<PascalCaseMap['c']>();
      });
      it('handles consecutive uppercase letters', () => {
        expect(snake.toPascal(sc.d)).toBe(pc.d);
        expectTypeOf(snake.toPascal(sc.d)).toEqualTypeOf<PascalCaseMap['d']>();
        expect(snake.toPascal(sc.e)).toBe(pc.e);
        expectTypeOf(snake.toPascal(sc.e)).toEqualTypeOf<PascalCaseMap['e']>();
      });
      it('handles empty string', () => {
        expect(snake.toPascal(sc.f)).toBe(pc.f);
        expectTypeOf(snake.toPascal(sc.f)).toEqualTypeOf<PascalCaseMap['f']>();
      });
      it('handles string with numbers', () => {
        expect(snake.toPascal(sc.g)).toBe(pc.g);
        expectTypeOf(snake.toPascal(sc.g)).toEqualTypeOf<PascalCaseMap['g']>();
      });
      it('handles single character string', () => {
        expect(snake.toPascal(sc.h)).toBe(pc.h);
        expectTypeOf(snake.toPascal(sc.h)).toEqualTypeOf<PascalCaseMap['h']>();
      });
    });
    describe('snake_case => camelCase', () => {
      it('handles single word', () => {
        expect(snake.toCamel(sc.a)).toBe(cc.a);
        expectTypeOf(snake.toCamel(sc.a)).toEqualTypeOf<CamelCaseMap['a']>();
      });
      it('handles short string', () => {
        expect(snake.toCamel(sc.b)).toBe(cc.b);
        expectTypeOf(snake.toCamel(sc.b)).toEqualTypeOf<CamelCaseMap['b']>();
      });
      it('handles long string', () => {
        expect(snake.toCamel(sc.c)).toBe(cc.c);
        expectTypeOf(snake.toCamel(sc.c)).toEqualTypeOf<CamelCaseMap['c']>();
      });
      it('handles consecutive uppercase letters', () => {
        expect(snake.toCamel(sc.d)).toBe(cc.d);
        expectTypeOf(snake.toCamel(sc.d)).toEqualTypeOf<CamelCaseMap['d']>();
        expect(snake.toCamel(sc.e)).toBe(cc.e);
        expectTypeOf(snake.toCamel(sc.e)).toEqualTypeOf<CamelCaseMap['e']>();
      });
      it('handles empty string', () => {
        expect(snake.toCamel(sc.f)).toBe(cc.f);
        expectTypeOf(snake.toCamel(sc.f)).toEqualTypeOf<CamelCaseMap['f']>();
      });
      it('handles string with numbers', () => {
        expect(snake.toCamel(sc.g)).toBe(cc.g);
        expectTypeOf(snake.toCamel(sc.g)).toEqualTypeOf<CamelCaseMap['g']>();
      });
      it('handles single character string', () => {
        expect(snake.toCamel(sc.h)).toBe(cc.h);
        expectTypeOf(snake.toCamel(sc.h)).toEqualTypeOf<CamelCaseMap['h']>();
      });
    });
    describe('snake_case => kebab-case', () => {
      it('handles single word', () => {
        expect(snake.toKebab(sc.a)).toBe(kc.a);
        expectTypeOf(snake.toKebab(sc.a)).toEqualTypeOf<KebabCaseMap['a']>();
      });
      it('handles short string', () => {
        expect(snake.toKebab(sc.b)).toBe(kc.b);
        expectTypeOf(snake.toKebab(sc.b)).toEqualTypeOf<KebabCaseMap['b']>();
      });
      it('handles long string', () => {
        expect(snake.toKebab(sc.c)).toBe(kc.c);
        expectTypeOf(snake.toKebab(sc.c)).toEqualTypeOf<KebabCaseMap['c']>();
      });
      it('handles consecutive uppercase letters', () => {
        expect(snake.toKebab(sc.d)).toBe(kc.d);
        expectTypeOf(snake.toKebab(sc.d)).toEqualTypeOf<KebabCaseMap['d']>();
        expect(snake.toKebab(sc.e)).toBe(kc.e);
        expectTypeOf(snake.toKebab(sc.e)).toEqualTypeOf<KebabCaseMap['e']>();
      });
      it('handles empty string', () => {
        expect(snake.toKebab(sc.f)).toBe(kc.f);
        expectTypeOf(snake.toKebab(sc.f)).toEqualTypeOf<KebabCaseMap['f']>();
      });
      it('handles string with numbers', () => {
        expect(snake.toKebab(sc.g)).toBe(kc.g);
        expectTypeOf(snake.toKebab(sc.g)).toEqualTypeOf<KebabCaseMap['g']>();
      });
      it('handles single character string', () => {
        expect(snake.toKebab(sc.h)).toBe(kc.h);
        expectTypeOf(snake.toKebab(sc.h)).toEqualTypeOf<KebabCaseMap['h']>();
      });
    });
  });

  describe('cross-conversion consistency', () => {
    it('maintains value through round-trip conversions', () => {
      // camel -> kebab -> camel
      const camelStr = 'helloWorld';
      expect(kebab.toCamel(camel.toKebab(camelStr))).toBe(camelStr);

      // pascal -> kebab -> pascal
      const pascalStr = 'HelloWorld';
      expect(kebab.toPascal(pascal.toKebab(pascalStr))).toBe(pascalStr);

      // kebab -> camel -> kebab
      const kebabStr = 'hello-world';
      expect(camel.toKebab(kebab.toCamel(kebabStr))).toBe(kebabStr);

      // snake -> kebab -> snake
      const snakeStr = 'hello_world';
      expect(kebab.toSnake(snake.toKebab(snakeStr))).toBe(snakeStr);
    });

    it('converts between all case formats correctly', () => {
      const testValue = 'my-test-value';

      // kebab -> camel -> pascal -> kebab
      expect(pascal.toKebab(camel.toPascal(kebab.toCamel(testValue)))).toBe(testValue);

      // kebab -> snake -> kebab
      expect(snake.toKebab(kebab.toSnake(testValue))).toBe(testValue);
    });
  });
});
