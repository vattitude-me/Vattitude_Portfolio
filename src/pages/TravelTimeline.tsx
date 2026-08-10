import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  type TravelDestination,
  loadDestinations,
  saveDestinations,
  exportJSON,
  mergeImport,
  landmarkFor,
  realPhotos,
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

/** Trailing 4-digit year, used for the sticky rail and past/upcoming split. */
function yearOf(date: string): string {
  const m = date.match(/(\d{4})\s*$/) ?? date.match(/(\d{4})/)
  return m ? m[1] : '—'
}

const NOW_YEAR = new Date().getFullYear()

/* ------------------------------------------------------------------ *
 * Image with landmark fallback. Personal photos win; otherwise the
 * locally hosted city landmark carries the strip.
 * ------------------------------------------------------------------ */
function StripImage({
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
 * One destination = one full-bleed strip. No gaps, no margins: strips
 * butt directly against each other so the page reads as one ribbon.
 * ------------------------------------------------------------------ */
function Strip({
  dest,
  index,
  onActive,
  onOpen,
}: {
  dest: TravelDestination
  index: number
  onActive: (i: number) => void
  onOpen: (d: TravelDestination) => void
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
  const flip = index % 2 === 1
  const upcoming = Number(yearOf(dest.date)) > NOW_YEAR

  return (
    <section
      ref={ref}
      id={`dest-${dest.id}`}
      className="relative border-t border-white/[0.07] first:border-t-0"
    >
      <button
        type="button"
        onClick={() => onOpen(dest)}
        className="group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/60 focus-visible:-ring-offset-2"
      >
        <div
          className={`relative grid grid-cols-1 md:grid-cols-[1.15fr_1fr] ${
            flip ? 'md:[direction:rtl]' : ''
          }`}
        >
          {/* Image side — fixed band height, edge to edge */}
          <div className="relative h-56 sm:h-64 md:h-[19rem] lg:h-[21rem] overflow-hidden md:[direction:ltr]">
            <motion.div
              className="absolute inset-0"
              initial={reduced ? false : { scale: 1.06, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: reduced ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <StripImage
                src={hero}
                alt={usingLandmark ? `${dest.location} landmark` : `${dest.location} photo`}
                eager={index < 2}
                className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
            </motion.div>

            {/* Legibility wash + seam blend into the text panel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div
              className={`hidden md:block absolute inset-y-0 w-24 ${flip ? 'left-0' : 'right-0'}`}
              style={{
                background: `linear-gradient(to ${flip ? 'right' : 'left'}, #0b0e13, transparent)`,
              }}
            />

            {/* Thumbnails only when the user actually has more photos */}
            {extras.length > 0 && (
              <div className="absolute bottom-3 left-3 flex gap-2 md:[direction:ltr]">
                {extras.map((p, i) => (
                  <span
                    key={i}
                    className="block w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden ring-1 ring-white/25 shadow-lg"
                  >
                    <StripImage src={p} alt={`${dest.location} photo ${i + 2}`} />
                  </span>
                ))}
                {photos.length > 3 && (
                  <span className="self-end text-[11px] text-white/70 pb-1">
                    +{photos.length - 3}
                  </span>
                )}
              </div>
            )}

            {usingLandmark && (
              <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.18em] text-white/55 bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded md:[direction:ltr]">
                Landmark
              </span>
            )}
          </div>

          {/* Text side */}
          <div className="relative flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-14 py-7 md:py-0 bg-[#0b0e13] md:[direction:ltr]">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-base leading-none" aria-hidden>
                {flag(dest.country)}
              </span>
              <span className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                {dest.country}
              </span>
              {upcoming && (
                <span className="text-[10px] uppercase tracking-[0.16em] text-teal-300/90 border border-teal-300/30 bg-teal-300/[0.07] px-1.5 py-0.5 rounded">
                  Planned
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-semibold text-white leading-[1.15] tracking-tight">
              {dest.location}
            </h2>

            <p className="mt-2.5 text-sm text-white/55 font-light tabular-nums">{dest.date}</p>

            <div className="mt-5 flex items-center gap-3">
              <span className="h-px w-8 bg-gradient-to-r from-teal-300/60 to-transparent" />
              <span className="text-[11px] font-mono text-white/25">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </button>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Lightbox — full view of a destination's photos
 * ------------------------------------------------------------------ */
function Lightbox({
  dest,
  onClose,
}: {
  dest: TravelDestination
  onClose: () => void
}) {
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
        <div
          className="shrink-0 flex justify-center gap-2 pb-6"
          onClick={(e) => e.stopPropagation()}
        >
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
 * Editor
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
      ? { country: initial.country, location: initial.location, date: initial.date, photos: realPhotos(initial) }
      : EMPTY,
  )
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [err, setErr] = useState('')
  const importRef = useRef<HTMLInputElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)

  const startEdit = (d: TravelDestination) => {
    setEditing(d)
    setForm({ country: d.country, location: d.location, date: d.date, photos: realPhotos(d) })
    setMonth('')
    setYear('')
    setErr('')
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
        <div className="sticky top-0 z-10 bg-[#0b0e13] flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold">Trip editor</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close editor"
          >
            ✕
          </button>
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
            className="flex-1 py-2 rounded-lg text-sm bg-teal-300/10 hover:bg-teal-300/20 text-teal-200 border border-teal-300/25 transition-colors"
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

        {/* Form */}
        <div className="px-5 py-5 border-b border-white/10 space-y-3">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-teal-300/80">
            {editing ? 'Edit trip' : 'Add trip'}
          </h3>

          <div>
            <label className="block text-[11px] text-white/40 mb-1">Location</label>
            <input
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

        {/* List */}
        <div className="px-5 py-5">
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
                <span className="shrink-0" aria-hidden>{flag(d.country)}</span>
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
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorSeed, setEditorSeed] = useState<TravelDestination | null>(null)
  const [lightbox, setLightbox] = useState<TravelDestination | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    saveDestinations(destinations)
  }, [destinations])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        setEditorSeed(null)
        setEditorOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
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

  const stats = useMemo(
    () => ({
      countries: new Set(destinations.map((d) => d.country)).size,
      years: Array.from(new Set(destinations.map((d) => yearOf(d.date)))),
    }),
    [destinations],
  )

  const activeYear = destinations[active] ? yearOf(destinations[active].date) : ''

  const jumpToYear = (y: string) => {
    const i = destinations.findIndex((d) => yearOf(d.date) === y)
    if (i >= 0)
      document.getElementById(`dest-${destinations[i].id}`)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      {/* Scroll progress hairline */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-teal-300 to-sky-400 z-40 origin-left"
        style={{ width: `${progress * 100}%` }}
      />

      {/* Compact sticky header — replaces the old full-screen hero */}
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
              {destinations.length} trips · {stats.countries} countries
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-teal-300/80 tabular-nums w-10 text-right">
              {activeYear}
            </span>
            <button
              onClick={() => {
                setEditorSeed(null)
                setEditorOpen(true)
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/45 hover:text-teal-300 hover:border-teal-300/40 transition-colors"
              title="Edit trips (Ctrl+Shift+E)"
              aria-label="Edit trips"
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

      {/* The ribbon */}
      <main>
        {destinations.map((d, i) => (
          <Strip key={d.id} dest={d} index={i} onActive={handleActive} onOpen={setLightbox} />
        ))}

        {destinations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <p className="text-white/40 text-sm">No trips yet.</p>
            <button
              onClick={() => setEditorOpen(true)}
              className="text-teal-300 hover:text-teal-200 text-sm underline underline-offset-4"
            >
              Add the first one →
            </button>
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
        {editorOpen && (
          <Editor
            destinations={destinations}
            initial={editorSeed}
            onClose={() => setEditorOpen(false)}
            onChange={setDestinations}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
