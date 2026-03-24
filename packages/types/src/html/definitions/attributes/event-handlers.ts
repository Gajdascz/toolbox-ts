export type OnMouse =
  | 'onmousedown'
  | 'onmouseenter'
  | 'onmouseleave'
  | 'onmousemove'
  | 'onmouseout'
  | 'onmouseover'
  | 'onmouseup';
export type OnDrag =
  | 'ondrag'
  | 'ondragend'
  | 'ondragenter'
  | 'ondragleave'
  | 'ondragover'
  | 'ondragstart';
export type OnClipboard = 'oncopy' | 'oncut' | 'onpaste';
export type OnContext = 'oncontextlost' | 'oncontextmenu' | 'oncontextrestored';
export type OnBefore = 'onbeforeinput' | 'onbeforematch' | 'onbeforetoggle';
export type OnClick = 'onclick' | 'ondblclick' | 'onauxclick';
export type OnLoad = 'onload' | 'onloadeddata' | 'onloadedmetadata' | 'onloadstart';
export type OnKey = 'onkeydown' | 'onkeypress' | 'onkeyup';
export type Global =
  | OnMouse
  | OnDrag
  | OnClipboard
  | OnContext
  | OnBefore
  | OnClick
  | OnLoad
  | OnKey
  | 'onblur'
  | 'oncancel'
  | 'oncanplay'
  | 'oncanplaythrough'
  | 'onchange'
  | 'onclose'
  | 'oncommand'
  | 'oncuechange'
  | 'ondrop'
  | 'ondurationchange'
  | 'onemptied'
  | 'onended'
  | 'onerror'
  | 'onfocus'
  | 'onformdata'
  | 'oninput'
  | 'oninvalid'
  | 'onpause'
  | 'onplay'
  | 'onplaying'
  | 'onprogress'
  | 'onratechange'
  | 'onreset'
  | 'onresize'
  | 'onscroll'
  | 'onscrollend'
  | 'onsecuritypolicyviolation'
  | 'onseeked'
  | 'onseeking'
  | 'onselect'
  | 'onslotchange'
  | 'onstalled'
  | 'onsubmit'
  | 'onsuspend'
  | 'ontimeupdate'
  | 'ontoggle'
  | 'onvolumechange'
  | 'onwaiting'
  | 'onwheel';
