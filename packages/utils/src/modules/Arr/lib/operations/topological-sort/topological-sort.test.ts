import { describe, it, expect } from 'vitest';
import { topoSort, type TopoSortOptions } from './topological-sort.ts';

interface Node {
  id: string;
  deps: string[];
}

const opts: TopoSortOptions<Node> = { getId: (n) => n.id, getDeps: (n) => n.deps };

const ids = (nodes: Node[]) => nodes.map((n) => n.id);

describe('topoSort', () => {
  it('returns empty array for empty input', () => {
    expect(topoSort([], opts)).toEqual([]);
  });

  it('returns single item unchanged', () => {
    const items = [{ id: 'a', deps: [] }];
    expect(ids(topoSort(items, opts))).toEqual(['a']);
  });

  it('places dependency before dependent', () => {
    const items = [
      { id: 'b', deps: ['a'] },
      { id: 'a', deps: [] }
    ];
    const result = ids(topoSort(items, opts));
    expect(result.indexOf('a')).toBeLessThan(result.indexOf('b'));
  });

  it('handles a linear chain', () => {
    const items = [
      { id: 'c', deps: ['b'] },
      { id: 'a', deps: [] },
      { id: 'b', deps: ['a'] }
    ];
    expect(ids(topoSort(items, opts))).toEqual(['a', 'b', 'c']);
  });

  it('handles diamond dependency', () => {
    const items = [
      { id: 'd', deps: ['b', 'c'] },
      { id: 'b', deps: ['a'] },
      { id: 'c', deps: ['a'] },
      { id: 'a', deps: [] }
    ];
    const result = ids(topoSort(items, opts));
    expect(result.indexOf('a')).toBeLessThan(result.indexOf('b'));
    expect(result.indexOf('a')).toBeLessThan(result.indexOf('c'));
    expect(result.indexOf('b')).toBeLessThan(result.indexOf('d'));
    expect(result.indexOf('c')).toBeLessThan(result.indexOf('d'));
  });

  it('does not duplicate shared dependencies', () => {
    const items = [
      { id: 'b', deps: ['a'] },
      { id: 'c', deps: ['a'] },
      { id: 'a', deps: [] }
    ];
    const result = ids(topoSort(items, opts));
    expect(result.filter((id) => id === 'a')).toHaveLength(1);
  });

  it('handles multiple independent roots', () => {
    const items = [
      { id: 'a', deps: [] },
      { id: 'b', deps: [] },
      { id: 'c', deps: [] }
    ];
    expect(ids(topoSort(items, opts))).toEqual(['a', 'b', 'c']);
  });

  it('throws on circular dependency', () => {
    const items = [
      { id: 'a', deps: ['b'] },
      { id: 'b', deps: ['a'] }
    ];
    expect(() => topoSort(items, opts)).toThrow('Circular dependency detected: a');
  });

  it('throws on self-referential dependency', () => {
    const items = [{ id: 'a', deps: ['a'] }];
    expect(() => topoSort(items, opts)).toThrow('Circular dependency detected: a');
  });

  it('throws when strict and dep is missing from input', () => {
    const items = [{ id: 'a', deps: ['missing'] }];
    expect(() => topoSort(items, opts)).toThrow(
      'a depends on missing which is not in the input set.'
    );
  });

  it('skips missing deps when strict is false', () => {
    const items = [{ id: 'a', deps: ['external'] }];
    expect(ids(topoSort(items, { ...opts, strict: false }))).toEqual(['a']);
  });

  it('strict defaults to true', () => {
    const items = [{ id: 'a', deps: ['missing'] }];
    expect(() => topoSort(items, { getId: opts.getId, getDeps: opts.getDeps })).toThrow();
  });

  it('allowCircular defaults to false', () => {
    const items = [
      { id: 'a', deps: ['b'] },
      { id: 'b', deps: ['a'] }
    ];
    expect(() => topoSort(items, { getId: opts.getId, getDeps: opts.getDeps })).toThrow();
  });

  it('preserves reference equality of returned items', () => {
    const a = { id: 'a', deps: [] };
    const b = { id: 'b', deps: ['a'] };
    const result = topoSort([b, a], opts);
    expect(result[0]).toBe(a);
    expect(result[1]).toBe(b);
  });
  it('returns items in correct order for complex graph', () => {
    const items = [
      { id: 'a', deps: ['b', 'd'] },
      { id: 'b', deps: ['d'] },
      { id: 'c', deps: ['b'] },
      { id: 'd', deps: ['e'] },
      { id: 'e', deps: ['f'] },
      { id: 'f', deps: [] }
    ];
    const result = ids(topoSort(items, opts));
    expect(result).toEqual(['f', 'e', 'd', 'b', 'a', 'c']);
  });
});
