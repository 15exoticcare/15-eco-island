import {upperResidents} from './upper-residents.ts';
import {newResidents} from './new-residents.ts';
export type Joint={cx:number;cy:number;rx:number;ry:number;originX:number;originY:number;motion:'ear'|'nibble'|'wash'|'preen'|'look'|'crest'|'breath'|'nose'};
export type Creature={id:string;name:string;island:'rabbit'|'parrot'|'guinea'|'hamster'|'hedgehog'|'ferret'|'meerkat'|'chinchilla'|'glider';asset:string;x:number;y:number;width:number;height:number;period:number;delay:number;action:string;joints:Joint[]};
// Coordinates are percentages of each independently authored and normalized asset.
export const creatures:Creature[]=[
 {id:'white',name:'白色立耳兔',island:'rabbit',asset:'rabbit',x:24,y:47,width:52,height:62,period:13.7,delay:-2.3,action:'安坐 · 偶爾動耳',joints:[{cx:34,cy:13,rx:9,ry:15,originX:38,originY:29,motion:'ear'}]},
 {id:'lop',name:'棕白色垂耳兔',island:'rabbit',asset:'rabbit-lop',x:48,y:43,width:65,height:55,period:11.3,delay:-6.1,action:'低頭吃牧草',joints:[{cx:28,cy:57,rx:24,ry:23,originX:48,originY:58,motion:'nibble'}]},
 {id:'grey',name:'灰色兔子',island:'rabbit',asset:'rabbit-grey',x:39,y:54,width:50,height:62,period:17.9,delay:-10.2,action:'坐著整理臉部',joints:[{cx:61,cy:40,rx:12,ry:11,originX:57,originY:52,motion:'wash'}]},
 {id:'cream',name:'奶茶色兔子',island:'rabbit',asset:'rabbit-cream',x:65,y:49,width:66,height:44,period:19.1,delay:-3.8,action:'趴著休息',joints:[{cx:43,cy:59,rx:25,ry:20,originX:45,originY:82,motion:'breath'}]},
 {id:'sun',name:'小太陽鸚鵡',island:'parrot',asset:'parrot-sun',x:22,y:58,width:44,height:80,period:16.7,delay:-7.2,action:'獨立棲區 A · 理毛',joints:[{cx:53,cy:14,rx:23,ry:16,originX:48,originY:28,motion:'preen'}]},
 {id:'green',name:'綠頰錐尾鸚鵡',island:'parrot',asset:'parrot',x:46,y:65,width:42,height:78,period:14.3,delay:-1.4,action:'獨立棲區 B · 自然轉頭',joints:[{cx:39,cy:16,rx:25,ry:17,originX:46,originY:29,motion:'look'}]},
 {id:'cockatiel',name:'玄鳳鸚鵡',island:'parrot',asset:'parrot-cockatiel',x:69,y:58,width:45,height:83,period:21.1,delay:-11.8,action:'獨立棲區 C · 頭冠微動',joints:[{cx:43,cy:9,rx:9,ry:10,originX:40,originY:18,motion:'crest'}]},
 {id:'budgie',name:'虎皮鸚鵡',island:'parrot',asset:'parrot-budgie',x:77,y:67,width:36,height:63,period:23.3,delay:-16.6,action:'獨立棲區 D · 安靜休息',joints:[{cx:45,cy:34,rx:13,ry:15,originX:44,originY:52,motion:'breath'}]}
,...newResidents,...upperResidents
];



