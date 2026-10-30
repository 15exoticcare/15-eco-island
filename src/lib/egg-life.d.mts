export type EggView={id:string;species:string;position:{x:number;y:number};state:string;elapsed:number;duration:number;frame:number;facing:string};
export function createEggLife(options?:{seed?:number;onUpdate?:(actors:EggView[])=>void}):{snapshot:()=>EggView[];tick:(dt:number)=>void;react:(id:string)=>boolean;setPaused:(v:boolean)=>void;setReduced:(v:boolean)=>void;dispose:()=>void};
