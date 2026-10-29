import {forwardRef,memo,useImperativeHandle,useState} from 'react';
import {destinations} from '@/lib/islands';
import {assetUrl} from '../lib/public-assets.mjs';
import { caretakerClips } from '@/lib/caretaker';
import { gaitFrame, type Facing } from '@/lib/animation.mjs';
import type { Point } from '@/lib/islands';
export default function Caretaker({ position, direction, distance, walking, observing }: {
    position: Point;
    direction: Facing;
    distance: number;
    walking: boolean;
    observing: boolean;
}) {
    const clip = caretakerClips[direction], frame = walking ? gaitFrame(distance, clip.frames) : 0;
    return <div className={`caretaker caretaker-v2 ${walking ? 'is-walking' : observing ? 'is-observing' : 'is-idle'}`} data-testid="caretaker" data-frame={frame} data-facing={direction} data-state={walking ? 'walk' : observing ? 'observe' : 'idle'} style={{left:0,top:0,transform:`translate(${position.x}px,${position.y}px) translate(-50%,-100%)`}}>
  <div className="foot-shadow"/>
  <div className="actor-preload" aria-hidden="true">{['front', 'side', 'back'].map(d => <img key={d} src={assetUrl(`/assets/animation-v2/walk-${d}.webp`)} alt=""/>)}<img src={assetUrl("/assets/animation-v2/observe.webp")} alt=""/></div>
  {observing && !walking ? <svg className="actor-sprite observing-sprite" viewBox="0 0 1024 1515" preserveAspectRatio="xMidYMax meet" role="img" aria-label="女性保母拿平板觀察紀錄"><image href={assetUrl("/assets/animation-v2/observe.webp")} width="1024" height="1536"/><image href={assetUrl("/assets/logo-original.jpg")} x="490" y="383" width="83" height="83"/><g className="tablet-indicator"><circle cx="660" cy="439" r="6" fill="#c8dbb8"/></g></svg> :
            <svg className="actor-sprite" viewBox="0 0 192 252" preserveAspectRatio="xMidYMax meet" role="img" aria-label={`女性保母${walking ? '逐格行走' : '等待'}，${direction === 'back' ? '背面' : direction === 'front' ? '正面' : '側面'}`}>
   <defs><clipPath id="actor-cell"><rect width="192" height="252"/></clipPath></defs>
   <g clipPath="url(#actor-cell)"><g transform={direction === 'left' ? 'translate(192 0) scale(-1 1)' : undefined}>
    <image href={assetUrl(`/assets/animation-v2/${clip.file}.webp`)} x={-(frame % 4) * 192} y={-Math.floor(frame / 4) * 256} width="768" height="512"/>
   </g>{clip.logo && <image href={assetUrl("/assets/logo-original.jpg")} {...clip.logo} x={direction === 'left' ? 192 - clip.logo.x - clip.logo.width : clip.logo.x}/>}</g>
  </svg>}
  <span className="caretaker-marker">{walking ? '巡視中' : observing ? '觀察紀錄中' : '壹伍保母'}</span>
 </div>;
}

type Visual={position:Point;direction:Facing;distance:number;walking:boolean;observing:boolean};
export type CaretakerHandle={update:(visual:Visual)=>void};
export const LiveCaretaker=memo(forwardRef<CaretakerHandle>(function LiveCaretaker(_,ref){
 const [visual,setVisual]=useState<Visual>({position:destinations.main,direction:'front',distance:0,walking:false,observing:false});
 useImperativeHandle(ref,()=>({update:setVisual}),[]);
 return <Caretaker {...visual}/>;
}));
