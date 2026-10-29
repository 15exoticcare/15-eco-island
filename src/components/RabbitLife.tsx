import {assetUrl} from '../lib/public-assets.mjs';
import { memo, useEffect, useRef, useState } from 'react';
import { createRabbitLife, createRabbitLoop, rabbitActions, rabbitProfiles, type RabbitId, type RabbitLife as Life, type RabbitView } from '@/lib/rabbit-life.mjs';
export function RabbitSprite({ rabbit: r }: {
    rabbit: RabbitView;
}) {
    const [previous, setPrevious] = useState(r.frame), last = useRef(r.frame);
    useEffect(() => { if (last.current !== r.frame) {
        setPrevious(last.current);
        last.current = r.frame;
    } }, [r.frame]);
    const image = (frame: number) => <image href={assetUrl(`/assets/rabbit-life/${r.id}.webp`)} x={-(frame % 4) * 256} y={-Math.floor(frame / 4) * 256} width="1024" height="1536"/>;
    return <svg className="rabbit-sprite" viewBox="0 0 256 256" aria-hidden="true" style={{ transform: r.facing === 'right' ? 'scaleX(-1)' : undefined }}>
  <defs><clipPath id={`rabbit-cell-${r.id}`}><rect width="256" height="256"/></clipPath></defs>
  <g clipPath={`url(#rabbit-cell-${r.id})`}>{r.blend > 0 && previous !== r.frame && <g key={`old-${r.frame}`} className="rabbit-old-pose">{image(previous)}</g>}<g key={r.frame} className={r.blend > 0 ? 'rabbit-new-pose' : undefined}>{image(r.frame)}</g></g>
 </svg>;
}
function Rabbit({ r, onSelect }: {
    r: RabbitView;
    onSelect: (id: RabbitId) => void;
}) {
    const profile = rabbitProfiles.find(p => p.id === r.id)!;
    const pointer = useRef({ x: 0, y: 0, moved: false });
    return <button type="button" className="living-rabbit" data-rabbit={r.id} data-state={r.state} data-reaction={r.reaction?.label} data-frame={r.frame} data-x={r.position.x.toFixed(2)} data-y={r.position.y.toFixed(2)} aria-label={`認識${profile.name}`} onPointerDown={e => { pointer.current = { x: e.clientX, y: e.clientY, moved: false }; }} onPointerMove={e => { if (Math.hypot(e.clientX - pointer.current.x, e.clientY - pointer.current.y) > 5)
        pointer.current.moved = true; }} onClick={e => { e.stopPropagation(); if (e.detail === 0 || !pointer.current.moved)
        onSelect(r.id); }} style={{ left: `${r.position.x / 12}%`, top: `${r.position.y / 10}%`, width: `${profile.size / 12}%`, zIndex: Math.round(r.position.y) }}>
  <span className={`rabbit-ground-shadow ${[19, 20].includes(r.frame) && r.state === 'move' ? 'airborne' : ''}`} aria-hidden="true"/>
  <RabbitSprite rabbit={r}/><span className="rabbit-hover-name">{profile.name}<small>{r.reaction?.label ?? rabbitActions[r.state]}</small></span>
 </button>;
}
export default memo(function RabbitLife({ paused, onSelect, controllerRef }: {
    paused: boolean;
    onSelect: (id: RabbitId) => void;
    controllerRef: React.RefObject<Life | null>;
}) {
    const [rabbits, setRabbits] = useState<RabbitView[]>(() => createRabbitLife().snapshot());
    useEffect(() => {
        const life = createRabbitLife({ onUpdate: next => setRabbits(previous => next.some((r, i) => r.state !== previous[i].state || r.frame !== previous[i].frame || r.reaction?.label !== previous[i].reaction?.label || r.facing !== previous[i].facing || r.position.x !== previous[i].position.x || r.position.y !== previous[i].position.y) ? next : previous) });
        controllerRef.current = life;
        const loop = createRabbitLoop(life, { requestFrame: requestAnimationFrame, cancelFrame: cancelAnimationFrame }), motion = matchMedia('(prefers-reduced-motion: reduce)');
        const visibility = () => loop.setVisible(!document.hidden), reduce = () => life.setReduced(motion.matches);
        reduce();
        motion.addEventListener('change', reduce);
        document.addEventListener('visibilitychange', visibility);
        visibility();
        return () => { loop.dispose(); motion.removeEventListener('change', reduce); document.removeEventListener('visibilitychange', visibility); controllerRef.current = null; };
    }, [controllerRef]);
    useEffect(() => { controllerRef.current?.setPaused(paused); }, [paused, controllerRef]);
    return <div className="rabbit-life" aria-label="兔兔島的自主生活草地">
  {rabbits.map(r => <Rabbit key={r.id} r={r} onSelect={onSelect}/>)}
  <img className="rabbit-scenery-occluder rabbit-hide-front" src={assetUrl("/assets/rabbit-island.webp")} alt="" aria-hidden="true" draggable={false}/>
  <img className="rabbit-scenery-occluder rabbit-rock-front" src={assetUrl("/assets/rabbit-island.webp")} alt="" aria-hidden="true" draggable={false}/>
 </div>;
});
