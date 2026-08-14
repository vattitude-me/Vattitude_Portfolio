import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSocialMeta } from '../hooks/useSocialMeta'
import TravelGlobe, { GLOBE_CSS } from '../components/TravelGlobe'
import {
  GROUPS,
  JOURNEYS,
  RAIL,
  STATS,
  entryCountLabel,
  type Fact,
  type Journey,
} from '../data/journeys'

/**
 * The travel record, set as newsprint and read backwards.
 *
 * The design is the Broadsheet system from
 * docs/travel_timeline/Cinematic Travel Timeline Website: near-black serif on
 * paper white, cyan and magenta used as spot colour, no boxes or dividers
 * anywhere — hierarchy comes from the serif scale and from whitespace. Its two
 * signature treatments are ported here rather than approximated:
 *
 *  - `.cmyk .print` prints each photograph as its four misregistered process
 *    plates through one compound SVG filter (#tt-sep-all below), and the press
 *    driver eases the plates into register on hover while purifying their inks,
 *    so the converged four-plate multiply *is* the photograph.
 *  - `.cmyk-head` / `.cmyk-num` set display text as three text plates (C, M, Y)
 *    over the white of the sheet; the dark core is the multiply overlap.
 *
 * Everything is scoped under `.bs` so the site's dark global styles stay put.
 */

/**
 * Share text for this route. scripts/prerender-social.mjs writes the same
 * strings into dist/travel-timeline/index.html, which is what LinkedIn,
 * WhatsApp and other crawlers actually read — keep the two in sync.
 */
export const TRAVEL_META = {
  title: 'Travel Timeline — A Travelogue in 30 Entries, Run Backwards | Vattitude',
  description:
    'Thirty entries across 17 countries and 74 places, newest first — from Washington in 2026 back through Tokyo, Cairo, Rome, Rio, Paris and Dubai to a childhood in India. Dates, places and landmarks, set as newsprint.',
  url: 'https://vattitude.ca/travel-timeline',
  image: 'https://vattitude.ca/travel-timeline-preview.jpg',
}

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap'

/* ------------------------------------------------------------------ *
 * The press: separation filters + the driver that registers them.
 *
 * One set of defs serves the document, so the filter ids are page-unique
 * (`tt-`) and the driver only ever touches nodes inside them.
 * ------------------------------------------------------------------ */

/** Plate inks at rest — the Broadsheet separation (accent, accent-2, yellow, text). */
const INK: Record<string, number[]> = {
  c: [1, 0, 0, 0, 0, 0.467, 0, 0, 0, 0.533, 0.31, 0, 0, 0, 0.69, 0, 0, 0, 0, 1],
  m: [0, 0.161, 0, 0, 0.839, 0, 1, 0, 0, 0, 0, 0.576, 0, 0, 0.424, 0, 0, 0, 0, 1],
  y: [0, 0, 0.071, 0, 0.929, 0, 0, 0.267, 0, 0.733, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  k: [
    0.112, 0.375, 0.038, 0, 0.475, 0.113, 0.379, 0.038, 0, 0.471, 0.113, 0.38, 0.038, 0, 0.468, 0,
    0, 0, 0, 1,
  ],
}

/**
 * The pure-process factorisation the plates ease towards in register. Chosen
 * because these four multiply back to the source exactly — (R,1,1)·(1,G,1)·
 * (1,1,B)·(1,1,1) = (R,G,B) — so the gathered print lands on the photograph
 * with nothing swapped in at the end.
 */
const TRUE_: Record<string, number[]> = {
  c: [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  m: [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  y: [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  k: [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
}

/** Registered misregistration, in px. */
const BASE: Record<string, [number, number]> = { m: [5, 3], y: [-5, -3], k: [3, 6] }

/**
 * Every plate needs its own filter instance now: register is driven per
 * photograph by its own distance from the viewport edge, so two prints can
 * legitimately be at different points in the press at once — one arriving
 * at the top of the screen while another sits clear in the middle. A single
 * shared filter (the hover-driven original) could only ever hold one state.
 */
function pressFilterId(key: string) {
  return `tt-sep-${key}`
}

function PressDefs({ ids }: { ids: string[] }) {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        {ids.map((id) => (
          <filter key={id} id={pressFilterId(id)} colorInterpolationFilters="sRGB">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values={INK.c.join(' ')}
              data-plate-mat="c"
              result="c0"
            />
            <feComposite in="c0" in2="SourceAlpha" operator="in" result="c" />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values={INK.m.join(' ')}
              data-plate-mat="m"
              result="m0"
            />
            <feComposite in="m0" in2="SourceAlpha" operator="in" result="m1" />
            <feOffset in="m1" dx="5" dy="3" data-plate="m" result="m" />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values={INK.y.join(' ')}
              data-plate-mat="y"
              result="y0"
            />
            <feComposite in="y0" in2="SourceAlpha" operator="in" result="y1" />
            <feOffset in="y1" dx="-5" dy="-3" data-plate="y" result="y" />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values={INK.k.join(' ')}
              data-plate-mat="k"
              result="k0"
            />
            <feComposite in="k0" in2="SourceAlpha" operator="in" result="k1" />
            <feOffset in="k1" dx="3" dy="6" data-plate="k" result="k" />
            <feBlend in="m" in2="c" mode="multiply" result="s1" />
            <feBlend in="y" in2="s1" mode="multiply" result="s2" />
            <feBlend in="k" in2="s2" mode="multiply" />
          </filter>
        ))}
      </defs>
    </svg>
  )
}

/** How close to a viewport edge, as a fraction of viewport height, before a
 * print starts pulling apart into its plates. Inside this band register
 * ramps from 1 (clear) at the band's inner edge to 0 (fully separated) right
 * at the edge itself. */
const EDGE_BAND = 0.32

/**
 * Register per print now tracks the scroll, not the pointer: a photograph
 * arriving at the top or bottom edge of the viewport pulls apart into its
 * four separation plates, exactly as the hover version used to on mouse
 * entry, and it gathers back into register as it clears the edge and settles
 * toward the middle of the screen. Every print carries its own state, so
 * several can be mid-press at once — one arriving as another departs.
 */
function usePress(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const host = root.current
    if (!host) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    type Plate = {
      el: HTMLElement
      offs: Record<string, Element>
      mats: Record<string, Element>
      reg: number
      target: number
      lastOffs: string
      lastReg: number
    }

    const plates: Plate[] = []
    host.querySelectorAll<HTMLElement>('.cmyk .print[data-filter-id]').forEach((el) => {
      const offs: Record<string, Element> = {}
      const mats: Record<string, Element> = {}
      const svgFilter = document.getElementById(el.dataset.filterId!)
      if (!svgFilter) return
      svgFilter.querySelectorAll('feOffset[data-plate]').forEach((n) => {
        offs[(n as HTMLElement).dataset.plate!] = n
      })
      svgFilter.querySelectorAll('feColorMatrix[data-plate-mat]').forEach((n) => {
        mats[(n as HTMLElement).dataset.plateMat!] = n
      })
      if (!Object.keys(offs).length) return
      plates.push({ el, offs, mats, reg: 0, target: 0, lastOffs: '', lastReg: -1 })
    })
    if (!plates.length) return

    const ease = (t: number) => 1 - Math.pow(1 - t, 3)

    /** How close el's edge is to a viewport edge, 0 (at the edge) to 1
     * (clear of the band), as the smaller of the top and bottom readings. */
    const edgeClearance = (el: HTMLElement, vh: number) => {
      const r = el.getBoundingClientRect()
      const band = vh * EDGE_BAND
      const fromTop = r.bottom / band
      const fromBottom = (vh - r.top) / band
      return Math.max(0, Math.min(1, Math.min(fromTop, fromBottom)))
    }

    let raf = 0
    // register: 0 = plates converged (clear photograph), 1 = fully separated
    // (red misprint) — so the target is the inverse of edge clearance.
    const retarget = () => {
      const vh = innerHeight
      for (const p of plates) p.target = 1 - ease(edgeClearance(p.el, vh))
      schedule()
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    function tick() {
      raf = 0
      let settled = true
      for (const p of plates) {
        p.reg += (p.target - p.reg) * 0.16
        if (Math.abs(p.target - p.reg) > 0.002) settled = false
        else p.reg = p.target

        const reg = p.reg
        let key = ''
        for (const k in BASE) key += `${((BASE[k][0]) * reg).toFixed(2)},${((BASE[k][1]) * reg).toFixed(2)};`
        if (key !== p.lastOffs) {
          p.lastOffs = key
          for (const k in p.offs) {
            p.offs[k].setAttribute('dx', (BASE[k][0] * reg).toFixed(2))
            p.offs[k].setAttribute('dy', (BASE[k][1] * reg).toFixed(2))
          }
        }
        if (reg !== p.lastReg) {
          p.lastReg = reg
          for (const k in p.mats) {
            const a = INK[k],
              b = TRUE_[k]
            const v = new Array<string>(20)
            for (let i = 0; i < 20; i++) v[i] = (b[i] + (a[i] - b[i]) * reg).toFixed(3)
            p.mats[k].setAttribute('values', v.join(' '))
          }
        }
      }
      if (!settled) schedule()
    }

    retarget()
    addEventListener('scroll', retarget, { passive: true })
    addEventListener('resize', retarget)
    return () => {
      removeEventListener('scroll', retarget)
      removeEventListener('resize', retarget)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [root])
}

/* ------------------------------------------------------------------ *
 * Text plates. The .paper span carries the real text for assistive
 * tech; the three .plate spans are aria-hidden repeats that multiply.
 * ------------------------------------------------------------------ */
function PlateText({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={className}>
      <span className="paper">{children}</span>
      <span className="plate plate-c" aria-hidden="true">
        {children}
      </span>
      <span className="plate plate-m" aria-hidden="true">
        {children}
      </span>
      <span className="plate plate-y" aria-hidden="true">
        {children}
      </span>
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * The page's own stylesheet. Plain CSS on plain markup, the way the
 * design system ships — scoped under .bs so nothing leaks into the
 * site's dark global styles.
 * ------------------------------------------------------------------ */
const CSS = `
.bs{
  --bg:#f3f2f2; --text:#201e1d;
  --c:#0088b0; --m:#d6006c; --y:#edbb00;
  --c700:#006786; --m700:#aa0b56;
  --n400:#bab6b6; --n700:#605d5d;
  position:relative; overflow:clip; min-height:100vh;
  background:var(--bg); color:var(--text);
  font-family:"Source Serif 4",Georgia,"Times New Roman",serif;
  font-size:15px; line-height:1.55; text-wrap:pretty;
}
.bs *,.bs *::before,.bs *::after{box-sizing:border-box}
.bs a{color:var(--c700);text-decoration:none}
.bs a:hover{color:var(--m700)}
.bs :focus-visible{outline:2px solid var(--c);outline-offset:2px}
.bs ::selection{background:rgba(0,136,176,.18);color:var(--text)}
.bs img{display:block;max-width:100%}
.bs figure{margin:0}

/* Kickers, datelines, the uppercase furniture */
.bs .kicker{font-size:13px;letter-spacing:.09em;text-transform:uppercase;color:var(--n700);
  font-feature-settings:'tnum' 1;margin:0}
.bs .measure{font-size:16px;line-height:28px;max-width:44ch;
  color:color-mix(in srgb,var(--text) 78%,transparent);text-align:justify;hyphens:auto}

/* Photographs as their misregistered process plates */
.bs .cmyk{position:relative;background:var(--bg)}
.bs .cmyk .print{position:relative;width:100%;overflow:hidden}
.bs .cmyk .print img{width:100%;height:100%;object-fit:cover}
.bs .cmyk::after{content:"";position:absolute;inset:0;pointer-events:none;
  background-image:radial-gradient(circle,rgba(0,0,0,0.22) 30%,transparent 32%);
  background-size:3px 3px;mix-blend-mode:multiply}
/* Reduced motion gets the print resolved from the start and the dot screen
   dropped — the press treatment is a scroll-driven animation, and where
   motion is not wanted the treatment does not belong. */
@media (prefers-reduced-motion:reduce){
  .bs .cmyk .print{filter:none !important}
  .bs .cmyk::after{display:none}
}

/* Display text as three text plates over the white of the sheet. All four
   copies share one grid cell, so every plate lays its glyphs out in exactly
   the box the paper union used — the offsets below are then the only thing
   separating them, which is what keeps the misregistration honest at any
   size. (The system's own sheet stacks them with position:absolute and a
   text-box trim; one grid cell needs neither.) */
.bs .cmyk-head,.bs .cmyk-num{display:grid}
.bs .cmyk-head > span,.bs .cmyk-num > span{grid-area:1 / 1}
.bs .cmyk-head .paper{color:var(--bg);
  text-shadow:0.027em 0.0185em 0 var(--bg),-0.0245em -0.0175em 0 var(--bg)}
.bs .cmyk-head .plate{mix-blend-mode:multiply;pointer-events:none;user-select:none}
.bs .cmyk-head .plate-c{color:var(--c)}
.bs .cmyk-head .plate-m{color:var(--m);
  translate:calc(0.018em + 0.009em*var(--press-nx,0)) calc(0.0125em + 0.006em*var(--press-ny,0))}
.bs .cmyk-head .plate-y{color:var(--y);
  translate:calc(-0.0155em + 0.009em*var(--press-nx,0)) calc(-0.0115em + 0.006em*var(--press-ny,0))}
.bs .cmyk-num{width:fit-content;line-height:.9;font-feature-settings:'pnum' 1;
  background:var(--bg);padding:0.12em;margin:-0.12em}
.bs .cmyk-num .paper{color:var(--bg);
  text-shadow:0.036em 0.025em 0 var(--bg),-0.031em -0.023em 0 var(--bg)}
.bs .cmyk-num .plate{mix-blend-mode:multiply;pointer-events:none;user-select:none}
.bs .cmyk-num .plate-c{color:var(--c)}
.bs .cmyk-num .plate-m{color:var(--m);
  translate:calc(0.036em + 0.018em*var(--press-nx,0)) calc(0.025em + 0.0125em*var(--press-ny,0))}
.bs .cmyk-num .plate-y{color:var(--y);
  translate:calc(-0.031em + 0.018em*var(--press-nx,0)) calc(-0.023em + 0.0125em*var(--press-ny,0))}

/* Chrome */
.bs .progress{position:fixed;top:0;left:0;height:2px;background:var(--c);z-index:40}
.bs .nav{position:fixed;top:0;left:0;right:0;z-index:30;display:flex;align-items:baseline;
  gap:14px 28px;flex-wrap:wrap;padding:20px clamp(24px,4vw,64px);
  background:linear-gradient(to bottom,var(--bg) 62%,transparent);pointer-events:none}
.bs .nav a,.bs .nav button{pointer-events:auto}
.bs .brand{display:inline-flex;align-items:baseline;gap:8px;font-weight:600;font-size:17px;
  letter-spacing:-0.005em;color:var(--text)}
.bs .brand:hover{color:var(--c700)}
.bs .nav .count{margin-left:auto}

/* Back-to-top. A register target with an arrow through it, parked in the corner
   the year rail leaves free. Untabbable and inert while hidden, so it is not a
   focus stop sitting invisibly over the masthead. */
.bs .totop{position:fixed;right:clamp(18px,2.4vw,40px);bottom:clamp(20px,3.4vh,38px);z-index:31;
  display:flex;align-items:center;gap:11px;padding:0;background:none;border:0;cursor:pointer;
  font-family:inherit;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
  color:var(--n700);opacity:0;translate:0 10px;pointer-events:none;
  transition:opacity .35s,translate .35s cubic-bezier(.22,1,.36,1),color .25s}
.bs .totop[data-shown="true"]{opacity:1;translate:0 0;pointer-events:auto}
.bs .totop:hover{color:var(--c700)}
.bs .totop .target{position:relative;display:grid;place-items:center;width:34px;height:34px;
  flex:none;border:1px solid var(--n400);border-radius:50%;background:var(--bg);
  transition:border-color .25s}
.bs .totop:hover .target{border-color:var(--c700)}
/* The crosshair, clipped to the ring so it reads as a printer's target. */
.bs .totop .target::before,.bs .totop .target::after{content:"";position:absolute;
  background:var(--n400);transition:background .25s}
.bs .totop .target::before{left:50%;top:-1px;bottom:-1px;width:1px;transform:translateX(-50%)}
.bs .totop .target::after{top:50%;left:-1px;right:-1px;height:1px;transform:translateY(-50%)}
.bs .totop:hover .target::before,.bs .totop:hover .target::after{background:var(--c)}
.bs .totop .target i{position:relative;z-index:1;display:block;padding:0 3px;font-style:normal;
  font-size:15px;line-height:1;background:var(--bg);
  transition:transform .35s cubic-bezier(.22,1,.36,1)}
.bs .totop:hover .target i{transform:translateY(-3px)}

.bs .rail{position:fixed;right:clamp(18px,2.4vw,40px);top:50%;transform:translateY(-50%);z-index:30;
  display:flex;flex-direction:column;gap:18px;align-items:flex-end}
.bs .rail button{display:flex;align-items:center;gap:10px;background:none;border:0;padding:0;
  cursor:pointer;font-family:inherit;font-weight:600;font-size:13px;letter-spacing:.06em;
  font-feature-settings:'tnum' 1;color:var(--n400);transition:color .25s}
.bs .rail button .tick{display:block;height:1px;width:16px;background:currentColor;transition:width .25s}
.bs .rail button:hover{color:var(--n700)}
.bs .rail button[aria-current="true"]{color:var(--c700)}
.bs .rail button[aria-current="true"] .tick{width:34px}

/* Sheet */
.bs .sheet{max-width:1560px;margin:0 auto;padding:0 clamp(24px,4vw,64px)}
/* The masthead. A three-part grid — dateline, headline, lower band — with the
   headline given the whole middle row so it always sits optically centred on
   the sheet no matter how tall the viewport is. */
.bs .hero{min-height:100vh;display:grid;grid-template-rows:auto 1fr auto;
  align-content:stretch;padding-top:clamp(96px,14vh,180px);padding-bottom:clamp(48px,8vh,96px)}
/* Headline and collage share the middle row. The headline keeps its own
   measure so the type size is never driven by the pictures beside it. */
.bs .masthead{align-self:center;display:grid;
  grid-template-columns:minmax(0,1fr) clamp(280px,31vw,470px);
  gap:clamp(28px,4vw,72px);align-items:center;padding:clamp(24px,4vh,56px) 0}
.bs h1{font-weight:600;font-size:clamp(44px,6.6vw,116px);line-height:1.02;
  letter-spacing:-0.025em;margin:0 0 0 -0.035em}
/* A third line costs a whole line-height; the step down keeps the standfirst
   and the scroll cue on the fold at laptop heights. */
.bs h1.h1-3{font-size:clamp(38px,5.4vw,94px);line-height:1.0}

/* The collage. Overlapping slips at deliberately unequal scales, each one
   rotated a little as though laid on a light table — the drift and the
   separation filter are the entries' own, so the masthead is a preview of the
   press rather than a decoration with different rules. */
.bs .collage{position:relative;display:grid;
  grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(6,1fr);
  aspect-ratio:1 / 1}
.bs .slip{position:relative;margin:0;
  filter:drop-shadow(0 1px 0 var(--n400)) drop-shadow(0 8px 22px rgba(32,30,29,.14));
  transition:transform .45s cubic-bezier(.22,1,.36,1),z-index 0s}
.bs .slip .print{height:100%}
.bs .slip img{height:100%}
.bs .slip figcaption{position:absolute;left:0;right:0;bottom:-19px;font-size:10.5px;
  letter-spacing:.1em;color:var(--n700);opacity:0;transition:opacity .3s}
/* Lift-on-hover and the caption it reveals are for mice only. On touch a tap
   would latch the slip straight and leave it there, and a caption that only
   appears on hover is a caption a phone can never read. */
@media (hover:hover) and (pointer:fine){
  .bs .slip:hover{z-index:6;transform:rotate(0deg) scale(1.035)}
  .bs .slip:hover figcaption{opacity:1}
}

/* Grid areas, largest first so the stack reads front-to-back. */
.bs .slip.s1{grid-area:1 / 1 / 5 / 5;z-index:3;rotate:-1.6deg}
.bs .slip.s2{grid-area:3 / 4 / 7 / 7;z-index:4;rotate:2.1deg}
.bs .slip.s3{grid-area:1 / 4 / 3 / 6;z-index:2;rotate:1.2deg}
.bs .slip.s4{grid-area:5 / 1 / 7 / 4;z-index:5;rotate:-2.4deg}
.bs .slip.s5{grid-area:4 / 2 / 6 / 5;z-index:1;rotate:3deg}
.bs .slip.s1 .print{aspect-ratio:auto}
@media (prefers-reduced-motion:reduce){
  .bs .slip{transition:none}
}

/* The dateline spaces its own parts rather than relying on typed separators,
   so it can wrap on a phone without leaving a dangling middot. */
.bs .dateline{display:flex;flex-wrap:wrap;column-gap:26px;row-gap:4px;align-items:baseline}
.bs .dateline span{display:inline-flex;align-items:baseline;gap:26px}
.bs .dateline span:not(:last-child)::after{content:"·";color:var(--n400)}

.bs .standfirst{display:grid;grid-template-columns:minmax(0,1fr) auto;
  gap:clamp(32px,5vw,88px);align-items:start}
.bs .lede{font-size:18px;line-height:30px;max-width:56ch;margin:0;
  color:color-mix(in srgb,var(--text) 80%,transparent);text-align:justify;hyphens:auto}

/* The record's figures, set as a small ledger. Tabular numerals and the serif
   at display size — the only place the hero states a number. */
.bs .figures{display:grid;grid-template-columns:repeat(2,auto);gap:22px clamp(28px,3.4vw,52px);
  margin:0;justify-content:start}
.bs .figures dt{font-size:12px;letter-spacing:.11em;text-transform:uppercase;color:var(--n700)}
.bs .figures dd{margin:2px 0 0;font-weight:600;font-size:clamp(30px,3.4vw,44px);line-height:1;
  letter-spacing:-0.02em;font-feature-settings:'tnum' 1;white-space:nowrap}
.bs .figures div:last-child dd{font-size:clamp(20px,2.1vw,27px);color:var(--c700)}

/* The scroll cue is a button now, so it has to shed the UA button styling. The
   trailing hairline is the one bit of press furniture the masthead carries. */
.bs .cue{display:flex;align-items:center;gap:14px;width:100%;margin:clamp(36px,6vh,64px) 0 0;
  padding:0;background:none;border:0;cursor:pointer;text-align:left;
  font-family:inherit;font-size:12.5px;letter-spacing:.09em;text-transform:uppercase;
  color:var(--n700);transition:color .25s}
.bs .cue:hover{color:var(--c700)}
.bs .cue .arrow{transition:transform .35s cubic-bezier(.22,1,.36,1)}
.bs .cue:hover .arrow{transform:translateY(4px)}
.bs .cue .cue-lead{flex:1;height:1px;min-width:24px;
  background-image:repeating-linear-gradient(to right,var(--n400) 0 1px,transparent 1px 5px)}

.bs .year{display:grid;grid-template-columns:clamp(180px,17vw,280px) minmax(0,1fr);
  gap:0 clamp(32px,4vw,72px)}
.bs .year > .stick{position:sticky;top:110px;align-self:start;padding-top:22vh}
.bs .year .numeral{font-weight:600;font-size:clamp(56px,8vw,124px);letter-spacing:-0.02em}
.bs .year .roster{margin:26px 0 0;line-height:22px}

.bs article{min-height:100vh;display:grid;align-items:center;padding:12vh 0;
  grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(28px,3.4vw,64px)}
.bs article.flip{grid-template-columns:minmax(0,7fr) minmax(0,5fr)}
.bs article.flip .body{order:2}
.bs article.flip figure{order:1}
.bs article h2{font-weight:600;font-size:clamp(38px,5.4vw,88px);line-height:.98;
  letter-spacing:-0.022em;margin:0 0 0 -0.035em}
.bs .where{font-size:15px;letter-spacing:.14em;text-transform:uppercase;color:var(--c700);margin:16px 0 0}
.bs .ledger{display:grid;gap:6px;margin-top:34px;max-width:34ch}
.bs .ledger p{display:flex;align-items:baseline;gap:8px;margin:0;font-size:15px;line-height:26px}
.bs .ledger .dots{flex:1;border-bottom:1px dotted var(--n400);margin-bottom:.34em}
.bs .ledger .val{font-weight:600;font-feature-settings:'tnum' 1}
.bs .ledger .val.spot{color:var(--m700)}
/* City lists. A flex row rather than a run of text: the separator rides along
   with the name it follows, and every item is its own wrap opportunity — a run
   of nowrap spans with the dots inside them has none at all, which sent the
   fifteen Indian cities off the side of the screen. */
.bs .cities{display:flex;flex-wrap:wrap;column-gap:9px;row-gap:2px;
  margin:28px 0 0;font-size:14px;line-height:24px;color:var(--n700)}
.bs .cities span{white-space:nowrap}
.bs .cities span:not(:last-child)::after{content:" ·";color:var(--n400)}

/* Press furniture between entries: the control strip a printer pulls off the
   edge of a sheet — a dotted hairline, the four process patches in plate order,
   and a register target. It is the one place the page draws a line. */
.bs .furniture{display:flex;align-items:center;gap:16px;margin:0;padding:0}
.bs .furniture .lead{flex:1;height:1px;
  background-image:repeating-linear-gradient(to right,var(--n400) 0 1px,transparent 1px 5px)}
.bs .furniture .bar{display:flex;gap:3px}
.bs .furniture .bar i{display:block;width:17px;height:7px}
.bs .furniture .bar .c{background:var(--c)}
.bs .furniture .bar .m{background:var(--m)}
.bs .furniture .bar .y{background:var(--y)}
.bs .furniture .bar .k{background:var(--text)}
.bs .furniture .target{position:relative;width:13px;height:13px;flex:none;
  border:1px solid var(--n400);border-radius:50%}
.bs .furniture .target::before,.bs .furniture .target::after{content:"";position:absolute;
  background:var(--n400)}
.bs .furniture .target::before{left:50%;top:-5px;bottom:-5px;width:1px;transform:translateX(-50%)}
.bs .furniture .target::after{top:50%;left:-5px;right:-5px;height:1px;transform:translateY(-50%)}

.bs footer{max-width:1560px;margin:0 auto;padding:14vh clamp(24px,4vw,64px) 10vh;
  display:flex;flex-wrap:wrap;gap:18px 40px;align-items:baseline}
.bs footer .colophon{max-width:52ch;font-size:14px;line-height:24px;color:var(--n700)}

/* Entrances. Reveals are class-toggled from one observer; the drift is
   scroll-driven where the browser supports it. */
.bs [data-reveal]{opacity:0}
.bs [data-reveal].in{animation:ttRev .85s cubic-bezier(.22,1,.36,1) both}
.bs [data-reveal="plate"].in{animation:ttPlate .95s cubic-bezier(.22,1,.36,1) both}
@keyframes ttRev{from{opacity:0;transform:translateY(34px)}to{opacity:1;transform:none}}
@keyframes ttPlate{from{opacity:0;clip-path:inset(0 0 100% 0)}to{opacity:1;clip-path:inset(0 0 0 0)}}
@supports (animation-timeline:view()){
  .bs .drift{animation:ttDrift linear both;animation-timeline:view();animation-range:cover 0% cover 100%}
  @keyframes ttDrift{from{transform:translateY(3.5%)}to{transform:translateY(-3.5%)}}
}

@media (max-width:1180px){ .bs .rail{display:none} }
@media (max-width:760px){
  .bs .nav{gap:10px 18px;padding:16px clamp(20px,5vw,32px)}
  .bs .nav .tagline{display:none}
  .bs .nav .count{font-size:11.5px}
}
@media (max-width:900px){
  .bs .year{grid-template-columns:minmax(0,1fr)}
  .bs .year > .stick{position:static;padding:14vh 0 0}
  .bs .year .numeral{font-size:clamp(56px,16vw,96px)}
  .bs .year .roster{margin-top:16px}
  .bs article,.bs article.flip{grid-template-columns:minmax(0,1fr);min-height:0;padding:8vh 0;
    gap:32px}
  .bs article.flip .body{order:2}
  .bs article.flip figure{order:1}
  .bs .hero{min-height:92vh}
  /* Collage above the headline and wider than tall — a square block of slips
     between the dateline and the type would push the headline off the fold. */
  .bs .masthead{grid-template-columns:minmax(0,1fr);gap:clamp(30px,5vh,52px)}
  .bs .collage{order:-1;aspect-ratio:16 / 9;max-width:560px}
  .bs h1{font-size:clamp(44px,9.6vw,104px)}
  .bs h1.h1-3{font-size:clamp(38px,8.4vw,88px)}
  /* Below the two-column standfirst, the figures go under the lede and spread
     to four across before they start wrapping again on a phone. */
  .bs .standfirst{grid-template-columns:minmax(0,1fr);gap:38px}
  .bs .figures{grid-template-columns:repeat(4,auto);gap:18px clamp(20px,4vw,40px)}
}
@media (max-width:560px){
  .bs .figures{grid-template-columns:repeat(2,auto);gap:20px 34px}
  .bs .totop .totop-label{display:none}
  .bs .dateline{column-gap:18px}
  .bs .dateline span{gap:18px}
}
@media (prefers-reduced-motion:reduce){
  .bs [data-reveal]{opacity:1;animation:none !important}
  .bs .totop{transition:opacity .2s}
  .bs .cue .arrow,.bs .totop .target i{transition:none}
}
`

/* ------------------------------------------------------------------ *
 * The masthead collage: five plates pinned up like a picture desk's
 * selects, printed through the same separation as the entries below.
 *
 * Sourced by entry id rather than by literal path, so a re-shot or
 * re-slugged image follows the record instead of going missing here.
 * ------------------------------------------------------------------ */
const COLLAGE_IDS = ['egypt', 'brazil', 'france', 'japan-korea', 'peru'] as const

function Collage() {
  const picks = COLLAGE_IDS.map((id) => JOURNEYS.find((j) => j.id === id)).filter(
    (j): j is Journey => Boolean(j),
  )

  return (
    <div className="collage" data-reveal="text">
      {picks.map((j, i) => (
        <figure key={j.id} className={`cmyk slip s${i + 1}`}>
          <div
            className="print"
            data-filter-id={pressFilterId(`collage-${j.id}`)}
            style={{ filter: `url(#${pressFilterId(`collage-${j.id}`)})` }}
          >
            <img
              src={j.image}
              alt={`${j.headline}, ${j.country}`}
              loading={i < 2 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
          <figcaption className="kicker">{j.headline}</figcaption>
        </figure>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * What separates two entries: a printer's control strip.
 * ------------------------------------------------------------------ */
function Furniture() {
  return (
    <div className="furniture" aria-hidden="true" data-reveal="text">
      <span className="lead" />
      <span className="bar">
        <i className="c" />
        <i className="m" />
        <i className="y" />
        <i className="k" />
      </span>
      <span className="target" />
      <span className="lead" />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * One entry — a plate on one side, the record on the other.
 * ------------------------------------------------------------------ */
function Entry({
  j,
  index,
  flip,
  eager,
}: {
  j: Journey
  /** Position in JOURNEYS — what the globe is told to turn to. */
  index: number
  flip: boolean
  eager: boolean
}) {
  return (
    <article id={j.id} className={flip ? 'flip' : undefined} data-year={j.year} data-index={index}>
      <div className="body" data-reveal="text">
        <p className="kicker">
          No. {String(j.no).padStart(2, '0')} · {j.period}
        </p>
        <h2>
          <PlateText className="cmyk-head">{j.headline}</PlateText>
        </h2>
        <p className="where">{j.country}</p>
        <p className="measure">{j.note}</p>

        <div className="ledger">
          <p>
            <span>Dates</span>
            <span className="dots" />
            <span className="val">{j.dates}</span>
          </p>
          {j.facts.map((f: Fact) => (
            <p key={f.label}>
              <span>{f.label}</span>
              <span className="dots" />
              <span className={f.accent ? 'val spot' : 'val'}>{f.value}</span>
            </p>
          ))}
        </div>

        {j.cities.length > 1 && (
          <p className="cities">
            {j.cities.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </p>
        )}
      </div>

      <figure className="cmyk" data-reveal="plate">
        <div
          className="print drift"
          data-filter-id={pressFilterId(j.id)}
          style={{ aspectRatio: j.ratio, filter: `url(#${pressFilterId(j.id)})` }}
        >
          <img
            src={j.image}
            alt={`${j.headline}, ${j.country.split('—')[0].trim()}`}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
      </figure>
    </article>
  )
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */
export default function TravelTimeline() {
  const root = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [activeYear, setActiveYear] = useState(GROUPS[0].year)
  // Which entry the globe is turned to, and whether it has a subject at all.
  const [activeIndex, setActiveIndex] = useState(-1)
  const [inRecord, setInRecord] = useState(false)
  const [atEnd, setAtEnd] = useState(false)

  useSocialMeta(TRAVEL_META)
  usePress(root)

  const newest = JOURNEYS[0]
  // The oldest entry carrying a real year — the India group is deliberately
  // undated, so the record's span is bounded by the last numbered one.
  const oldestDated = useMemo(
    () => [...JOURNEYS].reverse().find((j) => /^\d{4}$/.test(j.year)),
    [],
  )
  const span = oldestDated ? `${oldestDated.year}–${newest.year}` : newest.year

  // Source Serif 4 is this page's alone — the rest of the site is set in Inter,
  // so the face is fetched on mount rather than from the global shell.
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONT_HREF
    document.head.appendChild(link)
  }, [])

  // The sheet is paper white; the site's body is near-black, which would show
  // through on overscroll and behind the fixed chrome.
  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#f3f2f2'
    return () => {
      document.body.style.backgroundColor = prev
    }
  }, [])

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? window.scrollY / max : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // One observer runs both the entrance reveals (once each) and the year rail's
  // current mark, keyed off whichever entry holds the middle of the viewport.
  useEffect(() => {
    const host = root.current
    if (!host) return

    const reveals = new IntersectionObserver(
      (list) => {
        for (const e of list) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            reveals.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )
    host.querySelectorAll('[data-reveal]').forEach((el) => reveals.observe(el))

    /**
     * Which entry the reader is in front of, taken as whichever one covers the
     * most of a band across the middle of the viewport. The band has height on
     * purpose — a zero-height line falls into the gap between two entries at
     * the handover and leaves the rail and the globe with no subject — and the
     * widest overlap is the one nearest the centre.
     */
    const covered = new Map<Element, number>()
    const current = new IntersectionObserver(
      (list) => {
        for (const e of list) {
          if (e.isIntersecting) covered.set(e.target, e.intersectionRatio)
          else covered.delete(e.target)
        }

        let best: HTMLElement | null = null
        let bestRatio = -1
        for (const [el, ratio] of covered) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = el as HTMLElement
          }
        }

        // Above the first entry the band is empty and the globe has no subject
        // to hold, so it stands down.
        setInRecord(best !== null)
        if (!best) return
        setActiveYear(best.dataset.year!)
        setActiveIndex(Number(best.dataset.index))
      },
      // Stepped thresholds so the ratios keep updating as an entry crosses the
      // band, not just as it enters and leaves it.
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    host.querySelectorAll('article[data-year]').forEach((el) => current.observe(el))

    /**
     * The colophon shares the foot of the viewport with the globe, and the last
     * entry is still the one in the band while it does — so the end of the
     * record is watched on its own terms: the moment the colophon reaches up
     * into the bottom of the screen, the globe gets out of its way.
     */
    const end = new IntersectionObserver(
      (list) => setAtEnd(list.some((e) => e.isIntersecting)),
      { rootMargin: '-58% 0px 0px 0px' },
    )
    const colophon = host.querySelector('footer')
    if (colophon) end.observe(colophon)

    return () => {
      reveals.disconnect()
      current.disconnect()
      end.disconnect()
    }
  }, [])

  // Smooth where it is wanted, instant where motion is not.
  const behavior: ScrollBehavior = useMemo(
    () =>
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true ? 'auto' : 'smooth',
    [],
  )

  const jump = (year: string) => {
    document.getElementById(`y${year}`)?.scrollIntoView({ behavior, block: 'start' })
  }

  const atTop = progress <= 0.06

  const filterIds = useMemo(
    () => [...JOURNEYS.map((j) => j.id), ...COLLAGE_IDS.map((id) => `collage-${id}`)],
    [],
  )

  return (
    <div className="bs" ref={root}>
      <style>{CSS + GLOBE_CSS}</style>
      <PressDefs ids={filterIds} />

      <div className="progress" style={{ width: `${progress * 100}%` }} />

      <TravelGlobe entries={JOURNEYS} activeIndex={activeIndex} shown={inRecord && !atEnd} />

      <nav className="nav">
        <Link to="/#portfolio" className="brand" title="Back to the Vattitude portfolio">
          <span aria-hidden>←</span> Back to portfolio
        </Link>
        <span className="kicker tagline">A travelogue, run backwards</span>
        <span className="kicker count">
          {STATS.entries} entries · {STATS.countries} countries · {STATS.cities} places
        </span>
      </nav>

      <aside className="rail" aria-label="Jump to a year">
        {RAIL.map((r) => (
          <button
            key={r.year}
            type="button"
            onClick={() => jump(r.year)}
            aria-current={activeYear === r.year}
          >
            <span>{r.label}</span>
            <span className="tick" />
          </button>
        ))}
      </aside>

      <section className="sheet hero">
        <p className="kicker dateline">
          <span>Edition one</span>
          <span>Filed August 2026</span>
          <span>Newest first</span>
        </p>

        <div className="masthead">
          {/* Three lines rather than two, so the type steps down a size — the
              nav tagline and the lede already carry the reverse-order trick,
              which leaves the headline free to name the subject instead. */}
          <h1 className="h1-3">
            <PlateText className="cmyk-head">Everywhere</PlateText>
            <PlateText className="cmyk-head">I’ve been,</PlateText>
            <PlateText className="cmyk-head">newest first.</PlateText>
          </h1>
          <Collage />
        </div>

        {/* The masthead's lower band. The system has no rules to divide it, so
            the split is done with type: the standfirst keeps the serif measure
            and the figures beside it are the only tabular numerals on the
            sheet, which is what reads as a masthead rather than a paragraph. */}
        <div className="standfirst">
          <p className="lede">
            Scroll and the years run the wrong way — from five days on the National Mall this
            summer, back through Seoul and Kyoto, Cairo and Rome, Rio and Paris and Dubai, to a
            week in Langkawi in 2011 and finally to fifteen cities in India with no dates worth
            keeping. Each entry holds what a passport holds: a month, a country, a city, and how
            long it lasted.
          </p>

          <dl className="figures">
            <div>
              <dt>Entries</dt>
              <dd>{STATS.entries}</dd>
            </div>
            <div>
              <dt>Countries</dt>
              <dd>{STATS.countries}</dd>
            </div>
            <div>
              <dt>Places</dt>
              <dd>{STATS.cities}</dd>
            </div>
            <div>
              <dt>Spanning</dt>
              <dd>{span}</dd>
            </div>
          </dl>
        </div>

        <button type="button" className="cue" onClick={() => jump(GROUPS[0].year)}>
          <span className="arrow" aria-hidden>
            ↓
          </span>
          <span>
            Begin at {newest.headline}, {newest.period}
          </span>
          <span className="cue-lead" aria-hidden />
        </button>
      </section>

      <div className="sheet">
        {GROUPS.map((g) => (
          <section id={`y${g.year}`} className="year" key={g.year}>
            <div className="stick">
              {/* The plate class has to sit on the element PlateText itself
                  renders — it is the grid that stacks the four copies in one
                  cell. Wrapping it in a styled div leaves the plates as inline
                  grandchildren, and they lay out side by side instead. */}
              <PlateText className="cmyk-num numeral">{g.label}</PlateText>
              <p className="kicker roster">
                {entryCountLabel(g.entries.length)}
                <br />
                {g.countries.join(' · ')}
              </p>
            </div>

            <div>
              {g.entries.map((j, i) => (
                // Sides alternate across the whole record, not per section, so
                // the column never marches two plates down one edge.
                <Fragment key={j.id}>
                  {i > 0 && <Furniture />}
                  <Entry
                    j={j}
                    index={JOURNEYS.indexOf(j)}
                    flip={JOURNEYS.indexOf(j) % 2 === 1}
                    eager={j.no === newest.no}
                  />
                </Fragment>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Back to the masthead. Held out of the flow until there is somewhere to
          go back to, and set as a register target so it reads as part of the
          press furniture rather than a bolted-on widget. */}
      <button
        type="button"
        className="totop"
        data-shown={!atTop}
        tabIndex={atTop ? -1 : 0}
        aria-hidden={atTop}
        onClick={() => window.scrollTo({ top: 0, behavior })}
        aria-label="Back to the top of the record"
        title="Back to the top"
      >
        <span className="target" aria-hidden>
          <i aria-hidden>↑</i>
        </span>
        <span className="totop-label" aria-hidden>
          Top
        </span>
      </button>

      <footer>
        <p className="kicker">
          End of the record
          {oldestDated ? ` · Dated entries begin ${oldestDated.period}` : ''}
        </p>
        <p className="colophon">
          Set in Source Serif 4 after the Broadsheet press treatments: on a mouse, every photograph
          prints as its four misregistered process plates and hover squares them up. The globe turns
          to each entry as you scroll — a halftone of Natural Earth's coastlines, drawn from one bit
          per dot. Landmark imagery from Wikimedia Commons, hosted locally and credited per file in
          the repository.{' '}
          <Link to="/">Back to Vattitude</Link>
        </p>
      </footer>
    </div>
  )
}
