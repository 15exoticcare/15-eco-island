// Gait advances in world distance, not wall-clock time: pausing travel pauses feet.
export const STRIDE = 52;
export function gaitFrame(distance, count=8){return Math.floor(Math.max(0,distance)/STRIDE*count)%count;}
export function directionFor(dx,dy){
 if(Math.abs(dy)>Math.abs(dx)*.55)return dy<0?'back':'front';
 return dx<0?'left':'right';
}
export function sampleRoute(points,distance){
 let remaining=Math.max(0,distance);
 for(let i=0;i<points.length-1;i++){
  const a=points[i],b=points[i+1],length=Math.hypot(b.x-a.x,b.y-a.y);
  if(length===0)continue;
  if(remaining<length)return {x:a.x+(b.x-a.x)*remaining/length,y:a.y+(b.y-a.y)*remaining/length,direction:directionFor(b.x-a.x,b.y-a.y),done:false};
  remaining-=length;
 }
 return {...points.at(-1),direction:'front',done:true};
}
