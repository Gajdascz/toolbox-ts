import { describe, expect, it, vi } from 'vitest';

import { when } from './when.ts';

describe('when helper', () => {
  it('returns value when condition is truthy', () => {
    expect(when(true, { a: 1 })).toEqual({ a: 1 });
    expect(when('key' as const, (c) => ({ [c]: 1 }))).toEqual({ key: 1 });
  });

  it('returns fallback when condition is falsy', () => {
    expect(when(false, { a: 1 }, { b: 2 })).toEqual({ b: 2 });
    expect(when(0, 'value', 'fallback')).toBe('fallback');
    expect(when('', 'value')).toBeUndefined();
  });

  it('calls value function with condition when condition is truthy', () => {
    expect(when(true, () => ({ a: 'passed' }))).toEqual({ a: 'passed' });
    expect(when('true' as const, (c) => ({ a: c }))).toEqual({ a: 'true' });
  });

  it('does not call value function when condition is falsy', () => {
    const fn = vi.fn();
    expect(when(false, fn, { b: 2 })).toEqual({ b: 2 });
    expect(fn).not.toHaveBeenCalled();
  });
});
