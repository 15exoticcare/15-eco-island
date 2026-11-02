// Central tuning table. Costs, mechanics, limits and waves live outside React.
export type SlimeKind='green'|'blue'|'purple'|'orange'|'gold'|'pink';
export type TowerKind='seed'|'bubble'|'star'|'hay'|'berry'|'feather'|'sunflower'|'pinecone'|'lightning'|'sentry'|'rock'|'moon';
export type Mechanism='single'|'splash'|'pierce'|'bounce'|'burst'|'support'|'chain';
export type TowerSpec={name:string;cost:number;damage:number;range:number;interval:number;speed:number;description:string;color:string;mode:Mechanism;magic?:boolean;splash?:number;slow?:number;slowDuration?:number;pierce?:number;beamWidth?:number;jumps?:number;jumpRange?:number;falloff?:number;burstCount?:number;burstGap?:number;support?:number};
export const rules={health:20,maxLevel:3,upgradeCost:.75,damageGrowth:.6,rangeGrowth:.12,cooldownGrowth:.9,maxTick:.05,effectDuration:.7,maxEffects:80,maxShots:100,maxEnemies:96,childCount:2,childHpRatio:.25,childReward:3,childSpeed:145,childSpeedVariation:.2,childLeak:1,childGrace:.18,shieldPhysical:.8,shieldMagic:1.25,healRadius:190,healInterval:3,healAmount:6,healReceivedCooldown:1.2,auraGrowth:.05,spawnFloor:.5,spawnWaveStep:.1,childMinHp:12,auraMax:.30,splitMaxGeneration:1};
export const slimeTypes:Record<SlimeKind,{name:string;hp:number;speed:number;reward:number;leak:number;color:string;shield:number;description:string}>={
 green:{name:'綠色史萊姆',hp:44,speed:115,reward:12,leak:2,color:'#8da773',shield:0,description:'普通型・均衡前進'},
 blue:{name:'藍色史萊姆',hp:30,speed:175,reward:14,leak:1,color:'#8bc5d5',shield:0,description:'速度型・輕快但生命較低'},
 purple:{name:'紫色史萊姆',hp:125,speed:82,reward:24,leak:4,color:'#b5a1c9',shield:0,description:'厚血型・慢慢靠近'},
 orange:{name:'橘色史萊姆',hp:68,speed:110,reward:15,leak:3,color:'#e6ab73',shield:0,description:'分裂型・擊敗後變成兩隻小史萊姆，僅一次'},
 gold:{name:'黃金史萊姆',hp:85,speed:93,reward:25,leak:3,color:'#d7bd74',shield:60,description:'護盾型・額外護盾，魔法更容易破解'},
 pink:{name:'粉紅史萊姆',hp:55,speed:104,reward:20,leak:2,color:'#d9a0b1',shield:0,description:'治療型・每 3 秒替附近同伴恢復少量生命，不治療自己'}
};
export const towerTypes:Record<TowerKind,TowerSpec>={
 seed:{name:'種子射手塔',cost:55,damage:24,range:470,interval:.85,speed:720,description:'穩定單體攻擊，適合補足防線',color:'#93a56d',mode:'single'},
 bubble:{name:'泡泡減速塔',cost:65,damage:9,range:450,interval:1.05,speed:580,description:'減速 45%・持續 2 秒，不重複疊加',color:'#83b6c6',mode:'single',magic:true,slow:.55,slowDuration:2},
 star:{name:'星光魔法塔',cost:90,damage:25,range:460,interval:1.65,speed:630,description:'大範圍星光魔法，擅長聚集敵人與護盾',color:'#c7ae78',mode:'splash',magic:true,splash:160},
 hay:{name:'牧草種子塔',cost:65,damage:8,range:380,interval:.26,speed:850,description:'短射程快速連射，應對藍色與分裂小史萊姆',color:'#a6b976',mode:'single'},
 berry:{name:'維C莓果塔',cost:75,damage:19,range:420,interval:1.1,speed:640,description:'莓果命中後小範圍綻開，對付密集與分裂敵人',color:'#c88f9a',mode:'splash',splash:105},
 feather:{name:'羽毛旋風塔',cost:95,damage:16,range:430,interval:1.1,speed:900,description:'羽毛直線穿透，最多命中 4 隻史萊姆',color:'#88b5a8',mode:'pierce',pierce:4,beamWidth:36,magic:true},
 sunflower:{name:'向日葵種子塔',cost:85,damage:15,range:420,interval:1.2,speed:700,description:'種子再彈跳 2 次，每次傷害保留 80%',color:'#cfb366',mode:'bounce',jumps:2,jumpRange:190,falloff:.8},
 pinecone:{name:'松果刺球塔',cost:100,damage:44,range:440,interval:2.6,speed:430,description:'緩慢拋射大型松果，落地造成重範圍傷害',color:'#a18b6a',mode:'splash',splash:135},
 lightning:{name:'追風閃電塔',cost:90,damage:17,range:430,interval:2.5,speed:1000,description:'短時間連射 4 道閃電，再進入較長冷卻',color:'#92bcc5',mode:'burst',magic:true,burstCount:4,burstGap:.12},
 sentry:{name:'哨兵瞭望塔',cost:60,damage:0,range:360,interval:1,speed:0,description:'不直接攻擊；附近塔射程 +20%～30%，多座不疊加',color:'#bba175',mode:'support',support:.2},
 rock:{name:'岩石防衛塔',cost:110,damage:115,range:510,interval:3,speed:480,description:'緩慢但高單發傷害，對付紫色厚血型',color:'#9ba99a',mode:'single'},
 moon:{name:'月光魔法塔',cost:110,damage:18,range:445,interval:1.6,speed:850,description:'月光連鎖再跳躍 3 次，附加 1.4 秒輕減速',color:'#b7aed1',mode:'chain',magic:true,jumps:3,jumpRange:205,falloff:.85,slow:.7,slowDuration:1.4}
};
export const basicTowers:TowerKind[]=['seed','bubble','star'];
export const towerArt=(kind:TowerKind)=>`/assets/${basicTowers.includes(kind)?'defense-v1':'defense-v3'}/tower-${kind}.webp`;
export const slimeArt=(kind:SlimeKind)=>`/assets/${['green','blue','purple'].includes(kind)?'defense-v1':'defense-v3'}/slime-${kind}.webp`;
