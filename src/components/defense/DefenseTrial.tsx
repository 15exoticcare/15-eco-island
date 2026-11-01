'use client';
import {useState,useRef,useMemo}from'react';import dynamic from'next/dynamic';
import Experience,{type MapExtension}from'../Experience';import {defenseWorld}from'@/lib/defense/world';
const Game=dynamic(()=>import('./DefenseGame'),{ssr:false,loading:()=> <div className="td-loading" role="status">正在整理花徑與防衛塔…</div>});
export type Focus=(x:number,y:number,width?:number,height?:number)=>void;
export default function DefenseTrial(){const[mode,setMode]=useState(false),[focus,setFocus]=useState<MapExtension['focus']>(),serial=useRef(0);
 const onFocus:Focus=(x,y,width=1600,height=1100)=>setFocus({serial:++serial.current,x,y,width,height});
 const scene=useMemo(()=>mode?<Game onFocus={onFocus} onExplore={()=>setMode(false)}/>:null,[mode]);
 const extension=mode?{world:defenseWorld,scene,focus}:undefined;
 return <div className={`chapter8-shell ${mode?'defense-active':''}`}><Experience artPreview artExpansion artFinal eggPreview extension={extension}/><nav className="td-mode-switch" aria-label="莊園遊玩模式"><button aria-pressed={!mode} onClick={()=>setMode(false)}>自由探索</button><button aria-pressed={mode} onClick={()=>{setFocus(undefined);setMode(true)}}>莊園防衛戰<span>試玩</span></button></nav><span className="td-trial-label">第 8 階段・本機測試版</span><div id="td-hud-root"/></div>
}
