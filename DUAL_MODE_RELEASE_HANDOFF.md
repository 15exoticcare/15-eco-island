# 雙模式正式整合交付

日期：2026-11-03。整合分支：release/dual-mode-chapter12。

首頁使用原始 Logo 與既有莊園分享圖片，先提供「自由探索」及「莊園防衛戰」。自由探索保留原 Experience；防衛戰直接引用第十二階段 CampaignTrial 與 CampaignGame，不導向測試頁或 localhost。兩者都可按「模式首頁」返回，經既有卸載處理停止動畫／戰鬥及關閉唯一音訊 Context，保留 localStorage。

第十二階段基準：629fac7375285fd901810f17119e0ecea3665ec6。全部關卡、長路線、波次、Boss、價格、技能與音訊邏輯及所有美術保持原樣。僅增加入口／返回操作、正式版標示，以及必要的首頁響應式樣式；Game 本體只有「測試版遊戲成就」標示改為「遊戲內成就」。原測試頁繼續 noindex，不作為正式入口。

## 測試與證據

- qa/final-integration/local/results.json：320×740、360×800、390×844、430×932、1440×1000；首頁選項、31+14動物與唯一保母、最新版10關／9Boss圖片、建塔升級扣款、敵人移動、技能與精確巡視還原、獨立音量／靜音、模式切換／刷新保留圖鑑與星級／Boss進度。
- 同一測試驗證施法途中返回首頁：無剩餘遊戲Canvas、保母或RAF，Context全數關閉；重新自由探索仍只有一位正常保母。
- compat.json：四則知識、壽命及參考來源、16種圖鑑、巡視暫停／繼續、觸控縮放、Chromium與WebKit手機橫式。這是桌機模擬，不宣稱新增實體手機驗收。
- TypeScript與根路徑／專案子路徑兩份獨立 Next.js 靜態建置通過。static.json確認可讀取的SSR首頁、可索引、正式canonical、繁體中文、原Google HTML／robots／sitemap／分享圖片 bytes，無缺圖或JS錯誤。
- 新舊第十二階段核心26組機制與音訊測試通過；protection.json確認戰鬥規則、美術、SEO與部署workflow未變。沒有新增遊戲內容或更改平衡。
- 所有建置、備份、原始測試與截圖位於 qa/final-integration/，依既有ignore排除於Git與公開素材之外。

## 正式部署與回滾基準

指定 Repository：15exoticcare/15-eco-island。正式網址：https://island.15exoticanimalhotel.com.tw/。
沿用 .github/workflows/pages.yml 的 workflow_dispatch 及 configure-pages 回傳路徑；不修改自訂網域、HTTPS或DNS。

發布前正式main：b13963a925ad5acd9235dfbd0d02a86df9d41283。舊成功部署：https://github.com/15exoticcare/15-eco-island/actions/runs/41181184604。
備份tag：backup/before-dual-mode-release-20261103。
本機有完整Git bundle、正式main來源ZIP，以及依該main與lockfile重建的根路徑靜態輸出ZIP。舊Actions artifact已無保留，沒有把重建ZIP宣稱為原始artifact。

正式執行結果、部署SHA／run URL與線上測試存於 qa/final-integration/deployment.json、online/ 及 FINAL_DEPLOYMENT_REPORT.md。

如正式新版有重大問題，以備份tag的檔案樹建立新的向前回滾commit，推送main後重新執行同一Pages workflow；不使用reset重寫遠端或force push。正式main整合前會再次fetch核對，使用保留歷史的fast-forward；若遠端有新變更，先安全處理再重驗。

實體iPhone、低階裝置長時間滿載的限制沿用第十二階段交接；本次僅做首頁整合所需回歸，沒有重新增加大型開發或宣稱全機型通過。
