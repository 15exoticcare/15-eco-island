import {useEffect,useRef} from 'react';
import {explorationReviewed,explorationVisitors} from '@/lib/exploration.mjs';

export default function ExplorationCard({id,onClose}:{id:string;onClose:()=>void}){
 const p=explorationVisitors.find(p=>p.id===id)!,heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{heading.current?.focus({preventScroll:true})},[id]);
 return <aside id="exploration-card" className="exploration-card" aria-labelledby="exploration-title">
  <button className="exploration-close" onClick={onClose} aria-label="關閉生態小知識">×</button>
  <span className="eyebrow">林間偶遇 · {p.setting}</span>
  <h2 id="exploration-title" ref={heading} tabIndex={-1}>{p.name}<span>周邊生態訪客</span></h2>
  <p>{p.fact}</p>
  <details><summary>知識來源</summary><a href={p.source.url} target="_blank" rel="noreferrer">{p.source.name} ↗</a><time dateTime={explorationReviewed}>核對：{explorationReviewed}</time></details>
  <small>這是周邊生態探索彩蛋，不代表旅宿提供此物種住宿。</small>
 </aside>;
}
