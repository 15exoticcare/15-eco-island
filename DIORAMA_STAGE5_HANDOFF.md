# 壹伍生態島美術重製第 5 階段交付

日期：2026-10-30（Asia/Taipei）。基準 `b1451bd`；獨立分支 `art/stage5-seven-exploration-islands`。本輪完成七座周邊彩蛋島、14 隻獨立彩蛋角色及 16 種圖鑑。停留本機驗收，沒有推送、合併 main 或觸發 GitHub Pages。

## 互動預覽與檔案

- 電腦：http://127.0.0.1:3030/15-eco-island/art-stage5/
- 同 Wi-Fi 手機：http://192.168.1.104:3030/15-eco-island/art-stage5/
- 原核可第 4 階段：http://127.0.0.1:3030/15-eco-island/art-stage4/ （手機改用上述區網 IP）
- 完整圖文驗收：`qa/diorama-stage5/review.html`。
- 機器驗收彙總：`qa/diorama-stage5/acceptance-results.json`。
- 動物活動影片：`qa/diorama-stage5/seven-islands-natural-activities.webm`。
- 縮放壓力影片：`qa/diorama-stage5/after-stress/continuous-pinch-drag-animation.webm`。

3030 僅提供獨立靜態匯出；接受私有 IPv4 的 GET／HEAD，不提供來源碼及目錄清單。測試用伺服器為 3036。沒有改防火牆、正式官網、LINE 預約、Supabase、Gandi 或任何發布設定。電腦或預覽程序關閉後，區網預覽不會繼續提供服務。

手機操作：右下「更多探索工具」→選彩蛋島→點擊動物或小島開卡。選單本身只聚焦、不解鎖。所有新增介面只於 `/art-stage5/` 啟用；保留舊路由供對照。

## 七島美術與數量

| 彩蛋島 | 獨立個體 | 場景及動物 |
| --- | ---: | --- |
| 松鼠森林島 | 3 | 樹洞、厚草地、樹幹與落葉；觀察、短距離探索、理毛三個角色，分別製作 atlas |
| 貓頭鷹樹屋島 | 1 | 分層樹屋、苔蘚、自然枝幹；一隻站在枝上觀察，數量與原版相同 |
| 角蛙苔森島 | 3 | 三個以實體石牆分隔的小棲地，各有藏身角落；綠、棕、奶油金三個體，沒有共居動線 |
| 守宮苔岩島 | 1 | 岩台、洞穴、枝木與自然植栽；四肢、長尾輪廓可辨，數量與原版相同；知識維持守宮群體通用範圍 |
| 水豚湖畔島 | 2 | 全新湖岸、池水與淺灘場景；岸邊休息與湖畔探索兩個體；於本輪完全取代蝴蝶入口／項目 |
| 花枝鼠木屋島 | 2 | 全新木屋、低隧道、花草及探索場地；黑白、灰白兩個長尾個體，可獨立點擊與活動 |
| 蘇卡達龜草原島 | 2 | 全新半乾燥草原、沙土、岩石、洞穴及遮蔭棚；厚肢、背甲鱗板與陸龜體型，慢行及休息兩個體 |

貓頭鷹與守宮數量從原資料及瀏覽器 DOM 雙重核對：各 1 隻，結果在 `baseline-counts.json`。七島總共 14 隻彩蛋角色；另保留 31 隻住宿動物及 1 位保母，合計 46 個角色 DOM 節點。

七張背景均未烘焙動物；不靠背景多畫動物充數。14 個角色各有固定 ID、獨立位置、獨立圖檔與活動時間表。四個可步行個體為松鼠 2、水豚 2、花枝鼠 1、蘇卡達龜 1；其餘以觀察、眨眼、整理與微小姿勢變化為主。短距離行走使用實際八影格步態；不以整張靜圖漂移冒充動作。蘇卡達龜走動採約 2.5 世界像素／2.9 秒的步幅。

三角蛙不跨越分隔棲地；四個步行角色只在美術核對過的短安全草地段往返。點擊途中行走角色會於當前位置收步，再觀察，不瞬移回原點。

## 新位置配置及主地圖保護

| 小島 | 地形左上 x／y | 地形寬×高 |
| --- | --- | --- |
| 松鼠 | -430／180 | 400×266.7 |
| 貓頭鷹 | 1280／-120 | 400×266.7 |
| 角蛙 | 160／1250 | 430×286.7 |
| 守宮 | 1030／1880 | 420×280 |
| 水豚 | 2600／80 | 580×386.7 |
| 花枝鼠 | -390／1260 | 430×286.7 |
| 蘇卡達龜 | 2420／1410 | 580×386.7 |

採不規則外圍分布，水豚與蘇卡達龜保留較大空間。七個完整矩形範圍與所有主地形完整矩形、彼此均不相交；比只比較透明輪廓更保守。未新增任何橋梁或保母支路。

最小必要調整為擴大周邊鏡頭邊界至 3760×2440、全景中心 1390／1010。主地圖、主區點擊座標、道路、31 隻住宿動物及保母路線完全不動。全景因涵蓋七島，主地圖呈現會比第 4 階段縮小；點擊十島導覽後，原焦點與縮放保持一致。

彩蛋聚焦於手機預留底部卡片空間，整張所選島可見；桌機使用既有左側十島導覽排列，避免原浮動標籤連線穿越小島特寫，右側知識卡保持可讀。沒有重新設計手機導覽。

主地圖保護證據：

- 基準 `b1451bd` 中 149 個 public 檔案逐一比對位元與 SHA-256，全部相同。
- `approved-view-signatures.json` 比較 `/art-stage4/` 與 `/art-stage5/`：原地形／品牌位置、31 隻角色 atlas／位置及全部十島鏡頭目標一致。
- `protection-manifest.json` 檢查 26 個受保護模組：主地形、四套地形資料／CSS、原動物生命週期、棲地、保母排程與路由、知識、壽命、原版圖鑑、手機 CSS、basePath 工具及 Pages workflow 都未改。
- 正式 main 仍為 `5381dd20fd12472b273fcc89722c6faef57494bd`。

## 16 種圖鑑及舊紀錄遷移

九住宿物種沿用原 ID、介紹、知識、壽命與來源。新增彩蛋目錄為松鼠、貓頭鷹、角蛙、守宮、水豚、花枝鼠、蘇卡達龜。兩個分類顯示「壹伍住宿物種」及「彩蛋探索」。新彩蛋未接入房型、價格或預約系統。

新版卡片、圖鑑與手機／桌機彩蛋導覽均移除指定服務警語及同義文字。舊版比較路由保留歷史資料與原介面，新版本沒有這些警語。

原版 key 為 `yiwu.eco-island.field-guide`（version 1）。新版使用 `yiwu.eco-island.field-guide.v2`（version 2），保留舊 key 不寫入，避免另一個開著的舊版比較分頁將新資料降版。僅在 v2 key 不存在時進行一次 v1 遷移。

| 舊紀錄 | 新紀錄 |
| --- | --- |
| 九住宿物種 | 原樣保留 |
| squirrel、owl | 原樣保留 |
| frog | horned-frog（角蛙） |
| gecko | ID 保留，顯示名稱改守宮 |
| butterfly | 不遷入水豚，從新版名單排除 |
| capybara、fancy-rat、sulcata | 必須新實際點擊，不從 v1 補發 |

原 14 種全收集會成為 13／16，不會直接清空。遷移不播放首次發現或完成獎勵。新版多隻同種只計一次；只有 16 種全解鎖才達成紀念卡。

已驗證刷新、真正關閉與重開瀏覽器、跨分頁同步、取消／確認重置、重置後不從 v1 復活、儲存遭拒時記憶體探索可用，以及未知未來版本不被覆寫。不同埠與不同網域屬於不同 localStorage；3030 本機進度不會自動同步正式 GitHub Pages，日後在原正式 origin 上線才會遷移該處舊紀錄。v2 遷移後，後續舊版分頁的新探索不會持續合併進 v2，以免重置後舊紀錄反覆復活。

## 縮放與動畫保護

沿用既有已修復的鏡頭 requestAnimationFrame／直接 transform 更新，以及 `AtlasFrames` 固定圖像、SVG 裁切及兩層影格混合。沒有更換核心、停用動畫、降低主島畫質或大量增加 GPU 圖層提示。

14 個新 atlas 使用 192×192 單格、4×4／16 影格、768×768 無損 WebP。相同個體所有影格採一致縮放、落腳點 96／176；每個角色使用獨立 clip ID。`EggScenery` 與個體使用 memo，鏡頭變化不卸載動畫；角色只有影格、活動狀態、朝向或位置真的變更才更新。隱藏分頁及 prefers-reduced-motion 沿用生命週期處理。沒有新增 filter、will-change 或 translateZ。

## 美術來源、候選與授權

本輪使用內建 `image_gen`，延續先前工具，不使用需額外 API key 的外部服務。來源檔獨立保存在 `art-source-diorama/stage5/`，正式輸出僅在 `public/assets/diorama-stage5/`；原素材全部保留。

- 七個地形 WebP，原生 1536×1024、透明背景，沒有縮小地形來源。
- 十四個角色 atlas WebP、224 個完整影格。無損輸出合計約 18.84 MiB；原始 PNG 不加入靜態匯出。
- `asset-inventory.json` 列 21 個輸出的大小、尺寸、SHA-256 與對應 PNG；`packing-manifest.json` 記錄每個影格的原始／包裝邊界及統一縮放。
- 兩個原花枝鼠候選的鬍鬚／尾巴連到相鄰影格，只辨識出 15 個獨立物件，**未採用**。保留為 `fancy-rat-1-atlas-candidate-a.png`、`fancy-rat-2-atlas-candidate-a.png`；另生成增加透明間距的版本，兩組最終皆為完整 16 個物件，沒有裁切或借用鄰格補洞。
- 最終 224 格均非空、在格內、未裁到來源邊界。視覺核對未發現明顯多肢、錯物種或畸形；生成影格仍需使用者美術驗收，不能把自動邊界檢查當成解剖保證。
- `art-source-diorama/stage5/prompts.json` 保存最終 21 組生成紀錄及兩個排除候選的完整 prompt、來源路徑和原因；QA 資料亦保存逐次生成紀錄。模式為 built-in image_gen。

2026-10-30 查閱 [OpenAI Terms of Use](https://openai.com/policies/terms-of-use/)，頁面生效日期 2026-01-01。內容條款規定在法律允許範圍，使用者與 OpenAI 之間的輸出所有權歸使用者，並要求使用者有輸入權利、遵守政策與他人權利；未見此輸出僅限非商業展示的限制。本輪以既有核可美術作風格參考，未引入第三方圖庫。這不表示 AI 輸出具有排他的著作權或保證不與他人作品相似。

## 七種小知識來源

核對日期 2026-10-30。只加入自然史小知識，不新增飼養醫療建議或未核對的壽命資料；新來源在卡片及圖鑑均可展開。

| 物種 | 知識要點 | 原始來源 |
| --- | --- | --- |
| 松鼠 | 紅松鼠長尾協助樹枝間平衡 | [Mammal Society](https://mammal.org.uk/british-mammals/red-squirrel) |
| 貓頭鷹 | 眼睛不易在眼窩中轉動，轉頭觀察 | [BTO](https://www.bto.org/learn/about-birds/owls/vision) |
| 角蛙 | 等待獵物接近的伏擊覓食 | [Smithsonian National Zoo](https://nationalzoo.si.edu/animals/cranwells-horned-frog) |
| 守宮 | 不同種類有不同晝夜活動時間 | [San Diego Zoo Wildlife Explorers](https://sdzwildlifeexplorers.org/animals/gecko) |
| 水豚 | 最大現生齧齒類，腳趾略有蹼 | [San Diego Zoo](https://animals.sandiegozoo.org/animals/capybara) |
| 花枝鼠 | 敏感鬍鬚協助探索周圍 | [RSPCA](https://www.rspca.org.uk/adviceandwelfare/pets/rodents/rats/behaviour) |
| 蘇卡達龜 | 利用地下洞穴避開極端溫度 | [San Diego Zoo](https://animals.sandiegozoo.org/animals/african-spurred-tortoise) |

## 驗收結果

| 驗收範圍 | 結果及證據 |
| --- | --- |
| 數量／布局／活動模型 | 七島 14 個體、9＋7＝16；完整地形矩形無交疊；60 分鐘模擬不越界／不互相重疊；14 個體各有影格變化，四個體有步行，暫停與減少動態不跳動。`model-results.json` |
| 桌機及彩蛋直接點擊 | Chromium 1440×900、320×740、360×800、390×844、430×932，以及 WebKit 390×844：每個尺寸逐一點擊 14 隻實際身體及七島地形；卡片、名稱、來源與圖鑑去重正確；手機整座島保持在卡片上方。`eggs/*/results.json` |
| 住宿角色與原知識 | Chromium 四手機尺寸各測全部 31 卡片、十島聚焦、四知識、九物種壽命列與來源；WebKit 390×844 做相同完整驗收，另三尺寸做布局、代表角色、巡視、橫式及高度切換。`regression/*/results.json` |
| 實際觸控區 | 390×844 逐一從原動物圖像點開全部 31 張卡片，使用 elementFromPoint 檢查真的命中角色，無強制繞過覆蓋。`regression/direct-animal-taps.json` |
| 圖鑑／儲存 | 16 項、9／7 分類、所有舊知識壽命來源、七新知識來源、取消／確認重置、跨頁同步、刷新、真關閉重開、儲存拒絕及 v1→v2 遷移通過；14／15 種無獎勵、16 種才獎勵。`eggs/chromium/migration-storage.json`、`regression/browser-restart-results.json` |
| 巡視 | 90 組跨區路線、九物種＋中央自動巡視、暫停續行、手動指定與安全排隊；無瞬移、原短橋捷徑保留；12,000 組舊排程快照相同。`route-and-packing-results.json` |
| 手機操作／方向 | 四尺寸 Chromium/WebKit 檢查橫式、模擬網址列變化的視口高度切換、單一面板、不水平溢出、主角可見。Chromium 實際派發單指拖曳／雙指縮放，從動物開始拖曳不誤開卡；保母不搶鏡頭。這是模擬視口變化，不是真手機瀏覽器網址列驗收。 |
| 縮放壓力 | DPR 3 的 390×844 Chromium：28 輪雙指縮放及 28 輪拖曳，417 次取樣；46 節點保留、0 atlas 座標錯位、0 圖片卸載、0 固定寬度變化、0 破圖、0 JavaScript 錯誤、0 404；36 個角色出現多格變化，保母 299 個位置。`after-stress/results.json` |
| 自然活動影片 | 七島約 82 秒實際網頁錄影，14 隻均出現姿勢影格；四個步行角色均實際移動，包含慢行蘇卡達龜。`activities-browser-results.json` |
| 建置／素材路徑 | `npm run typecheck`、獨立 Next.js 靜態建置通過；`/15-eco-island` basePath 下 170 個 public 素材全部 HTTP 200，原及新路由可載入；輸出不含原始美術、環境檔或 node_modules。`export-results.json` |

建置目錄僅為 `qa/diorama-stage5/build/`，不與 3015／3016 或原專案建置共用。Next.js 的多 lockfile 根目錄推斷提示不阻止靜態匯出，沒有為了消除提示更動正式設定。

## 截圖索引

- 新整體：`eggs/chromium/overview-1440.png`；舊整體：`before/overview.png`。
- 七島桌機特寫：`eggs/chromium/{squirrel,owl,horned-frog,gecko,capybara,fancy-rat,sulcata}-1440.png`。
- 七島手機卡片：同目錄 `*-390.png`；其他三手機尺寸亦保存。
- 新位置：`layout-positions.png`。
- 五個原彩蛋前後對照：`before-after-five.png`；新兩島各見七島特寫。
- 桌機／手機七島長圖：`seven-islands-desktop-phone.png`。
- 遷移：`eggs/chromium/migration-13.png`；紀念卡：`earned-keepsake.png`；重置確認：`reset-confirm-390.png`。
- 原十島、動物卡、圖鑑、巡視、橫式及高度恢復：`regression/{chromium,webkit}/`。

## 修改檔案與素材清單

新增程式：

- `src/app/art-stage5/page.tsx`、`src/app/diorama-stage5.css`。
- `src/components/ArtExploration.tsx`、`src/components/EggScenery.tsx`。
- `src/lib/exploration-stage5.mjs`、`.d.mts`（七島、14 個體、位置及來源）。
- `src/lib/egg-life.mjs`、`.d.mts`（獨立活動系統）。
- `src/lib/field-guide-stage5.mjs`、`.d.mts`（16 種與版本遷移）。

最小共用接點修改：`src/app/layout.tsx`（引入新 CSS）、`Experience.tsx`（選用新版周邊場景／鏡頭）、`ExplorationCard.tsx`、`FieldGuide.tsx`、`MobileChrome.tsx`（選用新資料及分類）、`IslandLabels.tsx`（彩蛋聚焦可用原左側導覽排列）。

新增正式素材均在 `public/assets/diorama-stage5/`：

- 地形：`squirrel-scene.webp`、`owl-scene.webp`、`horned-frog-scene.webp`、`gecko-scene.webp`、`capybara-scene.webp`、`fancy-rat-scene.webp`、`sulcata-scene.webp`。
- 角色：`squirrel-1/2/3.webp`、`owl-1.webp`、`horned-frog-1/2/3.webp`、`gecko-1.webp`、`capybara-1/2.webp`、`fancy-rat-1/2.webp`、`sulcata-1/2.webp`（斜線表示逐個編號檔案）。
- 原始圖與候選：`art-source-diorama/stage5/`；測試及影片：`qa/diorama-stage5/`，兩者沿用 gitignore，不加入網站部署輸出。舊 QA 及原始美術未覆蓋。

## 尚待真機／人工驗收

第 5 階段 Android Chrome 真機的連續縮放、拖曳、全部七島開卡、地址列展收及長時間效能仍待使用者回覆；iPhone Safari 真機亦未測。前幾階段「沒有閃爍」的真機回覆不視為本輪通過。桌面 WebKit 不能代表 iOS GPU；本輪沒有用模擬通過宣稱真機已無閃爍。

整體美術、生成動作連貫度及可愛程度保留給使用者驗收。若有需精修的影格，僅修正本輪獨立來源，維持原主地圖與正式版本。本輪完成後停止，不發布。
