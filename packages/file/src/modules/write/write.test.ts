import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  file,
  isOverwriteBehavior,
  normalizeData,
  type OverwritePromptFn,
  templates,
  type WriteTemplate
} from './write.ts';

const outDir = '/tmp/write-test';

const tmplts: WriteTemplate<{ msg: string }>[] = [
  { filename: 'a.txt', generate: (cfg) => cfg.msg },
  {
    filename: 'b.txt',
    generate: (cfg) => cfg.msg.toUpperCase(),
    relativePath: 'sub'
  }
];

beforeEach(async () => {
  await fs.promises.rm(outDir, { recursive: true, force: true });
  await fs.promises.mkdir(outDir, { recursive: true });
});

describe('write', () => {
  describe('templates', () => {
    it('writes files when they do not exist (default skip)', async () => {
      const res = await templates(outDir, { msg: 'hello' }, tmplts);
      expect(res.result[0].success).toBe(true);
      expect(res.result[1].success).toBe(true);
      expect(
        await fs.promises.readFile(path.join(outDir, 'a.txt'), 'utf8')
      ).toBe('hello');
      expect(
        await fs.promises.readFile(path.join(outDir, 'sub', 'b.txt'), 'utf8')
      ).toBe('HELLO');
    });

    it('skips write when file exists and behavior is skip', async () => {
      await fs.promises.writeFile(path.join(outDir, 'a.txt'), 'exists');
      const res = await templates(outDir, { msg: 'hello' }, tmplts, {
        overwrite: { behavior: 'skip' }
      });
      expect(res.result[0].success).toBe(false);
      expect(res.result[0].error).toBe('Skipped (exists)');
      expect(res.result[1].success).toBe(true);
      expect(
        await fs.promises.readFile(path.join(outDir, 'a.txt'), 'utf8')
      ).toBe('exists');
    });

    it('forces write when behavior is force', async () => {
      await fs.promises.writeFile(path.join(outDir, 'a.txt'), 'exists');
      const res = await templates(outDir, { msg: 'force' }, tmplts, {
        overwrite: { behavior: 'force' }
      });
      expect(res.result[0].success).toBe(true);
      expect(
        await fs.promises.readFile(path.join(outDir, 'a.txt'), 'utf8')
      ).toBe('force');
    });

    it('prompts user and writes if confirmed', async () => {
      await fs.promises.writeFile(path.join(outDir, 'a.txt'), 'exists');
      const promptFn: OverwritePromptFn = vi.fn().mockResolvedValue(true);
      const res = await templates(outDir, { msg: 'prompted' }, tmplts, {
        overwrite: { behavior: 'prompt', promptFn }
      });
      expect(promptFn).toHaveBeenCalled();
      expect(res.result[0].success).toBe(true);
      expect(
        await fs.promises.readFile(path.join(outDir, 'a.txt'), 'utf8')
      ).toBe('prompted');
    });

    it('prompts user and cancels if not confirmed', async () => {
      await fs.promises.writeFile(path.join(outDir, 'a.txt'), 'exists');
      const promptFn: OverwritePromptFn = vi.fn().mockResolvedValue(false);
      const res = await templates(outDir, { msg: 'cancelled' }, tmplts, {
        overwrite: { behavior: 'prompt', promptFn }
      });
      expect(promptFn).toHaveBeenCalled();
      expect(res.result[0].success).toBe(false);
      expect(res.result[0].error).toBe('User skipped');
      expect(
        await fs.promises.readFile(path.join(outDir, 'a.txt'), 'utf8')
      ).toBe('exists');
    });

    it('throws error if promptFn is missing for prompt behavior', async () => {
      await fs.promises.writeFile(path.join(outDir, 'a.txt'), 'exists');
      // Should throw TypeError
      await expect(
        templates(outDir, { msg: 'fail' }, tmplts, {
          overwrite: { behavior: 'prompt' }
        })
      ).rejects.toThrow(
        'Prompt function is required when overwrite behavior is set to "prompt".'
      );
    });

    it('throws error for unexpected overwrite behavior', async () => {
      await expect(
        templates(outDir, { msg: 'fail' }, tmplts, {
          // @ts-expect-error: testing invalid behavior
          overwrite: { behavior: 'invalid' }
        })
      ).rejects.toThrow('Unexpected overwrite behavior: invalid');
    });

    it('returns error if writeFile throws', async () => {
      const badTemplates: WriteTemplate<{ msg: string }>[] = [
        {
          filename: 'bad.txt',
          generate: () => {
            throw new Error('fail-generate');
          }
        }
      ];
      const res = await templates(outDir, { msg: 'oops' }, badTemplates);
      expect(res.result[0].success).toBe(false);
      expect(res.result[0].error).toMatch(/fail-generate/);
    });
  });
  describe('file', () => {
    const filePath = path.join(outDir, 'single.txt');
    it('writes file when it does not exist (default skip)', async () => {
      await file(filePath, 'hello');
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('hello');
    });

    it('skips write when file exists and behavior is skip', async () => {
      await fs.promises.writeFile(filePath, 'exists');
      await expect(file(filePath, 'should-skip')).rejects.toThrow(
        /Cannot write to .* Write aborted: Skipped \(exists\)/
      );
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('exists');
    });

    it('forces write when behavior is force', async () => {
      await fs.promises.writeFile(filePath, 'exists');
      await file(filePath, 'forced', { overwrite: { behavior: 'force' } });
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('forced');
    });

    it('prompts user and writes if confirmed', async () => {
      await fs.promises.writeFile(filePath, 'exists');
      const promptFn: OverwritePromptFn = vi.fn().mockResolvedValue(true);
      await file(filePath, 'prompted', {
        overwrite: { behavior: 'prompt', promptFn }
      });
      expect(promptFn).toHaveBeenCalled();
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('prompted');
    });

    it('prompts user and cancels if not confirmed', async () => {
      await fs.promises.writeFile(filePath, 'exists');
      const promptFn: OverwritePromptFn = vi.fn().mockResolvedValue(false);
      await expect(
        file(filePath, 'cancelled', {
          overwrite: { behavior: 'prompt', promptFn }
        })
      ).rejects.toThrow(/Cannot write to .* Write aborted: User skipped/);
      expect(promptFn).toHaveBeenCalled();
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('exists');
    });

    it('throws error if promptFn is missing for prompt behavior', async () => {
      await fs.promises.writeFile(filePath, 'exists');
      await expect(
        file(filePath, 'fail', { overwrite: { behavior: 'prompt' } })
      ).rejects.toThrow(
        'Prompt function is required when overwrite behavior is set to "prompt".'
      );
    });

    it('throws error for unexpected overwrite behavior', async () => {
      await fs.promises.writeFile(filePath, 'exists');
      await expect(
        // @ts-expect-error: testing invalid behavior
        file(filePath, 'fail', { overwrite: { behavior: 'invalid' } })
      ).rejects.toThrow('Unexpected overwrite behavior: invalid');
    });

    it('writes normalized data for Uint8Array', async () => {
      const buf = new Uint8Array([104, 105]); // 'hi'
      await file(filePath, buf);
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('hi');
    });

    it('writes normalized data for object', async () => {
      await file(filePath, { foo: 'bar' });
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe(
        JSON.stringify({ foo: 'bar' }, null, 2)
      );
    });

    it('writes empty string for null/undefined', async () => {
      await file(filePath, null, { overwrite: { behavior: 'force' } });
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('');
      await file(filePath, undefined, { overwrite: { behavior: 'force' } });
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('');
    });
  });
  it('validates overwrite behavior', () => {
    expect(isOverwriteBehavior('force')).toBe(true);
    expect(isOverwriteBehavior('prompt')).toBe(true);
    expect(isOverwriteBehavior('skip')).toBe(true);
    expect(isOverwriteBehavior('invalid')).toBe(false);
    expect(isOverwriteBehavior(123)).toBe(false);
  });
  it('normalizes data correctly', () => {
    expect(normalizeData('test')).toBe('test');
    expect(normalizeData(null)).toBe('');
    expect(normalizeData(undefined)).toBe('');
    expect(normalizeData(new Uint8Array([104, 101, 108, 108, 111]))).toBe(
      'hello'
    );
    expect(normalizeData(Buffer.from('world'))).toBe('world');
    expect(normalizeData({ key: 'value' })).toBe(
      JSON.stringify({ key: 'value' }, null, 2)
    );
    expect(normalizeData(1n)).toBe('1');
    expect(normalizeData(new Date())).toEqual(expect.any(String));
  });
});
