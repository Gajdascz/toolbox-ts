import { describe, it, expect } from 'vitest';
import { installation } from './installation.js';

describe('(sections) installation', () => {
  it('should use default options', () => {
    const result = installation({ packageName: 'my-pkg' });
    expect(result).toContain('## 🚀 Installation');
    expect(result).toContain('npm install my-pkg');
    expect(result).toContain('yarn add my-pkg');
    expect(result).toContain('pnpm add my-pkg');
    expect(result).toContain('```sh');
  });

  it('should include dev dependency flags', () => {
    const result = installation({ packageName: 'eslint', isDev: true });
    expect(result).toContain('npm install --save-dev eslint');
    expect(result).toContain('yarn add --dev eslint');
    expect(result).toContain('pnpm add --save-dev eslint');
  });

  it('should exclude separator', () => {
    const result = installation({ packageName: 'test' });
    expect(result).not.toContain('---');
  });

  it('should use all custom options', () => {
    const result = installation({
      packageName: 'full-custom',
      isDev: true,

      heading: { content: 'Get Started', size: 4 }
    });
    expect(result).toContain('#### Get Started');
    expect(result).toContain('--save-dev full-custom');
    expect(result).not.toContain('---');
  });
});
