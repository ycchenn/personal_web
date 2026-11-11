#!/usr/bin/env node
// 用法：node tools/new-project.mjs <slug> ["Project Title"]
// 1. 複製 templates/project.html → projects/<slug>.html（替換 {{SLUG}}、{{TITLE}}）
// 2. 在 data/projects.js 陣列尾端加一筆待填的資料
// 不會覆蓋已存在的檔案。完成後請照 AGENTS.md §5 把 TODO 填完，再跑 node tools/check.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [slug, title = "TODO Project Title"] = process.argv.slice(2);

if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error("✗ slug 必須是 kebab-case（小寫英數 + 連字號），例如 news-lens");
  process.exit(1);
}

const page = path.join(root, "projects", `${slug}.html`);
if (fs.existsSync(page)) { console.error(`✗ ${path.relative(root, page)} 已存在`); process.exit(1); }

const tpl = fs.readFileSync(path.join(root, "templates", "project.html"), "utf8")
  .replace(/<!--\s*\n\s*templates\/project\.html[\s\S]*?-->\n/, "")   // 拿掉模板說明註解
  .replaceAll("{{SLUG}}", slug)
  .replaceAll("{{TITLE}}", title);
fs.writeFileSync(page, tpl);

const dataFile = path.join(root, "data", "projects.js");
const data = fs.readFileSync(dataFile, "utf8");
if (data.includes(`slug: "${slug}"`)) {
  console.log(`• data/projects.js 已有 ${slug}，略過`);
} else {
  const entry = `,
  {
    slug: "${slug}",
    emoji: "✨",
    title: "${title}",
    tagline: "TODO: one sentence, under 110 characters.",
    year: ${new Date().getFullYear()},
    status: "Prototype",
    role: "Solo developer",
    stack: ["TODO"],
    tags: ["TODO"],
    repo: ""
  }
];`;
  const i = data.lastIndexOf("}\n];");
  if (i === -1) { console.error("✗ 找不到 SITE.projects 陣列結尾，請手動新增"); process.exit(1); }
  fs.writeFileSync(dataFile, data.slice(0, i + 1) + entry + data.slice(i + 4));
  console.log(`✓ 已在 data/projects.js 新增 ${slug}（放在陣列最後）`);
}

console.log(`✓ 已建立 projects/${slug}.html`);
console.log("  下一步：填完所有 TODO → node tools/check.mjs");
