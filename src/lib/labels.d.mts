export type Rect={x:number;y:number;width:number;height:number};
export type LabelInput={id:string;x:number;y:number;width:number};
export type Road={a:{x:number;y:number};b:{x:number;y:number};padding:number};
export function overlaps(a:Rect,b:Rect,gap?:number):boolean;
export function segmentHitsRect(a:{x:number;y:number},b:{x:number;y:number},rect:Rect,padding?:number):boolean;
export function placeLabels(items:LabelInput[],viewport:{width:number;height:number},protectedRects?:Rect[],roads?:Road[]):Array<LabelInput&Rect&{anchorX:number;anchorY:number}>;
