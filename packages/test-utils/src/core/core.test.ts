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

  it('assertMockedEnv resolves when modules are mocked and validate passes', async () => {
    // create a virtual module that is mocked
    vi.mock('virtual-mod-success', () => wrapMockExport({ ok: true }));
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

  it('assertMockedEnv throws when module cannot be imported or not mocked', async () => {
    // module not mocked / doesn't exist -> should throw with our mockEnvErr
    await expect(
      assertMockedEnv([
        { description: 'missing', modulePath: 'non-existent-module' }
      ])
    ).rejects.toThrow(/not mocked/);
  });

  it('assertMockedEnv throws when validate returns an error string', async () => {
    vi.mock('virtual-mod-validate', () => wrapMockExport({ val: 1 }));
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

  it('recursiveReset walks object graph and calls mockReset on functions (handles cycles)', () => {
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

  it('dependencyExists returns true for importable modules and false otherwise', async () => {
    // virtual module that exists
    vi.mock('virtual-exists-mod', () => ({ value: 42 }));
    await expect(dependencyExists('virtual-exists-mod')).resolves.toBe(true);

    // non-existing module -> should return false and not throw
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await expect(
      dependencyExists('definitely-not-a-module', true)
    ).resolves.toBe(false);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
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
