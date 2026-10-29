import {useMemo} from 'react';
import {islands,bridgeSpans,type IslandId} from '@/lib/islands';
import {placeLabels} from '@/lib/labels.mjs';
type Props={camera:{x:number;y:number;scale:number};viewport:{width:number;height:number};selected:IslandId|null;smooth:boolean;onSelect:(id:IslandId)=>void};
export default function IslandLabels({camera,viewport,selected,smooth,onSelect}:Props){
 const compact=viewport.width<850,rail=!!selected&&!compact;
 const labels=useMemo(()=>{
  if(compact||!viewport.width)return [];
  if(rail){const step=Math.min(42,(viewport.height-48)/10);return islands.map((i,n)=>({id:i.id,x:18,y:38+n*step,width:190,height:Math.min(36,step-5),anchorX:0,anchorY:0}));}
  const items=islands.map(i=>({id:i.id,x:camera.x+(i.x+i.label.x)*camera.scale,y:camera.y+(i.y+i.width*.31+i.label.y)*camera.scale,width:i.id==='main'?176:112}));
  const roads=Object.values(bridgeSpans).map(([a,b])=>({a:{x:camera.x+a.x*camera.scale,y:camera.y+(a.y-14)*camera.scale},b:{x:camera.x+b.x*camera.scale,y:camera.y+(b.y-14)*camera.scale},padding:22*camera.scale+3}));
  return placeLabels(items,viewport,[{x:0,y:0,width:290,height:218},{x:viewport.width-76,y:0,width:76,height:276}],roads);
 },[camera,viewport,compact,rail]);
 return <nav className={`island-label-layer ${compact?'compact':rail?'directory':'on-map'} ${smooth?'label-smooth':''}`} aria-label="十島名稱與導覽">
  {rail&&<span className="directory-heading">十島導覽 <small>點選切換島嶼</small></span>}
  {!compact&&!rail&&<svg className="label-connectors" width={viewport.width} height={viewport.height} aria-hidden="true">{labels.map(l=>Math.hypot(l.x+l.width/2-l.anchorX,l.y-l.anchorY)>20&&<path key={l.id} d={`M${l.anchorX},${l.anchorY}L${l.x+l.width/2},${l.y}`} />)}</svg>}
  {islands.map(i=>{const p=labels.find(l=>l.id===i.id);return <button key={i.id} data-island-label={i.id} className={`map-name ${selected===i.id?'active':''}`} aria-label={`${i.number} ${i.name}，聚焦島嶼`} aria-current={selected===i.id?'true':undefined} onClick={()=>onSelect(i.id)} style={compact?undefined:p?{left:p.x,top:p.y,width:p.width,height:p.height}: {visibility:'hidden'}}><span>{i.number}</span><strong>{i.name}</strong><b aria-hidden="true">↗</b></button>})}
 </nav>;
}
