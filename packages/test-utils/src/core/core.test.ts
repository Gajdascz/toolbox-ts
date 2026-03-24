vi.mock('virtual-mod-success', () => wrapMockExport({ ok: true }));
vi.mock('virtual-mod-validate', () => wrapMockExport({ val: 1 }));
vi.mock('virtual-exists-mod', () => ({ value: 42 }));
vi.mock('not-a-module', () => {
  throw new Error('Module not found');
});
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  assertMockedEnv,
  dependencyExists,
  isMocked,
  mockEnvErr,
  mockKeys,
  recursiveReset,
  wrapMockExport
} from './core.js';

describe('test-utils core', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('wrapMockExport creates a mocked module shape and isMocked recognizes it', () => {
    const orig = { foo: 'bar', num: 1 };
    const mocked = wrapMockExport(orig);
    // basic shape
    expect((mocked as any).__esModule).toBe(true);
    expect((mocked as any).default).toBeTruthy();
    expect((mocked as any).default.foo).toBe('bar');
    // isMocked should detect the special wrapped token
    expect(isMocked(mocked as any)).toBe(true);
    // plain object is not mocked
    expect(isMocked({} as any)).toBe(false);
  });

  it('mockEnvErr returns a helpful message containing the description', () => {
    const msg = mockEnvErr('my-mod');
    expect(msg).toContain('my-mod');
    expect(msg).toMatch(/TEST ENV ERROR/);
  });
  describe('assertMockedEnv', () => {
    it('resolves when modules are mocked and validate passes', async () => {
      await expect(
        assertMockedEnv([
          {
            description: 'virtual success',
            modulePath: 'virtual-mod-success',
            validate: (m: Record<string, unknown>) => {
              // verify we actually received the mocked shape
              return isMocked(m) ? true : 'not mocked';
            }
          }
        ])
      ).resolves.toBeUndefined();
    });

    it('throws when module cannot be imported or not mocked', async () => {
      // module not mocked / doesn't exist -> should throw with our mockEnvErr
      await expect(
        assertMockedEnv([{ description: 'missing', modulePath: 'non-existent-module' }])
      ).rejects.toThrow(/not mocked/);
    });

    it('throws when validate returns an error string', async () => {
      await expect(
        assertMockedEnv([
          {
            description: 'validate fails',
            modulePath: 'virtual-mod-validate',
            validate: () => 'validation failed'
          }
        ])
      ).rejects.toThrow('validation failed');
    });
    it('skips validate if not provided', async () => {
      await expect(
        assertMockedEnv([{ description: 'no validate', modulePath: 'virtual-mod-success' }])
      ).resolves.toBeUndefined();
    });
  });
  describe('recursiveReset', () => {
    it('walks object graph and calls mockReset on functions (handles cycles)', () => {
      const fnA = (() => {}) as any;
      const fnB = (() => {}) as any;
      fnA.mockReset = vi.fn();
      fnB.mockReset = vi.fn();

      const obj: any = { a: fnA, nested: { b: fnB } };
      // circular reference
      obj.self = obj;
      obj.nested.parent = obj;

      // call recursiveReset and assert both mockReset spies were called
      recursiveReset(obj);
      expect(fnA.mockReset).toHaveBeenCalled();
      expect(fnB.mockReset).toHaveBeenCalled();
    });
    it('handles non-function properties and ignores already seen objects', () => {
      const obj: any = { num: 1, str: 'test', arr: [1, 2], nested: { val: 'nested' } };
      // circular reference
      obj.self = obj;

      // Should not throw and should not modify non-function properties
      expect(() => recursiveReset(obj)).not.toThrow();
      expect(obj.num).toBe(1);
      expect(obj.str).toBe('test');
      expect(obj.arr).toEqual([1, 2]);
      expect(obj.nested.val).toBe('nested');
    });
  });

  describe('dependencyExists', () => {
    it('returns true for importable modules and false otherwise', async () => {
      await expect(dependencyExists('virtual-exists-mod')).resolves.toBe(true);
      // non-existing module -> should return false and not throw
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      await expect(dependencyExists('not-a-module', true)).resolves.toBe(false);
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });
    it('should skip logging when log is false', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      await expect(dependencyExists('not-a-module')).resolves.toBe(false);
      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
    });
  });

  it('mockKeys returns an object of mocked functions keyed by provided keys', () => {
    const keys = ['one', 'two'] as const;
    const mk = mockKeys([...keys]);
    expect(Object.keys(mk)).toEqual(['one', 'two']);
    expect(typeof mk.one).toBe('function');
    // ensure the mocks have mockReset available (vi.fn)
    expect(typeof (mk.one as any).mockReset).toBe('function');
    // calling a mock increments its call count
    (mk.one as any)('x');
    expect((mk.one as any).mock.calls.length).toBe(1);
  });
});
