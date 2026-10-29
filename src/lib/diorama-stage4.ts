import {expansionPaths as previousPaths,expansionSpans,expansionWalkways,expansionFocus,expansionOffsets,expansionLabelOffsets} from './diorama-stage3.ts';
import type {Point} from './islands.ts';
const expansionPaths:Record<string,Point[]>=previousPaths;

// Artwork adapters only: stable species IDs, private life zones and animation clocks remain intact.
export const finalRegions=['hamster','hedgehog','chinchilla','glider'];
export const finalGround={
 chinchilla:{x:700,y:220,width:520,height:780,file:'chinchilla-garden',description:'中央後方左側的龍貓岩林，右側草地小徑繞過圍欄'},
 glider:{x:1740,y:160,width:560,height:840,file:'glider-garden',description:'中央後方右側的蜜袋鼯樹棲花園，左側步道沿草地緩坡延伸'},
 front:{x:800,y:1060,width:1400,height:700,file:'front-gardens',description:'中央前庭延伸至四間獨立倉鼠生活空間與刺蝟森林，溪流短橋串連公共道路'}
};
export const chinPixel=(x:number,y:number):Point=>({x:700+x*520/1024,y:220+y*520/1024});
export const gliderPixel=(x:number,y:number):Point=>({x:1740+x*560/1024,y:160+y*560/1024});
export const frontPixel=(x:number,y:number):Point=>({x:800+x*1400/1774,y:1060+y*1400/1774});
const chinApproach=[[900,1490],[900,1360],[900,1200],[900,1030],[895,860],[890,720],[855,620],[820,570]].map(([x,y])=>chinPixel(x,y));
const gliderApproach=[[220,1480],[190,1350],[185,1200],[175,1040],[170,900],[200,770],[260,690],[300,660]].map(([x,y])=>gliderPixel(x,y));
const hamsterRoad=[[680,20],[660,130],[530,210],[380,240],[200,255],[80,330],[45,440],[110,520],[230,555],[380,585]].map(([x,y])=>frontPixel(x,y));
const hedgehogRoad=[[1320,20],[1360,110],[1440,180],[1600,240],[1730,350],[1740,460],[1690,550],[1600,610],[1470,625]].map(([x,y])=>frontPixel(x,y));
const west=expansionPaths.rabbit.slice(0,4),east=expansionPaths.parrot.slice(0,5);
export const finalPaths={...expansionPaths,
 chinchilla:[...west,...chinApproach],glider:[...east,...gliderApproach],
 hamster:[...expansionPaths.rabbit.slice(0,2),...hamsterRoad],hedgehog:[...expansionPaths.parrot.slice(0,7),...hedgehogRoad]
};
// The stream bridge is already drawn in the terrain. These extra edges make it a real shortcut.
export const frontConnection=[hamsterRoad.at(-1)!,...[[600,590],[760,565],[830,545],[900,535],[970,555],[1090,585],[1260,625]].map(([x,y])=>frontPixel(x,y)),hedgehogRoad.at(-1)!];
export const finalSpans=Object.fromEntries(Object.entries(expansionSpans).filter(([id])=>!finalRegions.includes(id)));
const edge=(a:Point,b:Point)=>[`${a.x},${a.y}`,`${b.x},${b.y}`].sort().join('|');
const removed=new Set(finalRegions.flatMap(id=>expansionPaths[id as keyof typeof expansionPaths].slice(1).map((b,i)=>edge(expansionPaths[id as keyof typeof expansionPaths][i],b))));
export const finalWalkways=expansionWalkways.filter(([a,b])=>!removed.has(edge(a,b))||Object.entries(expansionPaths).some(([id,p])=>!finalRegions.includes(id)&&p.slice(1).some((q,i)=>edge(p[i],q)===edge(a,b))));
export const finalFocus:Record<string,{x:number;y:number;width:number;height:number}>={...expansionFocus,chinchilla:{x:960,y:490,width:610,height:560},glider:{x:2070,y:470,width:640,height:650},hamster:{x:1160,y:1460,width:780,height:590},hedgehog:{x:1900,y:1490,width:680,height:630}};
export const finalOffsets={...expansionOffsets,chinchilla:{x:-400,y:160},glider:{x:-110,y:120},hamster:{x:100,y:85},hedgehog:{x:100,y:90}};
export const finalLabelOffsets={...expansionLabelOffsets,chinchilla:{x:-430,y:40},glider:{x:-100,y:75},hamster:{x:70,y:80},hedgehog:{x:100,y:90}};
export const finalVisitorOffsets:Record<string,Point>={owl:{x:-170,y:-170},butterfly:{x:-80,y:160}};

// Only this preview uses a graph, so the new creek loop can be walked in either direction.
// Existing maps keep their original prefix-based route finder and scheduler behavior.
export function findGardenRoute(from:string,to:string,paths:Record<string,Point[]>):Point[]{
 if(from===to)return [];
 const key=(p:Point)=>`${p.x},${p.y}`,root=Object.values(paths)[0][0];
 const start=from==='main'?root:paths[from]?.at(-1),goal=to==='main'?root:paths[to]?.at(-1);
 if(!start||!goal)throw Error('Unknown garden destination');
 const graph=new Map<string,Map<string,number>>(),points=new Map<string,Point>();
 for(const path of [...Object.values(paths),frontConnection])for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],ka=key(a),kb=key(b),d=Math.hypot(a.x-b.x,a.y-b.y);points.set(ka,a);points.set(kb,b);if(!graph.has(ka))graph.set(ka,new Map());if(!graph.has(kb))graph.set(kb,new Map());graph.get(ka)!.set(kb,d);graph.get(kb)!.set(ka,d);}
 const distance=new Map([[key(start),0]]),previous=new Map<string,string>(),pending=new Set(graph.keys());
 while(pending.size){let at:string|undefined,best=Infinity;for(const k of pending){const d=distance.get(k)??Infinity;if(d<best){best=d;at=k;}}if(!at)break;pending.delete(at);if(at===key(goal))break;for(const [next,weight] of graph.get(at)!){const d=best+weight;if(d<(distance.get(next)??Infinity)){distance.set(next,d);previous.set(next,at);}}}
 if(!distance.has(key(goal)))throw Error('Disconnected garden road');
 const route=[goal];let at=key(goal);while(at!==key(start)){const before=previous.get(at);if(!before)throw Error('Incomplete garden route');at=before;route.unshift(points.get(at)!);}return route;
}
