import { Arr } from '@toolbox-ts/utils';
import { URLS } from '@toolbox-ts/constants';
import { GLOBS, FILES } from '@toolbox-ts/constants/fs';
import type { ProcessedConfig, Defaults, InputConfig } from './types.js';
import { runtimeConfigToFileContent, serializeJson } from '../../../helpers.js';

export const DEFAULTS: Defaults = {
  $schema: URLS.SCHEMA_MDLINT_CLI2,
  ignores: [
    GLOBS.match.stem(FILES.STEMS.MD.CHANGELOG),
    GLOBS.DIR.NODE_MODULES.DEEP,
    GLOBS.DIR.ARTIFACTS.DEEP
  ],
  globs: [GLOBS.FILE.MD.DEEP],
  config: {
    MD033: {
      allowed_elements: [
        'address',
        'article',
        'aside',
        'base',
        'basefont',
        'blockquote',
        'body',
        'caption',
        'center',
        'col',
        'colgroup',
        'dd',
        'details',
        'dialog',
        'dir',
        'div',
        'dl',
        'dt',
        'fieldset',
        'figcaption',
        'figure',
        'footer',
        'form',
        'frame',
        'frameset',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'head',
        'header',
        'hr',
        'html',
        'iframe',
        'legend',
        'li',
        'link',
        'main',
        'menu',
        'menuitem',
        'nav',
        'noframes',
        'ol',
        'optgroup',
        'option',
        'p',
        'param',
        'section',
        'source',
        'summary',
        'table',
        'tbody',
        'td',
        'tfoot',
        'th',
        'thead',
        'title',
        'b',
        'tr',
        'track'
      ]
    },
    MD013: false
  }
} as const;

export const FILE_NAME = FILES.CONFIG.MD_LINT;
export const define = ({
  globs = [],
  ignores = [],
  config = {},
  ...rest
}: InputConfig = {}): ProcessedConfig => ({
  $schema: DEFAULTS.$schema,
  globs: Arr.mergeUnique(globs, DEFAULTS.globs),
  ignores: Arr.mergeUnique(ignores, DEFAULTS.ignores),
  config: { ...DEFAULTS.config, ...config },
  ...rest
});
export const toFileContent = (config?: InputConfig) =>
  runtimeConfigToFileContent('markdownlint', [serializeJson(config)]);

export const toFileEntry = (config?: InputConfig) => ({
  [FILES.CONFIG.MD_LINT]: toFileContent(config)
});
