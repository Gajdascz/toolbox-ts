/**
 * Syntax kind of the custom tag.
 * - \"inline\" means that this tag can appear inside other documentation sections
 *  (example: \{\@link\}).
 * - \"block\" means that this tag starts a new documentation section (example: \@remarks).
 * - \"modifier\" means that this tag's presence indicates an aspect of the associated API item (example: \@internal).
 */
export type SyntaxKind = 'block' | 'inline' | 'modifier';
export interface TagDefinition {
  /**
   * If true, then this tag may appear multiple times in a doc comment.
   * By default, a tag may only appear once.
   */
  allowMultiple: boolean;
  syntaxKind: SyntaxKind;
  /**
   * Name of the custom tag. TSDoc tag names start with an at-sign (\@) followed by ASCII letters using camelCase capitalization.
   */
  tagName: `@${Uncapitalize<string>}`;
}
