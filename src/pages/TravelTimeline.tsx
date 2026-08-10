import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useSocialMeta } from '../hooks/useSocialMeta'
import {
  type TravelDestination,
  loadDestinations,
  saveDestinations,
  exportJSON,
  mergeImport,
  landmarkFor,
  realPhotos,
  sortByDate,
} from '../data/travelData'

const FLAGS: Record<string, string> = {
  'United States': '🇺🇸',
  Canada: '🇨🇦',
  Peru: '🇵🇪',
  Mexico: '🇲🇽',
  'United Arab Emirates': '🇦🇪',
  France: '🇫🇷',
  Netherlands: '🇳🇱',
  Brazil: '🇧🇷',
  Italy: '🇮🇹',
  Egypt: '🇪🇬',
  Philippines: '🇵🇭',
  Japan: '🇯🇵',
  'South Korea': '🇰🇷',
  Iceland: '🇮🇸',
}
const flag = (c: string) => FLAGS[c] ?? '🌍'

/** Trailing 4-digit year, used for the rail markers and past/upcoming split. */
function yearOf(date: string): string {
  const m = date.match(/(\d{4})\s*$/) ?? date.match(/(\d{4})/)
  return m ? m[1] : '—'
}

/** "May 2024" -> "May", "May – June 2023" -> "May – Jun", "Spring 2026" -> "Spring" */
function monthOf(date: string): string {
  const withoutYear = date.replace(/\s*\d{4}\s*$/, '').trim()
  return withoutYear || yearOf(date)
}

const NOW_YEAR = new Date().getFullYear()

const ADMIN_KEY = 'travel_timeline_admin'

/**
 * Share text for this route. scripts/prerender-social.mjs writes the same
 * strings into dist/travel-timeline/index.html, which is what LinkedIn,
 * WhatsApp and other crawlers actually read — keep the two in sync.
 */
export const TRAVEL_META = {
  title: 'Travel Timeline — 25 Trips Across 14 Countries | Vattitude',
  description:
    'A scroll-through map of where I have been and where I am headed — 25 trips across 14 countries, from Las Vegas in 2021 to Iceland in 2026. Photos, dates, and landmarks along one continuous timeline.',
  url: 'https://vattitude.ca/travel-timeline',
  image: 'https://vattitude.ca/travel-timeline-preview.jpg',
}

/* ------------------------------------------------------------------ *
 * Image with landmark fallback. Personal photos win; otherwise the
 * locally hosted city landmark carries the card.
 * ------------------------------------------------------------------ */
function CardImage({
  src,
  alt,
  eager,
  className = '',
}: {
  src: string | null
  alt: string
  eager?: boolean
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div
        className={`w-full h-full bg-[#12161d] ${className}`}
        style={{
          backgroundImage:
            'radial-gradient(120% 80% at 30% 0%, rgba(94,234,212,0.10), transparent 60%), radial-gradient(100% 90% at 90% 100%, rgba(56,189,248,0.08), transparent 55%)',
        }}
        aria-hidden
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  )
}

/* ------------------------------------------------------------------ *
 * One destination = one row on the spine. The rail is drawn by each
 * row's own left border, so consecutive rows form one unbroken line
 * with no gaps between entries.
 * ------------------------------------------------------------------ */
function TimelineRow({
  dest,
  index,
  isAdmin,
  showYear,
  onActive,
  onOpen,
  onEdit,
}: {
  dest: TravelDestination
  index: number
  isAdmin: boolean
  showYear: boolean
  onActive: (i: number) => void
  onOpen: (d: TravelDestination) => void
  onEdit: (d: TravelDestination) => void
}) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) onActive(index)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index, onActive])

  const photos = realPhotos(dest)
  const landmark = landmarkFor(dest)
  const hero = photos[0] ?? landmark
  const extras = photos.slice(1, 3)
  const usingLandmark = photos.length === 0
  const upcoming = Number(yearOf(dest.date)) > NOW_YEAR

  return (
    <section ref={ref} id={`dest-${dest.id}`} className="relative">
      {/* Year marker straddling the rail, shown when the year changes */}
      {showYear && (
        <div className="relative pl-[4.5rem] sm:pl-28 md:pl-36">
          <div className="absolute left-[3.5rem] sm:left-[5.5rem] md:left-[7.5rem] top-0 bottom-0 w-px bg-white/10" />
          <div className="relative py-5">
            <span className="absolute -left-[1.05rem] sm:-left-[1.3rem] top-1/2 -translate-y-1/2 -translate-x-1/2 text-[13px] font-mono tabular-nums text-teal-300/90 bg-[#0b0e13] px-2 py-0.5">
              {yearOf(dest.date)}
            </span>
          </div>
        </div>
      )}

      <div className="relative pl-[4.5rem] sm:pl-28 md:pl-36 pr-4 sm:pr-6 md:pr-10">
        {/* The rail itself — one segment per row, butted together */}
        <div className="absolute left-[3.5rem] sm:left-[5.5rem] md:left-[7.5rem] top-0 bottom-0 w-px bg-white/10" />

        {/* Date on the left of the rail */}
        <div className="absolute left-0 top-6 w-[3rem] sm:w-[4.75rem] md:w-[6.75rem] text-right pr-3">
          <span className="block text-[11px] sm:text-xs text-white/45 leading-tight">
            {monthOf(dest.date)}
          </span>
          <span className="block text-[10px] sm:text-[11px] font-mono tabular-nums text-white/25 mt-0.5">
            {yearOf(dest.date)}
          </span>
        </div>

        {/* Node on the rail */}
        <span
          className={`absolute left-[3.5rem] sm:left-[5.5rem] md:left-[7.5rem] top-[1.9rem] -translate-x-1/2 w-[9px] h-[9px] rounded-full ring-4 ring-[#0b0e13] ${
            upcoming ? 'bg-teal-300/40' : 'bg-teal-300'
          }`}
          aria-hidden
        />

        {/* Card */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="py-3"
        >
          <div className="group relative rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16] transition-colors">
            <button
              type="button"
              onClick={() => onOpen(dest)}
              className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/60"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative w-full sm:w-[46%] md:w-[42%] h-40 sm:h-auto sm:min-h-[10.5rem] shrink-0 overflow-hidden">
                  <CardImage
                    src={hero}
                    alt={usingLandmark ? `${dest.location} landmark` : `${dest.location} photo`}
                    eager={index < 3}
                    className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#0b0e13]/60" />

                  {extras.length > 0 && (
                    <div className="absolute bottom-2 left-2 flex gap-1.5">
                      {extras.map((p, i) => (
                        <span
                          key={i}
                          className="block w-9 h-9 rounded overflow-hidden ring-1 ring-white/25 shadow-lg"
                        >
                          <CardImage src={p} alt={`${dest.location} photo ${i + 2}`} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 px-5 py-4 sm:py-5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-sm leading-none" aria-hidden>
                      {flag(dest.country)}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      {dest.country}
                    </span>
                    {upcoming && (
                      <span className="text-[9px] uppercase tracking-[0.14em] text-teal-300/90 border border-teal-300/30 bg-teal-300/[0.07] px-1.5 py-0.5 rounded">
                        Planned
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-xl font-semibold text-white leading-snug tracking-tight">
                    {dest.location}
                  </h2>

                  <p className="mt-1.5 text-[13px] text-white/50 font-light">{dest.date}</p>
                </div>
              </div>
            </button>

            {isAdmin && (
              <button
                onClick={() => onEdit(dest)}
                className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-md bg-black/50 backdrop-blur-sm text-white/60 hover:text-teal-300 border border-white/15 transition-colors"
                aria-label={`Edit ${dest.location}`}
                title="Edit this trip"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Lightbox — full view of a destination's photos
 * ------------------------------------------------------------------ */
function Lightbox({ dest, onClose }: { dest: TravelDestination; onClose: () => void }) {
  const photos = realPhotos(dest)
  const landmark = landmarkFor(dest)
  const shots = photos.length ? photos : landmark ? [landmark] : []
  const [i, setI] = useState(0)

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setI((v) => (v + 1) % Math.max(shots.length, 1))
      if (e.key === 'ArrowLeft') setI((v) => (v - 1 + shots.length) % Math.max(shots.length, 1))
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose, shots.length])

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-sm flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="flex items-start justify-between px-5 sm:px-8 py-5 shrink-0">
        <div>
          <h3 className="text-white text-lg sm:text-xl font-semibold">{dest.location}</h3>
          <p className="text-white/50 text-sm mt-0.5">
            {flag(dest.country)} {dest.country} · {dest.date}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-colors shrink-0"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div
        className="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-8 pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        {shots.length > 0 ? (
          <img
            src={shots[i]}
            alt={`${dest.location} ${i + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        ) : (
          <p className="text-white/40 text-sm">No photos yet for this destination.</p>
        )}
      </div>

      {shots.length > 1 && (
        <div className="shrink-0 flex justify-center gap-2 pb-6" onClick={(e) => e.stopPropagation()}>
          {shots.map((p, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              className={`w-14 h-14 rounded overflow-hidden ring-1 transition-all ${
                n === i ? 'ring-teal-300' : 'ring-white/15 opacity-55 hover:opacity-100'
              }`}
            >
              <img src={p} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ *
 * Editor — list first, form last. Editing a trip scrolls the form
 * into view so the click and the fields it fills stay connected.
 * ------------------------------------------------------------------ */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const EMPTY: Omit<TravelDestination, 'id'> = {
  country: '',
  location: '',
  date: '',
  photos: [],
}

function Editor({
  destinations,
  onClose,
  onChange,
  initial,
}: {
  destinations: TravelDestination[]
  onClose: () => void
  onChange: (d: TravelDestination[]) => void
  initial: TravelDestination | null
}) {
  const [editing, setEditing] = useState<TravelDestination | null>(initial)
  const [form, setForm] = useState<Omit<TravelDestination, 'id'>>(
    initial
      ? {
          country: initial.country,
          location: initial.location,
          date: initial.date,
          photos: realPhotos(initial),
        }
      : EMPTY,
  )
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [err, setErr] = useState('')
  const importRef = useRef<HTMLInputElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLInputElement>(null)

  /** Bring the form to the user rather than making them hunt for it. */
  const focusForm = useCallback(() => {
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      locationRef.current?.focus({ preventScroll: true })
    })
  }, [])

  // Opening the editor straight from a card's pencil should land on the form.
  useEffect(() => {
    if (initial) focusForm()
  }, [initial, focusForm])

  const startEdit = (d: TravelDestination) => {
    setEditing(d)
    setForm({ country: d.country, location: d.location, date: d.date, photos: realPhotos(d) })
    setMonth('')
    setYear('')
    setErr('')
    focusForm()
  }

  const reset = () => {
    setEditing(null)
    setForm(EMPTY)
    setMonth('')
    setYear('')
    setErr('')
  }

  // Month + year pickers are a convenience writer into the free-text date
  // field, which still has to accept ranges like "May – June 2023".
  const applyMonthYear = (m: string, y: string) => {
    if (m && y) setForm((f) => ({ ...f, date: `${m} ${y}` }))
    else if (y) setForm((f) => ({ ...f, date: y }))
  }

  const setPhoto = (i: number, val: string) =>
    setForm((f) => {
      const p = [...f.photos]
      p[i] = val
      return { ...f, photos: p }
    })

  const removePhoto = (i: number) =>
    setForm((f) => ({ ...f, photos: f.photos.filter((_, n) => n !== i) }))

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3 - form.photos.length)
    files.forEach((file) => {
      const r = new FileReader()
      r.onload = (ev) =>
        setForm((f) =>
          f.photos.length >= 3 ? f : { ...f, photos: [...f.photos, ev.target?.result as string] },
        )
      r.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const save = () => {
    if (!form.location.trim()) return setErr('Location is required.')
    if (!form.date.trim()) return setErr('Date is required.')
    const clean = { ...form, photos: form.photos.filter((p) => p && p.trim()) }
    onChange(
      editing
        ? destinations.map((d) => (d.id === editing.id ? { ...d, ...clean } : d))
        : [...destinations, { id: String(Date.now()), ...clean }],
    )
    reset()
  }

  const remove = (id: string) => {
    if (!confirm('Delete this destination?')) return
    onChange(destinations.filter((d) => d.id !== id))
    if (editing?.id === id) reset()
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const r = new FileReader()
    r.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string)
        if (!Array.isArray(parsed)) throw new Error()
        const merged = mergeImport(destinations, parsed as TravelDestination[])
        onChange(merged)
        setErr(`Imported ${merged.length - destinations.length} new (duplicates skipped).`)
      } catch {
        setErr('Invalid JSON file.')
      }
    }
    r.readAsText(file)
    e.target.value = ''
  }

  const field =
    'w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-teal-300/50'

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />

      <motion.aside
        className="relative z-10 h-full w-full max-w-md bg-[#0b0e13] border-l border-white/10 overflow-y-auto"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      >
        <div className="sticky top-0 z-20 bg-[#0b0e13] flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold">Trip editor</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                reset()
                focusForm()
              }}
              className="text-[12px] px-2.5 py-1 rounded-md bg-teal-300/10 hover:bg-teal-300/20 text-teal-200 border border-teal-300/25 transition-colors"
            >
              + Add trip
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close editor"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Import / Export */}
        <div className="px-5 py-4 border-b border-white/10 flex gap-2.5">
          <button
            onClick={() => importRef.current?.click()}
            className="flex-1 py-2 rounded-lg text-sm bg-white/[0.05] hover:bg-white/10 text-white/75 border border-white/10 transition-colors"
          >
            Import
          </button>
          <button
            onClick={() => exportJSON(destinations)}
            className="flex-1 py-2 rounded-lg text-sm bg-white/[0.05] hover:bg-white/10 text-white/75 border border-white/10 transition-colors"
          >
            Export
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImport}
          />
        </div>

        {/* List first — this is what you scan, so it comes before the form */}
        <div className="px-5 py-5 border-b border-white/10">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/35 mb-3">
            {destinations.length} trips
          </h3>
          <ul className="space-y-1.5">
            {destinations.map((d) => (
              <li
                key={d.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                  editing?.id === d.id
                    ? 'border-teal-300/40 bg-teal-300/[0.08]'
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
              >
                <span className="shrink-0" aria-hidden>
                  {flag(d.country)}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-white/90 truncate">{d.location}</span>
                  <span className="block text-white/35 text-[11px]">{d.date}</span>
                </span>
                <button
                  onClick={() => startEdit(d)}
                  className="w-7 h-7 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label={`Edit ${d.location}`}
                >
                  ✎
                </button>
                <button
                  onClick={() => remove(d.id)}
                  className="w-7 h-7 rounded text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  aria-label={`Delete ${d.location}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Form last, scrolled to on edit */}
        <div ref={formRef} className="px-5 py-5 space-y-3 scroll-mt-16">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-teal-300/80">
              {editing ? `Editing · ${editing.location}` : 'Add trip'}
            </h3>
            {editing && (
              <button
                onClick={reset}
                className="text-[11px] text-white/40 hover:text-white/80 transition-colors"
              >
                New instead
              </button>
            )}
          </div>

          <div>
            <label className="block text-[11px] text-white/40 mb-1">Location</label>
            <input
              ref={locationRef}
              className={field}
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Paris"
            />
          </div>

          <div>
            <label className="block text-[11px] text-white/40 mb-1">Country</label>
            <input
              className={field}
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              placeholder="France"
            />
          </div>

          <div>
            <label className="block text-[11px] text-white/40 mb-1">Month & year</label>
            <div className="flex gap-2">
              <select
                className={field}
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value)
                  applyMonthYear(e.target.value, year)
                }}
              >
                <option value="">Month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m} className="bg-[#0b0e13]">
                    {m}
                  </option>
                ))}
              </select>
              <select
                className={field}
                value={year}
                onChange={(e) => {
                  setYear(e.target.value)
                  applyMonthYear(month, e.target.value)
                }}
              >
                <option value="">Year</option>
                {Array.from({ length: 16 }, (_, n) => String(NOW_YEAR + 3 - n)).map((y) => (
                  <option key={y} value={y} className="bg-[#0b0e13]">
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <input
              className={`${field} mt-2`}
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              placeholder="May 2024  ·  or a range like May – June 2023"
            />
          </div>

          {/* Photos */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-white/40">Photos (optional · up to 3)</label>
              <button
                onClick={() => uploadRef.current?.click()}
                disabled={form.photos.length >= 3}
                className="text-[11px] text-teal-300 hover:text-teal-200 disabled:text-white/20 disabled:cursor-not-allowed"
              >
                + Upload
              </button>
              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpload}
              />
            </div>

            <div className="space-y-2">
              {form.photos.map((p, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="w-9 h-9 rounded overflow-hidden bg-white/5 shrink-0 ring-1 ring-white/10">
                    {p && <img src={p} alt="" className="w-full h-full object-cover" />}
                  </span>
                  <input
                    className={field}
                    value={p.startsWith('data:') ? '' : p}
                    placeholder={p.startsWith('data:') ? 'Uploaded image' : 'https://…'}
                    disabled={p.startsWith('data:')}
                    onChange={(e) => setPhoto(i, e.target.value)}
                  />
                  <button
                    onClick={() => removePhoto(i)}
                    className="text-white/30 hover:text-red-400 px-1 shrink-0"
                    aria-label="Remove photo"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {form.photos.length < 3 && (
                <button
                  onClick={() => setForm((f) => ({ ...f, photos: [...f.photos, ''] }))}
                  className="w-full py-2 rounded-lg border border-dashed border-white/15 text-[12px] text-white/40 hover:text-white/70 hover:border-white/30 transition-colors"
                >
                  + Add image URL
                </button>
              )}
            </div>

            {form.photos.length === 0 && (
              <p className="text-[11px] text-white/30 mt-2 leading-relaxed">
                No photos? A landmark shot for this location is used automatically.
              </p>
            )}
          </div>

          {err && <p className="text-[12px] text-amber-300/90">{err}</p>}

          <div className="flex gap-2 pt-1">
            <button
              onClick={save}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-teal-300 hover:bg-teal-200 text-[#06131a] transition-colors"
            >
              {editing ? 'Save changes' : 'Add trip'}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white bg-white/[0.05] hover:bg-white/10 transition-colors"
            >
              {editing ? 'Cancel' : 'Clear'}
            </button>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */
export default function TravelTimeline() {
  const [destinations, setDestinations] = useState<TravelDestination[]>(() => loadDestinations())
  const [active, setActive] = useState(0)
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem(ADMIN_KEY) === '1' || window.location.hash === '#admin',
  )
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorSeed, setEditorSeed] = useState<TravelDestination | null>(null)
  const [lightbox, setLightbox] = useState<TravelDestination | null>(null)
  const [progress, setProgress] = useState(0)

  useSocialMeta(TRAVEL_META)

  useEffect(() => {
    saveDestinations(destinations)
  }, [destinations])

  // Admin is hidden by design: no visible affordance. Unlocked by
  // Ctrl+Shift+E or the #admin hash, then remembered on this device.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        setIsAdmin((wasAdmin) => {
          const next = !wasAdmin
          localStorage.setItem(ADMIN_KEY, next ? '1' : '0')
          if (!next) setEditorOpen(false)
          return next
        })
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  useEffect(() => {
    if (window.location.hash === '#admin') localStorage.setItem(ADMIN_KEY, '1')
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

  const handleActive = useCallback((i: number) => setActive(i), [])

  const ordered = useMemo(() => sortByDate(destinations), [destinations])

  const stats = useMemo(
    () => ({
      countries: new Set(ordered.map((d) => d.country)).size,
      years: Array.from(new Set(ordered.map((d) => yearOf(d.date)))),
    }),
    [ordered],
  )

  const activeYear = ordered[active] ? yearOf(ordered[active].date) : ''

  const jumpToYear = (y: string) => {
    const i = ordered.findIndex((d) => yearOf(d.date) === y)
    if (i >= 0)
      document.getElementById(`dest-${ordered[i].id}`)?.scrollIntoView({ behavior: 'smooth' })
  }

  const openEditorFor = (d: TravelDestination) => {
    setEditorSeed(d)
    setEditorOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      {/* Scroll progress hairline */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-teal-300 to-sky-400 z-40 origin-left"
        style={{ width: `${progress * 100}%` }}
      />

      {/* Compact sticky header — no hero */}
      <header className="sticky top-0 z-30 bg-[#0b0e13]/88 backdrop-blur-md border-b border-white/[0.07]">
        <div className="flex items-center justify-between gap-4 px-5 sm:px-8 h-14">
          <Link
            to="/"
            className="group flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors shrink-0"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span>
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="flex items-baseline gap-2.5 min-w-0">
            <h1 className="text-sm font-semibold tracking-tight truncate">Travel</h1>
            <span className="text-[11px] text-white/35 tabular-nums whitespace-nowrap">
              {ordered.length} trips · {stats.countries} countries
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-teal-300/80 tabular-nums w-10 text-right">
              {activeYear}
            </span>
            {/* Only rendered once admin is unlocked — no public entry point */}
            {isAdmin && (
              <button
                onClick={() => {
                  setEditorSeed(null)
                  setEditorOpen(true)
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-teal-300/40 text-teal-300/80 hover:text-teal-200 hover:border-teal-300/70 transition-colors"
                title="Trip editor (Ctrl+Shift+E toggles admin)"
                aria-label="Trip editor"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Year rail — horizontal, doubles as navigation */}
        {stats.years.length > 1 && (
          <div className="flex gap-1 px-5 sm:px-8 pb-2 overflow-x-auto scrollbar-none">
            {stats.years.map((y) => (
              <button
                key={y}
                onClick={() => jumpToYear(y)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono tabular-nums transition-colors shrink-0 ${
                  y === activeYear
                    ? 'bg-teal-300/15 text-teal-200'
                    : 'text-white/30 hover:text-white/70'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* The spine */}
      <main className="pb-4">
        {ordered.map((d, i) => (
          <TimelineRow
            key={d.id}
            dest={d}
            index={i}
            isAdmin={isAdmin}
            showYear={i === 0 || yearOf(d.date) !== yearOf(ordered[i - 1].date)}
            onActive={handleActive}
            onOpen={setLightbox}
            onEdit={openEditorFor}
          />
        ))}

        {ordered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <p className="text-white/40 text-sm">No trips yet.</p>
          </div>
        )}
      </main>

      <footer className="border-t border-white/[0.07] px-5 sm:px-8 py-8 flex flex-wrap items-center justify-between gap-3 text-[12px] text-white/30">
        <Link to="/" className="hover:text-white/60 transition-colors">
          ← Back to Vattitude
        </Link>
        <span>Landmark imagery via Wikimedia Commons</span>
      </footer>

      <AnimatePresence>
        {lightbox && <Lightbox dest={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {editorOpen && isAdmin && (
          <Editor
            destinations={ordered}
            initial={editorSeed}
            onClose={() => {
              setEditorOpen(false)
              setEditorSeed(null)
            }}
            onChange={setDestinations}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
