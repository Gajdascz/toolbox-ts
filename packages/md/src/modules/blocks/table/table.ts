import { type Text, text } from '../../core/index.js';

export function table<H extends readonly Text[]>(
  headers: Readonly<H>,
  ...rows: { [K in keyof H]: Text }[]
): string {
  const colWidth: number[] = Array.from<number>({ length: headers.length }).fill(0);
  const styledHeaders = headers.map(text);
  const styledRows = rows.map((r) => r.map(text));
  for (const row of [styledHeaders, ...styledRows]) {
    for (const [i, cell] of row.entries()) colWidth[i] = Math.max(colWidth[i], cell.length);
  }
  const padRow = (row: readonly string[]) =>
    row
      .map((cell, i) => {
        const padding = ' '.repeat(colWidth[i] - cell.length);
        return `| ${cell}${padding} `;
      })
      .join('') + '|';

  return `${padRow(styledHeaders)}\n${colWidth.map((w) => `|${'-'.repeat(w + 2)}`).join('')}|\n${styledRows.map(padRow).join('\n')}`;
}
