import { motion } from 'framer-motion'

const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: 'Web Development',
    subtitle: 'Modern & Scalable',
    desc: 'High-performance websites built with the latest technologies.',
    color: 'cyan',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
    title: 'Online Business Setup',
    subtitle: 'Launch & Automate',
    desc: 'Complete online business setup with payment, store and automation.',
    color: 'purple',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    title: 'UI/UX Design',
    subtitle: 'Beautiful & Usable',
    desc: 'User-centered designs that elevate experience and drive conversions.',
    color: 'pink',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: 'Brand Identity',
    subtitle: 'Unique & Memorable',
    desc: 'Strong brand systems that connect, communicate and build trust.',
    color: 'teal',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Digital Growth',
    subtitle: 'ROI Driven',
    desc: 'Data-driven strategies for SEO, ads and content that maximize ROI.',
    color: 'purple',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Automation & Integrations',
    subtitle: 'Smart & Efficient',
    desc: 'Workflow automation and integrations that save time and scale operations.',
    color: 'cyan',
  },
]

function getGradient(color: string) {
  switch (color) {
    case 'cyan': return 'from-cyan-500 to-cyan-400'
    case 'purple': return 'from-purple-500 to-purple-400'
    case 'pink': return 'from-pink-500 to-pink-400'
    case 'teal': return 'from-teal-500 to-teal-400'
    default: return 'from-cyan-500 to-cyan-400'
  }
}

function getTextColor(color: string) {
  switch (color) {
    case 'cyan': return 'text-cyan-400'
    case 'purple': return 'text-purple-400'
    case 'pink': return 'text-pink-400'
    case 'teal': return 'text-teal-400'
    default: return 'text-cyan-400'
  }
}

function getIconStyles(color: string) {
  switch (color) {
    case 'cyan': return 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40'
    case 'purple': return 'bg-purple-950/80 text-purple-400 border-purple-500/40'
    case 'pink': return 'bg-pink-950/80 text-pink-400 border-pink-500/40'
    case 'teal': return 'bg-teal-950/80 text-teal-400 border-teal-500/40'
    default: return 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40'
  }
}

function getArrowStyles(color: string) {
  switch (color) {
    case 'cyan': return 'border-cyan-500/40 text-cyan-400'
    case 'purple': return 'border-purple-500/40 text-purple-400'
    case 'pink': return 'border-pink-500/40 text-pink-400'
    case 'teal': return 'border-teal-500/40 text-teal-400'
    default: return 'border-cyan-500/40 text-cyan-400'
  }
}

export default function Services() {
  return (
    <section id="services" className="relative py-32 z-10">
      <div className="w-full px-8 md:px-16 lg:px-20 xl:px-28">
        <div className="grid grid-cols-1 lg:grid-cols-[600px_1fr] gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-sm font-semibold text-cyan-400 uppercase tracking-[0.2em] mb-6 block">
              Our Services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.08] mb-8">
              End-to-end Digital Solutions That{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Grow Your Business
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-[380px]">
              From stunning websites to powerful branding and growth strategies — we help
              businesses build, launch and scale with confidence.
            </p>
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-slate-500/60 text-white font-medium hover:border-cyan-400/60 hover:text-cyan-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Connect To Explore
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.a>
          </motion.div>

          {/* Right column — 3×2 card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl transition-all duration-300"
              >
                {/* Gradient border glow wrapper */}
                <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-b ${getGradient(service.color)} opacity-20 group-hover:opacity-50 transition-opacity duration-300 blur-[0.5px]`} />

                {/* Card body */}
                <div className="relative p-7 h-full bg-[#0a0f1a] border border-white/[0.08] rounded-2xl group-hover:border-transparent transition-colors">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 border ${getIconStyles(service.color)}`}>
                    {service.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-white text-lg mb-1.5">
                    {service.title}
                  </h3>

                  {/* Colored subtitle */}
                  <p className={`text-sm font-semibold mb-4 ${getTextColor(service.color)}`}>
                    {service.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-[0.9rem] text-slate-500 leading-relaxed mb-8">
                    {service.desc}
                  </p>

                  {/* Arrow button */}
                  <a href="#contact" className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${getArrowStyles(service.color)} group-hover:scale-110 transition-transform duration-300`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
