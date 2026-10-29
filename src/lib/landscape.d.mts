import type {Point} from './islands';
export function groundFrame(a:Point,b:Point,width?:number):{t:Point;n:Point;length:number};
export function pathLength(points:Point[]):number;
export function pointAt(points:Point[],distance:number):{point:Point;a:Point;b:Point};
export function roundRoute(points:Point[],radius?:number):Point[];
