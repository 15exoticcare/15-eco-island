# 正式版修正交付｜面板、15秒支援、難度與音訊預設

2026-11-04（台北）。原正式 main：e3236003d17080fb95b3cf64f49ca39a7ae61ad3。修正分支 fix/production-panels-balance。
可還原 tag：backup/before-panel-balance-20261104；完整 bundle：qa/production-fix/before.bundle。沿用原 workflow 手動從 main 發布；正式結果另存 qa/production-fix/DEPLOYMENT_REPORT.md。

## 修改

- 建造／升級面板改為獨立固定標頭、44×44高對比叉號及內部捲動內容，消除原透明底關閉鍵難以辨識、負 sticky offset 裁切的風險。無全畫面透明遮罩。手機 safe-area、直橫式高度限制保留。
- 地圖非互動空白點擊可關閉；移動達5px、雙指或取消手勢不會誤關。選其他塔直接切換，Escape可關閉；重新挑戰、換關、勝敗與離開時清理。
- 僅最新 chapter12 的支援冷卻覆寫為15戰鬥秒，從成功確認起算。4.4秒、八影格、160範圍傷害、Boss單次上限65與原巡視lease保持。暫停、波間等待不倒數。
- 六普通史萊姆分別增加生命；護盾80。速度、獎勵、分裂次數、治療上限、12塔價格與能力均未改。後波有限混合隊伍與連續間隔調整，敵人數與同時56上限不增加。Boss生命增加12%～25%，所有技能與素材不變。
- 修正實際找到的清場卡住：多座瞭望塔的純視覺光環不再阻止無敵人波次結束。
- 新訪客音樂ON 35%、音效ON 65%；有效按鈕點擊後才啟用。有效v1舊偏好原樣優先，不重置OFF、靜音或自訂音量。
- 同一SoundProvider保留在首頁與兩模式之上，只有一個AudioContext。首頁／選關／結算使用探索曲，戰鬥與九Boss切換原曲；前曲淡出結束才啟動後曲，不疊曲。暫停與背景立即停止／安全恢復；自動解鎖失敗不無限重試。

## 六種普通生命（未套用關卡與波次係數）

| 種類 | 生命舊→新 | 增幅 | 護盾舊→新 |
|---|---:|---:|---:|
| 綠色 | 44→58 | 31.8% | 0→0 |
| 藍色 | 30→38 | 26.7% | 0→0 |
| 紫色 | 125→166 | 32.8% | 0→0 |
| 橘色 | 68→88 | 29.4% | 0→0 |
| 黃金 | 85→110 | 29.4% | 60→80 |
| 粉紅 | 55→75 | 36.4% | 0→0 |

## 十關比較

下表為綠色生命（第一／第五波），其他普通種類使用同一關卡與波次公式；不是Boss生命倍率。

| 關卡 | 綠色第一波舊→新 | 綠色第五波舊→新 | Boss生命舊→新 | 每波普通數（保持） |
|---|---:|---:|---:|---|
| 經典中央旅宿 | 44→75.4 | 65.1→111.6 | 無 | 16／20／24／28／34 |
| 兔兔 | 38.7→51 | 57.3→75.5 | 1500→1680 | 15／18／22／26／32 |
| 天竺鼠 | 46.4→62.4 | 68.7→92.4 | 1750→1995 | 16／20／24／28／34 |
| 鸚鵡 | 48.8→67 | 72.3→99.1 | 1900→2204 | 16／20／24／28／34 |
| 倉鼠 | 51.3→71.6 | 75.9→106 | 2000→2320 | 16／20／24／28／34 |
| 刺蝟 | 53.7→76.4 | 79.4→119.2 | 2200→2596 | 16／20／24／28／34 |
| 雪貂 | 56.1→81.3 | 83→126.9 | 2150→2537 | 16／22／26／30／36 |
| 狐獴 | 58.5→86.4 | 86.6→134.8 | 2300→2760 | 16／22／26／30／36 |
| 龍貓 | 60.9→91.6 | 90.2→146.5 | 3000→3660 | 16／22／26／30／36 |
| 蜜袋鼯 | 63.4→96.9 | 93.8→158.9 | 3200→4000 | 16／22／26／30／36 |

連續基礎生成間隔五波由2.6／2.5／2.1／2.1／2.0秒改為2.45／2.3／1.95／1.8／1.65秒；後三關再×0.95。每四位原有1.3秒變化及最後Boss延遲保留。各生活區路徑、動物安全邊界及史萊姆速度均不改。

## 難度自動化比較（固定策略，非真人玩家通關率）

| 策略 | 舊版勝利／10 | 新版勝利／10 |
|---|---:|---:|
| 不建塔 | 0 | 0 |
| 前3格種子、不升級 | 1 | 0 |
| 先鋪混合塔再升級、不用支援 | 9 | 8 |
| 鋪混合塔再升級、使用支援 | 10 | 9 |
| 逐塔二級、混合塔與支援 | 10 | 10 |
| 只用保母 | 0 | 0 |

原始60場前後固定集合與逐場時間在 before-final.json、after.json；不同配置／延遲布防試驗另存 varied.json、star-boundaries.json。自然漏怪可產生1、2、3星，評分門檻沒有改。對最終關另驗證不同塔組及保母瞄準策略（glider-strategies.json、ui-policy-search.json），並保留失敗資料，不能解讀為任意配置皆可通關。

## 實際UI與限制

- 十關透過真正UI完成五波與9 Boss擊退，fast-*/results.json。這批為加速時鐘，僅驗證流程，不當效能或實際耗時證據。
- rabbit 正常時鐘UI：315.8秒、5波、20次支援、最終20／20。影片在normal-rabbit/video/。不是真人玩家試玩。
- glider 正常時鐘UI：434.8秒、5波、28次支援、最終20／20。影片在normal-final-glider/video/。不是真人玩家試玩。
- normal/ 與 normal-glider/ 保留兩場最終關失守影片／資料，沒有以改金幣或傷害強制過關。成功版將月光塔放在更有效的前段彎道，仍透過UI支付原價。
- core／combat各13組：九Boss傷害上限、第二階段、技能有限、可突破防線、六普通能力、12塔攻擊／資源／舊進度相容。
- production-fix.test.mjs：15戰鬥秒邊界、4.4動畫、暫停／波間凍結、重複拒絕、重開及多光環清場。
- support/results.json：正常時計UI精確巡視快照還原、同一位保母、八影格、15秒再召喚、暫停與觸控縮放不誤關面板；附錄影。
- panels/：320×740、390×844、430×932、1440×1000及WebKit390×844／844×390。叉號、捲動、切塔、空白關閉、拖曳保留、Escape、重開及離開；無JS錯誤或站內404。
- integration/、compat.json：雙模式、31住宿個體與14彩蛋個體（7物種）、16圖鑑、四知識／壽命來源、巡視、音量、既有星級／Boss獎章／圖鑑保存及場景清理。
- audio-browser/results.json：Chromium實際AudioContext的首次點擊、預設ON、OFF／靜音／音量跨刷新、單Context、無疊曲、背景暫停及拒絕自動播放不反覆重試；非國王Boss配樂另見 fast-parrot/results.json。
- Windows測試WebKit不提供AudioContext，因此只驗證不支援音訊時不崩潰、開關與保存；不能宣稱已驗證iPhone Safari實際音訊。本次無新增實體iPhone／Android測試。
- TypeScript與Next.js根路徑靜態匯出通過。protection.json核對原public美術、SEO、Google驗證、progress/music、Experience/Caretaker、workflow及next.config均未更動。DNS、官網及預約系統沒有操作。

## 修改檔案

- src/app/chapter12/chapter12.css
- src/app/home.css
- src/components/chapter12/CampaignGame.tsx
- src/components/chapter12/Sound.tsx
- src/components/home/ManorHome.tsx
- src/components/home/ManorSession.tsx
- src/lib/chapter12/audio.ts
- src/lib/chapter12/balance.ts
- src/lib/chapter12/bosses.ts
- src/lib/chapter12/engine.ts
- src/lib/chapter12/levels.ts
- tests/chapter12-audio.test.mjs
- tests/production-fix.test.mjs
- PRODUCTION_FIX_HANDOFF.md（本文件）

## 安全回滾

在乾淨工作區自新main開回滾分支，用git restore --source=backup/before-panel-balance-20261104 --staged --worktree -- .，建立新的恢復commit，再推送main並手動執行原pages.yml。不得force push；需要時先保存未提交工作。原正式雙模式版e323600完整保留。
