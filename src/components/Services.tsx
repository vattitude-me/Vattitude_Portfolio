import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const services = [
  {
    icon: '🌐',
    title: 'Web Design & Development',
    description: 'Compelling graphics and responsive, high-performance websites that bring ideas to life.',
    tech: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    icon: '📊',
    title: 'Paid Marketing',
    description: 'ROI-driven strategies across Google, Facebook, and TikTok Ads that demand attention.',
    tech: ['Google Ads', 'Meta Ads', 'TikTok', 'Analytics'],
  },
  {
    icon: '🚀',
    title: 'Creative Strategies',
    description: 'Data-driven SEO, Social Media Management, and Content Writing to stand out.',
    tech: ['SEO', 'Content', 'Social Media', 'Strategy'],
  },
  {
    icon: '✨',
    title: 'Graphic Design & Branding',
    description: 'Consistent brands that resonate through Logos, Brand Decks, and Visual Content.',
    tech: ['Logo Design', 'Brand Decks', 'Visual ID', 'Guidelines'],
  },
  {
    icon: '🛒',
    title: 'E-Commerce Solutions',
    description: 'Robust platforms that drive sales and provide seamless shopping experiences.',
    tech: ['Shopify', 'WooCommerce', 'Stripe', 'Custom'],
  },
  {
    icon: '🎯',
    title: 'Lead Generation',
    description: 'Targeted campaigns to capture high-quality leads and convert them into loyal customers.',
    tech: ['Funnels', 'CRM', 'Automation', 'Nurture'],
  },
]

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 })

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const reset = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Services() {
  return (
    <section id="services" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The <span className="text-cyan-400">Capabilities</span> Matrix
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A full suite of digital solutions to help your business thrive online.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <TiltCard className="h-full p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm group hover:border-cyan-500/30 transition-colors cursor-default">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 text-xs rounded-full border border-white/10 text-slate-400 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-all"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
