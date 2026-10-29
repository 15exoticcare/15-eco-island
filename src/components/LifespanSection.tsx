import {lifespans,lifespanPublicNotes,lifespanSources} from '@/lib/lifespans.mjs';
export default function LifespanSection({island}:{island:string}){
 const data=lifespans[island];if(!data)return null;
 return <details className="lifespan-section" data-lifespan={island}>
  <summary><span aria-hidden="true">♡</span><span>牠們能陪伴我們多久？<small className="lifespan-closed-hint">壽命小知識</small><small className="lifespan-open-hint">點一下收合</small></span><span className="lifespan-chevron" aria-hidden="true">＋</span></summary>
  <div className="lifespan-content"><p className="lifespan-scope">{data.scope}</p><dl>{data.rows.map(row=><div key={row.id??row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl><p>{data.description}</p>{lifespanPublicNotes[island]&&<p className="lifespan-note">{lifespanPublicNotes[island]}</p>}
   <details className="lifespan-references"><summary>參考來源與資料說明</summary><div className="lifespan-sources">
    {data.note&&<p>{data.note}</p>}
    {data.sources.map(id=><a key={id} href={lifespanSources[id].url} target="_blank" rel="noreferrer">{lifespanSources[id].name} ↗</a>)}
    <time dateTime={data.updatedAt}>資料核對：{data.updatedAt}（非來源發布日期）</time>
    <p>壽命參考仍會受到個體、遺傳、飲食、環境與醫療照護等因素影響。</p>
   </div></details>
  </div>
 </details>;
}
