import {finalPaths} from '../diorama-stage4.ts';
import {defenseWorld} from './world.ts';
export type MapPoint={x:number;y:number};
export type BuildSite=MapPoint&{id:string;scale?:number};
export type DefenseLayout={edition:8|9;world:typeof defenseWorld;trail:MapPoint[];pads:BuildSite[];terrain:{x:number;y:number;width:number;height:number;file:string}[];gate?:MapPoint&{width:number;height:number;file:string};bridges?:{x:number;y:number;width:number;height:number;file:string}[];nativeRoadStart?:number;warningDistance:number;overview:{x:number;y:number;width:number;height:number};zones:{label:string;x:number;y:number;width:number;height:number}[]};
// Frozen geometry of the saved 3649531 prototype. Edition 8 remains playable.
export const chapter8Layout:DefenseLayout={edition:8,world:defenseWorld,
 trail:[{x:-650,y:2510},{x:-270,y:2550},{x:70,y:2440},{x:480,y:2440},{x:800,y:2630},{x:1200,y:2630},{x:1540,y:2430},{x:1940,y:2430},{x:2280,y:2660},{x:2670,y:2780},{x:2930,y:2780}],
 pads:[{id:'a',x:-170,y:2370},{id:'b',x:270,y:2650},{id:'c',x:690,y:2360},{id:'d',x:1010,y:2810},{id:'e',x:1470,y:2660},{id:'f',x:1870,y:2650},{id:'g',x:2300,y:2530},{id:'h',x:3150,y:2710}],
 terrain:[[-1000,1560,4800,1900],[-1120,240,680,470],[-1120,740,680,470],[3210,360,720,490],[3210,930,720,490],[-650,-620,1900,530],[1220,-620,1900,530]].map(([x,y,width,height])=>({x,y,width,height,file:'/assets/defense-v1/meadow.webp'})),
 warningDistance:0,overview:{x:1150,y:2530,width:4500,height:1250},zones:[{label:'入口花徑',x:-80,y:2530,width:1600,height:1200},{label:'中央花徑',x:1300,y:2530,width:1700,height:1200},{label:'莊園防線',x:2600,y:2780,width:1600,height:1200}]
};
// The last approach is the existing public garden walk, outside the hedgehog fence.
// Reuse its actual artwork/caretaker coordinates instead of drawing over the creek.
const gardenApproach=finalPaths.hedgehog.slice(0,-1).reverse();
const approach=[{x:2860,y:2680},{x:2750,y:2570},{x:2670,y:2490},{x:2740,y:2320},{x:2720,y:2190},{x:2600,y:2060},{x:2450,y:1940},{x:2320,y:1820},{x:2220,y:1700}];
export const manorGate={...gardenApproach.at(-1)!,width:120,height:100,file:'/assets/defense-v2/gate.webp'};
export const chapter9Layout:DefenseLayout={edition:9,
 world:{width:5100,height:3600,center:{x:1400,y:1615},bounds:{width:5000,height:3750}},
 trail:[...chapter8Layout.trail,...approach,...gardenApproach],
 nativeRoadStart:chapter8Layout.trail.length+approach.length,
 pads:[...chapter8Layout.pads,{id:'i',x:2820,y:2440,scale:.75},{id:'j',x:2605,y:2310,scale:.65},{id:'k',x:2580,y:1900,scale:.65},{id:'l',x:2200,y:1810,scale:.45}],
 terrain:[{x:1960,y:1570,width:1100,height:1300,file:'/assets/defense-v2/connector-wide.webp'},chapter8Layout.terrain[0]],gate:manorGate,
 // One short stone bridge lands on the public garden path and the new hillside.
 // Its native aspect ratio is preserved; the original creek bridge is untouched.
 bridges:[{x:2005,y:1466,width:300,height:290.25,file:'/assets/defense-v2/bridge-diagonal.webp'}],warningDistance:650,
 overview:{x:1420,y:1570,width:4700,height:3300},zones:[{label:'外圍入口',x:-80,y:2530,width:1900,height:1400},{label:'連接花徑',x:2470,y:2070,width:1800,height:1500},{label:'旅宿入口',x:1770,y:1270,width:1600,height:1250}]
};
export const getDefenseLayout=(edition:8|9)=>edition===9?chapter9Layout:chapter8Layout;
