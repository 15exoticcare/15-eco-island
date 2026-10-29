# 壹伍生態島美術重製第 4 階段交付

日期：2026-10-30（Asia/Taipei）。基準 `e685d9b`，獨立分支 `art/stage4-final-four`。本輪僅精修龍貓、蜜袋鼯、倉鼠、刺蝟及相關道路。沒有推送、合併 main 或觸發 GitHub Pages。

## 互動驗收

- 電腦：http://127.0.0.1:3030/15-eco-island/art-stage4/
- 同 Wi-Fi 手機：http://192.168.1.104:3030/15-eco-island/art-stage4/
- 第 3 階段對照：http://127.0.0.1:3030/15-eco-island/art-stage3/ （手機改用區網 IP）
- 第一輪核可版本仍在 `/art-review/`；經典版仍在 `/15-eco-island/`。

3030 僅服務本輪獨立靜態輸出；接受私有 IPv4 的 GET／HEAD，不提供來源碼與目錄清單。3035 是自動化測試用伺服器。沒有修改防火牆、正式官網、預約系統、Gandi DNS 或任何發布設定。

## 完成內容與道路

| 區域 | 美術與生活範圍 | 中央連接 |
| --- | --- | --- |
| 龍貓 | 清爽岩林、洞屋、跳台、浴沙角落、獨立圍欄；三隻龍貓保持圓耳及蓬鬆長尾 | 中央前庭左側公共路口，沿建築左側外緣向後的草地石板小徑；取消狐獴長橋 |
| 蜜袋鼯 | 樹屋、巢袋、枝幹與平台，三隻蜜袋鼯維持各自抱枝／休息及既有攀爬能力 | 中央公共路口沿建築右側向後的小徑，避開鸚鵡圍欄；取消鸚鵡超長高橋 |
| 倉鼠 | 四間小屋、墊材、隧道、活動設施，四個實體分隔空間；原四個個體不混居 | 前庭左支，連續草地緩坡與外側公共步道，不跨越小屋或生活區 |
| 刺蝟 | 三個活動角落、洞屋、灌木、落葉、岩石及安全圍欄 | 前庭右支，連續草地與外側石板路；減少長陡橋 |

倉鼠與刺蝟之間為一座跨窄溪的短木拱橋，橋墩與兩岸石路接合。它不是裝飾死路：兩區間的最短實際巡視路線會經過此橋。前方兩條中央支路與短橋形成一個小環路，沒有增加其他新橋。

本輪移除舊龍貓、蜜袋鼯、倉鼠、刺蝟四座程序長橋及其舊路段。保留第 3 階段往天竺鼠的短橋，以及已烘焙於左側地形的溪流橋。狐獴原素材的上側邊緣小平台保留，沒有延伸出無用途的舊長橋。

前庭原有岩緣未重畫；新草地頸部與原前庭路面作少量接點重疊。原中央建築、庭院、美術尺寸、品牌牌面、兔區及鸚鵡區皆未重製。後方左右分支採不同高度與曲線，沒有強行對稱。

## 已核可六區的保護

- 基準中的 **133 個 public 素材**逐一比對位元內容與 SHA-256，全數一致。
- `DioramaGround`、`DioramaExpansion`、原兩套地形 CSS、`diorama.ts`、`diorama-stage3.ts` 未修改。
- 瀏覽器比較 `/art-stage3/` 與 `/art-stage4/`：原六區地形、品牌位置、18 隻原核可動物的 atlas／位置，以及六個鏡頭焦點完全相同。
- 兔子、鸚鵡、天竺鼠、雪貂、狐獴原路線保持相同。中央出發點也相同。
- 動物生命週期、私有活動區、物種 ID、個體 ID、四則知識、壽命與來源、圖鑑儲存 key 及格式皆未修改。
- 手機 UI、鏡頭 rAF 更新、AtlasFrames、固定 SVG 裁切與影格播放方式保留；沒有新增 filter、will-change 或全面 GPU 提升。

貓頭鷹小景在本預覽移至後方安靜樹角，蝴蝶移至前方花叢外緣，避免蓋住新步道及溪流。只有場景／互動點／鏡頭的顯示座標一起平移，五位訪客的素材、知識與反應邏輯不變。其他預覽版本仍使用原座標。

## 最小程式調整

新增 opt-in `artFinal`，只由 `/art-stage4/` 啟用。新地形為三張獨立透明點陣素材，與舊素材共同置於原 world。背景不接收 pointer，動物、訪客與保母仍在互動圖層。

新版四區以顯示座標適配個別動物及熱區，活動控制器和安全範圍資料不變。蜜袋鼯的可見支撐枝幹和動物使用同一組平移，沒有用圖片移動假裝攀爬。

原巡視路線 finder 僅能走共同前綴的樹狀道路；新增短橋形成環路。因此 `createPatrol`／`buildPatrolOrder` 只新增可選的 route finder 參數，讓第 4 階段使用道路圖最短路徑。原速度、步態、停留、暫停、最新指定佇列與自動巡視排程未改。未傳參數的舊巡視，與基準執行 **12,000 次 tick 的快照完全相同**。

| 修改／新增檔案 | 用途 |
| --- | --- |
| `src/app/art-stage4/page.tsx` | 獨立預覽入口 |
| `src/components/ArtFinal.tsx` | 第 4 階段素材 context |
| `src/components/DioramaFinal.tsx` | 後方左右地形與前方兩區地形 |
| `src/lib/diorama-stage4.ts` | 道路圖、四區鏡頭／標籤／訪客偏移、短橋捷徑 |
| `src/app/diorama-stage4.css` | 僅本預覽的新四區顯示位置與熱區 |
| `src/components/Experience.tsx` | 選用新地形與道路；到站座標及訪客鏡頭適配 |
| `src/components/AnimalLife.tsx` | 新四區圖集選擇及枝幹標識，生命週期不變 |
| `src/components/ExplorationScenery.tsx` | 可選的場景／互動點偏移 |
| `src/components/FieldGuide.tsx` | 四區圖鑑縮圖沿用新版動物 |
| `src/lib/patrol.mjs`、`src/lib/patrol.d.mts` | 可選路線 finder，不改排程狀態機 |
| `src/app/layout.tsx` | 載入嚴格限定第 4 階段的 CSS |
| `public/assets/diorama-stage4/` | 3 張地形、13 張動物圖集，共 16 個 lossless WebP |

## 素材來源與品質

- 使用內建 **image_gen**，未使用 API CLI。
- 正式供預覽載入：`public/assets/diorama-stage4/`，合計 9,945,650 bytes，沒有覆蓋舊美術。
- 獨立來源／所有候選：`art-source-diorama/stage4/`。
- 完整提示、參考圖角色及排除紀錄：`art-source-diorama/stage4/prompts.json`。
- 技術封裝：`qa/diorama-stage4/pack-atlases.mjs`；每隻 16 格，共 208 格，維持原 cell、原錨點與原動作能力，主體等比例對位。
- 不採用早期兩區合併的後方地形候選，因道路出口較難避開已核可樹冠；最後採左右兩片長頸地形。
- `glider-2` 候選第 15 格碰右邊界，排除並以完整相鄰第 14 格封裝。此個體原本不啟用位移／攀爬，仍只使用原休息及探頭序列；沒有減少既有能力。
- 目視未發現最終採用動物有明顯多餘肢體、錯物種或破圖，仍以使用者本機美術驗收為準。

## 測試與證據

完整機器可讀彙整：`qa/diorama-stage4/verification-summary.json`。本輪證據均在新的 `qa/diorama-stage4/`，沒有覆寫前階段驗收。

| 項目 | 檢查範圍 |
| --- | --- |
| TypeScript、靜態匯出 | 獨立 `qa/diorama-stage4/build/out`，保留 `/15-eco-island` basePath；不共用舊預覽建置輸出 |
| 桌機 Chromium | 1440×900，十區選取、31 張個體卡、5 位訪客、9 島四則知識及壽命來源、巡視與鏡頭 |
| Chromium 手機模擬 | 320×740、360×800、390×844、430×932；每種尺寸均測 31 張卡，橫式、視窗高度變化、抽屜互斥與無水平溢出 |
| WebKit 手機模擬 | 同四尺寸；390×844 完整 31 張卡及圖鑑，其餘尺寸測布局、鏡頭、代表卡片、橫式及高度變化；不是 iPhone Safari 實機 |
| 真正地圖點擊 | 31 隻動物對焦後，逐一檢查 elementFromPoint 與 touch tap 可開正確個體卡 |
| 圖鑑 | 14 項分類、實際開卡解鎖、重複不計數、刷新／第二頁／關閉重開瀏覽器保存、確認重置、跨頁同步、完成紀念卡、無 localStorage 時不崩潰 |
| 道路模型 | 90 組起終點、十站全巡、無瞬移、暫停保留位置、指定佇列、短橋捷徑；新四區入口仍可觸發合適動物留意，睡眠保護保留 |
| 真實時鐘錄影 | 保母依新道路抵達龍貓、蜜袋鼯、倉鼠、刺蝟；各區到站暫停保母但動物繼續活動；倉鼠→刺蝟走短橋 |
| 縮放穩定 | 新四區 16 輪雙指縮放＋16 輪拖曳，DPR 3；37 個角色節點保留，atlas 圖像未卸載、影格位置正確、寬度穩定，無破圖、JS 錯誤或 404 |
| 原六區 | 133 舊素材與 20 個保護模組比對，18 隻動物及六個焦點瀏覽器比較 |

WebKit 首次測試曾在訪客卡展開來源後，使用舊螢幕座標再點擊。補測改為卡片關閉後重新讀取實際位置，並增加 elementFromPoint 驗證，沒有移除訪客互動斷言。

## 畫面與錄影索引

- [完整地圖](qa/diorama-stage4/overview-final.png)
- [龍貓及後方左路](qa/diorama-stage4/chinchilla-final.png)、[蜜袋鼯及後方右路](qa/diorama-stage4/glider-final.png)
- [倉鼠及前方左路](qa/diorama-stage4/hamster-final.png)、[刺蝟及前方右路](qa/diorama-stage4/hedgehog-final.png)
- [短橋特寫](qa/diorama-stage4/bridge-closeup.png)、[實際道路節點示意](qa/diorama-stage4/road-connections.png)（彩線只在 QA 截圖，不是產品功能）
- [保母四區實際巡視與動物活動錄影](qa/diorama-stage4/road-video/four-region-real-walk-and-activity.webm)
- [龍貓到站](qa/diorama-stage4/activity-chinchilla.png)、[蜜袋鼯到站](qa/diorama-stage4/activity-glider.png)、[倉鼠到站](qa/diorama-stage4/activity-hamster.png)、[刺蝟到站](qa/diorama-stage4/activity-hedgehog.png)
- [第 3 階段整體對照](qa/diorama-stage3/overview-final.png)
- [手機初次開啟](qa/diorama-stage4/phone-home.png)、[龍貓](qa/diorama-stage4/phone-chinchilla.png)、[蜜袋鼯動物卡](qa/diorama-stage4/phone-glider-animal.png)、[倉鼠](qa/diorama-stage4/phone-hamster.png)、[刺蝟](qa/diorama-stage4/phone-hedgehog.png)
- [手機圖鑑](qa/diorama-stage4/phone-guide.png)、[手機巡視面板](qa/diorama-stage4/phone-patrol.png)

## 尚待驗收與限制

目前是可縮放、拖曳、點擊的 2.5D 點陣場景，不是可旋轉的即時 3D 模型。沒有新增穿隧道、跳台或滑翔功能；沿用原動作與活動範圍。

此輪 Android 與 iPhone 實機尚待使用者回報。模擬測試的穩定結果不能當作所有手機 GPU 已通過；請於同 Wi-Fi 的實際手機連續縮放四區，確認無閃爍與遮擋。原先第 3 階段的手機回報不冒用為第 4 階段驗收。

交付後停在本機驗收，不自行發布 GitHub Pages。
