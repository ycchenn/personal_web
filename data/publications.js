/* =====================================================================
   data/publications.js — 論文列表
   新增規則見 AGENTS.md §4.2：最新的放最上面；key = 姓氏+年份+關鍵字。
   ===================================================================== */
window.SITE = window.SITE || {};

SITE.publications = [
  {
    key: "chen2026transparency",
    title: "班級經營數位化：一套審計追蹤導向的計分系統設計與導入案例",
    authors: ["Yu-Chi Chen"],
    venue: "Accepted",
    year: 2026,
    role: "First Author · Oral Presenter",
    conference: "TANET 2026（Taiwan Academic Network Conference, 臺灣網際網路研討會）",
    desc: "This study utilizes the Design Science Research (DSR) methodology to develop a digital classroom honor roll system. By integrating audit trails, real-time data synchronization, and data governance mechanisms, the system addresses long-standing challenges in traditional classroom grading, such as records preservation and dispute evidence. The system was implemented in an elementary school classroom for one full semester, accumulating 1,195 grading records, with its effectiveness validated and recognized by frontline teachers.",
    tags: ["EduTech", "Human-AI Interaction", "Data Governance", "Digital Transformation"],
    project: "classpoints"
  },
  {
    key: "chen2026classroom",
    title: "Multimodal Content Replanning for Lecture Video Reconstruction: Integrating ASR, OCR, and Handwritten Annotation Regeneration",
    authors: ["Jie-Shiuan Gong*", "Yu-Chi Chen*", "Yen-Chen Tung*", "Guang-Xi Zheng*", "Shun-Wen Hsiao"],
    venue: "Under Review",
    year: 2026,
    role: "First Author · Oral Presenter",
    conference: "IEEE ISM 2026",
    desc: "This study integrates ASR, OCR, and Multimodal LLMs to automatically reconstruct instructional videos with structured content and handwritten notes. Utilizing LLM-as-a-Judge evaluation, the system yields a 94.56% core knowledge retention rate, outperforming baseline methods by up to 11.6 percentage points.",
    tags: ["Multimodal LLMs", "Human-AI Interaction", "EduTech", "LLM-as-a-Judge"]
  },
  {
    key: "chen2026farmer",
    title: "A RAG-Powered Agentic Chatbot Combining Farm Record-Keeping and Brand Narrative with Open Government Data for Taiwanese Smallholder Farmers",
    authors: ["Yu-Chi Chen", "Guang-Xi Zheng", "Chen-Yu Kuo", "Chih-Hsun Wu"],
    venue: "Accepted",
    year: 2026,
    role: "Co-First Author",
    conference: "ICAI TECH 2026（International Conference on AI and Technological Solutions；IEEE Co-Sponsored）",
    desc: "Targeting the digital divide of smallholder farmers, this study combines RAG, Agentic AI, ASR, and LLMs to convert daily speech into farming logs, certification drafts, and marketing content, while leveraging official data retrieval and evidence citation to boost information credibility.",
    tags: ["RAG for Social Good", "Agentic AI", "Human-AI Interaction", "Information Reliability"]
  }
];
