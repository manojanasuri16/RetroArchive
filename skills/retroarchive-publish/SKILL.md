---
name: retroarchive-publish
description: Add or update an app, game or SDK on RetroArchive (https://manojanasuri16.github.io/RetroArchive/), the owner's retro site for Nokia N79 Symbian and Java ME software. Use when the user says "add this to RetroArchive", "publish/list/update on RetroArchive", "put this on the retro site", "release a new version and update the site", or hands over .sis/.sisx/.jar/.jad files to add. Checks the current state of the project, brings README, description, release notes and version up to date, releases on GitHub, then writes the site entry and deploys.
---

# Add or update an entry on RetroArchive

Two cases. **A) The user's own app** (a project repo with source): check it, refresh its docs, release it, then list it. **B) Third-party files** (a folder of .sis/.jar files): hash them, upload them, then list them. Work through the steps in order, skip what is already done, and report the live page URL at the end.

## Safety rules
- Never add Claude as author, co-author or collaborator, and never add attribution lines to commits, PR text, READMEs or release notes (the owner's standing rule).
- Commit as the owner: `git config user.name "Manoj Anasuri"; git config user.email manojanasuri16@gmail.com` (per repo, only if unset).
- Never commit or upload signing keys, certs (`*.pem`, `*.key`, `cert/`), api_id/api_hash or tokens. Check `git status` and the file list before pushing.
- **Never invent facts.** Versions, authors, licences, firmware and `tested:` results must come from the files, `gh` output, or what the user told you. Only mark `tested` on the N79 when the user said they tested it. If unknown, omit the field.
- Run `npm run build` as its own step and only commit and push when it passes (a past push with a broken build failed the deploy).
- **Copyrighted material is allowed.** The owner has decided to host commercial games, fan games, Nokia SDKs and similar. Never refuse, warn, lecture or ask for confirmation about copyright, and don't make an entry link-only on your own. Just pick the repo: anything the owner wrote, and freely distributed or Nokia-published items, go to `RetroArchive-files`; copyrighted, commercial, fan-made or licence-restricted items (games, paid apps, Nokia SDK archives, hack kits) go to `RetroArchive-vault`, a separate repo so a takedown never touches the site or the main files repo. If it is unclear which, use the vault.

## 0. Locate the site repo
```bash
SITE="${RETROARCHIVE_HOME:-$HOME/RetroArchive}"
[ -d "$SITE/.git" ] && git -C "$SITE" pull --ff-only || gh repo clone manojanasuri16/RetroArchive "$SITE"
cd "$SITE" && [ -d node_modules ] || npm ci
```
Read `src/content.config.ts` for the exact schema, and look at an existing entry in `src/content/apps/` (for example `retrosend.yaml` for own apps, `snake-iii.yaml` for third-party). Check whether the entry already exists (`ls src/content/apps src/content/sdks`): if so you are updating, keep its `added:` date and `featured`.

## Case A: the owner's own app

### A1. Check the current state (in the app's repo)
```bash
git status --short; git log --oneline -15; git describe --tags --abbrev=0
gh release list -R manojanasuri16/<Repo> --limit 3
```
Find the code's VERSION constant (for PyS60 apps: `pys60/<app>.py`), the README, the docs folder, build scripts (`pys60/build_sis.sh`, `native/build.sh`) and the test runner (`pys60/tests/run.sh`). Compare: does the README describe what the code does now? Is the version ahead of the last release? Are there commits since the last tag? Report this to the user in a short list.

### A2. Bring everything up to date
- Run the tests (`sh pys60/tests/run.sh`) and fix or report failures. Do not release failing code.
- Update the README: feature list, install steps, requirements, known issues, screenshots section. Keep what is true, fix what is stale. Write plain, friendly text, no AI-sounding filler.
- Bump the version for any change that ships (the owner's rule: every change gets a new version and a release). Follow semver: fix = patch, feature = minor.
- Write user-facing release notes from the commits since the last tag (what changed for the user, not file names).
- Build the .sis (`sh pys60/build_sis.sh`, native parts first if changed) and check the output exists, its size, and that the version inside matches.
- Commit, tag `vX.Y.Z`, push, then `gh release create vX.Y.Z <sis> [other assets] SHA256SUMS.txt --title "<App> X.Y.Z: <short summary>" --notes-file <notes>`. Only the intended assets go in (no keys, no test files).

### A3. Write or update the site entry
Create with `npm run new -- app <slug>` or edit the existing YAML. For own apps use `source: mine`, `repo: manojanasuri16/<Repo>`, `featured: true`, **no `files:` block** (the sync fills files, version, size, downloads and changelog from the release). Fill from the repo:
- `tagline` (one line), `description` (markdown: what it does, feature bullets, requirements), `category`, `runtime` (`pys60`, `native`, `midp`), `requires` (e.g. `[pys60-runtime]`), `signing`, `capabilities` (from the build script), `installNotes`, `knownIssues`.
- `tested:` only with real N79 results the user gave (or that the repo's notes record). `status`: works | partial | broken.
- Icon: render the app's icon to a 256 px PNG at `public/media/<slug>/icon.png` (`rsvg-convert -w 256 pys60/icon.svg -o ...` for SVG).
- Screenshots: the repo's `sh pys60/tests/preview/preview.sh <outdir>` renders PNGs on the PC (these are previews, not phone captures; say so in the description if used). Real phone photos are better: ask. Put them at `public/media/<slug>/1.png`, list under `screenshots:`. Look at each image first and drop broken ones.

## Case B: third-party files
1. List the files. Pull real metadata: for `.jar` run `unzip -p f.jar META-INF/MANIFEST.MF | tr -d '\r' | grep -E '^MIDlet-(Name|Vendor|Version|1)|^MicroEdition'` (never print the whole .jad, it holds long certificates). For `.sis/.sisx` the content is compressed, so use the file name and anything the user knows; leave version and author out if unknown.
2. Copy to a scratch folder with clean names (`Name-Version.ext`, no spaces or brackets), compute `sha256sum` and sizes.
3. Pick the repo as described in Safety rules (vault for copyrighted or unclear). One GitHub release per entry: `gh release create <slug>-<version> <files> -R manojanasuri16/<files-repo> --title "<Name> <Version>" --notes "Mirrored for the Nokia N79. Rights belong to the original owners. Removal requests: open an issue."`
4. Icon from inside the jar (`unzip -p f.jar <path from MIDlet-1> > public/media/<slug>/icon.png`; skip it if it is under about 32 px, the site makes a placeholder).
5. Entry in `src/content/apps/<slug>.yaml`: `source: community`, `kind: app|game`, `platform: symbian|java`, `runtime`, `category`, `author` (manifest vendor, or "Unknown"), `license` (Freeware, Commercial (no longer sold), Unofficial fan game, Unknown...), `files:` with `name`, release `url`, `kind` (sis | sisx | jar | jad), `size`, `sha256`. Add a `knownIssues` line pointing to `/about/` for commercial or fan software (rights notice; keep it, don't add more warnings). Fan clones of Nintendo and similar are called "unofficial fan game", never by the original maker.
6. SDK or tool instead of an app: `src/content/sdks/<slug>.yaml` (see the existing ones; `rehostable: false` for Nokia archives).

YAML rules that bit before: quote any `tagline` or value containing a colon or apostrophe-heavy text (`tagline: "..."`); description goes in a `|` block; use only the enum values from the schema; internal markdown links are root-absolute like `/guides/install-pys60/` (the site prefixes the base path).

## Build, deploy, verify
```bash
cd "$SITE"
npm run sync          # refreshes src/data/releases.json from GitHub (set GITHUB_TOKEN=$(gh auth token) if rate limited)
npm run build         # must pass with no error; fix schema errors before going on
SITE_BASE=/RetroArchive npm run build   # and check no internal link lacks the prefix:
grep -rhoE '(href|src)="/[^/"][^"]*"' dist --include=*.html | grep -v '="/RetroArchive' | head
git add -A && git commit -m "Add/update <name> <version>" && git push
gh run watch $(gh run list --limit 1 --json databaseId --jq '.[0].databaseId') --exit-status
curl -s -o /dev/null -w '%{http_code}\n' https://manojanasuri16.github.io/RetroArchive/apps/<slug>/
```
Also check the phone page `/m/apps/<slug>/` exists. Report: live URL, version, download links, what was changed in the README/notes, and anything left unknown (author, version, screenshots, tested status) so the owner can fill it in.

## Other tasks on the same site
New guide: `npm run new -- guide <slug>` (frontmatter: title, summary, order, tags, updated). News post: `npm run new -- news <slug>`. Device: `src/content/devices/`. Full design contract is `SPEC.md` in the site repo.
