import { execa, parseCommandString } from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BaseGit } from './BaseGit.ts';

vi.mock('./config/index.ts', async (actual) => ({
  ...(await actual()),
  getScopes: vi.fn(() => ['repo', 'package-one', 'package-two'])
}));

class TestGit extends BaseGit {
  _exec = this.exec;
  _git = this.git;
  run = vi.fn(async () => {
    return await Promise.resolve();
  });
}
describe('BaseGit', () => {
  let git;
  const mockExeca = vi.mocked(execa);
  const mockParseCommandString = vi
    .mocked(parseCommandString)
    .mockImplementation((cmd) => cmd.split(' '));
  beforeEach(() => {
    git = new TestGit([], {} as any);
    mockExeca.mockRestore();
  });

  describe('git', () => {
    it('with pipe', async () => {
      const spy = vi
        .spyOn(git, 'exec')
        .mockResolvedValue({ stdout: 'pipe-result' } as any);
      const result = await git._git.execWithStdio(['log', ['.']], 'pipe');
      expect(result.stdout).toBe('pipe-result');
      expect(spy).toHaveBeenCalledWith(['git', ['log', '.']], {
        execaOpts: { stdio: 'pipe' }
      });
    });
    it('with inherit', async () => {
      const spy = vi.spyOn(git, 'exec').mockResolvedValue(undefined);
      const result = await git._git.execWithStdio(['log', ['.']], 'inherit');
      expect(result).toBeUndefined();
      const noArgs = await git._git.execWithStdio(['status'], 'inherit');
      expect(noArgs).toBeUndefined();
      spy.mockRestore();
    });
    it('with string', async () => {
      vi.spyOn(git, 'exec').mockResolvedValue({
        stdout: 'pipe-string-result'
      } as any);
      const result = await git._git.string(['log', ['.']]);
      expect(result).toBe('pipe-string-result');
    });
  });
  describe('exec', () => {
    it('sets environment variable', async () => {
      const originalEnv = { ...process.env };
      try {
        process.env.EXECUTED_WITH_GIT_KIT = 'false';
        git.postExec = vi.fn();
        await git.exec(['status']);
        expect(process.env.EXECUTED_WITH_GIT_KIT).toBe('true');
      } finally {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        for (const k of Object.keys(process.env)) delete process.env[k];
        Object.assign(process.env, originalEnv);
      }
    });
  });
  describe('branch', () => {
    it('get', async () => {
      vi.spyOn(git, 'exec').mockResolvedValue({
        stdout: 'feat/ui/add-button'
      } as any);
      const result = await git.branch.get();
      expect(result).toBe('feat/ui/add-button');
      const resultWithArgs = await git.branch.get('HEAD', true, '--some-flag');
      expect(resultWithArgs).toBe('feat/ui/add-button');
      const resultWithArgs2 = await git.branch.get(
        'HEAD',
        false,
        '--some-flag'
      );
      expect(resultWithArgs2).toBe('feat/ui/add-button');
    });
    it('isBehindOrigin', async () => {
      vi.spyOn(git, 'exec').mockResolvedValue({ stdout: '1' } as any);
      const result = await git.branch.isBehindOrigin('dev');
      expect(result).toBe(true);
      vi.spyOn(git, 'exec').mockResolvedValue({ stdout: '0' } as any);
      const result2 = await git.branch.isBehindOrigin('dev');
      expect(result2).toBe(false);
      vi.spyOn(git, 'exec').mockResolvedValue({ stdout: '' } as any);
      const result3 = await git.branch.isBehindOrigin('dev');
      expect(result3).toBe(false);
    });
    describe('parseConvention', () => {
      it('valid', async () => {
        const result = await git.branch.parseConvention(
          'feat/package-one/add-button'
        );
        expect(result.type).toBe('feat');
        expect(result.scope).toBe('package-one');
        expect(result.description).toBe('add-button');
      });
      it('throws on invalid format', async () => {
        await expect(
          git.branch.parseConvention('invalid-branch-name')
        ).rejects.toThrow();
        await expect(
          git.branch.parseConvention('Feat/ui/add-button')
        ).rejects.toThrow();
        await expect(
          git.branch.parseConvention('feat/UI/add-button')
        ).rejects.toThrow(); // Scope uppercase
        await expect(
          git.branch.parseConvention('feat/ui/Add-button')
        ).rejects.toThrow(); // Description uppercase
        await expect(git.branch.parseConvention('feat/ui/')).rejects.toThrow(); // Missing description
        await expect(
          git.branch.parseConvention('feat//add-button')
        ).rejects.toThrow(); // Missing scope
        await expect(
          git.branch.parseConvention('/ui/add-button')
        ).rejects.toThrow(); // Missing type
      });
    });
    describe('assertConvention', () => {
      it('validates and returns convention as string', async () => {
        const result = await git.branch.assertConvention(
          'feat/package-one/add-button'
        );
        expect(result.type).toBe('feat');
        expect(result.scope).toBe('package-one');
        expect(result.description).toBe('add-button');
        expect(result.raw).toBe('feat/package-one/add-button');
      });
      it('validates and returns convention as object', async () => {
        const result = await git.branch.assertConvention({
          description: 'add-button',
          raw: 'feat/package-one/add-button',
          scope: 'package-one',

          type: 'feat'
        });
        expect(result.type).toBe('feat');
        expect(result.scope).toBe('package-one');
        expect(result.description).toBe('add-button');
        expect(result.raw).toBe('feat/package-one/add-button');
      });
      it('fails on invalid type', async () => {
        await expect(
          git.branch.assertConvention('unknown/ui/add-button')
        ).rejects.toThrow();
      });
      it('fails on invalid scope', async () => {
        await expect(
          git.branch.assertConvention('feat/unknown-scope/add-button')
        ).rejects.toThrow();
      });
      it('fails on empty description', async () => {
        await expect(
          git.branch.assertConvention({
            description: '',
            raw: 'feat/ui/',
            scope: 'ui',

            type: 'feat'
          })
        ).rejects.toThrow();
      });
      it('fails if raw does not match other properties', async () => {
        await expect(
          git.branch.assertConvention({
            description: 'add-button',
            raw: 'feat/package-one/wrong-description',
            scope: 'package-one',
            type: 'feat'
          })
        ).rejects.toThrow();
        await expect(
          git.branch.assertConvention({
            description: 'add-button',
            raw: 'feat/wrong-scope/add-button',
            scope: null,

            type: 'feat'
          })
        ).rejects.toThrow();
      });
    });

    it('assertNotProtected', () => {
      expect(() => git.branch.assertNotProtected('main')).toThrow();
      expect(git.branch.assertNotProtected('dev')).toBe('dev');
    });
    it('assertNotBehindOrigin', async () => {
      vi.spyOn(git.branch, 'isBehindOrigin').mockResolvedValue(false);
      expect(await git.branch.assertNotBehindOrigin('dev')).toBe('dev');
      vi.spyOn(git.branch, 'isBehindOrigin').mockResolvedValue(true);
      await expect(git.branch.assertNotBehindOrigin('dev')).rejects.toThrow();
    });
    it('assertReadyForDevelopment infers current branch', async () => {
      vi.spyOn(git.branch, 'get').mockResolvedValue(
        'feat/package-two/add-feature'
      );
      vi.spyOn(git.branch, 'isBehindOrigin').mockResolvedValue(false);
      const result = await git.branch.assertReadyForDevelopment();
      expect(result.type).toBe('feat');
      expect(result.scope).toBe('package-two');
      expect(result.description).toBe('add-feature');
    });
    it('assertReadyForDevelopment throws on protected branch', async () => {
      vi.spyOn(git.branch, 'get').mockResolvedValue('main');
      await expect(git.branch.assertReadyForDevelopment()).rejects.toThrow();
    });
    it('assertReadyForDevelopment throws when behind origin', async () => {
      vi.spyOn(git.branch, 'get').mockResolvedValue('dev');
      vi.spyOn(git.branch, 'isBehindOrigin').mockResolvedValue(true);
      await expect(git.branch.assertReadyForDevelopment()).rejects.toThrow();
    });
  });

  describe('fetch', () => {
    it('fetches origin branch', async () => {
      const execMock = vi
        .spyOn(git, 'exec')
        .mockResolvedValue({ stdout: '' } as any);
      await git.fetch.origin('main');
      expect(execMock).toHaveBeenCalledWith(
        ['git', ['fetch', 'origin', 'main']],
        { execaOpts: { stdio: 'pipe' } }
      );
    });
  });

  describe('changeset', () => {
    beforeEach(() => {
      // Clean up .changeset directory before each test
      const changesetDir = path.join(process.cwd(), '.changeset');
      if (fs.existsSync(changesetDir)) {
        fs.rmSync(changesetDir, { force: true, recursive: true });
      }
    });

    it('isInRepo returns false if no changeset', () => {
      expect(git.changeset.isInRepo()).toBe(false);
    });
    it('isInRepo returns true if changeset exists', () => {
      const changesetDir = path.join(process.cwd(), '.changeset');
      fs.mkdirSync(changesetDir, { recursive: true });
      fs.writeFileSync(path.join(changesetDir, 'test.md'), 'test content');
      expect(git.changeset.isInRepo()).toBe(true);
    });
    it('isRequired returns false for repo scope and feat type', () => {
      expect(
        git.changeset.isRequired({
          description: 'add-feature',
          raw: 'feat/repo/add-feature',
          scope: 'repo',

          type: 'feat'
        })
      ).toBe(false);
    });
    it('isRequired returns true for ui scope and fix type', () => {
      expect(
        git.changeset.isRequired({
          description: 'fix-bug',
          raw: 'fix/ui/fix-bug',
          scope: 'package-one',

          type: 'fix'
        })
      ).toBe(true);
    });
    it('assertValidState throws if required but not present', () => {
      expect(() =>
        git.changeset.assertValidState({
          description: 'fix-bug',
          raw: 'fix/ui/fix-bug',
          scope: 'package-two',

          type: 'fix'
        })
      ).toThrow();
    });
    it('assertValidState throws if present but not required', () => {
      const changesetDir = path.join(process.cwd(), '.changeset');
      fs.mkdirSync(changesetDir, { recursive: true });
      fs.writeFileSync(path.join(changesetDir, 'test.md'), 'test content');
      expect(() =>
        git.changeset.assertValidState({
          description: 'update-deps',
          raw: 'chore/repo/update-deps',
          scope: 'repo',

          type: 'chore'
        })
      ).toThrow();
    });
    it('assertValidState returns scope/type if valid', () => {
      expect(
        git.changeset.assertValidState({
          description: 'add-feature',
          raw: 'feat/repo/add-feature',
          scope: 'repo',

          type: 'feat'
        })
      ).toEqual({ scope: 'repo', type: 'feat' });
    });
  });
});
