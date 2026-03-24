import type { Colors } from '@toolbox-ts/types/defs/css';
import type { SimpleIconsSlug } from './simple-icons-slugs.js';
import { image, imageElement } from '../image/image.js';

export const URL = 'https://shields.io';
export const QUERY_PARAMS = {
  CACHE_SECONDS: 'cacheSeconds',
  LABEL: 'label',
  LABEL_COLOR: 'labelColor',
  LOGO_COLOR: 'logoColor',
  LOGO: 'logo',
  STYLE: 'style',
  LOGO_SIZE: 'logoSize',
  COLOR: 'color'
} as const;
/**
 * - flat: Default style with a subtle 3D effect.
 * - flat-square: Similar to flat but with square corners.
 * - for-the-badge: Bold style with all uppercase text and a more prominent 3D effect, designed for badges that need to stand out.
 * - plastic: Classic style with a glossy finish and a slight 3D effect, reminiscent of traditional plastic badges.
 * - social: Style optimized for social media platforms, often featuring the platform's logo and colors in a visually appealing way.
 */
export type Style = 'flat' | 'flat-square' | 'for-the-badge' | 'plastic' | 'social';
export type Color = Colors.Named | Colors.Hex | Colors.Rgb | Colors.Rgba | Colors.Hsl | Colors.Hsla;

export interface BadgeLogo {
  slug: SimpleIconsSlug;
  color?: Color;
}

export interface UniversalQueryParams {
  /**
   * Color of the right-hand side of the badge path segment.
   * - Overrides the badge content color if provided `<label>-<message>-<color>`.
   */
  color?: Color;
  /**
   * HTTP cache lifetime (rules are applied to infer a default value on a per-badge basis,
   * any values specified below the default will be ignored).
   */
  cacheSeconds?: number;
  /**
   * Override the left-hand-side text via query param.
   * URL-encoding is handled automatically.
   */
  labelOverride?: string;
  /**
   * Background color of the left-hand side of the badge.
   */
  labelColor?: Color;
  logo?: BadgeLogo;
  /**
   * Make icons adaptively resize by setting auto.
   * Useful for some wider logos like amd and amg.
   * Supported for simple-icons logos but not for custom logos.
   */
  logoSize?: 'auto';
  style?: Style;
  /**
   * Optional route for the badge, allowing for custom badge types beyond the default "badge" path.
   * This can be used to create badges for specific services or metrics that Shields.io supports, such as "github", "npm", etc.
   * @default badge
   */
  route?: string;
}
export type QueryParams<P extends Record<string, string> = {}> = UniversalQueryParams & P;

export const encodeBadgeColor = (color: Color): string => color.replace(/^#/, '');

export const url = (
  route: string,
  {
    color,
    cacheSeconds,
    labelOverride,
    labelColor,
    logo,
    logoSize,
    style,
    ...rest
  }: QueryParams = {}
): string => {
  const params = new URLSearchParams();
  if (style) params.set(QUERY_PARAMS.STYLE, style);
  if (cacheSeconds) params.set(QUERY_PARAMS.CACHE_SECONDS, cacheSeconds.toString());
  if (labelOverride) params.set(QUERY_PARAMS.LABEL, labelOverride);
  if (labelColor) params.set(QUERY_PARAMS.LABEL_COLOR, encodeBadgeColor(labelColor));
  if (logo) {
    params.set(QUERY_PARAMS.LOGO, logo.slug);
    if (logo.color) params.set(QUERY_PARAMS.LOGO_COLOR, encodeBadgeColor(logo.color));
  }
  if (logoSize) params.set(QUERY_PARAMS.LOGO_SIZE, logoSize);
  if (color) params.set(QUERY_PARAMS.COLOR, encodeBadgeColor(color));
  for (const [key, value] of Object.entries(rest)) if (value) params.set(key, value);
  const path = `${URL}/${route}`;
  const query = params.toString();
  return query ? `${path}?${query}` : path;
};
export type BadgeMdOptions = QueryParams<{
  /**
   * Alt text for the badge image, defaults to the badge label if not provided.
   */
  description?: string;
}>;
export const md = (route: string, { description, ...rest }: BadgeMdOptions = {}): string =>
  image({ url: url(route, rest), description });

export type BadgeElementOptions = BadgeMdOptions;
export const element = (route: string, { description, ...rest }: BadgeElementOptions = {}) =>
  imageElement({ url: url(route, rest), description, ...rest });

export interface BadgeHandlersNoShorthand<R, Q extends QueryParams> {
  url: (route: R, queries?: Q) => string;
  md: (route: R, opts?: Q & BadgeMdOptions) => string;
  element: (route: R, opts?: Q & BadgeElementOptions) => string;
}

export interface BadgeHandlersWithShorthand<R, Q extends QueryParams> {
  url: (route: R | string, queries?: Q) => string;
  md: (route: R | string, opts?: Q & BadgeMdOptions) => string;
  element: (route: R | string, opts?: Q & BadgeElementOptions) => string;
}
export type BadgeHandlers<R, Q extends QueryParams> =
  | BadgeHandlersNoShorthand<R, Q>
  | BadgeHandlersWithShorthand<R, Q>;

const withoutShorthand = <R, Q extends QueryParams>(
  routeFormatter: (route: R) => string
): BadgeHandlersNoShorthand<R, Q> => {
  const _url = (route: R, queries?: Q) => url(routeFormatter(route), queries);
  const _md = (route: R, opts?: Q & BadgeMdOptions) => md(routeFormatter(route), opts);
  const _element = (route: R, opts?: Q & BadgeElementOptions) =>
    element(routeFormatter(route), opts);
  return { url: _url, md: _md, element: _element } as const;
};
export type RouteKeyEntry<R> = { required?: boolean; key: keyof R & string };
/**
 * Allows for a shorthand string route to be passed to badge handlers, which will be parsed and mapped to the appropriate route parameters based on the provided routeKey(s).
 * - When using a single string routeKey, the entire shorthand string will be mapped to that key in the route object.
 * - When using an array of routeKeys, the shorthand string will be split by slashes ("/") and each segment will be mapped positionally to the corresponding key in the route object. RouteKeyEntry objects can be used to specify whether each segment is required or optional (defaults to required). Strings in place of RouteKeyEntries are always required.
 * @throws Will throw an error if the provided shorthand string does not have enough segments to satisfy the required keys, or if it has too many segments beyond what is defined in the routeKeys.
 */
export type RouteKeys<R> =
  | (keyof R & string)
  | readonly [mainKey: string, ...(RouteKeyEntry<R> | string)[]];
const withShorthand = <R, Q extends QueryParams>(
  routeFormatter: (route: R) => string,
  routeKey: RouteKeys<R>
): BadgeHandlersWithShorthand<R, Q> => {
  const resolveRoute = (route: R | string): string => {
    let toFormat = route;
    if (typeof toFormat === 'string') {
      const [mainRouteSegment, ...restRouteSegments] = toFormat.split('/');
      const obj: Partial<Record<string, string>> = {};
      if (typeof routeKey === 'string') obj[routeKey] = toFormat;
      else {
        const [mainKey, ...restRouteKeyEntries] = routeKey;
        obj[mainKey] = mainRouteSegment;
        for (const [index, entry] of restRouteKeyEntries.entries()) {
          const key = typeof entry === 'string' ? entry : entry.key;
          const required = typeof entry === 'string' ? true : (entry.required ?? true);
          const segment = restRouteSegments[index];
          if (!segment && required)
            throw new Error(
              `Missing required route segment at index ${index + 1} for key "${key}"`
            );
          if (segment) obj[key] = segment;
        }

        if (restRouteSegments.length > restRouteKeyEntries.length)
          throw new Error(
            `Too many route segments: expected at most ${restRouteKeyEntries.length + 1} but got ${restRouteSegments.length + 1}`
          );
      }
      toFormat = obj as R;
    }
    return routeFormatter(toFormat);
  };
  const _url = (route: R | string, queries?: Q) => url(resolveRoute(route), queries);
  const _md = (route: R | string, opts?: Q & BadgeMdOptions) => md(resolveRoute(route), opts);
  const _element = (route: R | string, opts?: Q & BadgeElementOptions) =>
    element(resolveRoute(route), opts);
  return { url: _url, md: _md, element: _element } as const;
};

/**
 * Factory function to create badge handlers for Shields.io badges.
 *
 * @important When using routeKey(s) for shorthand, the provided string route must have parts separated by slashes ("/") that positionally correspond to the keys in the route object.
 *
 * @example
 * ```ts
 * const npmVersionBadge = createBadgeHandlers(
 *   ({ packageName, tag }) => `npm/v/${packageName}/${tag}`,
 *   ['packageName', 'tag']
 * );
 * // npmVersionBadge.url('react/latest') will resolve to url('npm/v/react/latest')
 * ```
 */
export function createBadgeHandlers<R, Q extends QueryParams = QueryParams>(
  routeFormatter: (route: R) => string
): BadgeHandlersNoShorthand<R, Q>;
export function createBadgeHandlers<R, Q extends QueryParams = QueryParams>(
  routeFormatter: (route: R) => string,
  routeKey: RouteKeys<R>
): BadgeHandlersWithShorthand<R, Q>;
export function createBadgeHandlers<R, Q extends QueryParams = QueryParams>(
  routeFormatter: (route: R) => string,
  routeKey?: RouteKeys<R>
): BadgeHandlers<R, Q> {
  return routeKey
    ? withShorthand<R, Q>(routeFormatter, routeKey)
    : withoutShorthand<R, Q>(routeFormatter);
}
