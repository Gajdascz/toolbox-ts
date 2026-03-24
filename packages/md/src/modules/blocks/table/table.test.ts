import { describe, it, expect } from 'vitest';
import { table } from './table.ts';

describe('(blocks) table', () => {
  it('normalizes column widths so that each row has same length', () => {
    const t = table(['h1', 'header2'], ['short', 'longercol'], ['r2c1', 'c2']);
    const rows = t.split('\n').filter(Boolean);
    expect(rows[0]).toBe('| h1    | header2   |');
    expect(rows[1]).toBe('|-------|-----------|');
    expect(rows[2]).toBe('| short | longercol |');
    expect(rows[3]).toBe('| r2c1  | c2        |');
  });
  it('handles empty cells and rows', () => {
    const t = table(['h1', 'h2'], ['r1c1', ''], ['', 'r2c2']);
    const rows = t.split('\n').filter(Boolean);
    expect(rows[0]).toBe('| h1   | h2   |');
    expect(rows[1]).toBe('|------|------|');
    expect(rows[2]).toBe('| r1c1 |      |');
    expect(rows[3]).toBe('|      | r2c2 |');
  });
});
