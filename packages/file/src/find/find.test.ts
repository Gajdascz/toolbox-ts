import fs from 'node:fs/promises';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { all, firstDown, firstUp, sync } from './find.js';

const CWD = '/mock';

vi.stubGlobal('process', { ...process, cwd: () => CWD });
const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(CWD);
await fs.mkdir(CWD, { recursive: true });

describe('find utilities', () => {
  it('all() finds all matching files (async) and returns absolute paths', async () => {
    const aDir = path.join(CWD, 'a');
    const bDir = path.join(CWD, 'b', 'sub');
    await fs.mkdir(aDir, { recursive: true });
    await fs.mkdir(bDir, { recursive: true });

    const file1 = path.join(aDir, 'one.ts');
    const file2 = path.join(bDir, 'two.ts');
    const file3 = path.join(bDir, 'skip.js');

    await fs.writeFile(file1, 'x');
    await fs.writeFile(file2, 'y');
    await fs.writeFile(file3, 'z');

    const results = await all('**/*.ts', CWD);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.stringContaining(path.basename(file1)),
        expect.stringContaining(path.basename(file2))
      ])
    );
    expect(results.some((r) => r.endsWith('.js'))).toBe(false);
  });

  it('firstUp() finds file by traversing up and returns absolute path (async)', async () => {
    const root = path.join(CWD, 'proj');
    const nested = path.join(root, 'packages', 'pkg', 'src');
    await fs.mkdir(nested, { recursive: true });
    const marker = path.join(root, 'marker.txt');
    await fs.writeFile(marker, 'ok');
    const found = await firstUp('marker.txt', nested);
    expect(found).toBeTruthy();
    expect(path.resolve(found)).toBe(path.resolve(marker));
  });

  it('firstUp() returns null when not found or when hitting endDir', async () => {
    const root = path.join(CWD, 'sroot');
    const nested = path.join(root, 'x', 'y');
    await fs.mkdir(nested, { recursive: true });
    const found = await firstUp('cfg.json', nested);
    expect(found).toBeNull();
  });

  it('firstDown() finds the first matching file using BFS (async)', async () => {
    const root = path.join(CWD, 'root');
    const child1 = path.join(root, 'child1');
    const child2 = path.join(root, 'child2', 'deep');
    await fs.mkdir(child1, { recursive: true });
    await fs.mkdir(child2, { recursive: true });

    const f1 = path.join(child1, 'file.txt');
    const f2 = path.join(child2, 'file.txt');
    await fs.writeFile(f1, 'a');
    await fs.writeFile(f2, 'b');

    const found = await firstDown('file.txt', root);
    expect(found).toBeTruthy();
    expect(path.resolve(found)).toBe(path.resolve(f1));
  });

  it('sync.all() returns matches synchronously', () => {
    const aDir = path.join(CWD, 'sync-a');
    const bDir = path.join(CWD, 'sync-b');
    fs.mkdir(aDir, { recursive: true });
    fs.mkdir(bDir, { recursive: true });
    const f1 = path.join(aDir, 's1.js');
    const f2 = path.join(bDir, 's2.js');

    return Promise.all([fs.writeFile(f1, '1'), fs.writeFile(f2, '2')]).then(
      () => {
        const results = sync.all('**/*.js', CWD);
        expect(results).toEqual(
          expect.arrayContaining([
            expect.stringContaining('s1.js'),
            expect.stringContaining('s2.js')
          ])
        );
      }
    );
  });

  it('sync.firstUp() resolves relative match to absolute and finds correct file', () => {
    const root = path.join(CWD, 'sroot');
    const nested = path.join(root, 'x', 'y');
    return fs
      .mkdir(nested, { recursive: true })
      .then(() => fs.writeFile(path.join(root, 'cfg.json'), '{}'))
      .then(() => {
        const found = sync.firstUp('cfg.json', nested);
        expect(found).toBeTruthy();
        expect(path.resolve(found)).toBe(
          path.resolve(path.join(root, 'cfg.json'))
        );
      });
  });

  it('sync.firstDown() performs synchronous BFS and finds file', () => {
    const root = path.join(CWD, 'sroot2');
    const child = path.join(root, 'c1');
    const deep = path.join(root, 'c2', 'deep');
    return fs
      .mkdir(child, { recursive: true })
      .then(() => fs.mkdir(deep, { recursive: true }))
      .then(() => fs.writeFile(path.join(deep, 'deepfile.txt'), 'x'))
      .then(() => {
        const found = sync.firstDown('deepfile.txt', root);
        expect(found).toBeTruthy();
        expect(found).toContain('deepfile.txt');
      });
  });
});
