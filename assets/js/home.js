/* =====================================================================
   assets/js/home.js — 只給 index.html 用的渲染邏輯
   所有內容都來自 data/*.js（SITE.*）；這個檔案只負責「怎麼顯示」。
   ===================================================================== */
const { profile, interests, publications: pubs, news, projects } = SITE;

/* ---------- 1. Typing effect ---------- */
(function typeLoop() {
  const el = $("#typed"), roles = profile.roles; let r = 0, i = 0, deleting = false;
  (function tick() {
    const word = roles[r];
    el.textContent = word.slice(0, i);
    if (!deleting && i < word.length) { i++; setTimeout(tick, 80); }
    else if (!deleting) { deleting = true; setTimeout(tick, 1600); }
    else if (i > 0) { i--; setTimeout(tick, 40); }
    else { deleting = false; r = (r + 1) % roles.length; setTimeout(tick, 300); }
  })();
})();

/* ---------- 2. Projects ---------- */
function renderProjects(list) {
  $("#projList").innerHTML = list.map(p => `
    <a class="proj-card" href="projects/${p.slug}.html" data-slug="${p.slug}">
      <span class="emoji">${p.emoji}</span>
      <h3>${p.title}</h3>
      <p>${p.tagline}</p>
      <div class="meta"><span class="status">${p.status} · ${p.year}</span><span class="go">Read more →</span></div>
    </a>`).join("");
}

/* ---------- 3. Publications: render + search + filter ---------- */
let activeInterest = null;

function bibtex(p) {
  return `@article{${p.key},\n  title  = {${p.title}},\n  author = {${p.authors.join(" and ")}},\n  note   = {${p.venue}},\n  year   = {${p.year}}\n}`;
}

function renderPubs() {
  $("#pubList").innerHTML = pubs.map((p, idx) => `
    <article class="pub" data-idx="${idx}">
      <h3>${p.title}</h3>
      <div class="authors">${p.authors.map(a => a.startsWith("Yu-Chi Chen") ? "<b>" + a + "</b>" : a).join(", ")}</div>
      <span class="venue">${p.venue} · ${p.year}</span>
      <div class="details"><div>
        <div class="pub-meta">
          ${p.conference ? `<span class="conf">🏛️ ${p.conference}</span>` : ""}
          ${p.role ? `<span class="role">👤 ${p.role}</span>` : ""}
        </div>
        <p class="desc">${p.desc}</p>
        <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
      </div></div>
      <div class="pub-actions">
        <button data-act="more">Details ▾</button>
        <button data-act="bib">BibTeX</button>
        ${p.project ? `<a class="pub-link" href="projects/${p.project}.html">Project page →</a>` : ""}
      </div>
      <div class="bib"><pre><button class="copy-btn">Copy</button><code>${bibtex(p)}</code></pre></div>
    </article>`).join("");
}

function applyFilters() {
  const q = $("#search").value.trim().toLowerCase();
  let shown = 0;
  $$(".pub").forEach(el => {
    const p = pubs[el.dataset.idx];
    const hay = (p.title + " " + p.authors.join(" ") + " " + p.desc + " " + p.tags.join(" ")).toLowerCase();
    const ok = (!q || hay.includes(q)) && (!activeInterest || p.tags.includes(activeInterest));
    el.classList.toggle("hidden", !ok);
    if (ok) shown++;
  });
  // 興趣標籤也會篩選專案卡片
  $$(".proj-card").forEach(el => {
    const p = projects.find(x => x.slug === el.dataset.slug);
    el.style.display = !activeInterest || p.tags.includes(activeInterest) ? "" : "none";
  });
  $("#pubCount").textContent = `${shown} / ${pubs.length}`;
  $("#empty").style.display = shown ? "none" : "block";
  $("#filterStatus").innerHTML = activeInterest
    ? `Filtering by <b>${activeInterest}</b> · <button id="clearFilter">clear</button>` : "";
  const c = $("#clearFilter"); if (c) c.onclick = () => setInterest(null);
}

function setInterest(name) {
  activeInterest = activeInterest === name ? null : name;
  $$(".chip").forEach(ch => ch.classList.toggle("on", ch.textContent === activeInterest));
  applyFilters();
  if (activeInterest) $("#projects").scrollIntoView({ behavior: "smooth" });
}

$("#interestChips").innerHTML = interests.map(i => `<button class="chip">${i}</button>`).join("");
$("#interestChips").addEventListener("click", e => { if (e.target.classList.contains("chip")) setInterest(e.target.textContent); });
$("#search").addEventListener("input", applyFilters);

$("#pubList").addEventListener("click", e => {
  const pub = e.target.closest(".pub"); if (!pub) return;
  if (e.target.dataset.act === "more") {
    const open = pub.querySelector(".details").classList.toggle("open");
    e.target.classList.toggle("open", open);
    e.target.textContent = open ? "Less ▴" : "Details ▾";
  }
  if (e.target.dataset.act === "bib") {
    e.target.classList.toggle("open");
    pub.querySelector(".bib").classList.toggle("open");
  }
  if (e.target.classList.contains("copy-btn")) {
    const text = bibtex(pubs[pub.dataset.idx]);
    const done = () => { e.target.textContent = "Copied ✓"; toast("BibTeX copied to clipboard"); setTimeout(() => e.target.textContent = "Copy", 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done).catch(() => toast("Copy failed — please select manually"));
    else toast("Copy not supported — please select manually");
  }
});

/* ---------- 4. News ---------- */
$("#newsList").innerHTML = news.map(n => `<div class="news-item"><time>${n.date}</time><p>${n.text}</p></div>`).join("");

/* ---------- 5. Like button ---------- */
let likes = parseInt(store.get("likes") || "0", 10);
let liked = store.get("liked") === "1";
function renderLike() {
  $("#likeCount").textContent = likes;
  $("#likeBtn").classList.toggle("liked", liked);
  $("#likeBtn").firstChild.textContent = liked ? "❤️ Liked " : "🤍 Like ";
}
$("#likeBtn").addEventListener("click", e => {
  liked = !liked; likes += liked ? 1 : -1;
  store.set("likes", likes); store.set("liked", liked ? "1" : "0");
  renderLike();
  if (liked) for (let k = 0; k < 6; k++) {
    const h = document.createElement("span");
    h.className = "heart-pop"; h.textContent = ["❤️", "💖", "✨"][k % 3];
    h.style.left = e.clientX + "px"; h.style.top = e.clientY + "px";
    h.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
    document.body.appendChild(h); setTimeout(() => h.remove(), 1000);
  }
});

/* ---------- 6. Easter egg: click avatar 5 times ---------- */
let clicks = 0, clickTimer;
document.addEventListener("click", e => {
  if (e.target.id !== "avatar") return;
  clicks++; clearTimeout(clickTimer);
  clickTimer = setTimeout(() => clicks = 0, 1200);
  if (clicks >= 5) {
    clicks = 0; toast("🎉 You found the easter egg! Thanks for visiting!");
    const colors = ["#f59e0b", "#e11d48", "#10b981", "#3b82f6", "#8b5cf6"];
    for (let k = 0; k < 60; k++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[k % colors.length];
      c.style.animationDuration = (1.8 + Math.random() * 1.5) + "s";
      c.style.animationDelay = Math.random() * .4 + "s";
      document.body.appendChild(c); setTimeout(() => c.remove(), 4000);
    }
  }
});

/* ---------- Init ---------- */
renderProjects(projects);
renderPubs();
applyFilters();
renderLike();
