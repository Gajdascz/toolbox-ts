import { describe, expect, it } from 'vitest';
import { tooling } from './tooling.ts';

describe('(sections) tooling', () => {
  it('empty sections', () => {
    const result = tooling({});
    expect(result).toContain('## 🛠️ Tooling');
    expect(result).not.toContain('<details>');
  });
  it('with sections', () => {
    const result = tooling({
      heading: { size: 2 },
      sections: {
        formatters: [{ content: 'Prettier', url: 'https://prettier.io' }],
        linters: [
          { content: 'ESLint', url: 'https://eslint.org' },
          { content: 'Stylelint', url: 'https://stylelint.io' }
        ]
      }
    });
    expect(result).toContain('## 🛠️ Tooling');
    expect(result).toContain('<h3>Linters</h3>');
    expect(result).toContain('[ESLint](https://eslint.org)');
    expect(result).toContain('[Stylelint](https://stylelint.io)');
    expect(result).toContain('<h3>Formatters</h3>');
    expect(result).toContain('[Prettier](https://prettier.io)');
  });
  it('with array of links', () => {
    const result = tooling({
      sections: [
        { content: 'Tool A', url: 'https://tool-a.com' },
        { content: 'Tool B', url: 'https://tool-b.com' }
      ]
    });
    expect(result).toContain('[Tool A](https://tool-a.com)');
    expect(result).toContain('[Tool B](https://tool-b.com)');
  });
});
