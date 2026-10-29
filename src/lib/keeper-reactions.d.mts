export type KeeperReaction={id:string;state:'observe'|'listen'|'care';sequence:number[];label:string;variant:number;delay:number;duration:number};
export const keeperPolicies:Record<string,{preferred:string[];radius:number;limit:number;protected?:string[];quiet?:boolean;chance?:number;purpose:string;labels:string[]}>;
export function planKeeperReactions(options:{island:string;residents:any[];point:{x:number;y:number};clock:number;random:()=>number}):KeeperReaction[];
