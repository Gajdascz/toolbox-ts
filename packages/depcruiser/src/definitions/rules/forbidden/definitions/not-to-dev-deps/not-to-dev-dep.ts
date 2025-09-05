import { create } from '../../factory/forbidden-rule-factory.js';

export default create(
  'not-to-dev-dep',
  "This module depends on an npm package from the 'devDependencies' section of your "
    + 'package.json. It looks like something that ships to production, though. To prevent problems '
    + "with npm packages that aren't there on production declare it (only!) in the 'dependencies'"
    + 'section of your package.json. If this module is development only - add it to the '
    + 'from.pathNot re of the not-to-dev-dep rule in the dependency-cruiser configuration',
  {
    from: {
      path: ['^(src)'],
      pathNot: ['[.](?:spec|test|bench)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$']
    },
    to: {
      dependencyTypes: ['npm-dev'],
      dependencyTypesNot: ['type-only'],
      pathNot: ['node_modules/@types/']
    }
  }
);
