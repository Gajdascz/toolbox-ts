import { create } from '../../factory/forbidden-rule-factory.js';

export default create(
  'no-duplicate-dep-types',
  "Likely this module depends on an external ('npm') package that occurs more than once "
    + 'in your package.json i.e. bot as a devDependencies and in dependencies. This will cause '
    + 'maintenance problems later on.',
  { to: { dependencyTypesNot: ['type-only'], moreThanOneDependencyType: true } }
);
