import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion'
import {
  type TravelDestination,
  loadDestinations,
  saveDestinations,
  exportJSON,
  mergeImport,
} from '../data/travelData'

/* ------------------------------------------------------------------ *
 * Country-flag emoji helper (works on all modern OS/browsers)
 * ------------------------------------------------------------------ */
function countryFlag(country: string): string {
  const map: Record<string, string> = {
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
  return map[country] ?? '🌍'
}

/* ------------------------------------------------------------------ *
 * Photo slot — uses Unsplash source as a location-keyed placeholder
 * when no real URL is provided.
 * ------------------------------------------------------------------ */

// Unsplash source API: returns a relevant photo for a given keyword.
// The `sig` param makes each slot request a different image for the same location.
function placeholderUrl(location: string, sig: number): string {
  const keyword = encodeURIComponent(location.split(',')[0].trim())
  return `https://source.unsplash.com/800x600/?${keyword},travel,city&sig=${sig}`
}

function PhotoSlot({
  url,
  index,
  location,
  destSig,
}: {
  url: string
  index: number
  location: string
  destSig: number
}) {
  const isPlaceholder = !url || url === 'photo1_url' || url === 'photo2_url' || url === 'photo3_url'
  const [src, setSrc] = useState(() =>
    isPlaceholder ? placeholderUrl(location, destSig * 3 + index) : url,
  )
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  // When the real URL changes (admin edit), update src
  useEffect(() => {
    const next = isPlaceholder ? placeholderUrl(location, destSig * 3 + index) : url
    setSrc(next)
    setLoaded(false)
    setErrored(false)
  }, [url, location, index, destSig, isPlaceholder])

  if (errored) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      {!loaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse" />
      )}
      <img
        src={src}
        alt={`${location} photo ${index + 1}`}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Staggered 3-photo gallery layout
 * ------------------------------------------------------------------ */
function PhotoGallery({
  photos,
  location,
  destSig,
}: {
  photos: string[]
  location: string
  destSig: number
}) {
  return (
    <div className="relative w-full h-full">
      {/* Main large photo */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <PhotoSlot url={photos[0] ?? ''} index={0} location={location} destSig={destSig} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Two smaller overlapping photos */}
      <motion.div
        className="absolute -bottom-4 -right-4 w-[42%] h-[42%] rounded-xl overflow-hidden shadow-2xl border-2 border-[#0d1829]/80 z-10"
        initial={{ opacity: 0, scale: 0.8, rotate: 3 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <PhotoSlot url={photos[1] ?? ''} index={1} location={location} destSig={destSig} />
      </motion.div>

      <motion.div
        className="absolute -top-4 -right-6 w-[36%] h-[36%] rounded-xl overflow-hidden shadow-2xl border-2 border-[#0d1829]/80 z-10"
        initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -4 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <PhotoSlot url={photos[2] ?? ''} index={2} location={location} destSig={destSig} />
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Single destination section
 * ------------------------------------------------------------------ */
function DestinationCard({
  dest,
  index,
  onVisible,
}: {
  dest: TravelDestination
  index: number
  onVisible: (i: number) => void
}) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0.5) onVisible(index)
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index, onVisible])

  const isEven = index % 2 === 0
  const accent = 'rgb(251 191 36)' // amber-400

  return (
    <section
      ref={ref}
      id={`dest-${dest.id}`}
      className="min-h-screen flex items-center py-20 px-6 md:px-12 lg:px-20 relative"
    >
      {/* Subtle vertical rule on the left */}
      <div
        className="absolute left-6 md:left-12 lg:left-20 top-0 bottom-0 w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(251,191,36,0.2), transparent)' }}
      />

      <div
        className={`w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
          isEven ? '' : 'lg:[direction:rtl]'
        }`}
      >
        {/* Text side */}
        <motion.div
          className="lg:[direction:ltr]"
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduced ? 0 : 0.7, ease: 'easeOut' }}
        >
          {/* Index badge */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-xs font-mono font-bold tracking-[0.3em] px-3 py-1 rounded-full border"
              style={{ color: accent, borderColor: 'rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.06)' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-2xl" role="img" aria-label={dest.country}>
              {countryFlag(dest.country)}
            </span>
            <span className="text-slate-500 text-sm">{dest.country}</span>
          </div>

          {/* Location */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            {dest.location}
          </h2>

          {/* Date */}
          <p
            className="text-lg font-medium mb-8"
            style={{ color: accent }}
          >
            {dest.date}
          </p>

          {/* Decorative divider */}
          <div
            className="w-16 h-0.5 rounded-full"
            style={{ background: 'rgba(251,191,36,0.4)' }}
          />
        </motion.div>

        {/* Photo side */}
        <motion.div
          className="lg:[direction:ltr] relative h-72 md:h-96 lg:h-[420px]"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduced ? 0 : 0.8, ease: 'easeOut', delay: 0.15 }}
        >
          <PhotoGallery photos={dest.photos} location={dest.location} destSig={index} />
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Admin panel — CRUD + Import/Export
 * ------------------------------------------------------------------ */
const EMPTY_DEST: Omit<TravelDestination, 'id'> = {
  country: '',
  location: '',
  date: '',
  photos: ['', '', ''],
}

function AdminPanel({
  destinations,
  onClose,
  onChange,
}: {
  destinations: TravelDestination[]
  onClose: () => void
  onChange: (d: TravelDestination[]) => void
}) {
  const [editing, setEditing] = useState<TravelDestination | null>(null)
  const [form, setForm] = useState<Omit<TravelDestination, 'id'>>(EMPTY_DEST)
  const fileRef = useRef<HTMLInputElement>(null)

  const openNew = () => {
    setEditing(null)
    setForm(EMPTY_DEST)
  }

  const openEdit = (d: TravelDestination) => {
    setEditing(d)
    setForm({ country: d.country, location: d.location, date: d.date, photos: [...d.photos] })
  }

  const handleSave = () => {
    if (!form.location.trim() || !form.date.trim()) return
    let next: TravelDestination[]
    if (editing) {
      next = destinations.map((d) =>
        d.id === editing.id ? { ...editing, ...form } : d,
      )
    } else {
      const newId = String(Date.now())
      next = [...destinations, { id: newId, ...form }]
    }
    onChange(next)
    setEditing(null)
    setForm(EMPTY_DEST)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this destination?')) return
    onChange(destinations.filter((d) => d.id !== id))
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as TravelDestination[]
        onChange(mergeImport(destinations, parsed))
      } catch {
        alert('Invalid JSON file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const photoLabel = ['Photo 1 URL', 'Photo 2 URL', 'Photo 3 URL']

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.aside
        className="relative z-10 h-full w-full max-w-md bg-[#0d1829] border-l border-amber-400/20 overflow-y-auto flex flex-col"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 sticky top-0 bg-[#0d1829] z-10">
          <h2 className="text-white font-bold text-lg">Travel Editor</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Import / Export */}
        <div className="px-6 py-4 border-b border-white/10 flex gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-white/[0.06] hover:bg-white/10 text-slate-300 transition-colors border border-white/10"
          >
            Import JSON
          </button>
          <button
            onClick={() => exportJSON(destinations)}
            className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors border border-amber-400/20"
          >
            Export JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImport}
          />
        </div>

        {/* Form */}
        <div className="px-6 py-5 border-b border-white/10">
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-4">
            {editing ? 'Edit Destination' : 'Add Destination'}
          </h3>

          <div className="space-y-3">
            {(['location', 'country', 'date'] as const).map((field) => (
              <div key={field}>
                <label className="block text-xs text-slate-500 mb-1 capitalize">{field}</label>
                <input
                  type="text"
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50"
                  placeholder={field === 'date' ? 'e.g. May 2024' : ''}
                />
              </div>
            ))}

            {form.photos.map((url, i) => (
              <div key={i}>
                <label className="block text-xs text-slate-500 mb-1">{photoLabel[i]}</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    const p = [...form.photos]
                    p[i] = e.target.value
                    setForm((f) => ({ ...f, photos: p }))
                  }}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50"
                  placeholder="https://..."
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={handleSave}
              className="flex-1 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-colors"
            >
              {editing ? 'Save Changes' : 'Add'}
            </button>
            {editing && (
              <button
                onClick={() => { setEditing(null); setForm(EMPTY_DEST) }}
                className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            )}
            {!editing && (
              <button
                onClick={() => setForm(EMPTY_DEST)}
                className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/10 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Destination list */}
        <div className="px-6 py-5 flex-1">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
            {destinations.length} Destinations
          </h3>
          <ul className="space-y-2">
            {destinations.map((d) => (
              <li
                key={d.id}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                  editing?.id === d.id
                    ? 'border-amber-400/40 bg-amber-500/10'
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{d.location}</p>
                  <p className="text-slate-500 text-xs">{d.date}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(d)}
                    className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs"
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors text-xs"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {destinations.length === 0 && (
            <p className="text-slate-600 text-sm text-center py-8">No destinations yet.</p>
          )}
          {editing && (
            <button
              onClick={openNew}
              className="mt-4 w-full py-2 rounded-lg text-sm text-amber-400 hover:text-amber-300 border border-amber-400/20 hover:border-amber-400/40 transition-colors"
            >
              + New destination
            </button>
          )}
        </div>
      </motion.aside>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ *
 * Main page
 * ------------------------------------------------------------------ */
export default function TravelTimeline() {
  const [destinations, setDestinations] = useState<TravelDestination[]>(() => loadDestinations())
  const [activeIndex, setActiveIndex] = useState(0)
  const [adminOpen, setAdminOpen] = useState(false)
  const reduced = useReducedMotion()

  // Persist whenever destinations change
  useEffect(() => {
    saveDestinations(destinations)
  }, [destinations])

  // Keyboard shortcut: Ctrl+Shift+E opens admin panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault()
        setAdminOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleVisible = useCallback((i: number) => setActiveIndex(i), [])

  const scrollTo = (i: number) => {
    const el = document.getElementById(`dest-${destinations[i].id}`)
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
  }

  return (
    <div className="min-h-screen bg-[#0a1020] text-white relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251,191,36,0.05) 0%, transparent 70%)',
        }}
      />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 lg:px-20 py-6 border-b border-white/[0.06]">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          <span>Back</span>
        </Link>

        <div className="text-center">
          <h1 className="text-xl font-bold text-white tracking-wide">Travel Timeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">{destinations.length} destinations</p>
        </div>

        <button
          onClick={() => setAdminOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 hover:border-amber-400/40 text-slate-500 hover:text-amber-400 transition-colors"
          title="Open editor (Ctrl+Shift+E)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
      </header>

      {/* ── Intro hero ── */}
      <section className="relative z-10 flex flex-col items-center justify-center py-28 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.9, ease: 'easeOut' }}
        >
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-[0.3em] mb-6 block">
            A Cinematic Journey
          </span>
          <h2 className="text-5xl md:text-7xl font-extrabold leading-none mb-6">
            <span className="text-white">Places</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
              }}
            >
              I've Been
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
            Scroll through every chapter of the journey — from Las Vegas nights to Icelandic
            coastlines.
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-2 text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-amber-400/40 to-transparent"
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ── Timeline entries ── */}
      <main className="relative z-10">
        {destinations.map((dest, i) => (
          <DestinationCard
            key={dest.id}
            dest={dest}
            index={i}
            onVisible={handleVisible}
          />
        ))}

        {destinations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-slate-600">
            <p className="text-lg mb-4">No destinations yet.</p>
            <button
              onClick={() => setAdminOpen(true)}
              className="text-amber-400 hover:text-amber-300 underline text-sm"
            >
              Open the editor to add one →
            </button>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 md:px-12 lg:px-20 py-8 flex items-center justify-between text-slate-600 text-sm">
        <Link to="/" className="hover:text-slate-400 transition-colors">← Back to Vattitude</Link>
        <span>{destinations.length} destinations · {new Set(destinations.map((d) => d.country)).size} countries</span>
      </footer>

      {/* ── Fixed dot-nav (desktop) ── */}
      {destinations.length > 0 && (
        <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-2.5">
          {destinations.map((dest, i) => (
            <button
              key={dest.id}
              onClick={() => scrollTo(i)}
              title={dest.location}
              className="group relative flex items-center justify-end"
            >
              <span
                className="absolute right-5 text-xs text-white whitespace-nowrap bg-[#0d1829] border border-white/10 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              >
                {dest.location}
              </span>
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: i === activeIndex ? 10 : 6,
                  height: i === activeIndex ? 10 : 6,
                  background:
                    i === activeIndex
                      ? 'rgb(251 191 36)'
                      : 'rgba(255,255,255,0.2)',
                  boxShadow: i === activeIndex ? '0 0 8px rgba(251,191,36,0.6)' : 'none',
                }}
              />
            </button>
          ))}
        </nav>
      )}

      {/* ── Mobile bottom progress strip ── */}
      {destinations.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 lg:hidden flex items-center gap-1.5 bg-[#0d1829]/90 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full">
          {destinations.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 18 : 5,
                height: 5,
                background:
                  i === activeIndex
                    ? 'rgb(251 191 36)'
                    : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Admin panel ── */}
      <AnimatePresence>
        {adminOpen && (
          <AdminPanel
            destinations={destinations}
            onClose={() => setAdminOpen(false)}
            onChange={setDestinations}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
