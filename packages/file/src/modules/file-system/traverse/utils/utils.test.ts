import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { defaultResultHandler, normalizeStartEnd, toParent } from './utils.ts';

describe('defaultResultHandler', () => {
  it('adds single result to current results array', () => {
    const curr: number[] = [];
    defaultResultHandler(1, curr);
    expect(curr).toEqual([1]);
  });
  it('adds multiple results to current results array', () => {
    const curr: number[] = [];
    defaultResultHandler([1, 2, 3], curr);
    expect(curr).toEqual([1, 2, 3]);
  });
});
describe('toParent', () => {
  it('returns the parent directory', () => {
    expect(toParent('/a/b/c')).toBe('/a/b');
  });
  it('returns null if at root', () => {
    expect(toParent('/')).toBeNull();
  });
  it('returns null if at end directory', () => {
    expect(toParent('/a/b/c', '/a/b/c')).toBeNull();
  });
});
describe('normalizeStartEnd', () => {
  it('resolves start and end directories', () => {
    const { start, end } = normalizeStartEnd('./src', '../');
    expect(start).toBe(path.resolve('./src'));
    expect(end).toBe(path.resolve('../'));
  });
  it('sets end to null if not provided', () => {
    const { start, end } = normalizeStartEnd('./src');
    expect(start).toBe(path.resolve('./src'));
    expect(end).toBeNull();
  });
});
