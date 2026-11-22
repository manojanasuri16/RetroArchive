const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Prefix an internal path with the site base. url('/apps/') -> '/RetroArchive/apps/' */
export function url(path = '/'): string {
  if (/^[a-z]+:/i.test(path) || path.startsWith('#')) return path;
  return base + (path.startsWith('/') ? path : '/' + path);
}
export function media(path?: string): string | undefined {
  return path ? url('/media/' + path.replace(/^\/+/, '')) : undefined;
}
export function absUrl(path: string, site: URL | undefined): string {
  return new URL(url(path), site ?? 'http://localhost').href;
}
