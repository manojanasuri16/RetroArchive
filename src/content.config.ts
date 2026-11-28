import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const dir = (process.env.CONTENT_DIR || 'src/content').replace(/\/$/, '');

const file = z.object({
  name: z.string(),
  url: z.string(),
  kind: z.enum(['sis', 'sisx', 'jar', 'jad', 'zip', 'other']).default('other'),
  size: z.number().optional(),
  sha256: z.string().optional(),
  note: z.string().optional(),
});

const apps = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: `${dir}/apps` }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    kind: z.enum(['app', 'game']).default('app'),
    source: z.enum(['mine', 'community']).default('community'),
    platform: z.enum(['symbian', 'java']).default('symbian'),
    runtime: z.enum(['native', 'pys60', 'midp']).optional(),
    category: z.enum(['utility', 'network', 'messaging', 'media', 'system', 'productivity',
      'game-action', 'game-puzzle', 'game-racing', 'game-sports', 'game-rpg', 'game-arcade', 'game-strategy']).default('utility'),
    author: z.string(),
    authorUrl: z.string().optional(),
    license: z.string().optional(),
    repo: z.string().optional(),
    homepage: z.string().optional(),
    version: z.coerce.string().optional(),
    released: z.coerce.date().optional(),
    added: z.coerce.date(),
    featured: z.boolean().default(false),
    icon: z.string().optional(),
    screenshots: z.array(z.string()).default([]),
    files: z.array(file).default([]),
    requires: z.array(z.string()).default([]),
    signing: z.enum(['signed', 'self-signed', 'unsigned', 'needs-hack']).optional(),
    capabilities: z.array(z.string()).default([]),
    tested: z.array(z.object({
      device: z.string(),
      firmware: z.coerce.string().optional(),
      status: z.enum(['works', 'partial', 'broken']),
      notes: z.string().optional(),
    })).default([]),
    installNotes: z.array(z.string()).default([]),
    knownIssues: z.array(z.string()).default([]),
    description: z.string().default(''),
  }),
});

const sdks = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: `${dir}/sdks` }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    kind: z.enum(['sdk', 'toolchain', 'runtime', 'tool', 'hack']).default('tool'),
    hostOs: z.array(z.enum(['linux', 'windows', 'macos', 'phone'])).default([]),
    author: z.string(),
    license: z.string().optional(),
    repo: z.string().optional(),
    homepage: z.string().optional(),
    version: z.coerce.string().optional(),
    released: z.coerce.date().optional(),
    added: z.coerce.date(),
    featured: z.boolean().default(false),
    icon: z.string().optional(),
    files: z.array(file).default([]),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    guide: z.string().optional(),
    rehostable: z.boolean().default(true),
    description: z.string().default(''),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: `${dir}/guides` }),
  schema: z.object({
    title: z.string(),
    summary: z.string().default(''),
    order: z.number().default(100),
    tags: z.array(z.string()).default([]),
    updated: z.coerce.date().optional(),
  }),
});

const devices = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: `${dir}/devices` }),
  schema: z.object({
    name: z.string(),
    platform: z.string(),
    os: z.string(),
    screen: z.string(),
    java: z.string().optional(),
    released: z.coerce.string().optional(),
    image: z.string().optional(),
    imageCaption: z.string().optional(),
    spin: z.string().optional(),
    spinCredit: z.string().optional(),
    headline: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    features: z.array(z.string()).optional(),
    specs: z.array(z.object({ group: z.string(), rows: z.array(z.object({ label: z.string(), value: z.string() })) })).optional(),
    specsSource: z.object({ label: z.string(), url: z.string() }).optional(),
    notes: z.string().default(''),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: `${dir}/news` }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().default(''),
  }),
});

export const collections = { apps, sdks, guides, devices, news };
