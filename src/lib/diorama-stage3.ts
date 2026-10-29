import {dioramaPaths,dioramaSpans,dioramaFocus} from './diorama.ts';
import type {Point} from './islands.ts';
export const expansionRegions=['guinea','ferret','meerkat'];
export const expansionGround={left:{x:0,y:100,width:680,height:1509*680/1042},ferret:{x:2240,y:600,width:640,height:1265*640/1244}};
export const leftPixel=(x:number,y:number):Point=>({x:x*680/1042,y:100+y*680/1042});
export const ferretPixel=(x:number,y:number):Point=>({x:2240+x*640/1244,y:600+y*640/1244});
const west=dioramaPaths.guinea.slice(0,dioramaPaths.guinea.findIndex(p=>p.x===665&&p.y===910)+1);
const east=dioramaPaths.ferret.slice(0,dioramaPaths.ferret.findIndex(p=>p.x===2340&&p.y===1000)+1);
const landing=leftPixel(850,1100),leftShared=[...west,landing];
const guinea=[...leftShared,...[[820,1150],[750,1190],[600,1220],[400,1240],[400,1218]].map(([x,y])=>leftPixel(x,y))];
const meerkat=[...leftShared,...[[850,1000],[810,920],[780,860],[750,800],[760,770],[790,740],[850,712],[900,680],[915,640],[875,600],[820,575],[775,535],[765,490],[750,460]].map(([x,y])=>leftPixel(x,y))];
const ferret=[...east,...[[350,730],[470,790],[600,830],[650,855]].map(([x,y])=>ferretPixel(x,y))];
const chinTail=dioramaPaths.chinchilla.slice(dioramaPaths.chinchilla.findIndex(p=>p.x===720&&p.y===400)+1);
export const expansionPaths={...dioramaPaths,guinea,meerkat,ferret,chinchilla:[...meerkat,...[[850,370],[870,300],[900,280],[1000,295]].map(([x,y])=>leftPixel(x,y)),{x:720,y:400},...chinTail]};
export const expansionSpans={...Object.fromEntries(Object.entries(dioramaSpans).filter(([id])=>!expansionRegions.includes(id))),westGarden:[west.at(-1)!,landing],chinchilla:[leftPixel(1000,295),{x:1210,y:310}]};
// The last chinchilla bridge starts at the visible terrain exit, sharing the same route nodes.
expansionPaths.chinchilla=expansionPaths.chinchilla.filter(p=>p.x!==720||p.y!==400);
const edge=(a:Point,b:Point)=>[`${a.x},${a.y}`,`${b.x},${b.y}`].sort().join('|');
const native=new Set([dioramaPaths.rabbit,dioramaPaths.parrot,guinea.slice(west.length),meerkat.slice(west.length),ferret.slice(east.length),expansionPaths.chinchilla.slice(meerkat.length-1,-chinTail.length)].flatMap(p=>p.slice(1).map((b,i)=>edge(p[i],b))));
const water=new Set(Object.values(expansionSpans).map(([a,b])=>edge(a,b))),seen=new Set<string>();
export const expansionWalkways=Object.values(expansionPaths).flatMap(path=>path.slice(1).flatMap((b,i)=>{const a=path[i],k=edge(a,b);if(native.has(k)||water.has(k)||seen.has(k))return [];seen.add(k);return [[a,b]];}));
export const expansionFocus:typeof dioramaFocus={...dioramaFocus,guinea:{x:270,y:810,width:640,height:510},meerkat:{x:330,y:320,width:650,height:560},ferret:{x:2580,y:935,width:680,height:600}};
export const expansionOffsets:Record<string,Point>={guinea:{x:-150,y:-135},meerkat:{x:-210,y:-30},ferret:{x:0,y:0}};

export const expansionLabelOffsets={...expansionOffsets,meerkat:{x:-210,y:-160}};
