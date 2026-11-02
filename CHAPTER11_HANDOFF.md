# 第十一階段交付｜史萊姆國王、保母緊急支援、星級獎章與原創音訊

日期：2026-11-02。分支：`feature/chapter11-guardian-support`。**只有本機開發與驗收，未推送 main、未部署 GitHub Pages。**

## 基準、備份與預覽

- 10-D 完成基準：`422d2359cf62e89bff7df8341918967f88053fe6`；原 `feature/chapter10d-long-routes` 分支保留。
- 完整歷史備份：`qa/chapter11/chapter10d-complete.bundle`，Git bundle verify 通過。
- 正式 main 保持 `b13963a925ad5acd9235dfbd0d02a86df9d41283`。
- 電腦：<http://127.0.0.1:3050/15-eco-island/chapter11/>
- 同 Wi-Fi 手機：<http://192.168.1.104:3050/15-eco-island/chapter11/?review=keeper-layer-audio-2>
- 10-D 對照仍在 3047；3050 使用獨立 `qa/chapter11/build/out`，根路徑另在 `root-build/out` 驗證。未共用舊預覽建置輸出。
- 重新啟動：`node qa/chapter11/serve.mjs`。區網 Node 需由使用者 Windows 帳號執行；沒有更改防火牆或 DNS。
- 不同連接埠是不同瀏覽器 origin，3047／3050／正式站不會自動共用 localStorage；原資料沒有被清除。

## 需求變更確認

11-B **只保留一招主動技能：保母緊急支援**。沒有製作草葉旋風或莊園防護罩。三種基本塔、九種專屬塔及六種既有史萊姆都保留；Boss、星級、獎章、三首配樂及完整音效照原需求完成。

第十一階段是沿用 10-D 戰鬥模型的擴充版本；舊引擎與測試入口保留以供還原。第十一階段頁面只建立一個戰鬥實例，由同一個固定步進 tick 處理塔、敵人、Boss、技能動畫事件、傷害、冷卻及勝負，沒有另外跑一套技能戰鬥迴圈。大型 Experience 沒有重寫。

## 11-A｜史萊姆國王

- 獨立透明 2.5D 國王美術，皇冠、珍珠感果凍與藍灰披肩；沒有放大普通紫色圖像冒充 Boss。
- 只加入蜜袋鼯第五波最後一位。從原入口走完整條約 2682 單位道路。經典中央旅宿及其餘關卡波次不變。
- 基礎 1500 生命、72 速度，套用原關卡生命與速度倍率；本關第一階段約 3089 生命。
- **皇家護盾**：70%／35% 生命階段各一次、140 護盾、最長 6 秒，會被傷害打破或到時消失。第二階段有生命條說明及色環變化。
- **護衛**：出生後第 6／20 戰鬥秒各召喚三隻，合計最多六隻；全部由 Boss 當下的同一道路距離前進，沒有進入生活區。
- **衝刺**：第 10／29／48 秒附近發動，先預警 1.5 秒，再以 1.8 倍速度衝刺 3 秒，最多三次；不瞬移。
- 獨立 Boss 生命條、護盾數字、階段及衝刺預警；擊敗獎章只在真正被攻擊擊退時解鎖，突破入口不算擊敗。
- 抵達入口扣 20 防護值，可造成真實失敗；不影響動物。勝利時顯示「👑 史萊姆國王已被擊退！莊園守護成功！」。

證據：`qa/chapter11/boss-film/` 正常速度第五波勝利及實際音訊；`boss-loss/` 正常 UI、加速時鐘的五波突破失敗。勝利觀察到六隻護衛、兩次衝刺；失敗觀察到六隻護衛、三次衝刺。兩者均拍到護盾與第二階段。

## 11-B｜唯一主動技能與保母巡視安全

點「召喚保母」→在目前進攻道路點選落點→範圍預覽→確認／取消。鍵盤可用「瞄準道路上的敵人」選擇前方落點。無效位置、暫停、冷卻或已在施法時都不能確認，不扣資源。

- 瞄準由螢幕座標反解目前 DOM 世界矩陣，投影至本關真實道路；不按縮放後像素計算攻擊距離。
- 確認後先取得原保母控制器的唯一 lease，再開始技能。保母本人 DOM 仍是同一個，沒有複製第二位角色。
- 原控制器新增可釋放的 `hold()`；私有路徑、路程、index、剩餘停留時間及 pending 指令留在原控制器內凍結，不重建或重設。使用者原 paused 設定沒有被改動。
- 狀態為 SUMMONING → CASTING → RETURNING →正常巡視。約 4.4 秒完整流程：原處淡出、落點出現、準備／蓄力／前推／展臂／收勢、返回原位置淡入、釋放 lease。
- 專用 **八影格真實肢體姿勢**，不是整張站姿圖片旋轉、縮放或震動。每影格打包為 224×352、腳底對齊 y=336，遊戲共用 viewBox；Logo 使用原始品牌圖疊加。
- 第 2.2 戰鬥秒對有效半徑內敵人施加一次魔法傷害：基礎 160、半徑 260，均符合既有區域尺度；減速為原速度 45%、持續 3 秒。Boss 單次傷害上限 65。
- 護盾走共同魔法傷害流程；分裂只一代，當次命中不會重複掃到剛生成的小史萊姆，獎勵不重複。
- 冷卻 45 個**戰鬥秒數**，包含施法期間；遊戲暫停、背景及波間 planning 不推進。畫面顯示倒數；取消瞄準不啟動冷卻。
- 暫停同步凍結姿勢、傷害事件與冷卻。離開、換關、重來或勝負提前發生，清理 lease 並還原保母，不留下隱形人物或計時器。
- 施放不移動使用者鏡頭；點地圖建塔同樣不強制移動鏡頭。原花圃清單是明確的前往操作，維持可對焦。

### 本次真機回報與修正

使用者先回報音效太小、保母被道路遮住。原因是道路 Canvas 在 world 堆疊環境上方，保母即使位置正確仍會被蓋住。

第十一階段改為**同一位保母永久置於獨立前景層**，與地形及 Canvas 在同一 camera callback 同步矩陣。前景 z-index 16、戰場 Canvas 15；沒有複製、重建或換控制器。`guardianSupport` 為可選旗標，正式首頁與舊章節預設 false，保持舊版配置。

音效基準從 0.16 提高至 0.32（約 +6 dB），另加柔和峰值壓縮。使用者後續真機回報：**「保母完整顯示，音效合適」**。`phone-feedback.json` 保留前後紀錄，裝置／瀏覽器型號未提供。

原探索面板開啟時暫收聲音入口，避免遮住圖鑑關閉鍵；聲音解鎖提示也避開建塔與技能瞄準面板。

## 星級、獎章與遷移

- 三星：勝利防護值 ≥16；二星：8～15；一星：1～7；失敗零星。
- 每關保存最高完成波次、已通關與最佳星級。較低星級或失敗不能覆蓋較佳歷史紀錄。
- 五枚原創 SVG 獎章：初次守護者、完美守護、九區守護者、史萊姆國王剋星、壹伍特寵守護大師。可在選關頁「查看守護獎章」查看，未解鎖柔和灰化，ID 去重保存。
- 新 key `yiwu.manor-defense.campaign.v2`、version 2；讀不到時遷移 `yiwu.manor-defense.campaign.v1`。**不寫回或刪除 v1**。
- 舊通關保留、不捏造星級，顯示重玩可獲星級。新資料損毀可安全回退舊 v1；圖鑑 key／版本與資料都不變。
- 實際 UI 一星勝利 6 防護值、二星勝利 8、三星勝利 20；一星重玩後最佳仍保留二星。這些分數由正常 UI 策略自然漏敵取得，沒有改生命或金幣。

## 11-C｜三首原創多聲部配樂

| 情境 | 名稱 | 節奏 | 循環長度約 |
| --- | --- | ---: | ---: |
| 自由探索 | 壹伍莊園的早晨 | 88 BPM | 43.64 秒 |
| 一般戰鬥 | 莊園守護行動 | 108 BPM | 35.56 秒 |
| Boss | 史萊姆國王來襲 | 126 BPM | 30.48 秒 |

旋律、和聲、節奏與音色均由 `music.ts` 原創程式產生，包含鋼琴／木琴感鈴音、撥弦、和聲墊底與低音，分段旋律與音域變化；尾音回繞處理循環接縫。沒有商業歌曲、遊戲配樂、YouTube、不明來源採樣或付費音樂 API。

**音色屬程式合成，不宣稱錄音室配樂或真實樂器錄音。** 需要使用者完整試聽與審美確認。首次開音樂才合成所需音訊並快取，不在音樂關閉時持續合成，也不預先下載大型音樂檔。

可在「聲音 → 原創配樂試聽」聽三首；本機 WAV：`qa/chapter11/explore.wav`、`battle.wav`、`boss.wav`，使用同一份合成程式輸出，不是另外替代的背景歌。

## 11-D｜音效及設定

二十個可試聽事件：一般點擊、建塔、升級、種子、泡泡、星光、受擊、消散、分裂、破盾、治療、新波次、Boss 登場、召喚、傳送、蓄力、守護衝擊波、返回巡視、勝利、失敗。攻擊／受擊由引擎事件驅動，不是只在示範按鈕播放。

- 首訪音樂與音效均關閉；AudioContext 由實際點擊才建立，整頁共用一個。音訊失敗有提示且遊戲繼續。
- 音樂、音效獨立開關與音量，全部靜音保留原偏好。新 key `yiwu.manor-audio.v1`，不與圖鑑、塔防紀錄混用。
- 重新進站不硬播，必要時提示「點一下開啟莊園聲音」。切背景暫停，回來不突然出聲；戰鬥維持暫停，按繼續後依偏好恢復。
- 每類節流與合併，音效最多 16 個 oscillator voices；重要建造／Boss／勝負事件可取代低優先級。短包絡、淡出及壓縮避免刺耳堆疊。
- 場景音樂短暫交叉淡化後只留一首，不持續重疊；暫停／全部靜音會停止輸出或 suspend；頁面卸載 close。
- 音樂與音效零音量已用真實 Web Audio 訊號驗證；硬體靜音與裝置音量仍由使用者掌控，不宣稱程式能保證喇叭出聲。

## 實際影片、圖片與聲音

以下相對路徑皆在 `qa/chapter11/`：

- **`chapter11-demo.mp4`：有聲遊玩示範。** 由兩段正常速度實際 UI 遊玩剪輯：建塔／升級／一般戰鬥，以及蜜袋鼯第五波／Boss／保母技能／勝利。不是同一段未剪接完整五波影片。
- 音訊由同一場遊戲 Web Audio graph 直接內錄，不使用麥克風或系統音訊，也不是事後配一首替代歌；音畫以共同結尾對齊，約 0.1 秒容差。`video-provenance.json` 記錄剪輯資訊。
- `boss-film/game.webm` 原始影片前四波加速、第五波正常速度；`game-audio.webm` 為當時第五波實際音訊。`boss-film/with-audio.mp4` 為第五波正常速度有聲片段。
- `build-film/with-audio.mp4` 為正常速度建造、升級與戰鬥音訊；原檔均保留。
- **`skill-final/skill.mp4`** 為最新保母傳送／動作／返回近景（此單獨動作錄影無音，音效見有聲遊玩）。`cast-gallery.png` 顯示八個真實姿勢。
- `skill-final/`、`skill-cases/`、`mobile-skill/` 為圖層修正後畫面。`skill-smoke/` 是保留的早期道路遮擋證據，**不要當作最新版或還原依據**。
- `boss-film/king-entry.png`、`shield.png`、`guards.png`、`dash-warning.png`、`phase-two.png`、`support-cast.png`、`result.png`；`boss-loss/result.png`。
- `star-ui/1-stars.png`、`2-stars.png`、`3-stars.png`；三星圖來自實際全關測試。
- `audio-browser/mobile-settings.png`、`sfx-demo/effect-controls.png`；聲音設定與試聽。
- `sfx-demo/20-effects.webm` 是透過真實試聽 UI 錄製的二十項音效，順序／時間在同目錄 results.json。
- `audio-browser/actual-webaudio.webm` 是音訊設定測試中的實際訊號，包含切換／靜音片段；三首完整配樂請用前述 WAV 或網站試聽。

## 測試結果與證據

所有新證據在 `qa/chapter11/`，沒有覆寫 `qa/chapter10/` 或 `chapter10d/`。

- `core-tests.json`：12 組新機制驗證，包含走路／觀察／手動暫停 checkpoint、pending 指令、一次傷害／分裂／護盾／Boss 上限、45 秒冷卻重用、施法中勝敗清理、遷移、星級與五獎章。
- `combat-regression.json`：原十三項戰鬥能力延伸回歸，七種敵人／十二塔、穿透、彈跳、連鎖、連射、範圍、支援、分裂、護盾、治療、成本及進度。
- `audio-core.json`：受控 AudioContext fixture 驗證並發 16、頻率限制、重要音效優先、靜音／close；另檢查三首 PCM RMS、峰值與循環接縫。fixture 不作為硬體聽見的證據。
- `all-levels/results.json`、`storage-reload.json`：十關各五波共 50 波實際 UI 通關、跨關與刷新保存、原圖鑑 JSON bytes 不變。此全關回歸使用加速時鐘，不拿來宣稱正常遊玩耗時。
- `boss-film/results.json`、`boss-loss/results.json`：正常 UI Boss 勝利與真正突破入口失敗、三種能力、Boss 戰技能與精確巡視還原；第五波勝利錄影為正常速度。
- `skill-cases/results.json`：六種實際 UI 情境：行走中遊戲暫停、原手動暫停、停留觀察、離開模式、換關、重新挑戰；同一 DOM、精確 checkpoint、沒有遺留人物。
- `mobile-skill/results.json`：縮放後實際觸控座標、無效點、雙指縮放保持指定世界點、取消不進冷卻、快速連按只施放一次、模擬 visibility 同步凍結與手動恢復、前景層級正確。
- `mobile-skill-reuse/results.json`：上述手機流程另驗證 45 戰鬥秒後可第二次實際確認，畫面外落點不搶鏡頭，仍只有同一位保母。
- `win-cast-timed/cast-restore.json`：正常 UI 五波勝利在施法第 3 秒發生，早於 4.4 秒自然結束，確認即時清理並還原。使用加速時鐘。
- `star-ui/results.json`：自然漏敵取得一星／二星，較低成績不覆寫最佳；舊 v1 原字串保留。三星在全關結果。
- `audio-browser/results.json`：真實 AudioContext 數位訊號，三首配樂與音效、音量零輸出、獨立開關、全部靜音、刷新保存及首次不自動播放。
- `audio-game-state.json`：戰鬥暫停、背景事件、手動繼續、回探索音樂與單一 Context／無持續重疊。
- `sfx-demo/results.json`：二十個真實 UI 音效試聽與內錄。
- `native-mobile/results.json`：320×740、360×800、390×844、430×932、1440×1000 建塔／升級／扣款／換關／原角色保留。
- `camera-sync-after.json`：102 次鏡頭變動；Canvas 最大相對偏差約 0.002367 CSS px，保母前景層約 0.003754 CSS px，均低於 0.03px 驗收界線（桌機觸控模擬）。
- `exploration-regression/`：31 隻住宿動物資訊卡、四則知識與壽命來源、七種彩蛋／14 個個體、16 圖鑑與進度／紀念卡、巡視、手機抽屜、橫式與尺寸變化。
- `patrol-baseline-comparison.json`：未使用技能時，與 10-D 原巡視控制器逐一比對 20,000 次 tick（1000 模擬秒），含手動暫停／繼續／指定，snapshot 全部相同。
- `static-export-results.json`：根路徑及 `/15-eco-island` 靜態匯出，TypeScript／Next 建置通過；圖片、CSS、JS 無 404，九張新素材逐一 GET 比對，canonical／robots／sitemap／Google 驗證正常。正式首頁可索引，chapter11 noindex。
- `protection.json`：10-D 343 個追蹤檔中 339 個未變；僅四個原檔為保母整合而修改。十個地圖／道路／塔點布局完全相同，原美術及部署／SEO 設定未動。
- `phone-feedback.json`：使用者真機確認「保母完整顯示，音效合適」。不是所有裝置或長時間效能保證。

可維護命令：`node tests/chapter11-core.test.mjs`、`node tests/chapter11-combat.test.mjs`、`node tests/chapter11-audio.test.mjs`。使用目前專案 Node 24 的 TypeScript strip 支援。

## 修改檔案與素材

原檔僅四個：

- `src/lib/patrol.mjs`／`patrol.d.mts`：checkpoint、可重入且冪等釋放的 hold；未使用時原行為不變。
- `src/components/Experience.tsx`：原控制器 lease 事件橋接，以及 chapter11 可選的鏡頭同步保母前景層。
- `src/components/Caretaker.tsx`：同一個角色支援專用影格與傳送狀態；正常行走／觀察分支保留。

新增：

- `src/lib/chapter11/balance.ts`、`levels.ts`、`engine.ts`、`progress.ts`、`music.ts`、`audio.ts`。
- `src/components/chapter11/CampaignTrial.tsx`、`CampaignGame.tsx`、`render.ts`、`Sound.tsx`、`Medals.tsx`。
- `src/app/chapter11/page.tsx`、`chapter11.css`。
- `public/assets/chapter11/slime-king.webp`、`cast-0.webp` 至 `cast-7.webp`。
- `tests/chapter11-core.test.mjs`、`chapter11-combat.test.mjs`、`chapter11-audio.test.mjs`。
- `CHAPTER11_HANDOFF.md`。

九張新公開美術以內建 image_gen 製作，沒有使用 CLI／API 金鑰。輸入是原保母觀察素材；原始候選及選用 PNG 分別保留於 `art-source-chapter11/`。完整提示詞、工具、參考及輸出路徑：`qa/chapter11/art-prompts.json`；打包與 Logo／錨點資料：`art-manifest.json`。沒有覆蓋任何原美術。

配樂與音效為本專案原創程式合成，沒有外來音樂採樣或額外授權服務。SVG 獎章為程式原創圖示。原始候選、QA 影音、建置暫存與備份不在 public，Git ignore 保留；公開執行不需要金鑰、帳號、後端或會員。

## 限制及待驗收

- 這是可玩測試版；Boss 難度、技能平衡、配樂審美與長期重玩性仍待使用者完整試玩，並非最終平衡宣告。
- 保母施法為八個專用 2.5D 影格，不是完整 3D 骨架或全方向動作資產。
- 程式合成音色不等同專業錄音室樂器音源；首次啟用新曲會合成並快取，低階手機首次切曲效能仍需觀察。
- 真機回報只涵蓋使用者當次可開啟、保母顯示與音效音量。**實體 iPhone Safari、其他低階手機、長時間負載、實際系統音量／鎖屏／網址列變化並未完成全面實機驗收。** WebKit 與 visibility 事件測試不是實體 Safari／鎖屏測試。
- 舊預覽與正式站 origin 不同，本機紀錄不跨站同步；沒有清除正式站紀錄。音訊被系統阻止時不強行播放。
- 測試頁獨立在 `/chapter11/`，正式首頁仍保持既有版本。不得自行合併 main、推送或部署，不改 Gandi、正式官網、LINE 預約或 Search Console。

最終彙整：qa/chapter11/FINAL_REPORT.json。獎章手機畫面 medals-ui/earned-medals-mobile.png 使用 Boss 正常 UI 勝利後的實際保存資料，在隔離瀏覽器還原；五種獎章存在，其中三種已獲得，Escape 關閉通過。
