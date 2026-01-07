export type Percent = `${number}%`;

//#region> Angle
type Angle = Deg | Grad | Rad | Turn;
type Deg = `${number}deg`;
type Grad = `${number}grad`;
type Rad = `${number}rad`;
type Turn = `${number}turn`;
export type { Angle, Deg, Grad, Rad, Turn };
//#endregion

//#region> Time
type Ms = `${number}ms`;
type S = `${number}s`;
type Time = Ms | S;
export type { Ms, S, Time };
//#endregion

//#region> Lengths
//#region>> Absolute
type Absolute = Cm | In | Mm | Pc | Pt | Px | Q;
/** https://www.w3.org/TR/css-values-4/#absolute-lengths */
type Cm = `${number}cm`;
type In = `${number}in`;
type Mm = `${number}mm`;
type Pc = `${number}pc`;
type Pt = `${number}pt`;
type Px = `${number}px`;
type Q = `${number}Q`;
export type { Absolute, Cm, In, Mm, Pc, Pt, Px, Q };
//#endregion
//#region>> Container
/** https://www.w3.org/TR/css-contain-3/#container-lengths */
type Container = Cqb | Cqh | Cqi | Cqmax | Cqmin | Cqw;
type Cq = Cqb | Cqh | Cqi | Cqmax | Cqmin | Cqw;
type Cqb = `${number}cqb`;
type Cqh = `${number}cqh`;
type Cqi = `${number}cqi`;
type Cqmax = `${number}cqmax`;
type Cqmin = `${number}cqmin`;
type Cqw = `${number}cqw`;
export type { Container, Cq, Cqb, Cqh, Cqi, Cqmax, Cqmin, Cqw };
//#endregion
//#region>> Font-Relative
//#region>>> Local
type Cap = `${number}cap`;
type Ch = `${number}ch`;
type Em = `${number}em`;
type Ex = `${number}ex`;
type Ic = `${number}ic`;
type Lh = `${number}lh`;
type LocalFontRelative = Cap | Ch | Em | Ex | Ic | Lh;
export type { Cap, Ch, Em, Ex, Ic, Lh, LocalFontRelative };
//#endregion
//#region>>> Root
type Rcap = `${number}rcap`;
type Rch = `${number}rch`;
type Rem = `${number}rem`;
type Rex = `${number}rex`;
type Ric = `${number}ric`;
type Rlh = `${number}rlh`;
type RootFontRelative = Rcap | Rch | Rem | Rex | Ric | Rlh;
export type { Rcap, Rch, Rem, Rex, Ric, Rlh, RootFontRelative };
//#endregion
//#endregion
//#region>> Viewport
//#region>>> Default
type DefaultViewport = Vb | Vh | Vi | Vmax | Vmin | Vw;
type Vb = `${number}vb`;
type Vh = `${number}vh`;
type Vi = `${number}vi`;
type Vmax = `${number}vmax`;
type Vmin = `${number}vmin`;
type Vw = `${number}vw`;
export type { DefaultViewport, Vb, Vh, Vi, Vmax, Vmin, Vw };
//#endregion
//#region>>> Dynamic
type Dvb = `${number}dvb`;
type Dvh = `${number}dvh`;
type Dvi = `${number}dvi`;
type Dvmax = `${number}dvmax`;
type Dvmin = `${number}dvmin`;
type Dvw = `${number}dvw`;
type DynamicViewport = Dvb | Dvh | Dvi | Dvmax | Dvmin | Dvw;
export type { Dvb, Dvh, Dvi, Dvmax, Dvmin, Dvw, DynamicViewport };
//#endregion
//#region>>> Large-percentage
type LargeViewport = Lvb | Lvh | Lvi | Lvmax | Lvmin | Lvw;
type Lvb = `${number}lvb`;
type Lvh = `${number}lvh`;
type Lvi = `${number}lvi`;
type Lvmax = `${number}lvmax`;
type Lvmin = `${number}lvmin`;
type Lvw = `${number}lvw`;
export type { LargeViewport, Lvb, Lvh, Lvi, Lvmax, Lvmin, Lvw };
//#endregion
//#region>>> Small viewport-percentage units
type SmallViewportPercentage = Svb | Svh | Svi | Svmax | Svmin | Svw;
type Svb = `${number}svb`;
type Svh = `${number}svh`;
type Svi = `${number}svi`;
type Svmax = `${number}svmax`;
type Svmin = `${number}svmin`;
type Svw = `${number}svw`;
export type { SmallViewportPercentage, Svb, Svh, Svi, Svmax, Svmin, Svw };
//#endregion
export type Viewport =
  | Dvb
  | Dvh
  | Dvi
  | Dvmax
  | Dvmin
  | Dvw
  | Lvb
  | Lvh
  | Lvi
  | Lvmax
  | Lvmin
  | Lvw
  | Svb
  | Svh
  | Svi
  | Svmax
  | Svmin
  | Svw
  | Vb
  | Vh
  | Vi
  | Vmax
  | Vmin
  | Vw;
//#endregion

export type Length =
  | Absolute
  | Container
  | DynamicViewport
  | LargeViewport
  | LocalFontRelative
  | RootFontRelative
  | SmallViewportPercentage
  | Viewport;
//#endregion

//#region> Resolution
type Dpcm = `${number}dpcm`;
type Dpi = `${number}dpi`;
type Dppx = `${number}dppx`;
type Fr = `${number}fr`;
type Resolution = Dpcm | Dpi | Dppx | X;
type X = `${number}x`;
export type { Dpcm, Dpi, Dppx, Fr, Resolution, X };
//#endregion
