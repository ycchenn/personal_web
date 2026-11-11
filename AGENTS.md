# AGENTS.md — Yu Chi Chen 個人網站

> 給 AI 助手（Claude Code、Codex、Cursor、Copilot…）與未來的我看的開發規則。
> **開始任何修改前先讀完這份文件。** 規則與現況衝突時，以這份文件為準，並順手修正不一致之處。

---

## 1. 專案目的

這是 Yu Chi Chen（政大資管 × 數位內容雙主修）的個人學術網站，部署在 GitHub Pages：
<https://ycchenn.github.io/personal_web/>

網站要做到三件事：

1. **讓招生委員／教授／面試官在 30 秒內看懂我是誰、做過什麼。**
2. 每個專案都有一頁**獨立的詳細頁**，講清楚「為什麼做、做了什麼、技術上怎麼想、學到什麼」。
3. **新增內容要快**：加一篇論文或一則動態只改一個資料檔；加一個專案只要一行指令＋填內容。

讀者是英文學術圈，所以 **網站上的文字一律用英文**（論文原標題是中文的照原樣保留）。程式註解與這份文件用繁體中文。

---

## 2. 技術限制（不可違反）

- **純靜態網站**：HTML + CSS + 原生 JavaScript。不用框架、不用 npm 套件、不需要 build。
- 雙擊 `index.html` 用 `file://` 開也要能正常顯示 → **不能用 `fetch()` 讀 JSON**，資料一律寫成 `data/*.js`，掛在全域 `window.SITE` 上。
- 唯一的外部資源是 Google Fonts（Inter、Source Serif 4）。不要新增 CDN。
- `tools/` 內的 Node 腳本只是開發輔助，網站本身不依賴它們。

---

## 3. 資料夾結構

```
personal_web/
├── AGENTS.md              ← 本文件（規則的唯一來源）
├── CLAUDE.md              ← 給 Claude Code 的入口，內容是 @AGENTS.md
├── README.md              ← 給人看的簡介
├── index.html             ← 首頁（只有骨架，內容全部由 data/ 渲染）
├── bio.jpg                ← 大頭照
├── .nojekyll              ← 讓 GitHub Pages 不要用 Jekyll 處理
├── assets/
│   ├── css/style.css      ← 全站唯一的樣式表
│   └── js/
│       ├── site.js        ← 每頁共用：深色模式、選單、淡入、回到頂端、toast
│       ├── home.js        ← 只給 index.html：渲染專案／論文／動態、搜尋篩選
│       └── project.js     ← 只給 projects/*.html：渲染標題區與上一篇／下一篇
├── data/                  ← ★ 內容都在這裡 ★
│   ├── profile.js         ← SITE.profile、SITE.interests
│   ├── projects.js        ← SITE.projects
│   ├── publications.js    ← SITE.publications
│   └── news.js            ← SITE.news
├── projects/<slug>.html   ← 每個專案一頁
├── templates/project.html ← 專案頁模板（不要直接拿來當頁面）
└── tools/
    ├── new-project.mjs    ← 建立新專案頁
    └── check.mjs          ← 規則檢查器
```

**Script 載入順序固定為：`data/*.js` → `site.js` → 頁面專屬 js。** 順序錯了 `SITE` 會是 undefined。

**分工原則：資料在 `data/`、外觀在 `style.css`、行為在 `assets/js/`、敘述在 `projects/*.html`。** 不要把資料寫死在 HTML 或 JS 裡。

---

## 4. 資料格式

### 4.1 `SITE.profile` / `SITE.interests`（data/profile.js）
- `interests` 是側邊欄的研究興趣，**同時也是篩選標籤**。
- 想讓某個專案／論文能被某興趣篩到，它的 `tags` 必須包含**一字不差**的同一個字串。
- 新增 interest 前先確認至少有一個專案或論文會用到，避免點了沒結果。

### 4.2 `SITE.publications`（data/publications.js）
```js
{
  key: "chen2026farmer",          // 必填，唯一：第一作者姓氏小寫 + 年份 + 一個關鍵字
  title: "…",                     // 必填，照論文原標題
  authors: ["Yu-Chi Chen", "…"],  // 必填，用論文上的拼法；我的名字一定寫 "Yu-Chi Chen"（共同一作加 *）
  venue: "Accepted",              // 必填，只能是 Accepted / Under Review / Published / In Preparation
  year: 2026,                     // 必填，數字
  role: "First Author · Oral Presenter",  // 選填
  conference: "ICAI TECH 2026（…）",        // 選填，研討會／期刊全名
  desc: "…",                      // 必填，英文 2–4 句：方法 + 主要成果（有數字就寫數字）
  tags: ["RAG for Social Good"],  // 必填，至少一個要在 SITE.interests 裡
  project: "classpoints"          // 選填，對應 SITE.projects 的 slug → 會出現「Project page →」按鈕
}
```
- **最新的放陣列最上面。**
- 狀態改變（Under Review → Accepted）時直接改 `venue`，不要新增一筆。

### 4.3 `SITE.news`（data/news.js）
```js
{ date: "2026-11", text: "One short sentence. Emoji optional 🎉" }
```
- `date` 一律 `YYYY-MM`；**由新到舊排列**。
- 一則只寫一句話，可以用 `<a>`、`<code>`、`<b>`，不要放圖片。

### 4.4 `SITE.projects`（data/projects.js）
```js
{
  slug: "ed-triage",       // 必填，kebab-case，= 檔名 projects/ed-triage.html
  emoji: "🚑",             // 必填，一個 emoji，當卡片圖示
  title: "…",              // 必填，格式建議「名稱: 一句副標」，60 字元內
  tagline: "…",            // 必填，一句話，110 字元內，說「它做什麼」而不是「它用什麼技術」
  year: 2026,              // 必填
  status: "Completed",     // 必填，只能是 Prototype / Completed / Deployed / Ongoing
  role: "Solo developer",  // 必填，例如 Solo developer / Team lead (4 people)
  stack: ["Python", "…"],  // 必填，3–5 個最重要的
  tags: ["Human-AI Interaction"],  // 必填，至少一個在 SITE.interests 裡
  repo: "https://github.com/…",    // 選填，但 repo 與 demo 至少要有一個
  demo: "https://…"                // 選填，有線上 demo 才填，會變成主要按鈕
}
```
- 陣列順序 = 首頁卡片順序 = 詳細頁「上一篇／下一篇」順序。**新專案預設放最後**，除非我說要置頂。
- 標題、標語、年份、技術、連結 **只寫在這裡**，詳細頁會自動讀取，不要在 HTML 裡重複。

---

## 5. 新增一個專案頁（最常見的任務）

1. **蒐集素材**：讀該專案的 README／程式碼，或請我提供。**只寫有根據的內容。**
2. 執行
   ```bash
   node tools/new-project.mjs <slug> "Project Title"
   ```
   會產生 `projects/<slug>.html`，並在 `data/projects.js` 最後加一筆待填資料。
3. 填 `data/projects.js` 那一筆的所有欄位（照 §4.4）。
4. 填 `projects/<slug>.html` 的 section。**id 不可改、順序不可改：**

   | section id | 標題 | 必填 | 寫法 |
   |---|---|---|---|
   | `motivation` | Why I built it | ✅ | 1–2 段。誰、遇到什麼問題、為什麼現有做法不夠 |
   | `what-i-built` | What I built | ✅ | 一句總結 + `<ul>` 3–5 項，每項 `<li><b>功能</b> — 說明</li>` |
   | `highlights` | Technical highlights | ✅ | `<ul>` 2–4 項，寫「技術決策 + 為什麼」，不是列技術名詞 |
   | `results` | Results | 選填 | `.stat-row` 放 1–3 個 `.stat` 數字卡 + 一段說明。**沒有可驗證的數字就整段刪掉** |
   | `reflection` | What I learned | ✅ | 1 段。學到什麼、下次會怎麼改 |

   可用的元件只有：`<p>`、`<ul>/<li>`、`<b>`、`<code>`、`<table>`、`.stat-row > .stat`。需要新元件時，先加到 `style.css` 並更新本節。
5. 執行 `node tools/check.mjs`，必須顯示 `✓ 檢查通過`。
6. 在 `data/news.js` 最上面加一則動態（例如 `"Added a project page for …"`）— 可選，但建議。

## 6. 其他常見任務

| 任務 | 要改的地方 |
|---|---|
| 新增論文 | `data/publications.js` 最上面加一筆（§4.2） |
| 論文狀態更新 | 改那一筆的 `venue`，必要時加一則 news |
| 新增動態 | `data/news.js` 最上面加一筆（§4.3） |
| 新增研究興趣 | `data/profile.js` 的 `interests`（§4.1） |
| 改配色 | 只改 `style.css` 最上面 `:root` 與 `[data-theme="dark"]` 的 CSS 變數 |
| 首頁新增一整個區塊 | `index.html` 加 `<section id="…" class="reveal">` + 導覽列加連結 + `home.js` 加渲染函式 + `data/` 加資料檔；**同步修改 `templates/project.html` 與所有 `projects/*.html` 的導覽列**，並更新本文件 §3 |

---

## 7. 視覺風格

- 氣質：**乾淨、學術、溫暖**。米白底 + 琥珀色強調色，像一份排版用心的論文。
- 字型：內文 Inter；標題（`h1`、`section h2`、品牌名）Source Serif 4。
- 顏色**只能用 CSS 變數**：`--bg --card --text --muted --soft --border --accent --accent-soft --chip`。不准寫死色碼（深色模式會壞）。
- 卡片統一：`border-radius: 14px`、`1px solid var(--border)`、`box-shadow: var(--shadow)`，hover 往上浮 3px。
- 內容寬度：首頁 `1100px`（側邊欄 300px + 內容），專案頁 `820px` 單欄。
- 必須支援：深色模式、860px 以下的手機版排版。
- Emoji 可以點綴，但每個標題最多一個。
- 互動彩蛋（愛心、點頭像 5 下撒彩帶）是個人特色，**保留，不要移除**。

## 8. 文字風格

- 英文、第一人稱、主動語態：「I built…」，不要「This project was developed…」。
- 具體優先：有數字寫數字（`1,195 records`、`~31% less reviewer time`）。
- 不誇大：不要用 *revolutionary*、*cutting-edge*、*state-of-the-art* 這類詞。
- 技術名詞第一次出現用 `<code>` 包函式／套件名稱。

---

## 9. AI 修改時必須遵守

1. **不編造**：成果數字、獎項、論文狀態、合作者、連結，全部要有來源（README、論文、或我親口說）。不確定就留著問我，不要猜。
2. **只動必要的檔案**；不要順手重構、改名或調整與任務無關的樣式。
3. 不新增框架、套件、build 流程、CDN 或追蹤碼。
4. 不在 `projects/*.html` 寫 `<style>` 或寫死顏色；樣式一律進 `style.css`。
5. 不刪除既有內容（論文、動態、專案），除非我明確要求。
6. 檔名一律小寫 kebab-case；圖片放 `assets/img/<slug>-<描述>.webp`（需要時才建立這個資料夾），寬度不超過 1600px，並寫 `alt`。
7. 外部連結一律 `target="_blank" rel="noopener"`。
8. 修改後：
   - 執行 `node tools/check.mjs` 必須通過；
   - 若能開瀏覽器，檢查淺色／深色模式與手機寬度各一次；
   - 若改變了結構或規則，**同步更新本文件**。
9. Commit 訊息格式：`<type>: <說明>`，type 為 `content`（內容）/ `feat`（功能）/ `style`（外觀）/ `fix` / `docs`。例：`content: add ed-triage project page`。

## 10. 部署

- GitHub Pages：Settings → Pages → Deploy from branch → `main` / `(root)`。
- push 到 `main` 約 1 分鐘後生效：<https://ycchenn.github.io/personal_web/>
- 本機預覽：直接雙擊 `index.html`，或 `python3 -m http.server` 後開 <http://localhost:8000>。
