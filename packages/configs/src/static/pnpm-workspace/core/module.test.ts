import { describe, expect, it } from 'vitest';
import { define, toFileEntry } from './module.js';

describe('configs/static/pnpmWorkspace', () => {
  describe('define', () => {
    it('should merge unique packages with default and sort alphabetically', () => {
      const result = define({ packages: ['custom/*', 'packages/*'] });
      expect(result).toEqual({ packages: ['custom/*', 'packages/*'] });
    });
  });

  it('toFileEntry should produce correct file entry', () => {
    const content = toFileEntry({
      packages: ['custom/*'],
      ca: ['additional', 'config'],
      cafile: 'path/to/cafile',
      cert: 'path/to/cert',
      key: 'path/to/key',
      registry: 'https://registry.npmjs.org/',
      strictSsl: false,
      autoInstallPeers: true
    });
    expect(content).toMatchSnapshot();
  });
});
