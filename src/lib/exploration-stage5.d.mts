export type EggIsland={id:string;name:string;place:string;setting:string;description:string;x:number;y:number;width:number;height:number;fact:string;source:{name:string;url:string}};
export type EggAnimal={id:string;species:string;name:string;x:number;y:number;size:number;move:boolean;period:number;wait:number;to?:number[];perch?:boolean};
export const eggReviewed:string;
export const eggWorld:{width:number;height:number;center:{x:number;y:number};bounds:{width:number;height:number}};
export const eggIslands:EggIsland[];
export const eggAnimals:EggAnimal[];
export const eggCounts:Record<string,number>;
export function eggPoint(a:EggAnimal):{x:number;y:number};
