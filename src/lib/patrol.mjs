import {findRoute} from './routes.mjs';
import {pathLength,roundRoute} from './landscape.mjs';
import {gaitFrame,sampleRoute} from './animation.mjs';

// Visit nearby branches using actual authored roads, rather than straight-line proximity.
export function buildPatrolOrder(paths,route=findRoute){
 const remaining=new Set(Object.keys(paths)),order=[];
 let from='main';
 while(remaining.size){
  let next,best=Infinity;
  for(const id of remaining){const length=pathLength(route(from,id,paths));if(length<best){best=length;next=id;}}
  order.push(next);remaining.delete(next);from=next;
 }
 return [...order,'main'];
}

export function createPatrol(paths,onUpdate,route=findRoute){
 const order=buildPatrolOrder(paths,route),home=Object.values(paths)[0][0];
 let state={location:'main',target:null,phase:'wait',position:{...home},distance:0,direction:'front',automatic:true,paused:false,pending:null};
 let index=0,remaining=0,path=[],total=0;
 const snapshot=()=>({...state,position:{...state.position},nextStop:state.pending??(state.phase==='walk'?state.target:order[index])});
 const emit=()=>onUpdate(snapshot());
 function depart(id,automatic){
  path=roundRoute(route(state.location,id,paths));total=pathLength(path);
  state={...state,target:id,phase:'walk',distance:0,automatic};emit();
 }
 function dispatchManual(){
  if(state.paused||state.pending===null)return;
  const id=state.pending;state.pending=null;
  if(id===state.location){state.automatic=false;remaining=6000;emit();}
  else depart(id,false);
 }
 return {
  order,
  snapshot,
  tick(dt){
   if(state.paused)return;
   if(state.phase==='wait'){
    if(state.pending!==null){dispatchManual();return;}
    remaining=Math.max(0,remaining-dt);
    if(remaining===0)depart(order[index],true);
    return;
   }
   const ease=Math.min(1,.35+state.distance/48,.35+(total-state.distance)/48);
   state.distance+=dt*.047*ease;
   const point=sampleRoute(path,state.distance);
   state.position={x:point.x,y:point.y};
   if(gaitFrame(state.distance)%4===0||point.done)state.direction=point.direction;
   if(point.done){
    state.location=state.target;state.target=null;state.phase='wait';remaining=6000;
    // A manual detour does not consume an automatic stop, unless it just visited that stop.
    if(state.automatic||state.location===order[index])index=(index+1)%order.length;
    // Island destinations are the existing safe junctions. Never reroute across open space.
    // An in-flight request is consumed only here; a later request replaces it.
    if(state.pending!==null){dispatchManual();return;}
   }
   emit();
  },
  requestManual(id){
   if(id!=='main'&&!Object.hasOwn(paths,id))return false;
   state.pending=id;
   if(state.phase==='wait'&&!state.paused)dispatchManual();else emit();
   return true;
  },
  setPaused(paused){
   if(state.paused===paused)return;
   state.paused=paused;emit();
  }
 };
}

// Exactly one frame loop. Visibility changes clear both the pending frame and time baseline.
// The same visible elapsed time drives travel and dwell; background time is never consumed.
export function createPatrolLoop(patrol,{requestFrame,cancelFrame}){
 let handle=null,last=null,visible=false,disposed=false;
 function frame(time){
  handle=null;if(!visible||disposed)return;
  const dt=last===null?0:Math.min(50,Math.max(0,time-last));last=time;
  patrol.tick(dt);
  handle=requestFrame(frame);
 }
 return {
  setVisible(value){
   if(disposed||value===visible)return;
   visible=value;last=null;
   if(handle!==null){cancelFrame(handle);handle=null;}
   if(visible)handle=requestFrame(frame);
  },
  dispose(){disposed=true;visible=false;last=null;if(handle!==null)cancelFrame(handle);handle=null;}
 };
}

export function describePatrol(state,names){
 const name=id=>names[id]??id;
 return {
  status:state.paused?'暫停中':state.pending!==null||!state.automatic?'指定巡視中':state.phase==='wait'&&state.location==='main'?'主島休息中':'自動巡視中',
  location:state.phase==='walk'?`前往${name(state.target)}途中`:name(state.location),
  next:name(state.nextStop),
  detail:state.pending!==null?(state.paused?'指定目的地已保留，繼續後處理':'已保留最新指定，抵達下一座島後切換'):state.paused?'保留目前位置與進度':state.phase==='wait'?(state.location==='main'?'休息 6 秒後繼續巡島':'觀察紀錄 · 停留 6 秒'):(state.automatic?'沿既有橋樑與步道巡視':'指定巡視後接續自動行程')
 };
}
