import { EOL } from 'node:os';

const SPACE = ' ' as const;

export interface IndentLineOpts {
  /**
   * The end-of-line character to use
   * @default EOL
   */
  eolChar?: string;
  /**
   * The number of unitChars to use per indent level
   * - Each indent is made up of `indentSize` number of `unitChar` characters times the level. (e.g., level 2 with indentSize 3 would add 6 unitChars)
   *
   * @default 2
   */
  indentSize?: number;
  /**
   * The character to use for each indentation unit
   * @default SPACE
   */
  unitChar?: string;
}
/**
 * Indents a single line of text.
 *
 * @example
 * ```ts
 * indentLine('hello'); // 'hello'
 * indentLine('hello', 1); // '  hello'
 * indentLine('hello', 2); // '    hello'
 * indentLine('hello', 1, true); // '  hello\n'
 * ```
 */
export const line = (
  /** The text to indent */
  text: string,
  /**
   * The indentation level (number of indents to apply)
   * - Each indent is made up of `indentSize` number of `unitChar` characters (so level 1 with indentSize 2 and unitChar ' ' would add 2 spaces [level * indentSize])
   *
   * @default 0
   *
   */
  level = 0,
  /**
   * Whether to add an end-of-line character at the end
   *
   * @default false
   */
  eol = false,
  { eolChar = EOL, unitChar = SPACE, indentSize = 2 }: IndentLineOpts = {}
) => `${unitChar.repeat(indentSize).repeat(level)}${text}${eol ? eolChar : ''}`;

/**
 * Defines how end-of-line characters are applied when indenting a block of text.
 * - `all`: Adds an end-of-line character after every line.
 * - `final`: Adds a single end-of-line character after the final line only.
 * - `perLine`: Uses the individual line's eol setting to determine if an end-of-line character should be added.
 */
export type IndentBlockEolBehavior = 'all' | 'final' | 'perLine';
/**
 * Defines the structure for lines in a block to be indented.
 */
export type IndentBlockLines = [
  /**
   * The line content, which can be a string or a function that returns a string.
   */
  line?: (() => string | undefined) | string | undefined,
  /**
   * The indentation level for the line.
   */
  indentSize?: number,
  /**
   * Whether to add an end-of-line character after this line.
   */
  eol?: boolean
][];
/**
 * Indents a block of text lines according to the specified end-of-line behavior.
 * @example
 * ```ts
 * const lines: IndentBlockLines = [
 *   ['line1', 1, true],
 *   ['line2', 2, false],
 *   [() => 'line3', 1, true]
 * ];
 * indentBlock(lines, 'all');
 * // '  line1\n    line2\n  line3\n'
 *
 * indentBlock(lines, 'final');
 * // '  line1    line2  line3\n'
 * indentBlock(lines, 'perLine');
 * // '  line1\n    line2  line3\n'
 * ```
 */
export const block = (
  lines: IndentBlockLines,
  eolBehavior: IndentBlockEolBehavior = 'all',
  { eolChar = EOL, unitChar = SPACE, indentSize = 2 }: IndentLineOpts = {}
) => {
  let str = '';
  let useEol = undefined;
  switch (eolBehavior) {
    case 'all':
      useEol = true;
      break;
    case 'final':
      useEol = false;
      break;
    case 'perLine':
      useEol = undefined;
      break;
  }
  for (const [l, level = 0, _eol = useEol] of lines) {
    const r = typeof l === 'function' ? l() : l;
    if (r) str += line(r, level, _eol, { eolChar, unitChar, indentSize });
  }
  if (eolBehavior === 'final') str += eolChar;
  return str;
};

//#region> Indenter Factory
/**
 * A function with predefined options for indent size, end-of-line character, and unit character.
 *
 * @example
 * ```ts
 * const indent = createIndenter(4, '\n', ' ');
 * indent('line1', 1); // '    line1'
 * indent([['line1', 1], ['line2', 2]], 'all'); // '    line1\n        line2\n'
 * ```
 */
export interface Indenter {
  (line: string, indentSize?: number, eol?: boolean): string;
  (
    lines: [
      line?: (() => string | undefined) | string | undefined,
      indentSize?: number,
      eol?: boolean
    ][],
    eolBehavior?: 'all' | 'final' | 'perLine'
  ): string;
  eolChar: string;
}
/**
 * Creates an {@link Indenter}.
 */
export const create = (
  /** @see {@link IndentLineOpts.indentSize} */
  indentSize = 2,
  /** @see {@link IndentLineOpts.eolChar} */
  eolChar: string = EOL,
  /** @see {@link IndentLineOpts.unitChar} */
  wsChar: string = SPACE
): Indenter => {
  const indent: Indenter = ((lineOrLines, ...rest) =>
    typeof lineOrLines === 'string' ?
      line(lineOrLines, ...(rest as [number?, boolean?]), {
        eolChar,
        unitChar: wsChar,
        indentSize
      })
    : block(lineOrLines, ...(rest as ['all' | 'final' | 'perLine']), {
        eolChar,
        unitChar: wsChar,
        indentSize
      })) as Indenter;
  Object.assign(indent, { eolChar });
  return indent;
};
//#endregion
