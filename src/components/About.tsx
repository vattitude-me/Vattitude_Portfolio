import { motion } from 'framer-motion'

const stats = [
  { value: '25+', label: 'Projects Completed' },
  { value: '19+', label: 'Years Experience' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '15+', label: 'Happy Clients' },
]

const details = [
  { label: 'Established', value: '2021' },
  { label: 'Location', value: 'Toronto, Canada' },
  { label: 'Email', value: 'info.vattitude@gmail.com' },
  { label: 'Phone', value: '+1 (437) 990-8118' },
  { label: 'Projects', value: '25+ Completed' },
  { label: 'Status', value: 'Available for Hire' },
]

export default function About() {
  return (
    <section id="about" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The <span className="text-cyan-400">Architects</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A dedicated team of developers and designers with a passion for creating
            beautiful, functional, and user-friendly digital products that stand out.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-8 md:p-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-sm text-slate-500 font-mono">vattitude@terminal ~ </span>
          </div>

          <div className="font-mono text-sm space-y-3">
            <div className="text-green-400">$ cat profile.json</div>
            <div className="text-slate-300 pl-4">
              {'{'}
              {details.map((d) => (
                <div key={d.label} className="pl-4">
                  <span className="text-cyan-400">"{d.label}"</span>
                  <span className="text-white">: </span>
                  <span className="text-amber-300">"{d.value}"</span>,
                </div>
              ))}
              {'}'}
            </div>
            <div className="text-green-400 mt-4">$ cat mission.txt</div>
            <div className="text-slate-400 pl-4 leading-relaxed">
              With 19+ years in the industry, we've delivered 25+ projects ranging from
              local business sites to interactive educational apps. Our mission is to help
              businesses grow by building digital products that stand out from the
              competition and deliver measurable results.
            </div>
            <div className="text-green-400 animate-pulse">▊</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
