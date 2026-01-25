import { describe, expect, it } from 'vitest';

import { copyright, getTemplate, LICENSE_FILE } from './license.ts';

describe('license template', () => {
  it('copyright includes author, url when provided, and year', () => {
    const withUrl = copyright({
      authorName: 'Alice',
      authorUrl: 'https://alice.example',
      year: 2020
    });

    expect(withUrl).toContain('Copyright (c)');
    expect(withUrl).toContain('Alice');
    expect(withUrl).toContain('https://alice.example');
    expect(withUrl).toContain('2020');

    const withoutYear = copyright({ authorName: 'Bob' });
    expect(withoutYear).toContain('Bob');
    expect(withoutYear).toContain(String(new Date().getFullYear()));
  });

  it('license builds markdown containing title, spdx, body and copyright', () => {
    const mit = getTemplate('MIT', {
      authorName: 'Alice',
      authorUrl: 'https://a'
    });
    expect(mit).toContain('MIT License');
    expect(mit).toContain('MIT');
    expect(mit).toContain('Permission is hereby granted');
    expect(mit).toContain('Alice');

    const apache = getTemplate('APACHE_2_0', { authorName: 'Bob' });
    expect(apache).toContain('Apache License 2.0');
    expect(apache).toContain('Apache-2.0');
    expect(apache).toContain('TERMS AND CONDITIONS');
    expect(apache).toContain('Bob');
  });

  it('exports LICENSE_FILE constant', () => {
    expect(LICENSE_FILE).toContain('LICENSE');
  });
});
