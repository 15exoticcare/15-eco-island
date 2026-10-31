'use client';
import {assetUrl} from '../../lib/public-assets.mjs';
import { useEffect, useState } from 'react';
import Caretaker from '@/components/Caretaker';
import { gaitFrame, type Facing, STRIDE } from '@/lib/animation.mjs';
import { caretakerClips } from '@/lib/caretaker';
import Link from 'next/link';
export default function Review() {
    const [direction, setDirection] = useState<Facing>('right'), [distance, setDistance] = useState(0), [playing, setPlaying] = useState(true), [observing, setObserving] = useState(false);
    useEffect(() => { if (!playing || observing)
        return; let id = 0, last = 0; function tick(t: number) { if (last)
        setDistance(v => v + Math.min(t - last, 60) * .052); last = t; id = requestAnimationFrame(tick); } id = requestAnimationFrame(tick); return () => cancelAnimationFrame(id); }, [playing, observing]);
    const frame = gaitFrame(distance), clip = caretakerClips[direction];
    return <div className="motion-review"><Link href="/">← 回莊園</Link><h1>保母動作審閱</h1><p>正面、側面、背面各 8 格；左側使用鏡像，胸前商標另層保留原圖方向。</p><p className="review-warning">逐格播放已實作。素材仍為暫時版本：部分影格的支撐腳、對側擺臂及循環銜接不夠一致，尚未達到自然步態的正式驗收標準。</p><div className="review-controls">{(['front', 'right', 'back', 'left'] as Facing[]).map((d, i) => <button key={d} aria-pressed={direction === d} onClick={() => { setDirection(d); setObserving(false); }}>{['正面', '右側', '背面', '左側'][i]}</button>)}<button onClick={() => setPlaying(!playing)}>{playing ? '暫停換格' : '播放換格'}</button><button onClick={() => { setObserving(!observing); }}>{observing ? '返回行走' : '到站拿平板'}</button></div><div className="review-stage"><div className="contact-baseline"/><Caretaker position={{ x: 180, y: 310 }} direction={direction} distance={distance} walking={!observing} observing={observing}/></div><label>目前影格 {frame + 1} / 8 <input aria-label="逐格檢查" type="range" min="0" max="7" step="1" value={frame} onChange={e => { setPlaying(false); setObserving(false); setDistance(Number(e.target.value) * STRIDE / 8); }}/></label><div className="frame-grid">{Array.from({ length: 8 }, (_, n) => <figure key={n}><img src={assetUrl(`/assets/animation-v2/${clip.file.replace('walk-', '')}-${n}.webp`)} alt={`${direction} 第 ${n + 1} 格`}/><figcaption>{n + 1} / 8 · 腳底錨點 y=252</figcaption></figure>)}</div></div>;
}
