/* =====================================================================
   assets/js/project.js — 專案詳細頁共用渲染
   讀 <body data-slug="...">，到 SITE.projects 找資料，渲染：
     #projectHero（emoji、標題、標語、資訊卡、按鈕）與 #pager（上一篇/下一篇）
   ===================================================================== */
(function () {
  const slug = document.body.dataset.slug;
  const list = SITE.projects;
  const idx = list.findIndex(p => p.slug === slug);
  const p = list[idx];

  if (!p) {
    $("#projectHero").innerHTML = `<p class="empty" style="display:block">
      Project "<b>${slug}</b>" is missing from <code>data/projects.js</code>.</p>`;
    return;
  }

  $("#projectHero").innerHTML = `
    <div class="hero">
      <span class="status">${p.status} · ${p.year}</span>
      <h1>${p.emoji} ${p.title}</h1>
      <p class="tagline">${p.tagline}</p>
    </div>
    <dl class="facts">
      <div><dt>Role</dt><dd>${p.role}</dd></div>
      <div><dt>Year</dt><dd>${p.year}</dd></div>
      <div><dt>Stack</dt><dd>${p.stack.join(" · ")}</dd></div>
      <div><dt>Topics</dt><dd>${p.tags.join(" · ")}</dd></div>
    </dl>
    <div class="links">
      ${p.demo ? `<a class="btn primary" href="${p.demo}" target="_blank" rel="noopener">▶ Live demo</a>` : ""}
      ${p.repo ? `<a class="btn" href="${p.repo}" target="_blank" rel="noopener">GitHub repo ↗</a>` : ""}
    </div>`;

  const prev = list[idx - 1], next = list[idx + 1];
  $("#pager").innerHTML =
    (prev ? `<a class="prev" href="${prev.slug}.html">← ${prev.title}</a>` : "") +
    (next ? `<a class="next" href="${next.slug}.html">${next.title} →</a>` : "");
})();
