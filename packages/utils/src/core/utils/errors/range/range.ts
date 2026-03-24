import { create } from '../../../../modules/Str/lib/indentation/indentation.js';
import { resolveTypeName } from '../utils/index.js';

const indent = create();

interface CreateNumRangeErrorOpts {
  inclusive: boolean;
  max: number;
  min: number;
}
export function createNumRangeError(
  type: string,
  receivedValue: unknown,
  opts: CreateNumRangeErrorOpts
): RangeError {
  const { inclusive, max, min } = opts;
  if (min > max)
    throw new RangeError(
      indent(
        [
          ['Invalid range options provided to createNumRangeError:', 0],
          [`min (${min}) cannot be greater than max (${max})`, 1]
        ],
        'all'
      )
    );
  const parens = inclusive ? ['[', ']'] : ['(', ')'];
  const parts = [`Range Type: ${type}${indent.eolChar}`];
  const rangeStr = `within the ${inclusive ? 'inclusive' : 'exclusive'} range ${parens[0]}${min}, ${max}${parens[1]}`;
  if (typeof receivedValue !== 'number')
    parts.push(
      indent(
        `expected a number value, ${rangeStr}, but received a ${resolveTypeName(receivedValue)}`,
        1,
        true
      )
    );
  else {
    const inclusiveBounds = inclusive
      ? { workingMin: min, workingMax: max }
      : { workingMin: min + 1, workingMax: max - 1 };

    const { workingMin, workingMax } = inclusiveBounds;

    const isUnder = receivedValue < workingMin;
    const isOver = receivedValue > workingMax;

    // in-range → error
    if (!isUnder && !isOver) {
      throw new TypeError(
        `Value ${receivedValue} ${rangeStr}, creating a range error would be incorrect.`
      );
    }

    // compute diff against working bounds
    const diff = isOver ? receivedValue - workingMax : workingMin - receivedValue;

    const is = isOver ? 'over' : 'under';
    const diffStr = `${is} by ${diff}`;

    parts.push(indent(`expected ${receivedValue} to be ${rangeStr}, but is ${diffStr}`, 1, true));
  }

  return new RangeError(parts.join(''));
}
