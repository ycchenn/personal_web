**Live:** <https://ycchenn.github.io/personal_web/>

My personal academic site — projects, publications, and news — built as a plain static site
(HTML + CSS + vanilla JS, no build step) and designed to be extended by AI coding assistants.

## How it's organised

| Where | What |
|---|---|
| `data/*.js` | All content (profile, projects, publications, news) |
| `projects/<slug>.html` | One detail page per project |
| `assets/css/style.css` | The only stylesheet |
| `assets/js/` | Shared + page-specific rendering |
| `templates/project.html` | Template for new project pages |
| `tools/` | `new-project.mjs` (scaffold) and `check.mjs` (rule checker) |
| `AGENTS.md` / `CLAUDE.md` | Rules for AI assistants working on this repo |

## Add a project in 3 steps

```bash
node tools/new-project.mjs my-project "My Project: Short subtitle"
# fill the entry in data/projects.js and the sections in projects/my-project.html
node tools/check.mjs
```

Or just tell an AI assistant: *"Read AGENTS.md and add a project page for &lt;repo URL&gt;."*
