import { createFsFromVolume, Volume } from 'memfs';
import { vi } from 'vitest';

import { wrapMockExport } from '../../../core/core.js';

type ResetFsFunction = (files?: Record<string, string>) => void;

const vol = Volume.fromJSON({});
const memfs = createFsFromVolume(vol);

const resetFs: ResetFsFunction = (files = {}) => {
  vol.reset();
  vol.fromJSON(files);
};
export const MEM_FS = Symbol('MEM_FS');
/**
 * Mocked file system module using memfs.
 * Provides a reset function to clear the file system state.
 */
export const fs = wrapMockExport(memfs, {
  chmod: vi.fn().mockResolvedValue(undefined),
  log: () => console.dir(vol.toJSON(), { depth: Infinity }),
  promises: wrapMockExport(memfs.promises, {
    chmod: vi.fn().mockResolvedValue(undefined),
    log: () => console.dir(vol.toJSON(), { depth: Infinity }),
    reset: resetFs,
    toJSON: () => vol.toJSON(),
    [MEM_FS]: true
  }),
  reset: resetFs,
  toJSON: () => vol.toJSON(),
  [MEM_FS]: true
});
