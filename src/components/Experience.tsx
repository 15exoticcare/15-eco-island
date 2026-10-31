'use client';
import {assetUrl} from '../lib/public-assets.mjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { islands, bridgePaths, world as legacyWorld, type IslandId, type Point } from '@/lib/islands';
import { createPatrol, createPatrolLoop, type Patrol, type PatrolState } from '@/lib/patrol.mjs';
import {MobileNavigation,MobilePanel,MobileSheetHeading,NavIcon,type Panel} from './MobileChrome';
import { zoomAt } from '@/lib/camera.mjs';
import {LiveCaretaker,type CaretakerHandle} from './Caretaker';
import AnimalLife from './AnimalLife';
import AnimalCard from './AnimalCard';
import { animalProfiles, type AnimalLife as AnimalController } from '@/lib/animal-life.mjs';
import { habitats } from '@/lib/habitats.mjs';
import {hamsterPlacement} from '@/lib/hamster-ground.mjs';
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
import { explorationVisitors as legacyVisitors, visitorPoint } from '@/lib/exploration.mjs';
import type { RabbitId, RabbitLife as RabbitController } from '@/lib/rabbit-life.mjs';
import {ArtExpansion} from './ArtExpansion';
import {ArtFinal} from './ArtFinal';
import {ArtExploration} from './ArtExploration';
import EggScenery from './EggScenery';
import {eggIslands,eggAnimals,eggWorld} from '@/lib/exploration-stage5.mjs';
import DioramaFinal from './DioramaFinal';
import {finalPaths,finalSpans,finalWalkways,finalFocus,finalOffsets,finalLabelOffsets,finalVisitorOffsets,findGardenRoute} from '@/lib/diorama-stage4';
import DioramaExpansion from './DioramaExpansion';
import {expansionPaths,expansionSpans,expansionWalkways,expansionFocus,expansionOffsets,expansionLabelOffsets} from '@/lib/diorama-stage3';
import {ArtDirection} from './ArtDirection';
import DioramaGround from './DioramaGround';
import {dioramaPaths,dioramaSpans,dioramaWalkways,dioramaFocus,rabbitArtOffset,parrotArtOffset} from '@/lib/diorama';
type Camera = {
    x: number;
    y: number;
    scale: number;
};
export default function Experience({artPreview=false,artExpansion=false,artFinal=false,eggPreview=false}:{artPreview?:boolean;artExpansion?:boolean;artFinal?:boolean;eggPreview?:boolean}) {return <ArtDirection.Provider value={artPreview}><ArtExpansion.Provider value={artExpansion}><ArtFinal.Provider value={artFinal}><ArtExploration.Provider value={eggPreview}><ExperienceScene artPreview={artPreview} artExpansion={artExpansion} artFinal={artFinal} eggPreview={eggPreview}/></ArtExploration.Provider></ArtFinal.Provider></ArtExpansion.Provider></ArtDirection.Provider>}
function ExperienceScene({artPreview,artExpansion,artFinal,eggPreview}:{artPreview:boolean;artExpansion:boolean;artFinal:boolean;eggPreview:boolean}) {
    const world=eggPreview?eggWorld:legacyWorld,explorationVisitors=eggPreview?eggIslands:legacyVisitors;
    const [selectedVisitorActor,setSelectedVisitorActor]=useState<string|null>(null),[eggFocus,setEggFocus]=useState<string|null>(null);
    const artFocus=artFinal?finalFocus:artExpansion?expansionFocus:dioramaFocus;
    const artPaths=artFinal?finalPaths:artExpansion?expansionPaths:dioramaPaths,artSpans=artFinal?finalSpans:artExpansion?expansionSpans:dioramaSpans,artWalkways=artFinal?finalWalkways:artExpansion?expansionWalkways:dioramaWalkways,artOffsets:Record<string,Point>=artFinal?finalOffsets:expansionOffsets;
    const [panel,setPanel] = useState<Panel>(null), [mobile,setMobile] = useState(false), [panelHeight,setPanelHeight] = useState(0);
    const mobileRef=useRef(false), panelRef=useRef<Panel>(null), sheet=useRef<HTMLDivElement>(null), reframe=useRef<()=>void>(()=>{});
    panelRef.current=panel;
    const worldElement=useRef<HTMLDivElement>(null),cloudOne=useRef<HTMLDivElement>(null),cloudTwo=useRef<HTMLDivElement>(null),cameraFrame=useRef<number|null>(null),caretaker=useRef<CaretakerHandle|null>(null);
    const viewport = useRef<HTMLDivElement>(null), cameraRef = useRef<Camera>({ x: 0, y: 0, scale: 1 });
    const [camera, setCamera] = useState<Camera>(cameraRef.current), [selected, setSelected] = useState<IslandId | null>(null), [smooth, setSmooth] = useState(false), [help, setHelp] = useState(false);
    const [lifePaused, setLifePaused] = useState(false);
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
        setViewportSize(previous=>previous.width===r.width&&previous.height===r.height?previous:{ width: r.width, height: r.height }); return r; }
    const pointers = useRef(new Map<number, Point>()), gesture = useRef({ x: 0, y: 0, distance: 0, moved: false }), cameraTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    function settleHitScale(){worldElement.current?.style.setProperty('--map-scale',String(cameraRef.current.scale));}
    function paintCamera(){cameraFrame.current=null;const c=cameraRef.current,element=worldElement.current;if(!element)return;
        element.style.transform=`translate(${c.x}px,${c.y}px) scale(${c.scale})`;
        settleHitScale();if(!element.dataset.cameraReady)element.dataset.cameraReady='true';
        if(cloudOne.current)cloudOne.current.style.transform=`translate(${c.x*.08}px,${c.y*.08}px)`;
        if(cloudTwo.current)cloudTwo.current.style.transform=`translate(${c.x*.04}px,${c.y*.04}px)`;
        if(!mobileRef.current)setCamera(c);
    }
    function update(c: Camera) {
        const r=viewport.current?.getBoundingClientRect();
        if(mobileRef.current&&r){const scale=Math.max(Math.min(r.width/world.bounds.width,r.height/world.bounds.height)*.86,Math.min(1.65,c.scale));
            c={scale,x:Math.max(r.width*.5-(world.center.x+world.bounds.width*.5)*scale,Math.min(r.width*.5-(world.center.x-world.bounds.width*.5)*scale,c.x)),y:Math.max(r.height*.5-(world.center.y+world.bounds.height*.5)*scale,Math.min(r.height*.5-(world.center.y-world.bounds.height*.5)*scale,c.y))};}
        cameraRef.current=c;
        if(cameraFrame.current===null)cameraFrame.current=requestAnimationFrame(paintCamera);
    }
    function fit(full=false) {setEggFocus(null);const r=measure();if(!r)return;const fitted=Math.min(r.width/world.bounds.width,r.height/world.bounds.height)*.96;
        const scale=mobileRef.current&&!full?Math.max(fitted,Math.min(.24,r.height/(world.bounds.height*.95))):fitted;
        setSmooth(true);update({x:r.width/2-world.center.x*scale,y:r.height/2-world.center.y*scale,scale});}
    useEffect(()=>{const query=matchMedia('(max-width:849px), (max-height:500px) and (pointer:coarse)');
        const mode=()=>{mobileRef.current=query.matches;setMobile(query.matches);};mode();query.addEventListener('change',mode);fit();let last=viewport.current!.getBoundingClientRect();
        let layoutFrame=0;
        const resize=()=>{const r=measure();if(!r)return;const c=cameraRef.current;
            if(!mobileRef.current||!['island','rabbit','animal','visitor'].includes(panelRef.current??''))update({...c,x:c.x+(r.width-last.width)/2,y:c.y+(r.height-last.height)/2});last=r;
            // WebKit can deliver viewport and sheet geometry in different frames.
            cancelAnimationFrame(layoutFrame);layoutFrame=requestAnimationFrame(()=>{layoutFrame=requestAnimationFrame(()=>reframe.current());});};
        const ro=new ResizeObserver(resize);ro.observe(viewport.current!);window.addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);window.addEventListener('orientationchange',resize);
        return()=>{ro.disconnect();cancelAnimationFrame(layoutFrame);query.removeEventListener('change',mode);window.removeEventListener('resize',resize);window.visualViewport?.removeEventListener('resize',resize);window.removeEventListener('orientationchange',resize);if(cameraTimer.current)clearTimeout(cameraTimer.current);if(cameraFrame.current!==null)cancelAnimationFrame(cameraFrame.current);};},[]);
    useEffect(()=>{if(!mobile)return;const element=panel==='guide'?document.querySelector('#field-guide'):sheet.current;if(!element){setPanelHeight(0);return;}
        const ro=new ResizeObserver(()=>setPanelHeight(Math.round(element.getBoundingClientRect().height)));ro.observe(element);return()=>ro.disconnect();},[panel,mobile]);
    function clearPanel(){const prior=panelRef.current;setPanel(null);setHelp(false);setExplorationMenu(false);setSelectedRabbit(null);setSelectedAnimal(null);setSelectedExploration(null);if(mobileRef.current)requestAnimationFrame(()=>document.querySelector<HTMLButtonElement>(`[data-mobile-nav="${prior==='patrol'?'patrol':prior==='guide'?'guide':'islands'}"]`)?.focus({preventScroll:true}));}
    const changeGuide=useCallback((open:boolean)=>{setPanel(open?'guide':null);setHelp(false);setExplorationMenu(false);},[]);
    function openMobile(next:Panel){if(next==='guide')guide.current?.open();else{setPanel(next);setHelp(false);setExplorationMenu(false);}}
    function availableMap(){const r=viewport.current?.getBoundingClientRect();if(!r)return null;const element=panelRef.current==='guide'?document.querySelector('#field-guide'):sheet.current;
        const box=panelRef.current&&element?element.getBoundingClientRect():null;const side=!!box&&box.width<r.width*.75;const occupied=box&&!side?Math.max(0,r.bottom-box.top):0;return {r,width:side?Math.max(120,box!.left-r.left-12):r.width,top:48,height:Math.max(80,r.height-occupied-48)};}
    function frameMobile(id:IslandId,actorSelector?:string){const area=availableMap(),i=islands.find(i=>i.id===id);if(!area||!i)return;const {r,width,top,height}=area;const art=artPreview?artFocus[id]:undefined;let point=art?{x:art.x,y:art.y}:{x:i.x,y:i.y-i.width*.18};
        let scale=Math.min((width-28)/((art?.width??i.width)*1.04),height*.88/(art?.height??i.width*.86),.85);
        if(actorSelector){const actor=document.querySelector(actorSelector),worldElement=viewport.current?.querySelector('.world');if(actor&&worldElement){const b=actor.getBoundingClientRect(),matrix=new DOMMatrix(getComputedStyle(worldElement).transform);point={x:(b.x+b.width/2-r.x-matrix.e)/matrix.a,y:(b.y+b.height/2-r.y-matrix.f)/matrix.d};scale=Math.min(1.05,Math.max(.72,(width-36)/(i.width*.78)));}}
        setSmooth(true);update({scale,x:width/2-point.x*scale,y:top+height*.5-point.y*scale});}
    reframe.current=()=>{if(!mobileRef.current)return;if(panel==='visitor'&&selectedExploration)focusExploration(selectedExploration);else if(selected&&['island','rabbit','animal'].includes(panel??''))frameMobile(selected,panel==='rabbit'&&selectedRabbit?`[data-rabbit="${selectedRabbit}"]`:panel==='animal'&&selectedAnimal?`[data-animal="${selectedAnimal}"]`:undefined);};
    useEffect(()=>{if(!mobile)return;const timer=requestAnimationFrame(()=>reframe.current());return()=>cancelAnimationFrame(timer);},[panel,panelHeight,mobile,selected,selectedRabbit,selectedAnimal,selectedExploration,viewportSize.width,viewportSize.height]);
    function zoom(factor:number,cx?:number,cy?:number){const r=viewport.current?.getBoundingClientRect();if(!r)return;const c=cameraRef.current;
        if(mobileRef.current)factor=Math.max(Math.min(r.width/world.bounds.width,r.height/world.bounds.height)*.86,Math.min(1.65,c.scale*factor))/c.scale;
        update(zoomAt(c,factor,cx??r.width/2,cy??r.height/2));}
    function focus(id: IslandId, preserveRabbit = false) { setEggFocus(null); if (!preserveRabbit) {
        setSelectedRabbit(null);
        setSelectedAnimal(null);
        setSelectedExploration(null);
        setExplorationMenu(false);
    } setPanel('island'); const i = islands.find(a => a.id === id)!; if(mobileRef.current){setSelected(id);return;} if(artPreview&&artFocus[id]){const r=measure(),a=artFocus[id];if(!r)return;const free=r.width-660,scale=Math.min(free/(a.width*1.13),r.height*.82/a.height,1.3);setSmooth(true);update({scale,x:220+free/2-a.x*scale,y:r.height*.47-a.y*scale});setSelected(id);return;} const r = measure(); if (!r)
        return; const mobile = r.width < 850, left = mobile ? 0 : 220, free = r.width - left - (mobile ? 56 : 440), available = mobile ? Math.max(72, r.height - window.innerHeight * .34 - 12) : r.height * .82; const rabbitCloseup = mobile && id !== 'main', scale = rabbitCloseup ? Math.min(free / (i.width * 1.03), 1.1) : Math.min(free / (i.width * 1.13), available / (i.width * .92), 1.3), targetY = rabbitCloseup ? (id === 'rabbit' ? Math.max(62, Math.min(110, (r.height - window.innerHeight * .31 - 16) * .72)) : Math.max(98, Math.min(130, 98 + (window.innerHeight - 740) * .25))) : (mobile ? available / 2 + 8 : r.height * .47); setSmooth(true); update({ scale, x: left + free / 2 - i.x * scale, y: targetY - (i.y - i.width * .18) * scale }); setSelected(id); }
    useEffect(() => { const el = viewport.current!; const wheel = (e: WheelEvent) => { e.preventDefault(); setSmooth(false); const r = el.getBoundingClientRect(); zoom(Math.exp(-e.deltaY * .001), e.clientX - r.left, e.clientY - r.top); }; el.addEventListener('wheel', wheel, { passive: false }); return () => el.removeEventListener('wheel', wheel); }, []);
    useEffect(() => {
        let previousPhase = 'wait', arrivals = 0;
        const controller = createPatrol(artPreview?artPaths:bridgePaths, state => {
            if (state.phase === 'wait' && previousPhase === 'walk' && state.location !== 'main') {
                const i = islands.find(i => i.id === state.location)!, point = { x: (state.position.x - (artExpansion?(artOffsets[state.location]?.x??0):0) - i.x + i.width / 2) / i.width, y: (state.position.y - (artPreview?(state.location==='rabbit'?rabbitArtOffset.y:state.location==='parrot'?parrotArtOffset.y:artExpansion?(artOffsets[state.location]?.y??0):0):0) - i.y + i.width * .64) / i.width };
                if (state.location === 'rabbit')
                    rabbits.current?.noticeKeeper({ x: point.x * 1200, y: point.y * 1200 });
                else if (habitats[state.location])
                    animals.current?.noticeKeeper(state.location, artFinal&&state.location==='hamster'?{x:(state.position.x-hamsterPlacement.left)/hamsterPlacement.width*1000,y:(state.position.y-hamsterPlacement.top)/hamsterPlacement.width*1000}:{ x: point.x * 1000, y: point.y * 1000 });
                arrivals++;
                setVisitCaption(arrivals % 3 === 1 ? ['保母正在觀察寶貝的活動狀態 ♡', '今天也要細心照顧每一位小旅客。', '每一種特別的寶貝，都值得被溫柔對待。'][Math.floor(arrivals / 3) % 3] : null);
            }
            if (state.phase === 'walk' && previousPhase !== 'walk')
                setVisitCaption(null);
            previousPhase = state.phase;
            const moving=state.phase==='walk'&&!state.paused;
            caretaker.current?.update({position:state.position,direction:state.direction,distance:state.distance,walking:moving,observing:state.phase==='wait'&&state.location!=='main'});
            setPatrolState(previous => previous && previous.location === state.location && previous.target === state.target && previous.phase === state.phase && previous.automatic === state.automatic && previous.paused === state.paused && previous.pending === state.pending && previous.nextStop === state.nextStop ? previous : state);
        },artFinal?findGardenRoute:undefined);
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
        setPanel(null);
        // Keep the manual camera behavior; the controller queues safely when moving or paused.
        setSelectedRabbit(null);
        setSelectedAnimal(null);
        setSelectedExploration(null);
        setExplorationMenu(false);
        setSelected(null);
        fit();
    }
    const selectRabbit = useCallback((id: RabbitId) => { setSelectedExploration(null); setSelectedAnimal(null); rabbits.current?.react(id); if (selectedRef.current !== 'rabbit')
        focus('rabbit'); setSelectedRabbit(id); setPanel('rabbit'); guide.current?.discover('rabbit'); }, []);
    const selectAnimal = useCallback((id: string) => { setSelectedExploration(null); const p = animalProfiles.find(p => p.id === id); if (!p)
        return; animals.current?.react(id); if (selectedRef.current !== p.island)
        focus(p.island); setSelectedRabbit(null); setSelectedAnimal(id); setPanel('animal'); guide.current?.discover(p.island); }, []);
    function focusExploration(id: string) {
        if(eggPreview){const p=eggIslands.find(p=>p.id===id),r=measure();if(!p||!r)return;setEggFocus(id);const area=mobileRef.current?availableMap():null,width=area?.width??(r.width-660),height=area?.height??r.height*.82,scale=Math.min((width-30)/(p.width*1.08),height*.9/(p.height+60),1.15);setSmooth(true);update({scale,x:(area?width*.5:220+width*.5)-(p.x+p.width*.5)*scale,y:(area?area.top+height*.5:r.height*.46)-(p.y+p.height*.5)*scale});return;}
        const p = legacyVisitors.find(p => p.id === id);
        const r = measure();
        if (!p || !r)
            return;
        const originalPoint=visitorPoint(p),offset=artFinal?finalVisitorOffsets[p.id]:undefined;
        const point = {x:originalPoint.x+(offset?.x??0),y:originalPoint.y+(offset?.y??0)}, mobile = mobileRef.current, scale = mobile ? Math.min(.95,(r.width-40)/(p.size*2.5)) : 1.15;
        const area=mobile?availableMap():null;
        setSmooth(true);
        update({ scale, x: (mobile&&area ? area.width*.5 : (r.width - 360) / 2) - point.x * scale, y: (mobile&&area ? area.top+area.height*.5 : r.height * .46) - point.y * scale });
    }
    const selectExploration = useCallback((id: string,actorId?:string) => { if (!explorationVisitors.some(p => p.id === id))
        return; setSelectedVisitorActor(actorId??null); explorationReturn.current = document.activeElement?.getAttribute('data-exploration') ?? id; setSelected(null); setSelectedRabbit(null); setSelectedAnimal(null); setSelectedExploration(id); setPanel('visitor'); setExplorationVisit(n => n + 1); setExplorationMenu(false); focusExploration(id); guide.current?.discover(id); }, [eggPreview]);
    function closeExploration() { setPanel(null); const id = explorationReturn.current; setSelectedExploration(null); if (id)
        requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-exploration="${id}"]`)?.focus({ preventScroll: true })); }
    const navigateGuide = useCallback((id: string, group: 'hotel' | 'visitor') => { if (group === 'hotel')
        focus(id as IslandId);
    else {
        setSelected(null);
        setSelectedRabbit(null);
        setSelectedAnimal(null);
        setSelectedExploration(null);
        setExplorationMenu(false);
        setPanel(null);requestAnimationFrame(()=>focusExploration(id));
    } requestAnimationFrame(() => viewport.current?.focus({ preventScroll: true })); }, []);
    const current = islands.find(i => i.id === selected);
    return <main data-art={artPreview?'diorama':'classic'} data-art-stage={artFinal?4:artExpansion?3:1} data-exploration-edition={eggPreview?5:1} data-mobile={mobile} data-panel={panel??'none'} onKeyDown={e => { if (e.key === 'Escape') { clearPanel();
        setSelectedRabbit(null);
        setSelectedAnimal(null);
        setExplorationMenu(false);
        if (selectedExploration)
            closeExploration();
    } }} className={lifePaused ? 'life-paused' : ''} data-exploring={selectedExploration ? 'true' : 'false'} data-view={selected ? 'focus' : 'overview'} data-island={selected ?? 'overview'}>
  <header className="topbar"><a className="brand" href="https://15exoticanimalhotel.com.tw/" target="_blank" rel="noreferrer"><img src={assetUrl("/assets/logo-original.jpg")} alt="壹伍原始商標"/><span>壹伍<span className="brand-sub">非犬貓旅宿</span></span></a><span className="mobile-site-title">壹伍特寵小知識莊園</span><span className="top-caption">每一種特別，都值得被溫柔對待</span><a className="price-link" href="https://15exoticanimalhotel.com.tw/price.html" target="_blank" rel="noreferrer">了解房型／價格 <span>↗</span></a></header>
  <div className="intro"><div className="eyebrow"><span /> YIWU PET KNOWLEDGE MANOR</div><h1>壹伍特寵小知識莊園</h1><p>把世界放小，把照顧放大。<br />跟著保母，走進每一種特別的日常。</p><span className="review-tag">動態原型 · 步態與新製美術待審</span></div>
  <div className="map" ref={viewport} tabIndex={0} role="region" aria-label="可拖曳縮放的壹伍特寵小知識莊園地圖；方向鍵移動，加減鍵縮放，Home 返回全景" onClickCapture={e=>{if(gesture.current.moved&&e.detail!==0){e.preventDefault();e.stopPropagation();}}} onKeyDown={e => { const c = cameraRef.current; if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        setSmooth(false);
        update({ ...c, x: c.x + (e.key === 'ArrowLeft' ? 50 : e.key === 'ArrowRight' ? -50 : 0), y: c.y + (e.key === 'ArrowUp' ? 50 : e.key === 'ArrowDown' ? -50 : 0) });
    } if (e.key === '+' || e.key === '=')
        zoom(1.2); if (e.key === '-')
        zoom(1 / 1.2); if (e.key === 'Home') {
        clearPanel(); fit(true);
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
        gesture.current.moved = true; }} onPointerUp={e => { pointers.current.delete(e.pointerId); gesture.current.distance = 0; if(!pointers.current.size)settleHitScale(); }} onPointerCancel={e => { pointers.current.delete(e.pointerId); gesture.current.distance = 0; if(!pointers.current.size)settleHitScale(); }}>
   <div className="cloud cloud-one" ref={cloudOne}/><div className="cloud cloud-two" ref={cloudTwo}/>
   <div className={`world ${smooth ? 'smooth' : ''}`} ref={worldElement} style={{width:world.width,height:world.height}}>
    {artPreview&&artExpansion&&<DioramaExpansion/>}
    {artFinal&&<DioramaFinal/>}
    {artPreview&&<DioramaGround/>}
    {artFinal&&<DioramaFinal front/>}
    {islands.map(i => <div key={i.id} className={`island island-${i.id} ${selected === i.id ? 'selected' : ''}`} style={{ left: i.x - i.width / 2, top: i.y - i.width * .64, width: i.width }}>
     <button className="island-hit" onClick={() => { if (!gesture.current.moved)
            focus(i.id); }} aria-label={`探索${i.name}`}><img className="island-art" src={assetUrl(`/assets/${i.art}.webp`)} alt={`${i.name}立體微縮區域`} draggable={false}/></button>
     {i.id === 'main' && <div className="building-sign"><img src={assetUrl("/assets/logo-original.jpg")} alt="壹伍非犬貓旅宿入口原始商標"/><span>壹伍<br /><small>非犬貓旅宿</small></span></div>}
     {i.id === 'rabbit' && <RabbitLife paused={lifePaused} controllerRef={rabbits} onSelect={selectRabbit}/>}

    </div>)}
    {eggPreview?<EggScenery paused={lifePaused} active={selectedExploration} activeActor={selectedVisitorActor} visit={explorationVisit} onSelect={selectExploration}/>:<ExplorationScenery paused={lifePaused} active={selectedExploration} visit={explorationVisit} onSelect={selectExploration} offsets={artFinal?finalVisitorOffsets:undefined}/>}
    <AnimalLife paused={lifePaused} controllerRef={animals} onSelect={selectAnimal}/>
    <Bridges spans={artPreview?artSpans:undefined}/><Walkways routes={artPreview?artWalkways:undefined}/><LiveCaretaker ref={caretaker}/><Bridges front spans={artPreview?artSpans:undefined}/>
    <div className="world-note">一個區域，一種專屬的溫柔。</div>
   </div>
  </div>
  <div className="desktop-island-labels"><IslandLabels directory={eggPreview&&!!eggFocus} offsets={artFinal?finalLabelOffsets:artExpansion?expansionLabelOffsets:undefined} spans={artExpansion?artSpans:undefined} camera={camera} viewport={viewportSize} selected={selected} smooth={smooth} onSelect={focus}/></div>
  <div className="map-tools" aria-label="地圖控制"><button onClick={() => { setSmooth(true); zoom(1.25); }} aria-label="放大">＋</button><span>{Math.round(camera.scale * 100)}%</span><button onClick={() => { setSmooth(true); zoom(.8); }} aria-label="縮小">−</button><div /><button onClick={() => { clearPanel(); fit(true); setSelectedExploration(null); setExplorationMenu(false); setSelected(null); setSelectedRabbit(null); setSelectedAnimal(null); }} aria-label="返回全景">⌖</button><button onClick={() => {setPanel(null);setHelp(!help);}} aria-label="操作說明">?</button><button className="motion-toggle" onClick={() => setLifePaused(!lifePaused)} aria-label={lifePaused ? '播放環境微動畫' : '暫停環境微動畫'} aria-pressed={lifePaused}>{lifePaused ? '▷' : 'Ⅱ'}</button><button className="exploration-tool" aria-label="尋找周邊小訪客" aria-expanded={explorationMenu} aria-controls="exploration-directory" onClick={() => {setPanel(null);setExplorationMenu(!explorationMenu);}}>✧</button><FieldGuide ref={guide} onNavigate={navigateGuide} open={panel==='guide'} onOpenChange={changeGuide} showReward={!mobile||!panel}/></div>
  {explorationMenu && <nav id="exploration-directory" className="exploration-directory" aria-label="周邊生態探索"><strong>林間的小小訪客</strong><p>在島外停一停，發現自然裡的細節。</p>{explorationVisitors.map(p => <button key={p.id} onClick={() => {if(eggPreview)navigateGuide(p.id,'visitor');else selectExploration(p.id);}}>{p.name}<small>{p.setting}</small></button>)}</nav>}
  {help && <div className="help">滑鼠拖曳／手機單指平移<br />滾輪／雙指縮放<br />點選區域探索，按「巡視」讓保母出發<br />鍵盤：方向鍵移動、＋／− 縮放、Home 全景</div>}
  {mobile&&<><button className="mobile-patrol-pill" aria-label="查看巡視狀態" onClick={()=>openMobile('patrol')}><span className={patrolState?.paused?'paused-dot':'patrol-dot'}/>{patrolState?.paused?'巡視已暫停':'保母巡視中'}<span aria-hidden="true">↗</span></button>
  {!panel&&<div className="mobile-map-actions" aria-label="手機地圖工具"><button aria-label="放大地圖" onClick={()=>{setSmooth(false);zoom(1.25);}}>＋</button><button aria-label="縮小地圖" onClick={()=>{setSmooth(false);zoom(.8);}}>−</button><button aria-label="世界全景" onClick={()=>{clearPanel();setSelected(null);fit(true);}}>⌖</button><button aria-label="更多探索工具" onClick={()=>openMobile('tools')}><NavIcon kind="tools"/></button></div>}
  <MobileNavigation panel={panel} onOpen={openMobile}/></>}
  <div id="mobile-sheet" ref={sheet} className="mobile-sheet-host" data-empty={!panel||panel==='guide'} data-kind={panel??'none'} role={mobile&&panel&&panel!=='guide'?'dialog':undefined} aria-modal={mobile&&panel&&panel!=='guide'?'false':undefined} aria-label={mobile?'地圖探索面板':undefined}>
  {mobile&&panel&&panel!=='guide'&&<MobileSheetHeading onClose={clearPanel}>{panel==='islands'?'十區導覽':panel==='patrol'?'保母巡視':panel==='tools'?'探索選單':panel==='visitor'?'周邊生態手札':panel==='island'?'區域手札':'遇見小夥伴'}</MobileSheetHeading>}
  {current&&panel==='island'&&<IslandCard island={current} onClose={()=>{setPanel(null);setSelected(null);fit();}} onVisit={visit} onResident={id=>{if(current.id==='rabbit')selectRabbit(id as RabbitId);else selectAnimal(id);}}/>}
  {panel==='rabbit'&&selectedRabbit&&<RabbitCard id={selectedRabbit} onClose={()=>{setSelectedRabbit(null);setPanel(mobileRef.current?null:'island');}}/>}
  {panel==='visitor'&&selectedExploration&&<ExplorationCard id={selectedExploration} actorName={eggPreview?eggAnimals.find(a=>a.id===selectedVisitorActor)?.name:undefined} onClose={closeExploration}/>}
  {panel==='animal'&&selectedAnimal&&<AnimalCard id={selectedAnimal} onClose={()=>{setSelectedAnimal(null);setPanel(mobileRef.current?null:'island');}}/>}
  {mobile&&['islands','patrol','tools'].includes(panel??'')&&<MobilePanel kind={panel} state={patrolState} caption={visitCaption} paused={lifePaused} onSelect={focus} onVisit={visit} onToggle={()=>{const controller=patrol.current;if(controller)controller.setPaused(!controller.snapshot().paused);}} onMotion={()=>setLifePaused(!lifePaused)} onVisitor={eggPreview?(id:string)=>navigateGuide(id,'visitor'):selectExploration} onOverview={()=>{clearPanel();setSelected(null);fit(true);}}/>}
  </div>
  <footer className="patrol-footer"><PatrolControls state={patrolState} caption={visitCaption} onToggle={() => { const controller = patrol.current; if (controller)
        controller.setPaused(!controller.snapshot().paused); }}/><a className="contact" href={process.env.NEXT_PUBLIC_BOOKING_URL || 'https://15exoticanimalhotel.com.tw/'} target="_blank" rel="noreferrer">{process.env.NEXT_PUBLIC_BOOKING_URL ? '住宿預約' : '聯絡壹伍／前往官網'} ↗</a></footer>
 </main>;
}
