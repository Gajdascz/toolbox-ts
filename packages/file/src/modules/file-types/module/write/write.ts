/* c8 ignore start */
import { tryWriteFile as tryWf } from '../../../helpers/index.js';
import { unwrap } from '../../../result.js';
import type { WriteFileOptions } from '../types.js';

export const tryWriteFile = async <D = unknown>(
  filePath: string,
  data: D,
  opts: WriteFileOptions<D>
) => tryWf(filePath, data, { ...opts, fileType: 'module' });

//#region> Unwrapped
/* c8 ignore start */
/** @see {@link tryWriteFile} */
export const writeFile = async <D = unknown>(
  filePath: string,
  data: D,
  opts: WriteFileOptions<D>
) => unwrap(await tryWriteFile(filePath, data, opts));
/* c8 ignore stop */
//#endregion
