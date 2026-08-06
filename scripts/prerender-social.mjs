// Generates a static /art-timeline/index.html after the Vite build so social
// crawlers (LinkedIn, Facebook, Twitter/Slack) see art-focused share text
// instead of the generic homepage copy. These bots fetch raw HTML and don't
// run the client-side meta tag swap in src/pages/ArtTimeline.tsx, so the
// static shell at index.html always won on shared /art-timeline links.
// Vercel/Netlify both serve a matching static file before falling back to
// the SPA rewrite, so this file loads for real visitors too and React Router
// takes over normally once the bundle mounts.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')

const title = 'The Art Timeline — 40,000 Years of Art History | Vattitude'
const description =
  'Explore 40,000 years of art history in an interactive scroll-driven experience. From Prehistoric cave paintings to Contemporary digital art — 8 eras, key movements, and iconic masterpieces.'
const url = 'https://vattitude.ca/art-timeline'
const image = 'https://vattitude.ca/art-timeline-preview.jpg'

let html = readFileSync(join(distDir, 'index.html'), 'utf8')

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

for (const [pattern, replacement] of replacements) {
  if (!pattern.test(html)) {
    throw new Error(`prerender-social: pattern not found in dist/index.html: ${pattern}`)
  }
  html = html.replace(pattern, replacement)
}

const outDir = join(distDir, 'art-timeline')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'index.html'), html)

console.log('prerender-social: wrote dist/art-timeline/index.html')
