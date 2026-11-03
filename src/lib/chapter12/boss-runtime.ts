import {bosses,isBoss} from './bosses.ts';
import type {Enemy,State} from './engine.ts';import type {SlimeKind} from './balance.ts';
type Hooks={state:State;spawn:(kind:SlimeKind,distance?:number,generation?:number,parentHp?:number,childIndex?:number)=>Enemy|null;position:(e:Enemy)=>{x:number;y:number};signal:(type:string,kind?:string)=>void;effect:(point:{x:number;y:number},kind:any,color:string,extra?:any)=>void;scale:number;maxEnemies:number};
export function updateBoss(e:Enemy,h:Hooks){if(!isBoss(e.kind)||!e.royal||e.hp<=0)return;const b=bosses[e.kind],r=e.royal,s=h.state,age=s.time-e.born,p=h.position(e);const cue=(type:string)=>h.signal(type,e.kind),fx=(kind:any='royal')=>h.effect(p,kind,b.color);
 if(e.shield>0&&s.time>=r.shieldUntil){e.shield=0;fx('shield');cue('shield')}
 if(r.phase===1&&e.hp/e.maxHp<=b.phaseAt){r.phase=2;fx();cue('boss-phase')}
 const shield=(count:number)=>{if(r.shields>=count)return;r.shields++;e.shield=b.shield;e.maxShield=Math.max(e.maxShield,b.shield);r.shieldUntil=s.time+b.shieldSeconds;fx();cue('royal-shield')};
 const guards=(number:number)=>{r.guardCalls++;for(let i=0;i<number&&r.guards<b.summonLimit;i++){const child=h.spawn(i%2?'blue':'green',Math.max(0,e.distance-i*12));if(child)r.guards++}fx();cue('guards')};
 if(['clover','crystal','king'].includes(b.ability)){for(const[t,count]of [[.7,1],[.35,2]])if(e.hp/e.maxHp<=t&&r.shields<count)shield(count)}
 if(b.ability==='armor'&&r.shields<3&&e.maxHp-e.hp>=e.maxHp*.23*(r.shields+1)&&e.shield<=0)shield(3);
 if(b.ability==='split'){if(r.guardCalls===0&&e.hp/e.maxHp<=.7)guards(3);if(r.guardCalls===1&&e.hp/e.maxHp<=.35)guards(3)}
 if(b.ability==='clover'&&r.guardCalls<2&&age>=[7,22][r.guardCalls])guards(2);
 if(b.ability==='king'&&r.guardCalls<2&&age>=[6,20][r.guardCalls])guards(3);
 const timed=['heal','wind','dash','mirage','king'].includes(b.ability),max=b.ability==='king'?3:b.maxCasts;
 if(timed&&r.casts<max&&!r.dashWarnAt&&age>=r.nextCast){r.dashWarnAt=s.time;cue('boss-warning');fx('dash')}
 if(r.dashWarnAt&&s.time-r.dashWarnAt>=b.warning){r.dashWarnAt=0;r.casts++;r.nextCast=age+(r.phase===2?b.cooldown*.67:b.cooldown);cue('boss-skill');fx();
  if(b.ability==='dash'||b.ability==='king'){r.dashCalls++;r.dashUntil=s.time+3;r.nextCast=age+(b.ability==='king'?19:r.phase===2?9:14)}
  if(b.ability==='heal'){const amount=r.phase===2?22:16;let healed=0;for(const a of s.enemies){if(a.id===e.id||a.hp<=0||isBoss(a.kind)||a.illusion||a.healLock>s.time||a.hp>=a.maxHp||Math.hypot(h.position(a).x-p.x,h.position(a).y-p.y)>340*h.scale)continue;const used=Math.min(amount,a.maxHp-a.hp);a.hp+=used;a.healLock=s.time+2;a.healedUntil=s.time+.6;healed+=used;s.heals++}r.totalHealing+=healed;h.effect(p,'heal',b.color,{radius:340*h.scale})}
  if(b.ability==='wind'){for(const a of s.enemies)if(a.hp>0&&!isBoss(a.kind)&&!a.illusion&&Math.hypot(h.position(a).x-p.x,h.position(a).y-p.y)<=420*h.scale)a.hasteUntil=s.time+3;h.effect(p,'aura',b.color,{radius:420*h.scale})}
  if(b.ability==='mirage'){for(let i=0;i<2;i++){const a=h.spawn('green',Math.min(e.distance+18+i*20,e.distance+38));if(a){a.hp=a.maxHp=90;a.illusion={owner:e.id,until:s.time+8};r.phantoms++}}}
 }
}
