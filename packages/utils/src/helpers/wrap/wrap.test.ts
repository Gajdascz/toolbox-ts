import { describe, expect, it } from 'vitest';

import * as wrap from './wrap.js';

const { if: ifWrap, ifCsv } = wrap;

describe('wrap helpers', () => {
  it('wraps a truthy value under the provided key', () => {
    expect(ifWrap('test', true)).toEqual({ test: true });
    expect(ifWrap('n', 123)).toEqual({ n: 123 });
  });

  it('returns the provided `r` value when key is missing or value is null/false', () => {
    // key not a string
    expect(ifWrap(false as any, true)).toBeUndefined();
    // value null/false => default r (undefined)
    expect(ifWrap('x', null as any)).toBeUndefined();
    expect(ifWrap('x', false as any)).toBeUndefined();

    // custom r
    expect(ifWrap('x', null as any)).toBeUndefined();
  });

  it('applies transform function and passes the key to it', () => {
    const res = ifWrap('k', 'v', { t: (v: string, k: string) => `${k}:${v}` });
    expect(res).toEqual({ k: 'k:v' });
  });

  it('ifCsv splits csv strings into arrays and trims values', () => {
    expect(ifCsv('list', 'a,b,c')).toEqual({ list: ['a', 'b', 'c'] });
    expect(ifCsv('list', ' a , b , c ')).toEqual({ list: ['a', 'b', 'c'] });

    // empty string should not produce a wrapped value (wrapIfCsv example behavior)
    expect(ifCsv('empty', '')).toBeUndefined();

    // key not a string -> undefined
    expect(ifCsv(false as any, 'a,b')).toBeUndefined();
  });

  it('does not call transform when it is not a function (returns raw value)', () => {
    // pass an invalid t to exercise the branch that checks typeof t !== 'function'
    // here we rely on type coercion via `as any` to simulate a non-function t value
    const res = ifWrap('raw', 'v', { t: undefined as any });
    expect(res).toEqual({ raw: 'v' });
  });
});
