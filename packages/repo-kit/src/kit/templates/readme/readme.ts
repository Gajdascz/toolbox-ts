import { GITHUB_URL, LICENSE_FILE, NPM_URL } from '@toolbox-ts/configs/core';

import {
  CHANGESETS,
  COMMITIZEN,
  COMMITLINT,
  DEPENDENCY_CRUISER,
  HUSKY,
  LINT_STAGED,
  NODEJS,
  PNPM,
  PRETTIER,
  TOOLBOX_TS,
  TSDOC,
  TYPESCRIPT,
  TYPESCRIPT_ESLINT,
  VITEST
} from '../base/data/tooling.ts';
import { MD } from '../base/utils/index.js';

/**
 * Ordered by:
 * 1. Header
 * 2. Installation
 * 3. Body
 * 4. Tooling
 * 5. License
 */
export interface Config {
  body?: string;
  header?: Partial<MD.sections.HeaderOptions>;
  installation?: Partial<MD.sections.InstallationOptions>;
  license?: Partial<MD.sections.LicenseOptions>;
  tooling?: ToolingConfig;
}
const ORG_SCOPE = '@toolbox-ts';
const PKG_NAME = 'repo-kit';
const THIS_PACKAGE = `${ORG_SCOPE}/${PKG_NAME}`;
const TOOLING_SECTIONS = {
  core: { typescript: TYPESCRIPT, pnpm: PNPM, nodejs: NODEJS },
  quality: {
    typescriptEslint: TYPESCRIPT_ESLINT,
    prettier: PRETTIER,
    depcruiser: DEPENDENCY_CRUISER,
    vitest: VITEST,
    tsdoc: TSDOC,
    toolboxTS: TOOLBOX_TS
  },
  versionControl: {
    husky: HUSKY,
    lintStaged: LINT_STAGED,
    commitlint: COMMITLINT,
    commitizen: COMMITIZEN,
    changesets: CHANGESETS
  }
} as const;
export interface ToolingConfig {
  core?: MD.blocks.LinkOptions[];
  optional?: { changesets?: boolean; commitizen?: boolean };
  other?: MD.sections.ToolingOptions['sections'];
  quality?: MD.blocks.LinkOptions[];
  versionControl?: MD.blocks.LinkOptions[];
}
export const DEFAULTS: {
  header: Required<MD.sections.HeaderOptions>;
  installation: MD.sections.InstallationOptions;
  license: Required<MD.sections.LicenseOptions>;
  tooling: Required<ToolingConfig>;
} = {
  header: {
    title: `Generated with ${THIS_PACKAGE}`,
    description: `Repository generated with ${MD.blocks.link({
      text: THIS_PACKAGE,
      url: `${GITHUB_URL}/gajdascz/toolbox-ts/tree/main/packages/${PKG_NAME}`
    })}`,
    hero: { type: 'md', opts: { url: '/.github/assets/toolbox-ts.svg' } },
    badges: [
      {
        type: 'npm',
        opts: {
          type: 'html',
          opts: { scope: ORG_SCOPE, packageName: PKG_NAME }
        }
      }
    ]
  },
  installation: { packageName: THIS_PACKAGE, isDev: true, separator: true },
  license: {
    type: 'MIT',
    urls: [
      { text: 'GitHub', url: GITHUB_URL + `/gajdascz/toolbox-ts` },
      { text: 'NPM', url: NPM_URL + `/package/${ORG_SCOPE}` }
    ],
    linkToFile: `/${LICENSE_FILE}`,
    year: new Date().getFullYear(),
    separator: false,
    owner: { text: 'Nolan Gajdascz', url: 'https://github.com/gajdascz' },
    title: {}
  },
  tooling: {
    core: Object.values(TOOLING_SECTIONS.core),
    quality: Object.values(TOOLING_SECTIONS.quality),
    versionControl: [
      TOOLING_SECTIONS.versionControl.commitlint,
      TOOLING_SECTIONS.versionControl.husky,
      TOOLING_SECTIONS.versionControl.lintStaged
    ],
    optional: { commitizen: false, changesets: false },
    other: {}
  }
} as const;
export const getTemplate = ({
  header: hdr,
  installation: inst,
  license: lic,
  body,
  tooling: tool = {}
}: Config) => {
  const {
    core = [],
    optional = {},
    other = {},
    quality = [],
    versionControl = []
  } = tool;
  if (optional.commitizen)
    versionControl.push(TOOLING_SECTIONS.versionControl.commitizen);
  if (optional.changesets)
    versionControl.push(TOOLING_SECTIONS.versionControl.changesets);
  return `${MD.sections.header({ ...DEFAULTS.header, ...hdr })}


${MD.sections.installation({ ...DEFAULTS.installation, ...inst })}
${body ? `\n\n${body}` : ''}
\n\n${MD.sections.tooling({
    sections: {
      core: [...DEFAULTS.tooling.core, ...core],
      quality: [...DEFAULTS.tooling.quality, ...quality],
      versionControl: [...DEFAULTS.tooling.versionControl, ...versionControl],
      ...other
    }
  })}


${MD.sections.license({ ...DEFAULTS.license, ...lic })}
`;
};
