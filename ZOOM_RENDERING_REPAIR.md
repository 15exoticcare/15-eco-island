# 手機縮放渲染穩定性：診斷與修復

日期：2026-10-29。分支 `fix/mobile-zoom-rendering`，基於已接受的手機 UI `9bfb8d9`。原公開 main 為 `250dd93`。使用者已在原本會閃爍的 Android 驗證修正版不再閃爍，並明確授權合併與 GitHub Pages 發布。

## 結論與限制

已確認並修正多個會增加縮放時繪製壓力的程式機制。桌機 Chromium 實驗呈現合成圖層、光柵化、layout、Sprite 節點重建與鏡頭造成的 React commits 大幅減少。

使用者已用原本會發生問題的 Android 測試修正版，回報「已經不會閃爍了」。手機型號與 Chrome 版本未提供；此結果限該裝置，不能泛稱所有 Android／iPhone 實機均已通過。Windows RTX 3060 未可靠重現原局部掉圖，因此下列 trace 證明程式機制與繪製負擔改善，沒有據此推斷特定手機驅動的失效路徑。

## 原因追蹤

1. 每筆縮放／拖曳呼叫 setCamera，讓 Experience 父元件進入 React 更新。保母每次移動也在同一個父元件更新多個 state，場景、UI 與動畫繪圖互相牽動。
2. 兔子及其他動物以 frame 作為 SVG g 的 key，每次影格切換都移除、重建包含 atlas image 的子樹。這不是整隻動物卸載，原有動物節點與運動模型通常仍在；但圖片繪圖節點會持續更換。
3. 27 隻其他動物使用當前影格 bounds 同時改變 viewBox、按鈕寬度、aspect-ratio 與錨點 transform。姿勢切換會造成不必要的幾何／裁切更新。
4. world 常駐 will-change: transform。LayerTree 可觀察到 3000×1950 的大型繪圖表面；加上 opacity 動畫與其他合成內容會提高負擔。這是圖層邊界／面積證據，沒有將它當作實際 GPU 記憶體配置量。
5. 舊 animal-pose-in/out、rabbit-new/old-pose 影格 group 使用 animation fill both。測試停用這些淡化效果時，峰值圖層從 64 降到 10；這是隔離實驗，不是修正版停用動物動畫。
6. 本站 Sprite 使用 SVG atlas 的 image x/y 位移及 clipPath，不是 CSS background-position。map overflow:clip、Sprite overflow:hidden、192／256 cell 裁切均有追蹤；未證明外層 overflow 單獨導致問題，因此沒有盲目更換裁切方式。
7. 拿掉所有 world filter 並未改善此測試的光柵化工作量，沒有據此移除原有陰影、夜色調整或美術效果。

發布前正式網站的唯讀 HTML/CSS 檢查確認也使用相同的 will-change 與舊 Sprite group 機制。

## 最小修正範圍

| 檔案 | 修改 |
| --- | --- |
| src/components/Experience.tsx | 鏡頭最新值保留在 ref，rAF 每幀合併寫入 world transform；手機連續手勢不再逐筆 setCamera。只有桌機名稱定位需同步 React。反縮放變數在同一 rAF 同步，保留原有命中範圍與訪客標記大小 |
| src/components/Caretaker.tsx | 保母畫面 state 放入獨立 LiveCaretaker；以 2D transform 定位，保留原本世界座標與 -50%／-100% 錨點。巡視控制器、路線、等待及手動排程未改 |
| src/components/AtlasFrames.tsx | 常駐目前／前一張 atlas image，不使用動態 frame key；只改 cell x/y。前一姿勢短暫淡出採可取消、結束即釋放的 Web Animation；目前影格維持可見，保留 reduced-motion |
| src/components/AnimalLife.tsx | 使用固定的全影格 union bounds，避免每個影格重新調整按鈕與 viewBox 大小；像素比例與腳部錨點不變。接入常駐 atlas 節點 |
| src/components/RabbitLife.tsx | 保留原 256 cell、動作序列與路徑，改用常駐 atlas 節點 |
| src/app/globals.css | 只將 world 的 will-change 改為 auto；沒有全面添加 translateZ、backface-visibility 或 GPU 強制屬性 |

手機介面配置、原始品牌、112 個素材、知識／壽命／圖鑑資料與動物／保母運動模型均保留。沒有降低圖片尺寸、重新壓縮、停用動畫或移除縮放。

固定 union bounds 只擴大穩定的透明裁切框，不改變每個 atlas 像素對應的世界尺寸。已驗證 27 個 atlas 每個影格、左右朝向的像素比例與錨點保持一致。

## 隔離與前後證據

獨立 production 靜態輸出測試，保留原 3030 預覽；baseline 3031 為未修改版本，candidate 3032 使用獨立建置輸出。測試環境 Windows、Edge Chromium 156、NVIDIA RTX 3060、390×844／DPR 3，**不是 Android GPU**。

相同四輪雙指手勢，共 100 次 touchMove；表中是各自完整腳本窗口的事件數，修正前約 7.48 秒、最終修正後約 5.43 秒。輸入數相同，耗時不同，不把它當作固定時長 FPS 或任何手機的效能保證。

| 指標 | 修正前 | 修正後 |
| --- | ---: | ---: |
| 峰值合成圖層 | 64 | 14 |
| RasterTask | 6,870 | 594 |
| Layout | 298 | 159 |
| SVG image 移除／重建 | 67 | 0 |
| ImageDecodeTask | 12 | 0 |
| 本窗口新增圖片請求 | 0 | 0 |
| 動物／島嶼主節點是否保留 | 是 | 是 |

另外以「暫停動態及巡視，僅縮放」隔離鏡頭：React commits 從 105 降至 2；未宣稱所有動畫開啟時 React 完全不更新，動物與保母仍須各自更新。

八組隔離：靜止全景、全場景縮放、動態暫停後縮放、只有島嶼、只有動物、無 filter、無 world will-change、無舊 blend。原始八組紀錄在 `qa/zoom-render/before-matched/` 與實驗版 `after-matched/`。最終版恢復每幀同步標記反縮放大小後，另測靜止、全場景縮放、僅鏡頭三組，數據與兩組完整 trace 位於 `after-final/`；上表採最終版結果。

連續錄影測試：兔子／鸚鵡／刺蝟場景共 12 輪雙指縮放及 12 輪拖曳，動畫與巡視持續開啟。修正前 13 個初始 Sprite 圖片節點在測試結束時已被替換、10 隻動物寬度曾改變；修正後均為 0。修正後 atlas cell 與實際模型 frame 的抽樣不一致次數為 0，37 個動物／訪客／保母節點保留；動物影格與保母位置仍持續前進。

錄影／擷取畫面可能改變瀏覽器合成行為，不能單獨排除真機 GPU 閃爍。

## 功能回歸與證據

- Chromium：320×740、360×800、390×844、430×932，完整十島、31 張動物卡、五位訪客、壽命與來源、14 種圖鑑與重置、單指拖曳／雙指縮放、橫式及高度變動。
- WebKit：四尺寸布局／巡視／代表動物／橫式，390×844 完整功能回歸；不能視為 iPhone 實機。
- 桌機原有資訊卡、巡視、地圖、圖鑑與儲存降級回歸。
- 原開發專案 58 項測試；運動／排程資料模組與素材比對。
- `qa/zoom-render/isolate.mjs`、`stress.mjs`：前後可重跑診斷。
- `qa/zoom-render/*-matched/isolation-results.json`：分組數據。
- `qa/zoom-render/*-matched/zoom-all.trace.json`、`zoom-paused.trace.json`：可載入 Chrome Performance。
- `qa/zoom-render/before-stress/continuous-pinch-drag-animation.webm` 與 `after-stress/continuous-pinch-drag-animation.webm`：連續操作錄影。
- `qa/zoom-render/regression/`：本次功能結果，與既有手機修復／第六／七階段證據分開。
- `qa/zoom-render/sprite-geometry-invariants.json`：固定框幾何驗證。
- `qa/zoom-render/ANDROID_DIAGNOSIS.md`：真機操作、USB DevTools 與採證方式。

上述 QA 與獨立建置均在 Git 忽略目錄，沒有上傳。使用者已確認 Android 原有掉圖現象消除並授權發布。部署沿用手動 workflow_dispatch，只更新 `15exoticcare/15-eco-island`，保留 basePath 與 assetUrl；不改 DNS、官網或預約系統。GitHub Actions 與線上驗證結果另存本機 `qa/zoom-render/`。
