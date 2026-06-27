import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

function CypherText({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  const iteration = useRef(0)

  useEffect(() => {
    iteration.current = 0
    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((_, idx) => {
            if (idx < iteration.current) return text[idx]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )
      iteration.current += 0.5
      if (iteration.current >= text.length) clearInterval(interval)
    }, 30)
    return () => clearInterval(interval)
  }, [text])

  return <span className={className}>{display}</span>
}

const roles = ['Designers', 'Developers', 'Strategists', 'Creatives']

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image - positioned right */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-[#050810]/50" />
      </div>

      {/* Content - left aligned */}
      <div className="relative z-20 px-6 md:px-16 lg:px-24 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-cyan-300">Available for Projects</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6"
        >
          <CypherText
            text="Vattitude"
            className="bg-gradient-to-r from-white via-blue-300 to-purple-400 bg-clip-text text-transparent"
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-slate-300 mb-4"
        >
          We are{' '}
          <motion.span
            key={roleIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-cyan-400 font-semibold"
          >
            {roles[roleIndex]}
          </motion.span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg text-slate-400 max-w-xl mb-12"
        >
          19+ years of crafting immersive web experiences, interactive apps,
          powerful brand identities, and data-driven growth strategies from Toronto.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-start gap-4"
        >
          <motion.a
            href="#portfolio"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Our Work
          </motion.a>
          <motion.a
            href="#contact"
            className="px-8 py-4 border border-slate-500/50 rounded-full text-slate-300 font-semibold hover:border-purple-500/50 hover:text-purple-300 transition-all backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Talk
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl"
        >
          {[
            { icon: '⚡', title: 'Web Development', desc: 'Modern & Responsive' },
            { icon: '📈', title: 'Digital Growth', desc: 'ROI Driven Marketing' },
            { icon: '🎨', title: 'Brand Identity', desc: 'Unique & Consistent' },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.15 }}
              whileHover={{ y: -5, borderColor: 'rgba(139,92,246,0.5)' }}
              className="p-5 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-md"
            >
              <div className="text-2xl mb-2">{card.icon}</div>
              <h3 className="font-semibold text-white text-sm mb-1">{card.title}</h3>
              <p className="text-xs text-slate-500">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
