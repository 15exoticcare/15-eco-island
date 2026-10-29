import type {Facing} from './animation.mjs';
type Point={x:number;y:number};
type Paths=Record<string,Point[]>;
export type PatrolState={location:string;target:string|null;phase:'walk'|'wait';position:Point;distance:number;direction:Facing;automatic:boolean;paused:boolean;pending:string|null;nextStop:string};
export type Patrol={order:string[];snapshot:()=>PatrolState;tick:(dt:number)=>void;requestManual:(id:string)=>boolean;setPaused:(paused:boolean)=>void};
export function buildPatrolOrder(paths:Paths):string[];
export function createPatrol(paths:Paths,onUpdate:(state:PatrolState)=>void):Patrol;
export function createPatrolLoop(patrol:Patrol,scheduler:{requestFrame:(callback:(time:number)=>void)=>number;cancelFrame:(id:number)=>void}):{setVisible:(visible:boolean)=>void;dispose:()=>void};
export function describePatrol(state:PatrolState,names:Record<string,string>):{status:string;location:string;next:string;detail:string};
