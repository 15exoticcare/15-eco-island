# 第九階段交付紀錄：連通莊園防衛戰（本機驗收版）

日期：2026-11-02。分支：`feature/chapter9-connected-manor`。尚未推送、合併或部署；正式 main 維持 `b13963a925ad5acd9235dfbd0d02a86df9d41283`。

## 還原與預覽

- 第八階段完整 commit：`364953110c19e79eadbc0d77ab416ef011eccc32`。
- 備份 tag：`backup/chapter8-complete-20261101`；完整 bundle：`qa/chapter9/chapter8-complete.bundle`。
- 第九階段桌機：<http://127.0.0.1:3043/15-eco-island/chapter9/>。
- 同 Wi-Fi：<http://192.168.1.104:3043/15-eco-island/chapter9/?review=camera-sync-2>（區網 IP 可能隨網路改變）。
- 靜態輸出獨立使用 `qa/chapter9/build/out`；根路徑輸出位於 `qa/chapter9/root-build/out`。未共用第八階段或正式站建置目錄。
- 啟動本機預覽：`node qa/chapter9/serve.mjs`；Windows 區網連線須由使用者帳號執行。未修改防火牆或 DNS。

## 本次完成

保留第八階段彎曲道路、八個原建塔點、全部三種塔與史萊姆、五波、資源、升級、暫停及勝負流程。新增四個連接段建塔點 I–L，共 12 個。移除六個無功能的外圍草地副本，保留原戰場草地。

最終路線為：原外圍入口 → 原戰場花徑 → 寬草地連接花徑 → 一座短石橋 → 刺蝟區圍欄外既有公共步道 → 旅宿前庭防護門。道路、移動與突破終點共用同一份資料；總長約 6562 世界單位，原 3795 單位終點不再扣防護值。防護門位於原前庭 `(1480,1000)`。原有溪流木橋、動物生活區、保母道路及排程都保留。

取消昨日跨過中央空隙的直路、覆蓋前庭的狹窄地形及斜橋。新石橋保持素材原始寬高比。進入較小的原有公共步道前，史萊姆連續縮至 45% 顯示尺寸；生命、速度、射程及攻擊判定仍使用相同世界座標，不重置動畫時鐘。

自由探索沒有敵人、塔防 HUD、Canvas 或遊戲迴圈；切換與重新挑戰保留原圖鑑儲存資料。防衛模式提供全景、連接花徑及旅宿入口手動鏡頭；沒有敵人追蹤搶鏡頭。

## 手機相對晃動修復

使用者提供第二段 Android 影片後，確認道路與橋梁在縮放時會相對 DOM 草地錯位。原塔防 Canvas 以約 30fps 取樣鏡頭，DOM 鏡頭則在另一個 RAF 更新，造成影格不同步。

最小修正：`Experience.paintCamera` 在套用 DOM 鏡頭後通知塔防；第九階段 Canvas 在同一 callback 使用同一組 camera 數值立即重畫。鏡頭重畫不推進模擬時間；靜止時仍維持原遊戲更新節奏。第九階段防衛鏡頭停用獨立 CSS transform 過渡，避免只有 DOM 插值。一般自由探索保留原鏡頭行為與動畫。沒有新增 GPU 加速屬性、降低原圖畫質或停用動物動畫。

同一觸控測試共 102 次鏡頭變動，三個世界錨點的最大相對誤差：修正前 26.8544 CSS px，修正後 0.001657 CSS px；大於 1px 的錯位由 102 次降為 0。這是 Chromium 模擬量測。使用者另以自己的 Android 真機回報：「已穩定，沒有相對晃動」。手機型號及 Chrome 版本未提供；未宣稱實體 iPhone 通過。

## 驗收證據（保留於 qa/chapter9）

- `model-results.json`：9 項確定性模型驗收，包括完整路線、生活區邊界、12 塔點、三種塔在連接段的實際攻擊、入口突破、五波成功及無塔失敗。2188 個路徑取樣；公用步道人物足跡使用與 renderer 相同的連續縮放計算。圍欄輪廓以現有畫面描繪，不將前庭階梯誤列為建築物。
- `legacy-model-results.json`：第八階段原 7 項遊戲測試維持通過，原關卡可獲勝。
- `play-through-results.json`：實際操作 UI 建塔及升級、五波勝利、防護值 20、6 次升級；未建塔時在旅宿入口突破（20 → 19）、警告、最終失敗及重新挑戰。加速瀏覽器時鐘，未注入敵人／資源狀態。
- `browser/results.json`：1440×1000、320×740、360×800、390×844、430×932；建塔、世界座標點擊、扣幣、防超支、20 次縮放、暫停、背景分頁需手動繼續、確認重置、模式切換不重建原 45 個動物 DOM、圖鑑進度保留、無圖片 404／JS 錯誤。
- `camera-sync-before.json`、`camera-sync-after.json`：同一組原生雙指觸控／拖曳的圖層矩陣同步誤差。
- `touch-chromium.json`：8 輪原生雙指縮放、單指拖曳、從建塔點拖曳不誤點、橫式與 Canvas。`touch-webkit.json`：WebKit 模擬手機的 Canvas、圖片與橫式；不是實體 Safari 雙指驗收。
- `exploration-regression/regression/chromium/results.json`：31 隻動物資訊卡、十區、九組壽命／四則知識、來源、巡視暫停／繼續／指定、圖鑑儲存、手機抽屜、尺寸變動與橫式。
- `exploration-regression/eggs/chromium/results.json`：桌機與手機共七種、14 隻彩蛋個體的實際點擊，16 種圖鑑、資料遷移、收集紀念卡、儲存受限情境。
- `lazy-load-results.json`：自由探索未載入遊戲實作 chunk，切換防衛才載入。
- `static-export-results.json`：根路徑與 `/15-eco-island` 兩種靜態匯出，圖片／CSS／JS、防衛素材解碼、canonical、robots、sitemap、Google 驗證檔 HTTP GET 與原始內容一致。首頁仍允許索引；第九階段為 noindex。
- `protection-results.json`：其餘 302 個原有檔案保持內容一致（圖片逐 byte；文字僅正規化 CRLF）。全部舊美術、資料、SEO、Google 驗證檔、workflow 與 main 保護。Experience 只新增可選塔防鏡頭同影格通知，差異另以 git diff 檢查。
- `phone-feedback.json`：使用者真機確認紀錄。

前後全景：`before-phone-feedback/connected-overview-1440.png`、`connected-overview-1440.png`。其他截圖：`connector-1440.png`、`gate-1440.png`、`connected-overview-390.png`、`connector-390.png`、`route-map.png`、`victory.png`、`defeat.png`。實際行走錄影與六張分段截圖位於 `journey/`；錄影是實際遊戲以加速時鐘執行，鏡頭由測試按下導覽按鈕，不是遊戲強制追蹤。

## 修改檔案

- `src/components/Experience.tsx`：可選鏡頭同影格通知，不重寫地圖。
- `src/components/defense/DefenseTrial.tsx`：第八／九階段選用各自場景配置。
- `src/components/defense/DefenseGame.tsx`：依配置載入地形／塔點、守護提示、鏡頭同步繪製與清理。
- `src/components/defense/render.ts`：新連接道路、短橋、防護門及連續顯示比例。
- `src/lib/defense/game.ts`：接受關卡配置與最後防線提示，沿用原戰鬥系統。
- `src/lib/defense/layouts.ts`：隔離保存第八階段幾何與第九階段道路、建塔點及鏡頭。
- `src/lib/defense/route.ts`：模型／畫面共用路線與顯示比例。
- `src/app/chapter9/page.tsx`、`connected.css`：獨立 noindex 試玩入口與既有手機 HUD 適配。
- `public/assets/defense-v2/connector-wide.webp`、`gate.webp`、`bridge-diagonal.webp`：新素材獨立存放。
- `CHAPTER9_HANDOFF.md`：本紀錄。

新草地使用內建 image_gen；原始候選留在 `art-source-defense9/`，最終完整提示詞與素材來源記錄在 `qa/chapter9/ASSET_PROMPTS.md`。不合格窄地形及未採用直橋保留候選，未放入公開素材。

## 剩餘限制與發布狀態

等待使用者整體美術與遊戲操作驗收。實體 iPhone Safari、不同 Android／低階手機與長時間耗電尚未實測；WebKit／桌機觸控模擬不能替代這些測試。關卡仍是第一關五波試玩，平衡可調；本場防衛戰不跨重新整理保存，原探索圖鑑照常保存。沒有帳號、後端或新增個資蒐集。

未修改正式 GitHub Pages、Gandi DNS、Search Console、官方官網或預約系統。此分支尚未推送；不得在整體驗收前自行發布。
