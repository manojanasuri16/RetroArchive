// Fetch GitHub release data for every apps/sdks entry with `repo:`.
// Never fails the build: on any error the previous releases.json is kept.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const contentDir = path.resolve(root, process.env.CONTENT_DIR || 'src/content');
const outFile = path.join(root, 'src/data/releases.json');
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

function repos() {
  const set = new Set();
  for (const d of ['apps', 'sdks']) {
    const dir = path.join(contentDir, d);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!/\.ya?ml$/.test(f)) continue;
      const m = fs.readFileSync(path.join(dir, f), 'utf8').match(/^repo:\s*["']?([\w.-]+\/[\w.-]+)["']?\s*(#.*)?$/m);
      if (m) set.add(m[1]);
    }
  }
  return [...set];
}

async function fetchRepo(repo) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'RetroArchive-sync', 'X-GitHub-Api-Version': '2022-11-28' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=10`, { headers, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${repo}: HTTP ${res.status}`);
  const list = (await res.json()).filter((r) => !r.draft);
  if (!list.length) return null;
  const r = list[0];
  return {
    fetched: new Date().toISOString(),
    latest: {
      tag: r.tag_name, name: r.name || r.tag_name, published: r.published_at || r.created_at,
      body: r.body || '', url: r.html_url,
      assets: (r.assets || []).map((a) => ({
        name: a.name, url: a.browser_download_url, size: a.size, downloads: a.download_count,
        sha256: a.digest && a.digest.startsWith('sha256:') ? a.digest.slice(7) : null,
      })),
    },
    history: list.map((x) => ({ tag: x.tag_name, published: x.published_at || x.created_at, body: x.body || '', url: x.html_url })),
  };
}

async function main() {
  let prev = {};
  try { prev = JSON.parse(fs.readFileSync(outFile, 'utf8')); } catch {}
  const out = { ...prev };
  const list = repos();
  let ok = 0;
  for (const repo of list) {
    try {
      const data = await fetchRepo(repo);
      if (data) { out[repo] = data; ok++; console.log(`sync: ${repo} -> ${data.latest.tag}`); }
      else console.log(`sync: ${repo} has no releases`);
    } catch (e) { console.warn(`sync: ${e.message} (keeping previous data)`); }
  }
  if (ok || !fs.existsSync(outFile)) {
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');
  }
  console.log(`sync: ${ok}/${list.length} repos updated`);
}
main().catch((e) => console.warn('sync failed, continuing:', e.message)).finally(() => process.exit(0));
