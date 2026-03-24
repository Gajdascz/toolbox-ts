import { describe, it, expect } from 'vitest';

import { details } from './details.ts';

describe('(blocks) details', () => {
  describe('md + element', () => {
    it('should correctly build a details element', () => {
      const d = details({ content: 'content', summary: 'sum', id: 'd1' } as any);
      expect(d).toBe('<details id="d1"><summary>sum</summary>\n\ncontent\n\n</details>');
    });
  });
});
