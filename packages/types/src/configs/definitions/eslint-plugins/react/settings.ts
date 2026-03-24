/**
 * Configuration for a function that wraps propTypes.
 *
 * Allows rules to recognize and validate propTypes even when they're
 * wrapped by utility functions.
 */
export interface PropWrapperFunction {
  /**
   * The name of the wrapper function or method.
   *
   * @example "freeze", "forbidExtraProps", "exact"
   */
  property: string;

  /**
   * The object that the property belongs to (optional).
   *
   * @example "Object" for Object.freeze
   */
  object?: string;

  /**
   * Whether to match this wrapper exactly without unwrapping further.
   *
   * When `true`, rules will only recognize this specific wrapper and won't
   * attempt to unwrap nested wrappers.
   *
   * @default false
   */
  exact?: boolean;
}

/**
 * Configuration for a function that wraps React components.
 *
 * Allows rules to recognize components even when wrapped by HOCs or decorators.
 */
export interface ComponentWrapperFunction {
  /**
   * The name of the wrapper function.
   *
   * @example "observer", "styled", "memo", "forwardRef"
   */
  property: string;

  /**
   * The object that the property belongs to (optional).
   *
   * Use `"<pragma>"` to reference the value of `settings.react.pragma`.
   *
   * @example
   * - "Mobx" for Mobx.observer
   * - "<pragma>" for React.memo (uses pragma value)
   */
  object?: string;
}

/**
 * Configuration for a custom form component.
 *
 * Defines components that should be treated as forms by relevant ESLint rules.
 */
export interface FormComponent {
  /**
   * The name of the form component.
   *
   * @example "CustomForm", "Form", "SimpleForm"
   */
  name: string;

  /**
   * The prop name(s) that specify the form action/endpoint.
   *
   * Can be a single attribute name or an array of possible attribute names.
   *
   * @example
   * - "endpoint"
   * - ["registerEndpoint", "loginEndpoint"]
   */
  formAttribute: string | string[];
}

/**
 * Configuration for a custom link component.
 *
 * Defines components that should be treated as links by relevant ESLint rules
 * (particularly accessibility rules).
 */
export interface LinkComponent {
  /**
   * The name of the link component.
   *
   * @example "Link", "MyLink", "Hyperlink", "NavLink"
   */
  name: string;

  /**
   * The prop name(s) that specify the link target/destination.
   *
   * Can be a single attribute name or an array of possible attribute names.
   *
   * @example
   * - "to"
   * - "href"
   * - ["to", "href"]
   */
  linkAttribute: string | string[];
}

/**
 * Configuration settings for the React ESLint plugin.
 *
 * These settings are used by various react-eslint-plugin rules to understand
 * your React setup and custom component patterns.
 *
 * @see https://github.com/jsx-eslint/eslint-plugin-react#configuration-legacy-eslintrc
 */
export interface Settings {
  /**
   * The name of the function used to create React components in legacy codebases.
   *
   * This is used by rules that need to identify component definitions created
   * with the legacy `createClass` API (pre-ES6 class syntax).
   *
   * @default "createReactClass"
   *
   * @example
   * ```typescript
   * // If you use a custom factory function
   * createClass: "createMyComponent"
   * ```
   */
  createClass?: string;

  /**
   * The identifier used for React in JSX (the pragma).
   *
   * This tells the linter what name is used to reference React in your JSX.
   * With classic JSX transform, this is typically "React". With automatic JSX
   * transform (React 17+), this may not be needed.
   *
   * @default "React"
   *
   * @example
   * ```typescript
   * // Standard usage
   * pragma: "React"
   *
   * // If you import React with an alias
   * pragma: "R"  // import * as R from 'react'
   * ```
   */
  pragma?: string;

  /**
   * The identifier used for React Fragments.
   *
   * Specifies the name used for React.Fragment or the shorthand <> syntax.
   * Can be a property of the pragma.
   *
   * @default "Fragment"
   *
   * @example
   * ```typescript
   * // Standard usage
   * fragment: "Fragment"  // <React.Fragment> or <>
   *
   * // If you use an alias
   * fragment: "Frag"  // import { Fragment as Frag } from 'react'
   * ```
   */
  fragment?: string;

  /**
   * The version of React being used in the project.
   *
   * - `"detect"`: Automatically detect from installed react package (recommended)
   * - Specific version: `"16.0"`, `"16.3"`, `"17.0"`, `"18.0"`, etc.
   * - Falls back to `defaultVersion` if detection fails
   *
   * Rules may behave differently based on React version (e.g., some rules only
   * apply to React < 17).
   *
   * @default "detect"
   *
   * @example
   * ```typescript
   * // Auto-detect (recommended)
   * version: "detect"
   *
   * // Pin to specific version (for testing or when auto-detect fails)
   * version: "18.0"
   * ```
   */
  version?: 'detect' | `${number}${string}`;

  /**
   * Fallback React version when auto-detection fails.
   *
   * Used when `version` is set to `"detect"` but the React version cannot be
   * determined from installed packages. If not provided, defaults to the latest
   * stable React version.
   *
   * @default "" (uses latest React version)
   *
   * @example
   * ```typescript
   * // Fallback to React 18 if detection fails
   * defaultVersion: "18.0"
   * ```
   */
  defaultVersion?: string;

  /**
   * The version of Flow being used (for Flow type checking).
   *
   * Some rules have Flow-specific behavior and need to know the Flow version.
   * Only relevant if you're using Flow for type checking.
   *
   * @example
   * ```typescript
   * flowVersion: "0.53"
   * ```
   */
  flowVersion?: string;

  /**
   * Functions that wrap propTypes definitions.
   *
   * By default, propTypes wrapped in functions are skipped by rules that check
   * propTypes. This setting tells those rules which wrapper functions to recognize
   * and unwrap when validating propTypes.
   *
   * Common use case: Higher-order functions that add additional validation to propTypes.
   *
   * @example
   * ```typescript
   * propWrapperFunctions: [
   *   // Simple function name
   *   "forbidExtraProps",
   *
   *   // Method on an object
   *   { property: "freeze", object: "Object" },  // Object.freeze(propTypes)
   *
   *   // Just a property name (object inferred)
   *   { property: "myFavoriteWrapper" },
   *
   *   // Exact match only (for strict rules)
   *   { property: "forbidExtraProps", exact: true }
   * ]
   * ```
   */
  propWrapperFunctions?: (string | PropWrapperFunction)[];

  /**
   * Functions that wrap React components.
   *
   * Specifies higher-order components or decorators that wrap components.
   * This helps rules correctly identify components that are wrapped by functions
   * like MobX `observer`, styled-components `styled`, etc.
   *
   * @example
   * ```typescript
   * componentWrapperFunctions: [
   *   // Simple function name
   *   "observer",  // MobX observer
   *
   *   // Function with optional object namespace
   *   { property: "styled" },  // styled-components
   *   { property: "observer", object: "Mobx" },  // Mobx.observer
   *
   *   // Use the pragma value as the object
   *   { property: "memo", object: "<pragma>" }  // React.memo (uses settings.react.pragma)
   * ]
   * ```
   */
  componentWrapperFunctions?: (string | ComponentWrapperFunction)[];

  /**
   * Custom components that act as forms.
   *
   * Components that behave like HTML `<form>` elements but have different names.
   * This helps rules that check form-related patterns recognize your custom form
   * components.
   *
   * @example
   * ```typescript
   * formComponents: [
   *   // Simple component name
   *   "CustomForm",
   *
   *   // Component with custom attribute for form action
   *   { name: "SimpleForm", formAttribute: "endpoint" },
   *
   *   // Component with multiple possible form attributes
   *   {
   *     name: "Form",
   *     formAttribute: ["registerEndpoint", "loginEndpoint"]
   *   }
   * ]
   * ```
   *
   * @example Usage in JSX
   * ```jsx
   * // These would all be recognized as forms:
   * <CustomForm />
   * <SimpleForm endpoint="/api/submit" />
   * <Form registerEndpoint="/api/register" />
   * ```
   */
  formComponents?: (string | FormComponent)[];

  /**
   * Custom components that act as links.
   *
   * Components that behave like HTML `<a>` elements but have different names.
   * This helps rules that check link-related patterns (like accessibility rules)
   * recognize your custom link components.
   *
   * @example
   * ```typescript
   * linkComponents: [
   *   // Simple component name
   *   "Hyperlink",
   *
   *   // Component with custom attribute for link target
   *   { name: "MyLink", linkAttribute: "to" },
   *
   *   // Component with multiple possible link attributes
   *   {
   *     name: "Link",
   *     linkAttribute: ["to", "href"]
   *   }
   * ]
   * ```
   *
   * @example Usage in JSX
   * ```jsx
   * // These would all be recognized as links:
   * <Hyperlink />
   * <MyLink to="/home" />
   * <Link href="https://example.com" />
   * ```
   */
  linkComponents?: (string | LinkComponent)[];
}
