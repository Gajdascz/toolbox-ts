import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  type FileWriteTemplate,
  isOverwriteBehavior,
  normalizeWriteData,
  writeFile,
  writeFileTemplates
} from './write.ts';

const outDir = '/tmp/write-test';

const templates: FileWriteTemplate<{ msg: string }>[] = [
  {
    filename: 'a.txt',
    generate: ({ msg }) => msg,
    generateCfg: { msg: 'Alice' }
  },
  {
    filename: 'b.txt',
    generateCfg: { msg: 'Bob' },
    generate: (cfg) => cfg.msg.toUpperCase(),
    relativePath: 'sub'
  }
];

beforeEach(async () => {
  await fs.promises.rm(outDir, { recursive: true, force: true });
  await fs.promises.mkdir(outDir, { recursive: true });
});

describe('write', () => {
  describe('writeFileTemplates', () => {
    it('writes files using each template generateCfg', async () => {
      const res = await writeFileTemplates(outDir, templates);
      expect(res.result[0].success).toBe(true);
      expect(res.result[1].success).toBe(true);
      expect(
        await fs.promises.readFile(path.join(outDir, 'a.txt'), 'utf8')
      ).toBe('Alice'); // ✅ Uses template's own config
      expect(
        await fs.promises.readFile(path.join(outDir, 'sub', 'b.txt'), 'utf8')
      ).toBe('BOB'); // ✅ Uses template's own config
    });

    it('skips write when file exists and behavior is skip', async () => {
      await fs.promises.writeFile(path.join(outDir, 'a.txt'), 'exists');
      const res = await writeFileTemplates(outDir, templates, {
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
      const res = await writeFileTemplates(outDir, templates, {
        overwrite: { behavior: 'force' }
      });
      expect(res.result[0].success).toBe(true);
      expect(
        await fs.promises.readFile(path.join(outDir, 'a.txt'), 'utf8')
      ).toBe('Alice');
    });

    it('throws error if promptFn is missing for prompt behavior', async () => {
      await fs.promises.writeFile(path.join(outDir, 'a.txt'), 'exists');
      // Should throw TypeError
      await expect(
        writeFileTemplates(outDir, templates, {
          overwrite: { behavior: 'prompt' }
        })
      ).rejects.toThrow(
        'Prompt function is required when overwrite behavior is set to "prompt".'
      );
    });

    it('throws error for unexpected overwrite behavior', async () => {
      await expect(
        writeFileTemplates(outDir, templates, {
          // @ts-expect-error: testing invalid behavior
          overwrite: { behavior: 'invalid' }
        })
      ).rejects.toThrow('Unexpected overwrite behavior: invalid');
    });

    it('returns error if writeFile throws', async () => {
      const badTemplates: FileWriteTemplate<{ msg: string }>[] = [
        {
          filename: 'bad.txt',
          generate: () => {
            throw new Error('fail-generate');
          }
        }
      ];
      const res = await writeFileTemplates(outDir, badTemplates);
      expect(res.result[0].success).toBe(false);
      expect(res.result[0].error).toMatch(/fail-generate/);
    });
  });
  describe('writeFile', () => {
    const filePath = path.join(outDir, 'single.txt');
    it('writes writeFile when it does not exist (default skip)', async () => {
      await writeFile(filePath, 'hello');
      expect(await fs.promises.readFile(filePath, 'utf8')).toBe('hello');
    });

    it('skips write when writeFile exists and behavior is skip', async () => {
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
  it('validates overwrite behavior', () => {
    expect(isOverwriteBehavior('force')).toBe(true);
    expect(isOverwriteBehavior('prompt')).toBe(true);
    expect(isOverwriteBehavior('skip')).toBe(true);
    expect(isOverwriteBehavior('invalid')).toBe(false);
    expect(isOverwriteBehavior(123)).toBe(false);
  });
  it('normalizes data correctly', () => {
    expect(normalizeWriteData('test')).toBe('test');
    expect(normalizeWriteData(null)).toBe('');
    expect(normalizeWriteData(undefined)).toBe('');
    expect(normalizeWriteData(new Uint8Array([104, 101, 108, 108, 111]))).toBe(
      'hello'
    );
    expect(normalizeWriteData(Buffer.from('world'))).toBe('world');
    expect(normalizeWriteData({ key: 'value' })).toBe(
      JSON.stringify({ key: 'value' }, null, 2)
    );
    expect(normalizeWriteData(1n)).toBe('1');
    expect(normalizeWriteData(new Date())).toEqual(expect.any(String));
  });
});
