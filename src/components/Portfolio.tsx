import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const projects = [
  {
    id: 1,
    title: 'UseReno Inc.',
    category: 'web',
    description: 'Full-service home renovation company website featuring a 4-step process walkthrough, client testimonials, portfolio gallery, and integrated booking. 200+ projects showcased with transparent pricing for the GTA market.',
    gradient: 'from-amber-600 to-orange-500',
    url: 'https://usereno.ca',
    tech: ['WordPress', 'Custom Theme', 'SEO', 'WhatsApp Integration'],
  },
  {
    id: 2,
    title: 'Ace Barber Shop',
    category: 'web',
    description: 'Premium barbershop website with online booking via Setmore, service pricing for men/women/kids, staff profiles, and a retro-meets-modern design aesthetic. Walk-in friendly with real-time availability.',
    gradient: 'from-slate-700 to-zinc-900',
    url: 'https://acebarber.ca',
    tech: ['Custom Build', 'Setmore Booking', 'Instagram Feed', 'Responsive'],
  },
  {
    id: 3,
    title: 'All Junk & Demo Solutions',
    category: 'web',
    description: 'Junk removal & demolition service site with same-day scheduling, lowest price guarantee messaging, multiple contact methods, and service area targeting across the GTA.',
    gradient: 'from-green-600 to-emerald-500',
    url: 'https://alljunkdemo.ca',
    tech: ['Static Site', 'Google Maps', 'WhatsApp', 'Lead Gen'],
  },
  {
    id: 4,
    title: 'LPP Flooring Ltd.',
    category: 'web',
    description: 'Professional flooring company site showcasing 30+ years of combined experience. Features service cards for hardwood, laminate, vinyl, stair runners, and carpet installation with on-site quote booking.',
    gradient: 'from-yellow-700 to-amber-600',
    url: 'https://lppflooring.netlify.app',
    tech: ['Netlify', 'Modern CSS', 'Responsive', 'Contact Forms'],
  },
  {
    id: 5,
    title: 'Chess for Kids',
    category: 'app',
    description: 'Educational chess platform for children with gamified learning — 12 structured lessons, 50+ puzzles, AI opponents, and an achievement/badge system. Fantasy-themed UI with dragons and castles to captivate young learners.',
    gradient: 'from-purple-600 to-indigo-600',
    url: 'https://chess4kids.vattitude.ca',
    tech: ['Next.js', 'React', 'AI Engine', 'Gamification'],
  },
  {
    id: 6,
    title: 'Breather',
    category: 'app',
    description: 'Wellness micro-app helping users take better, healthier breaks throughout their workday. Minimal, calming interface designed for quick mindful pauses.',
    gradient: 'from-cyan-500 to-teal-500',
    url: 'https://breather.vattitude.ca',
    tech: ['React', 'Animations', 'PWA', 'Minimalist UI'],
  },
  {
    id: 7,
    title: 'PebbleSum',
    category: 'app',
    description: 'Interactive math education platform with the tagline "Learn Math the Fun Way!" — gamified arithmetic exercises designed to make learning engaging for kids.',
    gradient: 'from-rose-500 to-pink-600',
    url: 'https://pebblesum.vattitude.ca',
    tech: ['React', 'TypeScript', 'Gamification', 'Education'],
  },
]

const filters = [
  { key: 'all', label: 'All' },
  { key: 'web', label: 'Web' },
  { key: 'app', label: 'Apps' },
]

export default function Portfolio() {
  const [active, setActive] = useState('all')
  const [selected, setSelected] = useState<typeof projects[0] | null>(null)

  const filtered = active === 'all' ? projects : projects.filter((p) => p.category === active)

  return (
    <section id="portfolio" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Immersive <span className="text-cyan-400">Case Studies</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Each project is a testament to our commitment to excellence and passion for
            helping businesses thrive in the digital landscape.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center gap-2 mb-12"
        >
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                active === f.key
                  ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelected(project)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 pb-0">
                  {/* Laptop mockup frame */}
                  <div className="relative mx-auto">
                    {/* Screen bezel */}
                    <div className="rounded-t-lg border-[3px] border-slate-600 border-b-0 bg-slate-800 p-1">
                      {/* Browser chrome */}
                      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-700 rounded-t-sm">
                        <span className="w-2 h-2 rounded-full bg-red-400/70" />
                        <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
                        <span className="w-2 h-2 rounded-full bg-green-400/70" />
                        <span className="ml-2 flex-1 h-4 rounded-sm bg-slate-600 text-[9px] text-slate-400 flex items-center px-2 truncate">
                          {project.url.replace('https://', '')}
                        </span>
                      </div>
                      {/* Site preview via screenshot service */}
                      <div className="aspect-[16/10] overflow-hidden bg-white relative">
                        <img
                          src={`https://api.microlink.io/?url=${encodeURIComponent(project.url)}&screenshot=true&meta=false&embed=screenshot.url`}
                          alt={project.title}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      </div>
                    </div>
                    {/* Laptop base/hinge */}
                    <div className="h-3 bg-slate-600 rounded-b-lg mx-[-2px] relative">
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-16 h-1 bg-slate-500 rounded-b-sm" />
                    </div>
                  </div>
                  {/* Project info overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 rounded-2xl">
                    <div>
                      <h3 className="text-white font-bold text-lg">{project.title}</h3>
                      <p className="text-slate-300 text-sm mt-1">{project.category}</p>
                      <div className="flex gap-1.5 mt-2">
                        {project.tech.slice(0, 3).map((t) => (
                          <span key={t} className="px-2 py-0.5 text-[10px] rounded-full bg-white/10 text-slate-300">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <motion.div
                    className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/50 rounded-2xl transition-all"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-lg w-full rounded-3xl border border-white/10 bg-[#0f172a] p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-800 mb-6 relative">
                <img
                  src={`https://api.microlink.io/?url=${encodeURIComponent(selected.url)}&screenshot=true&meta=false&embed=screenshot.url`}
                  alt={selected.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{selected.title}</h3>
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-4">
                {selected.category}
              </span>
              <p className="text-slate-400 leading-relaxed mb-4">{selected.description}</p>
              {'tech' in selected && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {(selected as typeof projects[0]).tech.map((t) => (
                    <span key={t} className="px-3 py-1 text-xs rounded-full border border-white/10 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-3 mt-6">
                {'url' in selected && (
                  <a
                    href={(selected as typeof projects[0]).url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all"
                  >
                    Visit Site
                  </a>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-2 rounded-full border border-slate-600 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
