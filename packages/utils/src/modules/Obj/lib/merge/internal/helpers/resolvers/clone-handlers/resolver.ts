import { Arr } from '../../../../../../../Arr/index.js';
import { clone } from '../../../../../clone/clone.js';
import type {
  CloneStrategy,
  CloneHandler,
  CloneObjectTypeStrategy,
  CloneArrayStrategy
} from '../../../../types/index.js';

export const getCloneHandler = <T>(strategy: CloneStrategy<CloneHandler<T>>): CloneHandler<T> => {
  if (typeof strategy === 'function') return strategy;
  if (strategy === 'none') return (value: T) => value;
  else return (value: T) => clone(value, { strategy });
};
export const getObjectTypeCloneHandler = (
  strategy: Partial<CloneObjectTypeStrategy>,
  def: CloneStrategy<CloneHandler<object>>
) => {
  if (typeof strategy === 'string') return getCloneHandler<object>(strategy);
  const defaultStrategy = getCloneHandler<object>(strategy.default ?? def);
  return (value: object) => (strategy[value.constructor.name] ?? defaultStrategy)(value);
};
export const getArrayCloneHandler = (strategy: CloneArrayStrategy): CloneHandler<Arr.Arr> => {
  if (typeof strategy === 'function') return strategy;
  else if (strategy === 'none') return (value: Arr.Arr) => value;
  else return (value: Arr.Arr) => Arr.clone(value, strategy);
};
