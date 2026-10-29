import {rabbitProfiles,type RabbitId} from '@/lib/rabbit-life.mjs';
export default function RabbitCard({id,onClose}:{id:RabbitId;onClose:()=>void}){
 const p=rabbitProfiles.find(p=>p.id===id)!;
 return <aside className="rabbit-info" aria-label={`${p.name}小卡`}>
  <button className="rabbit-card-close" onClick={onClose} aria-label="關閉兔子小卡">×</button>
  <div className="eyebrow">CLOVER MEADOW · 遇見長耳朵朋友</div><h2>{p.name}</h2><span className="rabbit-personality">{p.personality}</span>
  <p>{p.feature}</p><div className="rabbit-knowledge"><span>照護小知識</span><p>{p.fact}</p></div><small>輕輕看看牠，陪牠照自己的步調生活。</small>
 </aside>;
}
