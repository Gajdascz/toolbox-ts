import { create } from '../../factory/forbidden-rule-factory.js';

export default create(
  'peer-deps-used',
  'This module depends on an npm package that is declared as a peer dependency '
    + 'in your package.json. This makes sense if your package is e.g. a plugin, but in '
    + 'other cases - maybe not so much. If the use of a peer dependency is intentional '
    + 'add an exception to your dependency-cruiser configuration.',
  { to: { dependencyTypes: ['npm-peer'] } }
);
