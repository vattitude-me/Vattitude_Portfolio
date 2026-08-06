import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { eras, type Era, type Artist } from '../data/artEras'
import GildedFrame from '../components/GildedFrame'
import ArtImage from '../components/ArtImage'

/* ------------------------------------------------------------------ *
 * One era scene. The "bulge": scenes fade + recede toward viewport edges.
 * ------------------------------------------------------------------ */
function EraScene({
  era,
  index,
  onActive,
  reduced,
}: {
  era: Era
  index: number
  onActive: (i: number) => void
  reduced: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const [bulge, setBulge] = useState(0) // 1 = centred, 0 = at edge
  const [heroFlipped, setHeroFlipped] = useState(false)

  // Which artist (if any) has taken over the big frame, and which of their
  // works is showing there. `null` = the era's own hero artwork.
  const [artist, setArtist] = useState<Artist | null>(null)
  const [workIndex, setWorkIndex] = useState(0)

  const selectArtist = (a: Artist) => {
    setHeroFlipped(false)
    setWorkIndex(0)
    setArtist((cur) => (cur?.name === a.name ? null : a))
  }

  const work = artist?.works[workIndex]
  // Unified shape so the big frame renders one way regardless of source.
  const display = work
    ? {
        title: work.title,
        caption: `${artist!.name} · ${work.year}`,
        imageUrl: work.imageUrl,
        factoid: work.factoid,
        sourceCredit: work.sourceCredit,
        sourceLink: work.sourceLink,
        key: `${artist!.name}-${work.title}`,
      }
    : {
        title: era.heroArtwork.title,
        caption: `${era.heroArtwork.artist} · ${era.heroArtwork.year}`,
        imageUrl: era.heroArtwork.imageUrl,
        factoid: era.heroArtwork.factoid,
        sourceCredit: era.heroArtwork.sourceCredit,
        sourceLink: era.heroArtwork.sourceLink,
        key: era.heroArtwork.title,
      }

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let frame = 0
    const compute = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight

      const overlap = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0))
      const coverage = overlap / Math.min(vh, Math.max(rect.height, 1))

      // Scenes shorter than the viewport get the centre-proximity "bulge".
      // Scenes taller than it (typical on mobile) can never centre, so they use
      // viewport coverage instead - otherwise they'd stay permanently blurred.
      const focus =
        rect.height <= vh
          ? 1 - Math.min(Math.abs(rect.top + rect.height / 2 - vh / 2) / vh, 1)
          : coverage

      setBulge(Math.max(0, Math.min(1, focus)))
      if (coverage > 0.55) onActive(index)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [index, onActive])

  // Reduced motion: hold everything at full presence, no scale/translate.
  const t = reduced ? 1 : bulge
  const eased = t * t * (3 - 2 * t) // smoothstep
  const opacity = reduced ? 1 : 0.12 + eased * 0.88
  const scale = reduced ? 1 : 0.86 + eased * 0.14
  const blur = reduced ? 0 : (1 - eased) * 7

  return (
    <section
      ref={ref}
      id={era.id}
      aria-label={era.name}
      className="relative min-h-screen flex items-center pt-28 pb-28 lg:py-24 scroll-mt-24"
    >
      {/* Era atmosphere */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 55% at 50% 45%, ${era.theme.gradientFrom}55 0%, ${era.theme.gradientTo}00 70%)`,
          opacity: reduced ? 0.6 : eased,
          transition: 'opacity 200ms linear',
        }}
      />

      <div
        className="relative w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16"
        style={{
          opacity,
          transform: `scale(${scale})`,
          filter: blur > 0.05 ? `blur(${blur}px)` : 'none',
          transformOrigin: 'center center',
          willChange: 'transform, opacity, filter',
        }}
      >
        {/* Top-aligned: the left column grows when an era carries offsite works,
            and centring would float the artwork frame out of line with the era
            heading. The frame sticks instead, so it stays in view while the
            longer column scrolls. */}
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-start">
          {/* Text column */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-xs px-2.5 py-1 rounded-full border" style={{ color: era.theme.accent, borderColor: `${era.theme.accent}55`, background: `${era.theme.accent}12` }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-mono text-xs tracking-[0.18em] text-white/45">{era.yearRange}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-3">
              {era.name}
            </h2>
            <p className="text-lg mb-6 italic" style={{ color: era.theme.accent }}>
              {era.tagline}
            </p>
            <p className="text-slate-300/90 leading-relaxed text-[15.5px] max-w-xl mb-7">{era.description}</p>

            <div className="flex flex-wrap gap-2 mb-9">
              {era.characteristics.map((c) => (
                <span
                  key={c}
                  className="text-[11.5px] px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.09] text-white/60"
                >
                  {c}
                </span>
              ))}
            </div>

            <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">
              Key Artists{' '}
              <span className="normal-case tracking-normal text-white/25">- tap to view their work</span>
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {era.keyArtists.map((a) => {
                const on = artist?.name === a.name
                return (
                  <button
                    key={a.name}
                    onClick={() => selectArtist(a)}
                    aria-pressed={on}
                    className="group flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    style={{
                      borderColor: on ? `${era.theme.accent}99` : 'rgba(255,255,255,0.1)',
                      background: on ? `${era.theme.accent}1f` : 'rgba(255,255,255,0.03)',
                      boxShadow: on ? `0 0 20px ${era.theme.accent}33` : 'none',
                    }}
                  >
                    <span className="w-8 h-8 rounded-full overflow-hidden border border-white/15 shrink-0">
                      <ArtImage src={a.portraitUrl} alt={a.name} className="w-full h-full object-cover object-top" />
                    </span>
                    <span
                      className="text-[13.5px] whitespace-nowrap transition-colors"
                      style={{ color: on ? era.theme.accent : undefined }}
                    >
                      <span className={on ? '' : 'text-white/80 group-hover:text-white'}>{a.name}</span>
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Selected artist's context - the bio the modal used to hold. */}
            <AnimatePresence initial={false}>
              {artist && (
                <motion.div
                  key={artist.name}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 rounded-xl border border-white/[0.09] bg-white/[0.02] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-white">{artist.name}</p>
                        <p className="font-mono text-[11.5px] mt-0.5" style={{ color: era.theme.accent }}>
                          {artist.years} · {artist.nationality}
                        </p>
                      </div>
                      <button
                        onClick={() => setArtist(null)}
                        className="shrink-0 text-[11px] text-white/40 hover:text-white/80 transition whitespace-nowrap"
                      >
                        Back to era ✕
                      </button>
                    </div>
                    <p className="text-[13.5px] text-slate-300/85 leading-relaxed mt-3">{artist.bio}</p>

                    {artist.works.length > 1 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {artist.works.map((w, i) => {
                          const on = i === workIndex
                          return (
                            <button
                              key={w.title}
                              onClick={() => {
                                setHeroFlipped(false)
                                setWorkIndex(i)
                              }}
                              aria-pressed={on}
                              className="text-[11.5px] px-3 py-1.5 rounded-full border transition"
                              style={{
                                borderColor: on ? `${era.theme.accent}88` : 'rgba(255,255,255,0.09)',
                                background: on ? `${era.theme.accent}1a` : 'transparent',
                                color: on ? era.theme.accent : 'rgba(255,255,255,0.6)',
                              }}
                            >
                              {w.title}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Big frame - shows the era hero, or the selected artist's work.
              Flips to reveal the factoid when one exists. */}
          <div className="relative lg:sticky lg:top-24">
            <div
              className="relative w-full"
              style={{ perspective: '1600px' }}
              onMouseEnter={() => display.factoid && setHeroFlipped(true)}
              onMouseLeave={() => display.factoid && setHeroFlipped(false)}
            >
              <motion.button
                key={display.key}
                initial={{ opacity: 0, scale: reduced ? 1 : 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                type="button"
                disabled={!display.factoid}
                onClick={() => display.factoid && setHeroFlipped((f) => !f)}
                aria-label={display.factoid ? `${display.title} - reveal detail` : display.title}
                aria-pressed={heroFlipped}
                className="relative block w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:cursor-default"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* The flip lives on this inner layer: Framer animates the
                    button's own transform, and would overwrite a rotateY set
                    there. */}
                <span
                  className="absolute inset-0"
                  style={{
                    transformStyle: 'preserve-3d',
                    transition: reduced ? 'none' : 'transform 700ms cubic-bezier(0.22,1,0.36,1)',
                    transform: heroFlipped ? 'rotateY(180deg)' : 'none',
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 bg-black/50"
                    style={{ backfaceVisibility: 'hidden', boxShadow: `0 30px 90px -20px ${era.theme.glow}` }}
                  >
                    {/* Blurred fill behind, whole painting contained in front -
                        never crop the artwork. */}
                    <span
                      aria-hidden
                      className="absolute inset-0 scale-110 blur-2xl opacity-45"
                      style={{ backgroundImage: `url(${display.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                    <ArtImage
                      key={display.imageUrl}
                      src={display.imageUrl}
                      alt={`${display.title} - ${display.caption}`}
                      className="relative w-full h-full object-contain"
                      eager={index === 0}
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5 pt-14 text-left">
                      <span className="block text-lg font-semibold text-white leading-tight">{display.title}</span>
                      <span className="block text-[13px] text-white/60 mt-1">{display.caption}</span>
                    </span>
                    {display.factoid && (
                      <span
                        aria-hidden
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide backdrop-blur"
                        style={{ background: `${era.theme.accent}22`, color: era.theme.accent, border: `1px solid ${era.theme.accent}55` }}
                      >
                        DID YOU KNOW?
                      </span>
                    )}
                  </span>

                  <span
                    className="absolute inset-0 rounded-2xl overflow-hidden border p-7 sm:p-9 flex flex-col justify-center bg-[#07070d]/96 text-left"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderColor: `${era.theme.accent}55` }}
                  >
                    <span className="block text-[10px] uppercase tracking-[0.22em] mb-4" style={{ color: era.theme.accent }}>
                      Did you know?
                    </span>
                    <span className="block text-white/85 leading-relaxed text-[15px] sm:text-base">
                      {display.factoid}
                    </span>
                    <span className="block mt-6 text-[11px] text-white/35">
                      {display.title}
                      {display.sourceCredit && <span className="block mt-1">{display.sourceCredit}</span>}
                    </span>
                  </span>
                </span>
              </motion.button>
            </div>

            {display.sourceCredit && (
              <a
                href={display.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-[11px] text-white/35 hover:text-white/70 transition"
              >
                {display.sourceCredit} ↗
              </a>
            )}

            {/* Step into the era. This is the whole point of the page, so it gets
                the weight of a door rather than a footnote: era-tinted glow, a
                light sweep on hover, and the collection's size stated up front. */}
            <Link
              to={`/art-timeline/${era.id}`}
              className="group relative mt-6 block w-full overflow-hidden rounded-2xl border transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              style={{
                borderColor: `${era.theme.accent}66`,
                background: `linear-gradient(135deg, ${era.theme.accent}1f 0%, ${era.theme.accent}08 55%, transparent 100%)`,
                boxShadow: `0 0 0 1px ${era.theme.accent}14, 0 18px 50px -22px ${era.theme.glow}`,
              }}
            >
              {/* Light raking across the surface, the way a gallery lights a door. */}
              {!reduced && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-18deg] transition-all duration-[900ms] ease-out group-hover:left-[130%]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${era.theme.accent}2e, transparent)`,
                  }}
                />
              )}

              <span className="relative flex items-center gap-5 px-6 py-5 sm:px-7 sm:py-6">
                <span className="min-w-0 flex-1 text-left">
                  <span
                    className="block font-mono text-[10px] uppercase tracking-[0.24em] mb-2"
                    style={{ color: era.theme.accent }}
                  >
                    Enter the gallery
                  </span>
                  <span className="block text-xl sm:text-2xl font-semibold text-white leading-tight">
                    Step inside {era.name}
                  </span>
                  <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-white/50">
                    <span className="tabular-nums">
                      <strong className="font-semibold text-white/80">{era.keyArtists.length}</strong> artists
                    </span>
                    <span aria-hidden style={{ color: `${era.theme.accent}66` }}>
                      ◆
                    </span>
                    <span className="tabular-nums">
                      <strong className="font-semibold text-white/80">
                        {era.keyArtists.reduce((n, a) => n + a.works.length, 0)}
                      </strong>{' '}
                      works
                    </span>
                    <span aria-hidden style={{ color: `${era.theme.accent}66` }}>
                      ◆
                    </span>
                    <span>the full story</span>
                  </span>
                </span>

                {/* Arrow in a ring that fills on hover. */}
                <span
                  aria-hidden
                  className="relative shrink-0 grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border transition-all duration-500 group-hover:scale-105"
                  style={{
                    borderColor: `${era.theme.accent}77`,
                    background: `${era.theme.accent}14`,
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: era.theme.accent }}
                  />
                  {/* Two arrows crossfade: an inline `color` would beat any
                      hover class, so swap opacity instead of colour. */}
                  <span className="relative text-xl transition-transform duration-500 group-hover:translate-x-0.5">
                    <span
                      className="block transition-opacity duration-500 group-hover:opacity-0"
                      style={{ color: era.theme.accent }}
                    >
                      →
                    </span>
                    <span className="absolute inset-0 grid place-items-center text-black opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      →
                    </span>
                  </span>
                </span>
              </span>
            </Link>

            {/* Still in copyright - described here, viewable at the holding museum. */}
            {era.offsiteWorks && era.offsiteWorks.length > 0 && (
              <div className="mt-8 rounded-xl border border-white/[0.09] bg-white/[0.02] p-5">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
                  Still in copyright
                </h4>
                <p className="text-[11.5px] text-white/35 mb-4 leading-relaxed">
                  We can’t reproduce these here - view them at the museums that hold them.
                </p>
                <ul className="space-y-3">
                  {era.offsiteWorks.map((w) => (
                    <li key={w.title}>
                      <a
                        href={w.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-lg border border-white/[0.07] hover:border-white/20 bg-black/20 p-3.5 transition"
                      >
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="text-[13.5px] font-medium text-white/85 group-hover:text-white">
                            {w.title}
                          </span>
                          <span className="font-mono text-[10.5px] text-white/35 shrink-0">{w.year}</span>
                        </span>
                        <span className="block text-[11.5px] mt-0.5" style={{ color: era.theme.accent }}>
                          {w.artist}
                        </span>
                        <span className="block text-[12px] text-white/50 leading-relaxed mt-1.5">{w.note}</span>
                        <span className="block text-[10.5px] text-white/30 mt-2 group-hover:text-white/50 transition">
                          {w.holder} ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */
export default function ArtTimeline() {
  const [active, setActive] = useState(0)
  const prefersReduced = useReducedMotion()
  const reduced = Boolean(prefersReduced)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 })

  const handleActive = useCallback((i: number) => setActive((cur) => (cur === i ? cur : i)), [])

  const activeEra = eras[active]
  const accent = activeEra.theme.accent

  const jump = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    // Centring a scene taller than the viewport pushes its heading up under the
    // fixed back-button, so anchor tall scenes to the top instead.
    const block = el.offsetHeight > window.innerHeight ? 'start' : 'center'
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block })
  }

  useEffect(() => {
    const prevTitle = document.title
    document.title = 'The Art Timeline - 40,000 Years of Art | Vattitude'
    return () => {
      document.title = prevTitle
    }
  }, [])

  const eraList = useMemo(() => eras, [])

  return (
    <GildedFrame accent={accent}>
    <div className="relative bg-[#050810] min-h-screen">
      {/* Scroll progress bar - sits just inside the frame's top rail. */}
      <motion.div
        aria-hidden
        className="fixed left-0 right-0 h-[2px] z-[70] origin-left top-0 sm:top-[30px]"
        style={{ scaleX: progress, background: accent, transition: 'background 600ms ease' }}
      />

      {/* Back link */}
      <a
        href="/#portfolio"
        className="fixed top-4 left-4 sm:top-8 sm:left-8 z-[85] inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] bg-black/70 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Portfolio
      </a>

      {/* Intro */}
      <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 45%, #1e293b66 0%, #05081000 70%)' }}
        />

        {/* Fanned collage of every era's hero artwork, drawn from the data so it
            stays in step if an era is added. Decorative: the same images all
            appear again, captioned, in the scenes below. */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[62vh] flex items-end justify-center pointer-events-none">
          <div className="relative w-[min(92vw,1100px)] h-[min(52vh,440px)] translate-y-[26%]">
            {eraList.map((era, i) => {
              const mid = (eraList.length - 1) / 2
              const off = i - mid // -3.5 … +3.5
              // Outer cards recede slightly, so the eye settles at the centre.
              const rest = 0.9 - Math.abs(off) * 0.07
              return (
                <motion.div
                  key={era.id}
                  className="absolute top-1/2 left-1/2 w-[26%] max-w-[210px] aspect-[3/4] rounded-lg overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10"
                  initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: rest, scale: 1 }}
                  transition={{ delay: reduced ? 0 : 0.15 + i * 0.09, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    // Fan out from centre, tilting and dipping toward the edges.
                    x: `calc(-50% + ${off * 11}vw)`,
                    y: `calc(-50% + ${Math.abs(off) * 14}px)`,
                    rotate: off * 5,
                    zIndex: 10 - Math.round(Math.abs(off)),
                  }}
                >
                  <img
                    src={era.heroArtwork.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(180deg, ${era.theme.gradientFrom}22 0%, #050810cc 100%)` }}
                  />
                </motion.div>
              )
            })}
            {/* Fade the fan into the background at its top edge, where the copy
                sits, and again at the very bottom so it dissolves into the page
                rather than ending on a hard line. */}
            <div
              className="absolute -inset-x-[30%] -top-[55%] bottom-0"
              style={{
                background:
                  'linear-gradient(180deg, #050810 0%, #050810e0 38%, #05081066 58%, #05081000 78%)',
              }}
            />
          </div>
        </div>

        <div className="relative">
          <p className="font-mono text-xs tracking-[0.3em] text-white/40 mb-6">40,000 BCE - TODAY</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.04] mb-6">
            The Art{' '}
            <span className="bg-gradient-to-r from-amber-300 via-rose-400 to-violet-400 bg-clip-text text-transparent">
              Timeline
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Eight ages of human image-making, from firelit cave walls to a hundred million
            porcelain seeds. Scroll to travel forward - or tap any artist to go deeper.
          </p>
          <button
            onClick={() => jump(eras[0].id)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.06] border border-white/15 text-white/85 hover:bg-white/[0.12] transition"
          >
            Begin
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </header>

      {/* Scenes */}
      <main>
        {eraList.map((era, i) => (
          <EraScene
            key={era.id}
            era={era}
            index={i}
            onActive={handleActive}
            reduced={reduced}
          />
        ))}
      </main>

      {/* Desktop rail */}
      <nav
        aria-label="Timeline navigation"
        className="hidden lg:flex fixed right-12 top-1/2 -translate-y-1/2 z-[85] flex-col gap-1"
      >
        {eraList.map((era, i) => {
          const on = i === active
          return (
            <button
              key={era.id}
              onClick={() => jump(era.id)}
              aria-current={on ? 'true' : undefined}
              className="group flex items-center gap-3 justify-end py-1.5"
            >
              <span
                className={`text-[12px] whitespace-nowrap transition-all duration-300 ${
                  on ? 'opacity-100' : 'opacity-0 group-hover:opacity-70 translate-x-1 group-hover:translate-x-0'
                }`}
                style={{ color: on ? era.theme.accent : '#ffffff' }}
              >
                {era.shortName}
              </span>
              <span
                className="rounded-full transition-all duration-300 shrink-0"
                style={{
                  width: on ? 11 : 7,
                  height: on ? 11 : 7,
                  background: on ? era.theme.accent : 'rgba(255,255,255,0.28)',
                  boxShadow: on ? `0 0 14px ${era.theme.accent}` : 'none',
                }}
              />
            </button>
          )
        })}
      </nav>

      {/* Mobile bottom bar */}
      <nav
        aria-label="Timeline navigation"
        className="lg:hidden fixed bottom-0 sm:bottom-[30px] inset-x-0 sm:inset-x-[30px] z-[85] bg-black/80 backdrop-blur-xl border-t border-white/10"
      >
        <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {eraList.map((era, i) => {
            const on = i === active
            return (
              <button
                key={era.id}
                onClick={() => jump(era.id)}
                aria-current={on ? 'true' : undefined}
                className="shrink-0 px-3.5 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-all duration-300 border"
                style={{
                  color: on ? era.theme.accent : 'rgba(255,255,255,0.55)',
                  borderColor: on ? `${era.theme.accent}66` : 'rgba(255,255,255,0.1)',
                  background: on ? `${era.theme.accent}1a` : 'transparent',
                }}
              >
                {era.shortName}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Footer / attribution */}
      <footer className="relative py-20 pb-32 lg:pb-20 px-6 text-center border-t border-white/[0.06]">
        <p className="text-white/40 text-sm max-w-xl mx-auto leading-relaxed">
          All artworks shown are in the public domain, sourced and verified via Wikimedia Commons.
          Some 20th-century works remain under copyright and are intentionally not reproduced here.
        </p>
        <a href="/" className="inline-block mt-6 text-[13px] text-white/50 hover:text-white transition">
          ← Back to Vattitude
        </a>
      </footer>
    </div>
    </GildedFrame>
  )
}
