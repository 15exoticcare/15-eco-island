import{eggAnimals,eggIslands}from'./exploration-stage5.mjs';
export function createEggLife({seed=1505,onUpdate=()=>{}}={}){
 let value=seed>>>0,paused=false,reduced=false,disposed=false;
 const random=()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296};
 const actors=eggAnimals.map((p,n)=>({id:p.id,species:p.species,position:{x:p.x,y:p.y},from:null,target:null,state:'rest',elapsed:0,duration:2500+n*1170,round:0,facing:'left',pending:false}));
 function frame(r){if(r.state==='move'){const p=eggAnimals.find(p=>p.id===r.id);return 8+Math.min(7,Math.floor(r.elapsed%p.period/p.period*8))}if(r.state==='prepare')return 4+Math.min(3,Math.floor(r.elapsed/r.duration*4));if(r.state==='settle')return 7-Math.min(3,Math.floor(r.elapsed/r.duration*4));if(r.state==='rest')return 0;const seq=r.state==='care'?[0,2,3,2,0]:[0,1,3,1,0];return seq[Math.min(4,Math.floor(r.elapsed/r.duration*5))]}
 const snapshot=()=>actors.map(r=>({...r,position:{...r.position},frame:frame(r)})),emit=()=>onUpdate(snapshot());
 const enter=(r,state,duration)=>{r.state=state;r.elapsed=0;r.duration=duration};
 const rest=(r,p)=>enter(r,'rest',p.wait*(.8+random()*.5));
 return{snapshot,
 tick(dt){if(paused||reduced||disposed)return;for(const r of actors){const p=eggAnimals.find(p=>p.id===r.id),island=eggIslands.find(p=>p.id===r.species);r.elapsed=Math.min(r.duration,r.elapsed+Math.max(0,dt));if(r.state==='move'){const cycles=r.duration/p.period,cycle=Math.min(cycles-1,Math.floor(r.elapsed/p.period)),phase=Math.min(1,(r.elapsed-cycle*p.period)/p.period),stride=Math.max(0,Math.min(1,(phase-.125)/.75)),t=(cycle+stride)/cycles;r.position={x:r.from.x+(r.target.x-r.from.x)*t,y:r.from.y+(r.target.y-r.from.y)*t}}if(r.elapsed<r.duration)continue;
 if(r.state==='prepare'){const distance=Math.hypot((r.target.x-r.from.x)*island.width,(r.target.y-r.from.y)*island.height),step=p.species==='sulcata'?2.5:4;enter(r,'move',Math.max(2,Math.ceil(distance/step))*p.period)}
 else if(r.state==='move'){r.position={...r.target};r.from=null;r.target=null;enter(r,'settle',900)}
 else if(r.state==='settle'&&r.pending){r.pending=false;enter(r,'observe',4200)}
 else if(r.state==='rest'){r.round++;if(p.move&&r.round%2===0){const home=Math.abs(r.position.x-p.x)<.001&&Math.abs(r.position.y-p.y)<.001,to=home?{x:p.to[0],y:p.to[1]}:{x:p.x,y:p.y};r.from={...r.position};r.target=to;r.facing=to.x>r.position.x?'right':'left';enter(r,'prepare',900)}else enter(r,r.round%2?'observe':'care',4200+random()*1600)}
 else rest(r,p);
 }emit()},
 react(id){const r=actors.find(r=>r.id===id);if(!r||disposed)return false;if(paused||reduced)return true;if(r.state==='move'||r.state==='prepare'){r.from=null;r.target=null;r.pending=true;enter(r,'settle',900)}else enter(r,'observe',4200);emit();return true},
 setPaused(v){paused=v},setReduced(v){reduced=v},dispose(){disposed=true}
 };
}
