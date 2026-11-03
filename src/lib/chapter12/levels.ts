import {levels as originals,type Level as Original} from '../campaign/levels.ts';import {bossForLevel,type BossId} from './bosses.ts';import type {NormalKind,SlimeKind} from './balance.ts';
export type Level=Omit<Original,'waves'|'enemyKinds'>&{waves:SlimeKind[][];enemyKinds:SlimeKind[];bossId?:BossId};
const counts=[16,20,24,28,34];
export const levels:Level[]=originals.map((old,index)=>{const rank=Math.max(0,index-1),boss=bossForLevel(old.id),waves:SlimeKind[][]=[],spawnDelays:number[][]=[];
 for(let w=0;w<5;w++){const pool:NormalKind[]=w===0?['green','blue',rank>3?'purple':'green']:w===1?['green','blue','purple','orange']:w===2?['green','blue','purple','orange','gold']:['green','blue','purple','orange','gold','pink'];const count=counts[w]+(index===1?(w===0?-1:-2):rank>=5&&w>0?2:0);const wave:SlimeKind[]=Array.from({length:count},(_,i)=>pool[(i+rank+w*2)%pool.length]);
 // Theme sequences alter convoy composition, not just hit points.
 if(w>=2)for(let i=5;i<count;i+=7){wave[i]=old.id==='guinea'?'orange':old.id==='parrot'?'blue':old.id==='chinchilla'?'purple':old.id==='meerkat'?'pink':pool[(i+rank)%pool.length]}
 if(w===4&&old.id==='guinea')wave.splice(wave.length-4,4,'gold','pink','purple','purple');if(w===4){const opening:NormalKind[]=['green','blue','purple'];for(let i=0;i<8;i++)wave[i]=opening[(i+rank)%opening.length]}const delays=wave.map((_,i)=>[2.6,2.5,2.1,2.1,2][w]+((i+rank)%4===3?1.3:0));if(w===4&&boss){delays[delays.length-1]=2;wave.push(boss.id);delays.push(1)}waves.push(wave);spawnDelays.push(delays)}
 return{...old,description:index===0?'完整長花徑上的五波混合入侵。':old.description+' 第五波迎戰'+boss?.name+'。',bossId:boss?.id,coins:index===0?180:index===1?175:190+rank*7,hpFactor:index===1?.88:1+rank*.055,waveGrowth:.12,spawnInterval:1.6,waves,spawnDelays,enemyKinds:[...new Set(waves.flat())]};
});export const getLevel=(id:string)=>levels.find(l=>l.id===id)??levels[0];
