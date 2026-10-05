import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { useSocialMeta } from '../hooks/useSocialMeta'

/**
 * /apps — "Built, not pitched." A cinematic, ad-style showcase of the six
 * shipped apps. Ember particles trail the cursor (tinted by whichever app
 * is on screen), each app gets a full-bleed billboard with a live phone
 * mockup running the real app, and everything is magnetic, tilting and
 * scroll-choreographed.
 */

interface App {
  id: string
  name: string
  tagline: string
  description: string
  url: string
  icon: string
  preview: string | null
  accent: [number, number, number] // rgb for canvas + glows
  gradient: string // tailwind gradient stops for text
  tags: string[]
}

const apps: App[] = [
  {
    id: 'pebblesum',
    name: 'PebbleSum',
    tagline: 'Small steps. Daily practice. Big math success.',
    description:
      'Gamified arithmetic for kids — a friendly pebble guide turns daily practice into a little adventure. Streaks, rewards, zero boredom.',
    url: 'https://pebblesum.vattitude.ca',
    icon: '/apps/pebblesum-icon.webp',
    preview: '/projects/pebblesum.webp',
    accent: [163, 230, 53],
    gradient: 'from-amber-300 via-lime-300 to-teal-300',
    tags: ['Kids', 'Math', 'React'],
  },
  {
    id: 'breather',
    name: 'Breather',
    tagline: 'A daily breathing break that grows with you.',
    description:
      'Name your plant, build a streak, and watch it grow with every session. Guided breathing, free forever, private by design — no sign-up.',
    url: 'https://breather.vattitude.ca',
    icon: '/apps/breather-icon.webp',
    preview: '/projects/breather.webp',
    accent: [45, 212, 191],
    gradient: 'from-teal-300 via-cyan-300 to-lime-300',
    tags: ['Wellness', 'PWA', 'Works Offline'],
  },
  {
    id: 'chess4kids',
    name: 'Chess 4 Kids',
    tagline: 'Learn chess. Unlock your magic.',
    description:
      'Epic quests, magical puzzles and step-by-step lessons — 12 lessons, 50+ puzzles and friendly AI opponents that grow with your child.',
    url: 'https://chess4kids.vattitude.ca',
    icon: '/apps/chess4kids-icon.webp',
    preview: '/projects/chess4kids.webp',
    accent: [250, 204, 21],
    gradient: 'from-yellow-200 via-amber-300 to-orange-400',
    tags: ['Kids', 'Chess', 'AI Opponents'],
  },
  {
    id: 'rungs',
    name: 'Rungs',
    tagline: 'Start at a hundred. Finish at three.',
    description:
      'Push-ups, pull-ups and squats split to your strength, climbing from 100 to 300 reps a day. No gym, no equipment — just the ladder.',
    url: 'https://rungs.vattitude.ca',
    icon: '/apps/rungs-icon.webp',
    preview: '/projects/rungs.webp',
    accent: [251, 146, 60],
    gradient: 'from-orange-300 via-amber-400 to-red-400',
    tags: ['Fitness', 'PWA', 'No Equipment'],
  },
  {
    id: 'evalu8',
    name: 'Evalu8',
    tagline: 'Think like a programmer.',
    description:
      'Short robot puzzles that teach kids 6–9 to plan, test and debug like real engineers. Privacy-first, with a parent dashboard watching the wins.',
    url: 'https://evalu8.vattitude.ca/',
    icon: '/apps/evalu8-icon.png',
    preview: null,
    accent: [251, 146, 60],
    gradient: 'from-orange-400 via-amber-300 to-teal-300',
    tags: ['Kids', 'Coding', 'Next.js'],
  },
  {
    id: 'morningbrief',
    name: 'Morning Brief',
    tagline: 'Your day, briefed — in your own voice.',
    description:
      'A daily news briefing built for busy mornings: your sources, summarized by AI and read aloud in a voice you pick. Android app + web, new every morning.',
    url: 'https://mbv.vattitude.ca/',
    icon: '/apps/morningbrief-icon.png',
    preview: null,
    accent: [244, 114, 182],
    gradient: 'from-pink-300 via-rose-300 to-orange-300',
    tags: ['News', 'AI Voice', 'Android'],
  },
]

const rgb = (c: [number, number, number], a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`
const displayHost = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

/* ------------------------------------------------------------------ */
/* EmberTrail — fire particles that chase the cursor, tinted by the     */
/* app currently on screen. Clicks burst. Ambient embers drift up.     */
/* ------------------------------------------------------------------ */
function EmberTrail({ accent }: { accent: [number, number, number] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const accentRef = useRef(accent)
  accentRef.current = accent

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * DPR
      canvas.height = h * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    interface P {
      x: number; y: number; vx: number; vy: number
      life: number; maxLife: number; size: number
      r: number; g: number; b: number
    }
    const parts: P[] = []
    const mouse = { x: -999, y: -999, px: -999, py: -999 }
    let lastSpawn = 0

    const spawn = (x: number, y: number, burst: boolean) => {
      if (parts.length > 160) return
      const a = accentRef.current
      // blend fire orange with the active accent
      const mix = Math.random()
      const r = Math.round(255 * (1 - mix) + a[0] * mix)
      const gg = Math.round(140 * (1 - mix) + a[1] * mix)
      const b = Math.round(40 * (1 - mix) + a[2] * mix)
      const speed = burst ? 2 + Math.random() * 3.5 : 0.4 + Math.random() * 1.2
      const ang = burst ? Math.random() * Math.PI * 2 : -Math.PI / 2 + (Math.random() - 0.5) * 1.2
      parts.push({
        x: x + (Math.random() - 0.5) * (burst ? 14 : 6),
        y: y + (Math.random() - 0.5) * (burst ? 14 : 6),
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed - 0.4,
        life: 1,
        maxLife: 0.5 + Math.random() * 0.9,
        size: (burst ? 2.5 : 1.5) + Math.random() * 3,
        r, g: gg, b,
      })
    }

    const onMove = (e: MouseEvent) => {
      mouse.px = mouse.x
      mouse.py = mouse.y
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onDown = (e: MouseEvent) => {
      for (let i = 0; i < 26; i++) spawn(e.clientX, e.clientY, true)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)

    let frames = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      frames++
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      const now = performance.now()
      // trail spawns while the cursor moves
      if (mouse.x > -100 && now - lastSpawn > 16) {
        lastSpawn = now
        const dx = mouse.x - mouse.px
        const dy = mouse.y - mouse.py
        const dist = Math.hypot(dx, dy)
        const n = Math.min(2 + Math.floor(dist / 12), 6)
        for (let i = 0; i < n; i++) spawn(mouse.x, mouse.y, false)
      }
      // ambient embers drifting up from the bottom
      if (frames % 9 === 0 && parts.length < 90) {
        spawn(Math.random() * w, h + 10, false)
      }

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.life -= 0.016 / p.maxLife
        if (p.life <= 0) {
          parts.splice(i, 1)
          continue
        }
        p.vy -= 0.015 // buoyancy
        p.vx *= 0.985
        p.vy *= 0.985
        p.x += p.vx + Math.sin((frames + i) * 0.15) * 0.4
        p.y += p.vy
        const t = p.life
        const alpha = t * 0.75
        const rad = p.size * (0.5 + t)
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad)
        grad.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${alpha})`)
        grad.addColorStop(0.4, `rgba(${p.r},${p.g},${p.b},${alpha * 0.5})`)
        grad.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    />
  )
}

/* ------------------------------------------------------------------ */
/* Magnetic — wrapper that pulls its child toward the cursor            */
/* ------------------------------------------------------------------ */
function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [off, setOff] = useState({ x: 0, y: 0 })

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        setOff({
          x: (e.clientX - (r.left + r.width / 2)) * strength,
          y: (e.clientY - (r.top + r.height / 2)) * strength,
        })
      }}
      onMouseLeave={() => setOff({ x: 0, y: 0 })}
      className="inline-block"
    >
      <motion.div animate={{ x: off.x, y: off.y }} transition={{ type: 'spring', stiffness: 250, damping: 18 }}>
        {children}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Phone — tilting live mockup running the real app                    */
/* ------------------------------------------------------------------ */
const PHONE = { width: 390, height: 844 }

function Phone({ app, eager }: { app: App; eager: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const [loaded, setLoaded] = useState(false)
  const [boxW, setBoxW] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setBoxW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const fw = Math.min(Math.max(boxW * 0.9, 200), 250)
  const scale = fw / PHONE.width

  return (
    <div ref={boxRef} className="w-full flex justify-center" style={{ perspective: 1200 }}>
      <motion.div
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        onMouseMove={(e) => {
          const r = wrapRef.current?.getBoundingClientRect()
          if (!r) return
          setTilt({
            rx: -((e.clientY - r.top) / r.height - 0.5) * 14,
            ry: ((e.clientX - r.left) / r.width - 0.5) * 18,
          })
        }}
        onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          ref={wrapRef}
          className="rounded-[36px] p-[10px] bg-[#141a26] ring-1 ring-white/15 shadow-[0_40px_100px_rgba(0,0,0,0.65)]"
          style={{ boxShadow: `0 40px 100px rgba(0,0,0,0.65), 0 0 70px ${rgb(app.accent, 0.28)}` }}
        >
          {/* notch */}
          <div className="absolute top-[22px] left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10" />
          <div className="relative overflow-hidden rounded-[28px] bg-[#0a0f1a]" style={{ width: fw, height: PHONE.height * scale }}>
            {/* poster while the live app loads */}
            {!loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
                style={{ background: `radial-gradient(120% 100% at 50% 0%, ${rgb(app.accent, 0.35)}, #0a0f1a 70%)` }}>
                {app.preview ? (
                  <img src={app.preview} alt="" className="absolute inset-0 w-full h-full object-cover object-top opacity-70" />
                ) : (
                  <>
                    <img src={app.icon} alt="" className="w-20 h-20 rounded-[26%] shadow-2xl" />
                    <p className="text-white/80 font-semibold">{app.name}</p>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent" />
                <div className="absolute bottom-6 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-white/70"
                      animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }} />
                  ))}
                </div>
              </div>
            )}
            {boxW > 0 && (
              <iframe
                src={app.url}
                title={`${app.name} live`}
                loading={eager ? 'eager' : 'lazy'}
                tabIndex={-1}
                aria-hidden="true"
                sandbox="allow-scripts allow-same-origin"
                onLoad={() => setLoaded(true)}
                className="absolute top-0 left-0 border-0 origin-top-left bg-white"
                style={{ width: PHONE.width, height: PHONE.height, transform: `scale(${scale})`, opacity: loaded ? 1 : 0 }}
              />
            )}
          </div>
        </div>
        {/* floating icon chip */}
        <motion.img
          src={app.icon}
          alt=""
          className="absolute -left-8 -bottom-6 w-20 h-20 rounded-[26%] shadow-[0_16px_40px_rgba(0,0,0,0.6)] ring-1 ring-white/20"
          animate={{ y: [0, -10, 0], rotate: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          style={{ transform: 'translateZ(60px)' }}
        />
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Billboard — one full-bleed cinematic section per app                */
/* ------------------------------------------------------------------ */
function Billboard({ app, index, flip, onActive, onQr }: {
  app: App; index: number; flip: boolean
  onActive: (accent: [number, number, number]) => void
  onQr: () => void
}) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.section
      onViewportEnter={() => onActive(app.accent)}
      viewport={{ amount: 0.45 }}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* ghost number */}
      <div aria-hidden="true"
        className="pointer-events-none select-none absolute top-8 left-1/2 -translate-x-1/2 text-[26vw] leading-none font-extrabold text-white/[0.025] tracking-tighter">
        {num}
      </div>
      {/* accent aura */}
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.4 }}
        transition={{ duration: 1 }}
        style={{ background: `radial-gradient(55% 60% at ${flip ? '78%' : '22%'} 45%, ${rgb(app.accent, 0.16)}, transparent 70%)` }}
      />

      <div className={`relative max-w-6xl mx-auto px-5 sm:px-8 grid gap-12 md:grid-cols-2 md:gap-8 items-center`}>
        {/* copy */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={flip ? 'md:order-2' : ''}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-bold tracking-[0.25em]" style={{ color: rgb(app.accent) }}>{num}</span>
            <span className="h-px w-12 bg-white/20" />
            <span className="text-sm text-slate-500 font-medium">Shipped & live</span>
          </div>
          <h2 className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] mb-5 bg-gradient-to-r ${app.gradient} bg-clip-text text-transparent`}>
            {app.name}
          </h2>
          <p className="text-xl sm:text-2xl font-semibold text-white leading-snug mb-4">{app.tagline}</p>
          <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-md">{app.description}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {app.tags.map((t) => (
              <span key={t} className="px-3 py-1.5 text-xs font-medium rounded-full border text-slate-300"
                style={{ borderColor: rgb(app.accent, 0.35), background: rgb(app.accent, 0.08) }}>
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <a href={app.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-[#050810] transition-transform hover:scale-[1.03]"
                style={{ background: `linear-gradient(135deg, ${rgb(app.accent)}, ${rgb(app.accent, 0.75)})`, boxShadow: `0 12px 40px ${rgb(app.accent, 0.4)}` }}>
                Launch app
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
            </Magnetic>
            <Magnetic>
              <button type="button" onClick={onQr}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl font-bold border border-white/15 text-white hover:bg-white/[0.06] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" />
                </svg>
                QR code
              </button>
            </Magnetic>
          </div>
          <p className="mt-4 text-sm text-slate-600 font-medium">{displayHost(app.url)}</p>
        </motion.div>

        {/* phone */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className={flip ? 'md:order-1' : ''}
        >
          <Phone app={app} eager={index < 2} />
        </motion.div>
      </div>
    </motion.section>
  )
}

/* ------------------------------------------------------------------ */
/* QR overlay (kept from before)                                       */
/* ------------------------------------------------------------------ */
function QrOverlay({ app, onClose }: { app: App; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-[#050810]/90 backdrop-blur-xl"
      onClick={onClose} role="dialog" aria-modal="true" aria-label={`${app.name} QR code`}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="w-full max-w-sm rounded-[32px] bg-white p-7 text-center shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-3 mb-5">
          <img src={app.icon} alt="" className="w-12 h-12 rounded-[26%]" width={48} height={48} />
          <h3 className="text-3xl font-extrabold tracking-tight text-[#050810]">{app.name}</h3>
        </div>
        <QRCodeSVG value={app.url} size={512} level="M" marginSize={0}
          imageSettings={{ src: app.icon, height: 88, width: 88, excavate: true }}
          className="w-full h-auto" title={`QR code for ${app.url}`} />
        <p className="mt-5 text-slate-500 font-medium">Scan to open</p>
        <p className="text-slate-900 font-semibold">{displayHost(app.url)}</p>
        <button type="button" onClick={onClose} className="mt-6 w-full py-3.5 rounded-2xl bg-[#050810] text-white font-semibold">
          Done
        </button>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
export default function MyApps() {
  const [qrApp, setQrApp] = useState<App | null>(null)
  const [accent, setAccent] = useState<[number, number, number]>(apps[0].accent)
  const { scrollYProgress } = useScroll()
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const onActive = useCallback((a: [number, number, number]) => setAccent(a), [])

  useSocialMeta({
    title: 'My Apps — Six products shipped | Vattitude',
    description:
      'Six apps designed and shipped end to end by Vattitude: PebbleSum, Breather, Chess 4 Kids, Rungs, Evalu8 and Morning Brief. Try them live.',
    url: 'https://vattitude.ca/apps',
    image: 'https://vattitude.ca/apps-preview.jpg',
  })

  const words = ['Built,', 'not', 'pitched.']

  return (
    <div className="relative min-h-screen bg-[#050810] text-slate-300 overflow-x-clip">
      <EmberTrail accent={accent} />

      {/* scroll progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left"
        style={{ scaleX: barScale, background: `linear-gradient(90deg, ${rgb(accent)}, ${rgb(accent, 0.4)})` }} />

      {/* ambient aurora, tinted by the active app */}
      <motion.div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0"
        animate={{ background: `radial-gradient(70% 50% at 50% 0%, ${rgb(accent, 0.10)}, transparent 70%)` }}
        transition={{ duration: 1.2 }} />

      {/* ------------------------------ hero ------------------------------ */}
      <header className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-16 sm:pb-24">
        <motion.a href="/" className="inline-flex items-center gap-2 mb-14 sm:mb-20"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <img src="/logo.png" alt="" className="h-8 w-8" />
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Vattitude
          </span>
        </motion.a>

        <p className="text-sm font-bold tracking-[0.3em] text-cyan-400 uppercase mb-6">
          <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>The app lab</motion.span>
        </p>
        <h1 className="font-extrabold tracking-tight leading-[0.9] text-[17vw] sm:text-[11vw] lg:text-[9rem] mb-8">
          {words.map((w, i) => (
            <span key={w} className="inline-block overflow-hidden pb-2 -mb-2 mr-[0.25em] last:mr-0">
              <motion.span
                className={`inline-block ${i === 2 ? 'bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent' : 'text-white'}`}
                initial={{ y: '110%' }} animate={{ y: 0 }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
          className="text-slate-400 text-xl sm:text-2xl leading-relaxed max-w-2xl mb-10"
        >
          Six live products — designed, coded and shipped by one person.
          No pitch decks. <span className="text-white font-semibold">Touch them, they're real.</span> Move
          your cursor and watch the sparks fly.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.7 }}
          className="flex flex-wrap gap-x-10 gap-y-4"
        >
          {[
            ['6', 'apps live'],
            ['1', 'builder'],
            ['0', 'pitch decks'],
          ].map(([n, label]) => (
            <div key={label} className="flex items-baseline gap-2.5">
              <span className="text-4xl sm:text-5xl font-extrabold text-white">{n}</span>
              <span className="text-slate-500 font-medium">{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center"
          animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/25 flex justify-center pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
          </div>
        </motion.div>
      </header>

      {/* ---------------------------- marquee ---------------------------- */}
      <div className="relative z-10 border-y border-white/[0.07] bg-white/[0.015] py-5 overflow-hidden">
        <motion.div
          className="flex gap-10 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
        >
          {[...apps, ...apps].map((a, i) => (
            <a key={a.id + i} href={`#app-${a.id}`}
              className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity shrink-0">
              <img src={a.icon} alt="" className="w-10 h-10 rounded-[26%]" />
              <span className="text-lg font-bold text-white whitespace-nowrap">{a.name}</span>
              <span className="text-slate-600">✦</span>
            </a>
          ))}
        </motion.div>
      </div>

      {/* --------------------------- billboards --------------------------- */}
      <main className="relative z-10">
        {apps.map((app, i) => (
          <div key={app.id} id={`app-${app.id}`} className="scroll-mt-20">
            <Billboard app={app} index={i} flip={i % 2 === 1} onActive={onActive} onQr={() => setQrApp(app)} />
          </div>
        ))}
      </main>

      {/* ----------------------------- finale ----------------------------- */}
      <footer className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-28 sm:py-36 text-center">
        <motion.p
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-sm font-bold tracking-[0.3em] text-cyan-400 uppercase mb-6"
        >
          Your turn
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.02] mb-8"
        >
          Your idea could<br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            be next.
          </span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Magnetic>
            <a href="/#contact"
              className="inline-flex items-center gap-3 px-9 py-5 rounded-2xl bg-white text-[#050810] text-lg font-bold hover:bg-slate-200 transition-colors shadow-[0_16px_60px_rgba(255,255,255,0.15)]">
              Let's build it
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </a>
          </Magnetic>
        </motion.div>
        <p className="mt-10 text-slate-600 text-sm">
          © {new Date().getFullYear()} Vattitude — designed & built by hand.
        </p>
      </footer>

      <AnimatePresence>{qrApp && <QrOverlay app={qrApp} onClose={() => setQrApp(null)} />}</AnimatePresence>
    </div>
  )
}
