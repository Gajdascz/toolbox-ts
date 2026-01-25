export * from './json/index.js';
export * from './text/index.js';

import { text } from './text/index.js';
import { json } from './json/index.js';

export const staticConfigs = { text, json } as const;
