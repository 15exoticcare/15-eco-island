import {assetUrl} from '../lib/public-assets.mjs';
import { memo, useEffect, useRef, useState, type CSSProperties } from 'react';
import { createExplorationLife, explorationVisitors, visitorPoint, type ExplorationActor } from '@/lib/exploration.mjs';
import { createLifeLoop } from '@/lib/life-loop.mjs';
export default memo(function ExplorationScenery({ paused, active, visit, onSelect, offsets }: {
    paused: boolean;
    active: string | null;
    visit: number;
    onSelect: (id: string) => void;
    offsets?:Record<string,{x:number;y:number}>;
}) {
    const controller = useRef<ReturnType<typeof createExplorationLife> | null>(null);
    const [actors, setActors] = useState<ExplorationActor[]>(() => createExplorationLife().snapshot());
    useEffect(() => {
        const life = createExplorationLife({ onUpdate: setActors });
        controller.current = life;
        const loop = createLifeLoop(life, { requestFrame: requestAnimationFrame, cancelFrame: cancelAnimationFrame }), motion = matchMedia('(prefers-reduced-motion: reduce)');
        const visible = () => loop.setVisible(!document.hidden), reduce = () => life.setReduced(motion.matches);
        reduce();
        visible();
        document.addEventListener('visibilitychange', visible);
        motion.addEventListener('change', reduce);
        return () => { loop.dispose(); document.removeEventListener('visibilitychange', visible); motion.removeEventListener('change', reduce); controller.current = null; };
    }, []);
    useEffect(() => { controller.current?.setPaused(paused); }, [paused]);
    useEffect(() => { if (active)
        controller.current?.react(active); }, [active, visit]);
    const pointer = useRef({ x: 0, y: 0, moved: false });
    return <div className="exploration-scenery" aria-label="周邊生態小景">
  {explorationVisitors.map(p => {
            const a = actors.find(a => a.id === p.id)!, originalPoint = visitorPoint(p), offset=offsets?.[p.id]??{x:0,y:0},point={x:originalPoint.x+offset.x,y:originalPoint.y+offset.y};
            return <div key={p.id} data-exploration-scene={p.id}>
   <img className="exploration-landscape" src={assetUrl(`/assets/exploration/${p.id}-scene.webp`)} alt="" draggable={false} style={{ left: p.x+offset.x, top: p.y+offset.y, width: p.width, height: p.width / p.aspect }}/>
   <button type="button" className={`exploration-visitor ${active === p.id ? 'active' : ''}`} data-exploration={p.id} data-frame={a.frame} aria-label={`發現${p.name}，${p.setting}`} aria-expanded={active === p.id} aria-controls="exploration-card" style={{ left: point.x, top: point.y, '--visitor-size': `${p.size}px` } as CSSProperties} onPointerDown={e => { pointer.current = { x: e.clientX, y: e.clientY, moved: false }; }} onPointerMove={e => { if (Math.hypot(e.clientX - pointer.current.x, e.clientY - pointer.current.y) > 5)
                pointer.current.moved = true; }} onClick={e => { e.stopPropagation(); if (e.detail === 0 || !pointer.current.moved)
                onSelect(p.id); }}>
    <svg className="exploration-sprite" viewBox="0 0 256 256" aria-hidden="true"><svg width="256" height="256" overflow="hidden"><image href={assetUrl(`/assets/exploration/${p.id}-actor.webp`)} width="512" height="256" x={-a.frame * 256}/></svg></svg>
    <span className="exploration-spark" aria-hidden="true">✧</span><span className="exploration-hover">{p.setting} · {p.name}</span>
   </button>
  </div>;
        })}
 </div>;
});
