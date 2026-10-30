import type{Habitat}from'./habitats.mjs';import type{AnimalProfile}from'./animal-life.mjs';
export const hamsterRooms:{id:string;label:string;nodes:number[][];floor:number[][]}[];
export const hamsterGround:Habitat;
export const groundHabitats:Record<string,Habitat>;
export const groundProfiles:AnimalProfile[];
export const groundPathSafe:typeof import('./habitats.mjs').safeAnimalPath;
export const hamsterPlacement:{left:number;top:number;width:number;height:number};
export const hamsterFencePolygons:number[][][];
