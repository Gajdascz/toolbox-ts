import { create } from '../../factory/forbidden-rule-factory.js';

export default create(
  'not-to-spec',
  'This module depends on a spec (test) file. The sole responsibility of a spec file is to test code. '
    + "If there's something in a spec that's of use to other modules, it doesn't have that single "
    + 'responsibility anymore. Factor it out into (e.g.) a separate utility/ helper or a mock.',
  {
    from: {},
    to: {
      path: ['[.](?:spec|test|bench)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$']
    }
  }
);
