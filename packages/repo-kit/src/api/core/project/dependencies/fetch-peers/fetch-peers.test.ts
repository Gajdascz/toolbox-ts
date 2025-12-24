import { parseJson } from '@toolbox-ts/file';
import { findPackageJSON } from 'node:module';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchPeerDependencies } from './fetch-peers.ts';

vi.mock('@toolbox-ts/file');
vi.mock('node:module', async (importActual) => {
  return { ...(await importActual()), findPackageJSON: vi.fn() };
});

describe('fetch-peers', () => {
  const mockedParseJson = vi.mocked(parseJson);
  const mockedFindPackageJSON = vi.mocked(findPackageJSON);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPeerDependencies', () => {
    it('should fetch peer dependencies from package.json', async () => {
      const mockPkgJson = {
        name: 'test-package',
        peerDependencies: {
          react: '^18.0.0',
          'react-dom': '^18.0.0',
          typescript: '^5.0.0'
        }
      };

      mockedFindPackageJSON.mockReturnValueOnce('/path/to/package.json');
      mockedParseJson.mockResolvedValueOnce(mockPkgJson);

      const result = await fetchPeerDependencies('test-package');

      expect(mockedFindPackageJSON).toHaveBeenCalledWith(
        'test-package',
        expect.stringContaining('fetch-peers')
      );
      expect(mockedParseJson).toHaveBeenCalledWith('/path/to/package.json');
      expect(result).toEqual(['react', 'react-dom', 'typescript']);
    });

    it('should return empty array when no peerDependencies field exists', async () => {
      const mockPkgJson = {
        name: 'test-package',
        dependencies: { express: '^4.18.0' }
      };

      const consoleInfoSpy = vi
        .spyOn(console, 'info')
        .mockImplementation(() => {});
      mockedFindPackageJSON.mockReturnValueOnce('/path/to/package.json');
      mockedParseJson.mockResolvedValueOnce(mockPkgJson);

      const result = await fetchPeerDependencies('test-package');

      expect(result).toEqual([]);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        'No peerDependencies found for package: test-package'
      );

      consoleInfoSpy.mockRestore();
    });

    it('should return empty array when peerDependencies is null', async () => {
      const mockPkgJson = { name: 'test-package', peerDependencies: null };

      const consoleInfoSpy = vi
        .spyOn(console, 'info')
        .mockImplementation(() => {});
      mockedFindPackageJSON.mockReturnValueOnce('/path/to/package.json');
      mockedParseJson.mockResolvedValueOnce(mockPkgJson);

      const result = await fetchPeerDependencies('test-package');

      expect(result).toEqual([]);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        'No peerDependencies found for package: test-package'
      );

      consoleInfoSpy.mockRestore();
    });

    it('should return empty array when peerDependencies is empty object', async () => {
      const mockPkgJson = { name: 'test-package', peerDependencies: {} };

      mockedFindPackageJSON.mockReturnValueOnce('/path/to/package.json');
      mockedParseJson.mockResolvedValueOnce(mockPkgJson);

      const result = await fetchPeerDependencies('test-package');

      expect(result).toEqual([]);
    });

    it('should throw error when package.json cannot be found', async () => {
      mockedFindPackageJSON.mockReturnValueOnce(undefined as any);

      await expect(
        fetchPeerDependencies('nonexistent-package')
      ).rejects.toThrow();
    });

    it('should handle scoped packages', async () => {
      const mockPkgJson = {
        name: '@scope/package',
        peerDependencies: { '@types/node': '^20.0.0' }
      };

      mockedFindPackageJSON.mockReturnValueOnce('/path/to/package.json');
      mockedParseJson.mockResolvedValueOnce(mockPkgJson);

      const result = await fetchPeerDependencies('@scope/package');

      expect(result).toEqual(['@types/node']);
    });

    it('should handle packages with multiple peer dependencies', async () => {
      const mockPkgJson = {
        name: 'test-package',
        peerDependencies: {
          dep1: '^1.0.0',
          dep2: '^2.0.0',
          dep3: '^3.0.0',
          dep4: '^4.0.0',
          dep5: '^5.0.0'
        }
      };

      mockedFindPackageJSON.mockReturnValueOnce('/path/to/package.json');
      mockedParseJson.mockResolvedValueOnce(mockPkgJson);

      const result = await fetchPeerDependencies('test-package');

      expect(result).toHaveLength(5);
      expect(result).toEqual(['dep1', 'dep2', 'dep3', 'dep4', 'dep5']);
    });
  });
});
