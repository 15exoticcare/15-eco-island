# 第 8 階段｜莊園防衛戰：第一張可玩測試關卡

交付日期：2026-11-01（Asia/Taipei）。僅本機開發，未發布。

## 版本與入口

- Repository：15exoticcare/15-eco-island。
- 正式基準：b13963a925ad5acd9235dfbd0d02a86df9d41283。
- 開發分支：feature/chapter8-manor-defense；main 不動、不推送、不部署。
- 備份標籤：backup/pre-defense-20261101；完整 Git bundle：qa/chapter8/production-backup.bundle，已 verify。
- 桌機：http://127.0.0.1:3042/15-eco-island/chapter8/
- 同 Wi-Fi：http://192.168.1.104:3042/15-eco-island/chapter8/
- 進入後可切換「自由探索」／「莊園防衛戰」。遊戲放在獨立測試頁；正式首頁尚未加入遊戲入口。
- 預覽為 qa/chapter8/build/out 的獨立 Next.js 靜態匯出，不共用其他預覽輸出。

## 操作

1. 選「莊園防衛戰」，按「開始遊戲」。初始 150 陽光幣、20 防護值。
2. 點地圖花圃或 A–H 清單，建造防衛塔。清單可水平滑動，鏡頭會移至所選花圃。
3. 按「開始第一波」。波次結束後可補塔、升級，手動開始下一波。
4. 可暫停／繼續、重新挑戰；重新挑戰有確認，確認期間遊戲暫停。
5. 「入口花徑」「中央花徑」「莊園防線」可快速移鏡，＋／−、雙指縮放及拖曳沿用原鏡頭。「全景」顯示擴建範圍。
6. 鍵盤可操作所有按鈕；地圖方向鍵、＋／−、Home 保留，Escape 關閉建塔選單。prefers-reduced-motion 關閉史萊姆彈性形變。

## 可玩內容與規則

- 1 張關卡，1 條外圍石板道路，8 個固定建塔點，5 波共 62 隻史萊姆。
- 綠色：生命 44、速度 115、獎勵 12、抵線扣 2。
- 藍色：生命 30、速度 175、獎勵 14、抵線扣 1。
- 紫色：生命 125、速度 82、獎勵 24、抵線扣 4。
- 每波生命倍率逐步增加 20%；數量 6／9／12／15／20，生成間隔漸縮。
- 種子射手塔：55 幣，單體 24 傷害，射程 470，間隔 .85 秒。
- 泡泡減速塔：65 幣，9 傷害，射程 450，減速至 55% 持續 2 秒。
- 星光魔法塔：90 幣，25 傷害，射程 460，命中點半徑 160 範圍傷害。
- 塔最高 3 級；升級增加傷害／射程並縮短間隔。費用、傷害及生命皆為第一版平衡設定。
- 有真正的目標選擇、飛行投射物與命中判定，不是預先播放勝負動畫。史萊姆僅走道路，從未進入動物區。
- 五波守住即勝；防護值 0 即敗，沒有動物受傷、死亡或血腥畫面。

## 架構與效能

唯一修改的既有程式是 src/components/Experience.tsx：新增可選 MapExtension 插槽、擴充世界邊界、鏡頭請求與擴建模式的縮放限制。探索模式仍使用原本 world 與 zoomAt；巡視排程、動物控制器與資料完全未改。

新增模組：

- src/lib/defense/world.ts：擴建模式幾何範圍。
- src/lib/defense/game.ts：純確定性模型，生成、路徑、資源、建塔／升級、攻擊、命中、減速、波次、勝敗。
- src/components/defense/render.ts：Canvas 地圖道路、角色、塔、射程、生命與投射物特效。
- src/components/defense/DefenseGame.tsx：單一遊戲時鐘與介面／觸控建塔整合。
- src/components/defense/DefenseTrial.tsx：雙模式測試入口，動態載入遊戲。
- src/app/chapter8/page.tsx、defense.css：測試路由與獨立介面。
- public/assets/defense-v1/：7 個新製 WebP，約 734 KB，與原素材分開。

Canvas 位於地圖視窗，依原 world 變換矩陣繪製；不是巨大的世界尺寸 Canvas。DPR 上限 1.5，戰鬥畫面約 30fps，鏡頭仍走原 rAF 更新。React 不每幀更新整張地圖；僅遊戲 HUD 在狀態變更時更新。原動物與保母 DOM 不卸載。

自由探索首次進入不請求遊戲實作 chunk 或塔防素材；切出防衛戰會取消遊戲 rAF、observer 與事件，停止計算。背景分頁會暫停，回來須按「繼續」，單步時間最多 .05 秒，避免時間跳躍。

新外圍地形使用 imagegen 製作的獨立微縮草地／樹林模組。中央、九大物種、七區探索場景全部未搬動。道路與塔基逐點對照新地形，8 塔基與 109 路徑取樣均有地表支撐，另保留完整視覺截圖。

## 檢查與證據

QA 位於本機 qa/chapter8/（既有 ignore 規則保留本機，不上傳測試暫存或原始生成圖）：

- model-results.json：7 組模型驗證，合法建塔／升級策略守住五波，無塔確實失敗；涵蓋扣款、重複建造、射程、減速、範圍傷害、暫停、時間限制、重新開始。
- play-through-results.json：實際瀏覽器透過正常 UI 建塔、升級、五波勝利、重置、無塔失敗。僅加速瀏覽器時鐘，沒有注入遊戲狀態或免費金幣。
- browser/results.json：桌機 1440×1000；手機模擬 320×740／360×800／390×844／430×932。建塔、資源不足、相機命中、跨模式 DOM 與圖鑑保留、確認重置通過。
- touch-chromium.json／touch-webkit.json：Chromium 與 WebKit 模擬、橫式檢查；Chromium 8 輪真正雙指事件、由塔基拖曳不誤點擊。
- exploration-regression/：原有 31 張動物資訊卡、10 區導覽、九種壽命與來源、每區四則知識、七區 14 隻彩蛋身體點擊、16 種圖鑑、刷新／重置／跨分頁／舊版進度遷移、保母暫停／繼續／指定、手機拖曳／縮放及橫式回歸通過。
- lazy-load-results.json：實際網路檢查自由探索未載入遊戲 chunk，選模式才請求。
- protection-results.json：172 個既有公開資產逐 byte 保留，其餘 119 檔文字／設定比對保留；Google 驗證檔 53 bytes 與原 SHA-256 不變。robots.txt、sitemap.xml、SEO、Pages workflow、Next 設定、storage key 全部不動。
- build/out、root-build/out：/15-eco-island 與空 basePath 均靜態匯出成功；TypeScript 通過。測試頁 noindex，不加入 sitemap。
- full-map.png、artboard.png、action-*.png、build-*.png、victory.png、defeat.png、phone-demo.webm：整體地圖、素材、實際遊戲、手機模擬操作示範。
- art-source-defense/PROMPTS.md：內建 imagegen 工具與完整提示詞、原圖、裁切、WebP 編碼方式；來源另行保存，沒有覆蓋原素材。

## 手機連線與實機範圍

使用者最初回報電腦可玩、手機連線逾時。查明 Windows 有針對隔離帳號的入站封鎖規則，改由使用者 evanz 執行同一份唯讀靜態伺服器後，使用者已明確回覆「可以連上並遊玩」。未修改防火牆、DNS 或建立公開隧道。

這是使用者的手機試玩確認；未提供機型／瀏覽器版本，未把模擬結果當成所有 Android／iPhone 真機驗收，也未宣稱長時間效能或所有機型的閃爍問題都已驗收。

如需進一步 Android 診斷：同 Wi-Fi 開本機網址，手機 Chrome 開啟開發者 USB 偵錯，電腦 Chrome 的 chrome://inspect/#devices 選對應頁面 Inspect。在 Performance 錄製約 15 秒：開始一波、連續雙指放大／縮小及拖曳；同時檢查 Console／Network 是否有錯誤、圖片重新下載或長任務。記錄手機型號、Chrome 版本與操作區段。此流程只診斷本機預覽，不需修改正式網站。

## 第一版限制與待驗收

- 只有第一關、一個入口及一條進攻道路；其他外圍綠地供視覺延伸，沒有提前開發其他關卡。
- 防衛戰本場暫不保存，離開模式／重新整理會重開；16 種探索圖鑑持續保存，兩模式切換不清除。測試站與正式站因瀏覽器 origin 不同，各自保有探索紀錄。
- 塔目前固定朝向；升級以真實數值、射程與等級徽記呈現，尚無不同等級造型或轉向影格。史萊姆用新製單體素材與輕微彈性形變，非逐格 Sprite 動作。
- 遊戲平衡、全景下較小的世界標記與手機橫式資訊密度仍待使用者體驗確認。可透過下方 A–H 清單及花徑分區聚焦操作。
- 原始生成圖及新道路風格已完成第一版視覺檢查，但整體美術是否最終採用仍由使用者驗收。
- 不新增會員、後端、雲端存檔、金流或現實獎勵。未改原官網、預約系統、Supabase、Vercel、Gandi 或正式網域。

下一步：等待使用者驗收地圖、美術與遊戲體驗；本階段完成後停止，不自動部署。
