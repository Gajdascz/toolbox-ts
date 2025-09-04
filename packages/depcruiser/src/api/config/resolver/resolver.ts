import { Obj } from '@toolbox-ts/utils';

import type { flags, InputConfig } from '../../../config/index.js';

import { type BaseConfig, defaultConfig } from '../defaults.js';
import { loadConfig } from '../loader.js';
import { resolveFlags } from './flags/index.js';
import { resolveForbiddenRules } from './forbidden-rules/index.js';
import { type ResolvedOptions, resolveOptions } from './options/index.js';

export interface ResolveConfigArgs {
  flags?: Partial<flags.ParsedResult>;
  input?: InputConfig | string;
}
const normalizeExtends = (exts?: string | string[]) =>
  !exts ? []
  : Array.isArray(exts) ? exts
  : [exts];
/**
 * Recursively resolves `extends` chains, deepest base first,
 * local config always overriding extended ones.
 */
const _extends = async (
  config: BaseConfig | InputConfig,
  visited = new Set<string>()
): Promise<BaseConfig> => {
  const exts = normalizeExtends(config.extends);

  let merged: BaseConfig = { ...config, extends: [] } as BaseConfig;

  for (const ext of exts) {
    if (visited.has(ext))
      throw new Error(`Circular reference detected in extends: ${ext}`);
    const nextVisited = new Set(visited).add(ext);

    const loaded = await loadConfig(ext);
    if (!loaded) throw new Error(`Failed to load extended config '${ext}'`);

    const resolved = await _extends(loaded, nextVisited);
    merged = Obj.merge(resolved, merged, { array: { behavior: 'append' } });
  }

  return merged;
};

export const inputConfig = async (
  input?: InputConfig | string
): Promise<InputConfig> => {
  if (typeof input === 'string') {
    const loaded = await loadConfig(input);
    if (!loaded) throw new Error(`Failed to load config from ${input}`);
    return loaded;
  }
  return input ?? {};
};

export const ruleSet = (cfg: InputConfig) => ({
  ...cfg.options?.ruleSet,
  forbidden: [
    ...(cfg.options?.ruleSet?.forbidden ?? []),
    ...resolveForbiddenRules(cfg.forbidden, cfg.extendForbidden)
  ],
  allowed: [...(cfg.options?.ruleSet?.allowed ?? []), ...(cfg.allowed ?? [])],
  allowedSeverity:
    cfg.allowedSeverity ?? cfg.options?.ruleSet?.allowedSeverity ?? 'warn',
  required: [...(cfg.options?.ruleSet?.required ?? []), ...(cfg.required ?? [])]
});

/**
 * Fully resolves config:
 * 1. Merge default + input
 * 2. Resolve `extends`
 * 3. Apply flags
 * 4. Resolve options
 */
export const config = async ({
  input = {},
  flags
}: ResolveConfigArgs): Promise<ResolvedOptions> => {
  const _input = await inputConfig(input);

  // Start from default + input
  let merged = Obj.merge(defaultConfig, _input, {
    array: { behavior: 'overwrite' }
  }) as BaseConfig;

  // Resolve all extends recursively
  merged = await _extends(merged);

  merged.options.ruleSet = ruleSet(merged);

  if (flags) {
    merged.options = Obj.merge(merged.options, resolveFlags(flags), {
      array: { behavior: 'overwrite' }
    });
  }

  return await resolveOptions({ base: merged.options });
};
export { _extends as extends };
