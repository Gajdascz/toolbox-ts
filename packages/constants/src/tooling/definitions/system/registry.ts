import type { ToolingRegistry } from '../base/types.js';
import { GIT, MISE } from './entries/index.js';
import { registry } from '../base/factory.js';

const ENTRIES = [...GIT, ...MISE];

export type RegisteredTool = (typeof ENTRIES)[number][0];

export const SYSTEM: ToolingRegistry<RegisteredTool> = registry(ENTRIES);
