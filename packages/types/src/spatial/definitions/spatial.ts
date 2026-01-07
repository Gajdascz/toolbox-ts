//#region> Axes
/**
 * 2D plane axes
 *
 * @example
 * ```text
 *    y
 *    |
 * ___o___x
 *    |
 * ```
 */
export type Axis2D = 'x' | 'y';
/**
 * 3D space axes
 *
 * @example
 * ```text
 *    z
 *    |
 *    o--- x
 *   /
 *  y
 * ```
 */
export type Axis3D = 'z' | Axis2D;
//#endregion

//#region> Coordinates
/**
 * Cartesian coordinates in 2D space
 * @see {@link Axis2D}
 */
export type Coordinates2D = { [K in Axis2D]: number };
/**
 * Cartesian coordinates in 3D space
 * @see {@link Axis3D}
 */
export type Coordinates3D = { [K in Axis3D]: number };
//#endregion

//#region> Dimensions
/**
 * Mapping of 2D/3D axes to their corresponding dimension keys
 */
export interface AxisToDimension {
  x: 'width';
  y: 'height';
  z: 'depth';
}
/**
 * 2D dimensions corresponding to relevant axes
 * x \> width, y \> height
 */
export type DimensionKey2D = 'height' | 'width';
/**
 * 3D dimensions corresponding to relevant axes
 * x \> width, y \> height, z \> depth
 */
export type DimensionKey3D = 'depth' | DimensionKey2D;
/**
 * 2D dimensions with values
 * @example
 * ```ts
 * const boxDimensions: Dimensions2D = { width: 100, height: 50 };
 * ```
 */
export type Dimensions2D = { [K in DimensionKey2D]: number };
/**
 *  3D dimensions with values
 * @example
 * ```ts
 * const boxDimensions: Dimensions3D = { width: 100, height: 50, depth: 25 };
 * ```
 */
export type Dimensions3D = { [K in DimensionKey3D]: number };
/**
 * Mapping of dimensions to their corresponding axes
 */
export interface DimensionToAxis {
  depth: 'z';
  height: 'y';
  width: 'x';
}
//#endregion

//#region> Directional
/**
 * Corners of a rectangle or box
 */
export type Corner = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
/**
 * Abbreviated corners of a rectangle or box
 */
export type CornerAbbr = 'bl' | 'br' | 'tl' | 'tr';
/**
 * Mapping of abbreviated corners to full corner names
 */
export interface CornerAbbrToCorner {
  bl: 'bottomLeft';
  br: 'bottomRight';
  tl: 'topLeft';
  tr: 'topRight';
}
/**
 * Directions in 2D space
 */
export type Direction = 'down' | 'left' | 'right' | 'up';
/**
 * Edges of a rectangle or box
 */
export type Edge = 'bottom' | 'left' | 'right' | 'top';
/**
 * Abbreviated edges of a rectangle or box
 */
export type EdgeAbbr = 'b' | 'l' | 'r' | 't';
/**
 * Mapping of abbreviated edges to full edge names
 */
export interface EdgeAbbrToEdge {
  b: 'bottom';
  l: 'left';
  r: 'right';
  t: 'top';
}
/**
 * Orientation in 2D space
 */
export type Orientation = 'horizontal' | 'vertical';
/**
 * Mapping of orientations to their corresponding edges
 */
export interface OrientationToEdges {
  horizontal: ['left', 'right'];
  vertical: ['top', 'bottom'];
}
//#endregion
