// Shared by rabbits and the other habitats. One loop per population, visible-time only.
export function createLifeLoop(life,{requestFrame,cancelFrame}){
 let handle=null,last=null,accumulator=0,visible=false,disposed=false;
 function frame(time){handle=null;if(!visible||disposed)return;
  if(last!==null)accumulator+=Math.min(100,Math.max(0,time-last));last=time;
  if(accumulator>=80){life.tick(accumulator);accumulator=0;}
  handle=requestFrame(frame);
 }
 return {
  setVisible(value){if(disposed||value===visible)return;visible=value;last=null;accumulator=0;if(handle!==null)cancelFrame(handle);handle=null;if(visible)handle=requestFrame(frame);},
  dispose(){if(disposed)return;disposed=true;visible=false;if(handle!==null)cancelFrame(handle);handle=null;life.dispose();}
 };
}
