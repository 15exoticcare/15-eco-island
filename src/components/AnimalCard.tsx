import {animalProfiles} from '@/lib/animal-life.mjs';
import {islands} from '@/lib/islands';
export default function AnimalCard({id,onClose}:{id:string;onClose:()=>void}){
 const p=animalProfiles.find(p=>p.id===id);if(!p)return null;
 const island=islands.find(i=>i.id===p.island)!;
 return <aside className="rabbit-info animal-info" aria-label={`${p.name}小卡`}><button className="rabbit-card-close" onClick={onClose} aria-label="關閉動物小卡">×</button><div className="eyebrow">{island.name} · 遇見島上的朋友</div><h2>{p.name}</h2><span className="rabbit-personality">{p.careLabel}</span><p>{p.feature}</p><div className="rabbit-knowledge"><span>照護小知識</span><p>{p.fact}</p></div><small>保留一點安靜與距離，陪牠照自己的步調生活。</small></aside>;
}
