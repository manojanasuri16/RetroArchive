// npm run new -- app my-game   |   sdk my-tool   |   guide my-guide   |   news my-post
import fs from 'node:fs';
import path from 'node:path';

const [type, slug] = process.argv.slice(2);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const today = new Date().toISOString().slice(0, 10);
const T = {
  app: ['apps', 'yaml', `name: ${slug}
tagline: One line about it
kind: app                 # app | game
source: community         # mine | community
platform: symbian         # symbian | java
runtime: native           # native | pys60 | midp
category: utility         # utility|network|messaging|media|system|productivity|game-action|game-puzzle|game-racing|game-sports|game-rpg|game-arcade|game-strategy
author: Original Author
authorUrl: https://example.com
license: Freeware         # or MIT, Abandonware, Unknown ...
homepage: https://example.com
version: "1.0"
added: ${today}
featured: false
# icon: ${slug}/icon.png          # in public/media/
# screenshots: [${slug}/1.png]
files:
  - name: ${slug}.sis
    url: https://github.com/manojanasuri16/RetroArchive-files/releases/download/${slug}-1.0/${slug}.sis
    kind: sis
    # size: 100000
    # sha256: ""
signing: self-signed      # signed | self-signed | unsigned | needs-hack
# tested:                 # only if you really tested it
#   - device: n79
#     firmware: "31.0.008"
#     status: works       # works | partial | broken
#     notes: ""
installNotes: []
knownIssues: []
description: |
  Describe the app here (markdown).
`],
  sdk: ['sdks', 'yaml', `name: ${slug}
tagline: One line about it
kind: tool                # sdk | toolchain | runtime | tool | hack
hostOs: [windows]
author: Original Author
license: Freeware
homepage: https://example.com
version: "1.0"
added: ${today}
featured: false
rehostable: false         # false = link only
links:
  - label: Download page
    url: https://example.com
description: |
  Describe the tool here (markdown).
`],
  guide: ['guides', 'md', `---
title: ${slug}
summary: One line summary
order: 50
tags: [n79]
updated: ${today}
---

Write the guide here.
`],
  news: ['news', 'md', `---
title: ${slug}
date: ${today}
summary: One line summary
---

Write the post here.
`],
};
if (!T[type] || !slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error('usage: npm run new -- <app|sdk|guide|news> <slug-with-dashes>');
  process.exit(1);
}
const [dir, ext, body] = T[type];
const file = path.join(root, 'src/content', dir, `${slug}.${ext}`);
if (fs.existsSync(file)) { console.error('exists: ' + file); process.exit(1); }
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, body);
console.log('created ' + path.relative(root, file));
