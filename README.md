# ✈️ Trip Planner

一個功能豐富的旅程規劃工具，幫助您輕鬆管理和視覺化您的旅行行程。從 Google Sheets 載入行程資料，提供列表和地圖雙重檢視模式。

🌐 **[線上體驗](https://boloagegit.github.io/trip-planner/)**

## ✨ 主要功能

### 📊 行程管理
- **Google Sheets 整合**：從 Google Sheets 直接載入行程資料
- **即時同步**：一鍵重新載入最新的行程資訊
- **分享功能**：複製分享連結，讓朋友查看您的行程

### 🗺️ 雙重檢視模式
- **列表檢視**：以時間軸方式呈現每日行程
- **地圖檢視**：在互動式地圖上查看所有地點

### 🔍 智慧搜尋
- 即時搜尋活動、地點和描述
- 快速定位您關心的行程項目

### 📝 隨身筆記本
- **交通筆記**：記錄交通資訊和路線
- **預算追蹤**：管理旅行開支
- **購物清單**：不忘記要買的東西
- 所有筆記自動儲存在本地

### 🎨 個人化設定
- **主題切換**：淺色/深色模式自由切換
- **自訂標題**：設定個人化的旅程標題
- **本地儲存**：所有設定和資料保存在您的裝置上

### 📈 行程統計
- 總天數、活動數量
- 美食和交通統計
- 一目了然的行程概覽

### 📱 PWA 支援
- 可安裝為應用程式
- 離線存取（已載入的資料）
- 流暢的使用體驗

## 🚀 快速開始

### 線上使用

1. 訪問 [https://boloagegit.github.io/trip-planner/](https://boloagegit.github.io/trip-planner/)
2. 點擊右上角的 ⚙️ 設定按鈕
3. 輸入您的 Google Sheets URL（需設定為公開可檢視）
4. 開始規劃您的旅程！

### Google Sheets 格式

您的 Google Sheet 應包含以下欄位：
- `Date`：日期（格式：YYYY-MM-DD）
- `Time`：時間
- `Title`：活動標題
- `Description`：活動描述
- `Location`：地點名稱
- `Type`：活動類型（如：sightseeing、food、transport 等）

## 💻 本地開發

### 環境需求
- Node.js 20+
- npm

### 安裝步驟

```bash
# 複製專案
git clone https://github.com/boloagegit/trip-planner.git
cd trip-planner

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 🛠️ 技術架構

- **前端框架**：React 19
- **建置工具**：Vite 7
- **動畫**：Framer Motion
- **地圖**：Leaflet + React Leaflet
- **圖示**：Font Awesome
- **資料解析**：PapaParse (CSV)
- **PWA**：Vite Plugin PWA

## 📄 授權

MIT License

## 🙏 致謝

感謝所有使用此專案規劃旅程的朋友們！
