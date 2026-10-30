# 壹伍生態島｜最終收尾與正式更新

日期：2026-10-30。基準：第五階段 `f27b858`。工作分支 `fix/final-release-polish`。唯一發布目標：`15exoticcare/15-eco-island`。

## 完成修正

1. 中央入口改為「壹伍／非犬貓旅宿」。實際招牌為 `DioramaGround.tsx` 的可編輯字樣，沒有烘焙在建築圖片中。保留原牌面尺寸、位置、邊框、色彩及 `logo-original.jpg`，未重繪建築。資訊卡原名稱已正確，保持一致。
2. 四隻倉鼠改用原地形 `front-gardens.webp` 的 1774×887 圖片座標建立四房地面多邊形與短程節點，移除舊 CSS 個體位移。保持四個原個體、原 atlas、動作與排程，不跨房或上道路。用原圖四段前景圍欄的靜態 SVG 裁切覆層處理遮擋，覆層不攔截點擊，沒有新增或烘焙背景動物。
3. 九主物種名稱改為兔兔區、天竺鼠區、倉鼠區、鸚鵡區、刺蝟區、雪貂區、狐獴區、龍貓區、蜜袋鼯區。七彩蛋改為松鼠區、貓頭鷹區、角蛙區、守宮區、水豚區、花枝鼠區、蘇卡達龜區。地圖、手機底部區域入口、清單、卡片、圖鑑、巡視及無障礙名稱同步。編號、ID、路由及 localStorage key 不變，網站品牌仍為「壹伍生態島」。
4. 中央、九主區與七彩蛋選擇標籤移除裝飾箭頭；米白圓角、字體、編號與排版保留，文字置中。320px 的編號保持單行，主區名稱可自然換行而不截字。來源、外部連結及返回等操作箭頭保留。

正式首頁 `src/app/page.tsx` 啟用已核可的完整美術與 16 種圖鑑。舊預覽路由保留。

## 倉鼠原因與處理

- 新地形的房內地面與舊活動座標不同，舊 CSS 位移又使動物靠向前方門欄。只挪動畫面不能修正安全範圍。
- `src/lib/hamster-ground.mjs` 以整張前方地形為空間基準；四隻均為獨立 Sprite，背景未含固定倉鼠。
- 原 64 格腳底皆在 166 錨點內，無需隨意移動錨點。新版用固定完整格，維持原顯示尺寸，不隨影格改變裁切大小。
- 精確驗收發現舊裁切快取只按角色 ID 區分，多版本靜態頁面建置時可能混用 atlas 邊界。改為依 atlas 資料物件的 WeakMap，避免舊版資料污染新版及 hydration。不是隨影格清空快取。
- 控制器僅新增可選 profiles／pathSafe 注入，新版倉鼠使用新空間，其餘仍用原資料。預設模型 12,000 組快照與舊版相同。
- 保母到倉鼠區的觀察點同步轉成新空間座標，路線及排程未改。
- 60 分鐘模型中四隻均有休息、觀察、日常、準備、行走與收步，始終在各自地面，沒有跨房或瞬移。瀏覽器實際腳底與模型位置差小於 0.75 CSS px，容許次像素取整，縮放後仍一致。

## 驗收

| 範圍 | 結果 |
| --- | --- |
| TypeScript、獨立靜態匯出 | 通過；原 export、basePath、Pages workflow 保留 |
| 首頁 | 十主區、31 住宿動物、七彩蛋區／14 個體、16 種圖鑑 |
| Chromium 手機 | 320×740、360×800、390×844、430×932，各逐一測 31 卡片、十區、四知識及九壽命來源；橫式與高度切換通過 |
| WebKit | 390×844 完整住宿功能；其餘三尺寸布局、代表角色、巡視及方向／高度；四目標尺寸另驗品牌、名稱、按鈕及腳底 |
| 彩蛋 | 桌機＋四手機 Chromium、WebKit 390，逐一真實點擊 14 個體及七區；來源、分類及去重正常 |
| 圖鑑 | 16 種、刷新、真關閉重開、跨頁同步、重置確認／取消、儲存拒絕、v1→v2 遷移、16 種才出紀念卡通過；蝴蝶不解鎖水豚 |
| 住宿直接觸控 | 手機 390×844 逐一點開地圖上原 31 個角色 |
| 倉鼠 | 四房安全區、四隻行走、60 分鐘不越界、64 格錨點通過 |
| 保母 | 90 組路線、自動九區＋中央、暫停續行、手動指定、排隊及 12,000 相同快照通過 |
| 素材 | 現有 170 個 public 檔案逐一位元相同；未重製任何動物、Logo 或地形 |
| 最終縮放壓力 | DPR 3、28 輪雙指縮放＋拖曳；46 節點保留，0 圖片卸載、0 影格座標錯位、0 固定尺寸變化、0 破圖／404／JavaScript 錯誤 |
| 路徑 | basePath 下 170 個 public 素材全 HTTP 200，原及新路由正常，輸出不含來源圖、QA、環境檔或 node_modules |

本輪無法直接操作實體 Android／iPhone；Chromium／WebKit 均為桌面瀏覽器與觸控模擬，不宣稱真機 GPU 無閃爍。前幾階段的真機回覆不代替本輪實機驗收。

## 截圖與完整結果

所有結果位於獨立 `qa/final-release/`，舊階段測試保留。

- `polish/chromium/sign-close.png`、`sign-lettering.png`：招牌及原 Logo。
- 同目錄 `hamster-rooms-1440.png`：四房整體；`hamster-1-close.png` 至 `hamster-4-close.png`：各房特寫。
- 同目錄 `region-menu-320.png`、`region-menu-390.png`、`region-menu-430.png`：區域名稱與無箭頭標籤。
- `ground-results.json`：地面、錨點及素材保護。
- `polish/{chromium,webkit}/results.json`：品牌、標籤與腳底精確檢查。
- `regression/{chromium,webkit}/results.json`：完整手機回歸。
- `eggs/*/results.json` 及 `eggs/chromium/migration-storage.json`：彩蛋、圖鑑與遷移。
- `after-stress/results.json` 及 WebM：最終縮放壓力。
- `live/`：正式發布後公開網址驗收。
- `release-result.json`：本次 commit、Actions run、正式驗收及發布結果（部署後產生）。

## 發布與回復

- 正式 Repository：<https://github.com/15exoticcare/15-eco-island>。
- 原網址：<https://15exoticcare.github.io/15-eco-island/>；API 確認無自訂網域。
- 原正式 commit：`5381dd20fd12472b273fcc89722c6faef57494bd`，成功 Actions run `40878354591`。
- 已推送備份 tag：`backup/pages-before-art-release-20261030`，指向原正式 commit。
- Pages 為 workflow 類型，來源 main，僅 workflow_dispatch。驗收後才 fast-forward main，並觸發原 `.github/workflows/pages.yml`，不改部署架構。
- 若新版重大異常，可對相同 workflow dispatch 上述備份 tag，重新發布舊輸出；不改 DNS、不建立第二個網站、不用 force push 抹除歷史。回復前應核對備份 tag 仍指向 `5381dd2`。
- 沿用 Git Credential Manager 既有授權，憑證只在記憶體中使用，不寫檔或輸出。沒有新增金鑰／修改存取權。
- 官網 Repository、LINE 預約、Supabase、Vercel、Gandi DNS 不修改。

## 修改檔案

- `src/app/page.tsx`：正式首頁使用核可版本。
- `src/components/DioramaGround.tsx`：招牌。
- `src/lib/hamster-ground.mjs`、`.d.mts`：四房地面與前景。
- `src/components/AnimalLife.tsx`：空間選用、靜態前景、分版快取。
- `src/lib/animal-life.mjs`、`.d.mts`：可選空間注入。
- `src/lib/habitats.mjs`、`.d.mts`：安全路徑可選地形資料。
- `src/app/diorama-stage4.css`：移除舊倉鼠位移、加入前景層。
- `src/lib/islands.ts`、`src/lib/exploration-stage5.mjs`：顯示名稱。
- `src/components/IslandLabels.tsx`、`MobileChrome.tsx`、`IslandCard.tsx`、`AnimalCard.tsx`、`FieldGuide.tsx`、`EggScenery.tsx`、`PatrolControls.tsx`、`RabbitLife.tsx`、`Experience.tsx`：區域文字、箭頭、保母觀察點。
- `src/app/diorama-stage5.css`：標籤置中及編號不換行。
- 本文件。本輪 QA 及腳本在被忽略的 `qa/final-release/`，不加入網站輸出。
