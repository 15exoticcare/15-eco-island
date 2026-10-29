'use client';
import {assetUrl} from '../../lib/public-assets.mjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RabbitSprite } from '@/components/RabbitLife';
import { createRabbitLife, rabbitProfiles, type RabbitView } from '@/lib/rabbit-life.mjs';
export default function RabbitReview() {
    const [playing, setPlaying] = useState(false), [frame, setFrame] = useState(16), [selected, setSelected] = useState('white');
    const initial = createRabbitLife().snapshot();
    useEffect(() => { if (!playing)
        return; let handle = 0, last: number | null = null, time = 0; const loop = (now: number) => { if (!document.hidden) {
        time += last === null ? 0 : Math.min(100, now - last);
        setFrame(16 + Math.floor(time / 1050 * 8) % 8);
    } last = now; handle = requestAnimationFrame(loop); }; handle = requestAnimationFrame(loop); return () => cancelAnimationFrame(handle); }, [playing]);
    return <main className="rabbit-review"><Link href="/">← 返回生態島</Link><h1>兔兔影格檢視</h1><p>四隻兔子各有 24 格角色圖。16–23 是八階段短跳；0–15 是待機、觀察與個別動作。這裡不移動角色座標，方便檢查身體與四肢確實在變化。虛線為腳底基準；懸空影格保留少量離地高度。</p>
 <div className="rabbit-review-controls"><button onClick={() => setPlaying(!playing)}>{playing ? '暫停影格播放' : '播放八影格短跳'}</button><label>目前影格 {frame}<input aria-label="兔子影格" type="range" min="0" max="23" value={frame} onChange={e => { setPlaying(false); setFrame(+e.target.value); }}/></label></div>
 <div className="rabbit-review-grid">{rabbitProfiles.map((p, i) => <figure key={p.id}><div className="rabbit-review-stage"><div className="rabbit-foot-line"/><RabbitSprite rabbit={{ ...initial[i], state: frame >= 16 ? 'move' : 'rest', frame, blend: 0 } as RabbitView}/></div><figcaption>{p.name} · 影格 {frame}</figcaption></figure>)}</div>
 <p>新製序列仍為待品牌與動畫美術終審的候選素材；沒有額外的背面方向、完整轉身或更高影格率跑步。</p>
 <label>檢查整張序列 <select value={selected} onChange={e => setSelected(e.target.value)}>{rabbitProfiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><img className="rabbit-full-atlas" src={assetUrl(`/assets/rabbit-life/${selected}.webp`)} alt="兔子角色影格，四欄六列"/>
 </main>;
}
