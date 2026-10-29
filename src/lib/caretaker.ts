import type {Facing} from './animation.mjs';
export const caretakerClips={
 front:{file:'walk-front',frames:8,logo:{x:89,y:82,width:14,height:14}},
 back:{file:'walk-back',frames:8,logo:null},
 right:{file:'walk-side',frames:8,logo:{x:101,y:76,width:7,height:14}},
 left:{file:'walk-side',frames:8,logo:{x:101,y:76,width:7,height:14}}
} satisfies Record<Facing,{file:string;frames:number;logo:{x:number;y:number;width:number;height:number}|null}>;
export const caretakerAssetStatus='逐格步態原型・仍待動作精修';
