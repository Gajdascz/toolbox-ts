import { Arr } from '@toolbox-ts/utils';
import { CommentArray } from 'comment-json';
import type { BuildProp, BuildPropValue } from '../types.js';

const resolveValue = (value: BuildPropValue | BuildPropValue[]) => {
  if (typeof value !== 'object' || value === null) return value;
  if (Array.isArray(value)) {
    const arr = new CommentArray();
    for (const item of value) arr.push(resolveValue(item));
    return arr;
  }
  return build(value);
};
const resolveComment = (key: string, comment: NonNullable<BuildProp['comment']>) => {
  const { type = 'BlockComment', inline = false, value } = comment;
  const symbolName =
    type === 'LineComment' ? `${inline ? 'after-value' : 'before'}:${key}` : `before:${key}`;

  return {
    sym: Symbol.for(symbolName),
    type,
    value:
      type === 'BlockComment' ? Arr.ensure(value).map((v) => `\n   * ${v}\n   `) : comment.value,
    inline
  };
};

/**
 * Builds a JavaScript object from an array of `BuildProp` objects, optionally including comments.
 *
 * @important For BlockComment's the values are automatically formatted with indentation and leading asterisk. Just provide the comment text without any formatting.
 *
 *
 * @example
 * ```ts
 * stringify(build({ key: 'name', value: 'John Doe', comment: { type: 'LineComment', value: 'This is the name' } }))
 * // {
 * //  // This is the name
 * //  name: 'John Doe'
 * // }
 * ```
 */
export function build(...props: BuildProp[]) {
  const obj: Record<string, any> = {};

  for (const p of props) {
    obj[p.key] = resolveValue(p.value);
    if (p.comment) {
      const { sym, ...rest } = resolveComment(p.key, p.comment);
      obj[sym as unknown as string] = [{ ...rest }];
    }
  }

  return obj;
}
