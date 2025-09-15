export type Axis2D = 'x' | 'y';
export type Axis3D = 'z' | Axis2D;
export interface AxisToDimension {
  x: 'width';
  y: 'height';
  z: 'depth';
}
export type Coordinates2D = { [K in Axis2D]: number };
export type Coordinates3D = { [K in Axis3D]: number };

export type Corner = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
export type CornerAbbr = 'bl' | 'br' | 'tl' | 'tr';
export type DimensionKey2D = 'height' | 'width';
export type DimensionKey3D = 'depth' | DimensionKey2D;
export type Dimensions2D = { [K in DimensionKey2D]: number };
export type Dimensions3D = { [K in DimensionKey3D]: number };
export interface DimensionToAxis {
  depth: 'z';
  height: 'y';
  width: 'x';
}

export type Direction = 'down' | 'left' | 'right' | 'up';
export type Edge = 'bottom' | 'left' | 'right' | 'top';
export type EdgeAbbr = 'b' | 'l' | 'r' | 't';
export type Orientation = 'horizontal' | 'vertical';
export interface OrientationToEdges {
  horizontal: ['left', 'right'];
  vertical: ['top', 'bottom'];
}
