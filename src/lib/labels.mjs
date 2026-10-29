export function overlaps(a,b,gap=0){return a.x<b.x+b.width+gap&&a.x+a.width+gap>b.x&&a.y<b.y+b.height+gap&&a.y+a.height+gap>b.y;}
export function segmentHitsRect(a,b,rect,padding=0){
 const r={x:rect.x-padding,y:rect.y-padding,width:rect.width+padding*2,height:rect.height+padding*2},dx=b.x-a.x,dy=b.y-a.y;
 let low=0,high=1;const p=[-dx,dx,-dy,dy],q=[a.x-r.x,r.x+r.width-a.x,a.y-r.y,r.y+r.height-a.y];
 for(let i=0;i<4;i++){if(!p[i]){if(q[i]<0)return false;}else{const t=q[i]/p[i];if(p[i]<0)low=Math.max(low,t);else high=Math.min(high,t);if(low>high)return false;}}return true;
}
// Screen-space rectangles keep type readable regardless of world zoom.
// Search near each island first, then use free space; never stack labels.
export function placeLabels(items,viewport,protectedRects=[],roads=[]){
 const placed=[],margin=8,height=36;
 for(const item of items){const width=item.width,desired={x:item.x-width/2,y:item.y};
  const candidates=[];for(let radius=0;radius<=180;radius+=12){for(const [dx,dy] of radius===0?[[0,0]]:[[0,radius],[radius,radius],[-radius,radius],[radius,0],[-radius,0],[0,-radius]])candidates.push({x:desired.x+dx,y:desired.y+dy});}
  for(let y=viewport.height-height-margin;y>=margin;y-=height+8)for(let x=margin;x<=viewport.width-width-margin;x+=width+10)candidates.push({x,y});
  const valid=(r,avoidRoads)=>!protectedRects.some(p=>overlaps(r,p,4))&&!placed.some(p=>overlaps(r,p,7))&&(!avoidRoads||!roads.some(s=>segmentHitsRect(s.a,s.b,r,s.padding)));
  let chosen;for(const avoidRoads of [true,false]){for(const c of candidates){const r={x:Math.max(margin,Math.min(viewport.width-width-margin,c.x)),y:Math.max(margin,Math.min(viewport.height-height-margin,c.y)),width,height};if(valid(r,avoidRoads)){chosen=r;break;}}if(chosen)break;}
  if(!chosen)throw new Error('Not enough label space; use the compact directory layout');
  placed.push({...item,...chosen,anchorX:item.x,anchorY:item.y});
 }return placed;
}
