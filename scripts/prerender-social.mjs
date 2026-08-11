// Generates a static index.html per social-shared route after the Vite build,
// so crawlers (LinkedIn, WhatsApp, Facebook, Slack, Twitter) see route-specific
// share text instead of the generic homepage copy. These bots fetch raw HTML
// and don't run the client-side meta swap in src/hooks/useSocialMeta.ts, so the
// static shell at index.html always won on shared links.
//
// Vercel/Netlify both serve a matching static file before falling back to the
// SPA rewrite, so these files load for real visitors too and React Router takes
// over normally once the bundle mounts.
//
// Keep each entry's copy in sync with the useSocialMeta() call on that page.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')

const ROUTES = [
  {
    dir: 'art-timeline',
    title: 'The Art Timeline — 40,000 Years of Art History | Vattitude',
    description:
      'Explore 40,000 years of art history in an interactive scroll-driven experience. From Prehistoric cave paintings to Contemporary digital art — 8 eras, key movements, and iconic masterpieces.',
    url: 'https://vattitude.ca/art-timeline',
    image: 'https://vattitude.ca/art-timeline-preview.jpg',
  },
  {
    dir: 'travel-timeline',
    title: 'Travel Timeline — A Travelogue in 30 Entries, Run Backwards | Vattitude',
    description:
      'Thirty entries across 17 countries and 74 places, newest first — from Washington in 2026 back through Tokyo, Cairo, Rome, Rio, Paris and Dubai to a childhood in India. Dates, places and landmarks, set as newsprint.',
    url: 'https://vattitude.ca/travel-timeline',
    image: 'https://vattitude.ca/travel-timeline-preview.jpg',
  },
]

const shell = readFileSync(join(distDir, 'index.html'), 'utf8')

for (const route of ROUTES) {
  const { dir, title, description, url, image } = route

  const replacements = [
    [/<title>.*?<\/title>/, `<title>${title}</title>`],
    [/<meta name="title" content=".*?" \/>/, `<meta name="title" content="${title}" />`],
    [/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`],
    [/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${url}" />`],
    [/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`],
    [/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`],
    [/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${image}" />`],
    [/<meta name="twitter:url" content=".*?" \/>/, `<meta name="twitter:url" content="${url}" />`],
    [/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${title}" />`],
    [/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${description}" />`],
    [/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${image}" />`],
    [/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`],
  ]

  let html = shell
  for (const [pattern, replacement] of replacements) {
    if (!pattern.test(html)) {
      throw new Error(`prerender-social: pattern not found in dist/index.html: ${pattern}`)
    }
    html = html.replace(pattern, replacement)
  }

  const outDir = join(distDir, dir)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  console.log(`prerender-social: wrote dist/${dir}/index.html`)
}
