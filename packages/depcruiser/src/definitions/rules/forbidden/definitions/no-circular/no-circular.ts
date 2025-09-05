import { create } from '../../factory/forbidden-rule-factory.js';

export default create(
  'no-circular',
  'This dependency is part of a circular relationship. You might want to revise '
    + 'your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ',
  { to: { circular: true } }
);
