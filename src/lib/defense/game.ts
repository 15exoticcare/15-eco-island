// Pure deterministic simulation. No React, DOM, storage, network or wall clock.
import {chapter8Layout,type DefenseLayout}from'./layouts.ts';
import {createRoute}from'./route.ts';
export type Point={x:number;y:number};
export type SlimeKind='green'|'blue'|'purple';
export type TowerKind='seed'|'bubble'|'star';
export {defenseWorld} from './world.ts';
// Edition 8 exports stay compatible with the saved prototype.
export const trail=chapter8Layout.trail,pads=chapter8Layout.pads;
export const slimeTypes:Record<SlimeKind,{name:string;hp:number;speed:number;reward:number;leak:number;color:string}>={green:{name:'綠色史萊姆',hp:44,speed:115,reward:12,leak:2,color:'#8da773'},blue:{name:'藍色史萊姆',hp:30,speed:175,reward:14,leak:1,color:'#8bc5d5'},purple:{name:'紫色史萊姆',hp:125,speed:82,reward:24,leak:4,color:'#b5a1c9'}};
export const towerTypes:Record<TowerKind,{name:string;cost:number;damage:number;range:number;interval:number;speed:number;description:string;color:string}>={
 seed:{name:'種子射手塔',cost:55,damage:24,range:470,interval:.85,speed:720,description:'俐落種子・單體攻擊',color:'#93a56d'},
 bubble:{name:'泡泡減速塔',cost:65,damage:9,range:450,interval:1.05,speed:580,description:'輕柔泡泡・減速 2 秒',color:'#83b6c6'},
 star:{name:'星光魔法塔',cost:90,damage:25,range:460,interval:1.65,speed:630,description:'星光綻放・範圍 160',color:'#c7ae78'}
};
const waveKinds:SlimeKind[][]=[['green','green','blue','green','green','blue'],['green','blue','green','purple','blue','green','blue','green','purple'],['blue','green','purple','blue','green','blue','purple','green','blue','purple','green','blue'],['green','purple','blue','purple','blue','green','purple','blue','blue','purple','green','blue','purple','green','blue'],['purple','blue','green','purple','blue','purple','blue','green','purple','blue','purple','blue','green','purple','blue','purple','blue','green','purple','blue']];
const legacyRoute=createRoute(trail);
export const trailLength=legacyRoute.length,trailPoint=legacyRoute.point;
export type Enemy={id:number;kind:SlimeKind;hp:number;maxHp:number;distance:number;slowUntil:number;hitUntil:number};
export type Tower={pad:string;kind:TowerKind;level:number;cooldown:number;shots:number};
export type Shot={id:number;kind:TowerKind;target:number;x:number;y:number;damage:number;speed:number};
export type Effect={id:number;x:number;y:number;kind:'burst'|'escape'|'impact';color:string;born:number};
export type Status='ready'|'planning'|'running'|'paused'|'won'|'lost';
export type State={status:Status;resume:Status;coins:number;health:number;wave:number;time:number;queue:SlimeKind[];spawnIn:number;enemies:Enemy[];towers:Tower[];shots:Shot[];effects:Effect[];kills:number;leaks:number;spent:number;earned:number;danger:boolean;revision:number};
export function createDefense(layout:DefenseLayout=chapter8Layout){const {trail,pads}=layout,{length:trailLength,point:trailPoint}=createRoute(trail);let serial=0;const initial=():State=>({status:'ready',resume:'planning',coins:150,health:20,wave:0,time:0,queue:[],spawnIn:0,enemies:[],towers:[],shots:[],effects:[],kills:0,leaks:0,spent:0,earned:0,danger:false,revision:0});let s=initial();
 const changed=()=>s.revision++;
 function start(){if(s.status!=='ready')return false;s.status='planning';changed();return true}
 function restart(){s=initial();serial=0;changed();return s}
 function nextWave(){if(s.status!=='planning'||s.wave>=5)return false;s.wave++;s.queue=[...waveKinds[s.wave-1]];s.spawnIn=0;s.status='running';changed();return true}
 function pause(){if(!['planning','running'].includes(s.status))return false;s.resume=s.status;s.status='paused';changed();return true}
 function resume(){if(s.status!=='paused')return false;s.status=s.resume;changed();return true}
 function build(pad:string,kind:TowerKind){if(!['planning','running'].includes(s.status)||!pads.some(p=>p.id===pad)||s.towers.some(t=>t.pad===pad)||!towerTypes[kind]||s.coins<towerTypes[kind].cost)return false;const cost=towerTypes[kind].cost;s.coins-=cost;s.spent+=cost;s.towers.push({pad,kind,level:1,cooldown:0,shots:0});changed();return true}
 function upgradeCost(t:Tower){return Math.round(towerTypes[t.kind].cost*.75*t.level)}
 function upgrade(pad:string){const t=s.towers.find(t=>t.pad===pad);if(!t||!['planning','running'].includes(s.status)||t.level>=3||s.coins<upgradeCost(t))return false;const cost=upgradeCost(t);s.coins-=cost;s.spent+=cost;t.level++;changed();return true}
 function stats(t:Tower){const base=towerTypes[t.kind];return{...base,damage:base.damage*(1+.6*(t.level-1)),range:base.range*(1+.12*(t.level-1)),interval:base.interval*Math.pow(.9,t.level-1)}}
 function effect(p:Point,kind:Effect['kind'],color:string){s.effects.push({id:++serial,...p,kind,color,born:s.time})}
 function hit(e:Enemy,shot:Shot){if(e.hp<=0)return;e.hp-=shot.damage;e.hitUntil=s.time+.18;if(shot.kind==='bubble')e.slowUntil=s.time+2;if(e.hp<=0){s.coins+=slimeTypes[e.kind].reward;s.earned+=slimeTypes[e.kind].reward;s.kills++;effect(trailPoint(e.distance),'burst',slimeTypes[e.kind].color);changed()}}
 function tick(input:number){if(s.status!=='running'||!Number.isFinite(input)||input<=0)return;const dt=Math.min(input,.05);s.time+=dt;s.spawnIn-=dt;
  if(s.queue.length&&s.spawnIn<=0){const kind=s.queue.shift()!,hp=slimeTypes[kind].hp*(1+(s.wave-1)*.2);s.enemies.push({id:++serial,kind,hp,maxHp:hp,distance:0,slowUntil:0,hitUntil:0});s.spawnIn=Math.max(.55,1.2-s.wave*.1);changed()}
  for(const e of s.enemies){if(e.hp<=0)continue;e.distance+=slimeTypes[e.kind].speed*dt*(e.slowUntil>s.time?.55:1);if(e.distance>=trailLength){e.hp=0;s.health=Math.max(0,s.health-slimeTypes[e.kind].leak);s.leaks++;effect(trail.at(-1)!,'escape','#e7c39b');changed()}}
  const danger=layout.warningDistance>0&&s.enemies.some(e=>e.hp>0&&e.distance>=trailLength-layout.warningDistance);if(s.danger!==danger){s.danger=danger;changed()}
  if(s.health===0){s.status='lost';s.shots=[];s.queue=[];changed();return}
  for(const t of s.towers){t.cooldown-=dt;if(t.cooldown>0)continue;const p=pads.find(p=>p.id===t.pad)!,spec=stats(t),target=s.enemies.filter(e=>e.hp>0&&Math.hypot(trailPoint(e.distance).x-p.x,trailPoint(e.distance).y-p.y)<=spec.range).sort((a,b)=>b.distance-a.distance)[0];if(target){s.shots.push({id:++serial,kind:t.kind,target:target.id,x:p.x,y:p.y-45,damage:spec.damage,speed:spec.speed});t.shots++;t.cooldown=spec.interval}}
  s.shots=s.shots.filter(shot=>{const target=s.enemies.find(e=>e.id===shot.target&&e.hp>0);if(!target)return false;const p=trailPoint(target.distance),d=Math.hypot(p.x-shot.x,p.y-shot.y);if(d<=shot.speed*dt+8){if(shot.kind==='star'){effect(p,'impact','#d5bf87');for(const e of s.enemies)if(e.hp>0&&Math.hypot(trailPoint(e.distance).x-p.x,trailPoint(e.distance).y-p.y)<=160)hit(e,shot)}else hit(target,shot);return false}shot.x+=(p.x-shot.x)/d*shot.speed*dt;shot.y+=(p.y-shot.y)/d*shot.speed*dt;return true});
  s.enemies=s.enemies.filter(e=>e.hp>0);s.effects=s.effects.filter(e=>s.time-e.born<.7);if(!s.queue.length&&!s.enemies.length&&!s.effects.length){s.shots=[];s.status=s.wave===5?'won':'planning';changed()}
 }
 return{get state(){return s},start,restart,nextWave,pause,resume,build,upgrade,upgradeCost,stats,tick};
}
export type DefenseGame=ReturnType<typeof createDefense>;
