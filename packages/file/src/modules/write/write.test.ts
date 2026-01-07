import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  type FileEntry,
  isOverwriteBehavior,
  normalizeWriteData,
  writeFile,
  writeFiles
} from './write.ts';

const outDir = '/tmp/write-test';

const files: FileEntry[] = [
  { filename: 'a.txt', data: 'Alice' },
  { filename: 'b.txt', data: 'Bob', pathFromOutDir: 'sub' }
];

beforeEach(async () => {
  await fs.promises.rm(outDir, { recursive: true, force: true });
  await fs.promises.mkdir(outDir, { recursive: true });
});

describe('write', () => {
  describe('writeFiles', () => {
    it('writes files with provided data', async () => {
      const res = await writeFiles(outDir, files);
      expect(res[0].success).toBe(true);
      expect(res[1].success).toBe(true);
      expect(
        await fs.promises.readFile(path.join(outDir, 'a.txt'), 'utf8')
      ).toBe('Alice');
      expect(
        await fs.promises.readFile(path.join(outDir, 'sub', 'b.txt'), 'utf8')
      ).toBe('Bob');
    });

    it('skips write when file exists and behavior is skip', async () => {
      await fs.promises.writeFile(path.join(outDir, 'a.txt'), 'exists');
      const res = await writeFiles(outDir, files, {
        overwrite: { behavior: 'skip' }
      });
      expect(res[0].success).toBe(false);
      expect(res[0].error).toMatch(/Skipped \(exists\)/);
      expect(res[1].success).toBe(true);
      expect(
        await fs.promises.readFile(path.join(outDir, 'a.txt'), 'utf8')
      ).toBe('exists');
    });

    it('forces write when behavior is force', async () => {
      await fs.promises.writeFile(path.join(outDir, 'a.txt'), 'exists');
      const res = await writeFiles(outDir, files, {
        overwrite: { behavior: 'force' }
      });
      expect(res[0].success).toBe(true);
      expect(
        await fs.promises.readFile(path.join(outDir, 'a.txt'), 'utf8')
      ).toBe('Alice');
    });

    it('prompts user and writes if confirmed', async () => {
      await fs.promises.writeFile(path.join(outDir, 'a.txt'), 'exists');
      const promptFn = vi.fn().mockResolvedValue(true);
      const res = await writeFiles(outDir, files, {
        overwrite: { behavior: 'prompt', promptFn }
      });
      expect(promptFn).toHaveBeenCalled();
      expect(res[0].success).toBe(true);
      expect(
        await fs.promises.readFile(path.join(outDir, 'a.txt'), 'utf8')
      ).toBe('Alice');
    });

    it('prompts user and skips if not confirmed', async () => {
      await fs.promises.writeFile(path.join(outDir, 'a.txt'), 'exists');
      const promptFn = vi.fn().mockResolvedValue(false);
      const res = await writeFiles(outDir, files, {
        overwrite: { behavior: 'prompt', promptFn }
      });
      expect(promptFn).toHaveBeenCalled();
      expect(res[0].success).toBe(false);
      expect(res[0].error).toMatch(/User skipped/);
      expect(
        await fs.promises.readFile(path.join(outDir, 'a.txt'), 'utf8')
      ).toBe('exists');
    });

    it('returns error if promptFn is missing for prompt behavior', async () => {
      await fs.promises.writeFile(path.join(outDir, 'a.txt'), 'exists');
      const res = await writeFiles(outDir, files, {
        overwrite: { behavior: 'prompt' }
      });
      expect(res[0].success).toBe(false);
      expect(res[0].error).toMatch(/Prompt function is required/);
    });

    it('returns error for unexpected overwrite behavior', async () => {
      const res = await writeFiles(outDir, [...files, ...files], {
        // @ts-expect-error: testing invalid behavior
        overwrite: { behavior: 'invalid' }
      });
      expect(res[2].success).toBe(false);
      expect(res[2].error).toMatch(/Unexpected overwrite behavior/);
    });

    it('writes normalized data for objects', async () => {
      const objFiles: FileEntry[] = [
        { filename: 'config.json', data: { foo: 'bar' } }
      ];
      const res = await writeFiles(outDir, objFiles);
      expect(res[0].success).toBe(true);
      expect(
        await fs.promises.readFile(path.join(outDir, 'config.json'), 'utf8')
      ).toBe(JSON.stringify({ foo: 'bar' }, null, 2));
    });

    it('writes empty string for null/undefined data', async () => {
      const nullFiles: FileEntry[] = [
        { filename: 'null.txt', data: null },
        { filename: 'undef.txt', data: undefined }
      ];
      const res = await writeFiles(outDir, nullFiles);
      expect(res[0].success).toBe(true);
      expect(res[1].success).toBe(true);
      expect(
        await fs.promises.readFile(path.join(outDir, 'null.txt'), 'utf8')
      ).toBe('');
      expect(
        await fs.promises.readFile(path.join(outDir, 'undef.txt'), 'utf8')
      ).toBe('');
    });
  });

  describe('writeFile', () => {
    const filePath = path.join(outDir, 'single.txt');

    it('writes file when it does not exist (default skip)', async () => {
      await writeFile(filePath, 'hello');
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('hello');
    });

    it('skips write when file exists and behavior is skip', async () => {
      await fs.promises.writeFile(filePath, 'exists');
      await expect(writeFile(filePath, 'should-skip')).rejects.toThrow(
        /Cannot write to .* Write aborted: Skipped \(exists\)/
      );
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('exists');
    });

    it('forces write when behavior is force', async () => {
      await fs.promises.writeFile(filePath, 'exists');
      await writeFile(filePath, 'forced', { overwrite: { behavior: 'force' } });
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('forced');
    });

    it('prompts user and writes if confirmed', async () => {
      await fs.promises.writeFile(filePath, 'exists');
      const promptFn = vi.fn().mockResolvedValue(true);
      await writeFile(filePath, 'prompted', {
        overwrite: { behavior: 'prompt', promptFn }
      });
      expect(promptFn).toHaveBeenCalled();
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('prompted');
    });

    it('prompts user and cancels if not confirmed', async () => {
      await fs.promises.writeFile(filePath, 'exists');
      const promptFn = vi.fn().mockResolvedValue(false);
      await expect(
        writeFile(filePath, 'cancelled', {
          overwrite: { behavior: 'prompt', promptFn }
        })
      ).rejects.toThrow(/Cannot write to .* Write aborted: User skipped/);
      expect(promptFn).toHaveBeenCalled();
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('exists');
    });

    it('throws error if promptFn is missing for prompt behavior', async () => {
      await fs.promises.writeFile(filePath, 'exists');
      await expect(
        writeFile(filePath, 'fail', { overwrite: { behavior: 'prompt' } })
      ).rejects.toThrow(
        'Prompt function is required when overwrite behavior is set to "prompt".'
      );
    });

    it('throws error for unexpected overwrite behavior', async () => {
      await fs.promises.writeFile(filePath, 'exists');
      await expect(
        // @ts-expect-error: testing invalid behavior
        writeFile(filePath, 'fail', { overwrite: { behavior: 'invalid' } })
      ).rejects.toThrow('Unexpected overwrite behavior: invalid');
    });

    it('writes normalized data for Uint8Array', async () => {
      const buf = new Uint8Array([104, 105]); // 'hi'
      await writeFile(filePath, buf);
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('hi');
    });

    it('writes normalized data for object', async () => {
      await writeFile(filePath, { foo: 'bar' });
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe(
        JSON.stringify({ foo: 'bar' }, null, 2)
      );
    });

    it('writes empty string for null/undefined', async () => {
      await writeFile(filePath, null, { overwrite: { behavior: 'force' } });
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('');
      await writeFile(filePath, undefined, {
        overwrite: { behavior: 'force' }
      });
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('');
    });
  });

  describe('isOverwriteBehavior', () => {
    it('validates overwrite behavior', () => {
      expect(isOverwriteBehavior('force')).toBe(true);
      expect(isOverwriteBehavior('prompt')).toBe(true);
      expect(isOverwriteBehavior('skip')).toBe(true);
      expect(isOverwriteBehavior('invalid')).toBe(false);
      expect(isOverwriteBehavior(123)).toBe(false);
    });
  });

  describe('normalizeWriteData', () => {
    it('normalizes data correctly', () => {
      expect(normalizeWriteData('test')).toBe('test');
      expect(normalizeWriteData(null)).toBe('');
      expect(normalizeWriteData(undefined)).toBe('');
      expect(
        normalizeWriteData(new Uint8Array([104, 101, 108, 108, 111]))
      ).toBe('hello');
      expect(normalizeWriteData(Buffer.from('world'))).toBe('world');
      expect(normalizeWriteData({ key: 'value' })).toBe(
        JSON.stringify({ key: 'value' }, null, 2)
      );
      expect(normalizeWriteData(1n)).toBe('1');
      expect(normalizeWriteData(new Date())).toEqual(expect.any(String));
    });
  });
});
