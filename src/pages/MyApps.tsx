import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { useSocialMeta } from '../hooks/useSocialMeta'

/**
 * /apps — a phone-first showcase of the apps from the "My apps" home-screen
 * folder, built to be pulled up mid-conversation at networking events.
 * Each card opens the live app, or flips to a full-screen QR code so the
 * other person can scan it straight onto their own phone.
 */

interface App {
  id: string
  name: string
  tagline: string
  description: string
  url: string
  icon: string
  preview: string
  accent: string
  glow: string
  tags: string[]
}

const apps: App[] = [
  {
    id: 'pebblesum',
    name: 'PebbleSum',
    tagline: 'Small steps. Daily practice. Big math success.',
    description: 'Gamified arithmetic for kids — a friendly pebble guide turns daily practice into a little adventure.',
    url: 'https://pebblesum.vattitude.ca',
    icon: '/apps/pebblesum-icon.webp',
    preview: '/projects/pebblesum.webp',
    accent: 'from-amber-300 via-lime-300 to-teal-300',
    glow: 'rgba(163,230,53,0.35)',
    tags: ['Kids', 'Math', 'React'],
  },
  {
    id: 'breather',
    name: 'Breather',
    tagline: 'A daily breathing break that grows with you.',
    description: 'Name your plant, build a streak, and watch it grow with every session. Free, private, no sign-up.',
    url: 'https://breather.vattitude.ca',
    icon: '/apps/breather-icon.webp',
    preview: '/projects/breather.webp',
    accent: 'from-teal-300 via-cyan-300 to-lime-300',
    glow: 'rgba(45,212,191,0.35)',
    tags: ['Wellness', 'PWA', 'Chrome Extension'],
  },
  {
    id: 'chess4kids',
    name: 'Chess 4 Kids',
    tagline: 'Learn chess. Unlock your magic.',
    description: 'Epic quests, magical puzzles and step-by-step lessons — 12 lessons, 50+ puzzles and friendly AI opponents.',
    url: 'https://chess4kids.vattitude.ca',
    icon: '/apps/chess4kids-icon.webp',
    preview: '/projects/chess4kids.webp',
    accent: 'from-yellow-200 via-amber-300 to-orange-400',
    glow: 'rgba(250,204,21,0.35)',
    tags: ['Kids', 'Chess', 'AI Opponents'],
  },
  {
    id: 'rungs',
    name: 'Rungs',
    tagline: 'Start at a hundred. Finish at three.',
    description: 'Push-ups, pull-ups and squats split to your strength, climbing from 100 to 300 reps a day. No gym, no equipment.',
    url: 'https://rungs.vattitude.ca',
    icon: '/apps/rungs-icon.webp',
    preview: '/projects/rungs.webp',
    accent: 'from-cyan-300 via-sky-400 to-violet-400',
    glow: 'rgba(56,189,248,0.35)',
    tags: ['Fitness', 'PWA', 'Works Offline'],
  },
]

const displayHost = (url: string) => url.replace(/^https?:\/\//, '')

function AppCard({ app, index, onShowQr }: { app: App; index: number; onShowQr: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
      className="group relative rounded-[28px]"
    >
      {/* Soft coloured halo behind the card */}
      <div
        className="absolute -inset-2 rounded-[32px] blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(60% 60% at 30% 20%, ${app.glow}, transparent 70%)` }}
      />

      <div className="relative h-full flex flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0a0f1a]">
        {/* Preview */}
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative aspect-[16/10] overflow-hidden"
          aria-label={`Open ${app.name}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${app.accent} opacity-30`} />
          <img
            src={app.preview}
            alt={`${app.name} preview`}
            className="relative w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            width={1200}
            height={750}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/10 to-transparent" />
        </a>

        {/* Info */}
        <div className="relative flex-1 flex flex-col px-6 pb-6 -mt-14 sm:px-7 sm:pb-7">
          <div className="flex items-end gap-4 mb-5">
            <img
              src={app.icon}
              alt=""
              className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-[26%] shadow-[0_10px_30px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
              width={96}
              height={96}
            />
            <h2
              className={`pb-1 text-4xl sm:text-5xl font-extrabold leading-[1.02] tracking-tight bg-gradient-to-r ${app.accent} bg-clip-text text-transparent`}
            >
              {app.name}
            </h2>
          </div>

          <p className="text-lg sm:text-xl font-semibold text-white leading-snug mb-2">{app.tagline}</p>
          <p className="text-slate-400 leading-relaxed mb-5">{app.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {app.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-[11px] rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-auto flex gap-3">
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-[#050810] font-semibold hover:bg-slate-200 transition-colors"
            >
              Open app
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
            <button
              type="button"
              onClick={onShowQr}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-white/15 text-white font-semibold hover:bg-white/[0.06] transition-colors"
              aria-label={`Show QR code for ${app.name}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" />
              </svg>
              QR
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function QrOverlay({ app, onClose }: { app: App; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#050810]/90 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${app.name} QR code`}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="w-full max-w-sm rounded-[32px] bg-white p-7 text-center shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-3 mb-5">
          <img src={app.icon} alt="" className="w-12 h-12 rounded-[26%]" width={48} height={48} />
          <h3 className="text-3xl font-extrabold tracking-tight text-[#050810]">{app.name}</h3>
        </div>
        <QRCodeSVG
          value={app.url}
          size={512}
          level="M"
          marginSize={0}
          imageSettings={{ src: app.icon, height: 88, width: 88, excavate: true }}
          className="w-full h-auto"
          title={`QR code for ${app.url}`}
        />
        <p className="mt-5 text-slate-500 font-medium">Scan to open</p>
        <p className="text-slate-900 font-semibold">{displayHost(app.url)}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full py-3.5 rounded-2xl bg-[#050810] text-white font-semibold"
        >
          Done
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function MyApps() {
  const [qrApp, setQrApp] = useState<App | null>(null)

  useSocialMeta({
    title: 'My Apps — PebbleSum, Breather, Chess 4 Kids & Rungs | Vattitude',
    description:
      'Four apps built by Vattitude: PebbleSum for kids’ math, Breather for daily breathing breaks, Chess 4 Kids for learning chess, and Rungs for 100-to-300 daily reps.',
    url: 'https://vattitude.ca/apps',
    image: 'https://vattitude.ca/apps-preview.jpg',
  })

  return (
    <div className="relative min-h-screen bg-[#050810] text-slate-300 overflow-hidden">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 sm:pt-16">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 sm:mb-14">
          <a href="/" className="inline-flex items-center gap-2 mb-6 sm:mb-8">
            <img src="/logo.png" alt="" className="h-8 w-8" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Vattitude
            </span>
          </a>
          <span className="block text-sm font-semibold text-cyan-400 uppercase tracking-[0.2em] mb-4">
            Built by me
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.02] tracking-tight mb-5">
            My{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Apps
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-xl">
            Four little products I designed and shipped end to end. Tap one to try it, or hit{' '}
            <span className="text-white font-semibold">QR</span> to put it on your phone.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {apps.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} onShowQr={() => setQrApp(app)} />
          ))}
        </div>

        <footer className="mt-16 text-center">
          <a href="/#contact" className="text-cyan-400 font-medium hover:underline">
            Want something like this built? Let’s talk →
          </a>
        </footer>
      </div>

      <AnimatePresence>{qrApp && <QrOverlay app={qrApp} onClose={() => setQrApp(null)} />}</AnimatePresence>
    </div>
  )
}
