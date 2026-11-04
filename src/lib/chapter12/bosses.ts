export const bossIds=['clover','berry','feather','sunflower','pine','lightning','dune','crystal','king'] as const;
export type BossId=typeof bossIds[number];
export type BossSpec={id:BossId;level:string;name:string;art:string;color:string;hp:number;speed:number;reward:number;leak:number;ability:string;description:string;shield:number;shieldSeconds:number;summonLimit:number;phaseAt:number;maxCasts:number;cooldown:number;warning:number;duration:number;cue:number};
const rows:[BossId,string,string,string,number,number,string,string][]=[
 ['clover','rabbit','四葉草史萊姆王','#8da773',1500,75,'clover','草葉護盾兩次，召喚最多四位小護衛'],
 ['berry','guinea','莓果果凍女王','#d992ac',1750,74,'heal','預警後治療附近普通同伴，第二階段冷卻縮短，最多六次'],
 ['feather','parrot','彩羽風暴王','#84bec3',1900,78,'wind','預警後為附近隊伍加速三秒，最多四次'],
 ['sunflower','hamster','向日葵分裂王','#d4b46a',2000,73,'split','生命七成與三成五時，各召喚三位有限護衛'],
 ['pine','hedgehog','松果鎧甲王','#a48462',2200,70,'armor','累積受傷觸發限時木甲，魔法可快速破甲，最多三次'],
 ['lightning','ferret','追風閃電王','#89bfce',2150,80,'dash','蓄力後連續沿路衝刺，第二階段冷卻縮短，最多四次'],
 ['dune','meerkat','沙丘幻影王','#d4bd8c',2300,75,'mirage','預警後產生有限幻影，八秒消散；不扣防護、不給獎勵'],
 ['crystal','chinchilla','岩晶巨獸王','#aba4c4',3000,68,'crystal','七成與三成五生命各開一次岩晶護盾，限時碎光'],
 ['king','glider','史萊姆國王','#b4c9cf',3200,72,'king','皇家護盾、六位護衛、預警衝刺與第二階段']
];
export const bosses=Object.fromEntries(rows.map(([id,level,name,color,hp,speed,ability,description],i)=>[id,{id,level,name,color,hp:Math.round(hp*({clover:1.12,berry:1.14,feather:1.16,sunflower:1.16,pine:1.18,lightning:1.18,dune:1.20,crystal:1.22,king:1.25}[id])),speed,reward:130+i*10,leak:20,ability,description,art:id==='king'?'/assets/chapter11/slime-king.webp':`/assets/chapter12/boss-${id}.webp`,shield:id==='crystal'?280:id==='pine'?160:id==='king'?140:100,shieldSeconds:id==='crystal'?7:6,summonLimit:id==='clover'?4:id==='sunflower'||id==='king'?6:0,phaseAt:.5,maxCasts:id==='berry'?6:4,cooldown:12,warning:1.5,duration:3,cue:i}])) as Record<BossId,BossSpec>;
export const isBoss=(kind:string):kind is BossId=>bossIds.includes(kind as BossId);
export const bossForLevel=(id:string)=>Object.values(bosses).find(b=>b.level===id);

export const bossWarnings:Record<BossId,string>={clover:'草葉護盾與小護衛',berry:'莓果治療正在蓄力',feather:'彩羽順風將為附近敵人加速',sunflower:'向日葵護衛即將分裂',pine:'木甲防護，使用魔法破甲',lightning:'雷光衝刺即將發動',dune:'沙塵幻影即將出現',crystal:'岩晶護盾正在凝聚',king:'皇家衝刺即將發動'};
