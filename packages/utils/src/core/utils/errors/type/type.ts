import { resolveTypeName } from '../utils/utils.js';

/**
 * Creates a TypeError with a standardized message format.
 *
 * Starts with:
 * - single expected type: "Expected \<received type\> to be of type \<expected type\>".
 * - multiple expected type: "Expected \<received type\> to be one of type [\<expected types\>]".
 */
export function createTypeError(
  expected: string | string[],
  received: (() => string) | unknown,
  rest?: string
): TypeError {
  return new TypeError(
    `Expected ${typeof received !== 'function' ? resolveTypeName(received) : (received as () => string)()} to be ${Array.isArray(expected) ? `one of type [${expected.join(', ')}]` : `of type ${expected}`}${rest ? ` ${rest}` : ''}`
  );
}
