import {rules as oldRules,slimeTypes as ordinary,towerTypes,basicTowers,towerArt,slimeArt as ordinaryArt,type SlimeKind as NormalKind,type TowerKind,type TowerSpec,type Mechanism} from '../campaign/balance.ts';
import {supportRules as originalSupport} from '../chapter11/balance.ts';
import {bosses,isBoss,type BossId} from './bosses.ts';
export {towerTypes,basicTowers,towerArt};export type {TowerKind,TowerSpec,Mechanism,NormalKind};export type SlimeKind=NormalKind|BossId;
export const rules={...oldRules,maxEnemies:56,maxEffects:64,maxShots:96,childReward:2,waveReward:24};
// Species-specific survivability; speed, rewards and bounded abilities stay unchanged.
export const ordinaryHealth={green:58,blue:38,purple:166,orange:88,gold:110,pink:75};
export const slimeTypes={...Object.fromEntries(Object.entries(ordinary).map(([k,v])=>[k,{...v,hp:ordinaryHealth[k as NormalKind],shield:k==='gold'?80:v.shield,reward:Math.round(v.reward*.36)}])),...Object.fromEntries(Object.values(bosses).map(b=>[b.id,{name:b.name,hp:b.hp,speed:b.speed,reward:b.reward,leak:b.leak,color:b.color,shield:0,description:b.description}]))} as Record<SlimeKind,typeof ordinary.green>;
export const slimeArt=(kind:SlimeKind)=>isBoss(kind)?bosses[kind].art:ordinaryArt(kind);
export const supportRules={...originalSupport,cooldown:15};
export {bossRules} from '../chapter11/balance.ts';
