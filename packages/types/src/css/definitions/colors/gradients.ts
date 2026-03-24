/** https://www.w3.org/TR/css-images-4/#funcdef-conic-gradient */
export type ConicGradient = `conic-gradient(${string})`;
/** https://www.w3.org/TR/css-images-4/#linear-gradients */
export type LinearGradient = `linear-gradient(${string})`;
/** https://www.w3.org/TR/css-images-4/#funcdef-radial-gradient */
export type RadialGradient = `radial-gradient(${string})`;
/** https://www.w3.org/TR/css-images-4/#funcdef-repeating-conic-gradient */
export type RepeatingConicGradient = `repeating-conic-gradient(${string})`;
/** https://www.w3.org/TR/css-images-4/#funcdef-repeating-linear-gradient */
export type RepeatingLinearGradient = `repeating-linear-gradient(${string})`;
/**https://www.w3.org/TR/css-images-4/#funcdef-repeating-radial-gradient */
export type RepeatingRadialGradient = `repeating-radial-gradient(${string})`;

/** https://www.w3.org/TR/css-images-4/#gradients */
export type Gradient =
  | ConicGradient
  | LinearGradient
  | RadialGradient
  | RepeatingConicGradient
  | RepeatingLinearGradient
  | RepeatingRadialGradient;
