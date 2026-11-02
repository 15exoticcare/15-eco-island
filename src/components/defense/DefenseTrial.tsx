'use client';
import {useState,useRef,useMemo}from'react';import dynamic from'next/dynamic';
import Experience,{type MapExtension}from'../Experience';import {getDefenseLayout}from'@/lib/defense/layouts';
const Game=dynamic(()=>import('./DefenseGame'),{ssr:false,loading:()=> <div className="td-loading" role="status">正在整理花徑與防衛塔…</div>});
export type Focus=(x:number,y:number,width?:number,height?:number)=>void;
export default function DefenseTrial({edition=8}:{edition?:8|9}){const layout=getDefenseLayout(edition);const[mode,setMode]=useState(false),[focus,setFocus]=useState<MapExtension['focus']>(),serial=useRef(0);
 const onFocus:Focus=(x,y,width=1600,height=1100)=>setFocus({serial:++serial.current,x,y,width,height});
 const scene=useMemo(()=>mode?<Game edition={edition} onFocus={onFocus} onExplore={()=>setMode(false)}/>:null,[mode,edition]);
 const extension=mode?{world:layout.world,scene,focus}:undefined;
 return <div className={`chapter8-shell ${edition===9?'chapter9-shell':''} ${mode?'defense-active':''}`}><Experience artPreview artExpansion artFinal eggPreview extension={extension}/><nav className="td-mode-switch" aria-label="莊園遊玩模式"><button aria-pressed={!mode} onClick={()=>setMode(false)}>自由探索</button><button aria-pressed={mode} onClick={()=>{setFocus(undefined);setMode(true)}}>莊園防衛戰<span>試玩</span></button></nav><span className="td-trial-label">第 {edition} 階段・本機測試版</span><div id="td-hud-root"/></div>
}
