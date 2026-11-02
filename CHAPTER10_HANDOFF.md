# 第十階段交付｜九大動物區防衛關卡（本機驗收版）

日期：2026-11-02。工作分支：`feature/chapter10-animal-defense`。本版本未推送、未合併 main、未部署 GitHub Pages。

## 安全基準與預覽

- 第九階段完整基準：`ad3350345ceb4aed01d3bbf1caf99dfdbcebf16b`，原分支 `feature/chapter9-connected-manor` 保留。
- 完整歷史備份：`qa/chapter10/chapter9-complete.bundle`，已執行 Git bundle verify 通過。
- 正式 main 仍為 `b13963a925ad5acd9235dfbd0d02a86df9d41283`。
- 電腦：<http://127.0.0.1:3045/15-eco-island/chapter10/>。
- 同 Wi-Fi 手機：<http://192.168.1.104:3045/15-eco-island/chapter10/?review=chapter10-final>。
- 第九階段對照：<http://127.0.0.1:3043/15-eco-island/chapter9/>。
- 建置獨立位於 `qa/chapter10/build/out` 與 `qa/chapter10/root-build/out`；未共用第九階段或正式站輸出。
- 重新啟動區網預覽：在本 Repository 執行 `node qa/chapter10/serve.mjs`。Windows 需以使用者帳號執行 Node，未更改防火牆、路由器或 DNS。

## 已完成的三個里程碑

**10-A：核心擴充。** 六種史萊姆、十二種塔、集中平衡設定、關卡配置與獨立進度格式；十項核心能力測試通過。

**10-B：前三關。** 先只顯示經典戰與兔兔、天竺鼠、鸚鵡三關；模型與實際介面均完成五波並保存通關紀錄。驗收保留在 `qa/chapter10/milestone-B/`。

**10-C：完整九區。** 通過前三關後開放其餘六區。經典戰與九個動物區共十個關卡皆完成實際介面五波挑戰，另通過不同步進、資源與無塔失敗測試。最終證據使用 `final-campaign/`，早期測試與調整結果仍保留。

## 地圖與關卡

保留同一座莊園、中央旅宿、九個住宿區、七個彩蛋區、第九階段草地及連接道路。經典戰保留完整外圍進攻線。動物區關卡在各區周邊公共道路設置不同入口與防護終點，沿原保母公共道路圖尋路，沒有重建九張地圖，也沒有移動原住宿區或彩蛋。

各動物區有不同路線、塔點、敵人組合與戰術。遊戲終點在生活區外側。區域關卡以較小的角色、射程與移動尺度匹配現有微縮景觀；建塔、射程、傷害與點擊始終使用同一套世界座標。

| 關卡 | 專屬塔 | 初始陽光幣 | 塔點數 | 公共道路長度（約） |
| --- | --- | ---: | ---: | ---: |
| 經典中央旅宿 | 三種基本塔 | 150 | 12 | 6562 |
| 兔兔草原 | 牧草種子塔 | 150 | 5 | 778 |
| 天竺鼠花園 | 維C莓果塔 | 150 | 4 | 737 |
| 鸚鵡森林 | 羽毛旋風塔 | 150 | 6 | 966 |
| 倉鼠小屋 | 向日葵種子塔 | 150 | 4 | 873 |
| 刺蝟森林 | 松果刺球塔 | 150 | 4 | 977 |
| 雪貂探險 | 追風閃電塔 | 150 | 5 | 734 |
| 狐獴沙丘 | 哨兵瞭望塔 | 200 | 5 | 807 |
| 龍貓岩林 | 岩石防衛塔 | 270 | 3 | 488 |
| 蜜袋鼯森林 | 月光魔法塔 | 200 | 3 | 573 |

窄地形不硬塞建塔點。龍貓關在 200／260 資源版本中，模型與實際操作曾有失敗；以 270 起始資源重新驗證後可正常通關，仍需要範圍魔法、岩石與升級配置。刺蝟 C 塔點在安全稽核中移至 `(1800,1595)`，避開原有刺蝟活動範圍。

## 十二種防衛塔

所有關卡皆可使用種子、泡泡與星光。各動物區額外只開放自己的專屬塔，UI 與引擎同時限制可建種類。塔均消耗資源、可升至三級，並有攻擊回饋、投射物／支援效果與等級標記。

| 塔 | 建造價格 | 實際機制 |
| --- | ---: | --- |
| 種子射手 | 55 | 穩定單體傷害 |
| 泡泡減速 | 65 | 少量魔法傷害、45% 減速 2 秒 |
| 星光魔法 | 90 | 大範圍魔法傷害，適合聚集敵人與護盾 |
| 牧草種子 | 65 | 短射程、低單發傷害、快速連射 |
| 維C莓果 | 75 | 命中後小範圍綻開，比星光更快、範圍較小 |
| 羽毛旋風 | 95 | 直線判定，最多穿透四個敵人 |
| 向日葵種子 | 85 | 再彈跳兩次，不重複命中同一敵人，傷害逐次衰減 |
| 松果刺球 | 100 | 慢速拋射、較高單次範圍傷害 |
| 追風閃電 | 90 | 四次短促連射後進入較長冷卻 |
| 哨兵瞭望 | 60 | 不直接攻擊；鄰塔射程 +20%／25%／30%，只取最高值，不疊加 |
| 岩石防衛 | 110 | 慢速、高單發傷害，適合厚血型 |
| 月光魔法 | 110 | 再連鎖跳躍三次、逐次衰減並附短暫減速 |

數值集中在 `src/lib/campaign/balance.ts` 與 `levels.ts`。升級價格為原價 × 0.75 × 目前等級後四捨五入；傷害、射程與冷卻成長也由同一設定表管理。區域關卡射程／範圍乘 0.45、移動與投射物速度乘 0.5；經典戰保持原尺度。

這些是幻想魔法設施，不是動物參戰，也不是飲食或照護建議。相關說明保留在選關及關卡介紹中。

## 六種史萊姆與上限

- 綠、藍、紫：保留均衡、快速低血、慢速厚血特色。
- 橘：被攻擊擊敗後，同一世界路線位置產生兩隻獨立生命的小史萊姆。只分裂一代。小史萊姆有稍快／稍慢的步調，避免永遠疊成同一隻；初始生成位置仍完全相同。
- 黃金：護盾與生命分開計算、分列兩條狀態條。魔法更有效破盾；破除時有消散特效，並切換已預先解碼的無護盾外觀。
- 粉紅：每三秒治療附近其他敵人，不治療自己、不超過最大生命。每個受療對象另有 1.2 秒鎖定，避免多隻治療型無限疊加。
- 所有能力僅作用於敵人清單；沒有任何攻擊原住宿動物或保母的介面。
- 關卡波次配置驗證「原敵人數＋可能增加的分裂個體」不超過 96；每個橘色母體最多兩個孩子。投射物上限 100、效果上限 80，沒有無限生成、資源或治療量累加。

## 進度保存與模式隔離

新增 key：`yiwu.manor-defense.campaign.v1`，資料含 `version:1`、每關 `cleared`／`bestWave`、`lastLevel` 與 `settings.showRoute`。只保存已完成波次，不把目前進行中的波次誤算為完成。重玩不降低最高紀錄；換關清除舊敵人、投射物、塔與本場資源。

原圖鑑 key 與 version 2 完全保留。實際跨關測試中，原圖鑑 JSON bytes 保持一致。十關在同一頁連續通關，重新整理後十個通關標記仍存在。另驗證未通關的一波紀錄、失敗、重置及路線偏好保存；儲存受限時有說明且仍可遊玩。

自由探索不建立戰鬥引擎、不啟動敵人或投射物計算。選關才懶載入戰鬥實作；退出會取消 RAF 與事件監聽、移除 Canvas。原 31 隻住宿動物、14 隻彩蛋個體、保母 DOM 與生活控制器不因戰鬥重新渲染而重建。

本場戰況不跨重新整理保存，介面已明確說明。無會員、後端、排行榜、金流或個資蒐集。本機網址與正式網域使用各自的瀏覽器儲存空間，未搬移或重置正式站進度。

## 手機與渲染保護

沿用第九階段同影格鏡頭通知：DOM 地形套用鏡頭後，Canvas 同 callback 使用同一數值重畫。鏡頭重畫不推進遊戲時間；沒有新增 GPU hints、降低原圖畫質或停止原動物動畫。

建塔選單最多四種、兩欄顯示；手機原生區域抽屜限制高度並可內部捲動。建塔時暫收鏡頭按鈕，讓被選位置保留在卡片上方。選關、重置及換關對話框有鍵盤焦點管理；支援 Escape 與 reduced-motion 的果凍／塔身動作減量。

遊戲時間固定步進、單次最多 0.05 秒；背景分頁暫停，回來必須手動繼續，不追補整段時間。三種新史萊姆與九座塔共用 viewport Canvas，沒有每個敵人一個 React／GPU 圖層。

## 驗收結果與證據

所有資料位於新的 `qa/chapter10/`，未覆寫第九階段驗收。

- `milestone-A.json`：十三項機制（含後續補強的快速連射、範圍與高傷單體比較）、資源、暫停及資料格式測試。能力單元測試使用受控 fixtures，不拿它們當成遊戲通關證明。
- `balance-all.json`：十關合理策略皆通關；十關不建塔皆失敗；資源守恆與敵人上限驗證。
- `balance-real-time-step.json`：另外以 1/60 秒步進、每 0.25 秒做一次決策驗證通關，避免只在粗略模擬中成立。
- `final-campaign/results.json`：最終版本十關均以實際 UI 完成五波（共 50 波），有真實建造與升級、各區勝利畫面、無遊戲狀態注入。瀏覽器時鐘加速，並非真實遊玩耗時。
- `final-campaign/storage-reload.json`：同一頁十關紀錄獨立累積、重新整理保留、原圖鑑資料不變。
- `final-hedgehog/`：刺蝟塔點移出活動範圍後的單獨五波驗收；最終全關測試也包含此修正。
- `failure-restart-storage.json`、`failure-mobile.png`：實際不建塔失敗、只保存已完成一波、重新挑戰回到 150／20／第零波、設定重整保留。
- `storage-blocked.json`：儲存被封鎖仍可進入並遊玩，顯示明確通知。
- `browser/results.json`：1440×1000、320×740、360×800、390×844、430×932，經典建塔／金幣、暫停、背景分頁、縮放、重置及原 45 個動物 DOM 保留。
- `native-mobile/results.json`：上述五尺寸的動物區四塔選單、實際世界落點點擊、至少 44px 觸控區、建造／升級／防超支、換關確認與新局清理。
- `accessibility-lazy-urlbar.json`：自由探索與選關不載入引擎、鍵盤循環、Escape、320 寬網址列高度變化模擬及手機橫式。`urlbar-native-sheet.png`、`native-landscape.png` 為對應截圖。
- `touch-chromium.json`：八輪原生雙指縮放、單指拖曳及從塔點拖曳不誤點。`touch-webkit.json` 為 WebKit 手機尺寸／橫式模擬，不是實體 Safari。
- `camera-sync-after.json`：102 次觸控鏡頭變動，最大相對錯位約 0.001657 CSS px，大於 1px 的錯位為零（桌機模擬）。
- `resident-safety.json`：按實際 DOM 位置及原始動物活動多邊形，以每兩個世界單位採樣全部十條路線；史萊姆與塔基使用和 renderer 相同的地面橢圓足跡，全數位於活動範圍之外。檢驗地面足跡，不把整張直立角色圖片誤當成地面圓形；並未修改任何原動物移動範圍。
- `exploration-regression/regression/chromium/results.json`：第十階段自由探索中的 31 隻資訊卡、十區、四則知識、壽命與來源、巡視、16 圖鑑與手機抽屜。
- `exploration-regression/eggs/chromium/results.json`：七種彩蛋／14 個個體實際點擊，圖鑑解鎖、遷移、保存及紀念卡。
- `static-export-results.json`：根路徑與專案 basePath 的靜態匯出；十三張新素材逐一 HTTP GET 比對原檔，圖片／CSS／JS 無 404，canonical、robots、sitemap、Google 驗證原檔正常。首頁可索引，chapter10 為 noindex。
- `protection-results.json`：第九階段原有 315 個追蹤檔案維持內容一致；美術逐 byte、文字正規化 CRLF 後比對。包含原美術、程式、Google 驗證檔、SEO、Next 設定與 Pages workflow。
- `phone-feedback.json`：使用者以真正手機回覆「可以開啟，操作與縮放正常」。裝置型號與瀏覽器版本未提供。

## 圖片與錄影

- 選關畫面：`selection-all.png`、`native-mobile/selection-390.png`。
- 九種塔美術：`tower-gallery.png`；六種史萊姆：`slime-gallery.png`。
- 十關路線、建造、戰鬥與勝利截圖：`final-campaign/{level}-route.png`、`-build.png`、`-battle.png`、`-victory.png`。
- 實際分裂／破盾／治療效果：`final-campaign/{level}-ability-split.png`、`-ability-shield.png`、`-ability-heal.png`。
- 手機尺寸實際介面操作錄影：`mobile-final/mobile-gameplay.mp4`（模擬手機與加速時鐘，不是實機錄製）。
- 分裂動作近景：`split-demo/`，僅透過正常建塔、升級與暫停操作展示，沒有注入敵人生命或遊戲資源。
- 手機建造與升級：`native-mobile/build-390.png`、`native-mobile/upgrade-390.png`。

## 新增檔案（原檔未覆蓋）

- `src/lib/campaign/balance.ts`：集中數值、能力及素材路徑。
- `src/lib/campaign/engine.ts`：沿用原固定步進／世界路線／投射物架構擴充的新關卡引擎；原第八、九階段引擎保留。
- `src/lib/campaign/levels.ts`：十關、敵人波次、公共道路、目標與起始資源。
- `src/lib/campaign/sites.ts`：已檢查建塔點。
- `src/lib/campaign/progress.ts`：版本化、獨立的本機進度。
- `src/components/campaign/CampaignTrial.tsx`：模式、選關與保存。
- `src/components/campaign/CampaignGame.tsx`：四塔 UI、既有鏡頭同步、戰鬥生命週期。
- `src/components/campaign/render.ts`：共用原道路渲染，新增角色、攻擊與能力效果。
- `src/app/chapter10/page.tsx`、`campaign.css`：獨立本機審閱入口與響應式樣式。
- `public/assets/defense-v3/tower-{hay,berry,feather,sunflower,pinecone,lightning,sentry,rock,moon}.webp`。
- `public/assets/defense-v3/slime-{orange,gold,pink,gold-unshielded}.webp`。
- `tests/campaign-engine.test.mjs`、`tests/campaign-balance.test.mjs`：可持續維護的單元／平衡測試，無需 QA fixtures 檔即可執行。
- `CHAPTER10_HANDOFF.md`：本紀錄。

測試命令：`node tests/campaign-engine.test.mjs`、`node tests/campaign-balance.test.mjs`。完整瀏覽器驗收腳本與歷史結果保留在 `qa/chapter10/`。

## 素材來源與限制

新素材使用內建 image_gen，未使用 CLI／API 金鑰。完整提示詞、來源及輸出路徑記錄於 `qa/chapter10/art-generation.json`；原始 PNG 獨立保留於 `art-source-defense10/`。公開檔為保留 alpha 的高品質 WebP，不包含原始候選或個人錄影。

本版是高品質 2.5D 透明點陣素材，搭配 Canvas 果凍變形、塔身反應、投射物與粒子；不是完整 3D 模型，也不是逐影格骨架動畫。沒有用簡單色球或重染原塔冒充新造型。所有原美術、Logo 與動物素材均保留。

**待使用者驗收：** 整體遊戲感、重玩性與第一版數值仍需玩家試玩；沒有宣稱平衡已達最終版本。實體 iPhone Safari、不同／低階手機及長時間高負載效能尚未完成實機驗收。網址列高度變化是模擬；使用者真機回報只代表其本次基本操作與縮放正常，不能延伸成所有手機效能保證。

尚未進行正式部署。不得自行推送 main、發布 GitHub Pages、修改 Gandi／Search Console／官網／LINE 預約系統。
