# 壹伍生態島

第七階段完整網站的獨立 GitHub Pages 發布專案。

保留九座住宿物種島、31 隻住宿動物、五位環境探索訪客、保母自動與指定巡視、壽命資料、知識來源及 14 種探索圖鑑。環境訪客不屬於住宿服務物種。

## 建置

使用 Node.js 24，執行 `npm ci`。設定 `NEXT_PUBLIC_BASE_PATH=/15-eco-island` 後執行 `npm run build`，靜態網站輸出至 `out/`。此變數是公開的網址前綴，不是金鑰。自訂網域使用空字串前綴。

`next.config.ts` 使用 `output: 'export'`、`trailingSlash: true` 與相同 basePath；手寫 public 素材 URL 經 `assetUrl()` 加入前綴。不可只修改 basePath 而省略素材 URL。

本機開發可執行 `npm run dev`，網址為 http://127.0.0.1:3020/。不要對靜態 export 使用 next start。

## 手動發布

在這個獨立 Repository 的 Settings → Pages 將 Source 設為 GitHub Actions。Actions → Yiwu Eco Island - GitHub Pages → Run workflow 手動執行。

Workflow 不因 push 自動發布。建置時從 configure-pages 取得實際 base_path，將 out 上傳給 Pages。尚未確認前不要手動執行發布；不包含正式網域設定或 CNAME 檔。

不要將此專案指向既有官網 Repository，也不要在這裡修改官網、LINE 預約系統或 Gandi DNS。

## 資料與素材

探索進度僅保存在使用者瀏覽器 localStorage，包含版本識別。不同網址、裝置、無痕模式或清除網站資料不會自動同步。重置需要二次確認。

正式使用的圖片沿用既有素材，未重新生成或壓縮。未使用的舊 PNG 原始圖與素材準備稽核 JSON 留存於本機，不納入發布專案。既有完整階段紀錄與驗收證據仍保留在原始開發目錄及獨立評估目錄，不作為公開網站內容上傳。

原有 58 項單元測試及歷史驗收保護在原開發專案執行。此精簡發布專案不包含歷史 QA 檔案；部署 workflow 執行建置、型別與必要輸出檢查。發布前另以純靜態伺服器驗證桌機、手機尺寸、圖鑑及巡視功能。

不得提交 .env、憑證、token、node_modules、建置暫存、QA 截圖或候選原始美術。公開 Repository 的內容可被他人讀取；品牌與美術權利不因公開原始碼自動授權。

採用託管服務前應確認其適用條款；自訂正式網域另待確認。
