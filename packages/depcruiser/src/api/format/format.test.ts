import { format as _format } from 'dependency-cruiser';
import { describe, expect, it, vi } from 'vitest';
// Mock dependency-cruiser and ghActions before importing the module
vi.mock('dependency-cruiser', () => ({
  format: vi.fn((_result, opts) => ({
    output: opts.outputType === 'custom' ? { foo: 'bar' } : 'formatted-output'
  }))
}));

vi.mock('./gh-actions/index.js', () => ({
  ghActions: {
    isOutputType: (type: string) =>
      type === 'gh-actions-json' || type === 'gh-actions-text',
    outputTypeFormatMap: {
      'gh-actions-json': vi.fn(() => '{"json":"output"}'),
      'gh-actions-text': vi.fn(() => 'text-output')
    }
  }
}));

import { format } from './format.ts';

describe('format', () => {
  const violations = [
    { rule: { name: 'r', severity: 'error' }, from: 'a', to: 'b' }
  ];
  const result = { summary: { violations } } as any;

  it('returns gh-actions-json output when outputType is gh-actions-json', async () => {
    const out = await format(result, { outputType: 'gh-actions-json' });
    expect(out).toBe('{"json":"output"}');
  });

  it('returns gh-actions-text output when outputType is gh-actions-text', async () => {
    const out = await format(result, { outputType: 'gh-actions-text' });
    expect(out).toBe('text-output');
  });

  it('calls dependency-cruiser format for non-gh-actions outputType and returns string output', async () => {
    const out = await format(result, { outputType: 'other' as any });
    expect(out).toBe('formatted-output');
  });

  it('calls dependency-cruiser format and stringifies non-string output', async () => {
    const out = await format(result, { outputType: 'custom' as any });
    expect(out).toBe(JSON.stringify({ foo: 'bar' }, null, 2));
  });

  it('uses default outputType=json when not provided', async () => {
    // Should call dependency-cruiser format with outputType 'json'
    const out = await format(result, {});
    expect(out).toBe('formatted-output');
  });

  it('passes additional options to dependency-cruiser format', async () => {
    const spy = vi.mocked(_format);
    await format(result, { outputType: 'other', someOpt: 123 } as any);
    expect(spy).toHaveBeenCalledWith(
      result,
      expect.objectContaining({ outputType: 'other', someOpt: 123 })
    );
  });
});
