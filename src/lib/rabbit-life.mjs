import {planKeeperReactions} from './keeper-reactions.mjs';
// Coordinates are in the original rabbit landscape's 1200 × 1000 image plane.
// Only these inspected grass lanes are navigable; there is no connection to the keeper's graph.
export const rabbitGround={width:1200,height:1000,
 polygon:[{x:285,y:405},{x:400,y:345},{x:630,y:345},{x:695,y:405},{x:850,y:440},{x:850,y:490},{x:660,y:540},{x:405,y:540},{x:300,y:495}],
 obstacles:[
  [{x:410,y:195},{x:630,y:195},{x:630,y:330},{x:410,y:330}], // hay rack
  [{x:650,y:215},{x:1020,y:215},{x:1020,y:425},{x:740,y:425},{x:650,y:380}], // hide and stump
  [{x:145,y:460},{x:300,y:460},{x:365,y:565},{x:180,y:620}] // foreground rock
 ],
 lanes:{white:[{x:345,y:440},{x:435,y:405}],lop:[{x:575,y:395},{x:555,y:370}],grey:[{x:470,y:495},{x:550,y:485}],cream:[{x:760,y:465},{x:685,y:490}]}
};
export const rabbitProfiles=[
 {id:'white',name:'白色立耳兔',personality:'活潑、好奇',feature:'雪白短毛、直立長耳，喜歡留意草地上的小動靜。',fact:'兔子日常主食是大量牧草，也要隨時備妥乾淨飲水。',rest:[18000,38000],weights:{listen:4,observe:3,move:3},initial:'listen',duration:7200,size:190},
 {id:'lop',name:'棕白色垂耳兔',personality:'喜歡吃草',feature:'棕白花斑與垂下的長耳，步調慢慢，常停在牧草旁。',fact:'留意日常食慾與排便的變化，是兔子照護的重要一環。',rest:[24000,46000],weights:{graze:6,observe:1,move:2},initial:'graze',duration:14800,size:195},
 {id:'grey',name:'灰色兔子',personality:'安靜、愛整潔',feature:'柔和灰毛與淡色口鼻，喜歡安坐、慢慢整理前腳與臉。',fact:'兔子常會隱藏不舒服的症狀，需要每天細心觀察。',rest:[32000,58000],weights:{groom:6,observe:2,move:1},initial:'groom',duration:11700,size:180},
 {id:'cream',name:'奶茶色兔子',personality:'悠閒、愛休息',feature:'奶茶色被毛、淡色腹部，休息時耳朵會放鬆向後。',fact:'安靜、安全且能躲藏的環境，有助於降低兔子的緊迫。',rest:[42000,74000],weights:{observe:1,move:2,rest:7},initial:'rest',duration:38900,size:200}
];
export const rabbitActions={rest:'安心休息',listen:'動耳聆聽',observe:'抬頭觀察',rise:'慢慢起身',move:'短步探索',graze:'低頭吃牧草',groom:'整理前腳與臉',settle:'放鬆趴下'};
export function insidePolygon(p,polygon){let yes=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
 const a=polygon[i],b=polygon[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)yes=!yes;
 }return yes;}
export function safeRabbitPoint(p,radius=14){
 for(let a=0;a<Math.PI*2;a+=Math.PI/4){const q={x:p.x+Math.cos(a)*radius,y:p.y+Math.sin(a)*radius};if(!insidePolygon(q,rabbitGround.polygon)||rabbitGround.obstacles.some(o=>insidePolygon(q,o)))return false;}
 return insidePolygon(p,rabbitGround.polygon)&&!rabbitGround.obstacles.some(o=>insidePolygon(p,o));
}
export function safeRabbitPath(a,b,others=[]){const length=Math.hypot(b.x-a.x,b.y-a.y);for(let d=0;d<=length+2;d+=2){const t=Math.min(1,d/(length||1)),p={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
 if(!safeRabbitPoint(p)||others.some(o=>Math.hypot(p.x-o.position.x,p.y-o.position.y)<85||o.target&&Math.hypot(p.x-o.target.x,p.y-o.target.y)<85))return false;
 }return true;}

// Sprite frames are individually illustrated poses. Travel can only happen with the hop clip.
export function rabbitPose(r){
 const t=r.elapsed;
 if(r.reaction){const s=r.reaction.sequence;return {frame:s[Math.min(s.length-1,Math.floor(t/r.duration*s.length))],facing:r.facing,blend:160};}
 if(r.state==='move'){const phase=(t%1050)/1050;return {frame:16+Math.min(7,Math.floor(phase*8)),facing:r.facing,blend:0};}
 if(r.state==='rest')return {frame:r.id==='cream'?15:0,facing:r.facing,blend:0};
 if(r.state==='rise'||r.state==='settle'){
  const stages=r.state==='rise'?[15,14,13,12]:[12,13,14,15];
  return {frame:stages[Math.min(3,Math.floor(t/r.duration*4))],facing:r.facing,blend:160};
 }
 const sequence=r.state==='listen'?[0,2,3,2,0]:r.state==='observe'?[0,1,2,1,0]:r.state==='graze'?[0,8,9,8,9,10,8]:[0,8,9,10,11,8,0];
 // A short action followed by a real hold, rather than continuous twitching.
 const active=Math.min(t,3600),frame=sequence[Math.min(sequence.length-1,Math.floor(active/3600*sequence.length))];
 return {frame,facing:r.facing,blend:160};
}

export function createRabbitLife({seed=1503,onUpdate=()=>{},locomotion=true}={}){
 let randomSeed=seed>>>0,reduced=false,paused=false,disposed=false,clock=0;
 const random=()=>{randomSeed=(Math.imul(randomSeed,1664525)+1013904223)>>>0;return randomSeed/4294967296;};
 const rabbits=rabbitProfiles.map(p=>({id:p.id,position:{...rabbitGround.lanes[p.id][0]},target:null,from:null,state:p.initial,elapsed:0,duration:p.duration,facing:'left',attention:false,afterRise:null,noticeIn:null,lastNotice:-Infinity,lastVisitVariant:-1,pendingReaction:null,reaction:null}));
 const snapshot=()=>rabbits.map(r=>({...r,position:{...r.position},target:r.target?{...r.target}:null,...rabbitPose(r)}));
 const emit=()=>onUpdate(snapshot());
 function enter(r,state,duration){r.state=state;r.elapsed=0;r.duration=duration;r.reaction=null;}
 function rest(r){const p=rabbitProfiles.find(p=>p.id===r.id);enter(r,'rest',p.rest[0]+random()*(p.rest[1]-p.rest[0]));}
 function attend(r){
  if(r.pendingReaction){const plan=r.pendingReaction;r.pendingReaction=null;r.attention=false;enter(r,plan.state,plan.duration);r.reaction=plan;return;}
  if(r.id==='cream'&&r.state==='rest'){r.afterRise='attention';enter(r,'rise',1400);}
  else enter(r,'observe',4600);
 }
 function act(r,state){
  if(state!=='rest'&&rabbits.some(o=>o!==r&&(o.state===state||o.afterRise===state))){rest(r);return;}
  if(r.id==='cream'&&r.state==='rest'){r.afterRise=state;enter(r,'rise',1400);return;}
  if(state==='move'){
   const options=rabbitGround.lanes[r.id].filter(p=>Math.hypot(p.x-r.position.x,p.y-r.position.y)>12);
   const to=options.find(to=>safeRabbitPath(r.position,to,rabbits.filter(o=>o!==r)));
   if(!to||!locomotion){rest(r);return;}
   r.from={...r.position};r.target={...to};r.facing=to.x<r.position.x?'left':'right';
   // Whole cycles end on landing. World displacement is locked to each illustrated hop.
   enter(r,'move',Math.max(1,Math.ceil(Math.hypot(to.x-r.position.x,to.y-r.position.y)/34))*1050);return;
  }
  enter(r,state,state==='graze'?10000+random()*8000:state==='groom'?9000+random()*9000:4200+random()*2500);
 }
 function choose(r){
  if(r.attention){r.attention=false;attend(r);return;}
  const profile=rabbitProfiles.find(p=>p.id===r.id);
  const entries=Object.entries(profile.weights).filter(([state])=>state==='rest'||!rabbits.some(o=>o!==r&&o.state===state));
  let pick=random()*entries.reduce((n,[,w])=>n+w,0),next='rest';for(const [state,w] of entries){pick-=w;if(pick<=0){next=state;break;}}
  if(next==='rest')rest(r);else act(r,next);
 }
 return {
  snapshot,
  tick(dt){
   if(disposed||paused||reduced)return;clock+=Math.max(0,dt);
   for(const r of rabbits){
    if(r.noticeIn!==null){r.noticeIn-=dt;if(r.noticeIn<=0){r.noticeIn=null;if(['move','rise','settle'].includes(r.state))r.attention=true;else attend(r);}}
    r.elapsed=Math.min(r.duration,r.elapsed+Math.max(0,dt));
    if(r.state==='move'&&r.from&&r.target){
     const cycles=r.duration/1050,cycle=Math.min(cycles-1,Math.floor(r.elapsed/1050)),phase=Math.min(1,(r.elapsed-cycle*1050)/1050);
     // Feet preload in place, push/suspension advances, and landing holds contact.
     const stride=phase<.25?0:phase<.75?(phase-.25)/.5:1,t=(cycle+stride)/cycles;
     r.position={x:r.from.x+(r.target.x-r.from.x)*t,y:r.from.y+(r.target.y-r.from.y)*t};
    }
    if(r.elapsed>=r.duration){
     if(r.state==='move'){
      r.position={...r.target};r.target=null;r.from=null;
      if(r.attention){r.attention=false;attend(r);}
      else if(r.id==='lop'&&r.position.y<385)act(r,'graze');
      else if(r.id==='cream')enter(r,'settle',1400);else rest(r);
     }else if(r.state==='rise'){const next=r.afterRise;r.afterRise=null;if(r.attention||next==='attention'){r.attention=false;attend(r);}else act(r,next);}
     else if(r.attention){r.attention=false;attend(r);}
     else if(r.state==='rest')choose(r);
     else if(r.id==='cream'&&r.state!=='settle')enter(r,'settle',1400);else rest(r);
    }
   }emit();
  },
  react(id){const r=rabbits.find(r=>r.id===id);if(!r||disposed)return false;
   if(reduced||paused)return true;
   r.noticeIn=null;r.pendingReaction=null;
   if(r.state==='move'||r.state==='rise'||r.state==='settle')r.attention=true;
   else attend(r);
   emit();return true;
  },
  noticeKeeper(point){if(disposed||reduced||paused)return [];const plans=planKeeperReactions({island:'rabbit',residents:rabbits,point,clock,random});plans.forEach(plan=>{const r=rabbits.find(r=>r.id===plan.id);r.lastNotice=clock;r.lastVisitVariant=plan.variant;r.noticeIn=plan.delay;r.pendingReaction=plan;});return plans.map(p=>p.id);},
  setPaused(value){paused=value;},setReduced(value){
   if(reduced===value)return;reduced=value;
   if(value){for(const r of rabbits){r.target=null;r.from=null;r.attention=false;r.noticeIn=null;r.pendingReaction=null;rest(r);}emit();}
  },dispose(){disposed=true;}
 };
}

export {createLifeLoop as createRabbitLoop} from './life-loop.mjs';
