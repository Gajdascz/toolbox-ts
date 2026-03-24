export type BooleanValue = boolean | 'true' | 'false' | '';
export type OnOff = 'on' | 'off';
/**
 * HTML global attributes that can be applied to any HTML element.
 *
 * These attributes are valid on all HTML elements and can be used across
 * the entire document, though they may not have an effect on some elements.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
 */
export interface Global {
  /**
   * Provides a keyboard shortcut hint for the current element.
   *
   * Value is a space-separated list of characters. The browser uses the first
   * character that exists on the user's keyboard layout.
   *
   * @example
   * ```html
   * <button accesskey="s">Save</button>
   * <!-- User can press Alt+S (or Ctrl+Option+S on Mac) to activate -->
   * ```
   */
  accesskey?: string;
  /**
   * Associates a positioned element with an anchor element for CSS anchor positioning.
   *
   * Value should be the `id` of the element to anchor to.
   *
   * @important This is not a standard attribute
   *
   * @example
   * ```html
   * <div id="anchor-point">Anchor</div>
   * <div anchor="anchor-point">Positioned relative to anchor</div>
   * ```
   */
  anchor?: string;
  /**
   * Controls automatic capitalization of user input.
   *
   * - `off` or `none`: No automatic capitalization
   * - `on` or `sentences`: Capitalize first letter of each sentence
   * - `words`: Capitalize first letter of each word
   * - `characters`: Capitalize all characters
   *
   * @example
   * ```html
   * <input autocapitalize="words" placeholder="Your Name">
   * ```
   */
  autocapitalize?: OnOff | 'none' | 'sentences' | 'words' | 'characters';
  /**
   * Controls automatic spelling correction for editable text.
   *
   * - `on`: Enable autocorrection
   * - `off`: Disable autocorrection
   *
   * Not applicable to: `<input type="password">`, `<input type="email">`, `<input type="url">`
   *
   * @example
   * ```html
   * <textarea autocorrect="on"></textarea>
   * ```
   */
  autocorrect?: OnOff;
  /**
   * Indicates the element should receive focus on page load or when its `<dialog>` is displayed.
   *
   * Boolean attribute. Only one element per document should have autofocus.
   *
   * @example
   * ```html
   * <input type="text" autofocus>
   * <dialog><input autofocus></dialog>
   * ```
   */
  autofocus?: boolean;
  /**
   * Space-separated list of CSS classes for the element.
   *
   * Used for CSS styling and JavaScript selection.
   *
   * @example
   * ```html
   * <div class="container primary highlighted">Content</div>
   * ```
   */
  class?: string;
  /**
   * Indicates if the element's content is editable by the user.
   *
   * - `true` or `""`: Element is editable
   * - `false`: Element is not editable
   * - `plaintext-only`: Only plain text editing (no rich formatting)
   *
   * @example
   * ```html
   * <div contenteditable="true">Edit this text</div>
   * <p contenteditable="plaintext-only">Plain text only</p>
   * ```
   */
  contenteditable?: 'true' | 'false' | 'plaintext-only' | '';

  /**
   * Text directionality of the element's content.
   *
   * - `ltr`: Left to right (English, French, etc.)
   * - `rtl`: Right to left (Arabic, Hebrew, etc.)
   * - `auto`: Let browser determine from content
   *
   * @example
   * ```html
   * <p dir="rtl">مرحبا</p>
   * <p dir="ltr">Hello</p>
   * ```
   */
  dir?: 'ltr' | 'rtl' | 'auto';

  /**
   * Indicates if the element can be dragged using the Drag and Drop API.
   *
   * - `true`: Element is draggable
   * - `false`: Element is not draggable
   * - `auto`: Browser default behavior
   *
   * @example
   * ```html
   * <div draggable="true">Drag me</div>
   * ```
   */
  draggable?: BooleanValue | 'auto';

  /**
   * Hint for virtual keyboard enter key label/icon.
   *
   * - `enter`: Standard enter/return
   * - `done`: Completion action
   * - `go`: Navigation action
   * - `next`: Move to next input
   * - `previous`: Move to previous input
   * - `search`: Submit search
   * - `send`: Submit/send message
   *
   * @example
   * ```html
   * <input type="text" enterkeyhint="search">
   * <textarea enterkeyhint="send"></textarea>
   * ```
   */
  enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';

  /**
   * Transitively exports shadow parts from nested shadow trees.
   *
   * Used with Shadow DOM to expose internal parts for styling.
   *
   * @example
   * ```html
   * <template shadowrootmode="open">
   *   <div part="inner" exportparts="inner: outer-inner">
   *     <slot></slot>
   *   </div>
   * </template>
   * ```
   */
  exportparts?: string;

  /**
   * Indicates the element is not yet, or no longer, relevant.
   *
   * - `""` or `true`: Hidden from rendering and interaction
   * - `until-found`: Hidden but can be revealed by browser find-in-page
   *
   * Browser won't render hidden elements. Different from CSS `display: none`.
   *
   * @example
   * ```html
   * <div hidden>Not visible yet</div>
   * <section hidden="until-found">Searchable but hidden</section>
   * ```
   */
  hidden?: BooleanValue | 'until-found';

  /**
   * Unique identifier for the element within the document.
   *
   * Must be unique across the entire document. Used for linking,
   * scripting, and styling.
   *
   * @example
   * ```html
   * <div id="header">
   * <a href="#header">Jump to header</a>
   * ```
   */
  id?: string;

  /**
   * Makes the browser disregard user input events for the element.
   *
   * Boolean attribute. Useful when click events should be ignored.
   * Element and its descendants become non-interactive.
   *
   * @example
   * ```html
   * <div inert>
   *   <button>Can't click me</button>
   *   <input> <!-- Can't focus or type -->
   * </div>
   * ```
   */
  inert?: boolean;

  /**
   * Hint for the type of virtual keyboard to display.
   *
   * - `none`: No virtual keyboard
   * - `text`: Standard text input keyboard
   * - `tel`: Telephone number pad
   * - `url`: URL input keyboard
   * - `email`: Email input keyboard
   * - `numeric`: Numeric keypad
   * - `decimal`: Numeric with decimal point
   * - `search`: Search-optimized keyboard
   *
   * @example
   * ```html
   * <input inputmode="numeric" placeholder="Enter PIN">
   * <div contenteditable inputmode="email">Email here</div>
   * ```
   */
  inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';

  /**
   * Specifies the element should behave like a custom built-in element.
   *
   * Value is the name of the custom element.
   *
   * @example
   * ```html
   * <button is="fancy-button">Enhanced Button</button>
   * ```
   */
  is?: string;

  /**
   * Unique global identifier for a microdata item.
   *
   * Part of WHATWG HTML Microdata feature.
   *
   * @example
   * ```html
   * <div itemscope itemtype="http://schema.org/Person" itemid="http://example.com/person/123">
   *   <span itemprop="name">John Doe</span>
   * </div>
   * ```
   */
  itemid?: string;

  /**
   * Adds a property to a microdata item.
   *
   * Every HTML element can have an `itemprop`, consisting of a name-value pair.
   *
   * @example
   * ```html
   * <div itemscope itemtype="http://schema.org/Product">
   *   <span itemprop="name">Widget</span>
   *   <span itemprop="price">$19.99</span>
   * </div>
   * ```
   */
  itemprop?: string;

  /**
   * Associates additional properties with an item from elements elsewhere in the document.
   *
   * Value is a space-separated list of element IDs.
   *
   * @example
   * ```html
   * <div itemscope itemref="additional-info">
   *   <span itemprop="name">Product</span>
   * </div>
   * <div id="additional-info">
   *   <span itemprop="price">$50</span>
   * </div>
   * ```
   */
  itemref?: string;

  /**
   * Creates a microdata item and defines its scope.
   *
   * Boolean attribute. Works with `itemtype` to specify structured data.
   *
   * @example
   * ```html
   * <div itemscope itemtype="http://schema.org/Movie">
   *   <span itemprop="name">Inception</span>
   * </div>
   * ```
   */
  itemscope?: boolean;

  /**
   * URL of vocabulary defining microdata item properties.
   *
   * Works with `itemscope`. Common vocabularies: schema.org
   *
   * @example
   * ```html
   * <article itemscope itemtype="http://schema.org/BlogPosting">
   *   <h1 itemprop="headline">Article Title</h1>
   * </article>
   * ```
   */
  itemtype?: string;

  /**
   * Language of the element's content.
   *
   * Value should be a valid BCP 47 language tag.
   * Affects screen readers and browser translation.
   *
   * @example
   * ```html
   * <p lang="en">Hello</p>
   * <p lang="es">Hola</p>
   * <p lang="fr-CA">Bonjour</p> <!-- French Canadian -->
   * ```
   */
  lang?: string;

  /**
   * Cryptographic nonce for Content Security Policy.
   *
   * One-time token to allow specific inline scripts/styles.
   * Should be unpredictable and generated server-side.
   *
   * @example
   * ```html
   * <script nonce="2726c7f26c">alert('allowed')</script>
   * <style nonce="2726c7f26c">body { color: red; }</style>
   * ```
   */
  nonce?: string;

  /**
   * Space-separated list of shadow part names.
   *
   * Allows styling of shadow DOM parts from outside using `::part()`.
   *
   * @example
   * ```html
   * <template shadowrootmode="open">
   *   <div part="container inner">Content</div>
   * </template>
   *
   * <!-- CSS: ::part(container) { background: blue; } -->
   * ```
   */
  part?: string;

  /**
   * Designates the element as a popover.
   *
   * - `auto`: Light dismiss, closes when clicking outside
   * - `manual`: Must be explicitly closed
   *
   * Hidden by default, shown via button with `popovertarget` or `showPopover()`.
   *
   * @example
   * ```html
   * <button popovertarget="my-popover">Open</button>
   * <div id="my-popover" popover="auto">
   *   Popover content
   * </div>
   * ```
   */
  popover?: 'auto' | 'manual' | '';

  /**
   * ARIA role defining the semantic meaning of the element.
   *
   * Helps assistive technologies understand element purpose.
   *
   * @example
   * ```html
   * <div role="navigation">Nav content</div>
   * <div role="button" tabindex="0">Clickable div</div>
   * <span role="status">Loading...</span>
   * ```
   */
  role?: string;

  /**
   * Assigns the element to a named slot in a shadow tree.
   *
   * Matches the `name` attribute of a `<slot>` element.
   *
   * @example
   * ```html
   * <custom-element>
   *   <span slot="header">Header Content</span>
   *   <p slot="content">Main Content</p>
   * </custom-element>
   * ```
   */
  slot?: string;

  /**
   * Controls spell checking for the element's content.
   *
   * - `true` or `""`: Enable spell check
   * - `false`: Disable spell check
   *
   * @example
   * ```html
   * <textarea spellcheck="true"></textarea>
   * <input type="text" spellcheck="false">
   * <div contenteditable spellcheck="true">Editable</div>
   * ```
   */
  spellcheck?: BooleanValue;

  /**
   * Inline CSS styling for the element.
   *
   * @remarks
   * Recommended to use external stylesheets instead. This attribute
   * is mainly for quick styling or testing.
   *
   * @example
   * ```html
   * <div style="color: red; font-size: 16px;">Styled text</div>
   * ```
   */
  style?: string;

  /**
   * Controls keyboard focus and navigation order.
   *
   * - Negative value: Focusable but not in tab order
   * - `0`: Focusable and in natural tab order
   * - Positive value: Focusable in specified tab order (not recommended)
   *
   * @example
   * ```html
   * <div tabindex="0">Focusable div</div>
   * <div tabindex="-1">Programmatically focusable only</div>
   * <button tabindex="1">First in tab order (avoid)</button>
   * ```
   */
  tabindex?: number | string;

  /**
   * Advisory information about the element.
   *
   * Typically displayed as a tooltip on hover.
   *
   * @example
   * ```html
   * <abbr title="HyperText Markup Language">HTML</abbr>
   * <button title="Save your changes">💾</button>
   * ```
   */
  title?: string;

  /**
   * Controls translation behavior when page is localized.
   *
   * - `yes` or `""`: Element will be translated
   * - `no`: Element will not be translated
   *
   * @example
   * ```html
   * <p translate="yes">Translate me</p>
   * <code translate="no">const x = 5;</code> <!-- Don't translate code -->
   * <span translate="no">Brand Name</span> <!-- Keep brand name -->
   * ```
   */
  translate?: 'yes' | 'no' | '';

  /**
   * Controls on-screen virtual keyboard behavior for editable elements.
   *
   * - `auto` or `""`: Show keyboard automatically on focus
   * - `manual`: Keyboard shown/hidden independently of focus
   *
   * @experimental This is an experimental feature
   *
   * @example
   * ```html
   * <input virtualkeyboardpolicy="manual">
   * <textarea virtualkeyboardpolicy="auto"></textarea>
   * ```
   */
  virtualkeyboardpolicy?: 'auto' | 'manual' | '';

  /**
   * Controls browser-provided writing suggestions.
   *
   * - `true` or `""`: Enable writing suggestions
   * - `false`: Disable writing suggestions
   *
   * @example
   * ```html
   * <textarea writingsuggestions="true"></textarea>
   * <input writingsuggestions="false">
   * ```
   */
  writingsuggestions?: BooleanValue;

  /**
   * Custom data attributes for storing extra information on elements.
   *
   * Accessible via `element.dataset` in JavaScript.
   *
   * @example
   * ```html
   * <article data-author="John" data-category="tech" data-post-id="123">
   *   <!-- Access: element.dataset.author, element.dataset.postId -->
   * </article>
   * ```
   */
  [key: `data-${string}`]: string | number | boolean;
}
