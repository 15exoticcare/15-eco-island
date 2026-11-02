import{rules as baseRules,slimeTypes as baseSlimes,towerTypes,basicTowers,towerArt,slimeArt as baseArt,type SlimeKind as BaseSlime,type TowerKind,type TowerSpec,type Mechanism}from'../campaign/balance.ts';
export{towerTypes,basicTowers,towerArt};export type{TowerKind,TowerSpec,Mechanism};export type SlimeKind=BaseSlime|'king';
export const rules=baseRules;
export const slimeTypes={...baseSlimes,king:{name:'史萊姆國王',hp:1500,speed:72,reward:180,leak:20,color:'#b4c9cf',shield:0,description:'皇家護盾・有限護衛・預警衝刺，沿完整道路前進'}};
export const slimeArt=(kind:SlimeKind)=>kind==='king'?'/assets/chapter11/slime-king.webp':baseArt(kind);
export const bossRules={thresholds:[.7,.35],shield:140,shieldDuration:6,guardTimes:[6,20],guardsPerCall:3,maxGuards:6,dashTimes:[10,29,48],dashWarning:1.5,dashDuration:3,dashSpeed:1.8};
export const supportRules={cooldown:45,radius:260,damage:160,bossDamage:65,slow:.45,slowDuration:3,duration:4.4,hitAt:2.2};
