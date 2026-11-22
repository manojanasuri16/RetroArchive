import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getNews } from '../lib/catalog';
import { url } from '../lib/url';

export async function GET(context: APIContext) {
  const news = await getNews();
  return rss({
    title: 'RetroArchive',
    description: 'News from RetroArchive: software for the N79 era.',
    site: context.site!,
    items: news.map((n) => ({ title: n.data.title, pubDate: n.data.date, description: n.data.summary, link: url(`/news/${n.id}/`) })),
  });
}
