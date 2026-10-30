import{habitats,safeAnimalPath}from'./habitats.mjs';
import{animalProfiles}from'./animal-life.mjs';
// Coordinates are authored on the unchanged 1774 x 887 front-gardens image.
// Each room has its own ground polygon; no per-animal CSS offsets are used.
const point=([x,y])=>({x:x/1774*1000,y:y/1774*1000});
export const hamsterRooms=[
 {id:'hamster-1',label:'A',nodes:[[202,465],[224,468]],floor:[[165,449],[246,449],[253,479],[174,480]]},
 {id:'hamster-2',label:'B',nodes:[[390,482],[409,480]],floor:[[351,463],[436,463],[440,497],[345,496]]},
 {id:'hamster-3',label:'C',nodes:[[567,485],[591,480]],floor:[[532,463],[624,463],[630,497],[526,498]]},
 {id:'hamster-4',label:'D',nodes:[[764,463],[790,466]],floor:[[730,448],[823,448],[825,481],[725,483]]}
];
export const hamsterGround={...habitats.hamster,height:500,obstacles:[],occluders:[],zones:Object.fromEntries(hamsterRooms.map(r=>[r.id,{label:r.label,nodes:r.nodes.map(point),polygon:r.floor.map(point)}]))};
export const groundHabitats={...habitats,hamster:hamsterGround};
export const groundProfiles=animalProfiles.map(p=>p.island==='hamster'?{...p,zone:hamsterGround.zones[p.id],atlas:{...p.atlas,anchor:[96,166],bounds:[[0,0,192,192]]}}:p);
export const groundPathSafe=(island,id,a,b,others)=>safeAnimalPath(island,id,a,b,others,groundHabitats);
export const hamsterPlacement={left:800,top:1060,width:1400,height:700};
export const hamsterFencePolygons=[[[137,464],[199,486],[272,494],[275,542],[132,521]],[[330,498],[398,505],[480,504],[480,565],[327,555]],[[510,505],[580,510],[652,505],[660,560],[507,560]],[[712,489],[780,473],[858,451],[860,509],[712,548]]];
