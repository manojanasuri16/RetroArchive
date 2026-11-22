import { getCollection, type CollectionEntry } from 'astro:content';
import releases from '../data/releases.json';

type Rel = {
  fetched?: string;
  latest?: { tag: string; name?: string; published?: string; body?: string; url?: string;
    assets: { name: string; url: string; size?: number; downloads?: number; sha256?: string | null }[] };
  history?: { tag: string; published?: string; body?: string; url?: string }[];
};
const R = releases as Record<string, Rel>;

export type FileItem = { name: string; url: string; kind: string; size?: number; sha256?: string; note?: string; downloads?: number };
export type Item = {
  type: 'app' | 'sdk';
  slug: string;
  data: any;
  href: string;
  version?: string;
  date?: Date;
  files: FileItem[];
  size?: number;
  changelog: { tag: string; published?: string; body: string; url?: string }[];
  downloads: number;
  releaseUrl?: string;
};

export function classify(name: string): string {
  const e = name.toLowerCase().split('.').pop() || '';
  return ['sis', 'sisx', 'jar', 'jad', 'zip'].includes(e) ? e : 'other';
}

function merge(type: 'app' | 'sdk', e: CollectionEntry<'apps'> | CollectionEntry<'sdks'>): Item {
  const d: any = e.data;
  const rel = d.repo ? R[d.repo] : undefined;
  const latest = rel?.latest;
  let files: FileItem[] = [];
  if (d.files?.length) files = d.files.map((f: any) => ({ ...f }));
  else if (latest) {
    let a = latest.assets.filter((x) => !/^SHA256SUMS/i.test(x.name) && !/\.(txt|rsc)$/i.test(x.name));
    if (!a.length) a = latest.assets;
    files = a.map((x) => ({ name: x.name, url: x.url, kind: classify(x.name), size: x.size,
      sha256: x.sha256 ?? undefined, downloads: x.downloads }));
  }
  const order: Record<string, number> = { sisx: 0, sis: 1, jar: 2, jad: 3, zip: 4, other: 5 };
  if (!d.files?.length) {
    const key = String(d.name).toLowerCase().replace(/[^a-z0-9]/g, '');
    const norm = (n: string) => n.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/g, '');
    const score = (f: FileItem) => (norm(f.name) === key ? 0 : norm(f.name).includes(key) ? 5 : 20) + (order[f.kind] ?? 9);
    files.sort((a, b) => score(a) - score(b));
  }
  const downloads = latest ? latest.assets.reduce((s, a) => s + (a.downloads || 0), 0) : 0;
  const changelog = (rel?.history || []).filter((h) => h.body && h.body.trim())
    .map((h) => ({ tag: h.tag, published: h.published, body: h.body!, url: h.url }));
  return {
    type, slug: e.id, data: d,
    href: `/${type === 'app' ? 'apps' : 'sdks'}/${e.id}/`,
    version: latest?.tag?.replace(/^v/i, '') || d.version,
    date: latest?.published ? new Date(latest.published) : d.released,
    files, size: files[0]?.size, changelog, downloads,
    releaseUrl: latest?.url,
  };
}

export async function getApps(): Promise<Item[]> {
  const all = await getCollection('apps');
  return all.map((e) => merge('app', e)).sort((a, b) => a.data.name.localeCompare(b.data.name));
}
export async function getSdks(): Promise<Item[]> {
  const all = await getCollection('sdks');
  return all.map((e) => merge('sdk', e)).sort((a, b) => a.data.name.localeCompare(b.data.name));
}
export const byAdded = (a: Item, b: Item) => +b.data.added - +a.data.added;

export function totalDownloads(): number {
  let n = 0;
  for (const r of Object.values(R)) for (const a of r.latest?.assets || []) n += a.downloads || 0;
  return n;
}
export async function getGuides() {
  return (await getCollection('guides')).sort((a, b) => a.data.order - b.data.order);
}
export async function getNews() {
  return (await getCollection('news')).sort((a, b) => +b.data.date - +a.data.date);
}
export async function getDevices() { return getCollection('devices'); }

export async function slugTitle(slug: string): Promise<{ name: string; href: string } | null> {
  const apps = await getCollection('apps'); const a = apps.find((x) => x.id === slug);
  if (a) return { name: a.data.name, href: `/apps/${slug}/` };
  const sdks = await getCollection('sdks'); const s = sdks.find((x) => x.id === slug);
  if (s) return { name: s.data.name, href: `/sdks/${slug}/` };
  return null;
}
