import { describe, expect, it, vi } from 'vitest';

import type { InputConfig } from '../../../config/index.ts';
import type { BaseConfig } from '../defaults.ts';

import { defaultConfig } from '../defaults.ts';
import { loadConfig } from '../loader.ts';
import * as resolve from './resolver.ts';

vi.mock('../loader.ts', () => ({ loadConfig: vi.fn() }));

vi.mock('../defaults.ts', async (importActual) => {
  const actual = await importActual<BaseConfig>();
  return vi.mockObject({
    ...actual,
    defaultConfig: {
      ...(actual as any).defaultConfig,
      extends: ['default-config-1', 'default-config-2']
    }
  });
});
const mockLoadConfig = vi.mocked(loadConfig);

describe('extends', () => {
  it('returns config untouched when no extends present', async () => {
    const input: InputConfig = {
      ...defaultConfig,
      extends: [],
      options: { ruleSet: {} }
    };
    const res = await resolve.extends(input);
    expect(res).toEqual(input);
  });
  it('throws when an extends cannot be loaded', async () => {
    mockLoadConfig.mockResolvedValueOnce(undefined);
    const input: InputConfig = {
      ...defaultConfig,
      extends: 'non-existing-config',
      options: { ruleSet: {} }
    };
    await expect(() => resolve.extends(input)).rejects.toThrow(
      `Failed to load extended config 'non-existing-config'`
    );
  });
  it('throws on circular extends', async () => {
    mockLoadConfig.mockResolvedValue({
      extends: 'some-config',
      options: { ruleSet: {} }
    } as any);
    const input: InputConfig = {
      ...defaultConfig,
      extends: 'some-config',
      options: { ruleSet: {} }
    };
    await expect(() => resolve.extends(input)).rejects.toThrow(
      `Circular reference detected in extends: some-config`
    );
  });
});
describe('inputConfig', () => {
  it('returns input when input is an object', async () => {
    const input: InputConfig = { options: { ruleSet: {} } };
    const res = await resolve.inputConfig(input);
    expect(res).toEqual(input);
  });
  it('returns empty object when input is undefined', async () => {
    const res = await resolve.inputConfig(undefined);
    expect(res).toEqual({});
  });
  it('throws when input is a string but cannot be loaded', async () => {
    mockLoadConfig.mockResolvedValueOnce(undefined);
    await expect(() => resolve.inputConfig('non-existing')).rejects.toThrow(
      `Failed to load config from non-existing`
    );
  });
  it('returns loaded config when input is a string', async () => {
    const input: InputConfig = { options: { ruleSet: {} } };
    mockLoadConfig.mockResolvedValueOnce(input);
    const res = await resolve.inputConfig('some-path');
    expect(res).toEqual(input);
  });
});
describe('ruleSet', () => {
  it('combines ruleSet from config with forbidden/allowed/required/allowedSeverity from root', () => {
    const base: InputConfig = {
      forbidden: { noOrphans: true },
      allowed: [{ from: {}, to: {}, comment: 'allowed-root' }],
      allowedSeverity: 'error',
      required: [{ comment: 'required-root', to: {}, module: {} }],
      options: {
        ruleSet: {
          forbidden: [{ name: 'forbidden-in-ruleset', from: {}, to: {} }],
          allowed: [{ from: {}, to: {}, comment: 'allowed-in-ruleset' }],
          allowedSeverity: 'warn',
          required: [{ to: {}, comment: 'required-in-ruleset', module: {} }]
        }
      }
    };
    const res = resolve.ruleSet(base);
    expect(res.forbidden).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'no-orphans' }),
        expect.objectContaining({ name: 'forbidden-in-ruleset' })
      ])
    );
    expect(res.allowed).toEqual([
      { to: {}, comment: 'allowed-in-ruleset', from: {} },
      { to: {}, comment: 'allowed-root', from: {} }
    ]);
    expect(res.allowedSeverity).toBe('error');
    expect(res.required).toEqual([
      { to: {}, comment: 'required-in-ruleset', module: {} },
      { to: {}, comment: 'required-root', module: {} }
    ]);
  });
  it('fallbacks to empty arrays', () => {
    const base: InputConfig = { options: { ruleSet: {} } };
    const res = resolve.ruleSet(base);
    expect(res.allowed).toEqual([]);
    expect(res.allowedSeverity).toBe('warn');
    expect(res.required).toEqual([]);
  });
});
describe('config', () => {
  it('returns merged config (defaults < extended(s) < input < flags)', async () => {
    // prepare which default extends exist (may be undefined / string / array)
    const defaultExts =
      Array.isArray(defaultConfig.extends) ? defaultConfig.extends
      : defaultConfig.extends ? [defaultConfig.extends]
      : [];

    mockLoadConfig.mockImplementation((p: string) => {
      if (defaultExts.includes(p)) {
        return {
          options: { ruleSet: { forbidden: [{ name: 'from-default-config' }] } }
        } as any;
      }
      if (p === 'test/configs/extends/depcruiser.extends.input.js') {
        return {
          options: {
            ruleSet: { forbidden: [{ name: 'from-extended-config-1' }] }
          }
        } as any;
      }
      return undefined; // do not fabricate a second extended config
    });

    const input: InputConfig = {
      extends: 'test/configs/extends/depcruiser.extends.input.js',
      options: {
        ruleSet: { allowed: [{ from: {}, to: {}, comment: 'fromInput' }] }
      }
    };

    const flags = { moduleSystems: 'systemjs,cjs' };

    const result = await resolve.config({ input, flags });

    expect(result.cruiseOptions.moduleSystems).toEqual(['cjs']);

    expect(result.cruiseOptions).toHaveProperty('ruleSet');
    expect(result.cruiseOptions.ruleSet.allowed).toEqual([
      { from: {}, to: {}, comment: 'fromInput' }
    ]);

    const names = result.cruiseOptions.ruleSet.forbidden.map(
      (r: any) => r.name
    );
    expect(names).toContain('from-extended-config-1');
    if (defaultExts.length > 0) {
      expect(names).toContain('from-default-config');
    }
  });
});
