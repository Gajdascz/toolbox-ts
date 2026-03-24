import { describe, it, expect } from 'vitest';
import { header } from './header.js';

describe('(sections) header', () => {
  it('renders h1 with heading', () => {
    const result = header({ heading: 'My Package' });
    expect(result).toContain('# My Package');
  });

  it('renders description', () => {
    const result = header({ heading: 'Pkg', description: 'A useful package.' });
    expect(result).toContain('A useful package.');
  });

  it('renders badges joined by spaces', () => {
    const result = header({ heading: 'Pkg', badges: ['![a](a)', '![b](b)'] });
    expect(result).toContain('![a](a) ![b](b)');
  });

  it('renders md hero image', () => {
    const result = header({
      heading: 'Pkg',
      hero: { type: 'md', url: 'https://example.com/img.png', opts: { description: 'hero' } }
    });
    expect(result).toContain('![hero](https://example.com/img.png)');
  });

  it('renders element hero image', () => {
    const result = header({
      heading: 'Pkg',
      hero: { type: 'element', url: 'https://example.com/img.png' }
    });
    expect(result).toContain('<img');
    expect(result).toContain('https://example.com/img.png');
  });

  it('renders nav with home link and entries', () => {
    const result = header({
      heading: 'Pkg',
      nav: { homeUrl: '/', homeLabel: 'Home', entries: [{ label: 'Docs', url: '/docs' }] }
    });
    expect(result).toContain('[Home](/)');
    expect(result).toContain('[Docs](/docs)');
    expect(result).toContain('[Home](/) | [Docs](/docs)');
  });

  it('uses default home label when not provided', () => {
    const result = header({ heading: 'Pkg', nav: { homeUrl: '/', entries: [] } });
    expect(result).toContain('[Home](/)');
  });

  it('omits separator by default', () => {
    const result = header({ heading: 'Pkg' });
    expect(result).not.toContain('---');
  });

  it('includes separator when specified', () => {
    const result = header({ heading: 'Pkg', separator: true });
    expect(result).toContain('---');
  });
});
