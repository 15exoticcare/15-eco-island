import type {ReactNode} from 'react';
import {islands,type IslandId} from '@/lib/islands';
import {explorationVisitors} from '@/lib/exploration.mjs';
import type {PatrolState} from '@/lib/patrol.mjs';
import PatrolControls from './PatrolControls';

export type Panel = 'islands'|'island'|'rabbit'|'animal'|'visitor'|'guide'|'patrol'|'tools'|null;
export function NavIcon({kind}:{kind:'islands'|'guide'|'patrol'|'tools'}){
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind==='islands'?<><path d="m3 14 9-5 9 5-9 6-9-6Z"/><path d="M6 12V7l4-3 4 3v3M10 10V6m6 6V9l3-2"/></>:kind==='guide'?<><path d="M12 5C8 3 5 3 3 4v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-2-1-5-1-9 1Zm0 0v15M6 8h3m-3 4h3m6-4h3m-3 4h3"/></>:kind==='patrol'?<><path d="M7 18C1 14 6 9 11 12s9-1 6-6M5 18h4m8-14v4m-2-2h4"/><circle cx="7" cy="6" r="2"/><circle cx="17" cy="17" r="3"/></>:<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>}</svg>;
}
export function MobileNavigation({panel,onOpen}:{panel:Panel;onOpen:(panel:Panel)=>void}){
 return <nav className="mobile-bottom-nav" aria-label="手機主要導覽">{(['islands','guide','patrol'] as const).map((kind,n)=><button key={kind} data-mobile-nav={kind} aria-label={['島嶼','圖鑑','巡視'][n]} aria-expanded={panel===kind} aria-controls={kind==='guide'?'field-guide':'mobile-sheet'} onClick={()=>onOpen(panel===kind?null:kind)}><NavIcon kind={kind}/><span>{['島嶼','圖鑑','巡視'][n]}</span></button>)}</nav>;
}
export function MobilePanel({kind,state,caption,paused,onSelect,onVisit,onToggle,onMotion,onVisitor,onOverview}:{kind:Panel;state:PatrolState|null;caption:string|null;paused:boolean;onSelect:(id:IslandId)=>void;onVisit:(id:IslandId)=>void;onToggle:()=>void;onMotion:()=>void;onVisitor:(id:string)=>void;onOverview:()=>void}){
 const [title,description]=kind==='islands'?['選一座島，慢慢認識','十座浮島，都有自己的日常。']:kind==='patrol'?['跟著保母的腳步','巡視持續進行，不會移動你的鏡頭。']:['探索小工具','留一點安靜，發現地圖裡的細節。'];
 return <section className="mobile-panel-content" aria-label={title}><h2>{title}</h2><p>{description}</p>{kind==='islands'?<div className="mobile-island-list">{islands.map(i=><button key={i.id} data-mobile-island={i.id} onClick={()=>onSelect(i.id)}><span>{i.number}</span><strong>{i.name}</strong><b aria-hidden="true">↗</b></button>)}</div>:kind==='patrol'?<><PatrolControls state={state} caption={caption} onToggle={onToggle}/><h3>指定下一座島</h3><div className="mobile-patrol-list">{islands.map(i=><button key={i.id} data-mobile-visit={i.id} onClick={()=>onVisit(i.id)}>{i.name}<span aria-hidden="true">→</span></button>)}</div></>:<><div className="mobile-tool-options"><button onClick={onOverview}>返回世界全景 <span>⌖</span></button><button onClick={onMotion} aria-pressed={paused}>{paused?'播放環境微動畫':'暫停環境微動畫'} <span>{paused?'▷':'Ⅱ'}</span></button></div><h3>尋找周邊小訪客</h3><p>環境探索訪客，非住宿物種。</p><div className="mobile-visitor-list">{explorationVisitors.map(p=><button key={p.id} data-mobile-visitor={p.id} onClick={()=>onVisitor(p.id)}>{p.name}<small>{p.setting} ↗</small></button>)}</div><details className="mobile-help"><summary>地圖操作方式</summary><p>單指拖曳，雙指縮放。點選島嶼或動物閱讀小卡；卡片右上角 × 可關閉。鍵盤可用方向鍵、＋／−、Home 與 Escape。</p></details><a className="mobile-brand-link" href="https://15exoticanimalhotel.com.tw/price.html" target="_blank" rel="noreferrer">了解房型／價格 ↗</a><a className="mobile-brand-link" href={process.env.NEXT_PUBLIC_BOOKING_URL||'https://15exoticanimalhotel.com.tw/'} target="_blank" rel="noreferrer">{process.env.NEXT_PUBLIC_BOOKING_URL?'住宿預約':'聯絡壹伍／前往官網'} ↗</a></>}</section>;
}
export function MobileSheetHeading({children,onClose}:{children:ReactNode;onClose:()=>void}){
 return <div className="mobile-sheet-heading"><span>{children}</span><button aria-label="關閉目前面板" onClick={onClose}>×</button></div>;
}
