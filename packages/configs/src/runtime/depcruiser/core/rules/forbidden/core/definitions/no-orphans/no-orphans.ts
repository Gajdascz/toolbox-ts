import {
  CONFIG_INFIXED_FILE_STEMS,
  CONFIG_INFIXED_FILES,
  DOT_FILES,
  TS_CONFIG_FILES,
  TS_DECLARATION_FILES
} from '../../../../../patterns.js';
import { createForbiddenRule } from '../../factory/forbidden-rule-factory.js';
export const noOrphans = createForbiddenRule(
  'no-orphans',

  "This is an orphan module - it's likely not used (anymore?). Either use it or " +
    "remove it. If it's logical this module is an orphan (i.e. it's a config file), " +
    'add an exception for it in your dependency-cruiser configuration. By default ' +
    'this rule does not scrutinize dot-files (e.g. .eslintrc.js), TypeScript declaration ' +
    `files (.d.js), tsconfig.json and some .config. infixed files: ${CONFIG_INFIXED_FILE_STEMS.join(', ')}`,
  {
    from: {
      orphan: true,
      pathNot: [DOT_FILES, TS_DECLARATION_FILES, TS_CONFIG_FILES, CONFIG_INFIXED_FILES]
    }
  }
);
