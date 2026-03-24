import { describe, it, expect } from 'vitest';
import { toFileEntry } from './module.ts';

describe('configs/runtime/depcruiser', () => {
  it('toFileEntry should produce correct file content', () => {
    const content = toFileEntry({
      extends: ['config1', 'config2'],
      allowedSeverity: 'warn',
      forbidden: {
        cfg: {
          noCircular: true,
          noOrphans: true,
          noDeprecatedCore: false,
          noDuplicateDepTypes: false,
          noNonPackageJson: {
            from: { path: 'from-path', orphan: true },
            to: { exoticRequireNot: 'some-package' }
          }
        },
        extended: [
          {
            module: { numberOfDependentsLessThan: 5, path: '**/src/**' },
            from: {},
            to: { reachable: true, path: 'to-path' }
          }
        ]
      },
      allowed: [
        { from: { path: 'allowed-from-path' }, to: { reachable: true, path: 'allowed-to-path' } }
      ]
    });
    expect(content).toMatchSnapshot();
  });
});
