import {creatures} from './creatures.ts';
import {islands} from './islands.ts';
import {habitats,safeAnimalPath} from './habitats.mjs';
import assets from './animal-assets.json' with {type:'json'};
import {planKeeperReactions} from './keeper-reactions.mjs';

const species={
 parrot:{rest:[22000,48000],period:1300,step:18,care:'理羽與整理',weights:{care:4,observe:3,move:2}},
 guinea:{rest:[24000,48000],period:1100,step:22,care:'慢慢進食',weights:{care:5,observe:2,move:3}},
 hamster:{rest:[32000,65000],period:1000,step:14,care:'探頭與儲糧觀察',weights:{care:4,observe:2,move:2}},
 hedgehog:{rest:[42000,85000],period:1450,step:20,care:'輕嗅地面',weights:{care:4,observe:1,move:2}},
 ferret:{rest:[20000,40000],period:1000,step:23,care:'探看洞口',weights:{care:3,observe:2,move:5}},
 meerkat:{rest:[22000,45000],period:1100,step:20,care:'留心四周',weights:{care:3,observe:5,move:2}},
 chinchilla:{rest:[35000,68000],period:1250,step:18,care:'整理毛髮',weights:{care:5,observe:2,move:2}},
 glider:{rest:[48000,90000],period:1650,step:15,care:'抱枝休息',weights:{care:4,observe:2,move:2}}
};
const features={parrot:'獨立棲區裡，留給不同羽色朋友各自的棲木與安靜角落。',guinea:'圓鈍的口鼻、短短的腿，和每一隻都不同的毛色與毛流。',hamster:'小小的身體有自己的節奏；每隻都住在分開的安全生活區。',hedgehog:'背部細密的刺與柔軟小臉，保留讓牠安心退回的距離。',ferret:'細長身形、短腿和長尾，喜歡慢慢聞、細細探看。',meerkat:'深色眼周與細長尾巴，常留意身邊細小的變化。',chinchilla:'蓬鬆毛量、圓耳和柔軟長尾，陪牠在乾爽的空間慢慢生活。',glider:'大眼睛、背部深色條紋與收攏的滑翔膜，讓牠抱住熟悉的枝幹。'};
const careLabels={sun:'輕輕理羽',green:'留意周圍',cockatiel:'頭冠微動',budgie:'安靜停棲','guinea-1':'咀嚼牧草','guinea-2':'低頭進食','guinea-3':'抬頭嗅聞','guinea-4':'安心伏休','hamster-1':'探頭觀察','hamster-2':'頰囊姿態','hamster-3':'輕嗅空氣','hamster-4':'蜷身休息','hedgehog-1':'輕嗅地面','hedgehog-2':'安靜探頭','hedgehog-3':'蜷身休息','ferret-1':'低頭探索','ferret-2':'轉頭觀察','ferret-3':'低頭嗅聞','meerkat-1':'站哨警戒','meerkat-2':'坐姿觀察','meerkat-3':'嗅聞沙地','chinchilla-1':'抬前腳洗臉','chinchilla-2':'安靜觀察','chinchilla-3':'窩著休息','glider-1':'抱住枝幹','glider-2':'抱枝探頭','glider-3':'蜷身休息'};
const individualFeatures={parrot:['暖黃與橘紅羽色、黑色彎喙，在自己的棲區慢慢理羽。','綠色翅羽、灰褐頭部與酒紅尾羽，喜歡安靜留意周圍。','淡黃色臉頰、橘色頰斑和細長頭冠，停在自己的棲木上。','藍色胸腹與黑白波紋翼羽，在獨立棲區輕輕換個位置。'],guinea:['焦糖白短毛、小圓耳和圓鈍口鼻，慢慢咀嚼嘴邊的牧草。','三色捲毛形成自然毛旋，低頭看看草地上的小日常。','黑色與奶油色短毛，圓滾身形配上短短的腳，偶爾抬頭聞聞。','肉桂色長毛、柔順毛流，喜歡多留一點安靜的休息時間。'],hamster:['金黃毛色與圓耳，在 A 區自己的小天地探頭。','奶油色毛皮與飽滿臉頰，在 B 區安靜休息。','灰背與深色背線，在 C 區聞聞熟悉的氣味。','灰白毛色與圓圓身形，在 D 區蜷著休息。']};
export const animalProfiles=creatures.filter(a=>habitats[a.island]).map((a,index)=>{
 const habitat=habitats[a.island],zone=habitat.zones[a.id],island=islands.find(i=>i.id===a.island),asset=assets[a.id]??{available:false,movement:false,transition:false,cell:192,anchor:[96,166],displaySize:Math.max(a.width,a.height)*1.25};
 const localIndex=creatures.filter(c=>c.island===a.island).findIndex(c=>c.id===a.id);
 const base=species[a.island],personal={...base,rest:base.rest.map(t=>Math.round(t*(.9+localIndex*.11))),period:Math.round(base.period*(.94+localIndex*.05)),weights:{...base.weights,move:base.weights.move*(1-localIndex*.12),rest:['hedgehog-3','glider-3'].includes(a.id)?9:3+localIndex}};
 if(['sun','guinea-1','guinea-2','chinchilla-1'].includes(a.id))personal.weights.care+=3;
 if(a.id==='meerkat-1')personal.weights.observe+=4;
 return {...a,index,localIndex,zone,species:personal,feature:individualFeatures[a.island]?.[localIndex]??features[a.island],fact:island.facts[localIndex%island.facts.length],atlas:asset,careLabel:careLabels[a.id]};
});
export const animalActions={rest:'安靜休息',observe:'短暫留意',care:'自己的小日常',prepare:'準備換個位置',move:'短程探索',settle:'慢慢安頓'};
export function animalFrame(r){
 const p=animalProfiles.find(p=>p.id===r.id),t=r.elapsed;
 if(r.reaction){const s=r.reaction.sequence;return s[Math.min(s.length-1,Math.floor(t/r.duration*s.length))];}
 if(p.id==='glider-1'){
  if(r.state==='rest')return 8;
  if(r.state==='observe'||r.state==='care')return [8,9,8][Math.min(2,Math.floor(Math.min(t,4200)/4200*3))];
  if(r.state==='prepare'||r.state==='settle')return 8;
 }
 if(r.state==='rest')return 0;
 if(r.state==='move'){let n=Math.min(7,Math.floor((t%p.species.period)/p.species.period*8));if(p.island==='glider'&&r.reverse)n=7-n;return 8+n;}
 if(r.state==='prepare')return 4+Math.min(3,Math.floor(t/r.duration*4));
 if(r.state==='settle')return 7-Math.min(3,Math.floor(t/r.duration*4));
 const sequence=r.state==='observe'?[0,1,1,0]:[0,2,3,2,3,0];
 return sequence[Math.min(sequence.length-1,Math.floor(Math.min(t,4200)/4200*sequence.length))];
}

export function createAnimalLife({seed=1504,onUpdate=()=>{},locomotion=true}={}){
 let value=seed>>>0,paused=false,reduced=false,disposed=false,clock=0;
 const random=()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};
 const residents=animalProfiles.map((p,n)=>({id:p.id,island:p.island,position:{...p.zone.nodes[0]},target:null,from:null,state:'rest',elapsed:0,duration:1800+n*1150,reverse:false,facing:'left',attention:false,noticeIn:null,lastNotice:-Infinity,lastVisitVariant:-1,pendingReaction:null,reaction:null}));
 const snapshot=()=>residents.map(r=>({...r,position:{...r.position},target:r.target?{...r.target}:null,frame:animalFrame(r)}));
 const emit=()=>onUpdate(snapshot());
 const enter=(r,state,duration)=>{r.state=state;r.elapsed=0;r.duration=duration;r.reaction=null;};
 function rest(r){const s=animalProfiles.find(p=>p.id===r.id).species;enter(r,'rest',s.rest[0]+random()*(s.rest[1]-s.rest[0]));}
 function observe(r){const plan=r.pendingReaction;r.pendingReaction=null;r.attention=false;enter(r,plan?.state??'observe',plan?.duration??4600+random()*700);r.reaction=plan;}
 function choose(r){
  const p=animalProfiles.find(p=>p.id===r.id);
  if(r.attention){observe(r);return;}
  const choices=Object.entries(p.species.weights).filter(([s])=>(s!=='move'||locomotion&&p.atlas.movement&&p.atlas.transition)&&(s==='rest'||!residents.some(o=>o!==r&&o.island===r.island&&(o.state===s||s==='move'&&o.state==='prepare'||s==='observe'&&(o.noticeIn!==null||o.attention)))));
  let sample=random()*choices.reduce((sum,[,weight])=>sum+weight,0),action='rest';for(const [s,w] of choices){sample-=w;if(sample<=0){action=s;break;}}
  if(action==='rest'){rest(r);return;}
  if(action==='move'){
   const others=residents.filter(o=>o!==r&&o.island===r.island),to=p.zone.nodes.find(q=>Math.hypot(q.x-r.position.x,q.y-r.position.y)>8&&safeAnimalPath(r.island,r.id,r.position,q,others));
   if(!to){rest(r);return;}
   r.from={...r.position};r.target={...to};r.reverse=to.x>r.position.x;
   // Branch descent plays the gripping sequence in reverse; it never becomes a flight.
   r.facing=r.island==='glider'?'left':r.reverse?'right':'left';enter(r,'prepare',1100);return;
  }
  enter(r,action,action==='care'?6500+random()*5000:4600+random()*1500);
 }
 return {
  snapshot,
  tick(dt){
   if(disposed||paused||reduced)return;clock+=dt;
   for(const r of residents){
    if(r.noticeIn!==null){r.noticeIn-=dt;if(r.noticeIn<=0){r.noticeIn=null;if(['move','prepare','settle'].includes(r.state))r.attention=true;else observe(r);}}
    r.elapsed=Math.min(r.duration,r.elapsed+Math.max(0,dt));
    if(r.state==='move'&&r.from&&r.target){const p=animalProfiles.find(p=>p.id===r.id),cycles=r.duration/p.species.period,cycle=Math.min(cycles-1,Math.floor(r.elapsed/p.species.period)),phase=Math.min(1,(r.elapsed-cycle*p.species.period)/p.species.period),stride=Math.max(0,Math.min(1,(phase-.125)/.75)),t=(cycle+stride)/cycles;r.position={x:r.from.x+(r.target.x-r.from.x)*t,y:r.from.y+(r.target.y-r.from.y)*t};}
    if(r.elapsed>=r.duration){
     if(r.state==='prepare'){
      if(r.attention){r.target=null;r.from=null;observe(r);}else{const s=animalProfiles.find(p=>p.id===r.id).species,length=Math.hypot(r.target.x-r.from.x,r.target.y-r.from.y);enter(r,'move',Math.max(1,Math.ceil(length/s.step))*s.period);}
     }else if(r.state==='move'){r.position={...r.target};r.target=null;r.from=null;enter(r,'settle',1100);}
     else if(r.attention)observe(r);
     else if(r.state==='rest')choose(r);
     else rest(r);
    }
   }emit();
  },
  react(id){const r=residents.find(r=>r.id===id);if(!r||disposed)return false;if(paused||reduced)return true;r.noticeIn=null;r.pendingReaction=null;if(['move','prepare','settle'].includes(r.state))r.attention=true;else observe(r);emit();return true;},
  noticeKeeper(island,point){
   if(disposed||paused||reduced)return [];
   const plans=planKeeperReactions({island,residents,point,clock,random});
   plans.forEach(plan=>{const r=residents.find(r=>r.id===plan.id);r.lastNotice=clock;r.lastVisitVariant=plan.variant;r.pendingReaction=plan;r.noticeIn=plan.delay;});return plans.map(p=>p.id);
  },
  setPaused(v){paused=v;},setReduced(v){if(v===reduced)return;reduced=v;if(v){for(const r of residents){r.target=null;r.from=null;r.attention=false;r.noticeIn=null;r.pendingReaction=null;rest(r);}emit();}},dispose(){disposed=true;}
 };
}
