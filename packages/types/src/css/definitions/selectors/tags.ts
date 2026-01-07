/** https://html.spec.whatwg.org/dev/dom.html#metadata-content */

//#region> Not selectable
// Not Selectable type Metadata =
//   | 'base'
//   | 'link'
//   | 'meta'
//   | 'noscript'
//   | 'script'
//   | 'style'
//   | 'template'
//   | 'title';
//
//#endregion

/** https://html.spec.whatwg.org/dev/grouping-content.html#the-dd-element */
type DescriptionListDetail = 'dd';
// Not Selectable | 'head';

/** https://html.spec.whatwg.org/dev/grouping-content.html#the-dt-element */
type DescriptionListTerm = 'dt';

/** https://html.spec.whatwg.org/dev/semantics.html#the-root-element */
type DocumentRoot = 'body' | 'html';

/** https://html.spec.whatwg.org/dev/dom.html#embedded-content-2 */
type Embedded =
  | 'audio'
  | 'canvas'
  | 'embed'
  | 'iframe'
  | 'img'
  | 'math'
  | 'object'
  | 'picture'
  | 'svg'
  | 'video';

/** https://html.spec.whatwg.org/dev/grouping-content.html#the-figcaption-element */
type FigCaption = 'figcaption';

type Grouping =
  | 'blockquote'
  | 'div'
  | 'dl'
  | 'figure'
  | 'hr'
  | 'main'
  | 'p'
  | 'pre'
  | 'search'
  | DescriptionListDetail
  | DescriptionListTerm
  | FigCaption
  | List
  | ListItem;

/** https://html.spec.whatwg.org/dev/dom.html#heading-content */
type Heading = 'hgroup' | `h${1 | 2 | 3 | 4 | 5 | 6}`;

/** https://html.spec.whatwg.org/dev/grouping-content.html#grouping-content */
type List = 'menu' | 'ol' | 'ul';
/** https://html.spec.whatwg.org/dev/grouping-content.html#the-li-element */
type ListItem = 'li';

/** https://html.spec.whatwg.org/dev/dom.html#sectioning-content */
type Sectioning = 'article' | 'aside' | 'nav' | 'section';

/** https://html.spec.whatwg.org/dev/tables.html#the-table-element */
type Table =
  | 'caption'
  | 'colgroup'
  | 'table'
  | 'tbody'
  | 'td'
  | 'tfoot'
  | 'th'
  | 'thead'
  | 'tr';

//#region> Interactive
type EmbeddedInteractive = Extract<
  Embedded,
  'audio' | 'embed' | 'iframe' | 'img' | 'video'
>;
/** https://html.spec.whatwg.org/dev/dom.html#interactive-content */
type Interactive =
  | 'a'
  | 'button'
  | 'details'
  | 'input'
  | 'label'
  | 'select'
  | 'textarea'
  | EmbeddedInteractive;
//#endregion

//#region> Phrasing
/** https://html.spec.whatwg.org/dev/dom.html#phrasing-content */
type Phrasing =
  | 'area'
  | 'br'
  | 'datalist'
  | 'link'
  | 'meta'
  | 'noscript'
  | 'script'
  | 'slot'
  | 'template'
  | 'wbr'
  | Embedded
  | Exclude<Interactive, 'details'>
  | PhrasingShared;
type PhrasingShared =
  | 'abbr'
  | 'b'
  | 'bdi'
  | 'bdo'
  | 'cite'
  | 'code'
  | 'data'
  | 'del'
  | 'dfn'
  | 'em'
  | 'i'
  | 'ins'
  | 'kbd'
  | 'map'
  | 'mark'
  | 'meter'
  | 'output'
  | 'progress'
  | 'q'
  | 'ruby'
  | 's'
  | 'samp'
  | 'small'
  | 'span'
  | 'strong'
  | 'sub'
  | 'sup'
  | 'time'
  | 'u'
  | 'var';
//#endregion

//#region> Flow
type Flow =
  | Embedded
  | FlowGrouping
  | Heading
  | Interactive
  | List
  | Phrasing
  | Sectioning;
type FlowGrouping = Exclude<Grouping, 'dd' | 'dt' | 'figcaption' | 'li'>;
//#endregion

//#region> Palpable
/** https://html.spec.whatwg.org/dev/dom.html#palpable-content */
type Palpable =
  | 'fieldset'
  | 'figure'
  | 'footer'
  | 'form'
  | 'header'
  | 'table'
  | Heading
  | Interactive
  | List
  | PalpableGrouping
  | Sectioning;
type PalpableGrouping = Exclude<
  Grouping,
  'dd' | 'dt' | 'figcaption' | 'hr' | 'li'
>;
//#endregion

type All = DocumentRoot | Flow | Grouping | Palpable | Table;

//#region> Global
/** https://html.spec.whatwg.org/dev/dom.html#global-attributes */
type GlobalAttributes =
  | 'accesskey'
  | 'autocapitalize'
  | 'autocorrect'
  | 'autofocus'
  | 'class'
  | 'contenteditable'
  | 'data-'
  | 'dir'
  | 'draggable'
  | 'enterkeyhint'
  | 'hidden'
  | 'id'
  | 'inert'
  | 'inputmode'
  | 'is'
  | 'itemid'
  | 'itemprop'
  | 'itemref'
  | 'itemscope'
  | 'itemtype'
  | 'lang'
  | 'nonce'
  | 'popover'
  | 'slot'
  | 'spellcheck'
  | 'style'
  | 'tabindex'
  | 'title'
  | 'translate'
  | 'writingsuggestions';

type GlobalEventHandlers =
  | 'onauxclick'
  | 'onbeforeinput'
  | 'onbeforematch'
  | 'onbeforetoggle'
  | 'onblur'
  | 'oncancel'
  | 'oncanplay'
  | 'oncanplaythrough'
  | 'onchange'
  | 'onclick'
  | 'onclose'
  | 'oncommand'
  | 'oncontextlost'
  | 'oncontextmenu'
  | 'oncontextrestored'
  | 'oncopy'
  | 'oncuechange'
  | 'oncut'
  | 'ondblclick'
  | 'ondrag'
  | 'ondragend'
  | 'ondragenter'
  | 'ondragleave'
  | 'ondragover'
  | 'ondragstart'
  | 'ondrop'
  | 'ondurationchange'
  | 'onemptied'
  | 'onended'
  | 'onerror'
  | 'onfocus'
  | 'onformdata'
  | 'oninput'
  | 'oninvalid'
  | 'onkeydown'
  | 'onkeypress'
  | 'onkeyup'
  | 'onload'
  | 'onloadeddata'
  | 'onloadedmetadata'
  | 'onloadstart'
  | 'onmousedown'
  | 'onmouseenter'
  | 'onmouseleave'
  | 'onmousemove'
  | 'onmouseout'
  | 'onmouseover'
  | 'onmouseup'
  | 'onpaste'
  | 'onpause'
  | 'onplay'
  | 'onplaying'
  | 'onprogress'
  | 'onratechange'
  | 'onreset'
  | 'onresize'
  | 'onscroll'
  | 'onscrollend'
  | 'onsecuritypolicyviolation'
  | 'onseeked'
  | 'onseeking'
  | 'onselect'
  | 'onslotchange'
  | 'onstalled'
  | 'onsubmit'
  | 'onsuspend'
  | 'ontimeupdate'
  | 'ontoggle'
  | 'onvolumechange'
  | 'onwaiting'
  | 'onwheel';
//#endregion

export type {
  All,
  DocumentRoot,
  Flow,
  GlobalAttributes,
  GlobalEventHandlers,
  Grouping,
  Palpable,
  Table
};
