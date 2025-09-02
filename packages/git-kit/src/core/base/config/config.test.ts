import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import { getScopes, REPO_SCOPE } from './config.ts';

const makeTmp = () =>
  path.join(
    '/',
    `tmp-getscopes-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

describe('getScopes', () => {
  it('walks up to ancestor and returns only repo scope when workspace absent', async () => {
    vi.resetModules();
    const tmp = makeTmp();
    const nested = path.join(tmp, 'a', 'b', 'c');
    await fsp.mkdir(nested, { recursive: true });

    const scopes = await getScopes(nested);
    expect(Array.isArray(scopes)).toBe(true);

    const repoName = REPO_SCOPE.replace('packages/', '');
    expect(scopes).toEqual([repoName]);

    await fsp.rm(tmp, { recursive: true, force: true });
  });

  it('returns repo scope when YAML parse throws (caught)', async () => {
    vi.resetModules();
    // mock yaml.parse to throw for this import
    vi.doMock('yaml', () => ({
      parse: () => {
        throw new Error('boom');
      }
    }));

    const tmp = makeTmp();
    await fsp.mkdir(tmp, { recursive: true });
    await fsp.writeFile(
      path.join(tmp, 'pnpm-workspace.yaml'),
      "packages:\n  - 'packages/*'\n",
      'utf8'
    );

    const scopes = await getScopes(tmp);
    const repoName = REPO_SCOPE.replace('packages/', '');
    expect(scopes).toEqual([repoName]);

    vi.doUnmock('yaml');
    await fsp.rm(tmp, { recursive: true, force: true });
  });
});
