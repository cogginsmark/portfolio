# cogginsmark.com

My personal portfolio: graphic design, journalism, and video work, live at [cogginsmark.com](https://www.cogginsmark.com). I design and build this site myself; it runs on Vue 3 and Vite.

## What's here

- **Home** — selected design work, and the organizations that have hired me for it.
- **About** — my background, experience, and awards.
- **Videos** — video work across news, teaching, and campus media, plus client pieces.
- **Contact** — email, my résumé, and my profiles.

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Pushing to main auto-deploys; pull requests get preview deployments. `vercel.json` pins the Vite build (output `dist`) and rewrites non-file routes to `index.html`, so history-mode routes like `/about` and `/videos` load correctly when visited directly.
