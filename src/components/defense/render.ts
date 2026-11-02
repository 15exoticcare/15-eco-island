import {towerTypes,type State} from '@/lib/defense/game';
import {chapter8Layout,type DefenseLayout,type MapPoint}from'@/lib/defense/layouts';
import {createRoute,routeActorScale}from'@/lib/defense/route';
const routes=new WeakMap<DefenseLayout,ReturnType<typeof createRoute>>();
const oldLength=createRoute(chapter8Layout.trail).length;
export type Art=Record<string,HTMLImageElement>;
function line(c:CanvasRenderingContext2D,trail:MapPoint[]){c.beginPath();trail.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y))}
function dot(c:CanvasRenderingContext2D,x:number,y:number,r:number,color:string){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}
function star(c:CanvasRenderingContext2D,x:number,y:number,r:number){c.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,d=i%2?r*.45:r;c.lineTo(x+Math.cos(a)*d,y+Math.sin(a)*d)}c.closePath()}
export function paintBattle(c:CanvasRenderingContext2D,s:State,art:Art,selected:string|null,reduced:boolean,layout:DefenseLayout=chapter8Layout,showRoute=false){
 const {trail,pads}=layout;let route=routes.get(layout);if(!route){route=createRoute(trail);routes.set(layout,route)}const {length:trailLength,point:trailPoint}=route;
 const nativeDistance=layout.nativeRoadStart===undefined?Infinity:route.segments.slice(0,layout.nativeRoadStart).reduce((a,b)=>a+b,0);
 const spriteScale=(distance:number)=>routeActorScale(layout,distance,route);

 const original=layout.edition===9?chapter8Layout.trail:trail;
 c.lineCap='round';c.lineJoin='round';line(c,original);c.strokeStyle='#76845a';c.lineWidth=115;c.stroke();line(c,original);c.strokeStyle='#c5ad82';c.lineWidth=99;c.stroke();line(c,original);c.strokeStyle='#e9d8b2';c.lineWidth=83;c.stroke();
 if(layout.edition===9){const branch=trail.slice(chapter8Layout.trail.length-1,layout.nativeRoadStart===undefined?undefined:layout.nativeRoadStart);line(c,branch);c.strokeStyle='#89916d';c.lineWidth=94;c.stroke();line(c,branch);c.strokeStyle='#b8b092';c.lineWidth=82;c.stroke();line(c,branch);c.strokeStyle='#dcd2b7';c.lineWidth=70;c.stroke()}

 // Individual laid stones, rather than a smooth geometric ribbon.
 for(let d=24;d<Math.min(trailLength,nativeDistance);d+=48){const p=trailPoint(d),q=trailPoint(d+2),a=Math.atan2(q.y-p.y,q.x-p.x);c.save();c.translate(p.x,p.y);c.rotate(a);if(layout.edition===9&&d>oldLength){const n=Math.floor(d/48);c.fillStyle=['#d8ccb1','#e8dfc8','#d7c9ac'][n%3];c.strokeStyle='#a99c80';c.lineWidth=1;c.beginPath();c.moveTo(-19,-25);c.lineTo(8,-29);c.lineTo(20,-17);c.lineTo(17,25);c.lineTo(-10,29);c.lineTo(-22,11);c.closePath();c.fill();c.stroke();c.strokeStyle='#f4edda';c.beginPath();c.moveTo(-15,-23);c.lineTo(7,-26);c.lineTo(17,-15);c.stroke();c.restore();continue}c.fillStyle=d%96<48?'#dfcda7':'#e5d5b5';c.strokeStyle='#b8a17d';c.lineWidth=1.4;c.beginPath();c.roundRect(-18,-30,36,60,9);c.fill();c.stroke();c.restore();}
 for(let i=0;i<62;i++){const p=trailPoint((i+.4)*Math.min(trailLength,nativeDistance)/62),side=i%2?1:-1;dot(c,p.x+Math.sin(i)*12,p.y+side*66,4,i%3?'#a8b383':'#c3a3a0');}
 for(const [i,bridge]of(layout.bridges??[]).entries()){const img=art['bridge'+i];if(img)c.drawImage(img,bridge.x,bridge.y,bridge.width,bridge.height)}
 const last=trail.at(-1)!;if(!layout.gate){c.lineWidth=8;c.strokeStyle='#9c7d58';for(const offset of[-20,17]){c.beginPath();c.moveTo(last.x+20,last.y-91+offset);c.lineTo(last.x+20,last.y+70+offset);c.stroke()}for(let y=-90;y<=90;y+=45){c.fillStyle='#b29870';c.beginPath();c.roundRect(last.x+11,last.y+y-25,18,55,6);c.fill();}
 }
 if(layout.gate){const g=layout.gate;const img=art.gate;if(img)c.drawImage(img,g.x-g.width/2,g.y-g.height+15,g.width,g.height);c.strokeStyle='#86b3b6';c.lineWidth=4;c.beginPath();c.ellipse(g.x,g.y+2,90,25,0,0,Math.PI*2);c.stroke()}
 if(showRoute){for(let d=120;d<trailLength-100;d+=210){const p=trailPoint(d),q=trailPoint(d+8),a=Math.atan2(q.y-p.y,q.x-p.x);c.save();c.translate(p.x,p.y);c.rotate(a);c.strokeStyle='#668f88';c.scale(spriteScale(d),spriteScale(d));c.lineWidth=5;c.beginPath();c.moveTo(-12,-10);c.lineTo(0,0);c.lineTo(-12,10);c.stroke();c.restore()}}
 if(selected){const p=pads.find(p=>p.id===selected)!,t=s.towers.find(t=>t.pad===selected),spec=t?towerTypes[t.kind]:towerTypes.seed,range=spec.range*(1+.12*((t?.level??1)-1));c.fillStyle='#78987417';c.strokeStyle='#6b8b6b';c.lineWidth=3;c.setLineDash([12,12]);c.beginPath();c.arc(p.x,p.y,range,0,Math.PI*2);c.fill();c.stroke();c.setLineDash([])}
 for(const p of pads){c.fillStyle='#e0d2b0';c.strokeStyle='#a5ad82';c.lineWidth=4;c.beginPath();c.ellipse(p.x,p.y,70*(p.scale??1),34*(p.scale??1),0,0,Math.PI*2);c.fill();c.stroke();if(!s.towers.some(t=>t.pad===p.id)){c.fillStyle='#65765a';c.font='500 36px sans-serif';c.textAlign='center';c.fillText(p.id.toUpperCase()+' +',p.x,p.y+12)}}
 const entities=[...s.towers.map(t=>({y:pads.find(p=>p.id===t.pad)!.y,t,e:null})),...s.enemies.map(e=>({y:trailPoint(e.distance).y,t:null,e}))].sort((a,b)=>a.y-b.y);
 for(const item of entities){if(item.t){const t=item.t,p=pads.find(p=>p.id===t.pad)!,img=art['tower-'+t.kind];const z=p.scale??1;if(img)c.drawImage(img,p.x-90*z,p.y-207*z,180*z,223*z);dot(c,p.x+43*z,p.y-151*z,14,'#faf5df');c.fillStyle='#697655';c.font='bold 19px sans-serif';c.textAlign='center';c.fillText(String(t.level),p.x+43*z,p.y-151*z+7)}else if(item.e){const e=item.e,p=trailPoint(e.distance),z=spriteScale(e.distance),bounce=reduced?0:Math.sin(s.time*8+e.id)*.055,img=art['slime-'+e.kind];
 // A continuous scale transition matches the smaller existing garden paths.
 // Simulation coordinates, ranges, health and animation clocks are unchanged.
 c.save();c.translate(p.x,p.y);c.scale(z,z);c.fillStyle='#526a4124';c.beginPath();c.ellipse(0,4,36,12,0,0,Math.PI*2);c.fill();if(img){c.save();c.scale(1+bounce,1-bounce);c.drawImage(img,-57,-87,114,96);c.restore()}if(e.hitUntil>s.time){c.strokeStyle='#fff4c4';c.lineWidth=4;c.beginPath();c.ellipse(0,-26,51,38,0,0,Math.PI*2);c.stroke()}c.fillStyle='#62734d';c.beginPath();c.roundRect(-29,-103,58,7,4);c.fill();c.fillStyle=e.slowUntil>s.time?'#a9d3de':'#b1cb82';c.beginPath();c.roundRect(-28,-102,56*Math.max(0,e.hp/e.maxHp),5,3);c.fill();c.restore();}}

 for(const shot of s.shots){if(shot.kind==='star'){c.fillStyle='#f4d690';star(c,shot.x,shot.y,12);c.fill()}else if(shot.kind==='bubble'){c.strokeStyle='#b1d8e2';c.fillStyle='#d8f1ef99';c.lineWidth=3;c.beginPath();c.arc(shot.x,shot.y,13,0,Math.PI*2);c.fill();c.stroke()}else{c.fillStyle='#94744c';c.beginPath();c.ellipse(shot.x,shot.y,10,6,-.5,0,Math.PI*2);c.fill()}}
 for(const e of s.effects){const age=(s.time-e.born)/.7;c.save();c.globalAlpha=Math.max(0,1-age);if(e.kind==='impact'||e.kind==='escape'){c.strokeStyle=e.color;c.lineWidth=4;c.beginPath();c.arc(e.x,e.y,20+age*(e.kind==='impact'?150:60),0,Math.PI*2);c.stroke()}else for(let i=0;i<7;i++){const a=i*Math.PI*2/7;dot(c,e.x+Math.cos(a)*age*65,e.y-35+Math.sin(a)*age*45,8*(1-age),e.color)}c.restore()}
}
