import { describe, it, expect } from 'vitest';
import { packages } from './packages.js';

const ENTRY = {
  name: '@scope/pkg-a',
  description: 'Package A',
  url: './packages/pkg-a',
  badges: { version: '1.0.0', lastUpdate: '2024-01', downloads: '1k' }
};

describe('(sections) packages', () => {
  it('renders section heading', () => {
    const result = packages({ packages: [ENTRY] });
    expect(result).toContain('## 📦 Packages');
  });

  it('renders table headers', () => {
    const result = packages({ packages: [ENTRY] });
    expect(result).toContain('Package');
    expect(result).toContain('Status');
    expect(result).toContain('Description');
  });

  it('renders package name as a link', () => {
    const result = packages({ packages: [ENTRY] });
    expect(result).toContain('[@scope/pkg-a](./packages/pkg-a)');
  });

  it('renders package description', () => {
    const result = packages({ packages: [ENTRY] });
    expect(result).toContain('Package A');
  });

  it('renders badge strings in status column', () => {
    const result = packages({ packages: [ENTRY] });
    expect(result).toContain('1.0.0');
    expect(result).toContain('2024-01');
    expect(result).toContain('1k');
  });

  it('renders multiple packages', () => {
    const result = packages({
      packages: [
        ENTRY,
        {
          name: '@scope/pkg-b',
          description: 'Package B',
          url: './packages/pkg-b',
          badges: { version: '2.0.0', lastUpdate: '2024-02', downloads: '2k' }
        }
      ]
    });
    expect(result).toContain('@scope/pkg-a');
    expect(result).toContain('@scope/pkg-b');
  });

  it('includes separator when specified', () => {
    const result = packages({ packages: [ENTRY], separator: true });
    expect(result).toContain('---');
  });

  it('supports custom heading', () => {
    const result = packages({ packages: [ENTRY], heading: { content: 'Modules', size: 3 } });
    expect(result).toContain('### Modules');
  });
});
