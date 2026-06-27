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

const roles = ['Developers', 'Designers', 'Strategists', 'Creatives']

const stats = [
  { icon: '⭐', value: '19+', label: 'Years Experience' },
  { icon: '🚀', value: '25+', label: 'Projects Delivered' },
  { icon: '😊', value: '98%', label: 'Client Satisfaction' },
]

const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: 'Web Development',
    subtitle: 'Modern & Scalable',
    desc: 'Fast, secure and scalable websites built with the latest technologies.',
    color: 'cyan',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Digital Growth',
    subtitle: 'ROI Driven',
    desc: 'Data-driven strategies that increase visibility and maximize ROI.',
    color: 'purple',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: 'Brand Identity',
    subtitle: 'Unique & Memorable',
    desc: 'Memorable brand identities that connect and convert.',
    color: 'pink',
  },
]

const brandLogos = ['UserReno', 'AllJunk&Reno', 'BMO', 'Loblaws', 'Scotiabank', 'PwC', 'HomeDepot', 'AceBarber']

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image layer */}
      <div className="hero-bg-layer absolute inset-0 z-0">
        <img
          src="/hero-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-[#050810]/50" />
      </div>

      {/* Main hero content */}
      <div className="relative z-20 flex-1 flex items-center px-6 md:px-16 lg:px-24 pt-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-8">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm text-slate-300">
                Available for <span className="text-cyan-400">Projects</span>
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight"
          >
            <CypherText text="We Build " className="text-white" />
            <CypherText
              text="Digital"
              className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            />
            <br className="hidden sm:block" />
            <CypherText text=" Experiences That" className="text-white" />
            <br className="hidden sm:block" />
            <CypherText
              text=" Drive Growth."
              className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed"
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
            </motion.span>{' '}
            crafting high-performance websites, powerful brands and data-driven
            strategies that help businesses stand out and scale online.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-start gap-4 mb-14"
          >
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Our Work
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
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

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center gap-6 md:gap-10"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                <span className="text-lg">{stat.icon}</span>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
                {i < stats.length - 1 && (
                  <div className="w-px h-10 bg-slate-700/50 ml-4" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Service cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="relative z-20 px-6 md:px-16 lg:px-24 pb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl">
          {services.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.15 }}
              whileHover={{ y: -5, borderColor: `rgba(139,92,246,0.4)` }}
              className="group p-4 rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.05] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                    card.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                    card.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                  }`}>
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-0.5">{card.title}</h3>
                  <p className={`text-xs font-medium mb-1.5 ${
                    card.color === 'cyan' ? 'text-cyan-400' :
                    card.color === 'purple' ? 'text-purple-400' :
                    'text-pink-400'
                  }`}>{card.subtitle}</p>
                  <p className="text-xs text-slate-500">{card.desc}</p>
                </div>
                <a href="#contact" className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center border transition-all ${
                  card.color === 'cyan' ? 'border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500/10' :
                  card.color === 'purple' ? 'border-purple-500/30 text-purple-400 group-hover:bg-purple-500/10' :
                  'border-pink-500/30 text-pink-400 group-hover:bg-pink-500/10'
                }`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trusted by brands */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="relative z-20 border-t border-white/5 py-8 px-6 md:px-16 lg:px-24"
      >
        <p className="text-center text-sm text-slate-500 mb-6">
          Trusted by forward-thinking brands worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-40">
          {brandLogos.map((brand) => (
            <span key={brand} className="text-lg md:text-xl font-semibold text-slate-300 tracking-wide">
              {brand}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
