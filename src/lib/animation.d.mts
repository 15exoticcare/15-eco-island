import type {Point} from './islands';
export const STRIDE:number;
export type Facing='front'|'back'|'left'|'right';
export function gaitFrame(distance:number,count?:number):number;
export function directionFor(dx:number,dy:number):Facing;
export function sampleRoute(points:Point[],distance:number):Point & {direction:Facing;done:boolean};
