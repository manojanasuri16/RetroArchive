# RetroArchive — build spec

A static website listing Symbian (S60 3rd Edition) and Java ME software that runs on the
Nokia N79 (S60 3rd Edition FP2, Symbian 9.3, 240x320, MIDP 2.0 / CLDC 1.1).
It has three kinds of entries:

- **My Apps**: by the owner (GitHub user `manojanasuri16`): RetroSend, RetroTele, RetroTorch.
- **Archive**: third-party apps and games that were tested on the N79. It starts empty or
  small, and the owner adds entries over time.
- **SDKs & Tools**: toolchains, runtimes, hack/unlock tools.

Scope for now is the N79 only: Symbian S60v3 (.sis/.sisx, PyS60 apps) and Java ME
(.jar/.jad). Nothing else.

## Stack

- **Astro 5**, static output (`output: 'static'`). TypeScript. Content collections with zod
  schemas (`src/content.config.ts`, glob loaders).
- **No client JS is required.** Every page works with JS off. Small vanilla JS adds catalog
  filtering, search and the theme toggle on modern browsers.
- No Tailwind. One hand-written CSS file with tokens (`src/styles/global.css`).
- Fonts: Google Fonts, **Barlow Condensed** (600/700) for headings, nav, buttons and badges,
  and **Barlow** (400/500) for body text. Monospace: system `ui-monospace`.
- Node 22. `npm run build` must pass with zero errors.
- Base path comes from env: `SITE_URL` and `SITE_BASE` (default `/`). All internal links go
  through a helper `url(path)` that prefixes `import.meta.env.BASE_URL`, so the site works at
  `https://manojanasuri16.github.io/RetroArchive/` and at a custom domain root.

## Data model (the contract between the site code and the content)

All of these live under `src/content/`. The filename is the slug.

### `apps/<slug>.yaml` (apps AND games, mine and community)
```yaml
name: RetroSend                     # required
tagline: LocalSend for old Nokia phones   # required, one line
kind: app                           # app | game
source: mine                        # mine | community
platform: symbian                   # symbian | java
runtime: pys60                      # native | pys60 | midp   (optional)
category: network                   # utility|network|messaging|media|system|productivity|
                                    # game-action|game-puzzle|game-racing|game-sports|game-rpg|game-arcade|game-strategy
author: Manoj Anasuri               # required
authorUrl: https://github.com/manojanasuri16   # optional
license: MIT                        # optional; "Freeware" | "Abandonware" | "Unknown" allowed
repo: manojanasuri16/RetroSend      # optional; release data is synced from GitHub
homepage: https://...               # optional
version: 1.2.1                      # optional fallback if no repo or sync data
released: 2026-11-21                # optional fallback
added: 2026-11-22                   # required, date added to archive
featured: true                      # optional
icon: retrosend/icon.png            # optional, relative to public/media/
screenshots: [retrosend/1.png]      # optional, relative to public/media/; 240x320 portrait preferred
files:                              # optional manual files (third-party, or override of sync)
  - name: RetroSend.sis
    url: https://github.com/.../RetroSend.sis
    kind: sis                       # sis | sisx | jar | jad | zip | other
    size: 182000                    # bytes, optional
    sha256: abc...                  # optional
    note: Main installer            # optional
requires: [pys60-runtime]           # optional; slugs of apps/ or sdks/ entries
signing: self-signed                # signed | self-signed | unsigned | needs-hack
capabilities: [NetworkServices, ReadUserData]   # optional
tested:                             # optional
  - device: n79                     # slug in devices/
    firmware: "31.0.008"
    status: works                   # works | partial | broken
    notes: Installs to the memory card too
installNotes: [ "..." ]             # optional list of markdown strings
knownIssues: [ "..." ]              # optional list of markdown strings
description: |                      # required, markdown
  Long description...
```

### `sdks/<slug>.yaml`
```yaml
name: Symbian S60v3 toolchain
tagline: ...
kind: toolchain                     # sdk | toolchain | runtime | tool | hack
hostOs: [linux]                     # linux | windows | macos | phone
author: ...
license: ...
repo: manojanasuri16/symbian-s60v3-toolchain    # optional
homepage: ...                       # optional
version: ...                        # optional
added: 2026-11-22
featured: false
icon: ...                           # optional
files: [...]                        # same shape as apps
links: [{label: "Setup guide", url: "..."}]    # optional
guide: unlock-n79                   # optional slug in guides/
rehostable: true                    # false = licence forbids re-hosting, so link only
description: |
  ...
```

### `guides/<slug>.md`
Frontmatter: `title`, `summary`, `order` (number), `tags` (string[]), `updated` (date).
Body is markdown.

### `devices/<slug>.yaml`
```yaml
name: Nokia N79
platform: S60 3rd Edition FP2
os: Symbian OS 9.3
screen: 240x320
java: MIDP 2.0 / CLDC 1.1
released: 2008
image: devices/n79.png               # optional
notes: |
  markdown
```

### `news/<slug>.md`
Frontmatter: `title`, `date`, `summary`. Body is markdown.

## Release sync

`scripts/sync-releases.mjs` (run as `npm run sync`, and automatically before
`npm run build` in CI via `prebuild`, but it must never fail the build):

- For every apps/sdks entry with `repo:`, fetch the GitHub API
  `/repos/{repo}/releases?per_page=10`. Use `GITHUB_TOKEN` if set. Skip drafts.
- Write `src/data/releases.json`:
  `{ "<owner/repo>": { "fetched": iso, "latest": {tag, name, published, body, url,
  assets:[{name, url(browser_download_url), size, downloads(download_count),
  sha256(from digest "sha256:..." if present)}]}, "history": [{tag, published, body, url}] } }`
- On network errors keep the previous file. Commit the file so offline builds work.
- Site logic: files shown = the entry's manual `files` if present, else the latest release
  assets (drop `SHA256SUMS*`, `.txt` and `.rsc` unless they're the only ones; classify `kind` by
  extension). Version and date come from the latest release, else the YAML fallback.
  Changelog = history bodies, rendered as markdown.

## Pages

| Route | Content |
|---|---|
| `/` | Hero, 3 section cards, featured strip, latest additions, "news" teaser, phone poster |
| `/apps/` | Catalog of all apps and games. Filter chips: Platform (Symbian/Java), Type (App/Game), Source (Mine/Community), Category; text search. With JS off, show the full list grouped by type |
| `/apps/mine/`, `/apps/games/`, `/apps/community/` | Static pre-filtered lists (these work without JS, and the nav links here) |
| `/apps/<slug>/` | Detail page (see the wireframe) |
| `/sdks/` and `/sdks/<slug>/` | Grouped by kind, then the detail page |
| `/guides/` and `/guides/<slug>/` | List ordered by `order`, then an article page with a TOC |
| `/devices/` and `/devices/<slug>/` | Device spec card plus the list of entries tested on it, with status |
| `/news/` and `/news/<slug>/`, `/rss.xml` | Via `@astrojs/rss` |
| `/about/` | What this is, credits, disclaimer, removal requests |
| `/submit/` | How to suggest an app; button that opens a GitHub issue (repo `manojanasuri16/RetroArchive`, template `suggest-app.yml`) |
| `/m/` | **Lite site for the N79's own browser** (see below) |
| `/404` | Retro "Memory full" style 404 |

### App detail wireframe
```
┌──────────────────────────────────────────────────────────────┐
│ ▣ RetroArchive   APPS  GAMES  SDKs  GUIDES  ABOUT   [◐]      │
├─────────────────────────────────┬────────────────────────────┤
│ [icon] RetroSend                │   ┌──────────┐             │
│ LocalSend for old Nokia phones  │   │ 240x320  │  phone frame│
│ [SYMBIAN][PYS60][MINE][NETWORK] │   │screenshot│  thumbnails │
│ v1.2.1 · 182 KB · 21 Nov 2026   │   └──────────┘█            │
│ [ DOWNLOAD RetroSend.sis ]█     │    ████████████            │
│ other files…  sha256 (copy)     │                            │
│ Requires: PyS60 1.4.5 →         │                            │
├─────────────────────────────────┴────────────────────────────┤
│ About (markdown) │ Compatibility table │ Install notes │     │
│ Known issues │ Changelog (from releases) │ Source/Credits     │
└──────────────────────────────────────────────────────────────┘
```

## Visual design (based on the owner's reference image, "Retro web design")

Tokens on `:root`:
- `--bg: #E5D3AE` (page beige), `--panel: #FDF6EE` (cream panels), `--ink: #111`,
  `--ink-soft: #4a4238`, `--blue: #78A2D6`, `--red: #D65A5A`, `--tan: #D9C29A` (card beige),
  `--shadow: #333`, `--rule: #8a7f70`
- Dark mode ("night") under `@media (prefers-color-scheme: dark)` guarded by
  `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`:
  bg `#1d1a16`, panel `#2a2621`, ink `#f3ead9`, shadow `#000`, the same blue and red slightly
  brighter. A toggle in the header stores the choice in localStorage (wrapped in try/catch).

Signature elements:
- **Hard offset shadows, no blur**: `box-shadow: 10px 10px 0 var(--shadow)` on panels and
  cards, 6px on buttons. Buttons press in on :active (translate 4px, shadow shrinks).
- The site frame is a cream "window" on the beige page, with a big offset shadow and a
  1px header rule. Header: logo (two stacked grey blocks, as in the reference) + "RetroArchive",
  centred uppercase condensed nav, and a red block button at the right (here: "Phone site /m"
  or Submit).
- Hero: "Retro **Archive**" where "Archive" sits in a blue highlight bar with a dark offset
  bar under it, like "Illustration" in the reference. Subtitle "Software for the N79 era".
  Section cards: tan card with a red heading and outline red button ("BROWSE APPS"), blue card
  with a white heading and outline white button ("GAMES"), and a charcoal card ("SDKs & TOOLS").
  Each card has a short thin rule at the top-left, as in the reference.
- The right side of the hero has a framed "poster": an inline SVG of a candybar slider phone
  (an original drawing, not Nokia branding or a logo), with a grain/halftone pattern, chevrons
  and "BACK TO S60" lettering in the condensed font, inside a grey frame with a black offset
  shadow (mirrors the boombox poster).
- Catalog cards: icon (or generated pixel placeholder: an initial on a coloured block),
  name, tagline, badges (platform, runtime, mine/community), version and size.
- Badges: small uppercase condensed text, 1px border, square corners. The platform colour is
  blue for Symbian and red for Java.
- Square corners everywhere (no border-radius), thin rules, generous whitespace.
- Screenshots sit inside a CSS phone frame (dark bezel, 240x320 screen).
- Respect `prefers-reduced-motion`. Mobile responsive: at phone widths the hero stacks, the
  nav becomes a simple wrap row (no hamburger JS needed), 16px gutters, no horizontal scroll.
- Small easter egg: the footer has a fake "visitor counter" in an LCD style, showing the total
  release downloads summed from releases.json.

## Lite site `/m/` (for the Nokia N79 browser)

- Separate minimal layout: no web fonts, no JS, inline CSS under 2 KB, max width 240px
  friendly, simple tables and lists, tiny or no images (icons at 24px only).
- Pages: `/m/` (index: My Apps, Games, Apps, SDKs, Guides links), `/m/apps/` list,
  `/m/apps/<slug>/` (name, version, size, direct download links, short description as plain
  text, requires, install notes), `/m/sdks/`, `/m/guides/<slug>/` (same markdown, rendered
  plain).
- Every page stays under 30 KB of HTML. Use absolute download URLs.
- Note shown on the page: "Downloads come from GitHub over HTTPS. If your phone browser fails,
  download on a PC and send the file to the phone (e.g. with RetroSend)."
- Desktop pages link to `/m/` in the footer and header; `/m/` links back.

## Deploy (free services)

- `.github/workflows/deploy.yml`: on push to main plus a daily schedule (to refresh
  release data) plus workflow_dispatch: setup node 22, `npm ci`, `npm run sync` (with
  `GITHUB_TOKEN`), `npm run build`, deploy to GitHub Pages (actions/upload-pages-artifact +
  actions/deploy-pages). Pass SITE_URL/SITE_BASE from repo variables with defaults
  `https://manojanasuri16.github.io` and `/RetroArchive`.
- Also add `public/_headers` (for Cloudflare Pages / Netlify as an alternative host) with MIME
  types for .jad (`text/vnd.sun.j2me.app-descriptor`), .jar (`application/java-archive`),
  .sis/.sisx (`application/vnd.symbian.install`), for when files are mirrored on the same host
  later.
- `.github/ISSUE_TEMPLATE/suggest-app.yml` (issue form: name, platform, link, tested device,
  works?, notes).

## Repo layout
```
RetroArchive/
  astro.config.mjs  package.json  tsconfig.json  README.md  SPEC.md
  scripts/sync-releases.mjs  scripts/new-entry.mjs (CLI: npm run new -- app my-game → writes a YAML stub)
  src/content.config.ts
  src/content/{apps,sdks,guides,devices,news}/
  src/data/releases.json
  src/lib/{url.ts,catalog.ts,format.ts}   # merge YAML + releases, size/date formatting
  src/layouts/{Base.astro,Lite.astro}
  src/components/...
  src/pages/...
  src/styles/global.css
  public/media/<slug>/...   public/favicon.svg   public/_headers
  .github/workflows/deploy.yml  .github/ISSUE_TEMPLATE/suggest-app.yml
```

Third-party binaries go into GitHub Releases of a separate repo
`manojanasuri16/RetroArchive-files` (one tag per entry, e.g. `snake-ex-1.0`), never into git.
`files[].url` points there.

## Content rules

- Credit original authors. Third-party entries need a `license` and a link to the original
  source where one exists.
- Nokia SDK archives cannot be re-hosted: `rehostable: false`, link only.
- Do not invent test results. Only the owner's apps and things the owner has actually used
  get `tested` entries.
