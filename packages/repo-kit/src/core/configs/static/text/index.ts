export * as gitignore from './gitignore.js';
export * as pnpmWorkspace from './pnpm-workspace.js';
export * from './husky/index.js';

import * as gitignore from './gitignore.js';
import { husky } from './husky/index.js';
import * as pnpmWorkspace from './pnpm-workspace.js';

export const text = { gitignore, husky, pnpmWorkspace } as const;
export type TextConfigs = typeof text;
export type TextConfig = keyof TextConfigs;
