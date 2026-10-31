'use client';
import {forwardRef,memo,useEffect,useImperativeHandle,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {createGuideStore as createLegacyStore,guideComplete as legacyComplete,guideEntries as legacyEntries,guideStorageKey as legacyStorageKey,type GuideEntry,type GuideState} from '@/lib/field-guide.mjs';
import {explorationReviewed} from '@/lib/exploration.mjs';
import LifespanSection from './LifespanSection';
import {useArtExpansion} from './ArtExpansion';
import {useArtFinal} from './ArtFinal';
import {useArtExploration} from './ArtExploration';
import {expandedGuideEntries,expandedGuideComplete,expandedGuideStorageKey,createExpandedGuideStore}from'@/lib/field-guide-stage5.mjs';
import {eggReviewed}from'@/lib/exploration-stage5.mjs';
import {useDiorama} from './ArtDirection';
import {assetUrl} from '@/lib/public-assets.mjs';

export type FieldGuideHandle={discover:(id:string)=>void;open:()=>void;close:()=>void};
type Props={onNavigate:(id:string,group:'hotel'|'visitor')=>void;open?:boolean;onOpenChange?:(open:boolean)=>void;showReward?:boolean};

function Portrait({entry,locked=false}:{entry:GuideEntry;locked?:boolean}){
 const egg=useArtExploration(),final=useArtFinal(),expansion=useArtExpansion(),diorama=useDiorama(),finalPortrait=final&&['hamster','hedgehog','chinchilla','glider'].includes(entry.id);
 if(egg&&entry.group==='visitor')return <span className={`guide-portrait ${locked?'guide-silhouette':''}`} aria-hidden="true"><svg viewBox="0 0 192 192" overflow="hidden"><image href={entry.image} width="768" height="768"/></svg></span>;
 if(finalPortrait)return <span className={`guide-portrait ${locked?'guide-silhouette':''}`} aria-hidden="true"><svg viewBox="0 0 192 192" overflow="hidden"><image href={assetUrl(`/assets/diorama-stage4/${entry.id}-1.webp`)} width="768" height="768"/></svg></span>;
 const expansionPortrait=expansion?({guinea:'guinea-1',ferret:'ferret-1',meerkat:'meerkat-1'} as Record<string,string>)[entry.id]:undefined;
 const newPortrait=diorama&&(entry.id==='rabbit'||entry.id==='parrot');
 if(expansionPortrait)return <span className={`guide-portrait ${locked?'guide-silhouette':''}`} aria-hidden="true"><svg viewBox="0 0 192 192" overflow="hidden"><image href={assetUrl(`/assets/diorama-stage3/${expansionPortrait}.webp`)} width="768" height="768"/></svg></span>;
 if(newPortrait){const cell=entry.id==='rabbit'?256:192;return <span className={`guide-portrait ${locked?'guide-silhouette':''}`} aria-hidden="true"><svg viewBox={`0 0 ${cell} ${cell}`} overflow="hidden"><image href={assetUrl(`/assets/diorama-v1/${entry.id==='rabbit'?'white':'sun'}.webp`)} width={cell*4} height={cell*(entry.id==='rabbit'?6:4)}/></svg></span>}
 return <span className={`guide-portrait ${locked?'guide-silhouette':''}`} aria-hidden="true">
  {entry.atlas?<svg viewBox="0 0 256 256"><svg width="256" height="256" overflow="hidden"><image href={entry.image} width="512" height="256"/></svg></svg>:<img src={entry.image} alt="" draggable={false}/>}
 </span>;
}
function Keepsake({total}:{total:number}){return <div className="guide-keepsake" data-guide-complete="true">
 <span className="guide-seal" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 38C7 28 8 12 24 8c16 4 17 20 0 30Z"/><path d="M24 34V16m0 10-7-6m7 10 7-9"/></svg></span>
 <div><span className="eyebrow">{total} 種相遇・一份溫柔收藏</span><h3>壹伍莊園探索家</h3><p>恭喜你！已經認識壹伍特寵小知識莊園的每一位小夥伴 ♡</p><small>網站內的探索紀念，非住宿優惠、折價券或實體獎勵。</small></div>
 </div>}

export default memo(forwardRef<FieldGuideHandle,Props>(function FieldGuide({onNavigate,open:controlledOpen,onOpenChange,showReward=true},ref){
 const expanded=useArtExploration(),guideEntries=expanded?expandedGuideEntries:legacyEntries,guideComplete=expanded?expandedGuideComplete:legacyComplete,guideStorageKey=expanded?expandedGuideStorageKey:legacyStorageKey,createGuideStore=expanded?createExpandedGuideStore:createLegacyStore,total=guideEntries.length,reviewed=expanded?eggReviewed:explorationReviewed;
 const [view,setView]=useState<GuideState>({ids:[],loaded:false,storageState:'ready'});
 const [mounted,setMounted]=useState(false),[internalOpen,setInternalOpen]=useState(false),[detail,setDetail]=useState<string|null>(null),[confirming,setConfirming]=useState(false);
 const [toast,setToast]=useState<{id:string;serial:number}|null>(null),[reward,setReward]=useState(false);
 const trigger=useRef<HTMLButtonElement>(null),closeButton=useRef<HTMLButtonElement>(null),cancelButton=useRef<HTMLButtonElement>(null),resetButton=useRef<HTMLButtonElement>(null),body=useRef<HTMLDivElement>(null),detailHeading=useRef<HTMLHeadingElement>(null);
 const open=controlledOpen??internalOpen;
 function setOpen(value:boolean){if(onOpenChange)onOpenChange(value);else setInternalOpen(value);}
 function show(){setDetail(null);setConfirming(false);setOpen(true);setReward(false);}
 const serial=useRef(0),store=useRef<ReturnType<typeof createGuideStore>|null>(null);
 if(!store.current)store.current=createGuideStore({getStorage:()=>window.localStorage,onChange:next=>setView(previous=>previous.loaded===next.loaded&&previous.storageState===next.storageState&&previous.ids.join(',')===next.ids.join(',')?previous:next),onDiscover:(id,complete)=>{setToast({id,serial:++serial.current});if(complete)setReward(true);}});
 useImperativeHandle(ref,()=>({discover:id=>{store.current?.discover(id)},open:show,close:()=>close(false)}),[onOpenChange]);
 useEffect(()=>{setMounted(true);store.current?.load();const sync=(event:StorageEvent)=>{if(event.key===guideStorageKey||event.key===null)store.current?.sync();};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync)},[]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(null),4500);return()=>clearTimeout(timer)},[toast]);
 function close(restoreFocus=true){setOpen(false);setConfirming(false);setDetail(null);if(restoreFocus)requestAnimationFrame(()=>{const mobile=matchMedia('(max-width:849px), (max-height:500px) and (pointer:coarse)').matches;const target=mobile?document.querySelector<HTMLButtonElement>('[data-mobile-nav="guide"]'):trigger.current;target?.focus({preventScroll:true})});}
 useEffect(()=>{if(open)closeButton.current?.focus({preventScroll:true})},[open]);
 useEffect(()=>{if(!open)return;const escape=(e:KeyboardEvent)=>{if(e.key!=='Escape')return;e.preventDefault();e.stopPropagation();if(confirming){setConfirming(false);requestAnimationFrame(()=>resetButton.current?.focus({preventScroll:true}));}else close();};document.addEventListener('keydown',escape,true);return()=>document.removeEventListener('keydown',escape,true)},[open,confirming]);
 useEffect(()=>{if(!reward||open)return;const dismiss=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();setReward(false);}};document.addEventListener('keydown',dismiss,true);return()=>document.removeEventListener('keydown',dismiss,true)},[reward,open]);
 useEffect(()=>{if(body.current){body.current.scrollTop=0;const sheet=body.current.closest('.field-guide');if(sheet)sheet.scrollTop=0;}if(detail)detailHeading.current?.focus({preventScroll:true})},[detail]);
 useEffect(()=>{if(confirming)cancelButton.current?.focus({preventScroll:true})},[confirming]);
 const count=view.ids.length,complete=guideComplete(view.ids),entry=guideEntries.find(e=>e.id===detail),newFriend=guideEntries.find(e=>e.id===toast?.id);
 const storageNotice=view.storageState==='ready'?null:view.storageState==='recovered'?'先前的探索資料無法讀取，這次會從新的紀錄開始。':'瀏覽器目前無法保存新進度，本次變更可能在重新整理後消失。';
 return <>
  <button ref={trigger} className="field-guide-entry" aria-label="探索圖鑑" aria-expanded={open} aria-controls="field-guide" onClick={()=>{if(open)close();else show();}}>
   <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1Zm0 0v15M5 8c2-.5 3 0 4 1m-4 3c2-.5 3 0 4 1m6-4c1-1 2-1.5 4-1m-4 5c1-1 2-1.5 4-1"/></svg>
   <span><span className="guide-entry-word">探索圖鑑</span><small>{count}／{total}</small></span>
  </button>
  {mounted&&createPortal(<>
   <div className="guide-toast" role="status" aria-live="polite" aria-atomic="true">{newFriend&&<span key={toast?.serial}>發現新朋友！{newFriend.name}圖鑑已解鎖{complete?`・${total} 種相遇，探索紀念卡已收藏`:''}</span>}</div>
   {reward&&!open&&showReward&&<section className="guide-reward-floating" aria-label="壹伍莊園探索家紀念卡"><button aria-label="收好探索紀念卡" onClick={()=>setReward(false)}>×</button><Keepsake total={total}/></section>}
   {open&&<section id="field-guide" className="field-guide" role="dialog" aria-modal="false" aria-labelledby="guide-title" data-guide-count={count}>
    <header className="guide-header"><div><span className="eyebrow">YIWU · FIELD NOTES</span><h2 id="guide-title">動物探索圖鑑</h2></div><button ref={closeButton} className="guide-close" aria-label="收合探索圖鑑，返回地圖" onClick={()=>close()}>×</button>
     <p className="guide-progress-copy">已發現 <strong>{count}／{total}</strong> 種莊園小夥伴</p><progress aria-label="探索完成進度" value={count} max={total}/>
    </header>
    <div className="guide-body" ref={body}>
     {entry&&view.ids.includes(entry.id)?<article className="guide-detail" data-guide-detail={entry.id}>
      <button className="guide-back" onClick={()=>{const id=entry.id;setDetail(null);requestAnimationFrame(()=>document.querySelector<HTMLButtonElement>(`[data-guide-entry="${id}"]`)?.focus({preventScroll:true}));}}>← 返回圖鑑</button>
      <Portrait entry={entry}/><span className="guide-category">{entry.group==='hotel'?'壹伍住宿物種':expanded?'彩蛋探索':'環境探索訪客・非住宿物種'}</span>
      <h3 ref={detailHeading} tabIndex={-1}>{entry.name}</h3><p>{entry.description}</p><ul>{entry.facts.map(fact=><li key={fact}>{fact}</li>)}</ul>
      {entry.lifespanKey&&<LifespanSection key={entry.id} island={entry.lifespanKey}/>}
      {entry.source&&<details className="guide-natural-source"><summary>小知識參考來源</summary><a href={entry.source.url} target="_blank" rel="noreferrer">{entry.source.name} ↗</a><time dateTime={reviewed}>資料核對：{reviewed}</time></details>}
      <button className="guide-go" onClick={()=>{close(false);onNavigate(entry.id,entry.group);}}>{entry.group==='hotel'?`前往${entry.place}`:`回到${entry.place}`}</button>
      {!expanded&&entry.group==='visitor'&&<p className="guide-service-note">這位周邊生態訪客不代表壹伍提供此物種住宿服務。</p>}
     </article>:<>
      {complete&&<Keepsake total={total}/>}
      <p className="guide-intro">在地圖上輕點小動物，讀一則日常，收藏一次相遇。</p>
      {(['hotel','visitor'] as const).map(group=><section className="guide-group" key={group} aria-label={group==='hotel'?'壹伍住宿物種':expanded?'彩蛋探索':'環境探索訪客'}><div className="guide-group-heading"><h3>{group==='hotel'?'壹伍住宿物種':expanded?'彩蛋探索':'環境探索訪客'}</h3><span>{view.ids.filter(id=>guideEntries.find(e=>e.id===id)?.group===group).length}／{guideEntries.filter(e=>e.group===group).length}</span></div>
       <p>{group==='hotel'?'九個區域，九種專屬的照顧。':expanded?'七個探索區，七種不同的相遇。':'島外偶遇的小訪客，不屬於旅宿住宿服務。'}</p>
       <div className="guide-grid">{guideEntries.filter(e=>e.group===group).map(e=>{const unlocked=view.ids.includes(e.id);return <button key={e.id} type="button" className={`guide-tile ${unlocked?'discovered':'undiscovered'}`} data-guide-entry={e.id} data-discovered={unlocked} disabled={!unlocked} aria-label={`${e.name}，${unlocked?'已發現，查看圖鑑':'尚未發現，'+e.hint}`} onClick={()=>setDetail(e.id)}><Portrait entry={e} locked={!unlocked}/><span className="guide-tile-name">{e.name}</span><span className="guide-tile-status">{unlocked?'已發現・翻開看看':'尚未發現'}</span><small>{unlocked?e.place:e.hint}</small></button>})}</div>
      </section>)}
     </>}
    </div>
    <footer className="guide-footer">
     {storageNotice&&<p className="guide-storage-notice" role="status">{storageNotice}</p>}
     <p>進度只保存在此瀏覽器，不蒐集個資。無痕模式、清除網站資料或更換裝置，紀錄可能不會保留或同步。</p>
     {confirming?<div className="guide-reset-confirm" role="alertdialog" aria-modal="false" aria-labelledby="guide-reset-title"><strong id="guide-reset-title">要重新開始探索嗎？</strong><span>將清空這個瀏覽器已收藏的 {count} 種圖鑑。</span><div><button ref={cancelButton} onClick={()=>{setConfirming(false);requestAnimationFrame(()=>resetButton.current?.focus())}}>保留紀錄</button><button className="guide-reset-yes" onClick={()=>{store.current?.reset();setConfirming(false);setDetail(null);setToast(null);setReward(false);requestAnimationFrame(()=>resetButton.current?.focus())}}>確認重置探索紀錄</button></div></div>:<button className="guide-reset" ref={resetButton} onClick={()=>setConfirming(true)}>重置探索紀錄</button>}
    </footer>
   </section>}
  </>,document.body)}
 </>;
}));
