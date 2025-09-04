import type { ConfigWithExtendsArray } from '@eslint/config-helpers';

import { defineConfig as defCfg } from 'eslint/config';

import type { BaseCfg } from '../base/types.js';

/* c8 ignore start */
import {
  configs,
  create,
  type CreateInput,
  DEFAULT_CONFIG_ORDER,
  type DefaultBaseConfigName
} from '../base/index.js';
/* c8 ignore end */

export interface DefineConfigInput {
  custom?: Record<string, CreateInput<string>>;
  defaults?: boolean | DefaultOverrides | undefined;
}

type DefaultOverrides = {
  [K in DefaultBaseConfigName]?: boolean | Omit<Partial<BaseCfg<K>>, 'name'>;
};
export const defineConfig = ({
  custom = {},
  defaults
}: DefineConfigInput = {}) => {
  /* c8 ignore start */
  const result: ConfigWithExtendsArray = [configs.__root];
  if (defaults === true || defaults === undefined)
    result.push(
      create({ base: configs.build }),
      create({ base: configs.dev }),
      create({ base: configs.test })
    );
  else if (defaults !== false) {
    /* c8 ignore end */
    for (const key of DEFAULT_CONFIG_ORDER) {
      const provided = defaults[key];
      if (provided === false) continue;
      result.push(
        create({
          base: configs[key],
          ...(provided === true ? {} : { cfg: provided })
        })
      );
    }
  }

  for (const key in custom)
    result.push(create({ base: custom[key].base, cfg: custom[key].cfg ?? {} }));

  return defCfg(result);
};
