import { describe, expect, it, vi } from 'vitest';

import { mockFirstArgsMatch } from './helpers.ts';

describe('mockFirstArgsMatch', () => {
  it('returns true when first args of each call match expectations', () => {
    const m = vi.fn();
    m('a');
    m('b');
    expect(mockFirstArgsMatch(m, ['a', 'b'])).toBe(true);
  });

  it('returns false when any first arg mismatches', () => {
    const m = vi.fn();
    m('a');
    m('c');
    expect(mockFirstArgsMatch(m, ['a', 'b'])).toBe(false);
  });

  it('returns false when expected args are more than calls made', () => {
    const m = vi.fn();
    m('only');
    expect(mockFirstArgsMatch(m, ['only', 'missing'])).toBe(false);
  });

  it('handles deep-equality for objects and arrays', () => {
    const m = vi.fn();
    m({ x: 1, y: { z: [1, 2] } });
    m([1, 2, { a: 'x' }]);
    expect(
      mockFirstArgsMatch(m, [{ x: 1, y: { z: [1, 2] } }, [1, 2, { a: 'x' }]])
    ).toBe(true);
  });

  it('returns true for empty expected args array (vacuously true)', () => {
    const m = vi.fn();
    expect(mockFirstArgsMatch(m, [])).toBe(true);
  });
});
