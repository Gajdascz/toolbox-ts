import { type Text, text } from '../../core/index.js';

export type Footnote = `[^${string}]`;
export type FootnoteDefinition = `[^${string}]: ${string}`;

export const footnote = (label: string | number): Footnote => `[^${label}]`;
export const footnoteDefinition = (label: string | number, content: Text): FootnoteDefinition =>
  `[^${label}]: ${text(content)}`;
