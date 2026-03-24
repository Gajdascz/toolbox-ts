import type { NpmPackageRegistry } from './types.js';
import {
  CHANGESETS,
  COMMITLINT,
  MARKDOWNLINT,
  OXC,
  RIMRAF,
  TYPESCRIPT,
  DEPCRUISER,
  VITEST,
  HUSKY,
  LINT_STAGED,
  TOOLBOX_TS
} from './entries/index.js';
import { registry } from '../base/factory.js';

const ENTRIES = [
  ...COMMITLINT,
  ...HUSKY,
  ...DEPCRUISER,
  ...LINT_STAGED,
  ...CHANGESETS,
  ...MARKDOWNLINT,
  ...OXC,
  ...RIMRAF,
  ...TYPESCRIPT,
  ...VITEST,
  ...TOOLBOX_TS
];

export type RegisteredNpmPackage = (typeof ENTRIES)[number][0];

export const NPM: NpmPackageRegistry<RegisteredNpmPackage> = registry(ENTRIES);
