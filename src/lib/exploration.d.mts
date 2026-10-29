export type ExplorationVisitor={id:string;name:string;setting:string;x:number;y:number;width:number;aspect:number;contact:number[];size:number;duration:number;fact:string;source:{name:string;url:string};reaction:string;approved:number[];excluded:number[];audit:string};
export type ExplorationActor={id:string;elapsed:number;reacting:boolean;frame:number};
export const explorationReviewed:string;
export const explorationVisitors:ExplorationVisitor[];
export function visitorPoint(p:ExplorationVisitor):{x:number;y:number};
export function createExplorationLife(options?:{onUpdate?:(actors:ExplorationActor[])=>void}):{snapshot:()=>ExplorationActor[];react:(id:string)=>boolean;tick:(dt:number)=>void;setPaused:(v:boolean)=>void;setReduced:(v:boolean)=>void;dispose:()=>void};
