import type { IViolation } from 'dependency-cruiser';

import { describe, expect, it } from 'vitest';

import {
  isOutputType,
  noticeMap,
  outputTypeFormatMap,
  reporter,
  reporterAdapter
} from './gh-actions.ts';

describe('gh-actions reporter module', () => {
  it('reporterAdapter formats entries with comment and maps severity to notice type', () => {
    const v: IViolation = {
      rule: { name: 'no-circular', severity: 'warn' } as any,
      comment: 'custom comment',
      from: 'src/a.ts',
      to: 'src/b.ts'
    };

    const adapted = reporterAdapter(v);
    expect(adapted.title).toBe('no-circular (src/a.ts -> src/b.ts)');
    expect(adapted.message).toBe('[dependency] custom comment');
    expect(adapted.type).toBe('warning');
    expect(adapted.file).toBe('src/a.ts');
  });

  it('reporterAdapter falls back to rule.name when comment is absent and default type is used', () => {
    const v: IViolation = {
      rule: { name: 'some-rule', severity: 'info' } as any,
      from: 'pkg/x.ts',
      to: 'pkg/y.ts'
    } as any;

    const adapted = reporterAdapter(v);
    expect(adapted.message).toBe('[dependency] some-rule');
    expect(adapted.type).toBe('notice');
  });

  it('outputTypeFormatMap functions produce expected outputs (json & text) and isOutputType works', () => {
    const sampleViolations: IViolation[] = [
      {
        rule: { name: 'no-circular', severity: 'warn' } as any,
        comment: 'c1',
        from: 'src/a.ts',
        to: 'src/b.ts'
      } as any,
      {
        rule: { name: 'some-rule', severity: 'info' } as any,
        from: 'pkg/x.ts',
        to: 'pkg/y.ts'
      } as any
    ];

    const keys = Object.keys(outputTypeFormatMap);
    expect(keys.length).toBeGreaterThanOrEqual(1);
    // the type guard should accept a real key and reject a bogus one
    expect(isOutputType(keys[0])).toBe(true);
    expect(isOutputType('not-a-real-output-type')).toBe(false);

    for (const [key, fmt] of Object.entries(outputTypeFormatMap)) {
      const result = fmt(sampleViolations);
      expect(typeof result).toBe('string');
      expect(result).toContain('no-circular (src/a.ts -> src/b.ts)');
    }
  });

  it('reporter.toJson and reporter.stringify behave consistently with adapter', () => {
    const v: IViolation = {
      rule: { name: 'r', severity: 'error' } as any,
      comment: 'x',
      from: 'f',
      to: 't',
      type: 'dependency'
    } as any;

    const json = reporter.toJson([v]);
    const parsed = JSON.parse(json);
    expect(parsed).toEqual(expect.any(Object));
    const text = reporter.stringify([v]);
    expect(text).toContain('r (f -> t)');
  });
  it('prints no violations message when there are no violations', () => {
    const fmt = outputTypeFormatMap['gh-actions-text'];
    const text = fmt([]);
    expect(text).toContain('No violations');
  });
});
