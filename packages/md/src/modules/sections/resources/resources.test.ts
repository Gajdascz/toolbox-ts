import { describe, it, expect } from 'vitest';
import { resources } from './resources.js';

describe('(sections) resources', () => {
  it('renders section heading', () => {
    const result = resources({ links: [{ content: 'Docs', url: '/docs' }] });
    expect(result).toContain('## 📚 Resources');
  });

  it('renders each link as a list item', () => {
    const result = resources({
      links: [
        { content: 'Contributing', url: './CONTRIBUTING.md' },
        { content: 'Changelog', url: './CHANGELOG.md' }
      ]
    });
    expect(result).toContain('[Contributing](./CONTRIBUTING.md)');
    expect(result).toContain('[Changelog](./CHANGELOG.md)');
  });

  it('supports custom heading', () => {
    const result = resources({
      links: [{ content: 'x', url: '/' }],
      heading: { content: 'See Also', size: 3 }
    });
    expect(result).toContain('### See Also');
  });

  it('includes separator when specified', () => {
    const result = resources({ links: [{ content: 'x', url: '/' }], separator: true });
    expect(result).toContain('---');
  });

  it('omits separator by default', () => {
    const result = resources({ links: [{ content: 'x', url: '/' }] });
    expect(result).not.toContain('---');
  });
});
