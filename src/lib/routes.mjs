export function findRoute(from,to,paths){
 if(from===to)return [];
 const root=Object.values(paths)[0][0],a=from==='main'?[root]:paths[from],b=to==='main'?[root]:paths[to];
 if(!a||!b)throw new Error('Unknown patrol destination');
 let common=0;while(common<Math.min(a.length,b.length)&&a[common].x===b[common].x&&a[common].y===b[common].y)common++;
 return [...a.slice(Math.max(0,common-1)).reverse(),...b.slice(common)];
}
export function stepAlong(points,distance){
 for(let i=0;i<points.length-1;i++){
  const a=points[i],b=points[i+1],length=Math.hypot(b.x-a.x,b.y-a.y);
  if(distance<=length)return {x:a.x+(b.x-a.x)*distance/length,y:a.y+(b.y-a.y)*distance/length,done:false};
  distance-=length;
 }
 return {...points[points.length-1],done:true};
}
