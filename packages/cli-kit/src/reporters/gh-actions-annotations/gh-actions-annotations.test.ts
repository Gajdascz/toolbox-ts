import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type Message, Reporter } from './gh-actions-annotations.js';

describe('gh-actions Reporter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.GITHUB_WORKSPACE;
  });
  it('buildAnnotation includes relative file/line/col/title when file provided', () => {
    const wsRoot = path.resolve('/some/workspace');
    const filePath = path.join(wsRoot, 'src', 'file.ts');
    const adapter = () =>
      ({
        file: filePath,
        line: 7,
        col: 2,
        title: 'T',
        message: 'hello',
        type: 'error'
      }) as Message;
    const r = new Reporter(adapter);
    const ann = (r as any).buildAnnotation(adapter(), {
      workspaceRoot: wsRoot
    });

    expect(ann.startsWith('::error')).toBe(true);
    expect(ann).toContain('file=src/file.ts');
    expect(ann).toContain('line=7');
    expect(ann).toContain('col=2');
    expect(ann).toContain('title=T');
    expect(ann).toContain('::hello');
  });
  it('format returns array of annotation strings for single and multiple items', () => {
    const adapter = (i: { id: number }) =>
      ({ message: `m${i.id}`, type: 'notice' }) as Message;
    const r = new Reporter(adapter);
    const single = r.format({ id: 1 });
    expect(Array.isArray(single)).toBe(true);
    expect(single).toHaveLength(1);
    expect(single[0]).toContain('m1');

    const many = r.format([{ id: 2 }, { id: 3 }]);
    expect(many).toHaveLength(2);
    expect(many[0]).toContain('m2');
    expect(many[1]).toContain('m3');
  });

  it('resolveWorkspaceRoot uses GITHUB_WORKSPACE when set and falls back to cwd', () => {
    const r = new Reporter(() => ({ message: '', type: 'notice' }));
    process.env.GITHUB_WORKSPACE = '/some/ws';
    expect((r as any).resolveWorkspaceRoot(undefined)).toBe('/some/ws');
    delete process.env.GITHUB_WORKSPACE;
    expect((r as any).resolveWorkspaceRoot(undefined)).toBe(process.cwd());
  });

  it('stringify concatenates header and footer around annotations', () => {
    const adapter = () => ({ message: 'ok', type: 'notice' }) as Message;
    const r = new Reporter(adapter);
    const s = r.stringify(adapter(), { header: 'H', footer: 'F' });
    expect(s).toContain('H');
    expect(s).toContain('F');
    // header should be first line
    expect(s.split('\n')[0]).toBe('H');
  });

  it('toJson and toObject group messages by notice type and call adapter for each item', () => {
    const calls: any[] = [];
    const adapter = vi.fn((i: any) => {
      // record call param and return a message derived from it
      calls.push(i);
      return {
        file: i.file,
        line: i.line,
        message: i.msg,
        title: i.t,
        type: i.type as Message['type']
      } as Message;
    });

    const r = new Reporter(adapter);
    const items = [
      { file: '/w/a.ts', line: 1, msg: 'a', t: 'A', type: 'error' },
      { file: '/w/b.ts', line: 2, msg: 'b', t: 'B', type: 'warning' },
      { file: '/w/c.ts', line: 3, msg: 'c', t: 'C', type: 'notice' },
      { file: '/w/d.ts', line: 4, msg: 'd', t: 'D', type: 'debug' }
    ];

    const obj = r.toObject(items, { workspaceRoot: '/w' });
    // adapter is called twice per item in toObject implementation
    expect(adapter).toHaveBeenCalledTimes(items.length * 2);
    expect(Object.keys(obj).sort()).toEqual(
      ['debug', 'error', 'notice', 'warning'].sort()
    );
    expect(obj.error).toHaveLength(1);
    expect(obj.warning).toHaveLength(1);
    expect(obj.notice).toHaveLength(1);
    expect(obj.debug).toHaveLength(1);

    const j = r.toJson(items, { workspaceRoot: '/w' });
    const parsed = JSON.parse(j);
    expect(parsed.error).toBeDefined();
    expect(parsed.error[0].message).toBe('a');
  });
  describe('parseAnnotations', () => {
    const r = new Reporter(() => ({ message: '', type: 'notice' }));

    it('parses a single annotation string', () => {
      const str =
        '::warning file=a%25.js,line=10,col=5,title=Test::This is a test';
      const res = r.parseAnnotations(str);
      expect(res).toHaveLength(1);
      expect(res[0]).toEqual({
        type: 'warning',
        file: 'a%.js',
        line: 10,
        col: 5,
        title: 'Test',
        message: 'This is a test'
      });
    });
    it('parses multiple annotation strings', () => {
      const annotations = [
        '::notice file=src/file.js,line=10,col=5,title=Test::This is a test',
        '::warning file=src/other.js,line=20,col=15,title=Warning::This is a warning'
      ];
      const msgs = r.parseAnnotations(annotations);
      expect(msgs).toHaveLength(2);
      expect(msgs[0].type).toBe('notice');
      expect(msgs[0].file).toBe('src/file.js');
      expect(msgs[0].line).toBe(10);
      expect(msgs[0].col).toBe(5);
      expect(msgs[0].title).toBe('Test');
      expect(msgs[0].message).toBe('This is a test');

      expect(msgs[1].type).toBe('warning');
      expect(msgs[1].file).toBe('src/other.js');
      expect(msgs[1].line).toBe(20);
      expect(msgs[1].col).toBe(15);
      expect(msgs[1].title).toBe('Warning');
      expect(msgs[1].message).toBe('This is a warning');
    });
    it('throws on invalid annotation string', () => {
      const str = '::invalidThis is not valid';
      expect(() => r.parseAnnotations(str)).toThrow();
    });
    it('throws on unknown annotation type', () => {
      const str =
        '::unknown file=a.js,line=10,col=5,title=Test::This is a test';
      expect(() => r.parseAnnotations(str)).toThrow(
        'Unknown annotation type: unknown'
      );
    });
    it('parses omits non-provided fields', () => {
      const str = '::notice file=a.js,title=Test::This is a test';
      const res = r.parseAnnotations(str);
      expect(res).toHaveLength(1);
      expect(res[0].line).toBe(undefined);
      expect(res[0].col).toBe(undefined);
    });
  });
});
