import {bridgePaths,bridgeSpans,type Point} from './islands.ts';

// Art coordinates are an adapter; animal locomotion and storage IDs are unchanged.
export const dioramaGround={x:600,y:450,width:1800,height:900};
export const dioramaFocus:Record<string,{x:number;y:number;width:number;height:number}>={main:{x:1480,y:850,width:650,height:620},rabbit:{x:850,y:900,width:500,height:500},parrot:{x:2080,y:795,width:650,height:710}};
const at=(x:number,y:number):Point=>({x:600+x*1800/1774,y:450+y*900/887});
const home={x:1480,y:1000};
const rabbit:Point[]=[home,...[[780,565],[660,568],[580,548],[500,545],[440,555],[385,580],[300,606],[200,610],[200,590]].map(([x,y])=>at(x,y))];
const parrot:Point[]=[home,...[[950,558],[1040,580],[1130,565],[1180,545],[1210,575],[1250,610],[1300,615],[1360,620],[1420,620],[1500,620],[1500,600]].map(([x,y])=>at(x,y))];
const leftExit=[[200,610],[120,600],[80,580],[60,540],[40,495]].map(([x,y])=>at(x,y)).concat({x:665,y:910});
const rightExit=[{x:2220,y:1060},{x:2300,y:1040},{x:2340,y:1000}];
const uniqueAdjacent=(p:Point[])=>p.filter((v,i)=>!i||v.x!==p[i-1].x||v.y!==p[i-1].y);
export const dioramaPaths=Object.fromEntries(Object.entries(bridgePaths).map(([id,path])=>{
 if(id==='rabbit')return [id,rabbit];
 if(id==='parrot')return [id,parrot];
 const junction=path.findIndex(p=>p.x===700&&p.y===915);
 if(junction>=0)return [id,uniqueAdjacent([...rabbit,...leftExit,...path.slice(junction+1)])];
 if(id==='hamster')return [id,[home,{x:1470,y:1015},{x:1440,y:1050},{x:1410,y:1080},{x:1370,y:1100},...path.slice(2)]];
 if(id==='hedgehog')return [id,[...parrot,{x:2130,y:1090},{x:2100,y:1130},...path.slice(8)]];
 if(id==='ferret')return [id,[...parrot,...rightExit,...path.slice(9)]];
 if(id==='glider')return [id,[...parrot,...rightExit,...path.slice(9)]];
 return [id,path];
}));
export const dioramaSpans={...Object.fromEntries(Object.entries(bridgeSpans).filter(([id])=>id!=='rabbit'&&id!=='parrot')),
 guinea:[{x:665,y:910},{x:580,y:970}],hamster:[{x:1370,y:1100},{x:1210,y:1400}],hedgehog:[{x:2100,y:1130},{x:1980,y:1390}],ferret:[{x:2340,y:1000},{x:2370,y:935}],glider:[{x:2340,y:1000},{x:2430,y:410}]};
const edge=(a:Point,b:Point)=>[`${a.x},${a.y}`,`${b.x},${b.y}`].sort().join('|');
const native=new Set([rabbit,parrot].flatMap(p=>p.slice(1).map((b,i)=>edge(p[i],b))));
const water=new Set(Object.values(dioramaSpans).map(([a,b])=>edge(a,b))),seen=new Set<string>();
export const dioramaWalkways=Object.values(dioramaPaths).flatMap(path=>path.slice(1).flatMap((b,i)=>{const a=path[i],key=edge(a,b);if(native.has(key)||water.has(key)||seen.has(key))return [];seen.add(key);return [[a,b]];}));
export const rabbitArtOffset={x:0,y:50};
export const parrotArtOffset={x:0,y:0};
