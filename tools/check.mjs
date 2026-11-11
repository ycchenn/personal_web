#!/usr/bin/env node
// 用法：node tools/check.mjs
// 檢查 AGENTS.md 的規則有沒有被遵守。任何 ✗ 都要修好才能 commit。
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rel = p => path.relative(root, p);
const errors = [], warns = [];
const err = m => errors.push(m), warn = m => warns.push(m);

// ---- 載入 data/*.js（在沙盒裡執行，取得 SITE）----
const ctx = { window: {} }; ctx.window = ctx; vm.createContext(ctx);
for (const f of ["profile", "projects", "publications", "news"]) {
  const file = path.join(root, "data", `${f}.js`);
  try { vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: rel(file) }); }
  catch (e) { err(`${rel(file)} 語法錯誤：${e.message}`); }
}
const S = ctx.SITE || {};
const interests = new Set(S.interests || []);

// ---- projects ----
const REQ_P = ["slug", "emoji", "title", "tagline", "year", "status", "role", "stack", "tags"];
const STATUS = ["Prototype", "Completed", "Deployed", "Ongoing"];
const slugs = new Set();
for (const p of S.projects || []) {
  const id = `projects[${p.slug || "?"}]`;
  for (const k of REQ_P) if (p[k] === undefined || p[k] === "") err(`${id} 缺少欄位 ${k}`);
  if (slugs.has(p.slug)) err(`${id} slug 重複`); slugs.add(p.slug);
  if (p.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) err(`${id} slug 不是 kebab-case`);
  if (p.status && !STATUS.includes(p.status)) err(`${id} status 必須是 ${STATUS.join(" / ")}`);
  if (p.tagline && p.tagline.length > 110) warn(`${id} tagline 超過 110 字元（${p.tagline.length}）`);
  if (JSON.stringify(p).includes("TODO")) err(`${id} 還有 TODO 沒填`);
  if (!p.repo && !p.demo) warn(`${id} 沒有 repo 也沒有 demo 連結`);
  if (Array.isArray(p.tags) && !p.tags.some(t => interests.has(t)))
    warn(`${id} 沒有任何 tag 屬於 SITE.interests，興趣篩選時永遠不會出現`);

  const page = path.join(root, "projects", `${p.slug}.html`);
  if (!fs.existsSync(page)) { err(`${id} 找不到 ${rel(page)}（請用 tools/new-project.mjs 建立）`); continue; }
  const html = fs.readFileSync(page, "utf8");
  if (!html.includes(`data-slug="${p.slug}"`)) err(`${rel(page)} 的 <body data-slug> 與檔名不一致`);
  for (const sec of ["motivation", "what-i-built", "highlights", "reflection"])
    if (!html.includes(`<section id="${sec}"`)) err(`${rel(page)} 缺少必填 section #${sec}`);
  if (/TODO|\{\{|metric description/.test(html)) err(`${rel(page)} 還有模板佔位文字（TODO / {{ }} / metric description）`);
  if (/<style[\s>]|style="[^"]*color:\s*#/i.test(html)) err(`${rel(page)} 出現 <style> 或寫死的顏色，請改用 style.css 與 CSS 變數`);
  for (const s of ["../data/projects.js", "../assets/js/site.js", "../assets/js/project.js"])
    if (!html.includes(`src="${s}"`)) err(`${rel(page)} 少載入 ${s}`);
}
// 反向：有頁面但沒資料
for (const f of fs.readdirSync(path.join(root, "projects")).filter(f => f.endsWith(".html")))
  if (!slugs.has(f.replace(/\.html$/, ""))) err(`projects/${f} 在 data/projects.js 裡沒有對應資料`);

// ---- publications ----
const keys = new Set();
for (const p of S.publications || []) {
  const id = `publications[${p.key || "?"}]`;
  for (const k of ["key", "title", "authors", "venue", "year", "desc", "tags"]) if (!p[k]) err(`${id} 缺少欄位 ${k}`);
  if (keys.has(p.key)) err(`${id} key 重複`); keys.add(p.key);
  if (p.project && !slugs.has(p.project)) err(`${id} project: "${p.project}" 不存在於 projects`);
  if (!["Accepted", "Under Review", "Published", "In Preparation"].includes(p.venue))
    err(`${id} venue 必須是 Accepted / Under Review / Published / In Preparation`);
}

// ---- news ----
const dates = (S.news || []).map(n => n.date);
dates.forEach(d => { if (!/^\d{4}-\d{2}$/.test(d)) err(`news 日期格式錯誤：${d}（要 YYYY-MM）`); });
if (dates.join() !== [...dates].sort().reverse().join()) err("news 沒有依日期由新到舊排列");

// ---- 結果 ----
warns.forEach(m => console.log("⚠ " + m));
errors.forEach(m => console.log("✗ " + m));
if (errors.length) { console.log(`\n${errors.length} 個錯誤，請修正。`); process.exit(1); }
console.log(`✓ 檢查通過：${slugs.size} 個專案、${keys.size} 篇論文、${dates.length} 則動態${warns.length ? `（${warns.length} 個提醒）` : ""}`);
