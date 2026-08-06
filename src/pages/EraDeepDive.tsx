import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { eras, type Artist, type Artwork } from '../data/artEras'
import GildedFrame from '../components/GildedFrame'
import ArtImage from '../components/ArtImage'

/* ------------------------------------------------------------------ *
 * Era deep dive. Reached from the timeline by clicking through an era's
 * hero painting - the page opens as if stepping into that canvas, so the
 * hero is what animates in first and the frame draws around it.
 * ------------------------------------------------------------------ */

/** One work in the artist's gallery grid. Opens the lightbox on click. */
function WorkTile({
  work,
  artistName,
  accent,
  onOpen,
  reduced,
}: {
  work: Artwork
  artistName: string
  accent: string
  onOpen: () => void
  reduced: boolean
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: reduced ? 0 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group relative text-left rounded-lg overflow-hidden border border-white/10 bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      style={{ aspectRatio: '3 / 4' }}
    >
      <span
        aria-hidden
        className="absolute inset-0 scale-110 blur-xl opacity-40"
        style={{
          backgroundImage: `url(${work.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <ArtImage
        src={work.imageUrl}
        alt={`${work.title} — ${artistName}`}
        className="relative w-full h-full object-contain"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent p-3 pt-10">
        <span className="block text-[12.5px] font-medium text-white leading-tight">
          {work.title}
        </span>
        <span className="block font-mono text-[10.5px] mt-0.5" style={{ color: accent }}>
          {work.year}
        </span>
      </span>
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `inset 0 0 0 2px ${accent}88` }}
      />
    </motion.button>
  )
}

/** Full-bleed view of a single work, with its factoid and museum link. */
function Lightbox({
  work,
  artistName,
  accent,
  onClose,
  onPrev,
  onNext,
  reduced,
  position,
}: {
  work: Artwork
  artistName: string
  accent: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  reduced: boolean
  /** "3 / 7" - where this work sits in the artist's set. */
  position: string
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    // Freeze the page behind the overlay.
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.25 }}
      className="fixed inset-0 z-[95] bg-black/95 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${work.title} by ${artistName}`}
    >
      {/* The painting's own colour, bloomed behind it, so the void reads as a room. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          background: `radial-gradient(ellipse 60% 55% at 45% 45%, ${accent}, transparent 70%)`,
        }}
      />

      {/* Painting fills the height; the caption rail is a fixed column beside it.
          On smaller screens they stack and the whole thing scrolls. */}
      <motion.div
        initial={{ scale: reduced ? 1 : 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full w-full flex flex-col lg:flex-row items-center gap-6 lg:gap-0 overflow-y-auto lg:overflow-hidden p-5 pt-16 lg:p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Canvas side - takes all remaining width and the full viewport height. */}
        <div className="flex-1 min-w-0 w-full flex items-center justify-center lg:h-full lg:p-12 xl:p-16">
          <figure
            className="relative max-w-full max-h-full"
            style={{ filter: 'drop-shadow(0 45px 90px rgba(0,0,0,0.85))' }}
          >
            <img
              src={work.imageUrl}
              alt={`${work.title} — ${artistName}`}
              decoding="async"
              referrerPolicy="no-referrer"
              className="block max-w-full max-h-[60vh] lg:max-h-[calc(100vh-8rem)] w-auto h-auto object-contain rounded-sm"
              style={{ boxShadow: `0 0 0 1px rgba(0,0,0,0.9), 0 0 0 7px ${accent}33` }}
            />
          </figure>
        </div>

        {/* Caption rail - a fixed measure so long factoids never sprawl. */}
        <aside className="w-full lg:w-[min(30vw,400px)] shrink-0 lg:h-full lg:overflow-y-auto flex flex-col text-left px-1 lg:px-10 xl:px-12 lg:pt-24 xl:pt-28 lg:pb-12 lg:border-l border-white/10 lg:bg-white/[0.02]">
          <p className="font-mono text-[11px] tracking-[0.2em] mb-2" style={{ color: accent }}>
            {work.year}
          </p>
          <h3 className="text-2xl xl:text-[27px] font-semibold text-white leading-tight">
            {work.title}
          </h3>
          <p className="text-white/55 text-sm mt-1.5">{artistName}</p>

          {work.factoid && (
            <p className="text-[14.5px] text-slate-300/90 leading-relaxed mt-6 pt-6 border-t border-white/10">
              {work.factoid}
            </p>
          )}

          {work.sourceCredit && (
            <a
              href={work.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 text-[11.5px] text-white/40 hover:text-white/80 transition"
              onClick={(e) => e.stopPropagation()}
            >
              {work.sourceCredit} ↗
            </a>
          )}

          <div className="flex items-center gap-2 mt-8">
            <button
              onClick={onPrev}
              className="px-4 py-2 rounded-full border border-white/15 text-[12px] text-white/70 hover:text-white hover:border-white/35 transition"
            >
              ← Prev
            </button>
            <button
              onClick={onNext}
              className="px-4 py-2 rounded-full border border-white/15 text-[12px] text-white/70 hover:text-white hover:border-white/35 transition"
            >
              Next →
            </button>
            <span className="ml-auto font-mono text-[10.5px] text-white/25 tabular-nums">
              {position}
            </span>
          </div>
        </aside>

        <button
          onClick={onClose}
          aria-label="Close"
          className="fixed top-5 right-5 lg:top-7 lg:right-7 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition backdrop-blur"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
export default function EraDeepDive() {
  const { eraId } = useParams<{ eraId: string }>()
  const prefersReduced = useReducedMotion()
  const reduced = Boolean(prefersReduced)

  const era = eras.find((e) => e.id === eraId)

  // Which artist's gallery is expanded, and which work is in the lightbox.
  const [openArtist, setOpenArtist] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<{ artist: Artist; index: number } | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [eraId])

  useEffect(() => {
    if (!era) return
    const prev = document.title
    document.title = `${era.name} — The Art Timeline | Vattitude`
    return () => {
      document.title = prev
    }
  }, [era])

  if (!era) return <Navigate to="/art-timeline" replace />

  const accent = era.theme.accent
  const index = eras.findIndex((e) => e.id === era.id)
  const prevEra = index > 0 ? eras[index - 1] : null
  const nextEra = index < eras.length - 1 ? eras[index + 1] : null

  const step = (dir: number) => {
    if (!lightbox) return
    const n = lightbox.artist.works.length
    setLightbox({ ...lightbox, index: (lightbox.index + dir + n) % n })
  }

  return (
    <GildedFrame accent={accent}>
      <div className="relative bg-[#050810] min-h-screen">
        {/* Era atmosphere */}
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 75% 50% at 50% 30%, ${era.theme.gradientFrom}44 0%, ${era.theme.gradientTo}00 70%)`,
          }}
        />

        {/* Back to timeline */}
        <Link
          to={`/art-timeline#${era.id}`}
          className="fixed top-8 left-8 z-[85] inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] bg-black/75 backdrop-blur-md border border-white/12 text-white/70 hover:text-white hover:border-white/30 transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Timeline
        </Link>

        {/* ---------- Hero: the painting you stepped into ---------- */}
        <header className="relative min-h-[92vh] flex items-center px-6 sm:px-12 lg:px-20 pt-24 pb-16">
          <div className="relative w-full max-w-[1500px] mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-20 items-center">
            <div>
              <motion.p
                initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.5 }}
                className="font-mono text-xs tracking-[0.28em] text-white/45 mb-5"
              >
                {String(index + 1).padStart(2, '0')} · {era.yearRange}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: reduced ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.06 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.03] mb-5"
              >
                {era.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.14 }}
                className="text-xl italic mb-7"
                style={{ color: accent }}
              >
                {era.tagline}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.2 }}
                className="text-slate-300/90 leading-relaxed text-base max-w-xl"
              >
                {era.description}
              </motion.p>

              <div className="flex flex-wrap gap-2 mt-8">
                {era.characteristics.map((c) => (
                  <span
                    key={c}
                    className="text-[11.5px] px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.09] text-white/60"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* The canvas itself, framed */}
            <motion.figure
              initial={{ opacity: 0, scale: reduced ? 1 : 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* No fixed aspect ratio: the frame takes the painting's own
                  shape, so landscape works don't sit in dead letterbox bars. */}
              <div
                className="relative rounded-lg overflow-hidden border-[3px] bg-black/50"
                style={{
                  borderColor: 'rgba(201,162,39,0.55)',
                  boxShadow: `0 40px 120px -25px ${era.theme.glow}, 0 0 0 1px rgba(0,0,0,0.8)`,
                }}
              >
                <img
                  src={era.heroArtwork.imageUrl}
                  alt={`${era.heroArtwork.title} — ${era.heroArtwork.artist}`}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="block w-full h-auto max-h-[74vh] object-contain mx-auto"
                />
              </div>
              <figcaption className="mt-4">
                <p className="text-white font-medium">{era.heroArtwork.title}</p>
                <p className="text-white/50 text-[13px] mt-0.5">
                  {era.heroArtwork.artist} · {era.heroArtwork.year}
                </p>
                <a
                  href={era.heroArtwork.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-[11px] text-white/35 hover:text-white/70 transition"
                >
                  {era.heroArtwork.sourceCredit} ↗
                </a>
              </figcaption>
            </motion.figure>
          </div>
        </header>

        {/* ---------- Essay ---------- */}
        {era.deepDive?.essay && (
          <section className="relative px-6 sm:px-12 lg:px-20 py-20 border-t border-white/[0.06]">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-[11px] uppercase tracking-[0.24em] text-white/40 mb-8">
                The story
              </h2>
              {era.deepDive.essay.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : i * 0.07 }}
                  className={`text-slate-300/90 leading-[1.85] mb-6 ${
                    i === 0 ? 'text-[19px] text-white/90' : 'text-[16px]'
                  }`}
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </section>
        )}

        {/* ---------- Chronology ---------- */}
        {era.deepDive?.moments && era.deepDive.moments.length > 0 && (
          <section className="relative px-6 sm:px-12 lg:px-20 py-20 border-t border-white/[0.06]">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-[11px] uppercase tracking-[0.24em] text-white/40 mb-10">
                Turning points
              </h2>
              <ol className="relative border-l border-white/12 ml-2">
                {era.deepDive.moments.map((m, i) => (
                  <motion.li
                    key={m.year + m.title}
                    initial={{ opacity: 0, x: reduced ? 0 : -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : i * 0.05 }}
                    className="relative pl-8 pb-10 last:pb-0"
                  >
                    <span
                      className="absolute -left-[6.5px] top-1.5 w-[11px] h-[11px] rounded-full border-2"
                      style={{ background: '#050810', borderColor: accent }}
                    />
                    <p className="font-mono text-[11.5px] mb-1.5" style={{ color: accent }}>
                      {m.year}
                    </p>
                    <p className="text-white font-medium text-[16px]">{m.title}</p>
                    <p className="text-slate-300/80 text-[14.5px] leading-relaxed mt-1.5">
                      {m.detail}
                    </p>
                  </motion.li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* ---------- What to look for ---------- */}
        {era.deepDive?.lookFor && era.deepDive.lookFor.length > 0 && (
          <section className="relative px-6 sm:px-12 lg:px-20 py-20 border-t border-white/[0.06]">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-[11px] uppercase tracking-[0.24em] text-white/40 mb-3">
                What to look for
              </h2>
              <p className="text-white/45 text-[14px] mb-10 max-w-xl">
                How to actually read a work from this era.
              </p>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
                {era.deepDive.lookFor.map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : i * 0.05 }}
                  >
                    <p className="text-white font-medium text-[15.5px] mb-2">
                      <span style={{ color: accent }}>—</span> {l.label}
                    </p>
                    <p className="text-slate-300/80 text-[14.5px] leading-relaxed">{l.detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------- Artists & their galleries ---------- */}
        <section className="relative px-6 sm:px-12 lg:px-20 py-20 border-t border-white/[0.06]">
          <div className="max-w-[1500px] mx-auto">
            <h2 className="text-[11px] uppercase tracking-[0.24em] text-white/40 mb-3">
              The artists
            </h2>
            <p className="text-white/45 text-[14px] mb-12 max-w-xl">
              {era.keyArtists.length} figures who defined the era. Open one to see their work.
            </p>

            <div className="space-y-5">
              {era.keyArtists.map((a) => {
                const open = openArtist === a.name
                return (
                  <div
                    key={a.name}
                    className="rounded-xl border overflow-hidden transition-colors duration-300"
                    style={{
                      borderColor: open ? `${accent}55` : 'rgba(255,255,255,0.09)',
                      background: open ? `${accent}0a` : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <button
                      onClick={() => setOpenArtist(open ? null : a.name)}
                      aria-expanded={open}
                      className="w-full flex items-center gap-5 p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                      <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-white/15 shrink-0">
                        <ArtImage
                          src={a.portraitUrl}
                          alt={a.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-white font-semibold text-[17px]">{a.name}</span>
                        <span className="block font-mono text-[11.5px] mt-0.5" style={{ color: accent }}>
                          {a.years} · {a.nationality}
                        </span>
                        {a.epithet && (
                          <span className="block text-white/50 text-[13px] mt-1.5">{a.epithet}</span>
                        )}
                      </span>
                      <span
                        className="shrink-0 text-white/40 text-[12px] flex items-center gap-2"
                        aria-hidden
                      >
                        {a.works.length} works
                        <span
                          className="inline-block transition-transform duration-300"
                          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
                        >
                          ▾
                        </span>
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-6">
                            <p className="text-slate-300/85 text-[14.5px] leading-relaxed max-w-3xl mb-6">
                              {a.longBio ?? a.bio}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                              {a.works.map((w, wi) => (
                                <WorkTile
                                  key={w.title}
                                  work={w}
                                  artistName={a.name}
                                  accent={accent}
                                  reduced={reduced}
                                  onOpen={() => setLightbox({ artist: a, index: wi })}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ---------- Still in copyright ---------- */}
        {era.offsiteWorks && era.offsiteWorks.length > 0 && (
          <section className="relative px-6 sm:px-12 lg:px-20 py-20 border-t border-white/[0.06]">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-[11px] uppercase tracking-[0.24em] text-white/40 mb-3">
                Still in copyright
              </h2>
              <p className="text-white/45 text-[14px] mb-8">
                We can’t reproduce these here — view them at the museums that hold them.
              </p>
              <ul className="space-y-3">
                {era.offsiteWorks.map((w) => (
                  <li key={w.title}>
                    <a
                      href={w.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-lg border border-white/[0.08] hover:border-white/25 bg-black/25 p-4 transition"
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="text-[14.5px] font-medium text-white/85 group-hover:text-white">
                          {w.title}
                        </span>
                        <span className="font-mono text-[10.5px] text-white/35 shrink-0">{w.year}</span>
                      </span>
                      <span className="block text-[12px] mt-0.5" style={{ color: accent }}>
                        {w.artist}
                      </span>
                      <span className="block text-[13px] text-white/55 leading-relaxed mt-2">
                        {w.note}
                      </span>
                      <span className="block text-[10.5px] text-white/30 mt-2.5 group-hover:text-white/50 transition">
                        {w.holder} ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ---------- Legacy + era-to-era navigation ---------- */}
        <footer className="relative px-6 sm:px-12 lg:px-20 py-20 border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto text-center">
            {era.deepDive?.legacy && (
              <p className="text-slate-300/85 text-[17px] italic leading-relaxed mb-14">
                {era.deepDive.legacy}
              </p>
            )}
          </div>

          <div className="max-w-[1500px] mx-auto grid sm:grid-cols-2 gap-4">
            {prevEra ? (
              <Link
                to={`/art-timeline/${prevEra.id}`}
                className="group rounded-xl border border-white/10 hover:border-white/25 bg-white/[0.02] p-5 transition text-left"
              >
                <span className="block text-[11px] uppercase tracking-[0.2em] text-white/35 mb-1.5">
                  ← Previous era
                </span>
                <span className="block text-white/85 group-hover:text-white font-medium text-[17px] transition">
                  {prevEra.name}
                </span>
                <span className="block font-mono text-[11.5px] text-white/40 mt-0.5">
                  {prevEra.yearRange}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {nextEra && (
              <Link
                to={`/art-timeline/${nextEra.id}`}
                className="group rounded-xl border border-white/10 hover:border-white/25 bg-white/[0.02] p-5 transition text-right sm:col-start-2"
              >
                <span className="block text-[11px] uppercase tracking-[0.2em] text-white/35 mb-1.5">
                  Next era →
                </span>
                <span className="block text-white/85 group-hover:text-white font-medium text-[17px] transition">
                  {nextEra.name}
                </span>
                <span className="block font-mono text-[11.5px] text-white/40 mt-0.5">
                  {nextEra.yearRange}
                </span>
              </Link>
            )}
          </div>

          <p className="text-center text-white/30 text-[12px] mt-14">
            Public-domain works sourced via Wikimedia Commons.
          </p>
        </footer>
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            work={lightbox.artist.works[lightbox.index]}
            artistName={lightbox.artist.name}
            accent={accent}
            reduced={reduced}
            position={`${lightbox.index + 1} / ${lightbox.artist.works.length}`}
            onClose={() => setLightbox(null)}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
          />
        )}
      </AnimatePresence>
    </GildedFrame>
  )
}
