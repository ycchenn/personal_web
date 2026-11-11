/* =====================================================================
   data/projects.js — 專案列表（首頁卡片 + 詳細頁上一篇/下一篇的順序）
   規則見 AGENTS.md §4.4。每一筆都必須有對應的 projects/<slug>.html，
   新增時請用：node tools/new-project.mjs <slug>
   ===================================================================== */
window.SITE = window.SITE || {};

SITE.projects = [
  {
    slug: "classpoints",
    emoji: "🏫",
    title: "HelpingMyMama: Classroom Point Record System",
    tagline: "An evidence-based, real-time point system built for my mom's elementary classroom.",
    year: 2026,
    status: "Deployed",
    role: "Solo developer",
    stack: ["JavaScript", "Tailwind CSS", "Firebase Firestore", "GitHub Pages"],
    tags: ["EduTech", "Data Governance"],
    repo: "https://github.com/ycchenn/classpointsproject"
  },
  {
    slug: "newslens",
    emoji: "📰",
    title: "NewsLens: Video × News Cross-Checking",
    tagline: "Transcribes a YouTube video and compares it with live news coverage in two reading modes.",
    year: 2026,
    status: "Prototype",
    role: "Solo developer",
    stack: ["Python", "Gradio", "Groq (Whisper + Llama 3.1)", "MongoDB"],
    tags: ["Human-AI Interaction", "Multimodal LLMs"],
    repo: "https://github.com/ycchenn/NewsLens"
  },
  {
    slug: "ed-triage",
    emoji: "🚑",
    title: "AI-Assisted ED Triage Simulation",
    tagline: "A discrete-event simulation comparing when humans should double-check an AI's triage score.",
    year: 2026,
    status: "Completed",
    role: "Solo developer",
    stack: ["Python", "SimPy", "Streamlit"],
    tags: ["Human-AI Interaction"],
    repo: "https://github.com/ycchenn/Emergency-Department-Triage-Simulation"
  }
];
