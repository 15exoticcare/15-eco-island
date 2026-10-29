'use client';
import {assetUrl} from '../lib/public-assets.mjs';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { islands, destinations, bridgePaths, world, type IslandId, type Point } from '@/lib/islands';
import { createPatrol, createPatrolLoop, type Patrol, type PatrolState } from '@/lib/patrol.mjs';
import { zoomAt } from '@/lib/camera.mjs';
import { type Facing } from '@/lib/animation.mjs';
import Caretaker from './Caretaker';
import AnimalLife from './AnimalLife';
import AnimalCard from './AnimalCard';
import { animalProfiles, type AnimalLife as AnimalController } from '@/lib/animal-life.mjs';
import { habitats } from '@/lib/habitats.mjs';
import Walkways from './Walkways';
import Bridges from './Bridges';
import IslandCard from './IslandCard';
import IslandLabels from './IslandLabels';
import PatrolControls from './PatrolControls';
import RabbitLife from './RabbitLife';
import RabbitCard from './RabbitCard';
import ExplorationScenery from './ExplorationScenery';
import ExplorationCard from './ExplorationCard';
import FieldGuide, { type FieldGuideHandle } from './FieldGuide';
import { explorationVisitors, visitorPoint } from '@/lib/exploration.mjs';
import type { RabbitId, RabbitLife as RabbitController } from '@/lib/rabbit-life.mjs';
type Camera = {
    x: number;
    y: number;
    scale: number;
};
export default function Experience() {
    const viewport = useRef<HTMLDivElement>(null), cameraRef = useRef<Camera>({ x: 0, y: 0, scale: 1 });
    const [camera, setCamera] = useState<Camera>(cameraRef.current), [selected, setSelected] = useState<IslandId | null>(null), [position, setPosition] = useState<Point>(destinations.main), [walking, setWalking] = useState(false), [smooth, setSmooth] = useState(false), [help, setHelp] = useState(false);
    const [direction, setDirection] = useState<Facing>('front'), [distance, setDistance] = useState(0), [observing, setObserving] = useState(false), [lifePaused, setLifePaused] = useState(false);
    const [patrolState, setPatrolState] = useState<PatrolState | null>(null);
    const [visitCaption, setVisitCaption] = useState<string | null>(null);
    const [selectedRabbit, setSelectedRabbit] = useState<RabbitId | null>(null);
    const rabbits = useRef<RabbitController | null>(null);
    const animals = useRef<AnimalController | null>(null);
    const guide = useRef<FieldGuideHandle | null>(null);
    const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
    const [selectedExploration, setSelectedExploration] = useState<string | null>(null), [explorationVisit, setExplorationVisit] = useState(0), [explorationMenu, setExplorationMenu] = useState(false);
    const explorationRef = useRef<string | null>(null);
    explorationRef.current = selectedExploration;
    const explorationReturn = useRef<string | null>(null);
    const patrol = useRef<Patrol | null>(null), selectedRef = useRef<IslandId | null>(selected);
    selectedRef.current = selected;
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
    function measure() { const r = viewport.current?.getBoundingClientRect(); if (r)
        setViewportSize({ width: r.width, height: r.height }); return r; }
    const pointers = useRef(new Map<number, Point>()), gesture = useRef({ x: 0, y: 0, distance: 0, moved: false }), cameraTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    function update(c: Camera) { cameraRef.current = c; setCamera(c); }
    function fit() { const r = measure(); if (!r)
        return; const s = Math.min(r.width / world.bounds.width, r.height / world.bounds.height) * .96; setSmooth(true); update({ x: r.width / 2 - world.center.x * s, y: r.height / 2 - world.center.y * s, scale: s }); }
    useEffect(() => { fit(); const ro = new ResizeObserver(() => { if (explorationRef.current)
        focusExploration(explorationRef.current);
    else if (selectedRef.current)
        focus(selectedRef.current, true);
    else
        fit(); }); if (viewport.current)
        ro.observe(viewport.current); return () => { ro.disconnect(); if (cameraTimer.current)
        clearTimeout(cameraTimer.current); }; }, []);
    function zoom(factor: number, cx?: number, cy?: number) { const r = viewport.current?.getBoundingClientRect(); if (!r)
        return; const c = cameraRef.current, x = cx ?? r.width / 2, y = cy ?? r.height / 2; update(zoomAt(c, factor, x, y)); }
    function focus(id: IslandId, preserveRabbit = false) { if (!preserveRabbit) {
        setSelectedRabbit(null);
        setSelectedAnimal(null);
        setSelectedExploration(null);
        setExplorationMenu(false);
    } const i = islands.find(a => a.id === id)!; const r = measure(); if (!r)
        return; const mobile = r.width < 850, left = mobile ? 0 : 220, free = r.width - left - (mobile ? 56 : 440), available = mobile ? Math.max(72, r.height - window.innerHeight * .34 - 12) : r.height * .82; const rabbitCloseup = mobile && id !== 'main', scale = rabbitCloseup ? Math.min(free / (i.width * 1.03), 1.1) : Math.min(free / (i.width * 1.13), available / (i.width * .92), 1.3), targetY = rabbitCloseup ? (id === 'rabbit' ? Math.max(62, Math.min(110, (r.height - window.innerHeight * .31 - 16) * .72)) : Math.max(98, Math.min(130, 98 + (window.innerHeight - 740) * .25))) : (mobile ? available / 2 + 8 : r.height * .47); setSmooth(true); update({ scale, x: left + free / 2 - i.x * scale, y: targetY - (i.y - i.width * .18) * scale }); setSelected(id); }
    useEffect(() => { const el = viewport.current!; const wheel = (e: WheelEvent) => { e.preventDefault(); setSmooth(false); const r = el.getBoundingClientRect(); zoom(Math.exp(-e.deltaY * .001), e.clientX - r.left, e.clientY - r.top); }; el.addEventListener('wheel', wheel, { passive: false }); return () => el.removeEventListener('wheel', wheel); }, []);
    useEffect(() => {
        let previousPhase = 'wait', arrivals = 0;
        const controller = createPatrol(bridgePaths, state => {
            if (state.phase === 'wait' && previousPhase === 'walk' && state.location !== 'main') {
                const i = islands.find(i => i.id === state.location)!, point = { x: (state.position.x - i.x + i.width / 2) / i.width, y: (state.position.y - i.y + i.width * .64) / i.width };
                if (state.location === 'rabbit')
                    rabbits.current?.noticeKeeper({ x: point.x * 1200, y: point.y * 1200 });
                else if (habitats[state.location])
                    animals.current?.noticeKeeper(state.location, { x: point.x * 1000, y: point.y * 1000 });
                arrivals++;
                setVisitCaption(arrivals % 3 === 1 ? ['保母正在觀察寶貝的活動狀態 ♡', '今天也要細心照顧每一位小旅客。', '每一種特別的寶貝，都值得被溫柔對待。'][Math.floor(arrivals / 3) % 3] : null);
            }
            if (state.phase === 'walk' && previousPhase !== 'walk')
                setVisitCaption(null);
            previousPhase = state.phase;
            setPosition(state.position);
            setDirection(state.direction);
            setDistance(state.distance);
            const moving = state.phase === 'walk' && !state.paused;
            setWalking(moving);
            setObserving(state.phase === 'wait' && state.location !== 'main');
            setPatrolState(previous => previous && previous.location === state.location && previous.target === state.target && previous.phase === state.phase && previous.automatic === state.automatic && previous.paused === state.paused && previous.pending === state.pending && previous.nextStop === state.nextStop ? previous : state);
        });
        patrol.current = controller;
        const loop = createPatrolLoop(controller, { requestFrame: requestAnimationFrame, cancelFrame: cancelAnimationFrame });
        const visibility = () => loop.setVisible(!document.hidden);
        document.addEventListener('visibilitychange', visibility);
        visibility();
        return () => { document.removeEventListener('visibilitychange', visibility); loop.dispose(); patrol.current = null; };
    }, []);
    function visit(id: IslandId) {
        const controller = patrol.current;
        if (!controller || !controller.requestManual(id))
            return;
        // Keep the manual camera behavior; the controller queues safely when moving or paused.
        setSelectedRabbit(null);
        setSelectedAnimal(null);
        setSelectedExploration(null);
        setExplorationMenu(false);
        setSelected(null);
        fit();
    }
    const selectRabbit = useCallback((id: RabbitId) => { setSelectedExploration(null); setSelectedAnimal(null); rabbits.current?.react(id); if (selectedRef.current !== 'rabbit')
        focus('rabbit'); setSelectedRabbit(id); guide.current?.discover('rabbit'); }, []);
    const selectAnimal = useCallback((id: string) => { setSelectedExploration(null); const p = animalProfiles.find(p => p.id === id); if (!p)
        return; animals.current?.react(id); if (selectedRef.current !== p.island)
        focus(p.island); setSelectedRabbit(null); setSelectedAnimal(id); guide.current?.discover(p.island); }, []);
    function focusExploration(id: string) {
        const p = explorationVisitors.find(p => p.id === id);
        const r = measure();
        if (!p || !r)
            return;
        const point = visitorPoint(p), mobile = r.width < 850, scale = mobile ? .95 : 1.15;
        setSmooth(true);
        update({ scale, x: (mobile ? r.width * .47 : (r.width - 360) / 2) - point.x * scale, y: (mobile ? Math.max(62, (r.height - 160) / 2) : r.height * .46) - point.y * scale });
    }
    const selectExploration = useCallback((id: string) => { if (!explorationVisitors.some(p => p.id === id))
        return; explorationReturn.current = document.activeElement?.getAttribute('data-exploration') ?? id; setSelected(null); setSelectedRabbit(null); setSelectedAnimal(null); setSelectedExploration(id); setExplorationVisit(n => n + 1); setExplorationMenu(false); focusExploration(id); guide.current?.discover(id); }, []);
    function closeExploration() { const id = explorationReturn.current; setSelectedExploration(null); if (id)
        requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-exploration="${id}"]`)?.focus({ preventScroll: true })); }
    const navigateGuide = useCallback((id: string, group: 'hotel' | 'visitor') => { if (group === 'hotel')
        focus(id as IslandId);
    else {
        setSelected(null);
        setSelectedRabbit(null);
        setSelectedAnimal(null);
        setSelectedExploration(null);
        setExplorationMenu(false);
        focusExploration(id);
    } requestAnimationFrame(() => viewport.current?.focus({ preventScroll: true })); }, []);
    const current = islands.find(i => i.id === selected);
    return <main onKeyDown={e => { if (e.key === 'Escape') {
        setSelectedRabbit(null);
        setSelectedAnimal(null);
        setExplorationMenu(false);
        if (selectedExploration)
            closeExploration();
    } }} className={lifePaused ? 'life-paused' : ''} data-exploring={selectedExploration ? 'true' : 'false'} data-view={selected ? 'focus' : 'overview'} data-island={selected ?? 'overview'}>
  <header className="topbar"><a className="brand" href="https://15exoticanimalhotel.com.tw/" target="_blank" rel="noreferrer"><img src={assetUrl("/assets/logo-original.jpg")} alt="壹伍原始商標"/><span>壹伍<span className="brand-sub">非犬貓旅宿</span></span></a><span className="top-caption">每一種特別，都值得被溫柔對待</span><a className="price-link" href="https://15exoticanimalhotel.com.tw/price.html" target="_blank" rel="noreferrer">了解房型／價格 <span>↗</span></a></header>
  <div className="intro"><div className="eyebrow"><span /> YIWU ECO ISLAND · CHAPTER 07</div><h1>壹伍生態島</h1><p>把世界放小，把照顧放大。<br />跟著保母，走進每一種特別的日常。</p><span className="review-tag">動態原型 · 步態與新製美術待審</span></div>
  <div className="map" ref={viewport} tabIndex={0} role="region" aria-label="可拖曳縮放的生態島地圖；方向鍵移動，加減鍵縮放，Home 返回全景" onKeyDown={e => { const c = cameraRef.current; if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        setSmooth(false);
        update({ ...c, x: c.x + (e.key === 'ArrowLeft' ? 50 : e.key === 'ArrowRight' ? -50 : 0), y: c.y + (e.key === 'ArrowUp' ? 50 : e.key === 'ArrowDown' ? -50 : 0) });
    } if (e.key === '+' || e.key === '=')
        zoom(1.2); if (e.key === '-')
        zoom(1 / 1.2); if (e.key === 'Home') {
        fit();
        setSelectedExploration(null);
        setExplorationMenu(false);
        setSelected(null);
        setSelectedRabbit(null);
        setSelectedAnimal(null);
    } }} onPointerDown={e => { setSmooth(false); pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); const a = [...pointers.current.values()]; gesture.current = { x: e.clientX, y: e.clientY, distance: a.length === 2 ? Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) : 0, moved: false }; }} onPointerMove={e => { if (!pointers.current.has(e.pointerId))
        return; if (!gesture.current.moved && pointers.current.size === 1 && Math.hypot(e.clientX - gesture.current.x, e.clientY - gesture.current.y) < 5)
        return; gesture.current.moved = true; e.currentTarget.setPointerCapture(e.pointerId); const previous = pointers.current.get(e.pointerId)!; pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); const a = [...pointers.current.values()]; if (a.length === 2) {
        const d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y), r = e.currentTarget.getBoundingClientRect();
        if (gesture.current.distance) {
            const mid = { x: (a[0].x + a[1].x) / 2 - r.left, y: (a[0].y + a[1].y) / 2 - r.top }, dx = (e.clientX - previous.x) / 2, dy = (e.clientY - previous.y) / 2, c = zoomAt(cameraRef.current, d / gesture.current.distance, mid.x - dx, mid.y - dy);
            update({ ...c, x: c.x + dx, y: c.y + dy });
        }
        gesture.current.distance = d;
    }
    else {
        const c = cameraRef.current;
        update({ ...c, x: c.x + e.clientX - previous.x, y: c.y + e.clientY - previous.y });
    } if (Math.hypot(e.clientX - gesture.current.x, e.clientY - gesture.current.y) > 4)
        gesture.current.moved = true; }} onPointerUp={e => { pointers.current.delete(e.pointerId); gesture.current.distance = 0; }} onPointerCancel={e => { pointers.current.delete(e.pointerId); gesture.current.distance = 0; }}>
   <div className="cloud cloud-one" style={{ transform: `translate(${camera.x * .08}px,${camera.y * .08}px)` }}/><div className="cloud cloud-two" style={{ transform: `translate(${camera.x * .04}px,${camera.y * .04}px)` }}/>
   <div className={`world ${smooth ? 'smooth' : ''}`} style={{ '--map-scale': camera.scale, width: world.width, height: world.height, transform: `translate(${camera.x}px,${camera.y}px) scale(${camera.scale})` } as CSSProperties}>
    {islands.map(i => <div key={i.id} className={`island island-${i.id} ${selected === i.id ? 'selected' : ''}`} style={{ left: i.x - i.width / 2, top: i.y - i.width * .64, width: i.width }}>
     <button className="island-hit" onClick={() => { if (!gesture.current.moved)
            focus(i.id); }} aria-label={`探索${i.name}`}><img className="island-art" src={assetUrl(`/assets/${i.art}.webp`)} alt={`${i.name}立體微縮浮島`} draggable={false}/></button>
     {i.id === 'main' && <div className="building-sign"><img src={assetUrl("/assets/logo-original.jpg")} alt="壹伍非犬貓旅宿入口原始商標"/><span>壹伍<br /><small>非犬貓旅宿</small></span></div>}
     {i.id === 'rabbit' && <RabbitLife paused={lifePaused} controllerRef={rabbits} onSelect={selectRabbit}/>}

    </div>)}
    <ExplorationScenery paused={lifePaused} active={selectedExploration} visit={explorationVisit} onSelect={selectExploration}/>
    <AnimalLife paused={lifePaused} controllerRef={animals} onSelect={selectAnimal}/>
    <Bridges /><Walkways /><Caretaker position={position} direction={direction} distance={distance} walking={walking} observing={observing}/><Bridges front/>
    <div className="world-note">一座小島，一種專屬的溫柔。</div>
   </div>
  </div>
  <IslandLabels camera={camera} viewport={viewportSize} selected={selected} smooth={smooth} onSelect={focus}/>
  <div className="map-tools" aria-label="地圖控制"><button onClick={() => { setSmooth(true); zoom(1.25); }} aria-label="放大">＋</button><span>{Math.round(camera.scale * 100)}%</span><button onClick={() => { setSmooth(true); zoom(.8); }} aria-label="縮小">−</button><div /><button onClick={() => { fit(); setSelectedExploration(null); setExplorationMenu(false); setSelected(null); setSelectedRabbit(null); setSelectedAnimal(null); }} aria-label="返回全景">⌖</button><button onClick={() => setHelp(!help)} aria-label="操作說明">?</button><button className="motion-toggle" onClick={() => setLifePaused(!lifePaused)} aria-label={lifePaused ? '播放環境微動畫' : '暫停環境微動畫'} aria-pressed={lifePaused}>{lifePaused ? '▷' : 'Ⅱ'}</button><button className="exploration-tool" aria-label="尋找周邊小訪客" aria-expanded={explorationMenu} aria-controls="exploration-directory" onClick={() => setExplorationMenu(!explorationMenu)}>✧</button><FieldGuide ref={guide} onNavigate={navigateGuide}/></div>
  {explorationMenu && <nav id="exploration-directory" className="exploration-directory" aria-label="周邊生態探索"><strong>林間的小小訪客</strong><p>在島外停一停，發現自然裡的細節。</p>{explorationVisitors.map(p => <button key={p.id} onClick={() => selectExploration(p.id)}>{p.name}<small>{p.setting} ↗</small></button>)}</nav>}
  {help && <div className="help">滑鼠拖曳／手機單指平移<br />滾輪／雙指縮放<br />點選島嶼探索，按「巡視」讓保母出發<br />鍵盤：方向鍵移動、＋／− 縮放、Home 全景</div>}
  {current && !selectedRabbit && !selectedAnimal && <IslandCard island={current} onClose={() => { setSelected(null); fit(); }} onVisit={visit}/>}
  {selectedRabbit && <RabbitCard id={selectedRabbit} onClose={() => setSelectedRabbit(null)}/>}
  {selectedExploration && <ExplorationCard id={selectedExploration} onClose={closeExploration}/>}
  {selectedAnimal && <AnimalCard id={selectedAnimal} onClose={() => setSelectedAnimal(null)}/>}
  <footer className="patrol-footer"><PatrolControls state={patrolState} caption={visitCaption} onToggle={() => { const controller = patrol.current; if (controller)
        controller.setPaused(!controller.snapshot().paused); }}/><a className="contact" href={process.env.NEXT_PUBLIC_BOOKING_URL || 'https://15exoticanimalhotel.com.tw/'} target="_blank" rel="noreferrer">{process.env.NEXT_PUBLIC_BOOKING_URL ? '住宿預約' : '聯絡壹伍／前往官網'} ↗</a></footer>
 </main>;
}
