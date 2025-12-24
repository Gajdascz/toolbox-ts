import { createForbiddenRule } from '../../factory/forbidden-rule-factory.js';
export default createForbiddenRule(
  'optional-deps-used',
  'This module depends on an npm package that is declared as an optional dependency '
    + "in your package.json. As this makes sense in limited situations only, it's flagged here. "
    + "If you're using an optional dependency here by design - add an exception to your"
    + 'dependency-cruiser configuration.',
  { to: { dependencyTypes: ['npm-optional'] } }
);
