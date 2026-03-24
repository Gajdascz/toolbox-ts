/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes
 */
export type Aria<T extends string> = `aria-${T}`;
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes#global_aria_attributes
 */
export type Global = Aria<
  | 'atomic'
  | 'busy'
  | 'controls'
  | 'current'
  | 'describedby'
  | 'description'
  | 'details'
  | 'disabled'
  | 'dropeffect'
  | 'errormessage'
  | 'flowto'
  | 'grabbed'
  | 'haspopup'
  | 'hidden'
  | 'invalid'
  | 'keyshortcuts'
  | 'label'
  | 'labelledby'
  | 'live'
  | 'owns'
  | 'relevant'
  | 'roledescription'
>;
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes#widget_attributes
 */
export type Widget = Aria<
  | 'autocomplete'
  | 'checked'
  | 'disabled'
  | 'errormessage'
  | 'expanded'
  | 'haspopup'
  | 'hidden'
  | 'invalid'
  | 'label'
  | 'level'
  | 'modal'
  | 'multiline'
  | 'multiselectable'
  | 'orientation'
  | 'placeholder'
  | 'pressed'
  | 'readonly'
  | 'required'
  | 'selected'
  | 'sort'
  | 'valuemax'
  | 'valuemin'
  | 'valuenow'
  | 'valuetext'
>;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes#live_region_attributes
 */
export type LiveRegion = Aria<'atomic' | 'busy' | 'live' | 'relevant'>;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes#drag-and-drop_attributes
 */

export type DragAndDrop = Aria<'dropeffect' | 'grabbed'>;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes#relationship_attributes
 */

export type Relationship = Aria<
  | 'activedescendant'
  | 'colcount'
  | 'colindex'
  | 'colspan'
  | 'controls'
  | 'describedby'
  | 'description'
  | 'details'
  | 'errormessage'
  | 'flowto'
  | 'labelledby'
  | 'owns'
  | 'posinset'
  | 'rowcount'
  | 'rowindex'
  | 'rowspan'
  | 'setsize'
>;

export type All = Global | Widget | LiveRegion | DragAndDrop | Relationship;
