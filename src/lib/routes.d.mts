import type {IslandId,Point} from './islands';
export function findRoute(from:IslandId,to:IslandId,paths:Record<Exclude<IslandId,'main'>,Point[]>):Point[];
export function stepAlong(points:Point[],distance:number):Point & {done:boolean};
