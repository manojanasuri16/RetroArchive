# RetroArchive

A static website (Astro 5, no client framework) listing Symbian S60v3 and Java ME software for the Nokia N79: my apps, a community archive, and SDKs/tools. Works without JavaScript; a tiny vanilla script adds catalog filtering, search and the dark-mode toggle. A separate lite site at `/m/` is built for the N79's own browser.

## Develop

```
npm install
npm run dev        # local server
npm run sync       # refresh src/data/releases.json from GitHub (set GITHUB_TOKEN to avoid rate limits)
npm run build      # sync + static build into dist/
npm run preview
```

`sync` never fails the build; on network errors the committed `src/data/releases.json` is used. Set `CONTENT_DIR` to load content from a folder other than `src/content`.

## Add an entry

```
npm run new -- app my-game      # also: sdk, guide, news
```

This writes a stub in `src/content/`. Fill it in following the schema in `src/content.config.ts` (see `SPEC.md`). Put images in `public/media/<slug>/`. If the entry has a `repo:`, versions, dates, files and changelog come from its GitHub releases; otherwise list `files:` by hand. Third-party binaries go to GitHub Releases of a separate files repo, never into git. Only add `tested:` results you actually observed. Credit authors and give a licence; entries whose licence forbids re-hosting are link-only (`rehostable: false`).

## Deploy on GitHub Pages

1. Push to `main` on `manojanasuri16/RetroArchive`.
2. Settings, Pages, Source: GitHub Actions.
3. `.github/workflows/deploy.yml` builds on every push, daily (to refresh release data) and on manual dispatch. It uses repository variables `SITE_URL` (default `https://manojanasuri16.github.io`) and `SITE_BASE` (default `/RetroArchive`). For a custom domain at the root set `SITE_URL` to the domain and `SITE_BASE` to `/`.

## Deploy on Cloudflare Pages (or Netlify)

Connect the repo with build command `npm run build` and output directory `dist`. Set env `SITE_URL` to the site URL and leave `SITE_BASE` unset (`/`). `public/_headers` sets MIME types for `.jad`, `.jar`, `.sis` and `.sisx` in case files are hosted on the same site later. Rebuild daily with a deploy hook to refresh release data.
