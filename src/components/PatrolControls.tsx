import {memo} from 'react';
import {islands} from '@/lib/islands';
import {describePatrol,type PatrolState} from '@/lib/patrol.mjs';
const names=Object.fromEntries(islands.map(i=>[i.id,i.name]));
export default memo(function PatrolControls({state,onToggle,caption}:{state:PatrolState|null;onToggle:()=>void;caption?:string|null}){
 const view=state?describePatrol(state,names):{status:'自動巡視中',location:names.main,next:'兔兔區',detail:'準備從中央旅宿出發'};
 return <section className="patrol-controls" aria-label="保母巡島控制">
  <div className="patrol-summary" role="status" aria-live="polite" aria-atomic="true">
   <div className="patrol-mode"><span className={state?.paused?'paused-dot':'patrol-dot'}/><strong>{view.status}</strong><small>{state?.phase==='wait'&&!state.paused&&state.location!=='main'&&caption?caption:view.detail}</small><span className="patrol-simulation">莊園模擬照護・非即時紀錄</span></div>
   <dl><div><dt>目前位置</dt><dd>{view.location}</dd></div><div><dt>下一站</dt><dd>{view.next}</dd></div></dl>
  </div>
  <button className="patrol-toggle" aria-pressed={state?.paused??false} onClick={onToggle}>{state?.paused?'繼續巡視':'暫停巡視'}</button>
 </section>;
});


