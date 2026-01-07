import type {
  AngleWithVar,
  NumberWithVar,
  PercentWithVar,
  SharedKeyword,
  WithVar
} from './shared.js';

//#region> Opacity
/** https://www.w3.org/TR/css-color-4/#typedef-opacity-opacity-value */
type Opacity = '0' | '1' | `.${number}` | `0.${number}`;
type OpacityWithVar = WithVar<Opacity>;
//#endregion

//#region> Hex
/** https://www.w3.org/TR/css-color-4/#hex-notation */
type Hex = `#${string}`;
type HexWithVar = WithVar<Hex>;
//#endregion

//#region> Functions

//#region> Rgb / Rgba
/** https://www.w3.org/TR/css-color-4/#funcdef-rgb */
type Rgb =
  | `rgb(${NumberWithVar}, ${NumberWithVar}, ${NumberWithVar})`
  | `rgb(${NumberWithVar} ${NumberWithVar} ${NumberWithVar})`;
/** https://www.w3.org/TR/css-color-4/#funcdef-rgba */
type Rgba =
  | `rgb(${NumberWithVar}, ${NumberWithVar}, ${NumberWithVar}, ${Opacity})`
  | `rgb(${NumberWithVar} ${NumberWithVar} ${NumberWithVar} / ${Opacity})`;
//#endregion
//#region> Hsl / Hsla
/** https://www.w3.org/TR/css-color-4/#funcdef-hsl */
type Hsl =
  | `hsl(${NumberWithVar}, ${PercentWithVar}, ${PercentWithVar})`
  | `hsl(${NumberWithVar} ${PercentWithVar} ${PercentWithVar})`;
/** https://www.w3.org/TR/css-color-4/#funcdef-hsla */
type Hsla =
  | `hsl(${NumberWithVar}, ${PercentWithVar}, ${PercentWithVar}, ${Opacity})`
  | `hsl(${NumberWithVar} ${PercentWithVar} ${PercentWithVar} / ${Opacity})`;
//#endregion
//#region> Ok
/** https://www.w3.org/TR/css-color-4/#funcdef-oklab */
type Oklab = `oklab(${PercentWithVar} ${NumberWithVar} ${string})`;
/** https://www.w3.org/TR/css-color-4/#funcdef-oklch */
type Oklch = `oklch(${PercentWithVar} ${NumberWithVar} ${string})`;
//#endregion
/** https://www.w3.org/TR/css-color-4/#funcdef-color */
type ColorFn = WithVar<
  | `color(${ColorSpace} ${string})`
  | `color(from ${string} ${ColorSpace} ${string})`
>;

/** https://www.w3.org/TR/css-color-4/#funcdef-hwb */
type Hwb =
  | `hwb(${AngleWithVar}, ${PercentWithVar}, ${PercentWithVar}, ${Opacity})`
  | `hwb(${AngleWithVar}, ${PercentWithVar}, ${PercentWithVar})`
  | `hwb(${AngleWithVar} ${PercentWithVar} ${PercentWithVar})`
  | `hwb(${AngleWithVar} ${PercentWithVar} ${PercentWithVar} / ${Opacity})`
  | `hwb(${NumberWithVar}, ${PercentWithVar}, ${PercentWithVar}, ${Opacity})`
  | `hwb(${NumberWithVar}, ${PercentWithVar}, ${PercentWithVar})`
  | `hwb(${NumberWithVar} ${PercentWithVar} ${PercentWithVar})`
  | `hwb(${NumberWithVar} ${PercentWithVar} ${PercentWithVar} / ${Opacity})`;
/** https://www.w3.org/TR/css-color-4/#funcdef-lab */
type Lab = `lab(${PercentWithVar} ${NumberWithVar} ${string})`;
/** https://www.w3.org/TR/css-color-4/#funcdef-lch */
type Lch = `lch(${PercentWithVar} ${NumberWithVar} ${string})`;
//#endregion

//#region> Gradients
type ConicGradient = `conic-gradient(${string})`;
/** https://www.w3.org/TR/css-images-4/#gradients */
type Gradient =
  /** https://www.w3.org/TR/css-images-4/#linear-gradients */
  | ConicGradient
  /** https://www.w3.org/TR/css-images-4/#funcdef-radial-gradient */
  | LinearGradient
  /** https://www.w3.org/TR/css-images-4/#funcdef-conic-gradient */
  | RadialGradient
  /** https://www.w3.org/TR/css-images-4/#funcdef-repeating-linear-gradient */
  | RepeatingConicGradient
  /**https://www.w3.org/TR/css-images-4/#funcdef-repeating-radial-gradient */
  | RepeatingLinearGradient
  /** https://www.w3.org/TR/css-images-4/#funcdef-repeating-conic-gradient */
  | RepeatingRadialGradient;
type LinearGradient = `linear-gradient(${string})`;
type RadialGradient = `radial-gradient(${string})`;
type RepeatingConicGradient = `repeating-conic-gradient(${string})`;
type RepeatingLinearGradient = `repeating-linear-gradient(${string})`;
type RepeatingRadialGradient = `repeating-radial-gradient(${string})`;
//#endregion

//#region> Keywords
/**
 * https://developer.mozilla.org/en-US/docs/Glossary/Color_space
 *
 * https://www.w3.org/TR/css-color-4/#typedef-colorspace-params
 */
type ColorSpace =
  /** https://www.w3.org/TR/css-color-4/#valdef-color-srgb */
  | 'a98-rgb'
  /** https://www.w3.org/TR/css-color-4/#valdef-color-srgb-linear */
  | 'display-p3'
  /** https://www.w3.org/TR/css-color-4/#valdef-color-display-p3 */
  | 'prophoto-rgb'
  /** https://www.w3.org/TR/css-color-4/#valdef-color-a98-rgb */
  | 'rec2020'
  /** https://www.w3.org/TR/css-color-4/#valdef-color-prophoto-rgb */
  | 'srgb-linear'
  /** https://www.w3.org/TR/css-color-4/#valdef-color-rec2020 */
  | 'srgb'
  /** https://www.w3.org/TR/css-color-4/#valdef-color-xyz */
  | 'xyz-d50'
  /** https://www.w3.org/TR/css-color-4/#valdef-color-xyz-d50 */
  | 'xyz-d65'
  /** https://www.w3.org/TR/css-color-4/#valdef-color-xyz-d65 */
  | 'xyz';

type KeyWord =
  /** https://www.w3.org/TR/css-color-4/#valdef-color-currentcolor */
  | 'currentColor'
  /** https://www.w3.org/TR/css-color-4/#valdef-color-transparent */
  | 'transparent'
  | SharedKeyword;

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/named-color
 *
 * https://www.w3.org/TR/css-color-4/#named-colors
 */
type Named =
  | 'aliceblue'
  | 'antiquewhite'
  | 'aqua'
  | 'aquamarine'
  | 'azure'
  | 'beige'
  | 'bisque'
  | 'black'
  | 'blanchedalmond'
  | 'blue'
  | 'blueviolet'
  | 'brown'
  | 'burlywood'
  | 'cadetblue'
  | 'chartreuse'
  | 'chocolate'
  | 'coral'
  | 'cornflowerblue'
  | 'cornsilk'
  | 'crimson'
  | 'cyan'
  | 'darkblue'
  | 'darkcyan'
  | 'darkgoldenrod'
  | 'darkgray'
  | 'darkgreen'
  | 'darkgrey'
  | 'darkkhaki'
  | 'darkmagenta'
  | 'darkolivegreen'
  | 'darkorange'
  | 'darkorchid'
  | 'darkred'
  | 'darksalmon'
  | 'darkseagreen'
  | 'darkslateblue'
  | 'darkslategray'
  | 'darkslategrey'
  | 'darkturquoise'
  | 'darkviolet'
  | 'deeppink'
  | 'deepskyblue'
  | 'dimgray'
  | 'dimgrey'
  | 'dodgerblue'
  | 'firebrick'
  | 'floralwhite'
  | 'forestgreen'
  | 'fuchsia'
  | 'gainsboro'
  | 'ghostwhite'
  | 'gold'
  | 'goldenrod'
  | 'gray'
  | 'green'
  | 'greenyellow'
  | 'grey'
  | 'honeydew'
  | 'hotpink'
  | 'indianred'
  | 'indigo'
  | 'ivory'
  | 'khaki'
  | 'lavender'
  | 'lavenderblush'
  | 'lawngreen'
  | 'lemonchiffon'
  | 'lightblue'
  | 'lightcoral'
  | 'lightcyan'
  | 'lightgoldenrodyellow'
  | 'lightgray'
  | 'lightgreen'
  | 'lightgrey'
  | 'lightpink'
  | 'lightsalmon'
  | 'lightseagreen'
  | 'lightskyblue'
  | 'lightslategray'
  | 'lightslategrey'
  | 'lightsteelblue'
  | 'lightyellow'
  | 'lime'
  | 'limegreen'
  | 'linen'
  | 'magenta'
  | 'maroon'
  | 'mediumaquamarine'
  | 'mediumblue'
  | 'mediumorchid'
  | 'mediumpurple'
  | 'mediumseagreen'
  | 'mediumslateblue'
  | 'mediumspringgreen'
  | 'mediumturquoise'
  | 'mediumvioletred'
  | 'midnightblue'
  | 'mintcream'
  | 'mistyrose'
  | 'moccasin'
  | 'navajowhite'
  | 'navy'
  | 'oldlace'
  | 'olive'
  | 'olivedrab'
  | 'orange'
  | 'orangered'
  | 'orchid'
  | 'palegoldenrod'
  | 'palegreen'
  | 'paleturquoise'
  | 'palevioletred'
  | 'papayawhip'
  | 'peachpuff'
  | 'peru'
  | 'pink'
  | 'plum'
  | 'powderblue'
  | 'purple'
  | 'rebeccapurple'
  | 'red'
  | 'rosybrown'
  | 'royalblue'
  | 'saddlebrown'
  | 'salmon'
  | 'sandybrown'
  | 'seagreen'
  | 'seashell'
  | 'sienna'
  | 'silver'
  | 'skyblue'
  | 'slateblue'
  | 'slategray'
  | 'slategrey'
  | 'snow'
  | 'springgreen'
  | 'steelblue'
  | 'tan'
  | 'teal'
  | 'thistle'
  | 'tomato'
  | 'turquoise'
  | 'violet'
  | 'wheat'
  | 'white'
  | 'whitesmoke'
  | 'yellow'
  | 'yellowgreen';
//#endregion

type Type =
  | ColorFn
  | Gradient
  | Hex
  | Hsl
  | Hsla
  | Hwb
  | KeyWord
  | Lab
  | Lch
  | Named
  | Oklab
  | Oklch
  | Rgb
  | Rgba;

export type {
  ColorFn,
  ColorSpace,
  ConicGradient,
  Gradient,
  Hex,
  HexWithVar,
  Hsl,
  Hsla,
  Hwb,
  KeyWord,
  Lab,
  Lch,
  LinearGradient,
  Named,
  Oklab,
  Oklch,
  Opacity,
  OpacityWithVar,
  RadialGradient,
  RepeatingConicGradient,
  RepeatingLinearGradient,
  RepeatingRadialGradient,
  Rgb,
  Rgba,
  Type
};
