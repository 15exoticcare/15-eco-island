'use client';

import {useRef, useState} from 'react';
import dynamic from 'next/dynamic';
import {assetUrl} from '@/lib/public-assets.mjs';

const Session = dynamic(() => import('./ManorSession'), {
  ssr: false,
  loading: () => <p className="manor-loading" role="status">正在打開莊園的大門…</p>,
});

export default function ManorHome() {
  const [mode, setMode] = useState<'explore' | 'defense' | null>(null);
  const explore = useRef<HTMLButtonElement>(null);
  function home() {
    setMode(null);
    requestAnimationFrame(() => explore.current?.focus({preventScroll: true}));
  }
  if (mode) return <Session initialMode={mode} onHome={home}/>;

  return <main className="manor-home" data-manor-home>
    <div className="manor-home-inner">
      <header className="manor-home-brand">
        <img src={assetUrl('/assets/logo-original.jpg')} alt="壹伍非犬貓旅宿原始商標" width="64" height="64"/>
        <span>壹伍非犬貓旅宿<small>每一種特別，都值得被溫柔對待</small></span>
      </header>
      <div className="manor-home-heading">
        <p className="manor-eyebrow">WELCOME TO OUR LITTLE MANOR</p>
        <h1>壹伍特寵知識莊園</h1>
        <p>探索可愛動物的世界，或一起守護我們的莊園！</p>
      </div>
      <div className="manor-home-grid">
        <figure className="manor-home-scene">
          <div className="manor-scene-crop"><img src={assetUrl('/assets/seo/eco-island-share.jpg')} alt="壹伍中央旅宿、動物生活區與七種彩蛋環繞的立體微縮莊園" width="1200" height="630" fetchPriority="high"/></div>
          <figcaption>一座莊園，兩種相遇的方式</figcaption>
        </figure>
        <nav className="manor-mode-choices" aria-label="選擇莊園模式">
          <button ref={explore} data-enter-mode="explore" className="manor-mode-card" onClick={() => setMode('explore')}>
            <span className="manor-mode-tag">慢慢走，認識每一位朋友</span>
            <strong><span aria-hidden="true">🌿</span> 自由探索</strong>
            <span>漫遊九大動物生活區，尋找七種隱藏彩蛋，收集 16 種動物圖鑑。</span>
            <span className="manor-mode-link">走進知識莊園 <span aria-hidden="true">↗</span></span>
          </button>
          <button data-enter-mode="defense" className="manor-mode-card manor-mode-defense" onClick={() => setMode('defense')}>
            <span className="manor-mode-tag">和保母一起，守護這個家</span>
            <strong><span aria-hidden="true">🛡️</span> 莊園防衛戰</strong>
            <span>沿花徑部署防衛塔，迎戰史萊姆與九大 Boss，召喚保母緊急支援。</span>
            <span className="manor-mode-link">開始守護莊園 <span aria-hidden="true">↗</span></span>
          </button>
        </nav>
      </div>
      <footer className="manor-home-footer">探索、通關與聲音偏好保存在此瀏覽器；切換模式不會清除紀錄。</footer>
    </div>
  </main>;
}
