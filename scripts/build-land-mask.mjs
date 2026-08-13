/**
 * Bakes the world's coastlines into the packed dot mask that the travel
 * timeline's globe draws.
 *
 * The globe is a halftone: dots laid on the sphere in constant-spacing rings,
 * with the ones that fall on land inked and the rest left as paper. That means
 * the only thing the page actually needs at runtime is one bit per dot — which
 * is why the coastline data does not ship. This script turns Natural Earth's
 * 1:50m land polygons into that bitstream once, and the result is committed as
 * src/data/landMask.ts (~1.4 KB of base64 for ~10,300 dots). No geometry
 * library, no TopoJSON and no fetch survive into the bundle.
 *
 * Re-run only when the dot spacing changes:
 *
 *   npm i --no-save world-atlas topojson-client
 *   node scripts/build-land-mask.mjs
 *
 * The ring geometry is generated identically here and in src/data/landMask.ts —
 * `SPACING_DEG` is the single number both sides agree on, and it is written
 * into the generated file so the two can never silently drift apart.
 */

import { createRequire } from 'node:module'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const require = createRequire(import.meta.url)
const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(HERE, '../src/data/landMask.ts')

/** Angular spacing between dots, in degrees, along both lat and lon. */
const SPACING_DEG = 1.5

/* ------------------------------------------------------------------ *
 * Ring geometry — mirrored verbatim by the generated module.
 * ------------------------------------------------------------------ */

/**
 * Rings of dots at constant angular spacing: each ring is a circle of latitude,
 * and its dot count shrinks with the cosine so the spacing along the ring
 * matches the spacing between rings. Both are offset by half a step, which
 * keeps a dot off each pole and off the antimeridian seam.
 */
function rings(spacing = SPACING_DEG) {
  const out = []
  const count = Math.round(180 / spacing)
  for (let i = 0; i < count; i++) {
    const lat = -90 + (i + 0.5) * spacing
    const n = Math.max(1, Math.round((360 * Math.cos((lat * Math.PI) / 180)) / spacing))
    out.push({ lat, n })
  }
  return out
}

/* ------------------------------------------------------------------ *
 * Land polygons
 * ------------------------------------------------------------------ */

function loadLandRings() {
  const topology = require('world-atlas/land-50m.json')
  const { feature } = require('topojson-client')
  const land = feature(topology, topology.objects.land)

  // Every linear ring in the land layer, outer and hole alike. Even-odd
  // ray casting does not care which is which — a point inside a hole crosses
  // both the hole and its island an even number of times in total, and falls
  // out as ocean on its own.
  const polys = []
  const pushPolygon = (poly) => {
    for (const ring of poly) {
      let minLon = Infinity
      let maxLon = -Infinity
      let minLat = Infinity
      let maxLat = -Infinity
      for (const [lon, lat] of ring) {
        if (lon < minLon) minLon = lon
        if (lon > maxLon) maxLon = lon
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
      }
      polys.push({ ring, minLon, maxLon, minLat, maxLat })
    }
  }

  for (const f of land.features) {
    const g = f.geometry
    if (g.type === 'Polygon') pushPolygon(g.coordinates)
    else if (g.type === 'MultiPolygon') for (const p of g.coordinates) pushPolygon(p)
  }
  return polys
}

/**
 * Even-odd ray cast, eastward along the point's parallel. Natural Earth's land
 * is clipped at the antimeridian, so no ring wraps and plain lon/lat space is
 * a sound plane to test in.
 */
function isLand(polys, lon, lat) {
  let inside = false
  for (const p of polys) {
    if (lat < p.minLat || lat > p.maxLat || lon < p.minLon || lon > p.maxLon) continue
    const ring = p.ring
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i]
      const [xj, yj] = ring[j]
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
    }
  }
  return inside
}

/* ------------------------------------------------------------------ *
 * Bake
 * ------------------------------------------------------------------ */

const polys = loadLandRings()
const spec = rings()
const total = spec.reduce((sum, r) => sum + r.n, 0)

const bytes = new Uint8Array(Math.ceil(total / 8))
let index = 0
let landCount = 0

for (const { lat, n } of spec) {
  const step = 360 / n
  for (let j = 0; j < n; j++) {
    const lon = -180 + (j + 0.5) * step
    if (isLand(polys, lon, lat)) {
      bytes[index >> 3] |= 1 << (index & 7)
      landCount++
    }
    index++
  }
}

const b64 = Buffer.from(bytes).toString('base64')
const pct = ((landCount / total) * 100).toFixed(1)

const file = `/**
 * The world, packed as one bit per dot.
 *
 * GENERATED FILE — do not edit by hand. Re-bake with
 * \`node scripts/build-land-mask.mjs\` (see that script for why this is a
 * bitstream and not a GeoJSON).
 *
 * Source: Natural Earth 1:50m land, via the world-atlas package. Natural Earth
 * is public domain.
 *
 * ${total.toLocaleString('en-US')} dots at ${SPACING_DEG}° spacing, ${landCount.toLocaleString('en-US')} of them land (${pct}%).
 */

/** Angular spacing between dots, in degrees. Must match the baking script. */
export const SPACING_DEG = ${SPACING_DEG}

/** One bit per dot, in ring order, LSB first. */
const MASK_B64 =
  '${b64}'

export interface LandDot {
  /** Unit vector on the sphere: +x at 90°E, +y at the north pole, +z at 0°/0°. */
  x: number
  y: number
  z: number
}

let cache: LandDot[] | null = null

/**
 * The inked dots as unit vectors, decoded once and memoised.
 *
 * The ring walk here is the same one the baking script used, so dot *n* of this
 * traversal is bit *n* of the mask — nothing about the coastlines is stored,
 * only which of these positions the coastlines covered.
 */
export function landDots(): LandDot[] {
  if (cache) return cache

  const bin = atob(MASK_B64)
  const rad = Math.PI / 180
  const dots: LandDot[] = []
  const ringCount = Math.round(180 / SPACING_DEG)
  let index = 0

  for (let i = 0; i < ringCount; i++) {
    const lat = -90 + (i + 0.5) * SPACING_DEG
    const phi = lat * rad
    const cos = Math.cos(phi)
    const n = Math.max(1, Math.round((360 * cos) / SPACING_DEG))
    const step = 360 / n
    const y = Math.sin(phi)

    for (let j = 0; j < n; j++, index++) {
      if (!(bin.charCodeAt(index >> 3) & (1 << (index & 7)))) continue
      const lambda = (-180 + (j + 0.5) * step) * rad
      dots.push({ x: cos * Math.sin(lambda), y, z: cos * Math.cos(lambda) })
    }
  }

  cache = dots
  return cache
}
`

writeFileSync(OUT, file)
console.log(`${OUT}: ${total} dots, ${landCount} land (${pct}%), ${b64.length} b64 chars`)
