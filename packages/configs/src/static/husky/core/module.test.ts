import { describe, it, expect } from 'vitest';
import { define, DEFAULTS, toFileEntry } from './module.ts';

describe('configs/static/husky', () => {
  describe('define', () => {
    it('should append to preset defaults', () => {
      const APPEND_COMMIT_MSG = 'echo "Additional commit-msg command"';
      const APPEND_PRE_COMMIT = 'echo "Additional pre-commit command"';
      const APPLY_PATCH_MSG = 'echo "Custom applypatch-msg command"';
      const result = define({
        append: { 'commit-msg': [APPEND_COMMIT_MSG], 'pre-commit': [APPEND_PRE_COMMIT] },
        'applypatch-msg': APPLY_PATCH_MSG
      });
      expect(result['commit-msg']).toContain('pnpm exec commitlint --edit "$1"');
      expect(result['commit-msg']).toContain(APPEND_COMMIT_MSG);
      expect(result['pre-commit']).toContain('pnpm run lint-staged');
      expect(result['pre-commit']).toContain(APPEND_PRE_COMMIT);
      expect(result['applypatch-msg']).toBe(APPLY_PATCH_MSG);
    });
    it('should provide defaults when no append is given', () => {
      const result = define();
      expect(result['commit-msg']).toBe(DEFAULTS['commit-msg']);
      expect(result['pre-commit']).toBe(DEFAULTS['pre-commit']);
    });
  });
  it('toFileEntry should produce correct file entry', () => {
    const content = toFileEntry({
      'applypatch-msg': 'echo "Custom applypatch-msg command"',
      append: {
        'commit-msg': ['echo "Additional commit-msg command"'],
        'pre-commit': ['echo "Additional pre-commit command"']
      },
      'pre-applypatch': 'echo "Custom pre-applypatch command"'
    });
    expect(content).toMatchSnapshot();
  });
});
