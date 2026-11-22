import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const base = process.env.SITE_BASE || '/';
export default defineConfig({
  site: process.env.SITE_URL || 'https://manojanasuri16.github.io',
  base,
  output: 'static',
  image: { service: { entrypoint: 'astro/assets/services/noop' } },
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
