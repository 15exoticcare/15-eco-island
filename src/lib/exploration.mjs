// These are ambient visitors, never hotel residents or patrol destinations.
export const explorationReviewed='2026-10-29';
export const explorationVisitors=[
 {id:'squirrel',name:'松鼠',setting:'林間枝頭',x:40,y:470,width:260,aspect:1369/1149,contact:[.76,.43],size:44,duration:2800,
  fact:'歐亞紅松鼠蓬鬆的長尾巴，能幫助牠在樹枝間活動時保持平衡。',
  source:{name:'Mammal Society｜Red squirrel',url:'https://mammal.org.uk/british-mammals/red-squirrel'},
  reaction:'抬頭留意',approved:[0,1],excluded:[2,3],audit:'只採用同方向的安坐與抬頭；其餘姿勢的轉向與體型銜接不穩定。'},
 {id:'owl',name:'貓頭鷹',setting:'安靜樹洞',x:1740,y:430,width:250,aspect:1369/1149,contact:[.45,.52],size:40,duration:3400,
  fact:'貓頭鷹的眼睛不容易在眼窩內轉動，牠們會轉動頭部來觀察旁邊的事物。',
  source:{name:'BTO｜Owl vision',url:'https://www.bto.org/learn/about-birds/owls/vision'},
  reaction:'慢慢轉頭',approved:[0,1],excluded:[2,3],audit:'採用正面與小角度轉頭；閉眼及另一待機姿勢保留為候選，避免腳爪與身形跳變。'},
 {id:'frog',name:'青蛙',setting:'池畔葉面',x:100,y:1350,width:300,aspect:1.5,contact:[.64,.40],size:32,duration:2600,
  fact:'許多樹蛙的腳趾末端有特化的趾墊，能幫助牠們攀附在植物表面。',
  source:{name:'San Diego Zoo｜Frog and Toad',url:'https://animals.sandiegozoo.org/animals/frog-and-toad'},
  reaction:'輕輕抬頭',approved:[0,1],excluded:[2,3],audit:'採用落地蹲坐與輕微抬頭；沒有蹬地、騰空、落地序列，禁止跳躍位移。'},
 {id:'butterfly',name:'蝴蝶',setting:'花叢小徑',x:1330,y:1540,width:250,aspect:1369/1149,contact:[.56,.41],size:26,duration:2400,
  fact:'蝴蝶的翅膀覆蓋著細小鱗片；牠們所屬的「鱗翅目」，名字就和這項特徵有關。',
  source:{name:'Florida Museum｜Butterfly FAQ',url:'https://www.floridamuseum.ufl.edu/discover-butterflies/faq/'},
  reaction:'停棲輕動翅',approved:[0,1],excluded:[2,3],audit:'只採用側面停棲與小幅張翅；大幅展翅格的視角與翅形不連續，不用來冒充飛行。'},
 {id:'gecko',name:'壁虎',setting:'苔岩角落',x:2170,y:1460,width:280,aspect:1.5,contact:[.55,.57],size:54,duration:3000,
  fact:'許多壁虎的趾墊帶有微小剛毛，能增加與表面的接觸，幫助牠們攀附。',
  source:{name:'UC Berkeley｜Gecko Project',url:'https://people.eecs.berkeley.edu/~ronf/Gecko/gecko.html'},
  reaction:'抬頭探看',approved:[0,1],excluded:[2,3],audit:'採用同方向伏姿與抬頭；回頭格的頸部轉向與身形銜接不穩定。沒有合格爬行序列。'}
];
export function visitorPoint(p){return {x:p.x+p.width*p.contact[0],y:p.y+p.width/p.aspect*p.contact[1]};}

// A tiny reaction clock; root positions never change. Hidden tabs use life-loop.
export function createExplorationLife({onUpdate=()=>{}}={}){
 let paused=false,reduced=false,disposed=false;
 const actors=explorationVisitors.map(p=>({id:p.id,elapsed:0,reacting:false,frame:0}));
 const snapshot=()=>actors.map(a=>({...a}));
 const emit=()=>onUpdate(snapshot());
 return {snapshot,
  react(id){const a=actors.find(a=>a.id===id);if(!a||disposed)return false;if(paused||reduced)return true;a.elapsed=0;a.reacting=true;a.frame=0;emit();return true;},
  tick(dt){if(paused||reduced||disposed)return;let changed=false;
   for(const a of actors){if(!a.reacting)continue;const p=explorationVisitors.find(p=>p.id===a.id);a.elapsed+=Math.max(0,Math.min(dt,100));const frame=a.elapsed>=p.duration*.25&&a.elapsed<p.duration*.78?1:0;if(a.elapsed>=p.duration)a.reacting=false;if(a.frame!==frame){a.frame=frame;changed=true;}}
   if(changed)emit();
  },
  setPaused(v){paused=v;},setReduced(v){reduced=v;if(v){actors.forEach(a=>{a.frame=0;a.elapsed=0;a.reacting=false;});emit();}},dispose(){disposed=true;}
 };
}
