import AtlasFrames from './AtlasFrames';
import {useArtExpansion} from './ArtExpansion';
import {useArtFinal} from './ArtFinal';
import {useDiorama} from './ArtDirection';
import {assetUrl} from '../lib/public-assets.mjs';
import { memo, useEffect, useRef, useState, type RefObject } from 'react';
import { islands } from '@/lib/islands';
import { habitats, type Zone } from '@/lib/habitats.mjs';
import { createLifeLoop } from '@/lib/life-loop.mjs';
import { animalProfiles, animalActions, createAnimalLife, type AnimalLife as Life, type AnimalView, type AnimalProfile } from '@/lib/animal-life.mjs';
export function AnimalSprite({ profile: p, resident: r }: {
    profile: AnimalProfile;
    resident: AnimalView;
}) {
    const diorama=useDiorama()&&p.island==='parrot',expansion=useArtExpansion()&&['guinea','ferret','meerkat'].includes(p.island),final=useArtFinal()&&['hamster','hedgehog','chinchilla','glider'].includes(p.island);
    if (!p.atlas.available)
        return <img className="animal-fallback" src={assetUrl(`/assets/${p.asset}.webp`)} alt="" draggable={false}/>;
    const blend = ['rest', 'observe', 'care'].includes(r.state);
    const bounds = animalBounds(p, r);
    return <svg className="animal-life-sprite" viewBox={bounds.join(' ')} aria-hidden="true"><defs><clipPath id={`animal-cell-${r.id}`}><rect width="192" height="192"/></clipPath></defs><g transform={r.facing === 'right' ? 'translate(192 0) scale(-1 1)' : undefined} clipPath={`url(#animal-cell-${r.id})`}><AtlasFrames src={assetUrl(`/assets/${final?'diorama-stage4':expansion?'diorama-stage3':diorama?'diorama-v1':'animal-life'}/${r.id}.webp`)} frame={r.frame} cell={192} columns={4} width={768} height={768} blendMs={blend?150:0}/></g></svg>;
}
const fixedBounds=new Map<string,number[]>();
function animalBounds(p: AnimalProfile, r: AnimalView) { let b=fixedBounds.get(p.id);if(!b){const frames=p.atlas.bounds??[[0,0,192,192]],x=Math.min(...frames.map(v=>v[0])),y=Math.min(...frames.map(v=>v[1]));b=[x,y,Math.max(...frames.map(v=>v[0]+v[2]))-x,Math.max(...frames.map(v=>v[1]+v[3]))-y];fixedBounds.set(p.id,b);} return [r.facing === 'right' ? 192 - b[0] - b[2] : b[0], b[1], b[2], b[3]]; }
const Resident = memo(function Resident({ r, p, width, height, onSelect }: {
    r: AnimalView;
    p: AnimalProfile;
    width: number;
    height: number;
    onSelect: (id: string) => void;
}) {
    const pointer = useRef({ x: 0, y: 0, moved: false }), anchor = p.atlas.anchor, b = animalBounds(p, r), ax = (anchor[0] - b[0]) / b[2] * 100, ay = (anchor[1] - b[1]) / b[3] * 100;
    return <button type="button" className="living-animal" data-animal={r.id} data-state={r.state} data-reaction={r.reaction?.label} data-frame={r.frame} data-x={r.position.x.toFixed(2)} data-y={r.position.y.toFixed(2)} aria-label={`認識${p.name}`} onPointerDown={e => { pointer.current = { x: e.clientX, y: e.clientY, moved: false }; }} onPointerMove={e => { if (Math.hypot(e.clientX - pointer.current.x, e.clientY - pointer.current.y) > 5)
        pointer.current.moved = true; }} onClick={e => { e.stopPropagation(); if (e.detail === 0 || !pointer.current.moved)
        onSelect(r.id); }} style={{ left: `${r.position.x / 10}%`, top: `${r.position.y / height * 100}%`, width: `${p.atlas.displaySize / width * 100 * b[2] / 192}%`, aspectRatio: `${b[2]}/${b[3]}`, transform: `translate(-${ax}%,-${ay}%)`, zIndex: Math.round(r.position.y) }}>
  {habitats[r.island].kind === 'ground' && <span className="animal-contact-shadow" aria-hidden="true" style={{ top: `${ay}%`, left: `${ax - 18}%` }}/>}
  <AnimalSprite profile={p} resident={r}/><span className="animal-hover-name">{p.name}<small>{r.reaction?.label ?? (r.state === 'care' ? p.careLabel : animalActions[r.state])}</small></span>
 </button>;
}, (a, b) => a.r.state === b.r.state && a.r.frame === b.r.frame && a.r.reaction?.label === b.r.reaction?.label && a.r.facing === b.r.facing && a.r.position.x === b.r.position.x && a.r.position.y === b.r.position.y && a.onSelect === b.onSelect);
function Support({ zone: z, height, kind, id }: {
    zone: Zone;
    height: number;
    kind: string;
    id: string;
}) {
    if (!z.support)
        return null;
    const [a, b] = z.support, y = Math.min(a.y, b.y), floor = z.floor ?? Math.max(a.y, b.y), path = `M${a.x} ${a.y}L${b.x} ${b.y}`;
    return <svg className="animal-support" data-support={id} viewBox={`0 0 1000 ${height}`} aria-hidden="true" style={{ zIndex: Math.floor(y - 1) }}>
  {kind === 'perch' && <g className="private-aviary"><path d={`M${a.x - 10} ${floor}V${y - 230}Q${(a.x + b.x) / 2} ${y - 275} ${b.x + 10} ${y - 230}V${floor}Z`} fill="#d9e7dc18" stroke="#9daa8b" strokeWidth="1.8"/>{[0, 1, 2, 3, 4].map(n => <path key={n} d={`M${a.x + (b.x - a.x) * n / 4} ${y - 235}V${floor}`} stroke="#b7c5a383" strokeWidth="1"/>)}<path d={`M${a.x - 10} ${floor}H${b.x + 10}`} stroke="#907652" strokeWidth="8"/><path d={`M${a.x + 8} ${a.y}V${floor}M${b.x - 8} ${b.y}V${floor}`} stroke="#8c7859" strokeWidth="6"/><text x={a.x} y={floor + 18} fill="#7c8b6b" fontSize="14">{z.label} · 獨立棲區</text></g>}
  <path d={path} stroke="#4f422f44" strokeWidth="13" transform="translate(1 4)" strokeLinecap="round"/><path d={path} stroke="#81633f" strokeWidth="10" strokeLinecap="round"/><path d={path} stroke="#b39160" strokeWidth="6" strokeLinecap="round"/><path d={path} stroke="#d6b680" strokeWidth="1.2" transform="translate(0 -2)"/>
  <path d={`M${a.x + (b.x - a.x) * .36} ${a.y + (b.y - a.y) * .36 - 3}l-3 6m${(b.x - a.x) * .28 - 3} ${(b.y - a.y) * .28 - 6}l2 6`} stroke="#6c5335" strokeWidth="1.5" fill="none"/>
 </svg>;
}
export default memo(function AnimalLife({ paused, onSelect, controllerRef }: {
    paused: boolean;
    onSelect: (id: string) => void;
    controllerRef: RefObject<Life | null>;
}) {
    const [residents, setResidents] = useState<AnimalView[]>(() => createAnimalLife().snapshot());
    useEffect(() => {
        const life = createAnimalLife({ onUpdate: next => setResidents(previous => next.some((r, n) => r.state !== previous[n].state || r.frame !== previous[n].frame || r.reaction?.label !== previous[n].reaction?.label || r.facing !== previous[n].facing || r.position.x !== previous[n].position.x || r.position.y !== previous[n].position.y) ? next : previous) });
        controllerRef.current = life;
        const loop = createLifeLoop(life, { requestFrame: requestAnimationFrame, cancelFrame: cancelAnimationFrame }), motion = matchMedia('(prefers-reduced-motion: reduce)');
        const visibility = () => loop.setVisible(!document.hidden), reduce = () => life.setReduced(motion.matches);
        reduce();
        motion.addEventListener('change', reduce);
        document.addEventListener('visibilitychange', visibility);
        visibility();
        return () => { loop.dispose(); motion.removeEventListener('change', reduce); document.removeEventListener('visibilitychange', visibility); controllerRef.current = null; };
    }, [controllerRef]);
    useEffect(() => { controllerRef.current?.setPaused(paused); }, [paused, controllerRef]);
    return <>{islands.filter(i => habitats[i.id]).map(i => {
            const h = habitats[i.id];
            return <div key={i.id} className={`animal-habitat animal-habitat-${i.id}`} data-habitat={i.id} style={{ left: i.x - i.width / 2, top: i.y - i.width * .64, width: i.width, height: i.width * h.height / 1000 }}>
  {Object.entries(h.zones).map(([id, zone]) => <Support key={id} id={id} zone={zone} height={h.height} kind={h.kind}/>)}
  {residents.filter(r => r.island === i.id).map(r => <Resident key={r.id} r={r} p={animalProfiles.find(p => p.id === r.id)!} width={i.width} height={h.height} onSelect={onSelect}/>)}
  {h.occluders.map((o, n) => <img key={n} className="animal-scenery-front" src={assetUrl(`/assets/${i.art}.webp`)} style={{ zIndex: o.depth, clipPath: `polygon(${o.polygon.map(([x, y]) => `${x / 10}% ${y / h.height * 100}%`).join(',')})` }} alt="" aria-hidden="true" draggable={false}/>)}
  {i.id === 'hamster' && Object.entries(h.zones).map(([id, z]) => <span key={id} className="private-room-mark" style={{ left: `${z.nodes[0].x / 10}%`, top: `${355 / h.height * 100}%` }}>{z.label}</span>)}
  {(i.id === 'hamster' || i.id === 'parrot') && <span className="animal-habitat-note">{h.note}</span>}
 </div>;
        })}</>;
});
