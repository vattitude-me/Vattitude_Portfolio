import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const projects = [
  {
    id: 1,
    title: 'UseReno Inc.',
    category: 'websites',
    categoryLabel: 'Corporate Website',
    description: 'Full-service home renovation company website featuring a 4-step process walkthrough, client testimonials, portfolio gallery, and integrated booking.',
    gradient: 'from-amber-600 to-orange-500',
    url: 'https://usereno.ca',
    tech: ['WordPress', 'Custom Theme', 'SEO'],
    metric: '160%',
    metricLabel: 'Leads Generated',
  },
  {
    id: 2,
    title: 'Ace Barber Shop',
    category: 'websites',
    categoryLabel: 'Branding & Website',
    description: 'Premium barbershop website with online booking via Setmore, service pricing for men/women/kids, staff profiles, and a retro-meets-modern design aesthetic.',
    gradient: 'from-slate-700 to-zinc-900',
    url: 'https://acebarber.ca',
    tech: ['Custom Build', 'Setmore', 'Responsive'],
    metric: '120%',
    metricLabel: 'Brand Visibility',
  },
  {
    id: 3,
    title: 'All Junk & Demo',
    category: 'websites',
    categoryLabel: 'Lead Gen Website',
    description: 'Junk removal & demolition service site with same-day scheduling, lowest price guarantee messaging, and service area targeting across the GTA.',
    gradient: 'from-green-600 to-emerald-500',
    url: 'https://alljunkdemo.ca',
    tech: ['Static Site', 'Google Maps', 'Lead Gen'],
    metric: '230%',
    metricLabel: 'Sales Increase',
  },
  {
    id: 4,
    title: 'LPP Flooring Ltd.',
    category: 'websites',
    categoryLabel: 'Corporate Website',
    description: 'Professional flooring company site showcasing 30+ years of combined experience with service cards and on-site quote booking.',
    gradient: 'from-yellow-700 to-amber-600',
    url: 'https://lppflooring.netlify.app',
    tech: ['Netlify', 'Modern CSS', 'Contact Forms'],
    metric: '85%',
    metricLabel: 'More Inquiries',
  },
  {
    id: 5,
    title: 'Chess for Kids',
    category: 'apps',
    categoryLabel: 'Education App',
    description: 'Educational chess platform for children with gamified learning — 12 structured lessons, 50+ puzzles, AI opponents, and an achievement system.',
    gradient: 'from-purple-600 to-indigo-600',
    url: 'https://chess4kids.vattitude.ca',
    tech: ['Next.js', 'React', 'AI Engine'],
    metric: '95%',
    metricLabel: 'User Engagement',
  },
  {
    id: 6,
    title: 'PebbleSum',
    category: 'apps',
    categoryLabel: 'Education App',
    description: 'Interactive math education platform — gamified arithmetic exercises designed to make learning engaging for kids.',
    gradient: 'from-rose-500 to-pink-600',
    url: 'https://pebblesum.vattitude.ca',
    tech: ['React', 'TypeScript', 'Gamification'],
    metric: '140%',
    metricLabel: 'Learning Speed',
  },
]

const filters = [
  { key: 'all', label: 'All Projects' },
  { key: 'websites', label: 'Websites' },
  { key: 'apps', label: 'Apps' },
]

export default function Portfolio() {
  const [active, setActive] = useState('all')

  const filtered = active === 'all' ? projects : projects.filter((p) => p.category === active)

  return (
    <section id="portfolio" className="relative py-32 z-10">
      <div className="w-full px-8 md:px-16 lg:px-20 xl:px-28">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[420px_1fr] 2xl:grid-cols-[520px_1fr] gap-12 lg:gap-16 items-start">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-32"
          >
            <span className="text-sm font-semibold text-cyan-400 uppercase tracking-[0.2em] mb-6 block">
              Our Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.08] mb-8">
              Work That Speaks{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Results
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-[380px]">
              We partner with ambitious brands and help them turn ideas into powerful
              digital products.
            </p>
          </motion.div>

          {/* Right column */}
          <div>
            {/* Filter tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActive(f.key)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    active === f.key
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'text-slate-400 border border-white/[0.08] hover:text-white hover:border-white/20'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </motion.div>

            {/* Project cards grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <motion.a
                    key={project.id}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className="group relative rounded-2xl transition-all duration-300 cursor-pointer"
                  >
                    {/* Gradient border glow */}
                    <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-b ${project.gradient} opacity-20 group-hover:opacity-50 transition-opacity duration-300 blur-[0.5px]`} />

                    {/* Card body */}
                    <div className="relative h-full bg-[#0a0f1a] border border-white/[0.08] rounded-2xl group-hover:border-transparent transition-colors overflow-hidden">
                      {/* Screenshot */}
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img
                          src={`https://api.microlink.io/?url=${encodeURIComponent(project.url)}&screenshot=true&meta=false&embed=screenshot.url`}
                          alt={project.title}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent opacity-60`} />
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        {/* Title + metric row */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-bold text-white text-base">{project.title}</h3>
                          <span className="text-cyan-400 font-bold text-sm whitespace-nowrap">
                            ↑ {project.metric}
                          </span>
                        </div>

                        {/* Category + metric label */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="text-purple-400 text-sm font-medium">{project.categoryLabel}</span>
                          <span className="text-slate-500 text-xs">{project.metricLabel}</span>
                        </div>

                        {/* Tech stack */}
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
