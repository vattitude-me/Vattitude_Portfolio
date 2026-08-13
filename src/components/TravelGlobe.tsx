import { useEffect, useMemo, useRef } from 'react'
import { landDots } from '../data/landMask'
import { formatCoord, type Journey } from '../data/journeys'

/**
 * The world, revolving, parked in the corner of the travel record.
 *
 * The globe holds whichever entry the reader is currently in front of: as the
 * page scrolls it turns that entry's city round to face the viewer, draws the
 * leg just travelled as a great circle, and then keeps turning slowly so the
 * sphere is never a still image. Every place in the record is pinned on it at
 * once, so the corner of the page always answers "where is this, and where is
 * it relative to everything else".
 *
 * It is drawn on a 2D canvas rather than in WebGL because the whole thing is
 * points and hairlines — an orthographic projection of ~5,000 unit vectors,
 * which comes to a fixed handful of path fills per frame. The land arrives from
 * ../data/landMask as one bit per dot; nothing here knows what a coastline is.
 *
 * The Broadsheet palette carries over intact: land is the page's ink laid down
 * as a halftone on paper, routes are the cyan spot colour, and the entry being
 * read is the magenta one.
 */

/** Idle revolution, radians per second — about 1.2°/s. */
const SPIN = 0.021
/** How long the globe takes to bring a new entry round to the front. */
const TWEEN_MS = 1150
/** Beat of the active marker's pulse. */
const PULSE_MS = 2600
/** Samples per great-circle leg. Enough that an arc reads as a curve at 260px. */
const LEG_STEPS = 36
const RAD = Math.PI / 180
const EARTH_KM = 6371

interface Vec {
  x: number
  y: number
  z: number
}

/** +x at 90°E, +y at the north pole, +z at 0°/0° — the mask's convention. */
function vec(lat: number, lon: number): Vec {
  const phi = lat * RAD
  const lambda = lon * RAD
  const cos = Math.cos(phi)
  return { x: cos * Math.sin(lambda), y: Math.sin(phi), z: cos * Math.cos(lambda) }
}

/** Great-circle interpolation, so a leg bends the way the world does. */
function slerp(a: Vec, b: Vec, t: number): Vec {
  const dot = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z))
  const omega = Math.acos(dot)
  if (omega < 1e-6) return a
  const s = Math.sin(omega)
  const ka = Math.sin((1 - t) * omega) / s
  const kb = Math.sin(t * omega) / s
  return { x: a.x * ka + b.x * kb, y: a.y * ka + b.y * kb, z: a.z * ka + b.z * kb }
}

function arc(a: Vec, b: Vec): Vec[] {
  const path: Vec[] = []
  for (let s = 0; s <= LEG_STEPS; s++) path.push(slerp(a, b, s / LEG_STEPS))
  return path
}

function greatCircleKm(a: [number, number], b: [number, number]): number {
  const dLat = (b[0] - a[0]) * RAD
  const dLon = (b[1] - a[1]) * RAD
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * RAD) * Math.cos(b[0] * RAD) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(s)))
}

/** The multiple of 2π that puts `angle` closest to `near` — the short way round. */
function nearestTurn(angle: number, near: number): number {
  return angle + Math.round((near - angle) / (2 * Math.PI)) * 2 * Math.PI
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function rgb(value: string, fallback: string): [number, number, number] {
  const hex = /^#?([0-9a-f]{6})$/i.exec(value.trim())?.[1] ?? fallback
  const n = parseInt(hex, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export interface TravelGlobeProps {
  /** Every entry, in page order (newest first). */
  entries: Journey[]
  /** Index of the entry holding the middle of the viewport, or -1 for none. */
  activeIndex: number
  /** False over the masthead and the colophon, where the globe has no subject. */
  shown: boolean
}

export default function TravelGlobe({ entries, activeIndex, shown }: TravelGlobeProps) {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  /** Lets the effects below re-decide whether the animation loop should run. */
  const loop = useRef<{ sync: () => void } | null>(null)

  /** Where every entry sits, and the legs between them, as unit vectors. */
  const geometry = useMemo(() => {
    const marks = entries.map((j) => vec(j.coords[0], j.coords[1]))
    const legs: Vec[][] = []
    for (let i = 0; i < marks.length - 1; i++) legs.push(arc(marks[i], marks[i + 1]))
    return { marks, legs }
  }, [entries])

  /**
   * The scroll-driven target, mirrored into a ref so the animation loop can
   * read it without being torn down and rebuilt on every entry change. Writing
   * it during render is deliberate and idempotent: a second render with the
   * same `activeIndex` is a no-op, so a double-invoked render cannot lose the
   * entry the reader came from.
   */
  const target = useRef({ index: -1, from: -1 })
  if (activeIndex >= 0 && target.current.index !== activeIndex) {
    target.current = { index: activeIndex, from: target.current.index }
  }

  useEffect(() => {
    const box = host.current
    const cv = canvas.current
    if (!box || !cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const still = matchMedia('(prefers-reduced-motion: reduce)')
    const dots = landDots()
    const { marks, legs } = geometry

    // Palette straight off the sheet, read once, so editing the page's custom
    // properties moves the globe along with everything else.
    const css = getComputedStyle(box)
    const INK = rgb(css.getPropertyValue('--text'), '201e1d')
    const SPOT = rgb(css.getPropertyValue('--c'), '0088b0')
    const HOT = rgb(css.getPropertyValue('--m'), 'd6006c')
    const RULE = rgb(css.getPropertyValue('--n400'), 'bab6b6')
    const PAPER = css.getPropertyValue('--bg').trim() || '#f3f2f2'
    const ink = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

    let dpr = 1
    let size = 0

    const resize = () => {
      dpr = Math.min(2, devicePixelRatio || 1)
      const width = box.getBoundingClientRect().width
      const next = Math.max(1, Math.round(width * dpr))
      if (next !== size) {
        size = next
        cv.width = size
        cv.height = size
      }
    }

    /* -------------------------------------------------------------- *
     * Orientation. `yaw` is the longitude facing the viewer and
     * `pitch` the latitude facing it, so aiming the globe at an entry
     * is simply its own coordinates — see project() below.
     * -------------------------------------------------------------- */
    let yaw = 0
    let pitch = 0
    let fromYaw = 0
    let fromPitch = 0
    let toYaw = 0
    let toPitch = 0
    let t0 = 0
    let snapped = true
    let aimed = -1

    const aim = (index: number, now: number) => {
      const [lat, lon] = entries[index].coords
      // The first entry of the session is simply already there; there is no
      // journey to it, and a spin on arrival would play to nobody.
      const snap = aimed < 0 || still.matches
      fromYaw = yaw
      fromPitch = pitch
      toYaw = nearestTurn(lon * RAD, yaw)
      toPitch = lat * RAD
      t0 = now
      snapped = snap
      if (snap) {
        yaw = toYaw
        pitch = toPitch
      }
      aimed = index
    }

    /* -------------------------------------------------------------- *
     * Draw. One orthographic projection, reused by everything.
     * -------------------------------------------------------------- */

    // Scratch values filled by project(), so nothing allocates per point.
    let px = 0
    let py = 0
    let pz = 0

    /* Per-frame scratch, hoisted out of draw(). These are refilled sixty times
       a second for as long as the reader is in the record: rebuilt each frame
       they would hand the collector a few thousand numbers a frame for nothing.
       Emptied by length, which keeps the capacity JS already grew for them. */
    const BUCKETS = 5
    const front: number[][] = Array.from({ length: BUCKETS }, () => [])
    const back: number[] = []
    // The leg currently being drawn, kept until the reader travels another.
    let legPath: Vec[] = []
    let legKey = ''

    function draw(now: number, legProgress: number) {
      const c = ctx!
      c.clearRect(0, 0, size, size)
      const mid = size / 2
      const R = mid - 1.5 * dpr
      if (R <= 0) return

      const cyaw = Math.cos(yaw)
      const syaw = Math.sin(yaw)
      const cpit = Math.cos(pitch)
      const spit = Math.sin(pitch)

      const project = (v: Vec) => {
        const x1 = v.x * cyaw - v.z * syaw
        const z1 = v.x * syaw + v.z * cyaw
        pz = v.y * spit + z1 * cpit
        px = mid + x1 * R
        py = mid - (v.y * cpit - z1 * spit) * R
      }

      // The limb: the one hairline the globe draws, and the edge everything
      // else is clipped against.
      c.strokeStyle = ink(RULE, 0.85)
      c.lineWidth = dpr
      c.beginPath()
      c.arc(mid, mid, R, 0, 2 * Math.PI)
      c.stroke()

      /* Land, as a halftone. Dots are bucketed by depth and each bucket drawn
         as a single path, so the world costs a fixed handful of fills however
         many dots it holds. The far hemisphere gets one faint bucket of its
         own, which is what makes the sphere read as glass rather than a disc. */
      const dotR = Math.max(0.42 * dpr, R * 0.0108)
      // A small sphere has no room for the full screen — the dots close up into
      // a blob — so it is stippled down instead. The thresholds are in CSS
      // pixels of radius, picked so the gap between dots at the centre of the
      // face stays near two pixels at every size the globe is used at.
      const cssR = R / dpr
      const stride = cssR < 54 ? 3 : cssR < 92 ? 2 : 1
      for (const b of front) b.length = 0
      back.length = 0

      for (let i = 0; i < dots.length; i += stride) {
        project(dots[i])
        if (pz > 0) front[Math.min(BUCKETS - 1, (pz * BUCKETS) | 0)].push(px, py)
        else if (stride === 1) back.push(px, py)
      }

      const stipple = (xy: number[], alpha: number, radius: number) => {
        if (!xy.length) return
        c.fillStyle = ink(INK, alpha)
        c.beginPath()
        for (let i = 0; i < xy.length; i += 2) {
          c.moveTo(xy[i] + radius, xy[i + 1])
          c.arc(xy[i], xy[i + 1], radius, 0, 2 * Math.PI)
        }
        c.fill()
      }

      stipple(back, 0.075, dotR * 0.8)
      // Ink deepens and dots fatten towards the centre of the face. Both taper
      // together because orthographic projection crowds the rings against the
      // limb: at full weight the edge of the sphere silts up into a solid band,
      // and it is the taper that turns that band back into curvature.
      for (let b = 0; b < BUCKETS; b++) {
        const t = b / (BUCKETS - 1)
        stipple(front[b], 0.26 + 0.66 * t, dotR * (0.6 + 0.4 * t))
      }

      /* Routes. `trace` only adds to the current path — a leg that passes
         behind the globe lifts the pen at the limb — so the whole record's web
         of great circles is one stroke, with the leg just travelled inked over
         the top of it. */
      const trace = (path: Vec[], upTo: number) => {
        const last = upTo * (path.length - 1)
        let pen = false
        for (let s = 0; s < path.length && s <= last; s++) {
          project(path[s])
          if (pz <= 0) {
            pen = false
            continue
          }
          if (pen) c.lineTo(px, py)
          else c.moveTo(px, py)
          pen = true
        }
      }

      c.lineCap = 'round'
      c.strokeStyle = ink(SPOT, 0.16)
      c.lineWidth = dpr * 0.9
      c.beginPath()
      for (const path of legs) trace(path, 1)
      c.stroke()

      const { index: active, from } = target.current
      // The leg is drawn from wherever the reader came from to where they are
      // now, so a jump from the year rail draws the jump it actually made.
      if (active >= 0 && from >= 0 && from !== active && legProgress > 0) {
        const key = `${from}>${active}`
        if (key !== legKey) {
          legKey = key
          legPath = arc(marks[from], marks[active])
        }
        c.strokeStyle = ink(SPOT, 0.85)
        c.lineWidth = dpr * 1.5
        c.beginPath()
        trace(legPath, legProgress)
        c.stroke()
      }

      /* Every place in the record, and then the one being read. */
      const markR = Math.max(1.1 * dpr, R * 0.017)
      c.fillStyle = ink(SPOT, 0.55)
      c.beginPath()
      for (let i = 0; i < marks.length; i++) {
        if (i === active) continue
        project(marks[i])
        if (pz <= 0.04) continue
        c.moveTo(px + markR, py)
        c.arc(px, py, markR, 0, 2 * Math.PI)
      }
      c.fill()

      if (active < 0) return
      project(marks[active])
      if (pz <= -0.02) return
      const mx = px
      const my = py

      // A slow pulse once the globe has arrived — the marker keeps its own beat
      // so the eye can find it again after looking away.
      if (!still.matches && legProgress >= 1) {
        const p = (now % PULSE_MS) / PULSE_MS
        c.strokeStyle = ink(HOT, 0.45 * (1 - p))
        c.lineWidth = dpr
        c.beginPath()
        c.arc(mx, my, markR * (1.4 + p * 4.2), 0, 2 * Math.PI)
        c.stroke()
      }
      // Knocked out of the halftone first, the way a spot colour prints into an
      // unscreened hole rather than on top of the dots.
      c.fillStyle = PAPER
      c.beginPath()
      c.arc(mx, my, markR * 2.05, 0, 2 * Math.PI)
      c.fill()
      c.fillStyle = ink(HOT, 1)
      c.beginPath()
      c.arc(mx, my, markR * 1.35, 0, 2 * Math.PI)
      c.fill()
    }

    /* -------------------------------------------------------------- *
     * Loop
     * -------------------------------------------------------------- */
    let raf = 0
    let running = false

    function frame(now: number) {
      raf = 0
      const wanted = target.current.index
      if (wanted >= 0 && wanted !== aimed) aim(wanted, now)

      const elapsed = now - t0
      const k = snapped ? 1 : Math.min(1, elapsed / TWEEN_MS)
      const e = easeInOut(k)
      yaw = fromYaw + (toYaw - fromYaw) * e + (still.matches ? 0 : (SPIN * elapsed) / 1000)
      pitch = fromPitch + (toPitch - fromPitch) * e

      draw(now, k)
      if (running) raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }
    // A hidden tab is a spin nobody sees, and reduced motion wants a still
    // frame rather than a loop — both are otherwise just battery. A viewport
    // too short for the globe lays it out at zero size, which is the same deal.
    const live = () => {
      if (document.hidden || !box.dataset.live || !box.getBoundingClientRect().width) stop()
      else if (still.matches) {
        stop()
        requestAnimationFrame(frame)
      } else start()
    }
    loop.current = { sync: live }

    const ro = new ResizeObserver(() => {
      resize()
      live()
      if (!running) requestAnimationFrame(frame)
    })
    ro.observe(box)
    resize()

    document.addEventListener('visibilitychange', live)
    still.addEventListener('change', live)
    live()

    return () => {
      loop.current = null
      stop()
      ro.disconnect()
      document.removeEventListener('visibilitychange', live)
      still.removeEventListener('change', live)
    }
  }, [entries, geometry])

  // The loop only needs to run while the globe is on screen, and it needs to
  // wake for a new entry even when reduced motion has parked it.
  useEffect(() => {
    const box = host.current
    if (!box) return
    if (shown) box.dataset.live = '1'
    else delete box.dataset.live
    loop.current?.sync()
  }, [shown, activeIndex])

  const active = activeIndex >= 0 ? entries[activeIndex] : entries[0]
  const from = target.current.from
  const previous = from >= 0 && entries[from] !== active ? entries[from] : null

  return (
    <div className="globe" data-shown={shown} aria-hidden="true">
      <div className="globe-rig">
        <div className="globe-unit">
          <div className="globe-face" ref={host}>
            <canvas ref={canvas} />
          </div>
          <p className="globe-read">
            <span className="globe-place">{active.headline}</span>
            <span className="globe-coord">
              {formatCoord(active.coords[0], 'lat')} {formatCoord(active.coords[1], 'lon')}
            </span>
            {previous && (
              <span className="globe-leg">
                {Math.round(greatCircleKm(previous.coords, active.coords)).toLocaleString('en-US')}
                {' km from '}
                {previous.headline}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Scoped to `.bs` like the rest of the sheet. The globe is parked against the
 * left edge of the same 1560px measure the sheet uses, which on a wide screen
 * drops it into the empty foot of the sticky year column — it shares that
 * column's width rather than being positioned near it.
 */
export const GLOBE_CSS = `
.bs .globe{position:fixed;left:0;right:0;bottom:0;z-index:22;
  display:flex;justify-content:center;pointer-events:none;
  opacity:0;translate:0 14px;
  transition:opacity .6s ease,translate .6s cubic-bezier(.22,1,.36,1)}
.bs .globe[data-shown="true"]{opacity:1;translate:0 0}
.bs .globe-rig{width:100%;max-width:1560px;padding:0 clamp(24px,4vw,64px)}
/* The globe shares the year column with a sticky numeral, and that numeral
   sweeps the full height of the column every time a new year arrives — there is
   no fixed spot in this column it does not cross. So the foot of the column
   gets the same treatment the masthead already gives the head of the page: a
   band of paper the type slides out from under. The numeral rises into view
   exactly as it does past the nav, and the globe never has to flinch. */
/* Sized off the year grid rather than by eye. The globe takes the year column's
   own width; the band around it runs out to the sheet's left edge and on across
   the gutter, because the numeral is set to fit its text and bleeds past the
   column on both sides — a hair to the left from its own negative margin, and
   further to the right when the label is a word rather than four digits. */
.bs .globe-unit{
  width:calc(clamp(180px,17vw,280px) + clamp(32px,4vw,72px) + clamp(24px,4vw,64px));
  margin-left:calc(-1 * clamp(24px,4vw,64px));
  padding:60px clamp(32px,4vw,72px) clamp(20px,4vh,48px) clamp(24px,4vw,64px);
  background:linear-gradient(to top,var(--bg) 85%,transparent)}
/* The sphere is capped by height as well as width. Above it in this column sits
   the sticky year block — 22vh of lead, the numeral, then the roster — and that
   block grows with the viewport more slowly than the viewport does, so on a
   short screen there is very little column left underneath. Taking the column's
   full width there would push the paper band up over the roster and wash it
   out. The linear term is fitted to where the roster actually ends, measured
   across viewport heights, with a margin left under it. */
.bs .globe-face{position:relative;width:min(100%,calc(74vh - 479px));aspect-ratio:1/1}
.bs .globe-face canvas{display:block;width:100%;height:100%}
.bs .globe-read{display:grid;gap:1px;margin:14px 0 0}
.bs .globe-place{font-weight:600;font-size:15px;line-height:1.2;letter-spacing:-0.01em}
.bs .globe-coord{font-size:11.5px;letter-spacing:.1em;color:var(--n700);
  font-feature-settings:'tnum' 1}
.bs .globe-leg{font-size:11.5px;letter-spacing:.06em;color:var(--c700);
  font-feature-settings:'tnum' 1}

/* Shorter desktop viewports: the year block takes most of the column, so the
   readout drops its leg line and the band's dissolve tightens. That buys back
   about fifty pixels, which is the difference between a legible sphere and a
   token one on a 720p laptop. */
@media (min-width:901px) and (max-height:899px){
  .bs .globe-unit{padding-top:30px}
  .bs .globe-leg{display:none}
  .bs .globe-face{width:min(100%,calc(74vh - 432px))}
}
/* Below this the year block reaches the foot of the screen on its own and there
   is no column left to put a globe in. */
@media (min-width:901px) and (max-height:719px){
  .bs .globe{display:none}
}

/* Narrow screens have no empty column to lend it, so the globe becomes a small
   locator in the corner and the readout drops to the place and its position.
   Below this width the year column stops being sticky, so there is no travelling
   numeral to hide from and the paper band would only be a block sitting on the
   article; a wash tight around the sphere is enough to keep body text from
   running up through the halftone. */
@media (max-width:900px){
  .bs .globe-rig{padding:0 clamp(14px,3vw,24px)}
  .bs .globe-unit{width:clamp(88px,26vw,124px);margin-left:0;
    padding:0 0 clamp(14px,2.4vh,24px);background:none}
  .bs .globe-face{background:radial-gradient(circle at 50% 50%,
    var(--bg) 62%,color-mix(in srgb,var(--bg) 55%,transparent) 76%,transparent 86%)}
  .bs .globe-read{margin-top:6px}
  /* The readout can come to rest over a photograph here, and there is no band
     to sit it on. Paper-coloured shadow rather than a panel — the same trick
     the masthead uses to hold its plates apart on the sheet. */
  .bs .globe-read span{text-shadow:0 0 7px var(--bg),0 0 3px var(--bg),0 1px 0 var(--bg)}
  .bs .globe-place{font-size:12px}
  .bs .globe-coord{font-size:10px;letter-spacing:.06em}
  .bs .globe-leg{display:none}
}
@media (prefers-reduced-motion:reduce){
  .bs .globe{transition:opacity .3s}
}
`
