# basalt-site

Public static site for **Basalt: Health & Fitness** — served via GitHub Pages at
`basalt.itseliias.com`.

- `index.html` — landing page
- `privacy/` — privacy policy (DRAFT until the banner is removed)
- `delete-account/` — Play-required account-deletion page (DRAFT until the banner is removed)
- `style.css` — shared stylesheet, tokens carried over verbatim from the app repo's
  `packages/ui/src/tokens.ts` design contract

No build step — plain static HTML/CSS, deployed straight from `main` via Pages.

Source of truth for app behavior is `ItsEliias/basalt` (private). This repo mirrors only what
must be public: the marketing page and the two legal/compliance pages.
