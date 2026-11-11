/* =====================================================================
   data/profile.js — 個人基本資料（側邊欄 / 打字效果 / 興趣標籤）
   規則見 AGENTS.md §4.1。只改資料，不要在這裡寫 DOM 操作。
   ===================================================================== */
window.SITE = window.SITE || {};

SITE.profile = {
  name: "Yu Chi Chen",
  affiliation: "National Chengchi University",
  github: "https://github.com/ycchenn",
  linkedin: "https://www.linkedin.com/in/yuchichen2005/",
  // 側邊欄打字機效果輪播的身分
  roles: ["Undergraduate Student", "MIS × Digital Content", "HCI Researcher", "AI for Social Good"]
};

// 研究興趣：同時是「篩選標籤」。publications / projects 的 tags
// 若要能被篩選，必須「完全一致」地使用這裡的字串。
SITE.interests = [
  "Human-AI Interaction",
  "Multimodal LLMs",
  "RAG for Social Good",
  "Agentic AI",
  "EduTech",
  "Data Governance"
];
