import * as shields from '../../shields-io.js';

export interface PathParams {
  label: string;
  message?: string;
  color?: shields.Color;
}

/**
 * Encodes text according to Shields.io static badge path encoding rules.
 *
 * @see https://shields.io/badges/static-badge
 *
 * @example
 * ```
 * URL input | Badge output
 * --------- | ------------
 * _ or %20  | ' ' (space)
 * __        | '_' (underscore)
 * --        | '-' (dash)
 * ```
 */
const encodeBadgeText = (text: string): string =>
  text.replace(/-/g, '--').replace(/_/g, '__').replace(/\s+/g, '_');

const formatPathParams = ({ label, color, message }: PathParams): string => {
  const parts = [encodeBadgeText(label)];
  if (message) parts.push(encodeBadgeText(message));
  if (color) parts.push(shields.encodeBadgeColor(color));
  return parts.join('-');
};

export const { element, md, url } = shields.createBadgeHandlers(formatPathParams);
