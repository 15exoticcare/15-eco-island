import {assetUrl} from '../lib/public-assets.mjs';
import { memo, type CSSProperties } from 'react';
import { creatures, type Creature } from '@/lib/creatures';
function Animal({ animal: a }: {
    animal: Creature;
}) {
    const style = { left: `${a.x}%`, top: `${a.y}%`, width: a.width, height: a.height, '--animal-period': `${a.period}s`, '--animal-delay': `${a.delay}s` } as CSSProperties;
    const url = assetUrl(`/assets/${a.asset}.webp`);
    return <div className={`creature creature-${a.island}`} data-creature={a.id} style={style} role="img" aria-label={`${a.name}：${a.action}`}>
  {a.island === 'hamster' && <><div className="private-zone" aria-hidden="true"/><span className="aviary-letter">{a.action.match(/[A-D]/)?.[0]}</span></>}
  {a.island === 'parrot' && <><svg className="aviary-back" viewBox="0 0 100 140" aria-hidden="true"><path d="M5 137V17Q50 -5 95 17V137Z" fill="#d7e8df18" stroke="#8d9c8377" strokeWidth="1.3"/><path d="M5 137L-8 127V9L5 17M95 17L83 9Q39 -11 -8 9M83 9V127L95 137" fill="#b5c7b51a" stroke="#8d9c8355" strokeWidth="1"/><path d="M5 93H95M5 42H95M25 8V137M50 3V137M75 8V137" fill="none" stroke="#b7c2a455" strokeWidth=".7"/></svg><span className="aviary-letter">{a.action.match(/[A-D]/)?.[0]}</span></>}
  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="creature-rig" aria-hidden="true">
   <defs><mask id={`${a.id}-body`}><rect width="100" height="100" fill="white"/>{a.joints.map((j, i) => <ellipse key={i} cx={j.cx} cy={j.cy} rx={j.rx - 1} ry={j.ry - 1} fill="black"/>)}</mask>{a.joints.map((j, i) => <clipPath key={i} id={`${a.id}-joint-${i}`}><ellipse cx={j.cx} cy={j.cy} rx={j.rx} ry={j.ry}/></clipPath>)}</defs>
   <image href={url} width="100" height="100" preserveAspectRatio="none" mask={`url(#${a.id}-body)`}/>
   {a.joints.map((j, i) => <g key={i} className={`joint joint-${j.motion}`} style={{ transformOrigin: `${j.originX}px ${j.originY}px` }}><image href={url} width="100" height="100" preserveAspectRatio="none" clipPath={`url(#${a.id}-joint-${i})`}/></g>)}
  </svg>
  {a.island === 'parrot' && <svg className="aviary-front" viewBox="0 0 100 140" aria-hidden="true"><path d="M5 137V17Q50 -5 95 17V137Z" fill="none" stroke="#a19d7d99" strokeWidth="1.2"/><path d="M5 137H95" stroke="#877557" strokeWidth="4"/></svg>}
  <span className="creature-caption">{a.name}<small>{a.action}</small></span>
 </div>;
}
export default memo(function Creatures({ island }: {
    island: string;
}) { return <>{creatures.filter(a => a.island === island).map(a => <Animal key={a.id} animal={a}/>)}{island === 'parrot' && <span className="habitat-note">A—D 獨立網室・分區照護</span>}{island === 'hamster' && <span className="habitat-note hamster-note">A—D 獨立生活區・不任意混養</span>}</>; });
