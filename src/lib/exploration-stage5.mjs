// Opt-in seventh-island edition. Main terrain, residents and patrol routes are unchanged.
export const eggReviewed='2026-10-30';
export const eggWorld={width:3300,height:2300,center:{x:1390,y:1010},bounds:{width:3760,height:2440}};
const source=(name,url)=>({name,url});
export const eggIslands=[
 {id:'squirrel',name:'松鼠',place:'松鼠區',setting:'松鼠區',description:'在樹洞、草地與落葉之間，遇見三位各有步調的森林朋友。',x:-430,y:180,width:400,height:400*2/3,fact:'歐亞紅松鼠蓬鬆的長尾巴，能幫助牠在樹枝間活動時保持平衡。',source:source('Mammal Society｜Red squirrel','https://mammal.org.uk/british-mammals/red-squirrel')},
 {id:'owl',name:'貓頭鷹',place:'貓頭鷹區',setting:'貓頭鷹區',description:'枝幹連著安靜樹洞，一位羽毛蓬鬆的朋友慢慢看看四周。',x:1280,y:-120,width:400,height:400*2/3,fact:'貓頭鷹的眼睛不容易在眼窩內轉動，牠們會轉動頭部來觀察旁邊的事物。',source:source('BTO｜Owl vision','https://www.bto.org/learn/about-birds/owls/vision')},
 {id:'horned-frog',name:'角蛙',place:'角蛙區',setting:'角蛙區',description:'三個以實體岩石分隔的微棲地，各自留有苔地、水角與躲藏處。',x:160,y:1250,width:430,height:430*2/3,fact:'角蛙常以伏擊方式覓食，會藏在植被間等待獵物靠近。',source:source('Smithsonian National Zoo｜Cranwell’s horned frog','https://nationalzoo.si.edu/animals/cranwells-horned-frog')},
 {id:'gecko',name:'守宮',place:'守宮區',setting:'守宮區',description:'溫暖岩台、洞穴與木頭間，留一處能安心觀察的小角落。',x:1030,y:1880,width:420,height:280,fact:'守宮有許多不同種類；有些種類白天活動，有些則在夜間活動。',source:source('San Diego Zoo Wildlife Explorers｜Gecko','https://sdzwildlifeexplorers.org/animals/gecko')},
 {id:'capybara',name:'水豚',place:'水豚區',setting:'水豚區',description:'兩位水豚朋友分別停留在湖岸草地與淺水旁的休憩角落。',x:2600,y:80,width:580,height:580*2/3,fact:'水豚是體型最大的現生齧齒類，腳趾間略帶蹼，適應水邊活動。',source:source('San Diego Zoo｜Capybara','https://animals.sandiegozoo.org/animals/capybara')},
 {id:'fancy-rat',name:'花枝鼠',place:'花枝鼠區',setting:'花枝鼠區',description:'木屋、低隧道和安全草地，陪兩隻長尾巴朋友慢慢探索。',x:-390,y:1260,width:430,height:430*2/3,fact:'花枝鼠會用敏感的鬍鬚觸碰物體，幫助探索周圍環境。',source:source('RSPCA｜Rats and their whiskers','https://www.rspca.org.uk/adviceandwelfare/pets/rodents/rats/behaviour')},
 {id:'sulcata',name:'蘇卡達龜',place:'蘇卡達龜區',setting:'蘇卡達龜區',description:'柔和草原、沙土地與遮蔭棚，留給兩位陸龜朋友自己的慢步調。',x:2420,y:1410,width:580,height:580*2/3,fact:'蘇卡達龜擅長挖洞；野外會利用地下洞穴躲避極端溫度。',source:source('San Diego Zoo｜African Spurred Tortoise','https://animals.sandiegozoo.org/animals/african-spurred-tortoise')}
];
const actor=(id,species,name,x,y,size,options={})=>({id,species,name,x,y,size,move:false,period:1300,wait:18000,...options});
export const eggAnimals=[
 actor('squirrel-1','squirrel','林邊觀察松鼠',.18,.59,76,{wait:14000}),
 actor('squirrel-2','squirrel','草地探索松鼠',.46,.71,74,{move:true,to:[.51,.71],period:950,wait:19000}),
 actor('squirrel-3','squirrel','樹旁理毛松鼠',.81,.62,74,{wait:26000}),
 actor('owl-1','owl','樹枝上的貓頭鷹',.49,.425,88,{wait:32000,perch:true}),
 actor('horned-frog-1','horned-frog','綠色角蛙',.19,.59,82,{wait:25000}),
 actor('horned-frog-2','horned-frog','棕色角蛙',.50,.62,80,{wait:33000}),
 actor('horned-frog-3','horned-frog','奶油金角蛙',.82,.63,78,{wait:41000}),
 actor('gecko-1','gecko','岩台守宮',.56,.635,110,{wait:28000}),
 actor('capybara-1','capybara','岸邊休息水豚',.26,.62,132,{wait:29000}),
 actor('capybara-2','capybara','湖畔探索水豚',.79,.77,122,{move:true,to:[.75,.77],period:1600,wait:34000}),
 actor('fancy-rat-1','fancy-rat','黑白探索花枝鼠',.25,.66,104,{move:true,to:[.29,.66],period:1250,wait:22000}),
 actor('fancy-rat-2','fancy-rat','灰白理毛花枝鼠',.75,.63,102,{wait:27000}),
 actor('sulcata-1','sulcata','草地慢行蘇卡達龜',.29,.65,144,{move:true,to:[.34,.65],period:2900,wait:30000}),
 actor('sulcata-2','sulcata','棚前休息蘇卡達龜',.78,.61,134,{wait:46000})
];
export const eggCounts=Object.fromEntries(eggIslands.map(p=>[p.id,eggAnimals.filter(a=>a.species===p.id).length]));
export const eggPoint=a=>{const p=eggIslands.find(p=>p.id===a.species);return{x:p.x+a.x*p.width,y:p.y+a.y*p.height}};
