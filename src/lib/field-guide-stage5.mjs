import {guideEntries as legacyEntries,guideStorageKey as legacyKey}from'./field-guide.mjs';
import {eggIslands,eggAnimals}from'./exploration-stage5.mjs';import {assetUrl}from'./public-assets.mjs';
export const expandedGuideVersion=2;
// Separate key prevents an open legacy preview from downgrading the expanded collection.
export const expandedGuideStorageKey='yiwu.eco-island.field-guide.v2';
export const expandedGuideEntries=[...legacyEntries.filter(e=>e.group==='hotel'),...eggIslands.map(p=>({id:p.id,name:p.name,group:'visitor',description:p.description,facts:[p.fact],image:assetUrl(`/assets/diorama-stage5/${eggAnimals.find(a=>a.species===p.id).id}.webp`),atlas:true,hint:`到${p.place}尋找牠`,place:p.place,source:p.source}))];
const known=new Set(expandedGuideEntries.map(e=>e.id)),normalize=ids=>expandedGuideEntries.filter(e=>ids.includes(e.id)).map(e=>e.id);
export const migrationRules={fromVersion:1,toVersion:2,remap:{frog:'horned-frog',gecko:'gecko'},drop:['butterfly'],requireDiscovery:['capybara','fancy-rat','sulcata']};
export function migrateLegacyGuide(raw){
 if(raw==null)return{ids:[],storageState:'ready',migrated:false};
 try{const d=JSON.parse(raw);if(!d||typeof d!=='object'||Array.isArray(d)||!Array.isArray(d.discovered))return{ids:[],storageState:'recovered',migrated:false};if(d.version!==1)return{ids:[],storageState:'unsupported',migrated:false};const ids=normalize(d.discovered.filter(id=>typeof id==='string'&&id!=='butterfly'&&!migrationRules.requireDiscovery.includes(id)).map(id=>migrationRules.remap[id]??id));return{ids,storageState:'ready',migrated:true};}catch{return{ids:[],storageState:'recovered',migrated:false}}
}
export function decodeExpandedGuide(raw){
 if(raw==null)return{ids:[],storageState:'ready'};
 try{const d=JSON.parse(raw);if(!d||typeof d!=='object'||Array.isArray(d))return{ids:[],storageState:'recovered'};if(d.version!==2)return{ids:[],storageState:'unsupported'};if(!Array.isArray(d.discovered))return{ids:[],storageState:'recovered'};return{ids:normalize(d.discovered.filter(id=>typeof id==='string'&&known.has(id))),storageState:'ready'};}catch{return{ids:[],storageState:'recovered'}}
}
export const encodeExpandedGuide=ids=>JSON.stringify({version:2,discovered:normalize(ids)});
export const expandedGuideComplete=ids=>expandedGuideEntries.every(e=>ids.includes(e.id));
export function createExpandedGuideStore({getStorage,onChange=()=>{},onDiscover=()=>{}}){
 let ids=[],storageState='ready',loaded=false;
 const snapshot=()=>({ids:[...ids],storageState,loaded}),emit=()=>onChange(snapshot());
 const read=()=>{try{const storage=getStorage(),raw=storage.getItem(expandedGuideStorageKey);return raw===null?migrateLegacyGuide(storage.getItem(legacyKey)):decodeExpandedGuide(raw)}catch{return{ids:[],storageState:'unavailable'}}};
 function persist(force=false){if(storageState==='unsupported'&&!force)return;try{getStorage().setItem(expandedGuideStorageKey,encodeExpandedGuide(ids));storageState='ready'}catch{storageState='unavailable'}}
 function adopt(saved){ids=saved.ids;storageState=saved.storageState;loaded=true;if(saved.migrated)persist();}
 return{snapshot,load(){if(loaded)return;adopt(read());emit()},discover(id){if(!known.has(id))return false;if(!loaded)adopt(read());const fresh=read();if(fresh.storageState==='ready')ids=normalize([...ids,...fresh.ids]);storageState=fresh.storageState;if(ids.includes(id)){emit();return false}ids=normalize([...ids,id]);persist();emit();onDiscover(id,expandedGuideComplete(ids));return true},reset(){ids=[];loaded=true;persist(true);emit()},sync(){adopt(read());emit()}};
}
