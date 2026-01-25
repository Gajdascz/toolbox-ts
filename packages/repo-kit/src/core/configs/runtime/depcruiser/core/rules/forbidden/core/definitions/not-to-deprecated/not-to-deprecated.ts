import { createForbiddenRule } from '../../factory/forbidden-rule-factory.js';
export default createForbiddenRule(
  'not-to-deprecated',
  'This module uses a (version of an) npm module that has been deprecated. Either upgrade to a later '
    + 'version of that module, or find an alternative. Deprecated modules are a security risk.',
  { to: { dependencyTypes: ['deprecated'] } }
);
