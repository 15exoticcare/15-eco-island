import type {MapPoint,DefenseLayout} from './layouts.ts';
// Shared by simulation, renderer, route preview and acceptance tests.
export function createRoute(points:MapPoint[]){const segments=points.slice(1).map((p,i)=>Math.hypot(p.x-points[i].x,p.y-points[i].y)),length=segments.reduce((a,b)=>a+b,0);
 const point=(distance:number):MapPoint=>{let left=Math.max(0,distance);for(let i=0;i<segments.length;i++){if(left<=segments[i]){const t=left/segments[i];return{x:points[i].x+(points[i+1].x-points[i].x)*t,y:points[i].y+(points[i+1].y-points[i].y)*t}}left-=segments[i]}return {...points.at(-1)!}};
 return{points,segments,length,point};
}

// Rendering footprint only; combat ranges and the shared walking coordinates stay unchanged.
export function routeActorScale(layout:DefenseLayout,distance:number,route=createRoute(layout.trail)){
 if(layout.nativeRoadStart===undefined)return 1;
 const landing=route.segments.slice(0,layout.nativeRoadStart).reduce((a,b)=>a+b,0);
 return 1-.55*Math.max(0,Math.min(1,(distance-(landing-350))/350));
}
