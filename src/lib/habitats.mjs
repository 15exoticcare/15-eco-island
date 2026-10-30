// All coordinates use each unchanged landscape at width 1000; height follows its aspect.
const box=(x0,y0,x1,y1)=>[{x:x0,y:y0},{x:x1,y:y0},{x:x1,y:y1},{x:x0,y:y1}];
const lane=(a,b,pad=22)=>({nodes:[{x:a[0],y:a[1]},{x:b[0],y:b[1]}],polygon:box(Math.min(a[0],b[0])-pad,Math.min(a[1],b[1])-pad,Math.max(a[0],b[0])+pad,Math.max(a[1],b[1])+pad)});
export const habitats={
 parrot:{height:914,kind:'perch',separate:true,note:'A–D 獨立棲息區・分區照護',
  obstacles:[],zones:{
   sun:{...lane([185,470],[225,470],22),label:'A',support:[{x:145,y:470},{x:270,y:470}],floor:560},
   green:{...lane([400,500],[440,500],22),label:'B',support:[{x:360,y:500},{x:485,y:500}],floor:590},
   cockatiel:{...lane([615,470],[655,470],22),label:'C',support:[{x:575,y:470},{x:700,y:470}],floor:560},
   budgie:{...lane([805,500],[835,500],20),label:'D',support:[{x:770,y:500},{x:880,y:500}],floor:590}
  },occluders:[]},
 guinea:{height:833,kind:'ground',separate:false,note:'有地方躲，也有安心探索的日常',
  obstacles:[box(130,130,320,285),box(290,245,400,340),box(420,205,630,285),box(640,265,800,335)],
  zones:{'guinea-1':lane([270,408],[315,422]),'guinea-2':lane([540,375],[570,405]),'guinea-3':lane([430,458],[470,440]),'guinea-4':lane([700,375],[730,390])},
  occluders:[{depth:490,polygon:[[40,490],[300,470],[420,515],[690,500],[980,455],[1000,833],[0,833]]}]},
 hamster:{height:833,kind:'ground',separate:true,note:'A–D 獨立生活區・不任意混養',
  obstacles:[box(165,170,230,245),box(235,265,310,320),box(340,280,410,330),box(400,235,445,280),box(580,275,675,340),box(720,280,795,330)],
  zones:{'hamster-1':{...lane([190,325],[175,305],16),label:'A'},'hamster-2':{...lane([445,330],[445,305],15),label:'B'},'hamster-3':{...lane([555,330],[555,305],14),label:'C'},'hamster-4':{...lane([830,325],[840,300],16),label:'D'}},
  occluders:[{depth:355,polygon:[[70,345],[930,345],[950,425],[60,425]]}]},
 hedgehog:{height:833,kind:'ground',separate:true,note:'安靜夜林・各自保有休息距離',
  obstacles:[box(125,200,325,330),box(490,165,660,290),box(720,230,865,355)],
  zones:{'hedgehog-1':lane([280,408],[330,420]),'hedgehog-2':lane([540,425],[585,440]),'hedgehog-3':lane([680,350],[665,385],20)},
  occluders:[{depth:480,polygon:[[20,490],[300,475],[500,510],[760,490],[980,435],[1000,833],[0,833]]}]},
 ferret:{height:833,kind:'ground',separate:false,note:'沿安全草地探索洞口・不穿越管壁',
  obstacles:[box(150,220,330,330),box(610,235,770,355),box(750,190,900,355)],
  zones:{'ferret-1':lane([320,345],[360,350],22),'ferret-2':lane([650,392],[610,410],20),'ferret-3':lane([460,425],[500,410],20)},
  occluders:[{depth:470,polygon:[[20,440],[300,475],[550,460],[730,465],[980,420],[1000,833],[0,833]]}]},
 meerkat:{height:744,kind:'ground',separate:false,note:'保留觀察高台與隱密退路',
  obstacles:[box(340,150,550,245),box(625,230,735,300)],
  zones:{'meerkat-1':lane([350,320],[375,320],18),'meerkat-2':lane([600,350],[560,350],20),'meerkat-3':lane([800,335],[780,370],18)},
  occluders:[{depth:415,polygon:[[0,405],[275,415],[480,450],[720,440],[1000,370],[1000,744],[0,744]]}]},
 chinchilla:{height:838,kind:'ground',separate:true,note:'乾爽岩台・安靜休息',
  obstacles:[box(340,240,435,315),box(590,225,775,330),box(130,150,300,260)],
  zones:{'chinchilla-1':lane([290,365],[325,370],18),'chinchilla-2':lane([550,360],[525,385],18),'chinchilla-3':lane([780,402],[805,385],18)},
  occluders:[{depth:445,polygon:[[0,400],[220,430],[470,490],[720,445],[1000,410],[1000,838],[0,838]]}]},
 glider:{height:838,kind:'branch',separate:false,note:'沿相鄰枝幹攀爬・保留夜間作息',obstacles:[],
  zones:{
   'glider-1':{...lane([270,294],[260,272],18),support:[{x:250,y:250},{x:300,y:360}]},
   'glider-2':{...lane([735,321],[760,321],18),support:[{x:680,y:321},{x:815,y:321}]},
   'glider-3':{...lane([505,320],[530,320],18),support:[{x:450,y:320},{x:585,y:320}]}
  },occluders:[{depth:460,polygon:[[0,450],[250,430],[400,455],[620,435],[1000,450],[1000,838],[0,838]]}]}
};

export function inside(p,poly){let result=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)result=!result;}return result;}
export function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-a.x-dx*t,p.y-a.y-dy*t);}
export function safeAnimalPoint(island,id,p,radius=6,habitatMap=habitats){
 const habitat=habitatMap[island],zone=habitat?.zones[id];if(!zone||!inside(p,zone.polygon)||p.x<0||p.x>1000||p.y<0||p.y>habitat.height)return false;
 if(habitat.kind!=='ground'&&segmentDistance(p,...zone.support)>2)return false;
 for(let a=0;a<Math.PI*2;a+=Math.PI/4){const q={x:p.x+Math.cos(a)*radius,y:p.y+Math.sin(a)*radius};if(!inside(q,zone.polygon)||habitat.obstacles.some(o=>inside(q,o)))return false;}
 return !habitat.obstacles.some(o=>inside(p,o));
}
export function safeAnimalPath(island,id,a,b,others=[],habitatMap=habitats){const length=Math.hypot(b.x-a.x,b.y-a.y);for(let d=0;d<=length+2;d+=2){const t=Math.min(1,d/(length||1)),p={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};if(!safeAnimalPoint(island,id,p,6,habitatMap)||others.some(o=>Math.hypot(p.x-o.position.x,p.y-o.position.y)<60||o.target&&Math.hypot(p.x-o.target.x,p.y-o.target.y)<60))return false;}return true;}
