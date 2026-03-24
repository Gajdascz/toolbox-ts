import { describe, expect, it } from 'vitest';
import { license } from './license.ts';

describe('(sections) license', () => {
  it('should omit owner if not provided', () => {
    const result = license({ spdx: 'ISC', year: 2022 });
    expect(result).toContain('ISC - Copyright &copy; 2022');
    expect(result).not.toContain('[');
  });
  it('should use default year (current) if not provided', () => {
    const currentYear = new Date().getFullYear();
    const result = license({ spdx: 'BSD', owner: { content: 'Corp', url: 'https://corp.com' } });
    expect(result).toContain(`BSD - Copyright &copy; ${currentYear} [Corp](https://corp.com)`);
  });
  it('should include and format urls', () => {
    const result = license({
      spdx: 'Apache-2.0',
      year: 2023,
      owner: { content: 'Dev', url: 'https://dev.com' },
      urls: [
        { content: 'Repo', url: '' },
        { content: 'Website', url: 'https://dev.com' }
      ]
    });
    expect(result).toContain('Apache-2.0 - Copyright &copy; 2023 [Dev](https://dev.com)');
    expect(result).toContain('[Repo]() | [Website](https://dev.com)');
  });
  it('should omit urls if not provided', () => {
    const result = license({
      spdx: 'GPL',
      year: 2021,
      owner: { content: 'Foundation', url: 'https://fsf.org' }
    });
    expect(result).toContain('GPL - Copyright &copy; 2021 [Foundation](https://fsf.org)');
    expect(result).not.toContain('|');
  });
  it('should use custom heading', () => {
    const result = license({
      spdx: 'MIT',
      year: 2020,
      heading: { content: 'Custom License', size: 3 }
    });
    expect(result).toContain('### Custom License');
  });
  it('should link to file when linkToFile is provided', () => {
    const result = license({ spdx: 'MIT', year: 2020, linkToLicenseFile: './LICENSE' });
    expect(result).toContain('[MIT](./LICENSE) - Copyright &copy; 2020');
  });
});
