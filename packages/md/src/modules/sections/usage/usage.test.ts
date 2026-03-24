import { describe, it, expect } from 'vitest';
import { usage } from './usage.js';

describe('(sections) usage', () => {
  it('renders section heading', () => {
    const result = usage({ examples: { code: 'const x = 1' } });
    expect(result).toContain('## 📖 Usage');
  });

  it('renders a single example as a ts code block by default', () => {
    const result = usage({ examples: { code: 'const x = 1' } });
    expect(result).toContain('```ts');
    expect(result).toContain('const x = 1');
  });

  it('renders with a specified language', () => {
    const result = usage({ examples: { code: 'echo hello', language: 'sh' } });
    expect(result).toContain('```sh');
  });

  it('renders example description', () => {
    const result = usage({ examples: { code: 'foo()', description: 'Basic call' } });
    expect(result).toContain('Basic call');
  });

  it('renders example heading as h3', () => {
    const result = usage({ examples: { code: 'foo()', heading: 'Basic Example' } });
    expect(result).toContain('### Basic Example');
  });

  it('renders multiple examples', () => {
    const result = usage({
      examples: [
        { code: 'foo()', heading: 'Example A' },
        { code: 'bar()', heading: 'Example B' }
      ]
    });
    expect(result).toContain('foo()');
    expect(result).toContain('bar()');
    expect(result).toContain('### Example A');
    expect(result).toContain('### Example B');
  });

  it('supports custom section heading', () => {
    const result = usage({
      examples: { code: 'x' },
      heading: { content: 'Getting Started', size: 3 }
    });
    expect(result).toContain('### Getting Started');
  });

  it('includes separator when specified', () => {
    const result = usage({ examples: { code: 'x' }, separator: true });
    expect(result).toContain('---');
  });
});
