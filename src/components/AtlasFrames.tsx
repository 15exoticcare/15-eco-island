import {useLayoutEffect,useRef} from 'react';

/** Keep decoded atlas images mounted; only change the source cell coordinates. */
export default function AtlasFrames({src,frame,cell,columns,width,height,blendMs=0}:{src:string;frame:number;cell:number;columns:number;width:number;height:number;blendMs?:number}){
 const last=useRef(frame),prior=useRef<SVGImageElement>(null),overlay=useRef<SVGGElement>(null),fade=useRef<Animation|null>(null);
 useLayoutEffect(()=>{
  fade.current?.cancel();
  if(last.current!==frame){
   prior.current?.setAttribute('x',String(-(last.current%columns)*cell));
   prior.current?.setAttribute('y',String(-Math.floor(last.current/columns)*cell));
   if(blendMs&&!matchMedia('(prefers-reduced-motion: reduce)').matches)
    fade.current=overlay.current?.animate([{opacity:1},{opacity:0}],{duration:blendMs,easing:'linear'})??null;
   last.current=frame;
  }
  return()=>fade.current?.cancel();
 },[frame,cell,columns,blendMs]);
 return <><image data-atlas-current="true" href={src} x={-(frame%columns)*cell} y={-Math.floor(frame/columns)*cell} width={width} height={height}/><g ref={overlay} data-atlas-prior="true" style={{opacity:0}}><image ref={prior} href={src} width={width} height={height}/></g></>;
}
