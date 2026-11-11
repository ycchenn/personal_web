/* =====================================================================
   assets/js/site.js — 每一頁都會載入的共用行為
   深色模式、手機選單、捲動淡入、回到頂端、toast、頁尾年份。
   頁面專屬邏輯請放在自己的檔案（例如 home.js），不要塞進這裡。
   ===================================================================== */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};

function toast(msg) {
  const t = $("#toast"); if (!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- Dark mode ---------- */
let theme = store.get("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  const icon = t === "dark" ? "☀️" : "🌙";
  $$("#themeBtn, #themeBtnMobile").forEach(b => b.textContent = icon);
}
applyTheme(theme);
$$("#themeBtn, #themeBtnMobile").forEach(b => b.onclick = () => {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme(theme); store.set("theme", theme);
});

/* ---------- Mobile menu ---------- */
const menuBtn = $("#menuBtn");
if (menuBtn) menuBtn.onclick = () => $("#navLinks").classList.toggle("open");
$$(".nav-links a").forEach(a => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) en.target.classList.add("show"); });
}, { threshold: .12 });
function observeReveal() { $$(".reveal:not(.show)").forEach(el => io.observe(el)); }
observeReveal();

/* ---------- Back to top + active nav link (only for #hash links) ---------- */
const toTop = $("#toTop");
if (toTop) toTop.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
window.addEventListener("scroll", () => {
  if (toTop) toTop.classList.toggle("show", scrollY > 400);
  const sections = $$("main section[id]");
  if (!sections.length || document.body.dataset.page !== "home") return;
  let current = sections[0].id;
  sections.forEach(s => { if (scrollY >= s.offsetTop - 140) current = s.id; });
  $$(".nav-links a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
});

/* ---------- Footer year ---------- */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
