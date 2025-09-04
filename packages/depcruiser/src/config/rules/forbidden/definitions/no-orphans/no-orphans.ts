import { create } from '../../factory/forbidden-rule-factory.js';

export default create(
  'no-orphans',

  "This is an orphan module - it's likely not used (anymore?). Either use it or "
    + "remove it. If it's logical this module is an orphan (i.e. it's a config file), "
    + 'add an exception for it in your dependency-cruiser configuration. By default '
    + 'this rule does not scrutinize dot-files (e.g. .eslintrc.js), TypeScript declaration '
    + 'files (.d.js), tsconfig.json and some of the babel and webpack configs.',
  {
    from: {
      orphan: true,
      pathNot: [
        '(^|/)[.][^/]+[.](?:js|cjs|mjs|ts|cts|mts|json)$', // dot files
        '[.]d[.]ts$', // TypeScript declaration files
        '(^|/)tsconfig[.]json$', // TypeScript config
        '(^|/)(?:babel|webpack)[.]config[.](?:js|cjs|mjs|ts|cts|mts|json)$' // other configs
      ]
    }
  }
);
