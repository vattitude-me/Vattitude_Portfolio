import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { eras, type Era, type Artist, type Artwork } from '../data/artEras'

/* ------------------------------------------------------------------ *
 * Image with graceful fallback — never render a blank frame.
 * ------------------------------------------------------------------ */
function ArtImage({
  src,
  alt,
  className,
  eager = false,
}: {
  src: string
  alt: string
  className?: string
  eager?: boolean
}) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  return (
    <span className="relative block w-full h-full overflow-hidden">
      {status !== 'ok' && (
        <span
          aria-hidden
          className={`absolute inset-0 bg-gradient-to-br from-white/[0.07] to-white/[0.02] ${
            status === 'loading' ? 'animate-pulse' : ''
          }`}
        />
      )}
      {status === 'error' ? (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <svg className="w-7 h-7 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16v12H4z"
            />
          </svg>
          <span className="text-[11px] leading-snug text-white/40">{alt}</span>
        </span>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setStatus('ok')}
          onError={() => setStatus('error')}
          className={`${className ?? ''} ${status === 'ok' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
        />
      )}
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Flip card — factoid on the back.
 * ------------------------------------------------------------------ */
function WorkCard({ work, accent }: { work: Artwork; accent: string }) {
  const [flipped, setFlipped] = useState(false)
  const canFlip = Boolean(work.factoid)

  return (
    <div className="w-full">
      <div
        className="relative w-full aspect-[4/5]"
        style={{ perspective: '1200px' }}
        onMouseEnter={() => canFlip && setFlipped(true)}
        onMouseLeave={() => canFlip && setFlipped(false)}
      >
        <button
          type="button"
          disabled={!canFlip}
          aria-label={canFlip ? `${work.title} — reveal detail` : work.title}
          aria-pressed={flipped}
          onClick={() => canFlip && setFlipped((f) => !f)}
          className="relative block w-full h-full rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:cursor-default"
          style={{ transformStyle: 'preserve-3d', transition: 'transform 600ms cubic-bezier(0.22,1,0.36,1)', transform: flipped ? 'rotateY(180deg)' : 'none' }}
        >
          {/* Front */}
          <span
            className="absolute inset-0 rounded-xl overflow-hidden border border-white/10 bg-black/40"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span
              aria-hidden
              className="absolute inset-0 scale-110 blur-xl opacity-40"
              style={{ backgroundImage: `url(${work.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <ArtImage
              src={work.imageUrl}
              alt={`${work.title}, ${work.year}`}
              className="relative w-full h-full object-contain"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3">
              <span className="block text-[13px] font-medium text-white leading-tight">{work.title}</span>
              <span className="block text-[11px] text-white/50 mt-0.5">{work.year}</span>
            </span>
            {canFlip && (
              <span
                aria-hidden
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold backdrop-blur"
                style={{ background: `${accent}26`, color: accent, border: `1px solid ${accent}59` }}
              >
                i
              </span>
            )}
          </span>

          {/* Back */}
          <span
            className="absolute inset-0 rounded-xl overflow-hidden border p-4 flex items-center bg-[#0a0a12]/95"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderColor: `${accent}59` }}
          >
            <span className="block text-[12.5px] leading-relaxed text-white/80">{work.factoid}</span>
          </span>
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Artist detail modal.
 * ------------------------------------------------------------------ */
function ArtistModal({ artist, accent, onClose }: { artist: Artist; accent: string; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const items = panelRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      )
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('button')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} aria-hidden />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={artist.name}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border bg-[#08080f]/95 backdrop-blur-xl"
        style={{ borderColor: `${accent}40`, boxShadow: `0 0 80px ${accent}22` }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.12] transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <div className="relative w-full sm:w-40 shrink-0 aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
              <span
                aria-hidden
                className="absolute inset-0 scale-110 blur-xl opacity-40"
                style={{ backgroundImage: `url(${artist.portraitUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <ArtImage src={artist.portraitUrl} alt={artist.name} className="relative w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">{artist.name}</h3>
              <p className="font-mono text-sm mb-4" style={{ color: accent }}>
                {artist.years} · {artist.nationality}
              </p>
              <p className="text-slate-300 leading-relaxed text-[15px]">{artist.bio}</p>
            </div>
          </div>

          <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-4">
            Selected Works{artist.works.some((w) => w.factoid) && ' — tap a card for the story'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {artist.works.map((w) => (
              <WorkCard key={w.title} work={w} accent={accent} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ *
 * One era scene. The "bulge": scenes fade + recede toward viewport edges.
 * ------------------------------------------------------------------ */
function EraScene({
  era,
  index,
  onArtist,
  onActive,
  reduced,
}: {
  era: Era
  index: number
  onArtist: (a: Artist) => void
  onActive: (i: number) => void
  reduced: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const [bulge, setBulge] = useState(0) // 1 = centred, 0 = at edge
  const [heroFlipped, setHeroFlipped] = useState(false)

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
      // viewport coverage instead — otherwise they'd stay permanently blurred.
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
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
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

            <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">Key Artists</h3>
            <div className="flex flex-wrap gap-2.5">
              {era.keyArtists.map((a) => (
                <button
                  key={a.name}
                  onClick={() => onArtist(a)}
                  className="group flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  style={{ transitionProperty: 'background, border-color, transform' }}
                >
                  <span className="w-8 h-8 rounded-full overflow-hidden border border-white/15 shrink-0">
                    <ArtImage src={a.portraitUrl} alt={a.name} className="w-full h-full object-cover object-top" />
                  </span>
                  <span className="text-[13.5px] text-white/80 group-hover:text-white whitespace-nowrap">{a.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hero artwork — flips to reveal the factoid */}
          <div className="relative">
            <div
              className="relative w-full"
              style={{ perspective: '1600px' }}
              onMouseEnter={() => setHeroFlipped(true)}
              onMouseLeave={() => setHeroFlipped(false)}
            >
              <button
                type="button"
                onClick={() => setHeroFlipped((f) => !f)}
                aria-label={`${era.heroArtwork.title} — reveal detail`}
                aria-pressed={heroFlipped}
                className="relative block w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 700ms cubic-bezier(0.22,1,0.36,1)',
                  transform: heroFlipped ? 'rotateY(180deg)' : 'none',
                }}
              >
                <span
                  className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 bg-black/50"
                  style={{ backfaceVisibility: 'hidden', boxShadow: `0 30px 90px -20px ${era.theme.glow}` }}
                >
                  {/* Blurred fill behind, whole painting contained in front —
                      never crop the artwork. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 scale-110 blur-2xl opacity-45"
                    style={{ backgroundImage: `url(${era.heroArtwork.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  />
                  <ArtImage
                    src={era.heroArtwork.imageUrl}
                    alt={`${era.heroArtwork.title} by ${era.heroArtwork.artist}, ${era.heroArtwork.year}`}
                    className="relative w-full h-full object-contain"
                    eager={index === 0}
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5 pt-14 text-left">
                    <span className="block text-lg font-semibold text-white leading-tight">{era.heroArtwork.title}</span>
                    <span className="block text-[13px] text-white/60 mt-1">
                      {era.heroArtwork.artist} · {era.heroArtwork.year}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide backdrop-blur"
                    style={{ background: `${era.theme.accent}22`, color: era.theme.accent, border: `1px solid ${era.theme.accent}55` }}
                  >
                    DID YOU KNOW?
                  </span>
                </span>

                <span
                  className="absolute inset-0 rounded-2xl overflow-hidden border p-7 sm:p-9 flex flex-col justify-center bg-[#07070d]/96 text-left"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderColor: `${era.theme.accent}55` }}
                >
                  <span className="block text-[10px] uppercase tracking-[0.22em] mb-4" style={{ color: era.theme.accent }}>
                    Did you know?
                  </span>
                  <span className="block text-white/85 leading-relaxed text-[15px] sm:text-base">
                    {era.heroArtwork.factoid}
                  </span>
                  <span className="block mt-6 text-[11px] text-white/35">{era.heroArtwork.title}</span>
                </span>
              </button>
            </div>

            <a
              href={era.heroArtwork.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-[11px] text-white/35 hover:text-white/70 transition"
            >
              {era.heroArtwork.sourceCredit} ↗
            </a>

            {/* Still in copyright — described here, viewable at the holding museum. */}
            {era.offsiteWorks && era.offsiteWorks.length > 0 && (
              <div className="mt-8 rounded-xl border border-white/[0.09] bg-white/[0.02] p-5">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
                  Still in copyright
                </h4>
                <p className="text-[11.5px] text-white/35 mb-4 leading-relaxed">
                  We can’t reproduce these here — view them at the museums that hold them.
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
  const [artist, setArtist] = useState<Artist | null>(null)
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
    document.title = 'The Art Timeline — 40,000 Years of Art | Vattitude'
    return () => {
      document.title = prevTitle
    }
  }, [])

  const eraList = useMemo(() => eras, [])

  return (
    <div className="relative bg-[#050810] min-h-screen">
      {/* Scroll progress bar */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 right-0 h-[2px] z-[70] origin-left"
        style={{ scaleX: progress, background: accent, transition: 'background 600ms ease' }}
      />

      {/* Back link */}
      <a
        href="/#portfolio"
        className="fixed top-4 left-4 z-[65] inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] bg-black/70 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Portfolio
      </a>

      {/* Intro */}
      <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 45%, #1e293b66 0%, #05081000 70%)' }}
        />
        <div className="relative">
          <p className="font-mono text-xs tracking-[0.3em] text-white/40 mb-6">40,000 BCE — 1950 CE</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.04] mb-6">
            The Art{' '}
            <span className="bg-gradient-to-r from-amber-300 via-rose-400 to-violet-400 bg-clip-text text-transparent">
              Timeline
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Seven ages of human image-making, from firelit cave walls to the empty diner at midnight.
            Scroll to travel forward — or tap any artist to go deeper.
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
            onArtist={setArtist}
            onActive={handleActive}
            reduced={reduced}
          />
        ))}
      </main>

      {/* Desktop rail */}
      <nav
        aria-label="Timeline navigation"
        className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-[60] flex-col gap-1"
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
        className="lg:hidden fixed bottom-0 inset-x-0 z-[60] bg-black/80 backdrop-blur-xl border-t border-white/10"
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

      <AnimatePresence>
        {artist && <ArtistModal artist={artist} accent={accent} onClose={() => setArtist(null)} />}
      </AnimatePresence>
    </div>
  )
}
