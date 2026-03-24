import { expect, it } from 'vitest';

import { handleReporter } from './reporter.js';

it('handleReporter()', () => {
  const result = handleReporter({
    mermaid: { minify: true },
    anon: { wordlist: ['hello', 'world'] },
    archi: { collapsePattern: 'custom' }
  });
  expect(result.mermaid?.minify).toBe(true);
  expect(result.anon?.wordlist).toEqual(['hello', 'world']);
  expect(result.archi?.collapsePattern).toBe('custom');
});
