import type { InputConfig } from '../../config/index.js';

// Does nothing, just returns what it's given
/* c8 ignore start */
/**
 * Utility function for defining a configuration file.
 *
 * - Does not resolve the config, use `resolveConfig` for that.
 */
export const config = (
  input: Partial<InputConfig> = {}
): Partial<InputConfig> => input;
/* c8 ignore end */
