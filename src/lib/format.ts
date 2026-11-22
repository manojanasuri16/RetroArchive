import { marked } from 'marked';

export function fmtSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export function fmtDate(d?: Date | string): string {
  if (!d) return '';
  const x = new Date(d);
  if (isNaN(+x)) return '';
  return `${x.getUTCDate()} ${M[x.getUTCMonth()]} ${x.getUTCFullYear()}`;
}
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
/** Prefix root-absolute internal links/images with the site base. */
export function rebase(html: string): string {
  if (!BASE) return html;
  return html.replace(/(\s(?:href|src)=")\/(?!\/)/g, `$1${BASE}/`);
}
export function md(src = ''): string {
  return rebase(marked.parse(src, { async: false, gfm: true }) as string);
}
export function mdInline(src = ''): string {
  return rebase(marked.parseInline(src, { async: false }) as string);
}
/** Simple HTML for the lite site: no images, internal links point at /m/ pages. */
function liteLinks(html: string): string {
  return html
    .replace(/<img[^>]*>/g, '')
    .replace(/(\shref=")\/(apps|sdks|guides)\//g, '$1/m/$2/');
}
export function liteMd(src = ''): string {
  return rebase(liteLinks(marked.parse(src, { async: false, gfm: true }) as string));
}
export function liteInline(src = ''): string {
  return rebase(liteLinks(marked.parseInline(src, { async: false }) as string));
}
/** Plain text from markdown. */
export function plain(src = ''): string {
  return src
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*/g, ''))
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/[*_`#>]/g, '')
    .trim();
}
export const CATEGORY_LABELS: Record<string, string> = {
  utility: 'Utility', network: 'Network', messaging: 'Messaging', media: 'Media', system: 'System',
  productivity: 'Productivity', 'game-action': 'Action', 'game-puzzle': 'Puzzle', 'game-racing': 'Racing',
  'game-sports': 'Sports', 'game-rpg': 'RPG', 'game-arcade': 'Arcade', 'game-strategy': 'Strategy',
};
export const RUNTIME_LABELS: Record<string, string> = { native: 'Native', pys60: 'PyS60', midp: 'MIDP' };

export function slugify(s: string): string {
  return s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
/** Render markdown, add ids to h2/h3 and return a table of contents. */
export function mdToc(src = ''): { html: string; toc: { depth: number; id: string; text: string }[] } {
  const toc: { depth: number; id: string; text: string }[] = [];
  const seen = new Set<string>();
  const html = md(src).replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, d, inner) => {
    let id = slugify(inner) || 'section'; let n = id, i = 2;
    while (seen.has(n)) n = `${id}-${i++}`;
    seen.add(n);
    toc.push({ depth: Number(d), id: n, text: inner.replace(/<[^>]+>/g, '') });
    return `<h${d} id="${n}">${inner}</h${d}>`;
  });
  return { html, toc };
}
