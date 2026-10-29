# 壹伍生態島美術重製第 3 階段交付

日期：2026-10-29。基準 `fe8feea`；獨立分支 `art/stage3-guinea-ferret-meerkat`。本輪僅改造天竺鼠、雪貂、狐獴三區，沒有合併 main、推送或觸發 GitHub Pages。

## 本機預覽

- 電腦：http://127.0.0.1:3030/15-eco-island/art-stage3/
- 同 Wi-Fi 手機：http://192.168.1.104:3030/15-eco-island/art-stage3/
- 核可的中央／兔兔／鸚鵡三區版本：http://127.0.0.1:3030/15-eco-island/art-review/ （手機使用區網 IP）
- 最初經典版仍在 `/15-eco-island/`。

使用者已以手機回報「都可以開啟，沒閃爍」。沒有提供裝置型號及瀏覽器版本；不把這項結果擴大成所有 Android 或 iPhone 實機通過。

3030 只服務本輪獨立建置的靜態檔，僅接受私有 IPv4 與 GET／HEAD，不開放來源碼或目錄清單。3034 供自動化檢查使用。沒有修改防火牆、正式官網、預約系統或 Gandi DNS。

## 三區成果

| 區域 | 場景 | 動物 |
| --- | --- | --- |
| 天竺鼠 | 草地、木屋與洞屋、牧草遮棚、低隧道、圍欄與柔和花草 | 焦糖白短毛、三色捲毛、黑奶油短毛、肉桂長毛四隻 |
| 雪貂 | 休憩小屋、吊床角落、圓木隧道、坡道、低平台及安全草地 | 黑貂色、香檳色、深貂色三隻 |
| 狐獴 | 半乾燥砂石、圓潤岩丘、洞穴、守望位置、草叢與獨立圍欄 | 站哨、坐姿、探索三隻 |

全部延續核可版本的斜俯視角、上左方柔光、米白／藍灰／粉棕與柔草綠色。天竺鼠與狐獴位於同一塊自然延伸地形，由外部步道串連，兩個生活範圍彼此分開；雪貂從鸚鵡區外側接出草地頸部，保留獨立安全界線。

十隻動物各有 16 格新版 atlas，共 160 格。保留毛色、耳朵、鼻子、尾巴與姿勢特徵。來源逐張目視檢查，再以連通元件擷取完整主體、等比例對位至原 cell 與腳底範圍；本輪沒有碰外框而被替換的影格。沒有拉伸動物，也沒有以單張靜圖取代整套動作。

## 已核可三區的保護

- 原 121 個 public 素材逐一比對基準內容與 SHA-256，完全一致，包括原品牌與第一輪九個新版素材。
- `DioramaGround.tsx`、`diorama.ts`、`diorama.css`、`RabbitLife.tsx`、`AtlasFrames.tsx` 未修改。
- 額外瀏覽器比對 `/art-review/` 與 `/art-stage3/`：中央地形／商標的來源與位置相同，八隻兔子／鸚鵡 atlas、呈現位置及三個對焦矩陣相同。
- 倉鼠、刺蝟、龍貓、蜜袋鼯的場景與動物素材未重製，原活動資料及目的地保留。接向龍貓的橋頭依新狐獴地形出口對位，沒有改造龍貓區。
- 知識、四則小知識、壽命資料／來源、物種 ID、圖鑑儲存 key 與格式不變。

## 道路與巡視

保留原巡視控制器，只傳入新三區對位後的路線。中心、兔兔、鸚鵡的路線資料保留，走出其既有外部出口後才進入新地形。

- 天竺鼠／狐獴新地形透過一座短木橋接向原西側出口；島內主要是地面石板步道。
- 狐獴與天竺鼠之間有一座只跨越實際溪流的短橋，已包含在新場景圖內，路線依橋面位置配置。
- 雪貂使用草地頸部與地面步道，不再使用舊的獨立浮島橋。
- 各停留點位於圍欄入口外的道路，保母不穿入洞屋或隧道牆。
- 新三區互通沒有長橋。通往尚未重製四區的既有較長橋仍保留，不在此輪擴大重製。

路線模型驗證十站皆可到達、90 組跨區路徑連通、五組程序橋面與步行段端點一致；另有一座圖內溪流短橋。100ms 模擬每步最大約 4.7 世界單位，沒有瞬移，暫停位置保持，指定巡視可排隊處理。實際網站錄影另外驗證依序抵達三區並在入口停下觀察。

## 渲染與介面

- 新頁 `/art-stage3/` 才啟用 ArtExpansion context。核可頁 `/art-review/` 與經典頁保持原模式。
- 新地形在核可場景後層；沒有重畫或覆蓋原三區素材。
- 動物與巡視模型、碰撞範圍及排程不變；新增對位只作用於新三區的呈現層。
- 沿用 requestAnimationFrame 鏡頭、LiveCaretaker、常駐 AtlasFrames；沒有新增常駐全圖 GPU 圖層或逐格重建圖片。
- 手機底部導覽、抽屜、資訊卡、縮放／拖曳及鍵盤／reduced-motion 保留。
- 僅在第 3 階段預覽將重複的大標題視覺收起並保留語意，避免它蓋住擴展地形；頁首品牌與操作入口保留。原核可頁不變。

## 檔案與素材

網站素材：`public/assets/diorama-stage3/`，包含 left-mainland.webp、ferret-garden.webp，以及 guinea-1～4、ferret-1～3、meerkat-1～3.webp，共 12 個無損 WebP。

生成工具為內建 imagegen。完整提示組：`art-source-diorama/stage3/prompts.json`；全解析度 PNG 來源與對位紀錄在同一獨立目錄，沒有覆蓋任何舊來源。

| 修改檔案 | 用途 |
| --- | --- |
| src/app/art-stage3/page.tsx | 獨立驗收入口 |
| src/components/ArtExpansion.tsx | 固定美術模式 context |
| src/components/DioramaExpansion.tsx | 新地形後層 |
| src/lib/diorama-stage3.ts | 三區對焦、呈現偏移、外部道路與橋頭 |
| src/app/diorama-stage3.css | 新三區對位、舊遮擋層切換 |
| src/components/Experience.tsx | 接入可選新模式，既有頁預設不變 |
| src/components/AnimalLife.tsx | 只為本輪十隻動物切換 atlas 路徑 |
| src/components/FieldGuide.tsx | 新三區的圖鑑縮圖，保留圖鑑資料 |
| src/components/IslandLabels.tsx | 可選地形偏移及橋面資料，原預設不變 |
| src/app/layout.tsx | 載入有作用範圍的新 CSS |

獨立建置：`qa/diorama-stage3/build`，沿用 output export、basePath 與 assetUrl，不共用正在使用的原建置輸出。

## 驗收結果與證據

結果全部存於 `qa/diorama-stage3/`，沒有覆寫先前章節或第一輪驗收。

- TypeScript 與 production 靜態匯出成功。
- Chromium：320×740、360×800、390×844、430×932，完整十區、31 卡、五訪客、四則知識與壽命來源、14 圖鑑、重置／保存／紀念卡、巡視、拖曳／雙指縮放、橫式及高度變動皆通過。
- WebKit：四種尺寸布局、巡視與代表操作；390×844 完整 31 卡及圖鑑。這是模擬，不是 iPhone 實機。
- 桌機 1440×900：31 動物卡、九組壽命來源、五訪客、巡視、圖鑑及 localStorage 不可用的降級皆通過。
- 31 個實際地圖觸控目標可點擊；關閉瀏覽器再開可保留探索紀錄。
- 連續 12 輪縮放與 12 輪拖曳同時保持動物活動：圖片節點替換 0、影格錯位 0、按鈕寬度跳動 0、37 個角色節點保留、保母持續移動；沒有破圖、404 或 JavaScript 錯誤。
- 使用者手機：已成功連線，回報沒有閃爍。

### 交付索引

- `overview-final.png`：新版六區與其餘原區域一起呈現。
- `guinea-final.png`、`ferret-final.png`、`meerkat-final.png`：新三區畫面。
- `road-connections.png`：在實際地圖上標出新三區的路線示意，彩線只供驗收，不是新增產品介面。
- `road-video/three-region-walk-and-activity.webm`：實際速度巡視與三區活動示範。
- `regression/chromium/`：手機尺寸、資訊卡、圖鑑、巡視、橫式截圖。
- `after-stress/continuous-pinch-drag-animation.webm`：連續縮放／拖曳。
- `protection-manifest.json`、`approved-view-signatures.json`：核可三區與原資料保護證據。
- `route-and-packing-results.json`、`verification-summary.json`：路線、160 格素材與完整測試結果。

## 剩餘限制

本輪是可操作的 2.5D 點陣美術版本，沒有變成可旋轉的 3D 引擎；高倍放大仍受圖片解析度限制。動作表保留既有 16 格格式與活動節奏，尚未包含額外的進出隧道或攀登平台新動作；沒有假裝動物會穿入目前未建模的設施。若未來需要這些動作，需另製 3D 骨架／更完整的逐格動畫與設施碰撞資料。

iPhone Safari 實機尚未測試。剩餘四區美術及其長橋保留，待下一輪指令。本輪到此停止，沒有正式發布授權。
