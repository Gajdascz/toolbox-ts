import { beforeEach, describe, expect, it, vi } from 'vitest';

import { $pnpm } from '../../shell-exec.ts';
import { fetchPeerDependencies } from '../fetch-peers/fetch-peers.ts';
import {
  installDependencies,
  installDependency,
  installPeers,
  mapConfigModuleDeps
} from './install.ts';

vi.mock('../../shell-exec.js', async (actual) => ({
  ...(await actual()),
  $pnpm: vi.fn()
}));
vi.mock('../fetch-peers/fetch-peers.js');

describe('install', () => {
  const mocked$ = vi.mocked($pnpm);
  const mockedFetchPeerDependencies = vi.mocked(fetchPeerDependencies);

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('installDependency', () => {
    it('should install a regular dependency', async () => {
      mocked$.mockResolvedValueOnce({} as any);
      await installDependency('express');
      expect(mocked$).toHaveBeenCalledWith('add express');
    });

    it('should install a dev dependency when isDev is true', async () => {
      mocked$.mockResolvedValueOnce({} as any);

      await installDependency('typescript', { isDev: true });

      expect(mocked$).toHaveBeenCalledWith('add -D typescript');
    });

    it('should install peer dependencies when option is enabled', async () => {
      mocked$.mockResolvedValueOnce({} as any); // Main package
      mockedFetchPeerDependencies.mockResolvedValueOnce(['react', 'react-dom']);
      mocked$.mockResolvedValueOnce({} as any); // react
      mocked$.mockResolvedValueOnce({} as any); // react-dom

      await installDependency('react-router-dom', {
        installPeerDependencies: true
      });

      expect(mocked$).toHaveBeenCalledWith('add react-router-dom');
      expect(mockedFetchPeerDependencies).toHaveBeenCalledWith(
        'react-router-dom'
      );
    });

    it('should install peer dependencies as dev when isDev is true', async () => {
      mocked$.mockResolvedValueOnce({} as any); // Main package
      mockedFetchPeerDependencies.mockResolvedValueOnce(['@types/node']);
      mocked$.mockResolvedValueOnce({} as any); // @types/node

      await installDependency('vitest', {
        isDev: true,
        installPeerDependencies: true
      });

      expect(mocked$).toHaveBeenCalledWith('add -D vitest');
      expect(mocked$).toHaveBeenCalledWith('add -D @types/node');
    });

    it('should throw DependenciesError when installation fails', async () => {
      mocked$.mockRejectedValueOnce(new Error('Network error'));
      await expect(installDependency('express')).rejects.toThrow();
    });
  });

  describe('installPeers', () => {
    it('should install all peer dependencies', async () => {
      mockedFetchPeerDependencies.mockResolvedValueOnce(['peer1', 'peer2']);
      mocked$.mockResolvedValueOnce({} as any); // peer1
      mocked$.mockResolvedValueOnce({} as any); // peer2

      await installPeers('main-package');

      expect(mockedFetchPeerDependencies).toHaveBeenCalledWith('main-package');
      expect(mocked$).toHaveBeenCalledWith('add peer1');
      expect(mocked$).toHaveBeenCalledWith('add peer2');
    });

    it('should install peers as dev dependencies when isDev is true', async () => {
      mockedFetchPeerDependencies.mockResolvedValueOnce(['dev-peer']);
      mocked$.mockResolvedValueOnce({} as any);
      await installPeers('main-package', true);
      expect(mocked$).toHaveBeenCalledWith('add -D dev-peer');
    });

    it('should throw DependenciesError when peer installation fails', async () => {
      mockedFetchPeerDependencies.mockResolvedValueOnce(['peer1', 'peer2']);
      mocked$.mockResolvedValueOnce({} as any); // peer1 succeeds
      mocked$.mockRejectedValueOnce(new Error('Failed')); // peer2 fails

      await expect(installPeers('main-package')).rejects.toThrow();
      await expect(installPeers('main-package')).rejects.toThrow();
    });

    it('should throw DependenciesError when fetching peers fails', async () => {
      mockedFetchPeerDependencies.mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(installPeers('main-package')).rejects.toThrow();
      await expect(installPeers('main-package')).rejects.toThrow();
    });
  });

  describe('installDependencies', () => {
    it('should install multiple dependencies', async () => {
      mocked$.mockResolvedValue({} as any);

      await installDependencies([['express'], ['typescript', { isDev: true }]]);

      expect(mocked$).toHaveBeenCalledWith('add express');
      expect(mocked$).toHaveBeenCalledWith('add -D typescript');
    });

    it('should install dependencies with their peers', async () => {
      mocked$.mockResolvedValue({} as any);
      mockedFetchPeerDependencies
        .mockResolvedValueOnce(['react'])
        .mockResolvedValueOnce(['@types/node']);

      await installDependencies([
        ['react-router-dom', { installPeerDependencies: true }],
        ['vitest', { isDev: true, installPeerDependencies: true }]
      ]);
      expect(mockedFetchPeerDependencies).toHaveBeenCalledWith(
        'react-router-dom'
      );
      expect(mockedFetchPeerDependencies).toHaveBeenCalledWith('vitest');
      expect(mocked$).toHaveBeenCalledWith('add react-router-dom');
      expect(mocked$).toHaveBeenCalledWith('add react');
      expect(mocked$).toHaveBeenCalledWith('add -D vitest');
      expect(mocked$).toHaveBeenCalledWith('add -D @types/node');
    });

    it('should handle empty packages array', async () => {
      await installDependencies([]);

      expect(mocked$).not.toHaveBeenCalled();
    });

    it('should propagate errors from individual installations', async () => {
      mocked$.mockResolvedValueOnce({} as any); // First succeeds
      mocked$.mockRejectedValueOnce(new Error('Install failed')); // Second fails

      await expect(
        installDependencies([['express'], ['typescript']])
      ).rejects.toThrow();
    });
  });
  it('should map config module dependencies correctly', () => {
    const configModuleDeps = [
      { packageName: 'eslint' },
      { packageName: 'prettier' }
    ];
    const result = mapConfigModuleDeps(configModuleDeps, {
      isDev: true,
      installPeerDependencies: true
    });

    expect(result).toEqual([
      { 0: 'eslint', 1: { isDev: true, installPeerDependencies: true } },
      { 0: 'prettier', 1: { isDev: true, installPeerDependencies: true } }
    ]);
  });
});
