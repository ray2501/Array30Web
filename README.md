# 行列輸入法網頁版 (Array30Web)

這個專案的出現是因為 [McBopomofoWeb](https://github.com/openvanilla/McBopomofoWeb) 帶來的啟發，
我想我可以嘗試寫一個使用網頁技術建構的行列輸入法網頁版並且學習使用網頁技術。

目前已實作行列輸入法下列功能：
- 一級簡碼與二級簡碼
- 符號輸入（「W+數字鍵」符號選單）
- 詞彙輸入

下面是專案目錄：
- app：在瀏覽器使用的輸入法頁面
- src：使用 JavaScript 寫成的行列輸入法核心
- tool：`cin2js.js` 為轉換 cin 檔案到 js module 的工具

授權方式為 MIT。

## 編譯

使用下列指令（如果使用 npm 管理套件）：

```
npm install
npm run build
```
