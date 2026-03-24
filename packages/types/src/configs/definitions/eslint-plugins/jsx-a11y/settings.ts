/**
 * Configuration settings for eslint-plugin-jsx-a11y.
 *
 * These settings help the accessibility plugin understand your custom component
 * mappings and polymorphic component patterns, enabling it to apply appropriate
 * accessibility rules to your custom components.
 *
 * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#configurations
 */
export interface Settings {
  /**
   * The name of the prop used for polymorphic components.
   *
   * Polymorphic components can render as different HTML elements based on a prop.
   * This setting tells the plugin which prop name controls the rendered element.
   *
   * @default null (polymorphic components not supported)
   *
   * @remarks
   * Common prop names:
   * - `"as"` - Used by Chakra UI, Styled Components, Styled System
   * - `"component"` - Used by Material-UI (MUI)
   * - `"elementType"` - Used by React Bootstrap
   * - `"tag"` - Used by Reactstrap
   *
   * When set, the plugin will check the value of this prop to determine which
   * accessibility rules to apply. For example, if a component uses `as="button"`,
   * button-specific accessibility rules will be enforced.
   *
   * @example
   * ```typescript
   * // Chakra UI / Styled Components
   * polymorphicPropName: "as"
   *
   * // Material-UI (MUI)
   * polymorphicPropName: "component"
   *
   * // React Bootstrap
   * polymorphicPropName: "elementType"
   *
   * // Disable polymorphic support
   * polymorphicPropName: null
   * ```
   *
   * @example Usage in JSX
   * ```jsx
   * // Plugin understands this renders as a button
   * <Box as="button" onClick={handleClick}>
   *   Click me
   * </Box>
   *
   * // Plugin understands this renders as a link
   * <Box as="a" href="/home">
   *   Home
   * </Box>
   *
   * // MUI with component prop
   * <Typography component="h1">
   *   Main Title
   * </Typography>
   * ```
   */
  polymorphicPropName?: string | null;

  /**
   * Map of custom component names to their underlying HTML element types.
   *
   * Tells the plugin which HTML element your custom components represent,
   * allowing it to apply the correct accessibility rules. This is essential
   * for component libraries and design systems.
   *
   * @default {}
   *
   * @remarks
   * - Keys: Your custom component names (case-sensitive)
   * - Values: The HTML element they represent (lowercase, see {@link HtmlElementType})
   * - Enables element-specific accessibility rules for custom components
   * - Required for the plugin to understand your design system components
   *
   * @example
   * ```typescript
   * components: {
   *   // Button variants
   *   "CustomButton": "button",
   *   "PrimaryButton": "button",
   *   "IconButton": "button",
   *   "SubmitButton": "button",
   *
   *   // Input variants
   *   "TextField": "input",
   *   "NumberInput": "input",
   *   "EmailInput": "input",
   *   "SearchField": "input",
   *
   *   // Link variants
   *   "Link": "a",
   *   "NavLink": "a",
   *   "RouterLink": "a",
   *
   *   // Heading variants
   *   "Title": "h1",
   *   "Heading": "h2",
   *   "SubHeading": "h3",
   *
   *   // Media components
   *   "Avatar": "img",
   *   "Icon": "img",
   *   "Logo": "img",
   *
   *   // List components
   *   "Menu": "ul",
   *   "MenuItem": "li",
   *   "NavList": "nav"
   * }
   * ```
   *
   * @example Material-UI (MUI) mapping
   * ```typescript
   * components: {
   *   "Button": "button",
   *   "IconButton": "button",
   *   "TextField": "input",
   *   "Link": "a",
   *   "Typography": "span",
   *   "Box": "div"
   * }
   * ```
   *
   * @example Usage effect
   * ```jsx
   * // Without mapping: no button accessibility checks
   * <CustomButton onClick={handleClick}>Submit</CustomButton>
   *
   * // With "CustomButton": "button" mapping:
   * // ✓ Checks for accessible name
   * // ✓ Validates button-specific props
   * // ✓ Enforces button accessibility rules
   * // ✗ Will error if missing accessible text
   * <CustomButton onClick={handleClick}>Submit</CustomButton>
   * ```
   */
  components?: Record<string, string>;

  /**
   * Map of HTML attribute names to their React prop equivalents.
   *
   * Defines which React prop names correspond to standard HTML attributes.
   * Useful when your components use non-standard prop names for common attributes,
   * or to support both React conventions and HTML attribute names.
   *
   * @default {}
   *
   * @remarks
   * - Keys: HTML attribute names (lowercase, see {@link HtmlAttributeName})
   * - Values: Array of React prop names that map to this attribute
   * - Order matters: first matching prop in the array is used
   * - Most common use case: supporting both `htmlFor` (React) and `for` (HTML)
   *
   * @example
   * ```typescript
   * attributes: {
   *   // Standard: support both React and HTML conventions
   *   "for": ["htmlFor", "for"],
   *
   *   // Image alt text with multiple prop names
   *   "alt": ["altText", "alt", "alternativeText", "imageAlt"],
   *
   *   // ARIA label variations
   *   "aria-label": ["ariaLabel", "label", "aria-label", "accessibleLabel"],
   *
   *   // Role attribute
   *   "role": ["role", "ariaRole", "semanticRole"],
   *
   *   // Title attribute
   *   "title": ["title", "tooltip", "hoverText"],
   *
   *   // Href variations for links
   *   "href": ["href", "to", "url", "link"]
   * }
   * ```
   *
   * @example Usage in JSX
   * ```jsx
   * // With "for": ["htmlFor", "for"] mapping:
   *
   * // Preferred React convention
   * <label htmlFor="email">Email</label>
   *
   * // HTML attribute also recognized
   * <label for="email">Email</label>
   *
   * // Custom component with multiple alt prop names
   * <Image altText="Profile picture" src="avatar.jpg" />
   * <Avatar alternativeText="John Doe" src="john.jpg" />
   * // Both recognized as providing alt text
   * ```
   */
  attributes?: Record<string, string[] | readonly string[]>;
}
