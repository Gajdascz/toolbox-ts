/* c8 ignore start */
import { createJiti } from 'jiti';
import type { LoadOptions } from './types.js';

export const jiti = createJiti(import.meta.url);

/**
 * Loads a module from a given path and returns its exports.
 */
export const load = <T = unknown>(p: string, opts?: LoadOptions): Promise<T> =>
  jiti.import<T>(p, opts);
/* c8 ignore stop */
