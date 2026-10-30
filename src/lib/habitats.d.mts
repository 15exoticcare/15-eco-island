type Point={x:number;y:number};
export type Zone={nodes:Point[];polygon:Point[];support?:Point[];label?:string;floor?:number};
export type Habitat={height:number;kind:'ground'|'perch'|'branch';separate:boolean;note:string;zones:Record<string,Zone>;obstacles:Point[][];occluders:{depth:number;polygon:number[][]}[]};
export const habitats:Record<string,Habitat>;
export function inside(p:Point,poly:Point[]):boolean;
export function segmentDistance(p:Point,a:Point,b:Point):number;
export function safeAnimalPoint(island:string,id:string,p:Point,radius?:number,habitatMap?:Record<string,Habitat>):boolean;
export function safeAnimalPath(island:string,id:string,a:Point,b:Point,others?:{position:Point;target:Point|null}[],habitatMap?:Record<string,Habitat>):boolean;
